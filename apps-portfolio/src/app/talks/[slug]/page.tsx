// src/app/talks/[slug]/page.tsx
import { getTalk } from '../../lib/data';
import { notFound } from 'next/navigation';

export default async function TalkPage({ params }: { params: { slug: string } }) {
  const talk = await getTalk(params.slug);

  if (!talk) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{talk.title}</h1>
      <p className="text-gray-500 mb-4">{talk.date}</p>
      <p>{talk.talk_description}</p>
    </div>
  );
}