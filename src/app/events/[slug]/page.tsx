import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { PortableText } from 'next-sanity'
import { portableTextComponents } from '@/components/PortableTextComponents'

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

  const demoEvents: Record<string, any> = {
    'future-of-food-systems': {
      _id: 'demo-1',
      title: 'The Future of Food Systems',
      slug: { current: 'future-of-food-systems' },
      description: [{ _type: 'block', _key: 'b1', children: [{ _type: 'span', _key: 's1', text: 'Join Maria Chen for a deep conversation about regenerative agriculture, local food networks, and how cities can feed themselves sustainably. We\'ll explore community-supported agriculture models, urban farming innovations, and the role of restaurants like Caravan in building a more resilient food system. Open discussion follows — bring your questions, your ideas, and your appetite.' }] }],
      date: '2026-03-15T19:00:00Z',
      endDate: '2026-03-15T21:00:00Z',
      hostName: 'Maria Chen',
      hostBio: 'Urban agriculture researcher at NYU, food systems advocate, and author of "Growing Forward: Cities and the Future of Food."',
      category: 'talk',
      featuredImage: null,
    },
    'climate-data-hackathon': {
      _id: 'demo-2',
      title: 'Climate Data Hackathon',
      slug: { current: 'climate-data-hackathon' },
      description: [{ _type: 'block', _key: 'b2', children: [{ _type: 'span', _key: 's2', text: 'A full-day hackathon building tools and visualizations with open climate datasets. Teams will work with NYC open data, NOAA climate records, and EPA environmental justice data. All skill levels welcome — designers, developers, data scientists, and storytellers. Lunch and snacks provided (organic and vegan, of course). Bring a laptop and curiosity.' }] }],
      date: '2026-03-22T10:00:00Z',
      endDate: '2026-03-22T18:00:00Z',
      hostName: 'Open Climate Collective',
      hostBio: 'A collective of developers, scientists, and designers working on open-source climate solutions.',
      category: 'hackathon',
      featuredImage: null,
    },
    'fermentation-workshop': {
      _id: 'demo-3',
      title: 'Fermentation Workshop',
      slug: { current: 'fermentation-workshop' },
      description: [{ _type: 'block', _key: 'b3', children: [{ _type: 'span', _key: 's3', text: 'Learn the art and science of fermentation with Angel Moreno, founder of Caravan of Dreams. Make your own kimchi, kombucha, and tempeh to take home. We\'ll cover the biology of fermentation, its health benefits, and traditional techniques from cultures around the world. All materials provided — just bring jars and enthusiasm.' }] }],
      date: '2026-03-29T14:00:00Z',
      endDate: '2026-03-29T16:30:00Z',
      hostName: 'Angel Moreno',
      hostBio: 'Founder of Caravan of Dreams, nutrition scholar, musician, and lifelong advocate for plant-based living.',
      category: 'workshop',
      featuredImage: null,
    },
    'poetry-and-resistance': {
      _id: 'demo-4',
      title: 'Poetry & Resistance: An Evening of Spoken Word',
      slug: { current: 'poetry-and-resistance' },
      description: [{ _type: 'block', _key: 'b4', children: [{ _type: 'span', _key: 's4', text: 'An evening of spoken word poetry in the tradition of the East Village\'s rich literary history. Featuring five poets exploring themes of resistance, hope, community, and change. Open mic follows — bring your words. In the spirit of Ginsberg, Baraka, and the Nuyorican poets who made this neighborhood a crucible of American literature.' }] }],
      date: '2026-04-05T20:00:00Z',
      endDate: '2026-04-05T22:00:00Z',
      hostName: 'East Village Poetry Collective',
      hostBio: 'A community of poets keeping the East Village\'s literary tradition alive through monthly readings and workshops.',
      category: 'performance',
      featuredImage: null,
    },
    'mutual-aid-planning': {
      _id: 'demo-5',
      title: 'Mutual Aid Network Planning Session',
      slug: { current: 'mutual-aid-planning' },
      description: [{ _type: 'block', _key: 'b5', children: [{ _type: 'span', _key: 's5', text: 'Join the LES Community Coalition to help plan and expand our neighborhood mutual aid network. We\'ll discuss food distribution, community fridges, skill-sharing programs, and how to build resilient support systems that don\'t depend on institutions. Whether you\'re already involved or just curious, pull up a chair.' }] }],
      date: '2026-04-12T11:00:00Z',
      endDate: '2026-04-12T14:00:00Z',
      hostName: 'LES Community Coalition',
      hostBio: 'A grassroots coalition of Lower East Side residents organizing around housing, food security, and community resilience.',
      category: 'gathering',
      featuredImage: null,
    },
    'seeds-of-change-screening': {
      _id: 'demo-6',
      title: 'Documentary Screening: Seeds of Change',
      slug: { current: 'seeds-of-change-screening' },
      description: [{ _type: 'block', _key: 'b6', children: [{ _type: 'span', _key: 's6', text: 'A screening of "Seeds of Change," a documentary exploring how small-scale farmers around the world are preserving biodiversity and fighting corporate monoculture. Post-screening discussion with the filmmaker and local food sovereignty advocates. Organic popcorn provided.' }] }],
      date: '2026-04-19T19:30:00Z',
      endDate: '2026-04-19T21:30:00Z',
      hostName: 'Green Films NYC',
      hostBio: 'An independent film collective dedicated to environmental storytelling and community screenings.',
      category: 'screening',
      featuredImage: null,
    },
  }

  const displayEvent = event || demoEvents[slug]

  if (!displayEvent) notFound()

  const d = new Date(displayEvent.date)
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
        {categoryLabels[displayEvent.category] || displayEvent.category}
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
