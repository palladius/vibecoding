
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { getDb, setupDb } from '../src/lib/db.js';

async function importData() {
  setupDb();
  const db = getDb();

  // Clear existing data
  db.exec('DROP TABLE IF EXISTS talks');
  db.exec('DROP TABLE IF EXISTS articles');
  setupDb();


  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as any;

  // Insert talks
  const insertTalk = db.prepare(
    `INSERT INTO talks (title, event, date, location, country_code, session_url, video_url, slides_url, status, tags, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const talk of data.talks) {
    insertTalk.run(
      talk.title,
      talk.event,
      talk.date,
      talk.location,
      talk.country_code,
      talk.session_url,
      talk.video_url,
      talk.slides_url,
      talk.status,
      talk.tags.join(','),
      talk.image
    );
  }

  // Insert articles
  const insertArticle = db.prepare(
    `INSERT INTO articles (title, url, publish_date, tags, image)
     VALUES (?, ?, ?, ?, ?)`
  );
  for (const article of data.articles) {
    insertArticle.run(
      article.title,
      article.url,
      article.publish_date,
      article.tags.join(','),
      article.image
    );
  }

  console.log('Data imported successfully!');
}

importData();
