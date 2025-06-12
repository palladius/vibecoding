export async function getTalks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/talks`);
  const talks = await res.json();
  return talks;
}

export async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
  const articles = await res.json();
  return articles;
}
