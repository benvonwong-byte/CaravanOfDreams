'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  date: string
  hostName: string
  category: string
}

interface CalendarProps {
  events: Event[]
  filter: string
}

export function Calendar({ events, filter }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const filtered = events.filter(
    (e) => filter === 'all' || e.category === filter
  )

  const eventsByDay: Record<number, Event[]> = {}
  filtered.forEach((event) => {
    const d = new Date(event.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(event)
    }
  })

  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvents = eventsByDay[day] && eventsByDay[day].length > 0
    const isSelected = selectedDay === day
    days.push(
      <button
        key={day}
        onClick={() => setSelectedDay(isSelected ? null : day)}
        className={`aspect-square flex flex-col items-center justify-center rounded-button text-sm transition-colors ${
          isSelected
            ? 'bg-terracotta-500 text-cream-100'
            : hasEvents
              ? 'bg-terracotta-50 text-charcoal-700 hover:bg-terracotta-100'
              : 'text-charcoal-400 hover:bg-cream-300'
        }`}
      >
        {day}
        {hasEvents && (
          <span
            className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-cream-200' : 'bg-terracotta-500'}`}
          />
        )}
      </button>
    )
  }

  const selectedEvents = selectedDay ? eventsByDay[selectedDay] || [] : []

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <button onClick={prevMonth} className="text-charcoal-500 hover:text-charcoal-700 transition-colors p-1">
          &larr;
        </button>
        <h3 className="font-serif text-xl text-charcoal-700">{monthName}</h3>
        <button onClick={nextMonth} className="text-charcoal-500 hover:text-charcoal-700 transition-colors p-1">
          &rarr;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div key={d} className="text-center text-xs font-semibold text-charcoal-400 uppercase">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">{days}</div>

      {selectedDay && (
        <div className="mt-6 space-y-2">
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => {
              const time = new Date(event.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })
              return (
                <Link
                  key={event._id}
                  href={`/events/${event.slug.current}`}
                  className="block p-3 bg-cream-100 rounded-card hover:bg-cream-200 transition-colors"
                >
                  <span className="font-serif text-charcoal-700">{event.title}</span>
                  <span className="text-sm text-charcoal-400 ml-2">
                    {time} &middot; {event.hostName}
                  </span>
                </Link>
              )
            })
          ) : (
            <p className="text-charcoal-400 text-sm">No events on this day.</p>
          )}
        </div>
      )}
    </div>
  )
}
