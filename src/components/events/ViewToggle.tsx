'use client'

interface ViewToggleProps {
  view: 'list' | 'calendar'
  onChange: (view: 'list' | 'calendar') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-button overflow-hidden border border-charcoal-200">
      <button
        onClick={() => onChange('list')}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          view === 'list'
            ? 'bg-charcoal-700 text-cream-200'
            : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
        }`}
      >
        List
      </button>
      <button
        onClick={() => onChange('calendar')}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          view === 'calendar'
            ? 'bg-charcoal-700 text-cream-200'
            : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
        }`}
      >
        Calendar
      </button>
    </div>
  )
}
