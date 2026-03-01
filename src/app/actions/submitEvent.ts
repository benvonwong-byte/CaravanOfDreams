'use server'

import { writeClient } from '@/sanity/lib/writeClient'

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

export async function submitEvent(data: SubmitEventData) {
  try {
    const result = await writeClient.create({
      _type: 'event',
      title: data.title,
      slug: {
        _type: 'slug',
        current: data.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, ''),
      },
      description: [
        {
          _type: 'block',
          _key: crypto.randomUUID(),
          children: [
            {
              _type: 'span',
              _key: crypto.randomUUID(),
              text: data.description,
            },
          ],
        },
      ],
      hostName: data.name,
      hostEmail: data.email,
      category: data.category,
      expectedSize: data.expectedSize ? parseInt(data.expectedSize, 10) : undefined,
      status: 'pending',
      notes: `Preferred dates: ${data.preferredDates}\n\nAdditional notes: ${data.notes}`,
    })
    return { success: true, id: result._id }
  } catch (error) {
    console.error('Failed to submit event:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to submit event',
    }
  }
}
