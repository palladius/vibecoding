
"use client";

import { useState, useEffect } from "react";
import { getDb } from "../../lib/db";
import ArticleCard from "./ArticleCard";

interface Article {
  id: number;
  title: string;
  url: string;
  publish_date: string;
  tags: string;
  image: string;
}

async function getArticles() {
  const db = await getDb();
  const articles: Article[] = await db.all("SELECT * FROM articles ORDER BY publish_date DESC");
  return articles.map(article => ({ ...article, image: 'https://placehold.co/600x400' }));
}

export default function ArticlesList() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [view, setView] = useState("list"); // "list" or "card"

  useEffect(() => {
    getArticles().then(setArticles);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Articles</h2>
        <button
          onClick={() => setView(view === "list" ? "card" : "list")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
        >
          Toggle View
        </button>
      </div>
      {view === "list" ? (
        <ul>
          {articles.map((article) => (
            <li key={article.id} className="mb-4">
              <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-xl font-semibold hover:underline">
                {article.title}
              </a>
              <p className="text-gray-600">{article.publish_date}</p>
              {article.tags && (
                <div className="flex gap-2 mt-2">
                  {article.tags.split(",").map((tag: string) => (
                    <span key={tag} className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {articles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>
      )}
    </div>
  );
}
