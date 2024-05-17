const axios = require("axios")
const cheerio = require("cheerio")
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Danny:kuGQ8J04owk8XidB@cluster0.yhcwz4g.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri);

// const keywords = ['Cotton', 'Polyester', 'Linen', 'Viscose', 'Wool']; // Clothing materials to extract for H&M 
const keywords = ['cotton', 'polyester', 'linen', 'viscose', 'wool']; // Clothing materials to extract for Old Navy 
const config = {
  header: {
    "Access-Control-Allow-Origin": "*"
  },
};
const scrapeName = async (url) => {
  try {
    // Fetch HTML of the page we want to scrape
    let {data} = await axios.get(url, config);
    // Load HTML fetched in the previous line
    let $ = cheerio.load(data);
    // Select all the list items in the h1 class
    let name = $('h1').text();
    return name;
  } catch (err) {
    console.error(err);
  }
}
const scrapeMaterials = async (url) => {
  try {
    let {data} = await axios.get(url, config);
    // without xml :ture returned html would be incomplete
    const $ = cheerio.load(data, {
      xml: true,
    });
    //const materialElements = $('button[data-test-toggle="true"][aria-expanded="false"] + div div div ul li span');
    const materialElements = $("button:contains('Materials & Care') + div div ul li span");
    // const materialElements = $("button:contains('Materials & Care') + div div div ul li:first-child span");
    // const materialElements = $('h3 + ul li p'); // for H & M
    //const materialElements = $('h3')
    // Stores data for all materials
    let materials = new Map();
    let totalPercentage = 0;
    materialElements.each((index, element) => {
      let text = $(element).text();
      // split the bullet point based on comma
      const sentenceParts = text.split(',').map(item => item.trim());

      sentenceParts.forEach((part) => {
          // Extract percentage of material and name of the material
          // the following regex capture group before the percentage sign, 
          // then capture everything after one or more whitespaces after the percentage sign, 
          // capture groups is denoted by ()
          const regex = /(\d+)%\s*(.*)/;
          // Use the test() method with the regular expression to check if the string contains a percentage
          if (regex.test(part)) {
            const match = part.match(regex);
            // Extracted percentage value
            const currentPercentage = parseInt(match[1]);
            // Extracted material name
            const materialName = match[2].toUpperCase();

            if (!materials.has(materialName)) {
              materials.set(materialName, currentPercentage);
            }
          }
      });
    });
    console.log("All materials: " + JSON.stringify(Object.fromEntries(materials)))

    let materialObj = Object.fromEntries(materials);
    // materialSimp is to determine the known material % and unknwon percentage
    let materialSimp = {};

    for (const key in materialObj) {
    // total percentage of materialSimp can't go over 100, 
      if (totalPercentage + materialObj[key] <= 100) {
        materialSimp[key] = materialObj[key]
        totalPercentage = totalPercentage + materialObj[key];
      } else {
        break;
      }
    }

    // if total material composition is not 100%, set the remaining percentage to unknwon 
    if (totalPercentage < 100) {
      materialSimp["UNKNOWN"] = 100 - totalPercentage
    }

    let score = 0;
    async function run() {
      try {
        // open connection to mongodb
        await client.connect();
        // find a database call "db"
        const db = client.db('db');
        const coll = db.collection('Materials');


        console.log("materialSimp: " + JSON.stringify(materialSimp))
        for (const material in materialSimp) {

          // Query MongoDB to find the material in the collection
          const foundMaterial = await coll.findOne({ name: material });

          // If material not found in the database, update materialNames object
          if (!foundMaterial) {
              // Increase the percentage of UNKNOWN material by the percentage of the missing material
              materialSimp.UNKNOWN += materialSimp[material];
              // Remove the missing material from the materialNames object
              delete materialSimp[material];
          } else if (material != "UNKNOWN") { 
            // add material to score if it's found in database and it's not unknown, 
            // bc unknown percentage can still change, therefore add it at the end
            // (materialSimp[key] / 100) signify the percentage of the current material, ex: 75/100 is 0.75
            score = score + parseInt(foundMaterial.score) * (materialSimp[material] / 100);
          }
      }
      // add unknown material to the total score, assume it's netural eco friendly (50 out of 100) 
      if (materialSimp.hasOwnProperty('UNKNOWN')) {
        score = score + 50 * (materialSimp["UNKNOWN"] / 100);
      }


      console.log("materialSimp: " + JSON.stringify(materialSimp))

        /*
        const query = coll.find();

        console.log("materialSimp: " + JSON.stringify(materialSimp))

        console.log("query below: ")
        for (const key in materialSimp) {
          for await (const dbMaterial of query) {
            // dbMaterial is from the mongodb, it is all uppercase
            if (dbMaterial.name === key.toUpperCase()) {
              score = score + materials.score * (parseInt(materialSimp[key]) / 100);
            }
          }
        }
        */
      } finally {
        // Ensures that the client will close when you finish/error
        await client.close();

        // return the score (at most two decimal digits) and material list, 
        const roundedScore = parseFloat(score.toFixed(2))
        
        return {materialScore: roundedScore, materialList: materialSimp};
      }
    }
    // run().catch(console.dir);
    return await run();
  } catch (err) {
  console.error(err);
}
}

const scrapeImage = async (url) => {
  try {
    let {data} = await axios.get(url, config);
    const $ = cheerio.load(data);
    //const imageElements = $('img');
    // get the first <img> that contains the word webcontent in its src attribute
    const imageElements = $("img[src*='webcontent']")[0];
    let imageSrc = $(imageElements).attr('src');
    // need "https://" as part of the image link for the <img> tag to work!!!
    let imageUrl = 'https://oldnavy.gapcanada.ca'.concat(imageSrc);
    return imageUrl;
    /*
    imageElements.each((index, element) => {
      let imageSrc = $(element).attr('src');
      // if (imageSrc.includes('hm.com'))
      if (imageSrc.includes('webcontent')) {
        imageUrl = 'https://oldnavy.gapcanada.ca'.concat(imageSrc);
        console.log(imageUrl);
      }
    });
    return imageUrl;
    */
  } catch (err) {
    console.error(err);
  }
}

module.exports = {
  scrapeImage,
  scrapeMaterials,
  scrapeName
}