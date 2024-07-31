/**
 * @description This file deals with the sidebar and the main sections that gets
 * effected because of the movement of the sidebar.
 */

const sidebar = document.querySelector(".sidebar")
const toggleBtn = document.querySelector(".sidebar__toggle")
const sidebarTitle = document.querySelector(".sidebar-title")
const sidebarHeadLogo = document.querySelector(".sidebar-head-logo")
const commons = document.querySelectorAll(".common")
const items = sidebar.querySelectorAll(".sidebar-actions__item")
const searchbox = document.querySelector(".searchbox")
const sidebarSocials = document.querySelector(".sidebar > social-links")

const sidebarToggleIconPath = {
  open: "/asset/svg/open.svg",
  close: "/asset/svg/close.svg",
}

/**
 * @description This function does misc actions to setup sidebar:
 *                1. Set tabindex for links on sidebar (sidebar actions)
 *                2. Set event listener for sidebar toggle button
 *                3. Since sidebar is fullscreen on mobile, it auto closes on load

 */
export function initializeSidebar() {
  sidebar.querySelectorAll(".sidebar-actions > *").forEach((action) => {
    action.setAttribute("tabindex", "0")
  })

  toggleBtn.addEventListener("click", toggleSidebar)
  autoCloseIfMobile()
}

// To adjust main section elements when sidebar is toggled
function adjustStaticElements(marginLeft) {
  if (window.innerWidth < 770) return
  if (searchbox)
    searchbox.style.left = (parseInt(marginLeft) + 2).toString() + "rem"
  commons.forEach((common) => {
    common.style.marginLeft = marginLeft
  })
}

function toggleSidebar() {
  if (sidebar.classList.contains("collapse")) {
    toggleBtn.querySelector(".icon").src = sidebarToggleIconPath.close
    sidebarTitle.style.transitionDelay = "0.3s"
    sidebarHeadLogo.style.transitionDelay = "0.3s"
    sidebarSocials.style.display = "block"
    adjustStaticElements("15rem")
  } else {
    toggleBtn.querySelector(".icon").src = sidebarToggleIconPath.open
    sidebarTitle.style.transitionDelay = "0s"
    sidebarHeadLogo.style.transitionDelay = "0s"
    sidebarSocials.style.display = "none"
    adjustStaticElements("5rem")
  }
  sidebar.classList.toggle("collapse")
}

function autoCloseIfMobile() {
  if (window.innerWidth < 771) {
    items.forEach((item) => {
      item.addEventListener("click", () => {
        toggleSidebar()
      })
    })
  }
}

toggleSidebar()

document.querySelectorAll(".sidebar-actions__item .icon").forEach((icon) => {
  icon.addEventListener("click", (e) => {
    e.target.nextElementSibling.click()
  })
})
