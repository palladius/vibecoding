import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  const db = await getDb();
  const talks = await db.all('SELECT * FROM talks ORDER BY date DESC');
  console.log('Fetched talks:', talks.length);
  return NextResponse.json(talks);
}