import TalksList from "./components/TalksList";
import ArticlesList from "./components/ArticlesList";
import { getDb } from "../lib/db";

async function getTalks() {
  const db = await getDb();
  const talks = await db.all("SELECT * FROM talks ORDER BY date DESC");
  return talks;
}

async function getArticles() {
  const db = await getDb();
  const articles = await db.all("SELECT * FROM articles ORDER BY publish_date DESC");
  return articles;
}

export default async function Home() {
  const talks = await getTalks();
  const articles = await getArticles();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Riccardo Carlesso&apos;s Portfolio</h1>
        <TalksList talks={talks} />
        <ArticlesList articles={articles} />
      </main>
    </div>
  );
}