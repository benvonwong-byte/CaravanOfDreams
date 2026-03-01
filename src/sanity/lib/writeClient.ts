import 'server-only'

import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

export const writeClient =
  projectId && process.env.SANITY_WRITE_TOKEN
    ? createClient({
        projectId,
        dataset,
        apiVersion,
        token: process.env.SANITY_WRITE_TOKEN,
        useCdn: false,
      })
    : null
