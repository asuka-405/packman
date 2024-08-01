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
      netlifyIdentity.open()
    } catch (e) {
      window.location.reload()
    }
  })

  window.router.bindCallback("add", () => {
    const form = document.querySelector(".form")

    form.addEventListener("submit", function (event) {
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
        event.preventDefault() // Prevent form submission
      }
    })
  })

  initializeSidebar()
})

async function loadCoreDBArchive() {
  await loadCoreDB()
  const coreDBArchive = window.coreDB
  const archiveList = document.querySelector(".archive-list")
  archiveList.innerHTML = ""
  coreDBArchive.forEach((item) => {
    archiveList.innerHTML += DBArchiveItemTemplate(item)
  })
}

async function loadCoreDB() {
  if (localStorage.getItem("coreDB") && localStorage.getItem("lastUpdated")) {
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

customElements.define("custom-spacer", CustomSpacer)
