const KB_API_URL = import.meta.env.VITE_KB_API_URL || 'http://localhost:4004/articles';

export async function getAllArticles(token: string) {
  const res = await fetch(`${KB_API_URL}/articles`, {
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch articles');
  return res.json();
}

export async function createArticle(token: string, data: { title: string; content: string }) {
  const res = await fetch(`${KB_API_URL}/articles`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to create article');
  return res.json();
}

export async function updateArticle(token: string, id: number, data: { title?: string; content?: string }) {
  const res = await fetch(`${KB_API_URL}/articles/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to update article');
  return res.json();
}

export async function deleteArticle(token: string, id: number) {
  const res = await fetch(`${KB_API_URL}/articles/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + token }
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to delete article');
  return res.json();
}

export async function searchArticles(query: string) {
  // If you have a semantic search endpoint, use POST /articles/search, else fallback to GET /articles?query=...
  const res = await fetch(`${KB_API_URL}/search`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ embedding: query }) // For now, just send the query as embedding (stub)
  });
  if (!res.ok) throw new Error((await res.json()).message || 'Search failed');
  return res.json();
}

export async function listArticles() {
  const res = await fetch(KB_API_URL);
  if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch articles');
  return res.json();
}
