import axios from "axios";
import * as cheerio from "cheerio";

const BASE_URL = "https://beyondchats.com";

/**
 * Fetch and parse a blog listing page
 */
async function fetchBlogList(pageNumber) {
  const url = `${BASE_URL}/blogs/page/${pageNumber}/`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articles = [];

  $(".blog-item, article").each((_, el) => {
    const title = $(el).find("h2 a").text().trim();
    const link = $(el).find("h2 a").attr("href");

    if (title && link) {
      articles.push({
        title,
        url: link.startsWith("http") ? link : `${BASE_URL}${link}`,
      });
    }
  });

  return articles;
}

/**
 * Fetch and clean full article content
 */
async function fetchArticleContent(articleUrl) {
  const { data } = await axios.get(articleUrl);
  const $ = cheerio.load(data);

  // Adjust selectors if needed after inspection
  const content = [];

  $(".entry-content p, .entry-content h2, .entry-content h3").each((_, el) => {
    const text = $(el).text().trim();
    if (text) content.push(text);
  });

  return content.join("\n\n");
}

/**
 * Main scraper logic
 */
export async function scrapeOldestBeyondChatsArticles() {
  const results = [];

  // 1️⃣ Fetch last page (page 15)
  let lastPageArticles = [];
  try {
    lastPageArticles = await fetchBlogList(15);
  } catch (err) {
    console.error("Failed to fetch page 15");
  }

  if (lastPageArticles.length > 0) {
    results.push(lastPageArticles[0]); // only 1 article exists
  }

  // 2️⃣ Fetch page 14 and take last 4
  if (results.length < 5) {
    const page14Articles = await fetchBlogList(14);
    const remaining = 5 - results.length;
    const page14Oldest = page14Articles.slice(-remaining).reverse(); // IMPORTANT

    results.push(...page14Oldest);
  }

  // 3️⃣ Fetch full content for each article
  const finalArticles = [];

  for (const article of results) {
    const content = await fetchArticleContent(article.url);

    finalArticles.push({
      title: article.title,
      slug: article.url.split("/").filter(Boolean).pop(),
      content,
      source: "beyondchats",
      isUpdatedVersion: false,
      references: [],
    });
  }

  return finalArticles;
}

// Optional: run directly
if (process.argv[1].includes("beyondchats.scraper")) {
  scrapeOldestBeyondChatsArticles().then((data) => {
    console.log(`Scraped ${data.length} oldest articles`);
    console.log(data.map((a) => a.title));
  });
}
if (process.argv[1].includes("scraper.js")) {
  scrapeOldestBeyondChatsArticles()
    .then((articles) => {
      console.log("Scraped articles count:", articles.length);
      articles.forEach((a, i) => {
        console.log(`${i + 1}. ${a.title}`);
      });
    })
    .catch(console.error);
}
