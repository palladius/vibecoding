import ArticlesList from "../components/ArticlesList";
import { getArticles } from "../lib/data";

export default async function ArticlesPage() {
  const articles = await getArticles();

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Articles</h1>
        <ArticlesList articles={articles} initialView="list" />
      </main>
    </div>
  );
}
