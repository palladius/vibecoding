import { getTalks, getArticles } from "./lib/data";
import { Talk, Article } from "../lib/types";
import ViewSwitcher from "./components/ViewSwitcher";

export default async function Home() {
  const talksData = await getTalks();
  const articlesData = await getArticles();

  const talks = talksData.map((talk: Talk) => ({ ...talk, type: 'talk' }));
  const articles = articlesData.map((article: Article) => ({ ...article, type: 'article' }));

  const items = [...talks, ...articles];

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]" data-testid="home-container">
      <main className="flex flex-col gap-16">
        <ViewSwitcher items={items} />
        <p className="text-center text-gray-500 text-sm mt-8">
          Total items: {items.length} (🗣️ {items.filter(item => item.type === 'talk').length} talks, ✍️ {items.filter(item => item.type === 'article').length} articles)
        </p>
      </main>
    </div>
  );
}
