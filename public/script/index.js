import { DBArchiveItemTemplate, LOADER } from "./constants.js"
import getCoreDB from "./coredb.js"
import Router from "./router.js"
import CustomSpacer from "./spacer.js"
import initializeSearch from "./tasks/search.js"
import { initializeSidebar } from "./tasks/sidebar.js"

document.addEventListener("DOMContentLoaded", async () => {
  await loadCoreDB()
  window.router = new Router({ defaultPage: "home", loader: LOADER })
  window.addEventListener("scroll", updateScrollProgress)
  window.router.bindCallback("*", handleHighlightedImages)
  window.router.bindCallback("*", toggleScrollProgress)
  window.router.bindCallback("search", initializeSearch)
  window.router.bindCallback("core", loadCoreDBArchive)
  window.router.bindCallback("login", () => {
    try {
      netlifyIdentity.init({
        container: "#netlify-modal",
        locale: "en",
      })
    } catch (e) {
      console.error("Netlify Identity is not loaded.", e)
    }
    netlifyIdentity.on("login", () => {
      netlifyIdentity.close()
      successPage("You have successfully logged in.")
    })
    netlifyIdentity.on("logout", () => {
      netlifyIdentity.close()
      successPage("You have successfully logged out.")
    })
    netlifyIdentity.on("error", (error) => {
      netlifyIdentity.close()
      failedPage(error)
    })
    netlifyIdentity.open()
  })

  window.router.bindCallback("add", () => {
    const form = document.querySelector(".form")
    if (!form) window.location.reload()

    form.addEventListener("submit", function (event) {
      event.preventDefault()

      const name = form.querySelector('input[name="name"]').value.trim()
      const repo = form.querySelector('input[name="repo"]').value.trim()
      const description = form
        .querySelector('input[name="description"]')
        .value.trim()
      const author = form.querySelector('input[name="author"]').value.trim()
      const dist = form.querySelector('input[name="dist"]').value.trim()
      const keywords = form.querySelector('input[name="keywords"]').value.trim()

      let valid = true
      let errorMessage = ""

      // Check for empty fields
      if (!name || !repo || !description || !author || !dist || !keywords) {
        valid = false
        errorMessage += "All fields are required.\n"
      }

      // Validate URL (basic check)
      const urlPattern =
        /^(https?:\/\/)?([\w\d-]+\.)+[a-z]{2,6}([\/\w\d-]*)*\/?$/i
      if (repo && !urlPattern.test(repo)) {
        valid = false
        errorMessage += "Please enter a valid GitHub repository URL.\n"
      }

      // Validate keywords
      const keywordsArray = keywords.split(",").map((keyword) => keyword.trim())
      if (keywordsArray.length < 1) {
        valid = false
        errorMessage += "Please enter at least one keyword.\n"
      }

      // Show error message if validation fails
      if (!valid) {
        alert(errorMessage)
        return // Stop the form submission
      }

      // If validation passes, submit the form data to Netlify Function
      const formData = {
        name,
        repo,
        description,
        author,
        dist,
        keywords,
      }

      console.log(formData)

      fetch("/.netlify/functions/register-pkg", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) =>
          data.message ? successPage(data.message) : failedPage(data.error)
        )
        .catch((error) => failedPage(error))
    })
    loadCoreDB(true)
  })

  initializeSidebar()
})

async function loadCoreDBArchive() {
  await loadCoreDB()
  const coreDBArchive = window.coreDB
  const archiveList = document.querySelector(".archive-list")
  if (!archiveList) window.location.reload()
  archiveList.innerHTML = ""
  coreDBArchive.forEach((item) => {
    archiveList.innerHTML += DBArchiveItemTemplate(item)
  })
}

async function loadCoreDB(force) {
  if (force) window.coreDB = undefined
  else if (
    localStorage.getItem("coreDB") &&
    localStorage.getItem("lastUpdated")
  ) {
    const lastUpdated = localStorage.getItem("lastUpdated")
    const currentTime = new Date().getTime()
    const timeDifference = currentTime - lastUpdated
    if (timeDifference > 21600000) window.coreDB = null
    else window.coreDB = JSON.parse(localStorage.getItem("coreDB"))
  }
  if (!window.coreDB)
    await getCoreDB().then((coreDB) => {
      localStorage.setItem("coreDB", JSON.stringify(coreDB))
      localStorage.setItem("lastUpdated", new Date().getTime())
      window.coreDB = coreDB
    })
}

function toggleScrollProgress() {
  const scrollProgressBar = document.getElementById("progress")
  if (!scrollProgressBar) return
  scrollProgressBar.style.display = "block"
}

function updateScrollProgress() {
  const scrollProgressBar = document.getElementById("progress")
  if (!scrollProgressBar) return
  const scrollPosition = window.scrollY
  const windowHeight = window.innerHeight
  const documentHeight = document.documentElement.scrollHeight

  const scrollPercentage =
    (scrollPosition / (documentHeight - windowHeight)) * 100
  scrollProgressBar.style.width = `${scrollPercentage}%`
}

function handleHighlightedImages() {
  const images = document.querySelectorAll(".highlighted-image")
  images.forEach((image) => {
    image.addEventListener("click", () => {
      image.classList.toggle("highlighted-content")
    })
  })
}

function successPage(message) {
  showMessagePage("/success", "Success", message)
}

function failedPage(message) {
  showMessagePage("/failed", "Failed", message)
}

function showMessagePage(path, heading, message) {
  history.pushState({}, "")
  const main = document.querySelector("#main")
  main.innerHTML = `
      <section>
        <h1 class="page-title
        ">${heading || "FYI"}</h1>
        <blockquote class="blockquote">
          <p>
            ${message || "This page is under construction."}
          </p>
        </blockquote>
      </section>
  `
}

customElements.define("custom-spacer", CustomSpacer)
