import type { PortableTextBlock } from 'next-sanity'

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

export function formatEventTime(date: string) {
  return new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}
