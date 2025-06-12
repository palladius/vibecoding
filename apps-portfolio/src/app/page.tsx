import TalksList from "./components/TalksList";
import ArticlesList from "./components/ArticlesList";
import { getTalks, getArticles } from "./lib/data";

export default async function Home() {
  const talks = await getTalks();
  const articles = await getArticles();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Riccardo Carlesso&apos;s Portfolio</h1>
        <TalksList talks={talks} initialView="list" />
        <ArticlesList articles={articles} initialView="list" />
      </main>
    </div>
  );
}
