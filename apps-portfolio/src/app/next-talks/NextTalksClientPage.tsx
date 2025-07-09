"use client";

import { useState } from "react";
import { Talk } from "../../lib/types";
import TalkCard from "../components/TalkCard";
import CalendarView from "../components/CalendarView";
import moment from 'moment';

const getProximity = (date: string) => {
  const today = moment().startOf('day');
  const talkDate = moment(date).startOf('day');

  if (talkDate.isSame(today, 'day')) return "Today!";
  if (talkDate.isSame(today.clone().add(1, 'day'), 'day')) return "Tomorrow!";
  if (talkDate.isSame(today, 'week')) return "This week!";
  if (talkDate.isSame(today.clone().add(1, 'week'), 'week')) return "Next week!";
  if (talkDate.isSame(today, 'month')) return "This month!";
  return undefined;
};

export default function NextTalksClientPage({ initialTalks }: { initialTalks: Talk[] }) {
  const [view, setView] = useState('card');

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
        initialTalks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {initialTalks.map((talk) => (
              <TalkCard key={talk.id} talk={talk} proximity={getProximity(talk.date)} />
            ))}
          </div>
        ) : (
          <p>No upcoming talks found. Check back later!</p>
        )
      ) : (
        <CalendarView talks={initialTalks} />
      )}
    </div>
  );
}