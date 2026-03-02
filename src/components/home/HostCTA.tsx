import Image from 'next/image'
import Link from 'next/link'

export function HostCTA() {
  return (
    <section className="py-24 px-6 bg-sage-50">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-700 mb-6">
            Got an idea? A movement? A conversation that needs a room?
          </h2>
          <p className="text-charcoal-500 mb-8 leading-relaxed">
            We open our doors to anyone with a vision worth sharing. Host a
            talk, a hackathon, a workshop, a gathering — the only cost is
            eating and drinking in the space.
          </p>
          <Link
            href="/host"
            className="inline-block px-8 py-3 bg-teal-500 text-cream-100 rounded-button font-semibold hover:bg-teal-600 transition-colors"
          >
            Submit Your Event
          </Link>
        </div>
        <div className="relative aspect-[4/3] rounded-card overflow-hidden">
          <Image
            src="/images/live-music.jpg"
            alt="Live event at Caravan of Dreams"
            fill
            className="object-cover"
          />
        </div>
      </div>
    </section>
  )
}
