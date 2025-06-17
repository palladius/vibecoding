"use client";

import { useState } from "react";
import ItemsList from "./ItemsList";
import ListView from "./ListView";
import { Talk, Article } from "../../lib/types";

export default function ViewSwitcher({ items }: { items: (Talk | Article)[] }) {
  const [view, setView] = useState('card');

  return (
    <div>
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
    </div>
  );
}