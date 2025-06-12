
"use client";

import { useState } from "react";
import TalkCard from "./TalkCard";
import Link from "next/link";

interface Talk {
  id: number;
  title: string;
  event: string;
  date: string;
  location: string;
  tags: string;
  image: string;
  country_code: string;
}

export default function TalksList({ talks, initialView = 'list' }: { talks: Talk[], initialView?: 'list' | 'card' }) {
  const [view, setView] = useState(initialView);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Talks</h2>
        <div>
          <Link href="/" className={`px-4 py-2 rounded-md ${view === 'list' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>List</Link>
          <Link href="/cards" className={`px-4 py-2 rounded-md ${view === 'card' ? 'bg-gray-800 text-white' : 'bg-gray-200 text-gray-800'}`}>Cards</Link>
        </div>
      </div>
      {view === "list" ? (
        <ul>
          {talks.map((talk) => (
            <li key={talk.id} className="mb-4">
              <h3 className="text-xl font-semibold">{talk.title}</h3>
              <p className="text-gray-600">
                {talk.event} - {talk.location} ({talk.date})
              </p>
              {talk.tags && (
                <div className="flex gap-2 mt-2">
                  {talk.tags.split(",").map((tag: string) => (
                    <span
                      key={tag}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded-full text-sm"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {talks.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>
      )}
    </div>
  );
}
