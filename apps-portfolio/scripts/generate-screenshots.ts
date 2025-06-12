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
  image?: string;
  event_url?: string;
  session_url?: string;
  event: string;
  date: string;
}

interface Article {
  title: string;
  image?: string;
  url: string;
}

interface Data {
  talks: Talk[];
  articles: Article[];
}

function sanitizeFileName(fileName: string) {
  return fileName.replace(/[^a-zA-Z0-9-]/g, '-');
}

async function generateScreenshot(url: string, path: string): Promise<boolean> {
  try {
    const response = await fetch(`https://api.apiflash.com/v1/urltoimage?access_key=${APIFLASH_ACCESS_KEY}&url=${url}&format=jpeg&quality=90&width=1200&height=900&response_type=image`);

    if (!response.ok) {
      console.error(`API Flash error for ${url}: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error(`Error details: ${errorText}`);
      return false;
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.startsWith('image/')) {
      console.error(`API Flash returned non-image content for ${url}. Content-Type: ${contentType}`);
      const errorText = await response.text();
      console.error(`Content details: ${errorText}`);
      return false;
    }

    if (response.body) {
      const dest = fs.createWriteStream(path);
      await new Promise((resolve, reject) => {
        response.body!.pipe(dest);
        response.body!.on('end', resolve);
        dest.on('error', reject);
      });
      return true;
    } else {
      console.error(`API Flash returned no body for ${url}.`);
      return false;
    }
  } catch (error) {
    console.error(`Failed to generate screenshot for ${url}:`, error);
    return false;
  }
}

async function processData() {
  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as Data;
  let generatedCount = 0;

  for (const talk of data.talks) {
    if (true) { // Temporarily force regeneration
      const url = talk.event_url || talk.session_url;
      if (url) {
        const imageName = `${sanitizeFileName(talk.event)}-${talk.date}.jpeg`;
        const imagePath = `public/images/generated/${imageName}`;
        const success = await generateScreenshot(url, imagePath);
        if (success) {
          talk.image = `/images/generated/${imageName}`;
          console.log(`Generated screenshot for talk: ${talk.title}`);
          generatedCount++;
        }
      }
    }
  }

  for (const article of data.articles) {
    if (generatedCount < 10 && (!article.image || article.image === '/images/placeholder-image.png') && article.url) {
      const imageName = `${sanitizeFileName(article.title)}.jpeg`;
      const imagePath = `public/images/generated/${imageName}`;
      const success = await generateScreenshot(article.url, imagePath);
      if (success) {
        article.image = `/images/generated/${imageName}`;
        console.log(`Generated screenshot for article: ${article.title}`);
        generatedCount++;
      }
    }
  }

  fs.writeFileSync('etc/data.yaml.new', yaml.dump(data));
  fs.renameSync('etc/data.yaml.new', 'etc/data.yaml');
  console.log('Data updated successfully!');
}

processData().catch(console.error);