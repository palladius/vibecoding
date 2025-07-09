"use client";

import { useEffect, useState } from "react";
import ItemsList from "../components/ItemsList";
import { getTalks } from "../lib/data";
import { Talk } from "../../lib/types";
import ListView from "../components/ListView";

export default function TalksPage() {
  const [items, setItems] = useState<Talk[]>([]);
  const [view, setView] = useState('card'); // Default to card view

  useEffect(() => {
    const fetchData = async () => {
      const talks = await getTalks();
      setTalks(talksWithSlugs);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
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
      </main>
    </div>
  );
}
