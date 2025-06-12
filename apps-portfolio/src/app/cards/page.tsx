
"use client";

import { useEffect, useState } from "react";
import ItemsList from "../components/ItemsList";
import { getTalks, getArticles } from "../lib/data";
import { Talk, Article } from "../../lib/types";

export default function CardsPage() {
  const [items, setItems] = useState<(Talk | Article)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const talks = await getTalks();
      const articles = await getArticles();
      setItems([...talks, ...articles]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <h1 className="text-4xl font-bold text-center">Riccardo Carlesso&apos;s Portfolio</h1>
        <ItemsList items={items} />
      </main>
    </div>
  );
}
