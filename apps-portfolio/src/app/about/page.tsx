import React from 'react';
import fs from 'fs';
import yaml from 'js-yaml';

const AboutPage = () => {
  const fileContents = fs.readFileSync('etc/data.yaml', 'utf8');
  const data = yaml.load(fileContents) as { bio: string };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">About Me</h1>
      <p>{data.bio}</p>
    </div>
  );
};

export default AboutPage;
