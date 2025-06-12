import React from 'react';

interface FooterProps {
  appName: string;
  version: string;
  repoUrl: string;
  appProdUrl: string;
}

const Footer: React.FC<FooterProps> = ({ appName, version, repoUrl, appProdUrl }) => {
  return (
    <footer className="text-center p-4 mt-8 text-xs text-gray-500">
      <p>
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          <strong>{appName}</strong>
        </a>{' '}
        - v<strong>{version}</strong> 🚀 - Deployed on{' '}
        <a href={appProdUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Production
        </a>
        {' '}- Developed with fun by Riccardo 💛 and{' '}
        <a href="https://github.com/google-gemini/gemini-cli" target="_blank" rel="noopener noreferrer" className="hover:underline">
          gemini-cli
        </a>{' '}
        🤖 -{' '}
        <a href={`${repoUrl}/blob/main/apps-portfolio/CHANGELOG.md`} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Changelog
        </a>
      </p>
    </footer>
  );
};

export default Footer;
