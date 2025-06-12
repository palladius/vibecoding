
import fs from 'fs';
import yaml from 'js-yaml';
import fetch from 'node-fetch';

const APIFLASH_ACCESS_KEY = process.env.APIFLASH_ACCESS_KEY;

if (!APIFLASH_ACCESS_KEY) {
  console.error('APIFLASH_ACCESS_KEY environment variable not set.');
  process.exit(1);
}

async function generateScreenshot(url: string, path: string) {
  const response = await fetch(`https://api.apiflash.com/v1/urltoimage?access_key=${APIFLASH_ACCESS_KEY}&url=${url}&format=jpeg&quality=90&width=1200&height=900&response_type=image`);
  const dest = fs.createWriteStream(path);
  response.body.pipe(dest);
}

async function processData() {
  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as any;

  for (const talk of data.talks) {
    if (talk.image === '/images/placeholder-image.png' && talk.session_url) {
      const imageName = `${talk.event.replace(/\s/g, '-')}-${talk.date}.jpeg`;
      const imagePath = `public/images/generated/${imageName}`;
      await generateScreenshot(talk.session_url, imagePath);
      talk.image = `/images/generated/${imageName}`;
      console.log(`Generated screenshot for talk: ${talk.title}`);
    }
  }

  for (const article of data.articles) {
    if (article.image === '/images/placeholder-image.png' && article.url) {
      const imageName = `${article.title.replace(/\s/g, '-')}.jpeg`;
      const imagePath = `public/images/generated/${imageName}`;
      await generateScreenshot(article.url, imagePath);
      article.image = `/images/generated/${imageName}`;
      console.log(`Generated screenshot for article: ${article.title}`);
    }
  }

  fs.writeFileSync('etc/data.yaml', yaml.dump(data));
  console.log('Data updated successfully!');
}

processData().catch(console.error);
