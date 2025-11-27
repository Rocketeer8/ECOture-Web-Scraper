const scraper = require("./scraper")
var express = require("express")
var cors = require('cors')

var app = express()

app.use(cors())
app.use(express.json());       // support parsing of incoming JSON data
app.use(express.urlencoded({     // to support URL-encoded data such as form data
  extended: false
}));

app.get('/scrape', async function (req, res) {
  const url = req.query["url"]
  console.log(`[scrape] incoming url=${url}`)
  try {
    const { name, materials, image } = await scraper.scrapeProduct(url)
    console.log(`[scrape] success url=${url}`)
    res.json({name, materials, image})
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Failed to scrape product', details: err.message })
  }
})

app.listen(5000)
