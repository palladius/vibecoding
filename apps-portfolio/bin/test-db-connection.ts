// bin/test-db-connection.ts
import { PrismaClient } from '@prisma/client';
import path from 'path';

async function testDbConnection() {
  const dbPath = path.resolve(process.cwd(), 'db', 'portfolio.sqlite3');
  console.log('Attempting to connect to database at:', dbPath);

  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: `file:${dbPath}`,
      },
    },
  });

  try {
    const talks = await prisma.talk.findMany();
    console.log('Successfully connected to DB and fetched talks:', talks.length, talks);
  } catch (error) {
    console.error('Error connecting to DB or fetching talks:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDbConnection();
