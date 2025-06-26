// src/app/talks/[slug]/page.tsx
import { getTalk } from '../../lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';

const resourceTypeEmojis: { [key: string]: string } = {
  presentation: '📽️',
  workshop: '🛠️',
};

const statusEmojis: { [key: string]: string } = {
  cfp_applied: '📝',
  confirmed: '✅',
  delivered: '🎤',
};

export default async function TalkPage({ params }: { params: { slug:string } }) {
  const talk = await getTalk(params.slug);

  if (!talk) {
    notFound();
    return null;
  }

  const resourceType = talk.tags.includes('workshop') ? 'workshop' : 'presentation';
  const emoji = resourceTypeEmojis[resourceType];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold mb-4">{talk.title}</h1>
          <p className="text-lg text-gray-400 mb-4">{talk.event} - {talk.date}</p>
          {talk.status && (
            <p className="text-lg text-gray-400 mb-4">
              {statusEmojis[talk.status]} {talk.status.charAt(0).toUpperCase() + talk.status.slice(1)}
            </p>
          )}
          <p className="text-lg text-gray-400 mb-4">
            {emoji} {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
          </p>
        </div>
        <div className="w-2/3">
          <Image
            src={talk.image}
            alt={talk.title}
            width={800}
            height={600}
            className="rounded-lg"
          />
        </div>
      </div>
      <div className="mt-8">
        {talk.event_description && (
          <>
            <h2 className="text-2xl font-bold mb-4">Event Description</h2>
            <p>{talk.event_description}</p>
          </>
        )}
        {talk.talk_description && (
          <>
            <h2 className="text-2xl font-bold mb-4 mt-8">Talk Description</h2>
            <p>{talk.talk_description}</p>
          </>
        )}
        <h2 className="text-2xl font-bold mb-4 mt-8">Resources</h2>
        <ul>
          {talk.session_url && (
            <li>
              <a href={talk.session_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Session URL
              </a>
            </li>
          )}
          {talk.video && (
            <li>
              <a href={talk.video} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Video URL
              </a>
            </li>
          )}
          {talk.slides_url && (
            <li>
              <a href={talk.slides_url} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                Slides URL
              </a>
            </li>
          )}
        </ul>
        {talk.video && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">Video</h2>
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={`https://www.youtube.com/embed/${extractYouTubeVideoId(talk.video)}`}
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
