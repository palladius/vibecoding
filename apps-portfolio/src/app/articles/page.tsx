"use client";

import { useEffect, useState } from "react";
import ItemsList from "../components/ItemsList";
import { getArticles } from "../lib/data";
import { Article } from "../../lib/types";

export default function ArticlesPage() {
  const [items, setItems] = useState<Article[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const articles = await getArticles();
      setItems(articles);
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
