export default async function getCoreDB() {
  return await fetch("/.netlify/functions/coredb", {
    method: "GET",
  })
    .then((response) => {
      return response.body
    })
    .then((stream) => {
      return streamToString(stream)
    })
    .then((data) => JSON.parse(data))
    .then((data) => {
      return data
    })
    .then((dbFile) => {
      return dbFileToPackageList(dbFile)
    })
    .catch((err) => {
      console.error(err)
    })
}

function dbFileToPackageList(dbFile) {
  const packages = []
  for (const line of dbFile.split("\n"))
    if (line === "") continue
    else {
      const [name, description, author, repo, dist, keywords] = line.split(";;")
      packages.push({
        name,
        description: description || "No description provided",
        author: author || "No author provided",
        repo: repo || "No repo provided",
        dist: dist || "No dist provided",
        keywords: keywords || "No keywords provided",
      })
    }
  return packages
}

async function streamToString(stream) {
  const reader = stream.getReader()
  const decoder = new TextDecoder()
  let result = ""

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    result += decoder.decode(value, { stream: true })
  }

  result += decoder.decode() // Flush any remaining data
  return result
}
