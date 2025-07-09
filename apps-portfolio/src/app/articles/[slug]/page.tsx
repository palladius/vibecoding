// src/app/articles/[slug]/page.tsx
import { getArticle } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const tags = article.tags?.split(',').map(tag => tag.trim());

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
          
          <div className="flex items-center text-gray-500 mb-4">
            <span className="mr-4">🗓️ {article.publish_date}</span>
            {article.resource_type && <span className="capitalize">📄 {article.resource_type}</span>}
          </div>

          {article.description && <p className="mb-4">{article.description}</p>}

          {article.talk_description && <p className="mb-4">{article.talk_description}</p>}

          <div className="flex flex-wrap gap-4 mt-4">
            {article.url && <Link href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">🔗 Read Full Article</Link>}
            {article.video_url && <Link href={article.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">📹 Watch Video</Link>}
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <span key={tag} className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm">#{tag}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3">
          {article.image && (
            <div className="relative h-80 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-lg border-2 border-gray-700 opacity-90 shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}