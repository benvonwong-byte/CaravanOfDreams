// Single source of truth for menu categories and dietary tags. The Sanity
// schema and the menu page both derive from these lists.
export const MENU_CATEGORIES = [
  { value: 'mains', label: 'Mains' },
  { value: 'small-plates', label: 'Small Plates' },
  { value: 'drinks', label: 'Drinks' },
  { value: 'desserts', label: 'Desserts' },
]

export const DIETARY_TAGS = [
  { value: 'raw', label: 'Raw' },
  { value: 'gluten-free', label: 'Gluten-Free' },
  { value: 'nut-free', label: 'Nut-Free' },
  { value: 'soy-free', label: 'Soy-Free' },
]

export function dietaryTagLabel(value: string) {
  return DIETARY_TAGS.find((t) => t.value === value)?.label ?? value
}

export interface MenuItem {
  _id: string
  name: string
  description?: string
  price: number
  category: string
  dietaryTags?: string[]
}
