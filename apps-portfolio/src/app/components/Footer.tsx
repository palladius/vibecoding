import React from 'react';

interface FooterProps {
  appName: string;
  version: string;
  repoUrl: string;
}

const Footer: React.FC<FooterProps> = ({ appName, version, repoUrl }) => {
  return (
    <footer className="text-center p-4 mt-8 text-sm text-gray-500">
      <p>
        <a href={repoUrl} target="_blank" rel="noopener noreferrer" className="hover:underline">
          {appName}
        </a>{' '}
        - v{version} 🚀
      </p>
      <p>
        <a href={`${repoUrl}/blob/main/apps-portfolio/CHANGELOG.md`} target="_blank" rel="noopener noreferrer" className="hover:underline">
          Changelog
        </a>
      </p>
    </footer>
  );
};

export default Footer;
