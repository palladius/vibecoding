
import ItemsList from "../components/ItemsList";
import { getTalks, getArticles } from "../lib/data";

export default async function CardsPage() {
  const talks = await getTalks();
  const articles = await getArticles();
  const items = [...talks.map(t => ({...t, type: 'talk'})), ...articles.map(a => ({...a, type: 'article'}))];

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Riccardo Carlesso&apos;s Portfolio</h1>
        <ItemsList items={items} />
      </main>
    </div>
  );
}
