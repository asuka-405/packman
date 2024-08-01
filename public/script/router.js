export default class Router {
  #root
  #default
  #contentHolderID
  #renderCallbacks = []
  #loader
  #navigating = false // Flag to prevent multiple navigations

  constructor(config = {}) {
    this.#root = config.pagesDirectory || "page"
    this.#default = config.defaultPage || "home"
    this.#contentHolderID = config.contentHolderID || "main"
    this.#loader = config.loader || "<h1>Loading...</h1>"

    if (!document.getElementById(this.#contentHolderID)) {
      alert(
        `SITE CRASH!!!!\nElement with ID ${this.#contentHolderID} not found`
      )
      return
    }

    window.addEventListener("popstate", () => this.handleRoute())
    document.body.addEventListener("click", (e) => this.handleLinkClick(e))
    this.handleRoute()
  }

  async handleRoute() {
    if (this.#navigating) return // Prevent handling if already navigating
    this.#navigating = true
    try {
      const path = window.location.pathname
      const page = path === "/" ? this.#default : path.slice(1) // Remove leading slash
      this.renderContent(this.#loader)
      const content = await this.fetchRoute(`/${this.#root}/${page}.htm`)
      this.renderContent(content)
    } finally {
      this.#navigating = false
    }
  }

  async fetchRoute(route) {
    console.log(route)
    try {
      let res = await fetch(route)
      if (!res.ok) res = await fetch(`/${this.#root}/404.htm`)
      if (!res.ok) return "<h1>Page not found</h1>"
      return res.text()
    } catch (e) {
      return `<h1>Unable to load page - ${route}</h1> <p>${e}</p>`
    }
  }

  renderContent(html) {
    document.getElementById(this.#contentHolderID).innerHTML = html
    this.#renderCallbacks.forEach((callback) => {
      const path = window.location.pathname
      const page = path.slice(1) // Remove leading slash

      if (!page) this.navigateTo(`/`)
      if (
        !path.includes(callback.path) &&
        callback.path !== "*" &&
        !page.includes(callback.path)
      )
        return
      callback.callback(...callback.args)
    })
  }

  navigateTo(path) {
    // Prevent navigation if already in the process of navigating
    if (this.#navigating) return
    const newUrl = `${path}`
    history.pushState(null, null, newUrl)
    this.handleRoute()
  }

  handleLinkClick(event) {
    if (!event.target.matches("[data-link]")) return
    event.preventDefault()
    this.navigateTo(new URL(event.target.href).pathname)
  }

  getContentHolderID() {
    return this.#contentHolderID
  }

  bindCallback(path, callback, ...args) {
    this.#renderCallbacks.push({ path, callback, args })
  }
}
