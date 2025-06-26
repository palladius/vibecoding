import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

const db = new PrismaClient({ datasources: { db: { url: `file:${path.resolve(process.cwd(), 'prisma', '../db/portfolio.sqlite3')}` } } });

interface Talk {
  title: string;
  event: string;
  date: string;
  location: string;
  country_code: string;
  session_url: string;
  video: string;
  slides_url: string;
  status: string;
  tags: string[];
  image: string;
  event_description: string;
  talk_description: string;
  event_url?: string;
}

interface Article {
  title: string;
  url: string;
  publish_date: string;
  tags: string[];
  image: string;
  video?: string;
  image_old?: string;
  resource_type: string;
  description: string;
}

interface Data {
  talks: Talk[];
  articles: Article[];
}

export async function importData() {
  // Clear existing data
  await db.talk.deleteMany({});
  await db.article.deleteMany({});

  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as Data;

  // Insert talks
  for (const talk of data.talks) {
    try {
      const tags = Array.isArray(talk.tags) ? talk.tags.join(',') : '';
      await db.talk.create({
        data: {
          title: talk.title,
          event: talk.event,
          date: talk.date,
          location: talk.location,
          country_code: talk.country_code,
          session_url: talk.session_url,
          video_url: talk.video,
          slides_url: talk.slides_url,
          status: talk.status,
          tags: tags,
          image: talk.image,
          event_description: talk.event_description,
          talk_description: talk.talk_description,
          event_url: talk.event_url,
        },
      });
    } catch (error) {
      console.error(`Error importing talk "${talk.title}":`, error);
      process.exit(1);
    }
  }

  // Insert articles
  for (const article of data.articles) {
    try {
      const tags = Array.isArray(article.tags) ? article.tags.join(',') : '';
      await db.article.create({
        data: {
          title: article.title,
          url: article.url,
          publish_date: article.publish_date,
          tags: tags,
          image: article.image,
          
          resource_type: article.resource_type,
          description: article.description,
        },
      });
    } catch (error) {
      console.error(`Error importing article "${article.title}":`, error);
      process.exit(1);
    }
  }

  console.log('Data imported successfully!');
}

importData();