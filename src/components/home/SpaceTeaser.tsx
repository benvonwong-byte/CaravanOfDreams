import Image from 'next/image'
import Link from 'next/link'

export function SpaceTeaser() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="relative aspect-[21/9] rounded-card overflow-hidden mb-8">
          <Image
            src="/images/interior-1.jpg"
            alt="Interior of Caravan of Dreams"
            fill
            className="object-cover"
          />
        </div>
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
