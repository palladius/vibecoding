
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Article {
  title: string;
  publish_date: string;
  tags: string;
  image: string;
  url: string;
  slug: string;
  resource_type: string;
  video_url?: string;
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  if (!article) {
    return null; // Don't render if article is null or undefined
  }

  return (
    <Link href={`/articles/${article.slug}`}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white">
        <div className="relative" style={{ paddingBottom: '75%' }}>
          {article.image ? (
            <Image src={article.image || '/images/placeholder-image.png'} alt={article.title} fill style={{ objectFit: 'cover' }} />
          ) : article.video_url ? (
            <iframe
              src={article.video_url.replace("watch?v=", "embed/")}
              title={article.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute top-0 left-0 w-full h-full"
            ></iframe>
          ) : (
            <Image src={'/images/placeholder-image.png'} alt="Placeholder" fill style={{ objectFit: 'cover' }} />
          )}
        </div>
        <div className="p-4">
          <p className="text-lg font-bold mb-2">{article.title}</p>
          <p className="text-sm text-gray-400 mb-2">{article.publish_date}</p>
          <p className="text-sm text-gray-400 mb-2">{article.resource_type}</p>
          <div>
            {article.tags.split(',').map((tag) => (
              <span
                key={tag}
                className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
