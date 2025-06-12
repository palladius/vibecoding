import React from 'react';
import fs from 'fs';
import yaml from 'js-yaml';
import { getHighlightedTalks, getHighlightedArticles } from '../lib/data';
import ItemsList from '../components/ItemsList';

const AboutPage = async () => {
  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as { bio: string };
  const highlightedTalks = await getHighlightedTalks();
  const highlightedArticles = await getHighlightedArticles();
  const items = [...highlightedTalks.map(t => ({...t, type: 'talk'})), ...highlightedArticles.map(a => ({...a, type: 'article'}))];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <p>{data.bio}</p>
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Highlights</h2>
        <ItemsList items={items} />
      </div>
    </div>
  );
};

export default AboutPage;
