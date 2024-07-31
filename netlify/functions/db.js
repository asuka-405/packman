export default class DB {
  packages = []
  constructor(packages) {
    this.db = packages
    if (!packages) return
    for (const line of packages.split("\n"))
      if (line === "") continue
      else {
        const [name, description, author, repo, dist, keywords] =
          line.split(";;")
        this.packages.push({
          name,
          description: description || "No description provided",
          author: author || "No author provided",
          repo: repo || "No repo provided",
          dist: dist || "No dist provided",
          keywords: keywords || "No keywords provided",
        })
      }
  }

  append(pkg) {
    this.packages.push(pkg)
    this.db += `${pkg.name};;${pkg.description};;${pkg.author};;${pkg.repo};;${pkg.dist};;${pkg.keywords}\n`
  }

  search(query) {
    return this.packages.filter((pkg) => {
      return pkg.name.includes(query)
    })
  }

  getDBFile() {
    let dbFile = ""
    this.packages.forEach((pkg) => {
      console.log(pkg)
      dbFile += `${pkg.name};;${pkg.description};;${pkg.author};;${pkg.repo};;${pkg.dist};;${pkg.keywords}\n`
    })
    return dbFile
  }
}
