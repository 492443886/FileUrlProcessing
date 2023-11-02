const { promisify } = require("util")
const axios = require("axios")
const express = require("express")
const cors = require("cors")
const fs = require("fs")
const readFile = promisify(fs.readFile)

const app = express()
app.use(cors())
app.use(express.json())
const port = 3090
const baseUrl = "/fileUrl"

// Define a route that responds with "Hello, World!" when you visit http://localhost:3000/
app.get(baseUrl + "/t", (req, res) => {
  res.send("Hello, World!")
})

app.get(baseUrl + "/sample", async (req, res) => {
  try {
    const filePath = "sample.png"
    const data = await readFile(filePath)
    const base64 = data.toString("base64")
    console.log("data", data)
    console.log("base64", base64)

    const json = {
      name: "sample.png",
      base64: base64,
    }
    res.send(json).status(200)
  } catch (err) {
    console.error("Error reading file:", err)
  }
})

async function getImageAndConvertToBase64(url) {
  try {
    const response = await axios.get(url, { responseType: "arraybuffer" })
    console.log("r.d", response.data)
    if (response.status === 200) {
      const imageBuffer = Buffer.from(response.data, "binary")
      const base64Image = imageBuffer.toString("base64")

      return base64Image
    } else {
      console.error(`Failed to fetch image from URL: ${url}`)
      return null
    }
  } catch (error) {
    console.error("Error:", error)
    return null
  }
}

app.post(baseUrl + "/base64", async (req, res) => {
  try {
    const base64 = await getImageAndConvertToBase64(req.body.url)
    const json = {
      url: req.body.url,
      base64: base64,
    }
    res.send(json).status(200)
  } catch (err) {
    console.error("Error reading file:", err)
  }
})

app.post(baseUrl + "/binary", async (req, res) => {
  try {
    const response = await axios.get(req.body.url, { responseType: "arraybuffer" })
    const json = {
      url: req.body.url,
      binary: response.data,
    }
    res.send(json).status(200)
  } catch (err) {
    console.error("Error reading file:", err)
  }
})

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
