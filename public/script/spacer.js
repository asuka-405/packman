export default class CustomSpacer extends HTMLElement {
  constructor() {
    super()
    // Attach a shadow root to the element
    this.attachShadow({ mode: "open" })

    // Create a span to serve as the spacer
    const spacer = document.createElement("div")
    spacer.textContent = " "

    // Apply styles to the span element
    const style = document.createElement("style")
    style.textContent = `
      div {
        width: var(--spacer-width, 100vw);
        height: var(--spacer-height, 0);
      }
    `

    // Append style and spacer to the shadow root
    this.shadowRoot.append(style, spacer)
  }

  connectedCallback() {
    // Read the data-space attribute and set CSS variables
    const space = this.getAttribute("data-space") || "1em"
    this.shadowRoot
      .querySelector("div")
      .style.setProperty("--spacer-height", space)
  }
}
