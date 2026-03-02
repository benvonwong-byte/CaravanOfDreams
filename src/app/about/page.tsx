import Image from 'next/image'

export const metadata = {
  title: 'About — Caravan of Dreams',
  description: 'The story of Caravan of Dreams — from a 1991 East Village vision to a gathering space for dreamers.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-8">
        The Story
      </h1>

      <div className="space-y-8 text-charcoal-600 leading-relaxed text-lg">
        <p>
          In October 1991, Angel Moreno — a Spanish expatriate, nutrition
          scholar, and musician — opened the doors of a small restaurant at
          405 E 6th Street. He called it{' '}
          <span className="font-serif italic text-terracotta-500">
            Caravan of Dreams
          </span>
          .
        </p>

        <div className="relative aspect-[4/3] rounded-card overflow-hidden my-8">
          <Image
            src="/images/angel-moreno.jpg"
            alt="Angel Moreno, founder of Caravan of Dreams"
            fill
            className="object-cover"
          />
        </div>

        <p>
          It was the first organic vegan restaurant in the East Village — a
          neighborhood that had already given the world the Beat poets, punk
          rock, and the Nuyorican literary movement. Moreno wasn&apos;t just
          opening a restaurant. He was building a space where health, music,
          art, and community could sit at the same table.
        </p>

        <div className="relative aspect-[16/9] rounded-card overflow-hidden my-8">
          <Image
            src="/images/early-years.jpg"
            alt="Caravan of Dreams in its early years"
            fill
            className="object-cover"
          />
        </div>

        <p>
          Within its first year, Caravan went fully plant-based. The kitchen
          served Mediterranean-inspired dishes made from organic ingredients.
          The dining room hosted live music almost every night. The walls
          displayed local art. Health seminars and yoga classes filled the
          quieter hours.
        </p>

        <p>
          For over three decades, Caravan of Dreams has been a steady presence
          in a neighborhood defined by change. While the East Village
          transformed around it, this corner kept doing what it always did —
          nourishing bodies and ideas in equal measure.
        </p>

        <div className="bg-sage-50 rounded-card p-8 my-8">
          <h2 className="font-serif text-2xl text-charcoal-700 mb-4">
            The East Village tradition
          </h2>
          <p>
            The East Village has always been where New York&apos;s next ideas
            germinate. From Allen Ginsberg&apos;s poetry to CBGB&apos;s stage
            to the community gardens that turned abandoned lots into gathering
            spaces — this neighborhood believes in the radical act of making
            something together.
          </p>
          <p className="mt-4">
            Caravan of Dreams carries that tradition forward. A place where a
            better world isn&apos;t just imagined — it&apos;s being built,
            one gathering at a time.
          </p>
        </div>

        <h2 className="font-serif text-2xl text-charcoal-700">
          A new chapter
        </h2>
        <p>
          Today, Caravan of Dreams is more than a restaurant. It&apos;s a
          free space for gathering, building, and dreaming. We invite thought
          leaders, changemakers, hackers, artists, and anyone with a vision
          worth sharing to use this space — for the simple cost of eating and
          drinking here.
        </p>
        <p>
          Because we believe that the most important conversations happen
          over shared meals. And that another world isn&apos;t just possible
          — it&apos;s already being built, right here on 6th Street.
        </p>
      </div>
    </div>
  )
}
