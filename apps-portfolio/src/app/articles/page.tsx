import ItemsList from "../components/ItemsList";
import { getArticles } from "../lib/data";

export default async function ArticlesPage() {
  const articles = await getArticles();
  const items = articles.map(a => ({...a, type: 'article'}));

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <ItemsList items={items} />
      </main>
    </div>
  );
}
