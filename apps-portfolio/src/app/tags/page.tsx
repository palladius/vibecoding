import React from 'react';
import { getAllTags } from '@/app/lib/data';
import Link from 'next/link';

const TagsPage = async () => {
  const tags = (await getAllTags()).sort((a, b) => a.name.localeCompare(b.name));

  const getFontSize = (count: number) => {
    const minCount = Math.min(...tags.map((tag) => tag.count));
    const maxCount = Math.max(...tags.map((tag) => tag.count));
    const sizeRange = ['text-xs', 'text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-5xl'];

    if (maxCount === minCount) {
      return 'text-base';
    }

    const minLog = Math.log(minCount);
    const maxLog = Math.log(maxCount);
    const logRange = maxLog - minLog;

    if (logRange === 0) {
      return 'text-base';
    }

    const logCount = Math.log(count);
    const scale = (logCount - minLog) / logRange;
    const sizeIndex = Math.floor(scale * (sizeRange.length - 1));

    return sizeRange[sizeIndex] || 'text-base';
  };

  const getColor = (tagName: string) => {
    const googleColors = [
      'text-blue-500', // Google Blue
      'text-red-500',  // Google Red
      'text-yellow-500', // Google Yellow
      'text-green-500', // Google Green
    ];
    let hash = 0;
    for (let i = 0; i < tagName.length; i++) {
      hash = tagName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash % googleColors.length);
    return googleColors[index];
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold">Tags</h1>
      <div className="mt-12 flex flex-wrap justify-center items-center gap-x-6 gap-y-4">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name.toLowerCase().replace(/ /g, '_')}`}
            className={`font-semibold hover:scale-110 transition-transform duration-200 ${getFontSize(tag.count)} ${getColor(tag.name)}`}
          >
            {tag.name.replace(/_/g, ' ')}
          </Link>
        ))}
      </div>
    </main>
  );
};

export default TagsPage;
