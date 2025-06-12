"use client";

import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Talk } from '../../lib/types';

const localizer = momentLocalizer(moment);

interface Event {
  title: string;
  start: Date;
  end: Date;
  resource: Talk;
}

export default function CalendarView({ talks }: { talks: Talk[] }) {
  const events: Event[] = talks.map(talk => ({
    title: talk.title,
    start: new Date(talk.date as string),
    end: new Date(talk.date as string),
    resource: talk,
  }));

  return (
    <div className="h-[500px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        eventPropGetter={(event) => {
          const status = event.resource.status;
          let backgroundColor = '';
          if (status === 'confirmed') {
            backgroundColor = 'green';
          } else if (status === 'delivered') {
            backgroundColor = 'blue';
          } else {
            backgroundColor = 'gray';
          }
          return { style: { backgroundColor } };
        }}
      />
    </div>
  );
}
