import axios from "axios";

const SERPAPI_BASE_URL = "https://serpapi.com/search";

/**
 * Search Google for top-ranking external articles
 * @param {string} query - Article title
 * @returns {string[]} - Array of article URLs
 */
export async function searchTopArticles(query) {
  try {
    const response = await axios.get(SERPAPI_BASE_URL, {
      params: {
        engine: "google",
        q: query,
        api_key: process.env.SERPAPI_KEY,
        num: 10,
      },
    });

    const results = response.data.organic_results || [];

    const links = results
      .map((r) => r.link)
      .filter((link) => {
        if (!link) return false;

        const lower = link.toLowerCase();

        // Filter out unwanted sources
        if (lower.includes("beyondchats.com")) return false;
        if (lower.includes("youtube.com")) return false;
        if (lower.includes("linkedin.com")) return false;
        if (lower.includes("facebook.com")) return false;
        if (lower.endsWith(".pdf")) return false;

        return true;
      });

    return links.slice(0, 2);
  } catch (error) {
    console.error("SerpAPI search failed:", error.message);
    return [];
  }
}
