import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-07-11',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const events = [
  {
    _type: 'event' as const,
    title: 'The Future of Food Systems',
    slug: { _type: 'slug' as const, current: 'future-of-food-systems' },
    description: [
      {
        _type: 'block' as const,
        _key: 'a1',
        children: [
          {
            _type: 'span' as const,
            _key: 'a1s',
            text: 'A conversation about regenerative agriculture, local food networks, and how cities can feed themselves sustainably.',
          },
        ],
      },
    ],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    hostName: 'Maria Chen',
    hostBio: 'Urban agriculture researcher and food systems advocate.',
    category: 'talk',
    status: 'approved',
    expectedSize: 25,
  },
  {
    _type: 'event' as const,
    title: 'Climate Data Hackathon',
    slug: { _type: 'slug' as const, current: 'climate-data-hackathon' },
    description: [
      {
        _type: 'block' as const,
        _key: 'b1',
        children: [
          {
            _type: 'span' as const,
            _key: 'b1s',
            text: 'Build tools and visualizations with open climate datasets. All skill levels welcome. Bring a laptop and curiosity.',
          },
        ],
      },
    ],
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    hostName: 'Open Climate Collective',
    hostBio: 'A collective of developers, scientists, and designers working on climate solutions.',
    category: 'hackathon',
    status: 'approved',
    expectedSize: 30,
  },
  {
    _type: 'event' as const,
    title: 'Fermentation Workshop',
    slug: { _type: 'slug' as const, current: 'fermentation-workshop' },
    description: [
      {
        _type: 'block' as const,
        _key: 'c1',
        children: [
          {
            _type: 'span' as const,
            _key: 'c1s',
            text: 'Learn the art and science of fermentation. Make your own kimchi, kombucha, and tempeh. All materials provided.',
          },
        ],
      },
    ],
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    hostName: 'Angel Moreno',
    hostBio: 'Founder of Caravan of Dreams and lifelong nutrition advocate.',
    category: 'workshop',
    status: 'approved',
    expectedSize: 15,
  },
]

async function seed() {
  for (const event of events) {
    const result = await client.create(event)
    console.log(`Created: ${result._id} — ${event.title}`)
  }
}

seed().catch(console.error)
