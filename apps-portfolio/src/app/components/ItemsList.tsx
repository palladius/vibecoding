"use client";

import TalkCard from "./TalkCard";
import ArticleCard from "./ArticleCard";

interface Talk {
  id: number;
  title: string;
  event: string;
  date: string;
  location: string;
  tags: string;
  image: string;
  country_code: string;
  type: 'talk';
}

interface Article {
  id: number;
  title: string;
  url: string;
  publish_date: string;
  tags: string;
  image: string;
  type: 'article';
}

type Item = Talk | Article;

export default function ItemsList({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {items.map((item) => {
        if (item.type === 'talk') {
          return <TalkCard key={`talk-${item.id}`} talk={item} />;
        } else {
          return <ArticleCard key={`article-${item.id}`} article={item} />;
        }
      })}
    </div>
  );
}
