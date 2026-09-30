import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { EVENT_BY_SLUG_QUERY, EVENT_SLUGS_QUERY } from '@/sanity/lib/queries'
import { isSanityConfigured } from '@/sanity/env'
import { PortableText } from 'next-sanity'
import { portableTextComponents } from '@/components/PortableTextComponents'
import {
  categoryLabel,
  formatEventDate,
  formatEventTime,
  type EventDetail,
} from '@/lib/events'
import { DEMO_EVENTS } from '@/lib/demo-events'

// Pre-render every approved event; unknown slugs still render on demand.
export async function generateStaticParams() {
  const slugs = await sanityFetch<{ slug: string }[]>({
    query: EVENT_SLUGS_QUERY,
    tags: ['event'],
  })
  if (slugs.length > 0 || isSanityConfigured) return slugs
  return DEMO_EVENTS.map((e) => ({ slug: e.slug.current }))
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await sanityFetch<EventDetail | null>({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug },
    tags: ['event'],
    fallback: null,
  })

  const displayEvent =
    event ??
    (isSanityConfigured ? null : DEMO_EVENTS.find((e) => e.slug.current === slug))

  if (!displayEvent) notFound()

  const dateStr = formatEventDate(displayEvent.date, 'long')
  const timeStr = formatEventTime(displayEvent.date)

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/events"
        className="text-sm text-charcoal-400 hover:text-terracotta-500 transition-colors mb-8 inline-block"
      >
        &larr; Back to Events
      </Link>

      <span className="inline-block text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-pill mb-4">
        {categoryLabel(displayEvent.category)}
      </span>

      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        {displayEvent.title}
      </h1>

      <div className="flex flex-wrap gap-4 text-charcoal-500 mb-8">
        <span>{dateStr}</span>
        <span>&middot;</span>
        <span>{timeStr}</span>
      </div>

      {displayEvent.hostName && (
        <div className="bg-sage-50 rounded-card p-6 mb-8">
          <p className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
            Hosted by
          </p>
          <p className="font-serif text-xl text-charcoal-700">
            {displayEvent.hostName}
          </p>
          {displayEvent.hostBio && (
            <p className="text-charcoal-500 mt-2">{displayEvent.hostBio}</p>
          )}
        </div>
      )}

      {displayEvent.description && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={displayEvent.description} components={portableTextComponents} />
        </div>
      )}
    </div>
  )
}
