import axios from "axios";
import * as cheerio from "cheerio";

/**
 * Scrape main content from a reference article
 * @param {string} url
 * @returns {string} cleaned article text
 */
export async function scrapeReferenceArticle(url) {
  try {
    const response = await axios.get(url, {
      timeout: 15000,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const content = [];

    /**
     * Primary selectors (most blogs, Medium-like sites)
     */
    $("article p, article h2, article h3").each((_, el) => {
      const text = $(el).text().trim();
      if (text.length > 40) content.push(text);
    });

    /**
     * Fallback selectors (corporate blogs like IBM, AWS)
     */
    if (content.length === 0) {
      $("main p, main h2, main h3").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 40) content.push(text);
      });
    }

    /**
     * Last-resort fallback
     */
    if (content.length === 0) {
      $("p").each((_, el) => {
        const text = $(el).text().trim();
        if (text.length > 40) content.push(text);
      });
    }

    const finalText = content.join("\n\n");

    // Guard: avoid junk or blocked pages
    if (finalText.length < 500) {
      console.warn(`Reference content too short, skipping: ${url}`);
      return "";
    }

    return finalText;
  } catch (error) {
    console.warn(`Failed to scrape reference: ${url}`);
    return "";
  }
}
