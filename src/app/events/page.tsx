import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries'
import { EventsList } from '@/components/events/EventsList'

export const metadata = {
  title: 'Events — Caravan of Dreams',
  description: 'Talks, hackathons, workshops, and gatherings at Caravan of Dreams.',
}

const demoEvents = [
  {
    _id: 'demo-1',
    title: 'The Future of Food Systems',
    slug: { current: 'future-of-food-systems' },
    date: '2026-03-15T19:00:00Z',
    endDate: '2026-03-15T21:00:00Z',
    hostName: 'Maria Chen',
    category: 'talk',
    featuredImage: null,
  },
  {
    _id: 'demo-2',
    title: 'Climate Data Hackathon',
    slug: { current: 'climate-data-hackathon' },
    date: '2026-03-22T10:00:00Z',
    endDate: '2026-03-22T18:00:00Z',
    hostName: 'Open Climate Collective',
    category: 'hackathon',
    featuredImage: null,
  },
  {
    _id: 'demo-3',
    title: 'Fermentation Workshop',
    slug: { current: 'fermentation-workshop' },
    date: '2026-03-29T14:00:00Z',
    endDate: '2026-03-29T16:30:00Z',
    hostName: 'Angel Moreno',
    category: 'workshop',
    featuredImage: null,
  },
  {
    _id: 'demo-4',
    title: 'Poetry & Resistance: An Evening of Spoken Word',
    slug: { current: 'poetry-and-resistance' },
    date: '2026-04-05T20:00:00Z',
    endDate: '2026-04-05T22:00:00Z',
    hostName: 'East Village Poetry Collective',
    category: 'performance',
    featuredImage: null,
  },
  {
    _id: 'demo-5',
    title: 'Mutual Aid Network Planning Session',
    slug: { current: 'mutual-aid-planning' },
    date: '2026-04-12T11:00:00Z',
    endDate: '2026-04-12T14:00:00Z',
    hostName: 'LES Community Coalition',
    category: 'gathering',
    featuredImage: null,
  },
  {
    _id: 'demo-6',
    title: 'Documentary Screening: Seeds of Change',
    slug: { current: 'seeds-of-change-screening' },
    date: '2026-04-19T19:30:00Z',
    endDate: '2026-04-19T21:30:00Z',
    hostName: 'Green Films NYC',
    category: 'screening',
    featuredImage: null,
  },
]

export default async function EventsPage() {
  const events = await sanityFetch<any[]>({
    query: ALL_EVENTS_QUERY,
    tags: ['event'],
  })

  const displayEvents = events.length > 0 ? events : demoEvents

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
          What&apos;s happening at Caravan
        </h1>
        <p className="text-charcoal-500">
          Talks, hackathons, workshops, and gatherings — all under one roof.
        </p>
      </div>

      <EventsList events={displayEvents} />

      <div className="mt-16 text-center p-8 bg-sage-50 rounded-card">
        <p className="font-serif text-xl text-charcoal-600 mb-4">
          Want to host? Submit your event.
        </p>
        <Link
          href="/host"
          className="inline-block px-8 py-3 bg-teal-500 text-cream-100 rounded-button font-semibold hover:bg-teal-600 transition-colors"
        >
          Submit Your Event
        </Link>
      </div>
    </div>
  )
}
