// src/app/talks/[slug]/page.tsx
import { getTalk } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

export default async function TalkPage({ params }: { params: { slug: string } }) {
  const talk = await getTalk(params.slug);

  if (!talk) {
    notFound();
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-2xl font-bold mb-4">{talk.title}</h1>
          <p className="text-gray-500 mb-4">{talk.date}</p>
          <p>{talk.talk_description}</p>
        </div>
        <div className="w-full md:w-1/3">
          {talk.image && (
            <div className="relative h-64 w-full">
              <Image
                src={talk.image}
                alt={talk.title}
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