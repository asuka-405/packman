export function dbFileToPackageList(dbFile) {
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

export function appendPackageToDbFile(dbFile, pkgObj) {
  dbFile += `${pkgObj.name};;${pkgObj.description};;${pkgObj.author};;${pkgObj.repo};;${pkgObj.dist};;${pkgObj.keywords}\n`
  return dbFile
}

export function searchPackageList(packageList, pkgName) {
  console.log(packageList, pkgName)

  return packageList.filter((pkg) => {
    return pkg.name.includes(pkgName)
  })
}

export function packageListToDbFile(packageList) {
  let dbFile = ""
  packageList.forEach((pkg) => {
    dbFile += `${pkg.name};;${pkg.description};;${pkg.author};;${pkg.repo};;${pkg.dist};;${pkg.keywords}\n`
  })
  return dbFile
}
