import React from 'react';
import { getAllTags } from '@/app/lib/data';
import Link from 'next/link';

const TagsPage = async () => {
  const tags = await getAllTags();

  const getFontSize = (count: number) => {
    const minCount = 1;
    const maxCount = Math.max(...tags.map((tag) => tag.count));
    const sizeRange = ['text-sm', 'text-base', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl'];
    const countRange = maxCount - minCount;
    const sizeIndex = Math.round(((count - minCount) / countRange) * (sizeRange.length - 1));
    return sizeRange[sizeIndex] || 'text-base';
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-24">
      <h1 className="text-4xl font-bold">Tags</h1>
      <div className="mt-12 flex flex-wrap justify-center items-center gap-4">
        {tags.map((tag) => (
          <Link
            key={tag.name}
            href={`/tags/${tag.name.toLowerCase().replace(/ /g, '_')}`}
            className={`text-white rounded-full px-4 py-2 font-semibold ${getFontSize(tag.count)}`}
          >
            #{tag.name}
          </Link>
        ))}
      </div>
    </main>
  );
};

export default TagsPage;
