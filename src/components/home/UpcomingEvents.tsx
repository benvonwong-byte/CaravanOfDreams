import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { UPCOMING_EVENTS_QUERY } from '@/sanity/lib/queries'
import { EventCard } from '@/components/EventCard'

export async function UpcomingEvents() {
  const events = await sanityFetch<any[]>({
    query: UPCOMING_EVENTS_QUERY,
    tags: ['event'],
  })

  return (
    <section className="py-24 px-6 bg-cream-300/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-700 text-center mb-12">
          What&apos;s happening at Caravan
        </h2>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {events.map((event: any) => (
              <EventCard
                key={event._id}
                title={event.title}
                slug={event.slug.current}
                date={event.date}
                hostName={event.hostName}
                category={event.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-charcoal-400 mb-8">
            No upcoming events yet — be the first to{' '}
            <Link href="/host" className="text-terracotta-500 underline">
              host one
            </Link>
            .
          </p>
        )}

        <div className="text-center">
          <Link
            href="/events"
            className="text-terracotta-500 font-semibold hover:text-terracotta-600 transition-colors"
          >
            View All Events &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
