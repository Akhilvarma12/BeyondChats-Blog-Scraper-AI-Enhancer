const API_BASE_URL = "http://localhost:5000/api/articles";

export async function fetchArticles() {
  const res = await fetch(API_BASE_URL);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function fetchArticleById(id) {
  const res = await fetch(`${API_BASE_URL}/${id}`);
  if (!res.ok) throw new Error("Failed to fetch article");
  return res.json();
}
