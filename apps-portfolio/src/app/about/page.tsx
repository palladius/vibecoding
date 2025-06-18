"use client";
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { getHighlightedTalks, getHighlightedArticles } from '../lib/data';
import ItemsList from '../components/ItemsList';
import { Talk, Article } from '../../lib/types';

const AboutPage = () => {
  const [bio, setBio] = useState('');
  const [items, setItems] = useState<(Talk | Article)[]>([]);

  useEffect(() => {
    const fetchBio = async () => {
      const res = await fetch('/api/bio');
      const data = await res.json();
      setBio(data.bio);
    };

    const fetchData = async () => {
      const highlightedTalksData = await getHighlightedTalks();
      const highlightedArticlesData = await getHighlightedArticles();

      const highlightedTalks = highlightedTalksData.map((talk: Talk) => ({ ...talk, type: 'talk' as const }));
      const highlightedArticles = highlightedArticlesData.map((article: Article) => ({ ...article, type: 'article' as const }));

      setItems([...highlightedTalks, ...highlightedArticles]);
    };
    fetchBio();
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <div className="flex">
        <div className="w-3/5 pr-8">
          <p>{bio}</p>
        </div>
        <div className="w-2/5">
          <Image src="/images/about/image.png" alt="About Me" className="rounded-lg" width={500} height={500} />
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Highlights</h2>
        <ItemsList items={items} />
      </div>
    </div>
  );
};

export default AboutPage;
