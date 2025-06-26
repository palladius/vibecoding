// src/app/articles/[slug]/page.tsx
import { getArticle } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const resourceTypeEmojis: { [key: string]: string } = {
  article: '📄',
  video: '📺',
};

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const article = await getArticle(params.slug);

  if (!article) {
    notFound();
  }

  const emoji = resourceTypeEmojis[article.resource_type] || '📄';

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
          <p className="text-lg text-gray-400 mb-4">{article.publish_date}</p>
          <p className="text-lg text-gray-400 mb-4">
            {emoji} {article.resource_type.charAt(0).toUpperCase() + article.resource_type.slice(1)}
          </p>
        </div>
        <div className="w-2/3">
          <Image
            src={article.image}
            alt={article.title}
            width={800}
            height={600}
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="mt-8">
        {article.description && (
          <>
            <h2 className="text-2xl font-bold mb-4">Description</h2>
            <p>{article.description}</p>
          </>
        )}
        <p className="mt-8">
          <a href={article.url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
            {article.url}
          </a>
        </p>
        {article.video && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Video</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(article.video)}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function extractYouTubeVideoId(url: string) {
  if (!url) {
    return null;
  }
  const regex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = url.match(regex);
  return match ? match[1] : null;
}
