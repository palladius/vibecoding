// src/app/api/highlights/talks/route.ts
import { NextResponse } from 'next/server';
import { db } from '../../../../lib/db';
import { slugify } from '../../../../lib/utils';

export async function GET() {
  const talks = await db.talk.findMany({
    where: {
      tags: {
        contains: 'highlight',
      },
    },
    orderBy: {
      date: 'desc'
    }
  });
  const talksWithSlug = talks.map((talk) => ({
    ...talk,
    slug: `${talk.date.split('T')[0]}-${slugify(talk.title)}`
  }));
  return NextResponse.json(talksWithSlug);
}