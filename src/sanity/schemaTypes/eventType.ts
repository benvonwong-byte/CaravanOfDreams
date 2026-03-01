import { defineField, defineType } from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({
      name: 'date',
      title: 'Start Date & Time',
      type: 'datetime',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date & Time',
      type: 'datetime',
    }),
    defineField({
      name: 'hostName',
      title: 'Host Name',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'hostBio',
      title: 'Host Bio',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'hostEmail',
      title: 'Host Email',
      type: 'string',
      description: 'Not displayed publicly',
      validation: (rule) => rule.email(),
    }),
    defineField({
      name: 'category',
      type: 'string',
      options: {
        list: [
          { title: 'Talk', value: 'talk' },
          { title: 'Hackathon', value: 'hackathon' },
          { title: 'Gathering', value: 'gathering' },
          { title: 'Workshop', value: 'workshop' },
          { title: 'Performance', value: 'performance' },
          { title: 'Screening', value: 'screening' },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'expectedSize',
      title: 'Expected Attendance',
      type: 'number',
    }),
    defineField({
      name: 'status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Approved', value: 'approved' },
          { title: 'Past', value: 'past' },
          { title: 'Cancelled', value: 'cancelled' },
        ],
      },
      initialValue: 'pending',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'featuredImage',
      title: 'Featured Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      rows: 3,
      description: 'Not displayed publicly — for staff only',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'hostName',
      date: 'date',
      status: 'status',
      media: 'featuredImage',
    },
    prepare({ title, subtitle, date, status, media }) {
      const dateStr = date
        ? new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })
        : ''
      return {
        title: `${title}`,
        subtitle: `${dateStr} · ${subtitle || 'No host'} · ${status || 'pending'}`,
        media,
      }
    },
  },
})
