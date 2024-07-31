import Fuse from "https://cdn.jsdelivr.net/npm/fuse.js@6.6.2/dist/fuse.esm.js"

export default async function initializeSearch() {
  try {
    // Map to extract search index
    const searchIndex = window.coreDB

    // Configure Fuse.js options
    const options = {
      keys: [
        "name",
        // "repo",
        // "description",
        "author",
        // "dist",
        "keywords",
      ],
      threshold: 0.4,
      shouldSort: true,
    }

    // Initialize Fuse.js instance
    const fuse = new Fuse(searchIndex, options)
    const resultsContainer = document.getElementById("search-results")

    const resultNode = document.createElement("li")
    const anchor = document.createElement("a")
    anchor.dataset.link = ""
    resultNode.appendChild(anchor)

    // Add event listener to search input
    document.getElementById("search").addEventListener("input", (event) => {
      const query = event.target.value
      if (!query) return
      console.log("Searching for:", query)
      const results = fuse.search(query)
      resultsContainer.innerHTML = ""
      if (!results.length) {
        const node = resultNode.cloneNode(true)
        node.querySelector("a").textContent = "No results found"
        resultsContainer.appendChild(node)
        return
      }
      results.forEach((result) => {
        const node = resultNode.cloneNode(true)
        const link = node.querySelector("a")
        link.classList.add("link")
        link.href = result.item.repo
        link.textContent = result.item.name
        resultsContainer.appendChild(node)
      })
    })
  } catch (error) {
    console.error("Error initializing search:", error)
  }
}
