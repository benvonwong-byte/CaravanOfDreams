import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { PortableText } from 'next-sanity'

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await sanityFetch<any>({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug },
    tags: ['event'],
  })

  if (!event) notFound()

  const d = new Date(event.date)
  const dateStr = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/events"
        className="text-sm text-charcoal-400 hover:text-terracotta-500 transition-colors mb-8 inline-block"
      >
        &larr; Back to Events
      </Link>

      <span className="inline-block text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-pill mb-4">
        {categoryLabels[event.category] || event.category}
      </span>

      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        {event.title}
      </h1>

      <div className="flex flex-wrap gap-4 text-charcoal-500 mb-8">
        <span>{dateStr}</span>
        <span>&middot;</span>
        <span>{timeStr}</span>
      </div>

      {event.hostName && (
        <div className="bg-sage-50 rounded-card p-6 mb-8">
          <p className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
            Hosted by
          </p>
          <p className="font-serif text-xl text-charcoal-700">
            {event.hostName}
          </p>
          {event.hostBio && (
            <p className="text-charcoal-500 mt-2">{event.hostBio}</p>
          )}
        </div>
      )}

      {event.description && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={event.description} />
        </div>
      )}
    </div>
  )
}
