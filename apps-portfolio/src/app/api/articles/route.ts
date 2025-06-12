
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  const db = getDb();
  const articles = db.prepare('SELECT * FROM articles ORDER BY publish_date DESC').all();
  return NextResponse.json(articles);
}
