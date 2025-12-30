import { Article } from "../models/article.js";

/**
 * Create article
 */
export const createArticle = async (req, res) => {
  try {
    const article = await Article.create(req.body);
    res.status(201).json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};


/**
 * Get all articles
 */
export const getAllArticles = async (req, res) => {
  const query = {};
  if (req.query.slug) query.slug = req.query.slug;

  const articles = await Article.find(query).sort({ createdAt: -1 });
  res.json(articles);
};


/**
 * Get article by ID
 */
export const getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Article not found" });

    res.json(article);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * Update article
 */
export const updateArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!article)
      return res.status(404).json({ message: "Article not found" });

    res.json(article);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

/**
 * Delete article
 */
export const deleteArticle = async (req, res) => {
  try {
    const article = await Article.findByIdAndDelete(req.params.id);
    if (!article)
      return res.status(404).json({ message: "Article not found" });

    res.json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
