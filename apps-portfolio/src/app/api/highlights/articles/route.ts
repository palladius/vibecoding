// src/app/api/highlights/articles/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  const articles = await db.article.findMany({
    where: {
      tags: {
        contains: 'highlight',
      },
    },
  });
  return NextResponse.json(articles);
}