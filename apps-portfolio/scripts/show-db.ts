import { getDb } from '../src/lib/db.js';

async function showDbContent() {
  const db = await getDb();

  console.log('✨ Talks:');
  const talks = await db.all('SELECT date, title FROM talks ORDER BY date DESC');
  if (talks.length === 0) {
    console.log('  (No talks found)');
  } else {
    talks.forEach((talk: any) => {
      console.log(`  ${talk.date} - ${talk.title}`);
    });
  }

  console.log('\n✨ Articles:');
  const articles = await db.all('SELECT publish_date, title FROM articles ORDER BY publish_date DESC');
  if (articles.length === 0) {
    console.log('  (No articles found)');
  } else {
    articles.forEach((article: any) => {
      console.log(`  ${article.publish_date} - ${article.title}`);
    });
  }
}

showDbContent();
