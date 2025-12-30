import { GoogleGenerativeAI } from "@google/generative-ai";

/**
 * Rewrite an article using Gemini based on reference articles
 * @param {string} originalContent
 * @param {string} reference1
 * @param {string} reference2
 * @returns {string} rewritten article
 */
export async function rewriteWithGemini(
  originalContent,
  reference1,
  reference2
) {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are a professional content editor and SEO specialist.

Your task is to enhance an existing blog article using insights from two high-ranking reference articles.
You must NOT copy sentences or phrases from the reference articles.
You must rewrite everything in original language while improving clarity, structure, and readability.

Goals:
- Improve the article’s structure and flow
- Use clear, SEO-friendly headings
- Expand explanations where helpful
- Maintain factual accuracy
- Keep the topic and intent unchanged
- Do NOT mention competitor brands or websites
- Do NOT include promotional language
- Ensure the content is fully original

Output Requirements:
- Start with a clear, engaging introduction
- Use multiple meaningful headings (H2/H3 style, plain text)
- Write in a professional, informative tone
- End with a concise conclusion
- Do NOT include references inside the main body
- Do NOT use markdown symbols like ** or ##
- Plain text only

ORIGINAL ARTICLE:
${originalContent}

REFERENCE ARTICLE 1:
${reference1}

REFERENCE ARTICLE 2:
${reference2}
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length < 300) {
      throw new Error("Gemini returned insufficient content");
    }

    return text.trim();
  } catch (error) {
    console.error("Gemini rewrite failed:", error.message);
    return "";
  }
}
