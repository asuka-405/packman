// note - this function MUST be named `identity-signup` to work
// we do not yet offer local emulation of this functionality in Netlify Dev
//
// more:
// https://www.netlify.com/blog/2019/02/21/the-role-of-roles-and-how-to-set-them-in-netlify-identity/
// https://docs.netlify.com/functions/functions-and-identity/

const formidable = require("formidable")
const util = require("util")

const handler = async function (event, context) {
  if (!!context.clientContext || !context.clientContext.user)
    return {
      statusCode: 401,
      body: JSON.stringify({
        message: "Unauthorized: You must be logged in to upload files.",
      }),
    }

  const form = formidable.IncomingForm()
  form.uploadDir = "/tmp"
  form.keepExtensions = true
  const parseForm = util.promisify(form.parse)

  try {
    const { fields, files } = await parseForm(event)

    // Access the uploaded file
    const file = files.file

    // Read the file content
    const fileContent = fs.readFileSync(file.path, "utf-8")

    // Do something with the fileContent, like save to a database, or return to the client
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "File uploaded successfully!",
        content: fileContent,
      }),
    }
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "File upload failed.",
        error: err.message,
      }),
    }
  }
}

module.exports = { handler }
