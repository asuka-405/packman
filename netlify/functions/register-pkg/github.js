export default class GithubHelper {
  owner
  repo
  requestHeaders
  baseUrl = "https://api.github.com/repos"
  eventLog = []
  latestCommitSha = ""
  queryResult = {}

  constructor(owner, repo, token) {
    this.owner = owner
    this.repo = repo
    this.baseUrl = `${this.baseUrl}/${this.owner}/${this.repo}/contents`

    token
      ? (this.requestHeaders = {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${token}`,
          // "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        })
      : (this.requestHeaders = {
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json",
        })
  }

  clearResult() {
    this.queryResult = {}
  }

  async ghRequest(url, method, body) {
    const response = await fetch(url, {
      method: method,
      headers: this.requestHeaders,
      body: body ? JSON.stringify(body) : null,
    })
    return response
  }

  async getSHA(path) {
    let url = `https://api.github.com/repos/${this.owner}/${this.repo}/commits`
    if (path) url += `?path=${path}`
    const method = "GET"
    await this.ghRequest(url, method)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        this.latestCommitSha = data[0]["sha"]
        this.eventLog.push(`Got SHA for ${path}`)
        this.queryResult = data
      })
      .catch((err) => {
        this.eventLog.push(`Error getting SHA for ${path}\n${err}`)
        this.clearResult()
      })
  }

  async createFile(path, content) {
    const url = `${this.baseUrl}/${path}`
    const method = "PUT"
    await this.getSHA(path)
    const body = {
      message: `Create ${path}`,
      content: btoa(content),
      sha: this.latestCommitSha,
    }
    await this.ghRequest(url, method, body)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        this.queryResult = data
        this.eventLog.push(`Created file: ${path}`)
        return data
      })
      .catch((err) => {
        this.eventLog.push(`Error creating file: ${path}\n${err}`)
        this.clearResult()
      })
    return this
  }

  async updateFile(path, content) {
    const url = `${this.baseUrl}/${path}`
    const method = "PATCH"
    await this.getSHA(path)
    const body = {
      message: `Update ${path}`,
      content: btoa(content),
      sha: this.latestCommitSha,
    }
    await this.ghRequest(url, method, body)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        this.queryResult = data
        this.eventLog.push(`Updated file: ${path}`)
        return data
      })
      .catch((err) => {
        this.eventLog.push(`Error updating file: ${path}\n${err}`)
        this.clearResult()
      })
    return this
  }

  async getFile(path) {
    const url = `${this.baseUrl}/${path}`
    const method = "GET"
    await this.ghRequest(url, method)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        return atob(data.content)
      })
      .then((content) => {
        this.queryResult = content
        this.eventLog.push(`Got file: ${path}`)
      })
      .catch((err) => {
        this.eventLog.push(`Error getting file: ${path}\n${err}`)
        this.clearResult()
      })
  }
}
