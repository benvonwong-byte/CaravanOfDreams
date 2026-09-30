import type { PortableTextBlock } from 'next-sanity'
import { SITE } from './site'

// Single source of truth for event categories. The Sanity schema, the
// category filter, the host form and every category badge derive from this.
export const EVENT_CATEGORIES = [
  { value: 'talk', label: 'Talk', formLabel: 'Talk / Lecture' },
  { value: 'hackathon', label: 'Hackathon', formLabel: 'Hackathon' },
  { value: 'gathering', label: 'Gathering', formLabel: 'Community Gathering' },
  { value: 'workshop', label: 'Workshop', formLabel: 'Workshop' },
  { value: 'performance', label: 'Performance', formLabel: 'Performance' },
  { value: 'screening', label: 'Screening', formLabel: 'Film Screening' },
]

export function categoryLabel(value: string) {
  return EVENT_CATEGORIES.find((c) => c.value === value)?.label ?? value
}

export interface EventSummary {
  _id: string
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  hostName: string
  category: string
}

export interface EventDetail extends EventSummary {
  description?: PortableTextBlock[]
  hostBio?: string
}

// Every event date is rendered in the venue's time zone. The server and the
// visitor's browser then agree on the output, and someone reading from
// another time zone still sees the time the doors actually open.
const inVenueTimeZone = (options: Intl.DateTimeFormatOptions) =>
  new Intl.DateTimeFormat('en-US', { timeZone: SITE.timeZone, ...options })

const timeFormat = inVenueTimeZone({ hour: 'numeric', minute: '2-digit' })
const monthFormat = inVenueTimeZone({ month: 'short' })
const shortDateFormat = inVenueTimeZone({ month: 'short', day: 'numeric' })
const longDateFormat = inVenueTimeZone({
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  year: 'numeric',
})
const partsFormat = inVenueTimeZone({
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
})

// Partition events around `now`. Soonest upcoming first, most recent past
// first. Call this from server components so server and client agree.
export function splitUpcomingAndPast<T extends EventSummary>(
  events: T[],
  now = Date.now()
) {
  const time = (e: T) => new Date(e.date).getTime()
  return {
    upcoming: events.filter((e) => time(e) >= now).sort((a, b) => time(a) - time(b)),
    past: events.filter((e) => time(e) < now).sort((a, b) => time(b) - time(a)),
  }
}

export function formatEventTime(date: string) {
  return timeFormat.format(new Date(date))
}

export function formatEventDate(
  date: string,
  style: 'short' | 'long' | 'month' = 'short'
) {
  const format =
    style === 'long' ? longDateFormat : style === 'month' ? monthFormat : shortDateFormat
  return format.format(new Date(date))
}

// Calendar date of an event in the venue's time zone. `month` is 0-based
// to match `Date`.
export function eventDateParts(date: string) {
  const parts = partsFormat.formatToParts(new Date(date))
  const get = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((p) => p.type === type)?.value)
  return { year: get('year'), month: get('month') - 1, day: get('day') }
}
