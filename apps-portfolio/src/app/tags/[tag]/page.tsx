import { getTalksAndArticlesByTag } from '@/app/lib/data';
import TalkCard from '@/app/components/TalkCard';
import ArticleCard from '@/app/components/ArticleCard';

export default async function TagPage({ params }: { params: { tag: string } }) {
  const { talks, articles } = await getTalksAndArticlesByTag(params.tag);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <h1 className="text-4xl font-bold">#{params.tag}</h1>
      </div>

      <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {talks.map((talk) => (
          <TalkCard key={talk.id} talk={talk} />
        ))}
        {articles.map((article) => (
          <ArticleCard key={article.id} article={article} />
        ))}
      </div>
    </main>
  );
}
