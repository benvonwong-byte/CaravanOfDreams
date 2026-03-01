import { EventForm } from '@/components/host/EventForm'

export const metadata = {
  title: 'Host an Event — Caravan of Dreams',
  description: 'Submit your event to be hosted at Caravan of Dreams in the East Village.',
}

export default function HostPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        Bring your vision to the table
      </h1>
      <p className="text-charcoal-500 text-lg mb-4 leading-relaxed">
        Caravan of Dreams opens its doors to anyone with an idea worth sharing.
        The only cost? Eating and drinking in the space. That&apos;s it. No
        rental fees, no minimums — just nourish yourself while you nourish the
        conversation.
      </p>

      <div className="mb-12">
        <h2 className="font-serif text-xl text-charcoal-600 mb-3">
          What we&apos;re looking for
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            'Talks & Lectures',
            'Hackathons',
            'Workshops',
            'Community Gatherings',
            'Performances',
            'Film Screenings',
          ].map((type) => (
            <span
              key={type}
              className="px-4 py-2 bg-sage-50 text-sage-700 rounded-pill text-sm font-medium"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <EventForm />
    </div>
  )
}
