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
  return client.fetch<T>(query, params, {
    next: {
      tags,
      revalidate: tags.length ? false : 60,
    },
  })
}
