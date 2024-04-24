import axios from "axios"
import * as cheerio from 'cheerio';
//import rp from "request-promise";

let obj = {
  "materials" : new Map(),
  "score": 0.0
}

export {obj};

// URL of the website to scrape
//const url = 'https://www2.hm.com/en_ca/productpage.0993840013.html';

const keywords = ['Cotton', 'Polyester', 'Linen', 'Viscose', 'Wool'];
const config = {
  header: {
    "Access-Control-Allow-Origin" : "*"
  },
};

export const scrapeName =  async (url) => {
  try {
    console.log(url);
      // Fetch HTML of the page we want to scrape
      let data = await axios.get(url,config);
      console.log(data)
      // Load HTML we fetched in the previous line
      let $ = cheerio.load(data);
      let name = $('h1').text();
      console.log(name);
    } catch (err) {
      console.error(err);
    }
}

export const scrapeMaterials = async (url) => {
    try {
        // Fetch HTML of the page we want to scrape
        let data = await axios.get(url=url,config=config);
        // Load HTML we fetched in the previous line
        const $ = cheerio.load(data);
        // Select all the list items in plainlist class
        const materialElements = $('dd');
        // Stores data for all countries
        let materials = new Map();
        // Use .each method to loop through the li we selected
        materialElements.each((index, element) => {
            // Object holding data for each country/jurisdiction
            let text = $(element).text();
            keywords.forEach((keyword) => {
                if (text.includes(keyword)) {
                  // Extract percentage of material
                    let percent = "";
                    const index = text.lastIndexOf(keyword);
                    if (index !== -1) {
                      percent = text.substring(index+keyword.length+1, index+keyword.length+4).replace("%", "");
                    }
                    if (percent !== "") {
                      // Populate materials array with material data
                      materials.set(keyword, percent);
                    }
                }
            });
        });
        // Logs materials array to the console
        console.dir(materials);

        let materialObj = Object.fromEntries(materials);
        let materialSimp = {};
        let percent = 0;

        for (const key in materialObj) {
          percent = percent + parseInt(materialObj[key]);
          if (percent <= 100) {
            materialSimp[key] = materialObj[key]
          }
        }
        /*rp({
          url: 'http://localhost:5000/todos',
          method: "GET",
          body: materialSimp,
          json: true,
        }).then(function (parsedBody) {
          console.log("The score is: " + parsedBody);
          obj.parsedBody = parsedBody
          // POST succeeded...
      })*/
    } catch (err) {
      console.error(err);
    }
}

export const scrapeImage = async (url) => {
    try {
        let data = await axios.get(url=url,config=config);
        const $ = cheerio.load(data);
        let imageUrl = "";
          const imageElements = $('img');
          imageElements.each((index, element) => {
            let imageSrc = $(element).attr('src');
            if (imageSrc.includes('hm.com')) {
              imageUrl = imageSrc;
            }
          });
          //downloadImage(imageUrl, "test");
          
    } catch (err) {
      console.error(err);
    }
}