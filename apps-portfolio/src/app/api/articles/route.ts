// src/app/api/articles/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  const articles = await db.article.findMany({
    orderBy: {
      publish_date: 'desc',
    },
  });
  console.log('Fetched articles:', articles.length);
  return NextResponse.json(articles);
}
