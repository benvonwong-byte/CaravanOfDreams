import Image from 'next/image'
import Link from 'next/link'

export const metadata = {
  title: 'The Space — Caravan of Dreams',
  description: 'Explore the Caravan of Dreams venue in the East Village. Capacity, amenities, and how to host your event.',
}

export default function SpacePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        The Space
      </h1>
      <p className="text-charcoal-500 text-lg mb-12">
        405 E 6th Street — between 1st Ave &amp; Avenue A, in the heart of the
        East Village.
      </p>

      <div className="relative aspect-[21/9] rounded-card overflow-hidden mb-16">
        <Image
          src="/images/outdoor-patio.jpg"
          alt="Caravan of Dreams outdoor patio"
          fill
          className="object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-cream-100 rounded-card p-6">
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">Capacity</h3>
          <p className="text-charcoal-500">
            Up to 35 seated in the Red Room. Main dining space accommodates
            larger gatherings.
          </p>
        </div>
        <div className="bg-cream-100 rounded-card p-6">
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">Amenities</h3>
          <ul className="text-charcoal-500 space-y-1">
            <li>Free WiFi</li>
            <li>Projector &amp; screen</li>
            <li>Sound system</li>
            <li>Microphone</li>
          </ul>
        </div>
        <div className="bg-cream-100 rounded-card p-6">
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">Availability</h3>
          <p className="text-charcoal-500">
            Daytime slots (11am–4pm) and weekends are ideal for events.
            Evenings available by arrangement.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16">
        <div className="relative aspect-[4/3] rounded-card overflow-hidden">
          <Image
            src="/images/interior-2.jpg"
            alt="Caravan of Dreams interior"
            fill
            className="object-cover"
          />
        </div>
        <div className="relative aspect-[4/3] rounded-card overflow-hidden">
          <Image
            src="/images/interior-3.jpg"
            alt="Caravan of Dreams dining area"
            fill
            className="object-cover"
          />
        </div>
      </div>

      <div className="text-center bg-sage-50 rounded-card p-12">
        <h2 className="font-serif text-3xl text-charcoal-700 mb-4">
          See yourself here?
        </h2>
        <p className="text-charcoal-500 mb-6">
          The only cost of hosting is eating and drinking in the space.
        </p>
        <Link
          href="/host"
          className="inline-block px-8 py-3 bg-teal-500 text-cream-100 rounded-button font-semibold hover:bg-teal-600 transition-colors"
        >
          Host Your Event
        </Link>
      </div>
    </div>
  )
}
