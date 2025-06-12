import fs from 'fs';
import yaml from 'js-yaml';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

const APIFLASH_ACCESS_KEY = process.env.APIFLASH_ACCESS_KEY;

if (!APIFLASH_ACCESS_KEY) {
  console.error('APIFLASH_ACCESS_KEY environment variable not set.');
  process.exit(1);
}

interface Talk {
  title: string;
  image: string;
  event_url?: string;
  session_url?: string;
  event: string;
  date: string;
}

interface Article {
  title: string;
  image: string;
  url: string;
}

interface Data {
  talks: Talk[];
  articles: Article[];
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9-]/g, '-');
}

async function generateScreenshot(url: string, path: string) {
  const response = await fetch(`https://api.apiflash.com/v1/urltoimage?access_key=${APIFLASH_ACCESS_KEY}&url=${url}&format=jpeg&quality=90&width=1200&height=900&response_type=image`);
  if (response.body) {
    const dest = fs.createWriteStream(path);
    response.body.pipe(dest);
  }
}

async function processData() {
  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as Data;
  let generatedCount = 0;

  for (const talk of data.talks) {
    if (generatedCount < 10 && talk.image === '/images/placeholder-image.png') {
      const url = talk.event_url || talk.session_url;
      if (url) {
        const imageName = `${sanitizeFileName(talk.event)}-${talk.date}.jpeg`;
        const imagePath = `public/images/generated/${imageName}`;
        await generateScreenshot(url, imagePath);
        talk.image = `/images/generated/${imageName}`;
        console.log(`Generated screenshot for talk: ${talk.title}`);
        generatedCount++;
      }
    }
  }

  for (const article of data.articles) {
    if (generatedCount < 10 && article.image === '/images/placeholder-image.png' && article.url) {
      const imageName = `${sanitizeFileName(article.title)}.jpeg`;
      const imagePath = `public/images/generated/${imageName}`;
      await generateScreenshot(article.url, imagePath);
      article.image = `/images/generated/${imageName}`;
      console.log(`Generated screenshot for article: ${article.title}`);
      generatedCount++;
    }
  }

  fs.writeFileSync('etc/data.yaml.new', yaml.dump(data));
  fs.renameSync('etc/data.yaml.new', 'etc/data.yaml');
  console.log('Data updated successfully!');
}

processData().catch(console.error);