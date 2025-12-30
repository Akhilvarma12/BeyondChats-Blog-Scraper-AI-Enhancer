import axios from "axios";
import * as cheerio from "cheerio";
import { connectDB } from "../../server/src/config/db.js";
import { Article } from "../../server/src/models/article.js";

const BASE_URL = "https://beyondchats.com";

/**
 * Fetch article list from a blog page
 */
async function fetchBlogList(pageNumber) {
  const url = `${BASE_URL}/blogs/page/${pageNumber}/`;
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const articles = [];

  $("article").each((_, el) => {
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
 * Fetch full article content
 */
async function fetchArticleContent(url) {
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);

  const content = [];

  // Primary selector
  $(".entry-content p, .entry-content h2, .entry-content h3").each(
    (_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) content.push(text);
    }
  );

  // Fallback selector (important)
  if (content.length === 0) {
    $("article p").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 20) content.push(text);
    });
  }

  return content.join("\n\n");
}


/**
 * Scrape 5 oldest articles (page 15 + last 4 of page 14)
 */
async function scrapeOldestArticles() {
  const results = [];

  const lastPage = await fetchBlogList(15);
  if (lastPage.length > 0) {
    results.push(lastPage[0]);
  }

  if (results.length < 5) {
    const page14 = await fetchBlogList(14);
    const remaining = 5 - results.length;
    results.push(...page14.slice(-remaining).reverse());
  }

  return results;
}

/**
 * Main function: scrape and save to DB
 */
async function scrapeAndSave() {
  await connectDB();

  const articles = await scrapeOldestArticles();

  for (const article of articles) {
    const slug = article.url.split("/").filter(Boolean).pop();

    const exists = await Article.findOne({ slug });
    if (exists) {
      console.log(`Skipped (already exists): ${article.title}`);
      continue;
    }

const content = await fetchArticleContent(article.url);

if (!content || content.trim().length === 0) {
  console.warn(`Skipped (empty content): ${article.title}`);
  continue;
}

await Article.create({
  title: article.title,
  slug,
  content,
  source: "beyondchats",
  isUpdatedVersion: false,
  references: [],
});


    console.log(`Inserted: ${article.title}`);
  }

  console.log("Scraping and saving completed");
  process.exit(0);
}

/**
 * Run directly
 */
scrapeAndSave().catch((err) => {
  console.error("Scraper failed:", err);
  process.exit(1);
});
