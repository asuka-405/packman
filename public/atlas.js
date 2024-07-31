async function getCoreDB() {
  return await fetch("/.netlify/functions/coredb", {
    method: "GET",
  })
    .then((response) => {
      return response.body
    })
    .then((stream) => {
      return streamToString(stream)
    })
    .catch((err) => {
      console.error(err)
    })
}

getCoreDB().then(async (data) => {
  console.log(JSON.parse(data))
})

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
