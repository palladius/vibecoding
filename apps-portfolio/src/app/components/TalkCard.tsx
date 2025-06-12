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
    <div className="max-w-sm rounded overflow-hidden shadow-lg">
      <Image width={600} height={400} className="w-full" src={talk.image} alt={talk.title} />
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">{talk.title}</div>
        <p className="text-gray-700 text-base">
          {talk.event} - {talk.date}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2 flex justify-between items-center">
        <div>
          {talk.tags.split(',').map((tag) => (
            <span
              key={tag}
              className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
            >
              #{tag}
            </span>
          ))}
        </div>
        <img
          src={`https://flagcdn.com/w40/${talk.country_code.toLowerCase()}.png`}
          width="40"
          alt={talk.country_code}
        />
      </div>
    </div>
  );
};

export default TalkCard;