// src/app/api/talks/route.ts
import { NextResponse, type NextRequest } from 'next/server';
import { db } from '../../../lib/db';
import { parseDateString } from '../../../lib/utils';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const future = searchParams.get('future');

  if (future === 'true') {
    const now = new Date();
    const todayFormatted = now.toISOString().split('T')[0];
    const talks = await db.talk.findMany({
      where: {
        date: {
          gte: parseDateString(todayFormatted),
        },
      },
      orderBy: {
        date: 'asc',
      },
    });
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