import 'server-only'

import type { QueryParams } from 'next-sanity'
import { client } from './client'

// Returns `fallback` when Sanity isn't configured or the request fails.
// The default `[]` suits list queries; pass `fallback: null` for
// single-document queries so callers can detect "not found".
export async function sanityFetch<T>({
  query,
  params = {},
  tags = [],
  fallback = [] as T,
}: {
  query: string
  params?: QueryParams
  tags?: string[]
  fallback?: T
}): Promise<T> {
  if (!client) {
    return fallback
  }

  try {
    return await client.fetch<T>(query, params, {
      next: {
        tags,
        // The webhook revalidates tagged pages on content edits. The hourly
        // fallback keeps time-dependent queries (`date >= now()`) and the
        // upcoming/past split from going stale between edits.
        revalidate: tags.length ? 3600 : 60,
      },
    })
  } catch (error) {
    console.error('Sanity fetch error:', error)
    return fallback
  }
}
