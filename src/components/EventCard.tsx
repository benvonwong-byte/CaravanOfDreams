import Link from 'next/link'

interface EventCardProps {
  title: string
  slug: string
  date: string
  hostName: string
  category: string
}

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export function EventCard({
  title,
  slug,
  date,
  hostName,
  category,
}: EventCardProps) {
  const d = new Date(date)
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = d.getDate()

  return (
    <Link
      href={`/events/${slug}`}
      className="group block bg-cream-50 rounded-card p-6 shadow-soft hover:shadow-card transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="text-center min-w-[3rem]">
          <p className="text-xs font-semibold text-terracotta-500 uppercase">
            {month}
          </p>
          <p className="text-2xl font-serif text-charcoal-700">{day}</p>
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-pill mb-2">
            {categoryLabels[category] || category}
          </span>
          <h3 className="font-serif text-lg text-charcoal-700 group-hover:text-terracotta-500 transition-colors truncate">
            {title}
          </h3>
          <p className="text-sm text-charcoal-400 mt-1">{hostName}</p>
        </div>
      </div>
    </Link>
  )
}
