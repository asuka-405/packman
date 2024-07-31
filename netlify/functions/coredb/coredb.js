import dotenv from "dotenv"
if (process.env.NODE_ENV === "development") dotenv.config()

import { MongoClient, ServerApiVersion } from "mongodb"

const uri =
  "mongodb+srv://" +
  process.env.ATLAS_UNAME +
  ":" +
  process.env.ATLAS_PASSWD +
  "@cluster0.c0p6hl1.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
})

export const handler = async (event) => {
  await client.connect()
  const remoteDB = client.db("packman-repo").collection("packages")

  let core = await remoteDB.findOne({ name: "core.db" }).catch((err) => {
    console.error(err)
  })
  if (core) core = core.file
  else core = undefined
  return {
    statusCode: 200,
    body: JSON.stringify(core),
  }
}
