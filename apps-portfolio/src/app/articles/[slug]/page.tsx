// src/app/articles/[slug]/page.tsx
import { getArticle } from '../../lib/data';
import { notFound } from 'next/navigation';

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>
      <p className="text-gray-500 mb-4">{article.publish_date}</p>
      <p>
        Read the full article <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">here</a>.
      </p>
    </div>
  );
}