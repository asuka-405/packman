import { createWriteStream } from "fs"
import { SitemapStream, streamToPromise } from "sitemap"
// Define your site's base URL
const baseUrl = "https://packman.ksuryansh.xyz"

// List of routes for your frontend-only site
const routes = ["/", "/search", "/core", "/add", "/download", "/home", "/login"]

// Create a stream to write to sitemap.xml
const sitemapStream = new SitemapStream({ hostname: baseUrl })
const writeStream = createWriteStream("./sitemap.xml")

// Pipe the stream to write to the sitemap file
sitemapStream.pipe(writeStream)

// Add each route to the sitemap
routes.forEach((route) => {
  sitemapStream.write({ url: route, changefreq: "weekly", priority: 0.8 })
})

// End the stream
sitemapStream.end()

// Convert stream to a promise and handle completion
streamToPromise(sitemapStream)
  .then(() => {
    console.log("Sitemap generated successfully!")
  })
  .catch((err) => {
    console.error("Error generating sitemap:", err)
  })
