"use client";

import TalkCard from "./TalkCard";
import ArticleCard from "./ArticleCard";
import { Talk, Article } from "../../lib/types";


type Item = Talk | Article;

export default function ItemsList({ items }: { items: Item[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="items-list-container">
      {items.map((item) => {
        if (item.type === 'talk') {
          const talkWithDefaults = {
            id: item.id,
            ...item,
            event: item.event || '',
            date: item.date || '',
            location: item.location || '',
            tags: item.tags || '',
            image: item.image || '/images/placeholder-image.png',
            country_code: item.country_code || 'xx',
            slug: item.slug || '',
          };
          return <TalkCard key={`talk-${item.id}`} talk={talkWithDefaults} />;
        } else if (item.type === 'article') {
          const articleWithDefaults = {
            id: item.id,
            ...item,
            url: item.url || '',
            publish_date: item.publish_date || '',
            tags: item.tags || '',
            image: item.image || '/images/placeholder-image.png',
            slug: item.slug || '',
            resource_type: item.resource_type || ''
          };
          return <ArticleCard key={`article-${item.id}`} article={articleWithDefaults} />;
        }
        return null
      })}
    </div>
  );
}
