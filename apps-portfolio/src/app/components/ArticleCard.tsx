
import React from 'react';
import Image from 'next/image';

interface Article {
  title: string;
  publish_date: string;
  tags: string;
  image: string;
  url: string;
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image width={600} height={400} className="w-full" src={article.image} alt={article.title} />
      <div className="px-6 py-4">
        <a href={article.url} target="_blank" rel="noopener noreferrer" className="font-bold text-xl mb-2 hover:underline">
          {article.title}
        </a>
        <p className="text-gray-700 text-base">{article.publish_date}</p>
      </div>
      <div className="px-6 pt-4 pb-2">
        {article.tags.split(',').map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ArticleCard;
