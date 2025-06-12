const slugify = (str: string) => str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

export async function getTalks() {
  const res = await fetch(`/api/talks`);
  const talks: Talk[] = await res.json();
  return talks.map((talk: Talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getArticles() {
  const url = `/api/articles`;
  console.log('Fetching articles from:', url);
  const res = await fetch(url);
  console.log('Articles API response status:', res.status);
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
  const url = `/api/talks`;
  console.log('Fetching future talks from:', url);
  const res = await fetch(url);
  console.log('Future Talks API response status:', res.status);
  const talks: Talk[] = await res.json();
  const futureTalks = talks.filter((talk: Talk) => new Date(talk.date as string) > new Date());
  return futureTalks.map((talk: Talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getHighlightedTalks() {
  const url = `/api/highlights/talks`;
  console.log('Fetching highlighted talks from:', url);
  const res = await fetch(url);
  console.log('Highlighted Talks API response status:', res.status);
  const talks: Talk[] = await res.json();
  return talks;
}

export async function getHighlightedArticles() {
  const url = `/api/highlights/articles`;
  console.log('Fetching highlighted articles from:', url);
  const res = await fetch(url);
  console.log('Highlighted Articles API response status:', res.status);
  const articles: Article[] = await res.json();
  return articles;
}
