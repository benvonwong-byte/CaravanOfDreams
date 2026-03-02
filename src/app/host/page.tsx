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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        <div className="bg-sage-50 rounded-card p-6">
          <h2 className="font-serif text-xl text-charcoal-700 mb-2">
            Community Events — Free
          </h2>
          <p className="text-charcoal-500 leading-relaxed mb-4">
            Talks, hackathons, workshops, gatherings — if it&apos;s open to
            the community, the space is yours at no cost. The only ask?
            Nourish yourself while you nourish the conversation.
          </p>
          <div className="flex flex-wrap gap-2">
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
                className="px-3 py-1 bg-sage-100 text-sage-700 rounded-pill text-sm font-medium"
              >
                {type}
              </span>
            ))}
          </div>
        </div>

        <div className="bg-cream-100 rounded-card p-6">
          <h2 className="font-serif text-xl text-charcoal-700 mb-2">
            Private Events — By Arrangement
          </h2>
          <p className="text-charcoal-500 leading-relaxed mb-4">
            Planning a private dinner, corporate offsite, or a celebration?
            We offer the same beautiful space with dedicated service and
            custom menus. Reach out and we&apos;ll craft the perfect evening.
          </p>
          <a
            href="mailto:events@caravanofdreams.net"
            className="inline-block px-6 py-2 border-2 border-charcoal-300 text-charcoal-600 rounded-button text-sm font-semibold hover:bg-charcoal-100 transition-colors"
          >
            Inquire About Private Events
          </a>
        </div>
      </div>

      <h2 className="font-serif text-2xl text-charcoal-700 mb-2">
        Submit a community event
      </h2>
      <p className="text-charcoal-500 text-lg mb-8 leading-relaxed">
        Fill out the form below and we&apos;ll review your submission
        within 48 hours.
      </p>

      <EventForm />
    </div>
  )
}
