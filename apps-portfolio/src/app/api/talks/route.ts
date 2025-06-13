// src/app/api/talks/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  const talks = await db.talk.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  console.log('Fetched talks:', talks.length);
  return NextResponse.json(talks);
}
