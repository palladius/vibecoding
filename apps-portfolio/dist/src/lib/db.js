import Database from 'better-sqlite3';
export function setupDb() {
    const db = new Database('./db/portfolio.sqlite3');
    db.exec(`
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
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      url TEXT,
      publish_date TEXT,
      tags TEXT,
      image TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}
