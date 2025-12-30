import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import { searchTopArticles } from "./googleSearch.js";
import { scrapeReferenceArticle } from "./scrapeReference.js";
import { rewriteWithGemini } from "./llmRewrite.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from server/.env explicitly
dotenv.config({
  path: path.resolve(__dirname, "../../server/.env"),
});

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:5000";

/**
 * Fetch original (non-updated) articles
 */
async function fetchOriginalArticles() {
  const response = await axios.get(`${API_BASE_URL}/api/articles`);
  return response.data.filter(
    (a) => a.source === "beyondchats" && !a.isUpdatedVersion
  );
}

/**
 * Publish enhanced article
 */
async function publishEnhancedArticle(original, content, references) {
  try {
    const enhancedSlug = `enhanced-${original.slug}`;

    const existing = await axios.get(`${API_BASE_URL}/api/articles`, {
      params: { slug: enhancedSlug },
    });

    if (existing.data.length > 0) {
      console.log("Enhanced article already exists, skipping\n");
      return { status: "skipped" };
    }

    await axios.post(`${API_BASE_URL}/api/articles`, {
      title: `Enhanced: ${original.title}`,
      slug: enhancedSlug,
      content: `${content}\n\nReferences:\n1. ${references[0] || ""}\n2. ${
        references[1] || ""
      }`,
      source: "generated",
      isUpdatedVersion: true,
      references,
      originalArticleId: original._id,
    });

    return { status: "published" };
  } catch (error) {
    if (error.response) {
      console.error("API ERROR STATUS:", error.response.status);
      console.error("API ERROR DATA:", error.response.data);
    } else {
      console.error("REQUEST ERROR:", error.message);
    }
    throw error;
  }
}

/**
 * Main Phase 2 runner
 */
async function runPhase2() {
  console.log("Starting Phase 2 pipeline...\n");

  const originals = await fetchOriginalArticles();

  for (const article of originals) {
    console.log(`Processing: ${article.title}`);

    // 1. Google search
    const links = await searchTopArticles(article.title);
    if (links.length === 0) {
      console.warn("No reference articles found, skipping\n");
      continue;
    }

    // 2. Scrape reference content
    const ref1 = await scrapeReferenceArticle(links[0]);
    const ref2 = links[1] ? await scrapeReferenceArticle(links[1]) : "";

    if (!ref1 && !ref2) {
      console.warn("Reference scraping failed, skipping\n");
      continue;
    }

    // 3. Rewrite with Gemini
    const rewritten = await rewriteWithGemini(article.content, ref1, ref2);

    if (!rewritten) {
      console.warn("Gemini rewrite failed, skipping\n");
      continue;
    }

    // 4. Publish enhanced article
    const result = await publishEnhancedArticle(article, rewritten, links);

    if (result?.status === "published") {
      console.log("Enhanced article published\n");
    }

    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 3000));
  }

  console.log("Phase 2 pipeline completed");
  process.exit(0);
}

runPhase2().catch((err) => {
  console.error("Phase 2 failed:", err.message);
  process.exit(1);
});
