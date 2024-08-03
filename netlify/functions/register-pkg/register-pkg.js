import dotenv from "dotenv"
import { MongoClient, ServerApiVersion } from "mongodb"
import {
  appendPackageToDbFile,
  dbFileToPackageList,
  packageListToDbFile,
  searchPackageList,
} from "../db.js"
if (process.env.NODE_ENV === "development") dotenv.config()

const URL = `mongodb+srv://${process.env.ATLAS_UNAME}:${process.env.ATLAS_PASSWD}@cluster0.c0p6hl1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`

const client = new MongoClient(URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export const handler = async (event, context) => {
  const rawNetlifyContext = context.clientContext.custom.netlify
  const netlifyContext = Buffer.from(rawNetlifyContext, "base64").toString(
    "utf-8"
  )
  const { identity, user } = JSON.parse(netlifyContext)

  if (!user) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Unauthorized: User not logged in" }),
    }
  }

  if (event.httpMethod !== "POST")
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }),
    }
  const params = new URLSearchParams(event.body)
  const requiredFields = [
    "name",
    "repo",
    "description",
    "author",
    "dist",
    "keywords",
  ]
  const missingFields = requiredFields.filter((field) => !params.has(field))
  if (missingFields.length)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Missing required fields: ${missingFields.join(", ")}`,
      }),
    }

  await client.connect()
  const remoteDB = client.db("packman-repo").collection("packages")

  let core = await remoteDB.findOne({ name: "core.db" })
  if (core) core = core.file
  else core = undefined

  const packageList = dbFileToPackageList(core)
  const packageName = params.get("name")
  const isInDB = searchPackageList(packageList, packageName).length
    ? true
    : false

  if (isInDB)
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: `Package ${packageName} already exists in the database`,
      }),
    }

  core = appendPackageToDbFile(core, {
    name: params.get("name"),
    repo: params.get("repo"),
    description: params.get("description"),
    author: params.get("author"),
    dist: params.get("dist"),
    keywords: params.get("keywords"),
  })

  await remoteDB.updateOne(
    { name: "core.db" },
    { $set: { file: core } },
    { upsert: true }
  )

  return {
    statusCode: 200,
    body: JSON.stringify({
      message: `Package ${packageName} registered successfully`,
      core,
    }),
  }
}
