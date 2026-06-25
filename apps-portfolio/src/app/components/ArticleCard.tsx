
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { extractYouTubeVideoId } from '../../lib/utils';

interface Article {
  title: string;
  publish_date: string;
  tags: string;
  image?: string;
  url?: string;
  slug: string;
  resource_type: string;
  video_url?: string;
  slides_url?: string;
  bug_id?: number;
  cta_text?: string;
  cta_url?: string;
  links?: string;
  relevance?: number;
}

const ArticleCard: React.FC<{ article: Article }> = ({ article }) => {
  if (!article) {
    return null; // Don't render if article is null or undefined
  }

  // Derive thumbnail image
  let displayImage = article.image || '';
  if (!displayImage && article.video_url) {
    try {
      const ytId = extractYouTubeVideoId(article.video_url);
      if (ytId) {
        displayImage = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      }
    } catch (e) {
      console.warn("Failed to extract YouTube ID for thumbnail:", e);
    }
  }
  if (!displayImage) {
    displayImage = '/images/placeholder-image.png';
  }

  const detailHref = article.resource_type === 'video' ? `/videos/${article.slug}` : `/articles/${article.slug}`;

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white flex flex-col justify-between h-full border border-gray-700">
      <div>
        <div className="relative" style={{ paddingBottom: '56.25%' }}> {/* 16:9 ratio for video thumbnails */}
          <Link href={detailHref}>
            <Image 
              src={displayImage} 
              alt={article.title} 
              fill 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" 
              style={{ objectFit: 'cover' }} 
              className="transition-opacity duration-300 hover:opacity-90 cursor-pointer"
            />
          </Link>
        </div>
        <div className="p-4">
          <Link href={detailHref}>
            <p className="text-lg font-bold mb-2 hover:text-yellow-400 transition-colors duration-200">{article.title}</p>
          </Link>
          <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
            <span>🗓️ {article.publish_date}</span>
            <span className="capitalize px-2 py-0.5 rounded text-xs bg-gray-700 text-gray-300">
              {article.resource_type === 'video' ? '📹 Video' : article.resource_type === 'slides' ? '📊 Slides' : '📄 Article'}
            </span>
          </div>
          
          {article.tags && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {article.tags.split(',').map((tag) => (
                <Link key={tag} href={`/tags/${tag.toLowerCase().replace(/ /g, '_')}`}>
                  <span className="inline-block bg-gray-700 text-gray-300 rounded px-2 py-0.5 text-xs font-mono hover:bg-yellow-400 hover:text-black transition-colors duration-200">
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Call to action at the bottom of the card */}
      <div className="p-4 pt-0">
        {article.cta_text && article.cta_url ? (
          <a
            href={article.cta_url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-yellow-400 hover:bg-yellow-300 text-black text-center font-bold py-2 px-4 rounded text-sm transition-colors duration-200"
          >
            {article.cta_text}
          </a>
        ) : article.url ? (
          <a
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full border border-yellow-400 hover:bg-yellow-400 hover:text-black text-yellow-400 text-center font-bold py-2 px-4 rounded text-sm transition-all duration-200"
          >
            {article.resource_type === 'video' ? 'Watch Video' : 'Read Article'}
          </a>
        ) : (
          <Link
            href={detailHref}
            className="block w-full border border-gray-600 hover:bg-gray-700 text-gray-300 text-center font-semibold py-2 px-4 rounded text-sm transition-colors duration-200"
          >
            View Details
          </Link>
        )}
      </div>
    </div>
  );
};

export default ArticleCard;
