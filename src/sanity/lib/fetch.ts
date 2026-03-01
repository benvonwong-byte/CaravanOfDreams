import 'server-only'

import type { QueryParams } from 'next-sanity'
import { client } from './client'

export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
}: {
  query: string
  params?: QueryParams
  tags?: string[]
}): Promise<T> {
  try {
    return await client.fetch<T>(query, params, {
      next: {
        tags,
        revalidate: tags.length ? false : 60,
      },
    })
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return [] as unknown as T
  }
}
