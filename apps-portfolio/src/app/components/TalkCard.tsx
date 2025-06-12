
import React from 'react';
import Image from 'next/image';

interface Talk {
  title: string;
  event: string;
  date: string;
  tags: string;
  image: string;
  country_code: string;
}

const TalkCard: React.FC<{ talk: Talk }> = ({ talk }) => {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
      <div className="relative" style={{ paddingBottom: '75%' }}>
        <Image src={talk.image} alt={talk.title} layout="fill" objectFit="cover" />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-bold mb-2">{talk.title}</h3>
        <p className="text-sm text-cyan-400 mb-2">{talk.event} - {talk.date}</p>
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
          <img
            src={`https://flagcdn.com/w40/${talk.country_code.toLowerCase()}.png`}
            width="30"
            alt={talk.country_code}
          />
        </div>
      </div>
    </div>
  );
};

export default TalkCard;
