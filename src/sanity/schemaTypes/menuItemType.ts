import { defineField, defineType } from 'sanity'

export const menuItemType = defineType({
  name: 'menuItem',
  title: 'Menu Item',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'price',
      type: 'number',
      validation: (rule) => rule.required().positive(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Mains', value: 'mains' },
          { title: 'Small Plates', value: 'small-plates' },
          { title: 'Drinks', value: 'drinks' },
          { title: 'Desserts', value: 'desserts' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'dietaryTags',
      title: 'Dietary Tags',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Raw', value: 'raw' },
          { title: 'Gluten-Free', value: 'gluten-free' },
          { title: 'Nut-Free', value: 'nut-free' },
          { title: 'Soy-Free', value: 'soy-free' },
        ],
      },
    }),
    defineField({
      name: 'image',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'category',
      media: 'image',
    },
  },
})
