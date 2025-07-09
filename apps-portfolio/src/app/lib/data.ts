// src/app/lib/data.ts
import { db } from '../../lib/db';

import { slugify, parseDateString } from '../../lib/utils';

// Server-side function
export async function getTalks() {
  try {
    const talks = await db.talk.findMany({
      orderBy: {
        date: 'desc',
      },
    });
    return talks.map((talk) => ({
        ...talk,
        slug: `${talk.date}-${slugify(talk.title)}`
    }));
  } catch (error) {
    console.error('Error fetching talks:', error);
    return [];
  }
}

// Server-side function
export async function getArticles() {
  try {
    const articles = await db.article.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return articles.map((article) => ({
      ...article,
      slug: `${article.publish_date}-${slugify(article.title)}`,
      type: 'article'
    }));
  } catch (error) {
    console.error('Error fetching articles:', error);
    return [];
  }
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
  const talks = await db.talk.findMany({
    orderBy: {
      date: 'asc',
    },
    where: {
      date: {
        gte: new Date().toISOString().split('T')[0],
      }
    }
  });
  return talks.map((talk) => ({
    ...talk,
    slug: `${talk.date}-${slugify(talk.title)}`
  }));
}

export async function getPastTalks() {
  const talks = await db.talk.findMany({
    orderBy: {
      date: 'desc',
    },
    where: {
      date: {
        lt: new Date().toISOString().split('T')[0],
      }
    }
  });
  return talks.map((talk) => ({
    ...talk,
    slug: `${talk.date}-${slugify(talk.title)}`
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
        slug: `${talk.date}-${slugify(talk.title)}`
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
            createdAt: 'desc'
        }
    });
    return articles.map((article) => ({
        ...article,
        slug: `${article.publish_date}-${slugify(article.title)}`
    }));
}

