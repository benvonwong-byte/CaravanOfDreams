'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoryFilter } from './CategoryFilter'
import { ViewToggle } from './ViewToggle'
import { Calendar } from './Calendar'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  hostName: string
  category: string
}

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export function EventsList({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const now = new Date()
  const filtered = events.filter(
    (e) => filter === 'all' || e.category === filter
  )
  const upcoming = filtered.filter((e) => new Date(e.date) >= now)
  const past = filtered.filter((e) => new Date(e.date) < now)

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <CategoryFilter selected={filter} onChange={setFilter} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === 'calendar' ? (
        <Calendar events={events} filter={filter} />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
                Upcoming
              </h3>
              <div className="space-y-1">
                {upcoming.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="opacity-60">
              <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
                Past
              </h3>
              <div className="space-y-1">
                {past.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-charcoal-400 text-center py-12">
              No events in this category yet.
            </p>
          )}
        </>
      )}
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  const d = new Date(event.date)
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

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
        {categoryLabels[event.category] || event.category}
      </span>
    </Link>
  )
}
