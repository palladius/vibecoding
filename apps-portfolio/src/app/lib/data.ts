// src/app/lib/data.ts
import { db } from '../../lib/db';
import { Talk } from '../../lib/types';
import { slugify } from '../../lib/utils';

// Server-side function
export async function getTalks() {
  const talks = await db.talk.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  return talks.map((talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

// Server-side function
export async function getArticles() {
  const articles = await db.article.findMany({
    orderBy: {
      publish_date: 'desc',
    },
  });
  return articles.map((article) => ({
    ...article,
    slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`,
    type: 'article'
  }));
}

// Server-side function
export async function getTalk(slug: string) {
  const talks = await getTalks();
  const talk = talks.find((talk) => talk.slug === slug);
  return talk;
}

// Server-side function
export async function getArticle(slug: string) {
  const articles = await getArticles();
  const article = articles.find((article) => article.slug === slug);
  return article;
}

// Client-side function (uses relative URL)
export async function getFutureTalks() {
  const res = await fetch(`/api/talks?future=true`);
  const talks: Talk[] = await res.json();
  return talks.map((talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
}

// Server-side function
export async function getHighlightedTalks() {
    const talks = await db.talk.findMany({
        where: {
            tags: {
                contains: 'highlight'
            }
        },
        orderBy: {
            date: 'desc'
        }
    });
    return talks.map((talk) => ({
        ...talk,
        slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
    }));
}

// Server-side function
export async function getHighlightedArticles() {
    const articles = await db.article.findMany({
        where: {
            tags: {
                contains: 'highlight'
            }
        },
        orderBy: {
            publish_date: 'desc'
        }
    });
    return articles.map((article) => ({
        ...article,
        slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`
    }));
}
