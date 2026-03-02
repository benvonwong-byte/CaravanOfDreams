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

const demoItems: MenuItem[] = [
  { _id: 'm1', name: 'Tri Color Pasta', description: 'Saut\u00e9ed asparagus, mushrooms, olives, green peas, broccoli & baby shallots in tomato-cashew cream sauce with quinoa pasta, finished with avocado.', price: 18.95, category: 'mains', dietaryTags: ['gluten-free'] },
  { _id: 'm2', name: 'Miso Glazed Squash Platter', description: 'Roasted butternut squash with miso-maple glaze, wild rice, steamed greens & tahini drizzle.', price: 17.95, category: 'mains', dietaryTags: [] },
  { _id: 'm3', name: 'Raw Nori Rolls', description: 'Fresh vegetables, avocado & sprouted sunflower seed p\u00e2t\u00e9 wrapped in nori with ginger-tamari dipping sauce.', price: 16.50, category: 'mains', dietaryTags: ['raw', 'gluten-free'] },
  { _id: 'm4', name: 'Un-Chicken Caesar Salad', description: 'Crispy marinated tempeh, romaine hearts, hemp seed parmesan & cashew caesar dressing.', price: 15.95, category: 'mains', dietaryTags: [] },
  { _id: 'm5', name: 'Raw Nachos', description: 'Flax crackers topped with cashew nacho cheese, pico de gallo, guacamole & coconut sour cream.', price: 13.95, category: 'small-plates', dietaryTags: ['raw', 'gluten-free'] },
  { _id: 'm6', name: 'Patatas Bravas', description: 'Crispy local fingerling potatoes with smoky romesco sauce & garlic aioli.', price: 11.95, category: 'small-plates', dietaryTags: ['gluten-free'] },
  { _id: 'm7', name: 'Edamame Dumplings', description: 'Steamed dumplings filled with edamame, shiitake & ginger, served with ponzu.', price: 12.50, category: 'small-plates', dietaryTags: [] },
  { _id: 'm8', name: 'Fresh Pressed Green Juice', description: 'Kale, cucumber, celery, apple, lemon & ginger.', price: 9.50, category: 'drinks', dietaryTags: ['raw', 'gluten-free'] },
  { _id: 'm9', name: 'Golden Turmeric Latte', description: 'Oat milk, turmeric, cinnamon, black pepper & maple.', price: 6.50, category: 'drinks', dietaryTags: ['gluten-free'] },
  { _id: 'm10', name: 'House Kombucha', description: 'Rotating seasonal flavors, brewed in-house.', price: 7.00, category: 'drinks', dietaryTags: ['raw'] },
  { _id: 'm11', name: 'Organic Red Wine', description: 'Rotating selection of natural, organic wines by the glass.', price: 12.00, category: 'drinks', dietaryTags: [] },
  { _id: 'm12', name: 'Raw Carrot Cake', description: 'Walnut-date crust, cashew cream frosting, topped with candied ginger.', price: 10.95, category: 'desserts', dietaryTags: ['raw', 'gluten-free'] },
  { _id: 'm13', name: 'Chocolate Avocado Mousse', description: 'Dark cacao, ripe avocado, coconut cream & maple, with fresh berries.', price: 9.95, category: 'desserts', dietaryTags: ['raw', 'gluten-free'] },
]

export default async function MenuPage() {
  const items = await sanityFetch<MenuItem[]>({
    query: MENU_ITEMS_QUERY,
    tags: ['menuItem'],
  })

  const displayItems = items.length > 0 ? items : demoItems

  const grouped = categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] = displayItems.filter((item) => item.category === cat)
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

      {displayItems.length > 0 ? (
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
