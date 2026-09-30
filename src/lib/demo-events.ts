import 'server-only'

import type { EventDetail, EventSummary } from './events'

function paragraph(key: string, text: string) {
  return [
    {
      _type: 'block',
      _key: `b${key}`,
      children: [{ _type: 'span', _key: `s${key}`, text }],
    },
  ]
}

// Shown on the home page, events list and event detail pages when Sanity
// returns no events (e.g. no credentials configured).
export const DEMO_EVENTS: EventDetail[] = [
  {
    _id: 'demo-1',
    title: 'The Future of Food Systems',
    slug: { current: 'future-of-food-systems' },
    description: paragraph('1', 'Join Maria Chen for a deep conversation about regenerative agriculture, local food networks, and how cities can feed themselves sustainably. We\'ll explore community-supported agriculture models, urban farming innovations, and the role of restaurants like Caravan in building a more resilient food system. Open discussion follows — bring your questions, your ideas, and your appetite.'),
    date: '2026-03-15T19:00:00Z',
    endDate: '2026-03-15T21:00:00Z',
    hostName: 'Maria Chen',
    hostBio: 'Urban agriculture researcher at NYU, food systems advocate, and author of "Growing Forward: Cities and the Future of Food."',
    category: 'talk',
  },
  {
    _id: 'demo-2',
    title: 'Climate Data Hackathon',
    slug: { current: 'climate-data-hackathon' },
    description: paragraph('2', 'A full-day hackathon building tools and visualizations with open climate datasets. Teams will work with NYC open data, NOAA climate records, and EPA environmental justice data. All skill levels welcome — designers, developers, data scientists, and storytellers. Lunch and snacks provided (organic and vegan, of course). Bring a laptop and curiosity.'),
    date: '2026-03-22T10:00:00Z',
    endDate: '2026-03-22T18:00:00Z',
    hostName: 'Open Climate Collective',
    hostBio: 'A collective of developers, scientists, and designers working on open-source climate solutions.',
    category: 'hackathon',
  },
  {
    _id: 'demo-3',
    title: 'Fermentation Workshop',
    slug: { current: 'fermentation-workshop' },
    description: paragraph('3', 'Learn the art and science of fermentation with Angel Moreno, founder of Caravan of Dreams. Make your own kimchi, kombucha, and tempeh to take home. We\'ll cover the biology of fermentation, its health benefits, and traditional techniques from cultures around the world. All materials provided — just bring jars and enthusiasm.'),
    date: '2026-03-29T14:00:00Z',
    endDate: '2026-03-29T16:30:00Z',
    hostName: 'Angel Moreno',
    hostBio: 'Founder of Caravan of Dreams, nutrition scholar, musician, and lifelong advocate for plant-based living.',
    category: 'workshop',
  },
  {
    _id: 'demo-4',
    title: 'Poetry & Resistance: An Evening of Spoken Word',
    slug: { current: 'poetry-and-resistance' },
    description: paragraph('4', 'An evening of spoken word poetry in the tradition of the East Village\'s rich literary history. Featuring five poets exploring themes of resistance, hope, community, and change. Open mic follows — bring your words. In the spirit of Ginsberg, Baraka, and the Nuyorican poets who made this neighborhood a crucible of American literature.'),
    date: '2026-04-05T20:00:00Z',
    endDate: '2026-04-05T22:00:00Z',
    hostName: 'East Village Poetry Collective',
    hostBio: 'A community of poets keeping the East Village\'s literary tradition alive through monthly readings and workshops.',
    category: 'performance',
  },
  {
    _id: 'demo-5',
    title: 'Mutual Aid Network Planning Session',
    slug: { current: 'mutual-aid-planning' },
    description: paragraph('5', 'Join the LES Community Coalition to help plan and expand our neighborhood mutual aid network. We\'ll discuss food distribution, community fridges, skill-sharing programs, and how to build resilient support systems that don\'t depend on institutions. Whether you\'re already involved or just curious, pull up a chair.'),
    date: '2026-04-12T11:00:00Z',
    endDate: '2026-04-12T14:00:00Z',
    hostName: 'LES Community Coalition',
    hostBio: 'A grassroots coalition of Lower East Side residents organizing around housing, food security, and community resilience.',
    category: 'gathering',
  },
  {
    _id: 'demo-6',
    title: 'Documentary Screening: Seeds of Change',
    slug: { current: 'seeds-of-change-screening' },
    description: paragraph('6', 'A screening of "Seeds of Change," a documentary exploring how small-scale farmers around the world are preserving biodiversity and fighting corporate monoculture. Post-screening discussion with the filmmaker and local food sovereignty advocates. Organic popcorn provided.'),
    date: '2026-04-19T19:30:00Z',
    endDate: '2026-04-19T21:30:00Z',
    hostName: 'Green Films NYC',
    hostBio: 'An independent film collective dedicated to environmental storytelling and community screenings.',
    category: 'screening',
  },
]

// Events list and calendar only need the summary fields; keeps descriptions
// out of the client component payload.
export const DEMO_EVENT_SUMMARIES: EventSummary[] = DEMO_EVENTS.map(
  ({ _id, title, slug, date, endDate, hostName, category }) => ({
    _id,
    title,
    slug,
    date,
    endDate,
    hostName,
    category,
  })
)
