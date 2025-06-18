// src/app/api/highlights/articles/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { slugify } from '../../../../lib/utils';

export async function GET() {
  const articles = await db.article.findMany({
    where: {
      tags: {
        contains: 'highlight',
      },
    },
    orderBy: {
      publish_date: 'desc'
    }
  });
  const articlesWithSlug = articles.map((article) => ({
    ...article,
    slug: `${article.publish_date.split('T')[0]}-${slugify(article.title)}`
  }));
  return NextResponse.json(articlesWithSlug);
}