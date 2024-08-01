import { LOADER } from "./constants.js"
import getCoreDB from "./coredb.js"
import Router from "./router.js"
import initializeSearch from "./tasks/search.js"
import { initializeSidebar } from "./tasks/sidebar.js"

document.addEventListener("DOMContentLoaded", async () => {
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
  window.router = new Router({ defaultPage: "search", loader: LOADER })
  window.addEventListener("scroll", updateScrollProgress)
  window.router.bindCallback("*", handleHighlightedImages)
  window.router.bindCallback("*", toggleScrollProgress)
  window.router.bindCallback("search", initializeSearch)
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
  initializeSidebar()
})

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
