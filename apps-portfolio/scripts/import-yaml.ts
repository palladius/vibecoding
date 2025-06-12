import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { getDb, setupDb } from '../src/lib/db.js';

interface Talk {
  title: string;
  event: string;
  date: string;
  location: string;
  country_code: string;
  session_url: string;
  video_url: string;
  slides_url: string;
  status: string;
  tags: string[];
  image: string;
}

interface Article {
  title: string;
  url: string;
  publish_date: string;
  tags: string[];
  image: string;
  resource_type: string;
}

interface Data {
  talks: Talk[];
  articles: Article[];
}

async function importData() {
  const db = await getDb();

  // Clear existing data
  await db.exec('DROP TABLE IF EXISTS talks');
  await db.exec('DROP TABLE IF EXISTS articles');
  await setupDb();


  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as Data;

  // Insert talks
  const insertTalk = await db.prepare(
    `INSERT INTO talks (title, event, date, location, country_code, session_url, video_url, slides_url, status, tags, image)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  for (const talk of data.talks) {
    await insertTalk.run(
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
  const insertArticle = await db.prepare(
    `INSERT INTO articles (title, url, publish_date, tags, image, resource_type)
     VALUES (?, ?, ?, ?, ?, ?)`
  );
  for (const article of data.articles) {
    await insertArticle.run(
      article.title,
      article.url,
      article.publish_date,
      article.tags.join(','),
      article.image,
      article.resource_type
    );
  }

  console.log('Data imported successfully!');
}

importData();