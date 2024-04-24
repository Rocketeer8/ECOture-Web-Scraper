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
  const name = await scraper.scrapeName(url)
  const materials = await scraper.scrapeMaterials(url)
  const image = await scraper.scrapeImage(url)
  res.json({name, materials, image})
})

app.listen(5000)