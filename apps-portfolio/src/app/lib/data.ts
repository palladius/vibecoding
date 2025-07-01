// src/app/lib/data.ts
import { db } from '../../lib/db';
import { Talk } from '../../lib/types';
import { slugify } from '../../lib/utils';

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
      date: talk.date instanceof Date ? talk.date.toISOString().split('T')[0] : talk.date,
      slug: `${talk.date instanceof Date ? talk.date.toISOString().split('T')[0] : talk.date}-${slugify(talk.title)}`
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
        publish_date: 'desc',
      },
    });
    return articles.map((article) => ({
      ...article,
      slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`,
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
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
  const res = await fetch(`${baseUrl}/api/talks`);
  const talks: Talk[] = (await res.json()).map((talk: Talk) => ({
    ...talk,
    date: talk.date,
  }));
  const futureTalks = talks
    .filter((talk) => {
      const talkDate = new Date(talk.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to the beginning of the current day
      console.log(`Comparing talk date: ${talkDate.toISOString()} (timestamp: ${talkDate.getTime()}) with current date (start of day): ${today.toISOString()} (timestamp: ${today.getTime()})`);
      return talkDate.getTime() >= today.getTime();
    })
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return futureTalks.map((talk) => ({
    ...talk,
    slug: `${talk.date instanceof Date ? talk.date.toISOString().split('T')[0] : talk.date}-${slugify(talk.title)}`
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
        date: talk.date instanceof Date ? talk.date.toISOString().split('T')[0] : talk.date,
        slug: `${talk.date instanceof Date ? talk.date.toISOString().split('T')[0] : talk.date}-${slugify(talk.title)}`
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