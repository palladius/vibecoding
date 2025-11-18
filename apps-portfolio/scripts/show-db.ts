import { db } from '../src/lib/db';

async function showDbContent() {
  console.log('✨ Talks:');
  const talks = await db.talk.findMany({
    orderBy: {
      date: 'desc',
    },
  });
  if (talks.length === 0) {
    console.log('  (No talks found)');
  } else {
  talks.forEach(talk => {
    console.log(`  ${talk.date} - ${talk.title} (Bug ID: ${talk.bug_id || 'N/A'})`);
  });
  }

  console.log('\n✨ Articles:');
  const articles = await db.article.findMany({
    orderBy: {
      publish_date: 'desc',
    },
  });
  if (articles.length === 0) {
    console.log('  (No articles found)');
  } else {
    articles.forEach((article) => {
      console.log(`  ${article.publish_date} - ${article.title}`);
    });
  }
}

showDbContent();
