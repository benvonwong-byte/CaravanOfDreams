import Image from 'next/image'
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-charcoal-700 overflow-hidden">
      <Image
        src="/images/storefront.jpg"
        alt="Caravan of Dreams storefront"
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 to-charcoal-700/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-cream-200 leading-tight mb-6">
          Another world is possible.
          <br />
          <span className="text-terracotta-300">
            Come nourish it.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-cream-400 mb-10 max-w-xl mx-auto">
          A space for feeding curiosity, fueling possibility, and nourishing
          both body and mind — in the heart of the East Village since 1991.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="inline-block px-8 py-3 bg-terracotta-500 text-cream-100 rounded-button font-semibold hover:bg-terracotta-600 transition-colors"
          >
            Explore Events
          </Link>
          <Link
            href="/host"
            className="inline-block px-8 py-3 border-2 border-cream-300 text-cream-200 rounded-button font-semibold hover:bg-cream-200/10 transition-colors"
          >
            Host a Gathering
          </Link>
        </div>
      </div>
    </section>
  )
}
