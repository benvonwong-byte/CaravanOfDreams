export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || ''
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-11'

// Demo content is shown only when this is false. A configured but empty
// dataset must render as empty, never as fake events or menu items.
export const isSanityConfigured = Boolean(projectId)
