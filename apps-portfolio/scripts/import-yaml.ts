
import fs from "fs";
import yaml from "js-yaml";
import { getDb, setupDb } from "../src/lib/db";

interface Talk {
  title: string;
  event?: string;
  date?: string;
  location?: string;
  session_url?: string;
  video_url?: string;
  slides_url?: string;
  status?: string;
  tags?: string[];
}

interface Article {
  title: string;
  url?: string;
  publish_date?: string;
  tags?: string[];
}

interface PortfolioData {
  schema_version: string;
  talks: Talk[];
  articles: Article[];
}

async function main() {
  await setupDb();
  const db = await getDb();

  const yamlFile = fs.readFileSync("etc/data.yaml", "utf8");
  const data = yaml.load(yamlFile) as PortfolioData;

  for (const talk of data.talks) {
    await db.run(
      `INSERT INTO talks (title, event, date, location, session_url, video_url, slides_url, status, tags)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      talk.title,
      talk.event,
      talk.date,
      talk.location,
      talk.session_url,
      talk.video_url,
      talk.slides_url,
      talk.status,
      talk.tags?.join(",")
    );
  }

  for (const article of data.articles) {
    await db.run(
      `INSERT INTO articles (title, url, publish_date, tags)
       VALUES (?, ?, ?, ?)`,
      article.title,
      article.url,
      article.publish_date,
      article.tags?.join(",")
    );
  }

  console.log("✅ Data imported successfully!");
}

main().catch((err) => {
  console.error("Error importing data:", err);
  process.exit(1);
});
