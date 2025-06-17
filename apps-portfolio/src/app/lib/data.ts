// src/app/lib/data.ts
import { db } from '../../lib/db';
import { Talk } from '../../lib/types';

const slugify = (str: string) => {
  if (!str) return '';
  const a = 'àáâäæãåāăąçćčđďèéêëēėęěğǵḧîïíīįìłḿñńǹňôöòóœøōõőṕŕřßśšşșťțûüùúūǘůűųẃẍÿýžźż·/_,:;'
  const b = 'aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------'
  const p = new RegExp(a.split('').join('|'), 'g')

  return str.toString().toLowerCase()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w-]+/g, '') // Remove all non-word chars
    .replace(/--+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, '') // Trim - from end of text
}

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
    slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`
  }));
}

// Server-side function
export async function getTalk(slug: string) {
  const talk = await db.talk.findFirst({
    where: {
      slug: slug,
    },
  });
  return talk;
}

// Server-side function
export async function getArticle(slug: string) {
  const article = await db.article.findFirst({
    where: {
      slug: slug,
    },
  });
  return article;
}

// Client-side function (uses relative URL)
export async function getFutureTalks() {
  const res = await fetch(`/api/talks`);
  const talks: Talk[] = await res.json();
  const futureTalks = talks
    .filter((talk) => new Date(talk.date as string) > new Date())
    .sort((a, b) => new Date(a.date as string).getTime() - new Date(b.date as string).getTime());
  return futureTalks.map((talk) => ({
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
