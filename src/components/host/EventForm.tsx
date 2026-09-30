'use client'

import { useState } from 'react'
import { submitEvent } from '@/app/actions/submitEvent'
import { EVENT_CATEGORIES } from '@/lib/events'

const labelClass = 'block text-sm font-medium text-charcoal-600 mb-1'
const inputClass =
  'w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500'

export function EventForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = new FormData(e.currentTarget)
    const result = await submitEvent({
      name: form.get('name') as string,
      email: form.get('email') as string,
      title: form.get('title') as string,
      description: form.get('description') as string,
      category: form.get('category') as string,
      preferredDates: form.get('preferredDates') as string,
      expectedSize: form.get('expectedSize') as string,
      notes: form.get('notes') as string,
    })

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <h3 className="font-serif text-3xl text-charcoal-700 mb-4">
          Thank you!
        </h3>
        <p className="text-charcoal-500 text-lg">
          We review submissions within 48 hours.
          <br />
          Bring the ideas — we&apos;ll bring the food.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className={labelClass}>
            Your name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className={labelClass}>
          Event title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          What&apos;s it about? *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className={inputClass}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className={labelClass}>
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className={inputClass}
          >
            <option value="">Select a category</option>
            {EVENT_CATEGORIES.map((c) => (
              <option key={c.value} value={c.value}>
                {c.formLabel}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="expectedSize" className={labelClass}>
            Expected attendance
          </label>
          <input
            id="expectedSize"
            name="expectedSize"
            type="number"
            min="1"
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label htmlFor="preferredDates" className={labelClass}>
          Preferred date(s) *
        </label>
        <input
          id="preferredDates"
          name="preferredDates"
          type="text"
          required
          placeholder="e.g., Any Saturday in April, or March 15th"
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="notes" className={labelClass}>
          Anything else we should know?
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className={inputClass}
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto px-8 py-3 bg-terracotta-500 text-cream-100 rounded-button font-semibold hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  )
}
