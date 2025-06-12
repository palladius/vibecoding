"use client";

import React from 'react';
import moment from 'moment';
import { Talk } from '../../lib/types';

const statusEmojis: { [key: string]: string } = {
  cfp_applied: '📝',
  confirmed: '✅',
  delivered: '🎤',
};

export default function CalendarView({ talks }: { talks: Talk[] }) {
  // Sort talks by date in ascending order
  const sortedTalks = [...talks].sort((a, b) => {
    const dateA = moment(a.date);
    const dateB = moment(b.date);
    return dateA.diff(dateB);
  });

  let currentMonthYear = '';

  return (
    <div className="container mx-auto px-4 py-8">
      {
        sortedTalks.map((talk) => {
          const talkDate = moment(talk.date);
          const monthYear = talkDate.format('MMMM YYYY');

          const displayMonthYear = monthYear !== currentMonthYear;
          if (displayMonthYear) {
            currentMonthYear = monthYear;
          }

          return (
            <React.Fragment key={talk.id}>
              {displayMonthYear && (
                <h2 className="text-2xl font-bold mt-8 mb-4">{monthYear}</h2>
              )}
              <p className="text-lg mb-2">
                🗓️ <span className="font-semibold">{talkDate.format('ddd, MMM DD')}</span> - <a href={`/talks/${talk.slug}`} className="text-blue-400 hover:underline">{talk.title}</a> ({talk.event})
                {talk.status && (
                  <span className="ml-2 text-gray-400">
                    {statusEmojis[talk.status]} {talk.status.charAt(0).toUpperCase() + talk.status.slice(1)}
                  </span>
                )}
              </p>
            </React.Fragment>
          );
        })
      }
    </div>
  );
}