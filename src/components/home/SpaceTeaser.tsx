import Link from 'next/link'

export function SpaceTeaser() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="aspect-[21/9] bg-charcoal-200 rounded-card mb-8" />
        <p className="font-serif text-2xl text-charcoal-600 mb-4">
          405 E 6th St — where the East Village still dreams
        </p>
        <Link
          href="/space"
          className="text-terracotta-500 font-semibold hover:text-terracotta-600 transition-colors"
        >
          Explore the Space &rarr;
        </Link>
      </div>
    </section>
  )
}
