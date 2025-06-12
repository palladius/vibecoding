"use client";

import TalkCard from "./TalkCard";
import ArticleCard from "./ArticleCard";

interface Talk {
  id: number;
  title: string;
  event?: string;
  date?: string;
  location?: string;
  tags?: string;
  image?: string;
  country_code?: string;
  type: 'talk';
}

interface Article {
  id: number;
  title: string;
  url?: string;
  publish_date?: string;
  tags?: string;
  image?: string;
  type: 'article';
}

type Item = Talk | Article;

export default function ItemsList({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="items-list-container">
      {items.map((item) => {
        if (item.type === 'talk') {
          const talkWithDefaults = {
            ...item,
            event: item.event || '',
            publish_date: item.date || '',
            location: item.location || '',
            tags: item.tags || '',
            image: item.image || '/images/placeholder-image.png',
            country_code: item.country_code || 'xx',
            slug: item.slug || '',
          };
          return <TalkCard key={`talk-${item.id}`} talk={talkWithDefaults} />;
        } else {
          const articleWithDefaults = {
            ...item,
            url: item.url || '',
            publish_date: item.publish_date || '',
            tags: item.tags || '',
            image: item.image || '/images/placeholder-image.png',
          };
          return <ArticleCard key={`article-${item.id}`} article={articleWithDefaults} />;
        }
      })}
    </div>
  );
}
