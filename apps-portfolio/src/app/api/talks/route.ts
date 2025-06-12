import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET() {
  const db = new Database('./db/portfolio.sqlite3');
  const talks = db.prepare('SELECT * FROM talks ORDER BY date DESC').all();
  return NextResponse.json(talks);
}