
"use client";

import { useState, useEffect } from "react";
import { getDb } from "../../lib/db";
import TalkCard from "./TalkCard";

interface Talk {
  id: number;
  title: string;
  event: string;
  date: string;
  location: string;
  tags: string;
  image: string;
}

async function getTalks() {
  const db = await getDb();
  const talks: Talk[] = await db.all("SELECT * FROM talks ORDER BY date DESC");
  return talks.map(talk => ({ ...talk, image: 'https://placehold.co/600x400' }));
}

export default function TalksList() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [view, setView] = useState("list"); // "list" or "card"

  useEffect(() => {
    getTalks().then(setTalks);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Talks</h2>
        <button
          onClick={() => setView(view === "list" ? "card" : "list")}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
        >
          Toggle View
        </button>
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
