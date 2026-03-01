import { defineField, defineType } from 'sanity'

export const siteSettingsType = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'Hero headline text',
    }),
    defineField({
      name: 'mission',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Mission statement for the manifesto section',
    }),
    defineField({
      name: 'address',
      type: 'string',
    }),
    defineField({
      name: 'hours',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'platform', type: 'string' }),
            defineField({ name: 'url', type: 'url' }),
          ],
        },
      ],
    }),
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
      validation: (rule) => rule.email(),
    }),
  ],
})
