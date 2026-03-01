import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries'
import { EventsList } from '@/components/events/EventsList'

export const metadata = {
  title: 'Events — Caravan of Dreams',
  description: 'Talks, hackathons, workshops, and gatherings at Caravan of Dreams.',
}

export default async function EventsPage() {
  const events = await sanityFetch<any[]>({
    query: ALL_EVENTS_QUERY,
    tags: ['event'],
  })

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

      <EventsList events={events} />

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
