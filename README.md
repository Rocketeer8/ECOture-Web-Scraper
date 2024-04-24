# ECOture - created for MetHacks2023!

## 💡 Inspiration:
We were inspired by a video highlighting the impact that fast fashion has on the environment. While watching this video, we realized that knowledge surrounding the environmental impact clothing is very inaccessible for consumers. We decided that we wanted to develop a online tool that would spread awareness of this issue and facilitate more eco-conscious purchasing decisions.

## 🤖 What it does
On ECOuture, you're able to provide a URL for a product listing that you are interesting in buying. Once the URL is entered, we scrape the listing for information that is used to identify the product (name of product, manufacturer and materials used). Once we've received the information about the product, we reference a database that contains values that measure environmental impact based on the material and manufacturer provided. These values include: Material Score, Sustainability Certifications, Supply Chain Transparency and Geographical Location. The values are then plugged into a formula to determine a score that grades the eco-friendliness of the given product (Higher number = more eco-friendly).

## 🧠 How we built it:
For our front-end, we used React.js to design our webpages and CSS to stylize them. For our backend, we used Node.JS and Express.JS, along with Axios and Cheerio as libraries for our web scrapper. For our database, we used MongoDB to host our data. To determine what values we should designate to what manufacturer and material, we referenced academic articles and publicly available indexes that provided insight on the materials' environmental impact and companies' production practices. Our formula is given by:

Eco-friendliness score = (T + C + G) * M

T = Supply Chain Transparency

C = Sustainability Certifications

G = Geographical Location

M = Material Score

## 😎 Accomplishments that we're proud of
One thing that we're proud of is that we were able to implement web scraping into our project, something that is very much outside of our comfort zone.

## 🥸 What we learned
We learned more about how to incorporate front-end elements, back-end elements, and databases together. Additionally, we learned a lot about how eco-friendly certain companies' production practices are and the environmental impact of materials relative to one another.

## 🥳 What's next for ECOuture
We plan on expanding the number of product listing URLs compatible with our website. We also would like to develop a more expansive databases, covering more materials and manufacturers. Something to consider would be a revamped eco-friendly formula, as our current formula is quite basic and could be adjusted to give a more comprehensive eco-friendliness score.build dependency from your project.
