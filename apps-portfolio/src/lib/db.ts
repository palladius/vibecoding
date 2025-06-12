import { open } from "sqlite";
import sqlite3 from "sqlite3";

let db = null;

export async function getDb() {
  if (!db) {
    db = await open({
      filename: "./db/portfolio.sqlite3",
      driver: sqlite3.Database,
    });
  }
  return db;
}

export async function setupDb() {
  const db = await getDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS talks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      event TEXT,
      date TEXT,
      location TEXT,
      country_code TEXT,
      session_url TEXT,
      video_url TEXT,
      slides_url TEXT,
      status TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT,
      publish_date TEXT,
      tags TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}