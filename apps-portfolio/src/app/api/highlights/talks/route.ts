// src/app/api/highlights/talks/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';

export async function GET() {
  const talks = await db.talk.findMany({
    where: {
      tags: {
        contains: 'highlight',
      },
    },
  });
  return NextResponse.json(talks);
}