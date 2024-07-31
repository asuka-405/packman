export function dbFileToPackageList(dbFile) {
  const packages = []
  for (const line of packages.split("\n"))
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
}

export function appendPackageToDbFile(dbFile, pkgObj) {
  dbFile += `${pkg.name};;${pkg.description};;${pkg.author};;${pkg.repo};;${pkg.dist};;${pkg.keywords}\n`
}

export function searchDbFile(packageList, pkgName) {
  return packageList.filter((pkg) => {
    return pkg.name.includes(query)
  })
}

export function packageListToDbFile(packageList) {
  let dbFile = ""
  packageList.forEach((pkg) => {
    dbFile += `${pkg.name};;${pkg.description};;${pkg.author};;${pkg.repo};;${pkg.dist};;${pkg.keywords}\n`
  })
  return dbFile
}
