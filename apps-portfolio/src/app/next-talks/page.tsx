"use client";

import { useEffect, useState } from "react";
import { getFutureTalks } from "../lib/data";
import { Talk } from "../../lib/types";
import TalkCard from "../components/TalkCard";

export default function NextTalksPage() {
  const [talks, setTalks] = useState<Talk[]>([]);
  const [view, setView] = useState('card');

  useEffect(() => {
    const fetchData = async () => {
      const futureTalks = await getFutureTalks();
      setTalks(futureTalks);
    };
    fetchData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Next Talks</h1>
      <div className="flex justify-end mb-4">
        <button
          className={`px-4 py-2 rounded-l-lg ${view === 'card' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
          onClick={() => setView('card')}
        >
          Card View
        </button>
        <button
          className={`px-4 py-2 rounded-r-lg ${view === 'calendar' ? 'bg-yellow-400 text-black' : 'bg-gray-700 text-white'}`}
          onClick={() => setView('calendar')}
        >
          Calendar View
        </button>
      </div>
      {view === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {talks.map((talk) => (
            <TalkCard key={talk.id} talk={talk} />
          ))}
        </div>
      ) : (
        <CalendarView talks={talks} />
      )}
    </div>
  );
}
