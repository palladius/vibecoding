import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  const db = await getDb();
  const articles = await db.all('SELECT * FROM articles ORDER BY publish_date DESC');
  console.log('Fetched articles:', articles.length);
  return NextResponse.json(articles);
}