import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Talk {
  title: string;
  event: string;
  publish_date: string;
  tags: string;
  image: string;
  country_code: string;
  slug: string;
}

const TalkCard: React.FC<{ talk: Talk }> = ({ talk }) => {
  return (
    <Link href={`/talks/${talk.slug}`}>
      <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-800 text-white">
        <div className="relative" style={{ paddingBottom: '75%' }}>
          <Image src={talk.image} alt={talk.title} fill style={{ objectFit: 'cover' }} />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-bold mb-2">{talk.title}</h3>
          <p className="text-sm text-cyan-300 mb-2">{talk.event} - {talk.publish_date}</p>
          <div className="flex justify-between items-center">
            <div>
              {talk.tags.split(',').map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-full px-2 py-1 text-xs font-semibold mr-2 mb-2"
                >
                  #{tag}
                </span>
              ))}
            </div>
            <Image
              src={`https://flagcdn.com/w40/${talk.country_code.toLowerCase()}.png`}
              width="30"
              height="20"
              alt={talk.country_code}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default TalkCard;