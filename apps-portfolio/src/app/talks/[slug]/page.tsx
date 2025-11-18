// src/app/talks/[slug]/page.tsx
import { getTalk } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const talk = await getTalk(slug);

  if (!talk) {
    return { title: 'Talk not found' };
  }
  const emoji = talk.sheetless_id ? '🛌 ' : '';
  return { title: `${emoji}${talk.title}` };
}

export default async function TalkPage({ params }: { params: { slug:string } }) {
  const awaitedParams = await params;
  const slug = awaitedParams.slug;
  const talk = await getTalk(slug); // Use the awaited slug

  if (!talk) {
    notFound();
  }

  const tags = talk.tags?.split(',').map(tag => tag.trim());

  return (
    <div className="container mx-auto p-4">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-2/3">
          <h1 className="text-3xl font-bold mb-2">{talk.title}</h1>
          <h2 className="text-xl font-semibold text-gray-400 mb-4">{talk.event}</h2>
          
          <div className="flex items-center text-gray-500 mb-4">
            <span className="mr-4">🗓️ {talk.date}</span>
            <span className="flex items-center">
              {talk.country_code === 'remote' ? (
                <Image
                  src="/globe.svg"
                  width="20"
                  height="20"
                  alt="Online"
                  className="mr-2"
                />
              ) : (
                <Image
                  src={`https://flagcdn.com/w40/${talk.country_code.toLowerCase()}.png`}
                  width="20"
                  height="15"
                  alt={talk.country_code}
                  className="mr-2"
                />
              )}
              {talk.location}
            </span>
          </div>

          {talk.status && (
            <p className="mb-4">
              <strong>Status:</strong> <span className="bg-blue-800 text-white px-2 py-1 rounded-full text-sm">{talk.status}</span>
            </p>
          )}

          {talk.talk_description && <p className="mb-4">{talk.talk_description}</p>}
          {talk.event_description && <p className="text-sm text-gray-400 mb-4">{talk.event_description}</p>}

          <div className="flex flex-wrap gap-4 mt-4">
            {talk.event_url && <Link href={talk.event_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">🔗 {talk.event_url}</Link>}
            {talk.session_url && <Link href={talk.session_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">📖 Session Details</Link>}
            {talk.slides_url && <Link href={talk.slides_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">📊 View Slides</Link>}
            {talk.video_url && <Link href={talk.video_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">📹 Watch Video</Link>}
            {talk.sheetless_id && <Link href={`https://sheetless-das.googleplex.com/event/view?id=${talk.sheetless_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">🛌 Sheetless Link</Link>}
            {talk.bug_id && <Link href={`https://b/${talk.bug_id}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">🐛 Bug</Link>}
          </div>

          {tags && tags.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                  <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                    <span className="bg-gray-700 text-gray-300 px-3 py-1 rounded-full text-sm hover:bg-gray-600">#{tag}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3">
          {talk.image && (
            <div className="relative h-80 w-full">
              <Image
                src={talk.image}
                alt={talk.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover rounded-lg border-2 border-gray-700 opacity-90 shadow-lg"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}