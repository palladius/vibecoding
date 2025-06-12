"use client";

import { useEffect, useState } from "react";
import ItemsList from "./components/ItemsList";
import { getTalks, getArticles } from "./lib/data";
import { Talk, Article } from "../lib/types";

export default function Home() {
  const [items, setItems] = useState<(Talk | Article)[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const talksData = await getTalks();
      const articlesData = await getArticles();
      
      const talks = talksData.map((talk: Talk) => ({ ...talk, type: 'talk' }));
      const articles = articlesData.map((article: Article) => ({ ...article, type: 'article' }));

      setItems([...talks, ...articles]);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-16">
        <ItemsList items={items} />
      </main>
    </div>
  );
}
