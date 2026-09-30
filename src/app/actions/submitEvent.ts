'use server'

import { randomUUID } from 'node:crypto'
import { writeClient } from '@/sanity/lib/writeClient'
import { EVENT_CATEGORIES } from '@/lib/events'
import { SITE } from '@/lib/site'

interface SubmitEventData {
  name: string
  email: string
  title: string
  description: string
  category: string
  preferredDates: string
  expectedSize: string
  notes: string
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

export async function submitEvent(data: SubmitEventData) {
  if (!writeClient) {
    return { success: false, error: 'Sanity is not configured yet.' }
  }

  // The browser enforces `required`, but a server action is a public
  // endpoint, so validate again here.
  const title = data.title?.trim()
  const name = data.name?.trim()
  const email = data.email?.trim()
  const description = data.description?.trim()
  const preferredDates = data.preferredDates?.trim()
  const category = EVENT_CATEGORIES.some((c) => c.value === data.category)
    ? data.category
    : null
  if (!title || !name || !email || !description || !preferredDates || !category) {
    return { success: false, error: 'Please fill in all required fields.' }
  }
  const expectedSize = Number.parseInt(data.expectedSize, 10)

  try {
    const result = await writeClient.create({
      _type: 'event',
      title,
      slug: {
        _type: 'slug',
        // The suffix keeps slugs unique when two submissions share a title.
        // Staff can shorten it in the Studio before approving.
        current: `${slugify(title) || 'event'}-${randomUUID().slice(0, 6)}`,
      },
      description: [
        {
          _type: 'block',
          _key: randomUUID(),
          children: [{ _type: 'span', _key: randomUUID(), text: description }],
        },
      ],
      hostName: name,
      hostEmail: email,
      category,
      expectedSize:
        Number.isFinite(expectedSize) && expectedSize > 0 ? expectedSize : undefined,
      status: 'pending',
      notes: `Preferred dates: ${preferredDates}\n\nAdditional notes: ${data.notes?.trim() ?? ''}`,
    })
    return { success: true, id: result._id }
  } catch (error) {
    console.error('Failed to submit event:', error)
    return {
      success: false,
      error: `Something went wrong. Please try again, or email ${SITE.eventsEmail}.`,
    }
  }
}
