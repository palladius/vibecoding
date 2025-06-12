import { NextResponse } from 'next/server';
import Database from 'better-sqlite3';

export async function GET() {
  const db = new Database('./db/portfolio.sqlite3');
  const articles = db.prepare('SELECT * FROM articles ORDER BY publish_date DESC').all();
  return NextResponse.json(articles);
}