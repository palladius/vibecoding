"use client";

import { useEffect, useState } from "react";
import ItemsList from "./components/ItemsList";
import { getTalks, getArticles } from "./lib/data";
import { Talk, Article } from "../lib/types";
import ListView from "./components/ListView";

export default function Home() {
  const [items, setItems] = useState<(Talk | Article)[]>([]);
  const [view, setView] = useState('card'); // Default to card view

  useEffect(() => {
    const fetchData = async () => {
      const talksData = await getTalks();
      const articlesData = await getArticles();
      
      const talks = talksData.map((talk: Talk) => ({ ...talk, type: 'talk' }));
      const articles = articlesData.map((article: Article) => ({ ...article, type: 'article' }));

      setItems([...talks, ...articles]);
      console.log('Total items set in state:', talks.length + articles.length);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]" data-testid="home-container">
      <main className="flex flex-col gap-16">
        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 rounded-l-lg ${view === 'card' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
            onClick={() => setView('card')}
          >
            Card View
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg ${view === 'list' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
        </div>
        {view === 'card' ? (
          <ItemsList items={items} />
        ) : (
          <ListView items={items} />
        )}
        <p className="text-center text-gray-500 text-sm mt-8">
          Total items: {items.length} (🗣️ {items.filter(item => item.type === 'talk').length} talks, ✍️ {items.filter(item => item.type === 'article').length} articles)
        </p>
      </main>
    </div>
  );
}
