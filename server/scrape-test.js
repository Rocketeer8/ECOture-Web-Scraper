const { chromium } = require("playwright");

(async () => {
  const url = "https://oldnavy.gapcanada.ca/browse/product.do?pid=403876003&vid=1&pcid=1185233&cid=1185233";

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36",
    locale: "en-US"
  });

  await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
  // Expand materials accordion if needed
  // const button = await page.$("button:has-text('Fabric')"); // adjust text if different
  // if (button) await button.click();

  await page.waitForTimeout(1000); // small pause for content to render
  const materials = await page.$$eval("button:has-text('Fabric') + div div div ul li span", els => els.map(el => el.textContent.trim()).filter(Boolean));

  console.log(materials);

  // const html = await page.content();
  

  await browser.close();
})();