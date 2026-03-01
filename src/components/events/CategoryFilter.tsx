'use client'

const categories = [
  { value: 'all', label: 'All' },
  { value: 'talk', label: 'Talks' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'gathering', label: 'Gatherings' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'performance', label: 'Performances' },
  { value: 'screening', label: 'Screenings' },
]

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
            selected === cat.value
              ? 'bg-terracotta-500 text-cream-100'
              : 'bg-cream-100 text-charcoal-500 hover:bg-cream-300'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
