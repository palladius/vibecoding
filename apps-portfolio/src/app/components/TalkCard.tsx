import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Talk {
  title: string;
  event: string;
  date: string;
  tags: string;
  image: string;
  country_code: string;
  slug: string;
  status?: string;
  sheetless_id?: number;
}

const statusEmojis: { [key: string]: string } = {
  cfp_applied: '🤞',
  confirmed: '✅',
  delivered: '🎤',
};

const TalkCard: React.FC<{ talk: Talk, proximity?: string }> = ({ talk, proximity }) => {
  const cardClasses = `max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white ${proximity ? 'col-span-2' : ''}`;
  return (
    <Link href={`/talks/${talk.slug}`}>
      <div className={cardClasses}>
        <div className="relative" style={{ paddingBottom: '75%' }}>
          <Image src={talk.image} alt={talk.title} fill style={{ objectFit: 'cover' }} />
          {proximity && (
            <div className="absolute top-0 left-0 bg-yellow-400 text-black text-2xl font-bold p-2">
              {proximity}
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{talk.title}</h3>
          <p className="text-sm text-cyan-300 mb-2">{talk.event} {talk.sheetless_id ? '🛌' : '-'} {talk.date}</p>
          {talk.status && (
            <p className="text-sm text-gray-400 mb-2">
              {statusEmojis[talk.status]} {talk.status.charAt(0).toUpperCase() + talk.status.slice(1)}
            </p>
          )}
          <div className="flex justify-between items-center">
            <div>
              {talk.tags.split(',').map((tag) => (
                <Link key={tag} href={`/tags/${tag.toLowerCase()}`}>
                  <span
                    className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
                  >
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
            <Image
              src={`https://flagcdn.com/w40/${talk.country_code.toLowerCase()}.png`}
              width="30"
              height="20"
              alt={talk.country_code}
              unoptimized
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TalkCard;