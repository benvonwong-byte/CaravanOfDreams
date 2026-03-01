import { sanityFetch } from '@/sanity/lib/fetch'
import { MENU_ITEMS_QUERY } from '@/sanity/lib/queries'

export const metadata = {
  title: 'Menu — Caravan of Dreams',
  description: 'Organic vegan cuisine at Caravan of Dreams. Your meal is your ticket to dream.',
}

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  dietaryTags?: string[]
}

const categoryOrder = ['mains', 'small-plates', 'drinks', 'desserts']
const categoryNames: Record<string, string> = {
  mains: 'Mains',
  'small-plates': 'Small Plates',
  drinks: 'Drinks',
  desserts: 'Desserts',
}

export default async function MenuPage() {
  const items = await sanityFetch<MenuItem[]>({
    query: MENU_ITEMS_QUERY,
    tags: ['menuItem'],
  })

  const grouped = categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((item) => item.category === cat)
      return acc
    },
    {} as Record<string, MenuItem[]>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        Menu
      </h1>
      <p className="text-charcoal-500 text-lg mb-12">
        Organic. Vegan. Mediterranean-inspired.
        <br />
        <span className="font-serif italic text-terracotta-500">
          Your meal is your ticket to dream.
        </span>
      </p>

      {items.length > 0 ? (
        <div className="space-y-12">
          {categoryOrder.map((cat) => {
            const catItems = grouped[cat]
            if (!catItems || catItems.length === 0) return null
            return (
              <section key={cat}>
                <h2 className="font-serif text-2xl text-charcoal-700 border-b border-charcoal-200 pb-2 mb-6">
                  {categoryNames[cat]}
                </h2>
                <div className="space-y-6">
                  {catItems.map((item) => (
                    <div key={item._id} className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-charcoal-700">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-charcoal-400 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.dietaryTags && item.dietaryTags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {item.dietaryTags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded-pill"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-charcoal-500 font-medium whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <p className="text-charcoal-400 text-center py-12">
          Menu coming soon. In the meantime, trust us — it&apos;s delicious.
        </p>
      )}
    </div>
  )
}
