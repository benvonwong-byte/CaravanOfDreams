import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { schemaTypes } from './schemaTypes'

const config = defineConfig({
  name: 'default',
  title: 'Caravan of Dreams',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/admin',

  plugins: [structureTool()],

  schema: {
    types: schemaTypes,
  },
})

export default config
