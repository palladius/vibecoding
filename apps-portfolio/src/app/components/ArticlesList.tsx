
"use client";

import { useState } from "react";
import ArticleCard from "./ArticleCard";
import Link from "next/link";

interface Article {
  id: number;
  title: string;
  url: string;
  publish_date: string;
  tags: string;
  image: string;
}

export default function ArticlesList({ articles, initialView = 'list' }: { articles: Article[], initialView?: 'list' | 'card' }) {
  const [view, setView] = useState(initialView);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Articles</h2>
        <div>
          <Link href="/" className={`px-4 py-2 rounded-md ${view === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>List</Link>
          <Link href="/cards" className={`px-4 py-2 rounded-md ${view === 'card' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>Cards</Link>
        </div>
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
