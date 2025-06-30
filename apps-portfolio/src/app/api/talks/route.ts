// src/app/api/talks/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '../../../lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const future = searchParams.get('future');

  if (future === 'true') {
    const now = new Date();
    console.log('Filtering for future talks where date >= ', now.toISOString());
    const talks = await db.talk.findMany({
      where: {
        date: {
          gte: now.toISOString(),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
    console.log('Fetched future talks:', talks.length, talks);
    return NextResponse.json(talks);
  }

  const talks = await db.talk.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  console.log('Fetched all talks:', talks.length);
  return NextResponse.json(talks);
}