'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoryFilter } from './CategoryFilter'
import { ViewToggle } from './ViewToggle'
import { Calendar } from './Calendar'
import {
  categoryLabel,
  formatEventDate,
  formatEventTime,
  type EventSummary,
} from '@/lib/events'

interface EventsListProps {
  // Split on the server so the client never renders with a different `now`.
  upcoming: EventSummary[]
  past: EventSummary[]
}

export function EventsList({ upcoming, past }: EventsListProps) {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const matches = (e: EventSummary) => filter === 'all' || e.category === filter
  const upcomingShown = upcoming.filter(matches)
  const pastShown = past.filter(matches)

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <CategoryFilter selected={filter} onChange={setFilter} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === 'calendar' ? (
        <Calendar events={[...upcomingShown, ...pastShown]} />
      ) : (
        <>
          {upcomingShown.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
                Upcoming
              </h3>
              <div className="space-y-1">
                {upcomingShown.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {pastShown.length > 0 && (
            <div className="opacity-60">
              <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
                Past
              </h3>
              <div className="space-y-1">
                {pastShown.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {upcomingShown.length + pastShown.length === 0 && (
            <p className="text-charcoal-400 text-center py-12">
              {filter === 'all'
                ? 'No events scheduled yet.'
                : 'No events in this category yet.'}
            </p>
          )}
        </>
      )}
    </div>
  )
}

function EventRow({ event }: { event: EventSummary }) {
  const dateStr = formatEventDate(event.date)
  const timeStr = formatEventTime(event.date)

  return (
    <Link
      href={`/events/${event.slug.current}`}
      className="group flex items-center gap-6 py-4 px-4 rounded-card hover:bg-cream-100 transition-colors"
    >
      <span className="text-sm font-semibold text-terracotta-500 min-w-[4rem] uppercase">
        {dateStr}
      </span>
      <span className="font-serif text-lg text-charcoal-700 group-hover:text-terracotta-500 transition-colors flex-1">
        {event.title}
      </span>
      <span className="hidden sm:inline text-sm text-charcoal-400">
        {event.hostName}
      </span>
      <span className="text-sm text-charcoal-400">{timeStr}</span>
      <span className="hidden sm:inline text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-pill">
        {categoryLabel(event.category)}
      </span>
    </Link>
  )
}
