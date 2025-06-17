// src/app/lib/data.ts

import { Talk, Article } from '../../lib/types';

const slugify = (str: string) => {
  if (!str) return '';
  return str.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
};

const getBaseUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // Fallback for client-side rendering
  return '';
};

export async function getTalks() {
  const res = await fetch(`${getBaseUrl()}/api/talks`);
  const talks: Talk[] = await res.json();
  return talks.map((talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getArticles() {
  const res = await fetch(`${getBaseUrl()}/api/articles`);
  const articles: Article[] = await res.json();
  return articles.map((article) => ({
    ...article,
    slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`
  }));
}

export async function getTalk(slug: string) {
  const talks = await getTalks();
  return talks.find((talk) => talk.slug === slug);
}

export async function getArticle(slug: string) {
  const articles = await getArticles();
  return articles.find((article) => article.slug === slug);
}

export async function getFutureTalks() {
  const res = await fetch(`${getBaseUrl()}/api/talks`);
  const talks: Talk[] = await res.json();
  const futureTalks = talks
    .filter((talk) => new Date(talk.date as string) > new Date())
    .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());
  return futureTalks.map((talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getHighlightedTalks() {
  const res = await fetch(`${getBaseUrl()}/api/highlights/talks`);
  const talks: Talk[] = await res.json();
  return talks.map((talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

export async function getHighlightedArticles() {
  const res = await fetch(`${getBaseUrl()}/api/highlights/articles`);
  const articles: Article[] = await res.json();
  return articles.map((article) => ({
    ...article,
    slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`
  }));
}
