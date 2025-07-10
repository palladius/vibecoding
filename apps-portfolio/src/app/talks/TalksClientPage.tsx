"use client";

import { useState } from "react";
import ItemsList from "../components/ItemsList";
import { Talk } from "../../lib/types";
import ListView from "../components/ListView";

export default function TalksClientPage({ talks }: { talks: Talk[] }) {
  const [view, setView] = useState('card'); // Default to card view

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <div className="flex justify-center mb-8">
          <button
            className={`px-4 py-2 rounded-l-lg transition-all ${view === 'card' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50' : 'bg-gray-700 text-white'}`}
            onClick={() => setView('card')}
          >
            Card View
          </button>
          <button
            className={`px-4 py-2 rounded-r-lg transition-all ${view === 'list' ? 'bg-yellow-400 text-black shadow-lg shadow-yellow-400/50' : 'bg-gray-700 text-white'}`}
            onClick={() => setView('list')}
          >
            List View
          </button>
        </div>
        {view === 'card' ? (
          <ItemsList items={talks} />
        ) : (
          <ListView items={talks} />
        )}
      </main>
    </div>
  );
}
