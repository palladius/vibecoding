// src/app/articles/[slug]/page.tsx
import { getArticle } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
          <p className="text-gray-500 mb-4">{article.publish_date}</p>
          <p>
            Read the full article <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">here</a>.
          </p>
        </div>
        <div className="w-full md:w-1/3">
          {article.image && (
            <div className="relative h-64 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover rounded-lg border-2 border-gray-700 opacity-90"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}