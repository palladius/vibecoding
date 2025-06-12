
import TalksList from "./components/TalksList";
import ArticlesList from "./components/ArticlesList";

async function getTalks() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/talks`);
  const talks = await res.json();
  return talks;
}

async function getArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/articles`);
  const articles = await res.json();
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
