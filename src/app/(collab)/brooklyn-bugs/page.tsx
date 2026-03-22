import Link from 'next/link'
import Image from 'next/image'

/* ─── tiny SVG decorations ─── */

function AntIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="4" r="2.5" />
      <ellipse cx="12" cy="11" rx="4" ry="3.5" />
      <ellipse cx="12" cy="19" rx="3" ry="3" />
      <line x1="8" y1="9" x2="4" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="9" x2="20" y2="5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="8" y1="12" x2="3" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="16" y1="12" x2="21" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="9" y1="18" x2="5" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="15" y1="18" x2="19" y2="21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

function LeafIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.14-2.66C9 14 14 10 21 3c-2 1-7.26 3-4 5" fill="currentColor" opacity="0.15" />
      <path d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1.14-2.66C9 14 14 10 21 3c-2 1-7.26 3-4 5" />
    </svg>
  )
}

function AntTrail() {
  return (
    <div className="flex items-center justify-center gap-3 py-4 text-sage-400/40">
      <AntIcon className="w-3 h-3 rotate-[-30deg]" />
      <AntIcon className="w-3.5 h-3.5 rotate-[-15deg]" />
      <AntIcon className="w-4 h-4" />
      <AntIcon className="w-3.5 h-3.5 rotate-[15deg]" />
      <AntIcon className="w-3 h-3 rotate-[30deg]" />
    </div>
  )
}

/* ─── Menu course component ─── */

function CourseCard({
  number,
  title,
  description,
  ingredients,
}: {
  number: string
  title: string
  description: string
  ingredients: string[]
}) {
  return (
    <div className="group relative border border-cream-400/15 rounded-card p-8 md:p-10 bg-charcoal-700/40 hover:border-mustard-400/30 transition-all duration-500 hover:bg-charcoal-700/60">
      <div className="absolute -top-4 left-8 bg-charcoal-800 px-4 py-0.5 rounded-sm">
        <span className="text-xs font-bold uppercase tracking-[0.3em] text-mustard-300">
          {number}
        </span>
      </div>
      <h3 className="font-serif text-2xl md:text-3xl text-cream-100 mb-4 group-hover:text-mustard-300 transition-colors">
        {title}
      </h3>
      <p className="text-cream-200/80 text-base leading-relaxed mb-5">{description}</p>
      <div className="flex flex-wrap gap-2">
        {ingredients.map((ing) => (
          <span
            key={ing}
            className="text-xs font-medium px-3 py-1.5 rounded-pill bg-sage-700/40 text-cream-300 border border-sage-600/30"
          >
            {ing}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ─── Main page ─── */

export default function BrooklynBugsCollabPage() {
  return (
    <>
      {/* ═══════════════════════════════════════════
          NAVIGATION BAR
      ═══════════════════════════════════════════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-charcoal-900/95 backdrop-blur-md border-b border-cream-400/10">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="font-serif text-lg text-cream-100 hover:text-mustard-300 transition-colors"
            >
              Caravan of Dreams
            </Link>
            <span className="text-mustard-400 font-light">×</span>
            <span className="text-sm font-semibold tracking-wider text-cream-300 uppercase">
              Brooklyn Bugs
            </span>
          </div>
          <a
            href="#rsvp"
            className="hidden sm:inline-block px-5 py-2 bg-sage-500 text-cream-50 rounded-pill text-sm font-semibold hover:bg-sage-400 transition-colors"
          >
            Reserve a Seat
          </a>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        {/* Background layers */}
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900 via-charcoal-800 to-sage-900/40" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Floating decorative elements */}
        <div className="absolute top-1/4 left-[10%] text-sage-600/20 animate-pulse">
          <LeafIcon className="w-16 h-16 rotate-[-20deg]" />
        </div>
        <div className="absolute top-1/3 right-[12%] text-sage-600/15 animate-pulse delay-1000">
          <AntIcon className="w-12 h-12 rotate-[15deg]" />
        </div>
        <div className="absolute bottom-1/4 left-[15%] text-sage-600/10 animate-pulse delay-500">
          <AntIcon className="w-8 h-8 rotate-[-10deg]" />
        </div>
        <div className="absolute bottom-1/3 right-[8%] text-sage-600/20 animate-pulse delay-700">
          <LeafIcon className="w-14 h-14 rotate-[25deg]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-mustard-300 mb-6">
            A One-Night Collaboration
          </p>

          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-cream-100 leading-[0.9] mb-2">
            Crawl
          </h1>
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-px flex-1 max-w-24 bg-gradient-to-r from-transparent to-mustard-500/60" />
            <span className="font-serif text-2xl md:text-3xl text-mustard-400 italic">&</span>
            <div className="h-px flex-1 max-w-24 bg-gradient-to-l from-transparent to-mustard-500/60" />
          </div>
          <h1 className="font-serif text-6xl sm:text-7xl md:text-8xl lg:text-9xl text-cream-100 leading-[0.9] mb-8">
            Bloom
          </h1>

          <p className="text-lg md:text-xl text-cream-200 max-w-2xl mx-auto mb-4 leading-relaxed">
            Where six-legged protein meets the garden. A multi-course tasting
            menu fusing organic vegan cuisine with the world of edible insects.
          </p>

          <p className="text-sm text-mustard-300/80 uppercase tracking-wider mb-12 font-medium">
            The future of food, served tonight
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a
              href="#rsvp"
              className="inline-block px-10 py-4 bg-sage-500 text-cream-50 rounded-pill font-semibold text-lg hover:bg-sage-400 transition-all hover:shadow-elevated"
            >
              Reserve Your Seat
            </a>
            <a
              href="#menu"
              className="inline-block px-10 py-4 border-2 border-cream-200/40 text-cream-100 rounded-pill font-semibold hover:border-cream-100/70 hover:bg-cream-200/10 transition-all"
            >
              See the Menu
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-cream-300/50">
          <span className="text-xs uppercase tracking-widest">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-cream-300/50 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE VISION
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <AntTrail />
          <p className="font-serif text-2xl md:text-4xl text-cream-100 leading-relaxed mt-8">
            For one night only, two of New York&apos;s most daring food
            visionaries come together to challenge everything you think you know
            about a sustainable plate.
          </p>
          <p className="text-cream-200/80 mt-8 text-lg leading-relaxed max-w-2xl mx-auto">
            Caravan of Dreams — the East Village&apos;s legendary vegan kitchen,
            nourishing dreamers since 1991 — joins forces with Brooklyn Bugs,
            led by world-renowned edible insect ambassador Chef Joseph Yoon, for
            an evening that blurs the line between the garden and the wild.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS / IMPACT BAR
      ═══════════════════════════════════════════ */}
      <section className="border-y border-cream-400/10 bg-charcoal-700/40">
        <div className="max-w-5xl mx-auto px-6 py-20 grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { stat: '80%', label: 'Less water than beef' },
            { stat: '100×', label: 'Less land per gram of protein' },
            { stat: '12×', label: 'Less feed required' },
            { stat: '1/100', label: 'The greenhouse gas emissions' },
          ].map((item) => (
            <div key={item.label}>
              <p className="font-serif text-4xl md:text-5xl text-mustard-300 mb-3">
                {item.stat}
              </p>
              <p className="text-sm text-cream-200/70 uppercase tracking-wider font-medium">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE COLLABORATORS
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm font-bold uppercase tracking-[0.3em] text-mustard-300 text-center mb-16">
            The Collaborators
          </p>

          <div className="grid md:grid-cols-2 gap-16">
            {/* Caravan of Dreams */}
            <div className="relative group">
              <div className="aspect-[4/3] rounded-card overflow-hidden mb-8 bg-charcoal-700">
                <Image
                  src="/images/interior-1.jpg"
                  alt="Caravan of Dreams interior"
                  width={600}
                  height={450}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-700"
                />
              </div>
              <div className="flex items-start gap-3 mb-4">
                <LeafIcon className="w-6 h-6 text-sage-300 mt-1 shrink-0" />
                <div>
                  <h3 className="font-serif text-3xl text-cream-100">
                    Caravan of Dreams
                  </h3>
                  <p className="text-sm text-cream-300/70 mt-1">
                    East Village, NYC &middot; Since 1991
                  </p>
                </div>
              </div>
              <p className="text-cream-200/75 leading-relaxed text-base">
                A corner of the East Village that has quietly nourished bodies
                and minds for over three decades. 100% organic, 100% vegan —
                where every plate is an act of care for the planet and every
                gathering is an invitation to dream bigger.
              </p>
            </div>

            {/* Brooklyn Bugs */}
            <div className="relative group">
              <div className="aspect-[4/3] rounded-card overflow-hidden mb-8 bg-charcoal-700/60 border border-cream-400/10 flex items-center justify-center">
                <div className="text-center p-12">
                  <AntIcon className="w-24 h-24 text-sage-300 mx-auto mb-6" />
                  <p className="font-serif text-2xl text-cream-100">Brooklyn Bugs</p>
                  <p className="text-cream-300/70 text-sm mt-2">Edible Insect Ambassadors</p>
                </div>
              </div>
              <div className="flex items-start gap-3 mb-4">
                <AntIcon className="w-6 h-6 text-sage-300 mt-1 shrink-0" />
                <div>
                  <h3 className="font-serif text-3xl text-cream-100">
                    Brooklyn Bugs
                  </h3>
                  <p className="text-sm text-cream-300/70 mt-1">
                    Chef Joseph Yoon &middot; 6 Continents
                  </p>
                </div>
              </div>
              <p className="text-cream-200/75 leading-relaxed text-base">
                Led by world-renowned Chef Joseph Yoon, Brooklyn Bugs has spent
                years touring six continents to showcase the delicious potential
                of edible insects. From the New York Times to BBC, their mission
                to make bugs beautiful, approachable, and unforgettable has
                changed how the world thinks about protein.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE MENU
      ═══════════════════════════════════════════ */}
      <section id="menu" className="py-28 px-6 bg-gradient-to-b from-charcoal-800 to-charcoal-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-20">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-mustard-300 mb-4">
              The Tasting Menu
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-100 mb-6">
              Five Courses. Zero Compromise.
            </h2>
            <p className="text-cream-200/75 text-lg max-w-xl mx-auto leading-relaxed">
              Each course is a conversation between the garden and the wild —
              organic, plant-forward, and threaded with the subtle, nutty,
              umami-rich world of edible insects.
            </p>
          </div>

          <div className="space-y-8">
            <CourseCard
              number="First"
              title="The Awakening"
              description="A chilled cucumber-melon gazpacho crowned with toasted cricket dust, micro herbs, and a drizzle of black ant oil. Clean, bright, and electric."
              ingredients={['Cucumber', 'Melon', 'Cricket Flour', 'Black Ant Oil', 'Micro Herbs']}
            />
            <CourseCard
              number="Second"
              title="Soil & Sky"
              description="Roasted heirloom beet terrine with cashew crème, candied mealworms, and a shower of edible flowers. The earth, elevated."
              ingredients={['Heirloom Beets', 'Cashew Crème', 'Mealworms', 'Edible Flowers']}
            />
            <CourseCard
              number="Third"
              title="The Swarm"
              description="House-made black garlic pasta tossed in a silky miso-truffle sauce, finished with sautéed chapulines (grasshoppers) and crispy sage leaves."
              ingredients={['Black Garlic Pasta', 'Miso-Truffle', 'Chapulines', 'Sage']}
            />
            <CourseCard
              number="Fourth"
              title="Roots & Wings"
              description="Slow-roasted king oyster mushroom steak over a bed of ancient grain risotto, topped with a cricket-sesame gremolata and charred scallion oil."
              ingredients={['King Oyster Mushroom', 'Ancient Grains', 'Cricket Gremolata', 'Sesame']}
            />
            <CourseCard
              number="Fifth"
              title="Strange Eden"
              description="Dark chocolate ganache with agave worm salt, coconut cream, and a crispy mealworm tuile. Dessert, reimagined from the ground up."
              ingredients={['Dark Chocolate', 'Agave Worm Salt', 'Coconut Cream', 'Mealworm Tuile']}
            />
          </div>

          <p className="text-center text-sm text-cream-300/50 mt-12 italic">
            Menu is conceptual and subject to seasonal availability. All
            dishes are 100% organic and vegan-compatible. Insect ingredients
            sourced from certified, sustainable farms.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          THE EXPERIENCE
      ═══════════════════════════════════════════ */}
      <section className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-mustard-300 mb-4">
              The Experience
            </p>
            <h2 className="font-serif text-4xl md:text-5xl text-cream-100">
              More Than a Dinner
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Conquering Fear',
                desc: "Chef Joseph Yoon's signature interactive moment — a guided first-taste experience designed to transform curiosity into courage. No pressure, just wonder.",
                icon: '01',
              },
              {
                title: 'Kitchen Talk',
                desc: 'Between courses, hear directly from both kitchens about the science, culture, and philosophy of sustainable food — from the vegan revolution to the insect frontier.',
                icon: '02',
              },
              {
                title: 'The Provocation',
                desc: 'Leave with a question, not just a full stomach. A closing conversation on what it means to eat with intention in a world that desperately needs new answers.',
                icon: '03',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-cream-400/12 rounded-card p-8 bg-charcoal-700/30 hover:border-mustard-400/25 hover:bg-charcoal-700/50 transition-all duration-500"
              >
                <span className="text-4xl font-serif text-mustard-400/40 mb-4 block">
                  {item.icon}
                </span>
                <h3 className="font-serif text-xl text-cream-100 mb-3">
                  {item.title}
                </h3>
                <p className="text-base text-cream-200/70 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          EVENT DETAILS
      ═══════════════════════════════════════════ */}
      <section className="py-24 px-6 border-y border-cream-400/10 bg-charcoal-700/30">
        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.3em] text-mustard-300 mb-8">
              The Details
            </p>
            <dl className="space-y-6">
              {[
                { label: 'Date', value: 'Saturday, April 26, 2026' },
                { label: 'Doors', value: '6:30 PM — Dinner at 7:00 PM' },
                { label: 'Location', value: 'Caravan of Dreams — 405 E 6th St, NYC' },
                { label: 'Format', value: '5-Course Tasting + Conversations' },
                { label: 'Capacity', value: '35 Seats — Intimate & Intentional' },
                { label: 'Price', value: '$95 per person (drinks included)' },
              ].map((item) => (
                <div key={item.label} className="flex gap-4">
                  <dt className="text-xs uppercase tracking-wider text-cream-300/60 w-20 shrink-0 pt-1 font-semibold">
                    {item.label}
                  </dt>
                  <dd className="text-cream-100 font-serif text-lg">{item.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative aspect-square rounded-card overflow-hidden bg-charcoal-700">
            <Image
              src="/images/food-1.jpg"
              alt="Organic vegan dish at Caravan of Dreams"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900/60 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6">
              <p className="font-serif text-lg text-cream-100 italic">
                &ldquo;You just opened up a whole new world for me.&rdquo;
              </p>
              <p className="text-sm text-cream-200/70 mt-2">
                — Mark Consuelos, on Chef Joseph Yoon
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          RSVP / CTA
      ═══════════════════════════════════════════ */}
      <section id="rsvp" className="py-28 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <AntTrail />
          <h2 className="font-serif text-4xl md:text-6xl text-cream-100 mt-8 mb-6">
            35 Seats.<br />One Night.<br />
            <span className="text-mustard-300">No Repeats.</span>
          </h2>
          <p className="text-cream-200/80 text-lg mb-12 max-w-lg mx-auto leading-relaxed">
            This is an unrepeatable collision of two worlds. Once the seats
            are gone, they&apos;re gone. Join us for a night that will change
            how you think about food forever.
          </p>

          <a
            href="mailto:events@caravanofdreams.net?subject=Crawl%20%26%20Bloom%20%E2%80%94%20RSVP&body=I%E2%80%99d%20like%20to%20reserve%20a%20seat%20at%20Crawl%20%26%20Bloom%20on%20April%2026%2C%202026.%0A%0AName%3A%0ANumber%20of%20guests%3A%0AAny%20allergies%3A"
            className="inline-block px-12 py-5 bg-sage-500 text-cream-50 rounded-pill font-semibold text-lg hover:bg-sage-400 transition-all hover:shadow-elevated"
          >
            Reserve Your Seat — $95
          </a>

          <p className="text-sm text-cream-300/50 mt-6">
            RSVP via email. Limited to 35 guests. Confirmation within 24 hours.
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FOOTER
      ═══════════════════════════════════════════ */}
      <footer className="border-t border-cream-400/10 py-14 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <p className="font-serif text-lg text-cream-200">
              Caravan of Dreams <span className="text-mustard-400">×</span> Brooklyn Bugs
            </p>
            <p className="text-sm text-cream-300/50 mt-1">
              Crawl & Bloom — April 26, 2026 — East Village, NYC
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm text-cream-300/60">
            <Link href="/" className="hover:text-cream-100 transition-colors">
              Caravan of Dreams
            </Link>
            <span className="text-cream-400/20">|</span>
            <a
              href="https://www.brooklynbugs.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cream-100 transition-colors"
            >
              Brooklyn Bugs
            </a>
          </div>
        </div>

        <div className="max-w-4xl mx-auto mt-8 text-center">
          <p className="font-serif text-base text-cream-300/40 italic">
            Eat. Crawl. Bloom.
          </p>
        </div>
      </footer>
    </>
  )
}
