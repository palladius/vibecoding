
import { NextResponse } from 'next/server';
import { getDb } from '../../../lib/db';

export async function GET() {
  const db = getDb();
  const talks = db.prepare('SELECT * FROM talks ORDER BY date DESC').all();
  return NextResponse.json(talks);
}
