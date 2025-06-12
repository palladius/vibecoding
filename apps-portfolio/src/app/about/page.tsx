"use client";

import React, { useEffect, useState } from 'react';
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
      const highlightedTalks = await getHighlightedTalks();
      const highlightedArticles = await getHighlightedArticles();
      setItems([...highlightedTalks, ...highlightedArticles]);
    };
    fetchBio();
    fetchData();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <p>{bio}</p>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Highlights</h2>
        <ItemsList items={items} />
      </div>
    </div>
  );
};

export default AboutPage;
