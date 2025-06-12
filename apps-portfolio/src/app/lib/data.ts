const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function getTalks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/talks`);
  const talks: Talk[] = await res.json();
  return talks.map((talk: Talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
  const articles: Article[] = await res.json();
  return articles.map((article: Article) => ({
    ...article,
    slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`
  }));
}

export async function getTalk(slug: string) {
  const talks = await getTalks();
  return talks.find((talk: Talk) => talk.slug === slug);
}

export async function getArticle(slug: string) {
  const articles = await getArticles();
  return articles.find((article: Article) => article.slug === slug);
}

export async function getFutureTalks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/talks`);
  const talks: Talk[] = await res.json();
  const futureTalks = talks.filter((talk: Talk) => new Date(talk.date as string) > new Date());
  return futureTalks.map((talk: Talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getHighlightedTalks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/highlights/talks`);
  const talks: Talk[] = await res.json();
  return talks;
}

export async function getHighlightedArticles() {
  const res = await fetch(`/api/highlights/articles`);
  const articles: Article[] = await res.json();
  return articles;
}