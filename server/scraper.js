const { chromium } = require("playwright");
const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://Danny:kuGQ8J04owk8XidB@cluster0.yhcwz4g.mongodb.net/?retryWrites=true&w=majority";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36";

const MATERIAL_SELECTORS = [
  "button:has-text('Fabric') + div div div ul li span",
  "button:has-text('Fabric & care') + div div div ul li span",
  "button:has-text('Fabric & Care') + div div div ul li span",
  "button:has-text('Materials') + div div ul li span",
];

const UNKNOWN_MATERIAL_SCORE = 50; // assumed neutral score for unknown materials

async function withProductPage(url, handler) {
  const browser = await chromium.launch({
    headless: true,
    args: ["--disable-http2", "--disable-features=IsolateOrigins,site-per-process"],
  });
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: "en-US",
    ignoreHTTPSErrors: true,
  });
  // Skip loading heavy assets to speed up hydration.
  await context.route(
    "**/*.{png,jpg,jpeg,gif,webp,avif,svg,woff,woff2,ttf,otf}",
    (route) => route.abort()
  );
  const page = await context.newPage();

  try {
    console.log(`[scraper] navigating to ${url}`);
    await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
    // Wait briefly for key elements instead of full network idle.
    await page.waitForSelector("button:has-text('Fabric'), button:has-text('Fabric & care')", {
      timeout: 8000,
    }).catch(() => {});
    // Small pause to allow content to hydrate.
    await page.waitForTimeout(500);
    const title = await page.title().catch(() => "");
    console.log(`[scraper] loaded url=${page.url()} title="${title}"`);
    const html = await page.content();
    if (html.includes("CookieFailure")) {
      throw new Error("Blocked by CookieFailure page; try different headers/cookies or a non-headless run.");
    }
    return await handler(page);
  } finally {
    await browser.close();
  }
}

async function extractName(page) {
  const name = await page.$eval("h1", (el) => el.textContent.trim()).catch(() => "");
  return name;
}

async function extractImage(page) {
  const imageUrl = await page
    .$eval("img[src*='webcontent']", (el) => {
      const src = el.getAttribute("src") || "";
      return src.startsWith("http") ? src : `https://oldnavy.gapcanada.ca${src}`;
    })
    .catch(() => "");
  return imageUrl;
}

async function extractMaterialTexts(page) {
  // Wait for the materials accordion/button to exist before querying spans.
  const targetSelector = "button:has-text('Fabric'), button:has-text('Fabric & care'), button[title*='Fabric'] + div ul li span";
  await page.waitForSelector(targetSelector, { timeout: 6000 }).catch(() => {});
  await page.waitForSelector("ul li span, dd", { timeout: 6000 }).catch(() => {});

  // Try expanding the accordion if it's present.
  try {
    const expandBtn = await page.$("button:has-text('Fabric'), button:has-text('Fabric & care')");
    if (expandBtn) {
      await expandBtn.click({ timeout: 2000 }).catch(() => {});
      await page.waitForTimeout(300);
    }
  } catch (e) {
    // ignore
  }

  const trySelectors = async () => {
    for (const selector of MATERIAL_SELECTORS) {
      const materials = await page
        .$$eval(selector, (els) => els.map((el) => el.textContent.trim()).filter(Boolean))
        .catch(() => []);
      if (materials.length) {
        console.log(`Material selector matched "${selector}" ->`, materials);
        return materials;
      }
      console.log(`Material selector found nothing for "${selector}"`);
    }
    return [];
  };

  let materials = await trySelectors();
  if (!materials.length) {
    // Quick retry after a short delay to catch late hydration.
    await page.waitForTimeout(500);
    materials = await trySelectors();
  }

  if (materials.length) {
    return materials;
  }

  // Fallback: scan any list items/spans with percentages to see if materials are present elsewhere.
  const fallback = await page
    .$$eval("li, p, span, dd", (els) =>
      els
        .map((el) => el.textContent.trim())
        .filter((text) => /%/.test(text) && text.length < 120)
    )
    .catch(() => []);
  if (fallback.length) {
    console.log(`[scraper] fallback material texts ->`, fallback);
  } else {
    console.log("[scraper] no materials found in fallback scan");
  }
  return fallback;
}

function parseMaterials(materialTexts) {
  const materials = new Map();
  materialTexts.forEach((text) => {
    const sentenceParts = text.split(",").map((item) => item.trim());
    sentenceParts.forEach((part) => {
      const match = part.match(/(\d+)%\s*(.+)/i);
      if (match) {
        const percentage = parseInt(match[1], 10);
        const materialName = match[2].toUpperCase();
        if (!materials.has(materialName)) {
          materials.set(materialName, percentage);
        }
      }
    });
  });
  return materials;
}

async function scoreMaterials(materialTexts) {
  const materials = parseMaterials(materialTexts);
  let totalPercentage = 0;
  const materialSimp = {};

  for (const [name, pct] of materials.entries()) {
    if (totalPercentage + pct <= 100) {
      materialSimp[name] = pct;
      totalPercentage += pct;
    } else {
      break;
    }
  }

  if (totalPercentage < 100) {
    materialSimp.UNKNOWN = 100 - totalPercentage;
  }

  const client = new MongoClient(uri);
  let score = 0;

  try {
    await client.connect();
    const coll = client.db("db").collection("Materials");

    for (const material of Object.keys(materialSimp)) {
      if (material === "UNKNOWN") continue;
      const foundMaterial = await coll.findOne({ name: material });

      if (!foundMaterial) {
        materialSimp.UNKNOWN = (materialSimp.UNKNOWN || 0) + materialSimp[material];
        delete materialSimp[material];
      } else {
        score += parseInt(foundMaterial.score, 10) * (materialSimp[material] / 100);
      }
    }

    if (materialSimp.UNKNOWN) {
      score += UNKNOWN_MATERIAL_SCORE * (materialSimp.UNKNOWN / 100);
    }

    return {
      materialScore: parseFloat(score.toFixed(2)),
      materialList: materialSimp,
    };
  } finally {
    await client.close();
  }
}

async function scrapeProduct(url) {
  return withProductPage(url, async (page) => {
    const [name, materialTexts, image] = await Promise.all([
      extractName(page),
      extractMaterialTexts(page),
      extractImage(page),
    ]);

    console.log(`[scraper] extracted name="${name}", image="${image}", materialsCount=${materialTexts.length}`);
    const materials = await scoreMaterials(materialTexts);
    return { name, materials, image };
  });
}

module.exports = {
  scrapeProduct,
  // Backwards-compatible exports; these will each trigger a new page load.
  scrapeName: async (url) => (await scrapeProduct(url)).name,
  scrapeMaterials: async (url) => (await scrapeProduct(url)).materials,
  scrapeImage: async (url) => (await scrapeProduct(url)).image,
};
