// src/app/config/page.tsx
"use client";

import { useEffect, useState } from 'react';

interface ConfigData {
  env: {
    NODE_ENV?: string;
    PORT?: string;
    NEXT_PUBLIC_API_URL?: string;
    API_URL?: string;
    RICC_ENV?: string;
    OCCASIONAL_MESSAGE?: string;
  };
  db: {
    talks?: number;
    articles?: number;
  };
}

export default function ConfigPage() {
  const [config, setConfig] = useState<ConfigData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/config');
        if (!res.ok) {
          throw new Error('Failed to fetch config');
        }
        const data = await res.json();
        setConfig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    };

    fetchConfig();
  }, []);

  if (error) {
    return <div className="min-h-screen p-8 text-red-500">Error: {error}</div>;
  }

  if (!config) {
    return <div className="min-h-screen p-8">Loading...</div>;
  }

  return (
    <div className="min-h-screen p-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8">
        <h1 className="text-3xl font-bold">System Configuration</h1>

        <section>
          <h2 className="text-2xl font-semibold">Environment Variables</h2>
          <ul className="list-disc list-inside mt-4">
            {Object.entries(config.env).map(([key, value]) => (
              <li key={key}>
                <span className="font-mono font-bold">{key}:</span>{' '}
                <span className="font-mono">{String(value)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Cloud Run Environment</h2>
          <ul className="list-disc list-inside mt-4">
            {Object.entries(config.cloudRun).map(([key, value]) => (
              <li key={key}>
                <span className="font-mono font-bold">{key}:</span>{' '}
                <span className="font-mono">{String(value)}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold">Database Stats</h2>
          <ul className="list-disc list-inside mt-4">
            <li>
                <span className="font-mono font-bold">Talks:</span>{' '}
                <span className="font-mono">{config.db.talks}</span>
            </li>
            <li>
                <span className="font-mono font-bold">Articles:</span>{' '}
                <span className="font-mono">{config.db.articles}</span>
            </li>
          </ul>
        </section>
        <section>
            <p className="text-center text-gray-500 text-sm mt-8">
                {config.env.OCCASIONAL_MESSAGE}
            </p>
        </section>
      </main>
    </div>
  );
}
