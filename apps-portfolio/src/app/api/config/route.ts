import { NextResponse } from 'next/server';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const talksCount = await db.talk.count();
    const articlesCount = await db.article.count();

    const config = {
      env: {
        NODE_ENV: process.env.NODE_ENV,
        PORT: process.env.PORT,
        NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
        API_URL: process.env.API_URL,
        RICC_ENV: process.env.RICC_ENV,
        OCCASIONAL_MESSAGE: process.env.OCCASIONAL_MESSAGE,
      },
      cloudRun: {
        REVISION_ID: process.env.REVISION_ID,
        TRIGGER_NAME: process.env.TRIGGER_NAME,
        TAG_NAME: process.env.TAG_NAME,
        SHORT_SHA: process.env.SHORT_SHA,
      },
      db: {
        talks: talksCount,
        articles: articlesCount,
      },
    };

    return NextResponse.json(config);
  } catch (error) {
    console.error('Failed to fetch config:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
