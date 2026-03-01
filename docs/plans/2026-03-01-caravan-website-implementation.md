# Caravan of Dreams Website Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build the Caravan of Dreams website — an events-first cultural portal built with Next.js App Router, Sanity CMS, and Tailwind CSS v4.

**Architecture:** Next.js App Router with server components by default, embedded Sanity Studio at `/admin`, tag-based ISR revalidation via webhooks. Event submissions create Sanity documents via server actions. Tailwind v4 with CSS-first `@theme` configuration.

**Tech Stack:** Next.js 15 (App Router), Sanity v5, next-sanity v12, Tailwind CSS v4, TypeScript, Vercel deployment.

**Design doc:** `docs/plans/2026-03-01-caravan-website-rebrand-design.md`

---

## Phase 1: Project Foundation

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, etc. (via create-next-app)

**Step 1: Scaffold the project**

Run from the project root (the current directory already exists, so we scaffold into a temp dir and move files):

```bash
cd /Users/vonwong/Desktop
npx create-next-app@latest caravan-temp --typescript --eslint --app --tailwind --src-dir --no-import-alias --no-turbopack
```

When prompted for import alias, accept the default `@/*`.

**Step 2: Move scaffolded files into our project directory**

```bash
# Move all files from temp into CaravanOfDreams (preserving existing docs/)
cp -r caravan-temp/* caravan-temp/.* /Users/vonwong/Desktop/CaravanOfDreams/ 2>/dev/null || true
rm -rf caravan-temp
cd /Users/vonwong/Desktop/CaravanOfDreams
```

**Step 3: Verify it runs**

```bash
npm run dev
```

Visit `http://localhost:3000` — should see the Next.js default page.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: initialize Next.js project with TypeScript, Tailwind, App Router"
```

---

### Task 2: Install Sanity dependencies

**Files:**
- Modify: `package.json`

**Step 1: Install packages**

```bash
npm install next-sanity @sanity/image-url sanity @sanity/client styled-components
```

**Step 2: Verify installation**

```bash
npm ls next-sanity sanity @sanity/image-url
```

Expected: all three packages listed without errors.

**Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "feat: install Sanity CMS dependencies"
```

---

### Task 3: Set up environment variables

**Files:**
- Create: `.env.local`
- Create: `.env.example`

**Step 1: Create Sanity project**

Go to [sanity.io/manage](https://www.sanity.io/manage) and create a new project called "Caravan of Dreams". Note the project ID. Use dataset name `production`.

Alternatively, if you want to skip manual setup for now, use placeholder values and configure later:

**Step 2: Create `.env.local`**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-11
SANITY_WRITE_TOKEN=YOUR_WRITE_TOKEN
SANITY_REVALIDATE_SECRET=YOUR_WEBHOOK_SECRET
```

**Step 3: Create `.env.example`**

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-07-11
SANITY_WRITE_TOKEN=
SANITY_REVALIDATE_SECRET=
```

**Step 4: Verify `.env.local` is in `.gitignore`**

Check that `.gitignore` includes `.env*.local`. The Next.js scaffold should already have this.

**Step 5: Commit**

```bash
git add .env.example .gitignore
git commit -m "feat: add environment variable template for Sanity"
```

---

### Task 4: Configure Tailwind v4 design tokens and fonts

**Files:**
- Create: `src/app/fonts.ts`
- Modify: `src/app/globals.css`
- Modify: `src/app/layout.tsx`

**Step 1: Create font configuration**

File: `src/app/fonts.ts`

```ts
import { Fraunces, DM_Sans } from 'next/font/google'

export const fraunces = Fraunces({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-fraunces',
  axes: ['opsz', 'SOFT', 'WONK'],
})

export const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-dm-sans',
  axes: ['opsz'],
})
```

**Step 2: Replace `src/app/globals.css` with brand design tokens**

```css
@import "tailwindcss";

/* ── Connect next/font variables to Tailwind ── */
@theme inline {
  --font-sans: var(--font-dm-sans);
  --font-serif: var(--font-fraunces);
}

/* ── Caravan of Dreams Design Tokens ── */
@theme {
  /* Primary: Deep terracotta */
  --color-terracotta-50: #fdf2ef;
  --color-terracotta-100: #f9e0d8;
  --color-terracotta-200: #f0bfae;
  --color-terracotta-300: #e49a80;
  --color-terracotta-400: #d4714f;
  --color-terracotta-500: #c45d3e;
  --color-terracotta-600: #a84a30;
  --color-terracotta-700: #8b3b28;
  --color-terracotta-800: #6e2f20;
  --color-terracotta-900: #52231a;

  /* Secondary: Sage green */
  --color-sage-50: #f4f6f2;
  --color-sage-100: #e4e9e0;
  --color-sage-200: #c8d3c0;
  --color-sage-300: #a6b89a;
  --color-sage-400: #8ea37f;
  --color-sage-500: #7a8b6f;
  --color-sage-600: #627059;
  --color-sage-700: #4d5846;
  --color-sage-800: #3a4235;
  --color-sage-900: #282e25;

  /* Accent: Mustard gold */
  --color-mustard-50: #fdf8ec;
  --color-mustard-100: #f9edcc;
  --color-mustard-200: #f0d898;
  --color-mustard-300: #e5c064;
  --color-mustard-400: #d4a843;
  --color-mustard-500: #b8902e;
  --color-mustard-600: #947324;
  --color-mustard-700: #70571c;
  --color-mustard-800: #4d3c14;
  --color-mustard-900: #33280e;

  /* Dark: Charcoal brown */
  --color-charcoal-50: #f5f3f2;
  --color-charcoal-100: #e0dcda;
  --color-charcoal-200: #bab3ae;
  --color-charcoal-300: #8e857e;
  --color-charcoal-400: #655b53;
  --color-charcoal-500: #49403a;
  --color-charcoal-600: #372f2a;
  --color-charcoal-700: #2c2420;
  --color-charcoal-800: #1e1916;
  --color-charcoal-900: #110e0c;

  /* Light: Warm cream */
  --color-cream-50: #fefdfb;
  --color-cream-100: #faf8f4;
  --color-cream-200: #f5f0e8;
  --color-cream-300: #ece5d8;
  --color-cream-400: #ddd3c2;
  --color-cream-500: #c9bca8;

  /* Pop: Deep teal */
  --color-teal-50: #eef6f6;
  --color-teal-100: #d4e8e8;
  --color-teal-200: #a3cece;
  --color-teal-300: #6dafaf;
  --color-teal-400: #479494;
  --color-teal-500: #2a6b6b;
  --color-teal-600: #215656;
  --color-teal-700: #1a4242;
  --color-teal-800: #132f2f;
  --color-teal-900: #0d1f1f;

  /* Border radius */
  --radius-card: 0.75rem;
  --radius-pill: 9999px;
  --radius-button: 0.5rem;

  /* Shadows */
  --shadow-soft: 0 2px 8px rgb(44 36 32 / 0.08);
  --shadow-card: 0 4px 16px rgb(44 36 32 / 0.1);
  --shadow-elevated: 0 8px 32px rgb(44 36 32 / 0.14);
}
```

**Step 3: Update root layout with fonts**

Replace `src/app/layout.tsx`:

```tsx
import type { Metadata } from 'next'
import { fraunces, dmSans } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caravan of Dreams — Where the East Village Dreams',
  description:
    'A gathering space for thinkers, doers, and dreamers. Host events, hackathons, and conversations at NYC\'s original vegan cultural hub since 1991.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-cream-200 text-charcoal-700 font-sans antialiased">
        {children}
      </body>
    </html>
  )
}
```

**Step 4: Verify fonts and colors work**

Replace `src/app/page.tsx` with a simple test:

```tsx
export default function Home() {
  return (
    <main className="min-h-screen p-12">
      <h1 className="font-serif text-5xl text-terracotta-500 mb-4">
        Caravan of Dreams
      </h1>
      <p className="text-lg text-charcoal-700 mb-8">
        Another world is possible. We&apos;re building it over dinner.
      </p>
      <div className="flex gap-4 flex-wrap">
        <div className="w-16 h-16 rounded-card bg-terracotta-500" />
        <div className="w-16 h-16 rounded-card bg-sage-500" />
        <div className="w-16 h-16 rounded-card bg-mustard-400" />
        <div className="w-16 h-16 rounded-card bg-charcoal-700" />
        <div className="w-16 h-16 rounded-card bg-cream-200 border border-charcoal-200" />
        <div className="w-16 h-16 rounded-card bg-teal-500" />
      </div>
    </main>
  )
}
```

Run `npm run dev` and verify:
- Heading uses Fraunces (serif, slightly irregular)
- Body uses DM Sans (clean sans-serif)
- Color swatches display correctly
- Background is warm cream

**Step 5: Commit**

```bash
git add src/app/fonts.ts src/app/globals.css src/app/layout.tsx src/app/page.tsx
git commit -m "feat: configure Tailwind v4 design tokens, Fraunces + DM Sans fonts"
```

---

### Task 5: Set up Sanity environment config and client

**Files:**
- Create: `src/sanity/env.ts`
- Create: `src/sanity/lib/client.ts`
- Create: `src/sanity/lib/fetch.ts`
- Create: `src/sanity/lib/image.ts`
- Create: `src/sanity/lib/queries.ts`

**Step 1: Create Sanity env helper**

File: `src/sanity/env.ts`

```ts
export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-07-11'
```

**Step 2: Create read-only client**

File: `src/sanity/lib/client.ts`

```ts
import { createClient } from 'next-sanity'
import { apiVersion, dataset, projectId } from '../env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})
```

**Step 3: Create write client (server-only)**

File: `src/sanity/lib/writeClient.ts`

```ts
import 'server-only'

import { createClient } from '@sanity/client'
import { apiVersion, dataset, projectId } from '../env'

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
})
```

**Step 4: Create fetch helper with tag-based caching**

File: `src/sanity/lib/fetch.ts`

```ts
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
```

**Step 5: Create image URL helper**

File: `src/sanity/lib/image.ts`

```ts
import createImageUrlBuilder from '@sanity/image-url'
import { dataset, projectId } from '../env'

const builder = createImageUrlBuilder({ projectId, dataset })

export function urlFor(source: any) {
  return builder.image(source)
}
```

**Step 6: Create queries file (empty for now)**

File: `src/sanity/lib/queries.ts`

```ts
import { defineQuery } from 'next-sanity'

// Queries will be added as we build each page
export const UPCOMING_EVENTS_QUERY = defineQuery(
  `*[_type == "event" && status == "approved" && date >= now()] | order(date asc)[0...4]{
    _id,
    title,
    slug,
    date,
    hostName,
    category,
    featuredImage
  }`
)

export const ALL_EVENTS_QUERY = defineQuery(
  `*[_type == "event" && status == "approved"] | order(date desc){
    _id,
    title,
    slug,
    date,
    endDate,
    hostName,
    category,
    featuredImage
  }`
)

export const EVENT_BY_SLUG_QUERY = defineQuery(
  `*[_type == "event" && slug.current == $slug && status == "approved"][0]{
    _id,
    title,
    slug,
    description,
    date,
    endDate,
    hostName,
    hostBio,
    category,
    featuredImage
  }`
)

export const MENU_ITEMS_QUERY = defineQuery(
  `*[_type == "menuItem"] | order(category asc, name asc){
    _id,
    name,
    description,
    price,
    category,
    dietaryTags,
    image
  }`
)

export const PAGE_BY_SLUG_QUERY = defineQuery(
  `*[_type == "page" && slug.current == $slug][0]{
    _id,
    title,
    slug,
    content
  }`
)

export const SITE_SETTINGS_QUERY = defineQuery(
  `*[_type == "siteSettings"][0]{
    tagline,
    mission,
    address,
    hours,
    socialLinks,
    contactEmail
  }`
)
```

**Step 7: Commit**

```bash
git add src/sanity/
git commit -m "feat: set up Sanity client, fetch helper, image builder, and GROQ queries"
```

---

### Task 6: Create Sanity content schemas

**Files:**
- Create: `src/sanity/schemaTypes/eventType.ts`
- Create: `src/sanity/schemaTypes/menuItemType.ts`
- Create: `src/sanity/schemaTypes/pageType.ts`
- Create: `src/sanity/schemaTypes/siteSettingsType.ts`
- Create: `src/sanity/schemaTypes/index.ts`

**Step 1: Event schema**

File: `src/sanity/schemaTypes/eventType.ts`

```ts
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
```

**Step 2: MenuItem schema**

File: `src/sanity/schemaTypes/menuItemType.ts`

```ts
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
```

**Step 3: Page schema**

File: `src/sanity/schemaTypes/pageType.ts`

```ts
import { defineField, defineType } from 'sanity'

export const pageType = defineType({
  name: 'page',
  title: 'Page',
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
      name: 'content',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
  ],
})
```

**Step 4: SiteSettings schema (singleton)**

File: `src/sanity/schemaTypes/siteSettingsType.ts`

```ts
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
```

**Step 5: Register all schemas**

File: `src/sanity/schemaTypes/index.ts`

```ts
import { eventType } from './eventType'
import { menuItemType } from './menuItemType'
import { pageType } from './pageType'
import { siteSettingsType } from './siteSettingsType'

export const schemaTypes = [eventType, menuItemType, pageType, siteSettingsType]
```

**Step 6: Commit**

```bash
git add src/sanity/schemaTypes/
git commit -m "feat: create Sanity schemas for Event, MenuItem, Page, SiteSettings"
```

---

### Task 7: Embed Sanity Studio at /admin

**Files:**
- Create: `src/sanity/sanity.config.ts`
- Create: `src/app/admin/[[...index]]/page.tsx`

**Step 1: Create Sanity config**

File: `src/sanity/sanity.config.ts`

```ts
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
```

**Step 2: Create Studio route**

File: `src/app/admin/[[...index]]/page.tsx`

```tsx
'use client'

import { NextStudio } from 'next-sanity/studio'
import config from '@/sanity/sanity.config'

export default function AdminPage() {
  return <NextStudio config={config} />
}
```

**Step 3: Verify Studio loads**

Run `npm run dev` and visit `http://localhost:3000/admin`.

Expected: Sanity Studio loads with Event, Menu Item, Page, and Site Settings document types in the sidebar. (You'll need valid Sanity project credentials for this to fully work — if using placeholders, the page should still render the Studio shell.)

**Step 4: Commit**

```bash
git add src/sanity/sanity.config.ts src/app/admin/
git commit -m "feat: embed Sanity Studio at /admin route"
```

---

### Task 8: Set up revalidation webhook endpoint

**Files:**
- Create: `src/app/api/revalidate/route.ts`

**Step 1: Create the webhook handler**

File: `src/app/api/revalidate/route.ts`

```ts
import { revalidateTag } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'
import { parseBody } from 'next-sanity/webhook'

export async function POST(req: NextRequest) {
  try {
    const { body, isValidSignature } = await parseBody<{
      _type: string
      slug?: string
    }>(req, process.env.SANITY_REVALIDATE_SECRET)

    if (!isValidSignature) {
      return new Response('Invalid Signature', { status: 401 })
    }

    if (!body?._type) {
      return new Response('Bad Request', { status: 400 })
    }

    revalidateTag(body._type)

    return NextResponse.json({
      status: 200,
      revalidated: true,
      now: Date.now(),
      body,
    })
  } catch (error: unknown) {
    console.error(error)
    return new Response('Webhook handler failed', { status: 500 })
  }
}
```

**Step 2: Commit**

```bash
git add src/app/api/revalidate/
git commit -m "feat: add Sanity webhook revalidation endpoint"
```

---

## Phase 2: Layout & Navigation

### Task 9: Build the site header / navigation

**Files:**
- Create: `src/components/Header.tsx`
- Create: `src/components/MobileNav.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create Header component**

File: `src/components/Header.tsx`

```tsx
import Link from 'next/link'
import { MobileNav } from './MobileNav'

const navLinks = [
  { href: '/events', label: 'Events' },
  { href: '/host', label: 'Host' },
  { href: '/space', label: 'The Space' },
  { href: '/menu', label: 'Menu' },
  { href: '/about', label: 'About' },
]

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-cream-200/90 backdrop-blur-sm border-b border-charcoal-100">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-serif text-xl text-charcoal-700 hover:text-terracotta-500 transition-colors"
        >
          Caravan of Dreams
        </Link>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-sm text-charcoal-500 hover:text-terracotta-500 transition-colors"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile nav toggle */}
        <MobileNav links={navLinks} />
      </nav>
    </header>
  )
}
```

**Step 2: Create MobileNav component**

File: `src/components/MobileNav.tsx`

```tsx
'use client'

import Link from 'next/link'
import { useState } from 'react'

interface MobileNavProps {
  links: { href: string; label: string }[]
}

export function MobileNav({ links }: MobileNavProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 text-charcoal-700"
        aria-label={open ? 'Close menu' : 'Open menu'}
      >
        {open ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute top-16 left-0 right-0 bg-cream-200 border-b border-charcoal-100 shadow-card">
          <ul className="flex flex-col p-6 gap-4">
            {links.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-lg text-charcoal-600 hover:text-terracotta-500 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
```

**Step 3: Update layout to include Header**

In `src/app/layout.tsx`, add the Header to the body:

```tsx
import type { Metadata } from 'next'
import { fraunces, dmSans } from './fonts'
import { Header } from '@/components/Header'
import './globals.css'

export const metadata: Metadata = {
  title: 'Caravan of Dreams — Where the East Village Dreams',
  description:
    'A gathering space for thinkers, doers, and dreamers. Host events, hackathons, and conversations at NYC\'s original vegan cultural hub since 1991.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${fraunces.variable} ${dmSans.variable}`}>
      <body className="bg-cream-200 text-charcoal-700 font-sans antialiased">
        <Header />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
```

**Step 4: Verify navigation**

Run `npm run dev`. Check:
- Desktop: horizontal nav links visible
- Resize to mobile: hamburger menu appears, toggles dropdown
- Logo links to home
- All links point to correct routes

**Step 5: Commit**

```bash
git add src/components/Header.tsx src/components/MobileNav.tsx src/app/layout.tsx
git commit -m "feat: build responsive site header with mobile nav"
```

---

### Task 10: Build the Footer

**Files:**
- Create: `src/components/Footer.tsx`
- Modify: `src/app/layout.tsx`

**Step 1: Create Footer component**

File: `src/components/Footer.tsx`

```tsx
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="bg-charcoal-700 text-cream-300 mt-24">
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1: Brand */}
          <div>
            <h3 className="font-serif text-2xl text-cream-200 mb-4">
              Caravan of Dreams
            </h3>
            <p className="text-cream-400 text-sm leading-relaxed">
              Since 1991, a gathering space for thinkers, doers, and dreamers
              in the heart of the East Village.
            </p>
          </div>

          {/* Column 2: Links */}
          <div>
            <h4 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">
              Navigate
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/events', label: 'Events' },
                { href: '/host', label: 'Host an Event' },
                { href: '/space', label: 'The Space' },
                { href: '/menu', label: 'Menu' },
                { href: '/about', label: 'About' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream-400 hover:text-terracotta-300 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Location */}
          <div>
            <h4 className="text-sm font-semibold text-cream-200 uppercase tracking-wider mb-4">
              Find Us
            </h4>
            <address className="not-italic text-sm text-cream-400 leading-relaxed">
              405 E 6th Street<br />
              New York, NY 10009<br />
              Between 1st Ave &amp; Ave A
            </address>
          </div>
        </div>

        <div className="border-t border-charcoal-600 mt-12 pt-8 text-center">
          <p className="font-serif text-lg text-cream-300">
            Eat. Dream. Build.
          </p>
        </div>
      </div>
    </footer>
  )
}
```

**Step 2: Add Footer to layout**

In `src/app/layout.tsx`, import and add `<Footer />` after `</main>` and before the closing `</body>`:

```tsx
import { Footer } from '@/components/Footer'
// ... existing imports

// In the body, after </main>:
<Footer />
```

**Step 3: Verify footer renders**

Run `npm run dev`. Check the footer appears at the bottom with three columns on desktop, stacked on mobile.

**Step 4: Commit**

```bash
git add src/components/Footer.tsx src/app/layout.tsx
git commit -m "feat: build site footer with navigation and location"
```

---

## Phase 3: Home Page

### Task 11: Build the Hero section

**Files:**
- Create: `src/components/home/Hero.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create Hero component**

File: `src/components/home/Hero.tsx`

```tsx
import Link from 'next/link'

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center bg-charcoal-700 overflow-hidden">
      {/* Texture overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-charcoal-900/60 to-charcoal-700/80" />

      {/* Content */}
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <h1 className="font-serif text-5xl md:text-7xl text-cream-200 leading-tight mb-6">
          Another world is possible.
          <br />
          <span className="text-terracotta-300">
            We&apos;re building it over dinner.
          </span>
        </h1>

        <p className="text-lg md:text-xl text-cream-400 mb-10 max-w-xl mx-auto">
          A free space for gathering, building, and dreaming — in the heart
          of the East Village since 1991.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/events"
            className="inline-block px-8 py-3 bg-terracotta-500 text-cream-100 rounded-button font-semibold hover:bg-terracotta-600 transition-colors"
          >
            Explore Events
          </Link>
          <Link
            href="/host"
            className="inline-block px-8 py-3 border-2 border-cream-300 text-cream-200 rounded-button font-semibold hover:bg-cream-200/10 transition-colors"
          >
            Host a Gathering
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 2: Update page.tsx to use Hero**

Replace `src/app/page.tsx`:

```tsx
import { Hero } from '@/components/home/Hero'

export default function Home() {
  return (
    <>
      <Hero />
    </>
  )
}
```

**Step 3: Verify**

Run `npm run dev`. Check: full-viewport hero with headline, subtext, two CTA buttons. Responsive on mobile.

**Step 4: Commit**

```bash
git add src/components/home/Hero.tsx src/app/page.tsx
git commit -m "feat: build home page hero section"
```

---

### Task 12: Build the Manifesto and Host CTA sections

**Files:**
- Create: `src/components/home/Manifesto.tsx`
- Create: `src/components/home/HostCTA.tsx`
- Create: `src/components/home/SpaceTeaser.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create Manifesto component**

File: `src/components/home/Manifesto.tsx`

```tsx
export function Manifesto() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <p className="font-serif text-2xl md:text-3xl text-charcoal-700 leading-relaxed">
          Since 1991, this corner of the East Village has been a space for
          dreamers. A place where ideas are nourished alongside bodies — where
          the price of admission is simply sharing a meal, and the currency
          is curiosity.
        </p>
      </div>
    </section>
  )
}
```

**Step 2: Create HostCTA component**

File: `src/components/home/HostCTA.tsx`

```tsx
import Link from 'next/link'

export function HostCTA() {
  return (
    <section className="py-24 px-6 bg-sage-50">
      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="font-serif text-3xl md:text-4xl text-charcoal-700 mb-6">
            Got an idea? A movement? A conversation that needs a room?
          </h2>
          <p className="text-charcoal-500 mb-8 leading-relaxed">
            We open our doors to anyone with a vision worth sharing. Host a
            talk, a hackathon, a workshop, a gathering — the only cost is
            eating and drinking in the space.
          </p>
          <Link
            href="/host"
            className="inline-block px-8 py-3 bg-teal-500 text-cream-100 rounded-button font-semibold hover:bg-teal-600 transition-colors"
          >
            Submit Your Event
          </Link>
        </div>
        <div className="aspect-[4/3] bg-sage-200 rounded-card" />
      </div>
    </section>
  )
}
```

**Step 3: Create SpaceTeaser component**

File: `src/components/home/SpaceTeaser.tsx`

```tsx
import Link from 'next/link'

export function SpaceTeaser() {
  return (
    <section className="py-24 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <div className="aspect-[21/9] bg-charcoal-200 rounded-card mb-8" />
        <p className="font-serif text-2xl text-charcoal-600 mb-4">
          405 E 6th St — where the East Village still dreams
        </p>
        <Link
          href="/space"
          className="text-terracotta-500 font-semibold hover:text-terracotta-600 transition-colors"
        >
          Explore the Space &rarr;
        </Link>
      </div>
    </section>
  )
}
```

**Step 4: Assemble home page**

Update `src/app/page.tsx`:

```tsx
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { HostCTA } from '@/components/home/HostCTA'
import { SpaceTeaser } from '@/components/home/SpaceTeaser'

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <HostCTA />
      <SpaceTeaser />
    </>
  )
}
```

**Step 5: Verify**

Run `npm run dev`. All sections should render in order. Placeholder rectangles for images.

**Step 6: Commit**

```bash
git add src/components/home/ src/app/page.tsx
git commit -m "feat: build manifesto, host CTA, and space teaser sections"
```

---

### Task 13: Build the Upcoming Events section on homepage

**Files:**
- Create: `src/components/EventCard.tsx`
- Create: `src/components/home/UpcomingEvents.tsx`
- Modify: `src/app/page.tsx`

**Step 1: Create reusable EventCard**

File: `src/components/EventCard.tsx`

```tsx
import Link from 'next/link'

interface EventCardProps {
  title: string
  slug: string
  date: string
  hostName: string
  category: string
}

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export function EventCard({
  title,
  slug,
  date,
  hostName,
  category,
}: EventCardProps) {
  const d = new Date(date)
  const month = d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()
  const day = d.getDate()

  return (
    <Link
      href={`/events/${slug}`}
      className="group block bg-cream-50 rounded-card p-6 shadow-soft hover:shadow-card transition-shadow"
    >
      <div className="flex items-start gap-4">
        <div className="text-center min-w-[3rem]">
          <p className="text-xs font-semibold text-terracotta-500 uppercase">
            {month}
          </p>
          <p className="text-2xl font-serif text-charcoal-700">{day}</p>
        </div>
        <div className="flex-1 min-w-0">
          <span className="inline-block text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-pill mb-2">
            {categoryLabels[category] || category}
          </span>
          <h3 className="font-serif text-lg text-charcoal-700 group-hover:text-terracotta-500 transition-colors truncate">
            {title}
          </h3>
          <p className="text-sm text-charcoal-400 mt-1">{hostName}</p>
        </div>
      </div>
    </Link>
  )
}
```

**Step 2: Create UpcomingEvents section**

File: `src/components/home/UpcomingEvents.tsx`

```tsx
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { UPCOMING_EVENTS_QUERY } from '@/sanity/lib/queries'
import { EventCard } from '@/components/EventCard'

export async function UpcomingEvents() {
  const events = await sanityFetch<any[]>({
    query: UPCOMING_EVENTS_QUERY,
    tags: ['event'],
  })

  return (
    <section className="py-24 px-6 bg-cream-300/50">
      <div className="max-w-5xl mx-auto">
        <h2 className="font-serif text-3xl md:text-4xl text-charcoal-700 text-center mb-12">
          What&apos;s happening at Caravan
        </h2>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            {events.map((event: any) => (
              <EventCard
                key={event._id}
                title={event.title}
                slug={event.slug.current}
                date={event.date}
                hostName={event.hostName}
                category={event.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-charcoal-400 mb-8">
            No upcoming events yet — be the first to{' '}
            <Link href="/host" className="text-terracotta-500 underline">
              host one
            </Link>
            .
          </p>
        )}

        <div className="text-center">
          <Link
            href="/events"
            className="text-terracotta-500 font-semibold hover:text-terracotta-600 transition-colors"
          >
            View All Events &rarr;
          </Link>
        </div>
      </div>
    </section>
  )
}
```

**Step 3: Add to home page**

Update `src/app/page.tsx` to import and place `<UpcomingEvents />` between `<Manifesto />` and `<HostCTA />`:

```tsx
import { Hero } from '@/components/home/Hero'
import { Manifesto } from '@/components/home/Manifesto'
import { UpcomingEvents } from '@/components/home/UpcomingEvents'
import { HostCTA } from '@/components/home/HostCTA'
import { SpaceTeaser } from '@/components/home/SpaceTeaser'

export default function Home() {
  return (
    <>
      <Hero />
      <Manifesto />
      <UpcomingEvents />
      <HostCTA />
      <SpaceTeaser />
    </>
  )
}
```

**Step 4: Verify**

Run `npm run dev`. The Upcoming Events section should render. With no Sanity data yet, it shows the "No upcoming events" fallback with a link to host.

**Step 5: Commit**

```bash
git add src/components/EventCard.tsx src/components/home/UpcomingEvents.tsx src/app/page.tsx
git commit -m "feat: build upcoming events section with EventCard component"
```

---

## Phase 4: Events System

### Task 14: Build the Events page with list view

**Files:**
- Create: `src/app/events/page.tsx`
- Create: `src/components/events/EventsList.tsx`
- Create: `src/components/events/CategoryFilter.tsx`

**Step 1: Create CategoryFilter (client component)**

File: `src/components/events/CategoryFilter.tsx`

```tsx
'use client'

const categories = [
  { value: 'all', label: 'All' },
  { value: 'talk', label: 'Talks' },
  { value: 'hackathon', label: 'Hackathons' },
  { value: 'gathering', label: 'Gatherings' },
  { value: 'workshop', label: 'Workshops' },
  { value: 'performance', label: 'Performances' },
  { value: 'screening', label: 'Screenings' },
]

interface CategoryFilterProps {
  selected: string
  onChange: (category: string) => void
}

export function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onChange(cat.value)}
          className={`px-4 py-1.5 rounded-pill text-sm font-medium transition-colors ${
            selected === cat.value
              ? 'bg-terracotta-500 text-cream-100'
              : 'bg-cream-100 text-charcoal-500 hover:bg-cream-300'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
```

**Step 2: Create EventsList (client component with filter state)**

File: `src/components/events/EventsList.tsx`

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoryFilter } from './CategoryFilter'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  hostName: string
  category: string
}

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export function EventsList({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState('all')

  const now = new Date()
  const filtered = events.filter(
    (e) => filter === 'all' || e.category === filter
  )
  const upcoming = filtered.filter((e) => new Date(e.date) >= now)
  const past = filtered.filter((e) => new Date(e.date) < now)

  return (
    <div>
      <div className="mb-8">
        <CategoryFilter selected={filter} onChange={setFilter} />
      </div>

      {upcoming.length > 0 && (
        <div className="mb-12">
          <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
            Upcoming
          </h3>
          <div className="space-y-3">
            {upcoming.map((event) => (
              <EventRow key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {past.length > 0 && (
        <div className="opacity-60">
          <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
            Past
          </h3>
          <div className="space-y-3">
            {past.map((event) => (
              <EventRow key={event._id} event={event} />
            ))}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <p className="text-charcoal-400 text-center py-12">
          No events in this category yet.
        </p>
      )}
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  const d = new Date(event.date)
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <Link
      href={`/events/${event.slug.current}`}
      className="group flex items-center gap-6 py-4 px-4 rounded-card hover:bg-cream-100 transition-colors"
    >
      <span className="text-sm font-semibold text-terracotta-500 min-w-[4rem] uppercase">
        {dateStr}
      </span>
      <span className="font-serif text-lg text-charcoal-700 group-hover:text-terracotta-500 transition-colors flex-1">
        {event.title}
      </span>
      <span className="hidden sm:inline text-sm text-charcoal-400">
        {event.hostName}
      </span>
      <span className="text-sm text-charcoal-400">{timeStr}</span>
      <span className="hidden sm:inline text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-pill">
        {categoryLabels[event.category] || event.category}
      </span>
    </Link>
  )
}
```

**Step 3: Create the Events page (server component)**

File: `src/app/events/page.tsx`

```tsx
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { ALL_EVENTS_QUERY } from '@/sanity/lib/queries'
import { EventsList } from '@/components/events/EventsList'

export const metadata = {
  title: 'Events — Caravan of Dreams',
  description: 'Talks, hackathons, workshops, and gatherings at Caravan of Dreams.',
}

export default async function EventsPage() {
  const events = await sanityFetch<any[]>({
    query: ALL_EVENTS_QUERY,
    tags: ['event'],
  })

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
          What&apos;s happening at Caravan
        </h1>
        <p className="text-charcoal-500">
          Talks, hackathons, workshops, and gatherings — all under one roof.
        </p>
      </div>

      <EventsList events={events} />

      <div className="mt-16 text-center p-8 bg-sage-50 rounded-card">
        <p className="font-serif text-xl text-charcoal-600 mb-4">
          Want to host? Submit your event.
        </p>
        <Link
          href="/host"
          className="inline-block px-8 py-3 bg-teal-500 text-cream-100 rounded-button font-semibold hover:bg-teal-600 transition-colors"
        >
          Submit Your Event
        </Link>
      </div>
    </div>
  )
}
```

**Step 4: Verify**

Run `npm run dev` and visit `/events`. Should render with filters and empty state.

**Step 5: Commit**

```bash
git add src/app/events/ src/components/events/
git commit -m "feat: build events page with list view and category filter"
```

---

### Task 15: Build the Calendar view

**Files:**
- Create: `src/components/events/Calendar.tsx`
- Create: `src/components/events/ViewToggle.tsx`
- Modify: `src/components/events/EventsList.tsx`

**Step 1: Create ViewToggle component**

File: `src/components/events/ViewToggle.tsx`

```tsx
'use client'

interface ViewToggleProps {
  view: 'list' | 'calendar'
  onChange: (view: 'list' | 'calendar') => void
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex rounded-button overflow-hidden border border-charcoal-200">
      <button
        onClick={() => onChange('list')}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          view === 'list'
            ? 'bg-charcoal-700 text-cream-200'
            : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
        }`}
      >
        List
      </button>
      <button
        onClick={() => onChange('calendar')}
        className={`px-4 py-1.5 text-sm font-medium transition-colors ${
          view === 'calendar'
            ? 'bg-charcoal-700 text-cream-200'
            : 'bg-cream-100 text-charcoal-500 hover:bg-cream-200'
        }`}
      >
        Calendar
      </button>
    </div>
  )
}
```

**Step 2: Create Calendar component**

File: `src/components/events/Calendar.tsx`

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  date: string
  hostName: string
  category: string
}

interface CalendarProps {
  events: Event[]
  filter: string
}

export function Calendar({ events, filter }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const monthName = currentDate.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  const filtered = events.filter(
    (e) => filter === 'all' || e.category === filter
  )

  // Group events by day
  const eventsByDay: Record<number, Event[]> = {}
  filtered.forEach((event) => {
    const d = new Date(event.date)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!eventsByDay[day]) eventsByDay[day] = []
      eventsByDay[day].push(event)
    }
  })

  const [selectedDay, setSelectedDay] = useState<number | null>(null)

  const prevMonth = () =>
    setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () =>
    setCurrentDate(new Date(year, month + 1, 1))

  const days = []
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} />)
  }
  for (let day = 1; day <= daysInMonth; day++) {
    const hasEvents = eventsByDay[day] && eventsByDay[day].length > 0
    const isSelected = selectedDay === day
    days.push(
      <button
        key={day}
        onClick={() => setSelectedDay(isSelected ? null : day)}
        className={`aspect-square flex flex-col items-center justify-center rounded-button text-sm transition-colors ${
          isSelected
            ? 'bg-terracotta-500 text-cream-100'
            : hasEvents
              ? 'bg-terracotta-50 text-charcoal-700 hover:bg-terracotta-100'
              : 'text-charcoal-400 hover:bg-cream-300'
        }`}
      >
        {day}
        {hasEvents && (
          <span
            className={`w-1.5 h-1.5 rounded-full mt-0.5 ${isSelected ? 'bg-cream-200' : 'bg-terracotta-500'}`}
          />
        )}
      </button>
    )
  }

  const selectedEvents = selectedDay ? eventsByDay[selectedDay] || [] : []

  return (
    <div>
      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="text-charcoal-500 hover:text-charcoal-700 transition-colors p-1"
        >
          &larr;
        </button>
        <h3 className="font-serif text-xl text-charcoal-700">{monthName}</h3>
        <button
          onClick={nextMonth}
          className="text-charcoal-500 hover:text-charcoal-700 transition-colors p-1"
        >
          &rarr;
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
          <div
            key={d}
            className="text-center text-xs font-semibold text-charcoal-400 uppercase"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">{days}</div>

      {/* Selected day events */}
      {selectedDay && (
        <div className="mt-6 space-y-2">
          {selectedEvents.length > 0 ? (
            selectedEvents.map((event) => {
              const time = new Date(event.date).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })
              return (
                <Link
                  key={event._id}
                  href={`/events/${event.slug.current}`}
                  className="block p-3 bg-cream-100 rounded-card hover:bg-cream-200 transition-colors"
                >
                  <span className="font-serif text-charcoal-700">
                    {event.title}
                  </span>
                  <span className="text-sm text-charcoal-400 ml-2">
                    {time} &middot; {event.hostName}
                  </span>
                </Link>
              )
            })
          ) : (
            <p className="text-charcoal-400 text-sm">
              No events on this day.
            </p>
          )}
        </div>
      )}
    </div>
  )
}
```

**Step 3: Update EventsList to include view toggle and calendar**

Replace `src/components/events/EventsList.tsx`:

```tsx
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CategoryFilter } from './CategoryFilter'
import { ViewToggle } from './ViewToggle'
import { Calendar } from './Calendar'

interface Event {
  _id: string
  title: string
  slug: { current: string }
  date: string
  endDate?: string
  hostName: string
  category: string
}

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export function EventsList({ events }: { events: Event[] }) {
  const [filter, setFilter] = useState('all')
  const [view, setView] = useState<'list' | 'calendar'>('list')

  const now = new Date()
  const filtered = events.filter(
    (e) => filter === 'all' || e.category === filter
  )
  const upcoming = filtered.filter((e) => new Date(e.date) >= now)
  const past = filtered.filter((e) => new Date(e.date) < now)

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8">
        <CategoryFilter selected={filter} onChange={setFilter} />
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === 'calendar' ? (
        <Calendar events={events} filter={filter} />
      ) : (
        <>
          {upcoming.length > 0 && (
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
                Upcoming
              </h3>
              <div className="space-y-1">
                {upcoming.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {past.length > 0 && (
            <div className="opacity-60">
              <h3 className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-4">
                Past
              </h3>
              <div className="space-y-1">
                {past.map((event) => (
                  <EventRow key={event._id} event={event} />
                ))}
              </div>
            </div>
          )}

          {filtered.length === 0 && (
            <p className="text-charcoal-400 text-center py-12">
              No events in this category yet.
            </p>
          )}
        </>
      )}
    </div>
  )
}

function EventRow({ event }: { event: Event }) {
  const d = new Date(event.date)
  const dateStr = d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <Link
      href={`/events/${event.slug.current}`}
      className="group flex items-center gap-6 py-4 px-4 rounded-card hover:bg-cream-100 transition-colors"
    >
      <span className="text-sm font-semibold text-terracotta-500 min-w-[4rem] uppercase">
        {dateStr}
      </span>
      <span className="font-serif text-lg text-charcoal-700 group-hover:text-terracotta-500 transition-colors flex-1">
        {event.title}
      </span>
      <span className="hidden sm:inline text-sm text-charcoal-400">
        {event.hostName}
      </span>
      <span className="text-sm text-charcoal-400">{timeStr}</span>
      <span className="hidden sm:inline text-xs font-semibold text-teal-600 bg-teal-50 px-2 py-0.5 rounded-pill">
        {categoryLabels[event.category] || event.category}
      </span>
    </Link>
  )
}
```

**Step 4: Verify**

Run `npm run dev` and visit `/events`. Toggle between list and calendar views. Category filters should work on both.

**Step 5: Commit**

```bash
git add src/components/events/
git commit -m "feat: add calendar view with month navigation and view toggle"
```

---

### Task 16: Build the Event detail page

**Files:**
- Create: `src/app/events/[slug]/page.tsx`

**Step 1: Create the event detail page**

File: `src/app/events/[slug]/page.tsx`

```tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { sanityFetch } from '@/sanity/lib/fetch'
import { EVENT_BY_SLUG_QUERY } from '@/sanity/lib/queries'
import { PortableText } from 'next-sanity'

const categoryLabels: Record<string, string> = {
  talk: 'Talk',
  hackathon: 'Hackathon',
  gathering: 'Gathering',
  workshop: 'Workshop',
  performance: 'Performance',
  screening: 'Screening',
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const event = await sanityFetch<any>({
    query: EVENT_BY_SLUG_QUERY,
    params: { slug },
    tags: ['event'],
  })

  if (!event) notFound()

  const d = new Date(event.date)
  const dateStr = d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
  const timeStr = d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Link
        href="/events"
        className="text-sm text-charcoal-400 hover:text-terracotta-500 transition-colors mb-8 inline-block"
      >
        &larr; Back to Events
      </Link>

      <span className="inline-block text-xs font-semibold text-teal-600 bg-teal-50 px-3 py-1 rounded-pill mb-4">
        {categoryLabels[event.category] || event.category}
      </span>

      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        {event.title}
      </h1>

      <div className="flex flex-wrap gap-4 text-charcoal-500 mb-8">
        <span>{dateStr}</span>
        <span>&middot;</span>
        <span>{timeStr}</span>
      </div>

      {event.hostName && (
        <div className="bg-sage-50 rounded-card p-6 mb-8">
          <p className="text-sm font-semibold text-charcoal-400 uppercase tracking-wider mb-1">
            Hosted by
          </p>
          <p className="font-serif text-xl text-charcoal-700">
            {event.hostName}
          </p>
          {event.hostBio && (
            <p className="text-charcoal-500 mt-2">{event.hostBio}</p>
          )}
        </div>
      )}

      {event.description && (
        <div className="prose prose-lg max-w-none">
          <PortableText value={event.description} />
        </div>
      )}
    </div>
  )
}
```

**Step 2: Verify**

Run `npm run dev` and visit `/events/any-slug`. Should show a 404 (no data yet). The page structure is ready for when events exist in Sanity.

**Step 3: Commit**

```bash
git add src/app/events/
git commit -m "feat: build event detail page with portable text rendering"
```

---

### Task 17: Build the Host / Submit Event page

**Files:**
- Create: `src/app/host/page.tsx`
- Create: `src/components/host/EventForm.tsx`
- Create: `src/app/actions/submitEvent.ts`

**Step 1: Create the server action**

File: `src/app/actions/submitEvent.ts`

```ts
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
```

**Step 2: Create the form component**

File: `src/components/host/EventForm.tsx`

```tsx
'use client'

import { useState } from 'react'
import { submitEvent } from '@/app/actions/submitEvent'

export function EventForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errorMessage, setErrorMessage] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setStatus('submitting')

    const form = new FormData(e.currentTarget)
    const result = await submitEvent({
      name: form.get('name') as string,
      email: form.get('email') as string,
      title: form.get('title') as string,
      description: form.get('description') as string,
      category: form.get('category') as string,
      preferredDates: form.get('preferredDates') as string,
      expectedSize: form.get('expectedSize') as string,
      notes: form.get('notes') as string,
    })

    if (result.success) {
      setStatus('success')
    } else {
      setStatus('error')
      setErrorMessage(result.error || 'Something went wrong.')
    }
  }

  if (status === 'success') {
    return (
      <div className="text-center py-16">
        <h3 className="font-serif text-3xl text-charcoal-700 mb-4">
          Thank you!
        </h3>
        <p className="text-charcoal-500 text-lg">
          We review submissions within 48 hours.
          <br />
          Bring the ideas — we&apos;ll bring the food.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-charcoal-600 mb-1">
            Your name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            required
            className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-charcoal-600 mb-1">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-charcoal-600 mb-1">
          Event title *
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-charcoal-600 mb-1">
          What&apos;s it about? *
        </label>
        <textarea
          id="description"
          name="description"
          required
          rows={5}
          className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-charcoal-600 mb-1">
            Category *
          </label>
          <select
            id="category"
            name="category"
            required
            className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
          >
            <option value="">Select a category</option>
            <option value="talk">Talk / Lecture</option>
            <option value="hackathon">Hackathon</option>
            <option value="workshop">Workshop</option>
            <option value="gathering">Community Gathering</option>
            <option value="performance">Performance</option>
            <option value="screening">Film Screening</option>
          </select>
        </div>
        <div>
          <label htmlFor="expectedSize" className="block text-sm font-medium text-charcoal-600 mb-1">
            Expected attendance
          </label>
          <input
            id="expectedSize"
            name="expectedSize"
            type="number"
            min="1"
            className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
          />
        </div>
      </div>

      <div>
        <label htmlFor="preferredDates" className="block text-sm font-medium text-charcoal-600 mb-1">
          Preferred date(s) *
        </label>
        <input
          id="preferredDates"
          name="preferredDates"
          type="text"
          required
          placeholder="e.g., Any Saturday in April, or March 15th"
          className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
        />
      </div>

      <div>
        <label htmlFor="notes" className="block text-sm font-medium text-charcoal-600 mb-1">
          Anything else we should know?
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={3}
          className="w-full px-4 py-3 rounded-button border border-charcoal-200 bg-cream-50 text-charcoal-700 focus:outline-none focus:ring-2 focus:ring-terracotta-500/50 focus:border-terracotta-500"
        />
      </div>

      {status === 'error' && (
        <p className="text-red-600 text-sm">{errorMessage}</p>
      )}

      <button
        type="submit"
        disabled={status === 'submitting'}
        className="w-full sm:w-auto px-8 py-3 bg-terracotta-500 text-cream-100 rounded-button font-semibold hover:bg-terracotta-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {status === 'submitting' ? 'Submitting...' : 'Submit for Review'}
      </button>
    </form>
  )
}
```

**Step 3: Create the Host page**

File: `src/app/host/page.tsx`

```tsx
import { EventForm } from '@/components/host/EventForm'

export const metadata = {
  title: 'Host an Event — Caravan of Dreams',
  description: 'Submit your event to be hosted at Caravan of Dreams in the East Village.',
}

export default function HostPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        Bring your vision to the table
      </h1>
      <p className="text-charcoal-500 text-lg mb-4 leading-relaxed">
        Caravan of Dreams opens its doors to anyone with an idea worth sharing.
        The only cost? Eating and drinking in the space. That&apos;s it. No
        rental fees, no minimums — just nourish yourself while you nourish the
        conversation.
      </p>

      <div className="mb-12">
        <h2 className="font-serif text-xl text-charcoal-600 mb-3">
          What we&apos;re looking for
        </h2>
        <div className="flex flex-wrap gap-3">
          {[
            'Talks & Lectures',
            'Hackathons',
            'Workshops',
            'Community Gatherings',
            'Performances',
            'Film Screenings',
          ].map((type) => (
            <span
              key={type}
              className="px-4 py-2 bg-sage-50 text-sage-700 rounded-pill text-sm font-medium"
            >
              {type}
            </span>
          ))}
        </div>
      </div>

      <EventForm />
    </div>
  )
}
```

**Step 4: Verify**

Run `npm run dev` and visit `/host`. Form should render with all fields. (Submission won't work without valid Sanity credentials, but the UI should be fully functional.)

**Step 5: Commit**

```bash
git add src/app/host/ src/app/actions/ src/components/host/
git commit -m "feat: build event submission form with server action"
```

---

## Phase 5: Content Pages

### Task 18: Build The Space page

**Files:**
- Create: `src/app/space/page.tsx`

**Step 1: Create the Space page**

File: `src/app/space/page.tsx`

```tsx
import Link from 'next/link'

export const metadata = {
  title: 'The Space — Caravan of Dreams',
  description: 'Explore the Caravan of Dreams venue in the East Village. Capacity, amenities, and how to host your event.',
}

export default function SpacePage() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        The Space
      </h1>
      <p className="text-charcoal-500 text-lg mb-12">
        405 E 6th Street — between 1st Ave &amp; Avenue A, in the heart of the
        East Village.
      </p>

      {/* Photo placeholder */}
      <div className="aspect-[21/9] bg-charcoal-200 rounded-card mb-16" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-cream-100 rounded-card p-6">
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">
            Capacity
          </h3>
          <p className="text-charcoal-500">
            Up to 35 seated in the Red Room. Main dining space accommodates
            larger gatherings.
          </p>
        </div>
        <div className="bg-cream-100 rounded-card p-6">
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">
            Amenities
          </h3>
          <ul className="text-charcoal-500 space-y-1">
            <li>Free WiFi</li>
            <li>Projector &amp; screen</li>
            <li>Sound system</li>
            <li>Microphone</li>
          </ul>
        </div>
        <div className="bg-cream-100 rounded-card p-6">
          <h3 className="font-serif text-xl text-charcoal-700 mb-2">
            Availability
          </h3>
          <p className="text-charcoal-500">
            Daytime slots (11am–4pm) and weekends are ideal for events.
            Evenings available by arrangement.
          </p>
        </div>
      </div>

      <div className="text-center bg-sage-50 rounded-card p-12">
        <h2 className="font-serif text-3xl text-charcoal-700 mb-4">
          See yourself here?
        </h2>
        <p className="text-charcoal-500 mb-6">
          The only cost of hosting is eating and drinking in the space.
        </p>
        <Link
          href="/host"
          className="inline-block px-8 py-3 bg-teal-500 text-cream-100 rounded-button font-semibold hover:bg-teal-600 transition-colors"
        >
          Host Your Event
        </Link>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

Run `npm run dev` and visit `/space`.

**Step 3: Commit**

```bash
git add src/app/space/
git commit -m "feat: build The Space page with capacity and amenities"
```

---

### Task 19: Build the Menu page

**Files:**
- Create: `src/app/menu/page.tsx`

**Step 1: Create the Menu page**

File: `src/app/menu/page.tsx`

```tsx
import { sanityFetch } from '@/sanity/lib/fetch'
import { MENU_ITEMS_QUERY } from '@/sanity/lib/queries'

export const metadata = {
  title: 'Menu — Caravan of Dreams',
  description: 'Organic vegan cuisine at Caravan of Dreams. Your meal is your ticket to dream.',
}

interface MenuItem {
  _id: string
  name: string
  description: string
  price: number
  category: string
  dietaryTags?: string[]
}

const categoryOrder = ['mains', 'small-plates', 'drinks', 'desserts']
const categoryNames: Record<string, string> = {
  mains: 'Mains',
  'small-plates': 'Small Plates',
  drinks: 'Drinks',
  desserts: 'Desserts',
}

export default async function MenuPage() {
  const items = await sanityFetch<MenuItem[]>({
    query: MENU_ITEMS_QUERY,
    tags: ['menuItem'],
  })

  const grouped = categoryOrder.reduce(
    (acc, cat) => {
      acc[cat] = items.filter((item) => item.category === cat)
      return acc
    },
    {} as Record<string, MenuItem[]>
  )

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-4">
        Menu
      </h1>
      <p className="text-charcoal-500 text-lg mb-12">
        Organic. Vegan. Mediterranean-inspired.
        <br />
        <span className="font-serif italic text-terracotta-500">
          Your meal is your ticket to dream.
        </span>
      </p>

      {items.length > 0 ? (
        <div className="space-y-12">
          {categoryOrder.map((cat) => {
            const catItems = grouped[cat]
            if (!catItems || catItems.length === 0) return null
            return (
              <section key={cat}>
                <h2 className="font-serif text-2xl text-charcoal-700 border-b border-charcoal-200 pb-2 mb-6">
                  {categoryNames[cat]}
                </h2>
                <div className="space-y-6">
                  {catItems.map((item) => (
                    <div key={item._id} className="flex justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-charcoal-700">
                          {item.name}
                        </h3>
                        {item.description && (
                          <p className="text-sm text-charcoal-400 mt-1">
                            {item.description}
                          </p>
                        )}
                        {item.dietaryTags && item.dietaryTags.length > 0 && (
                          <div className="flex gap-2 mt-2">
                            {item.dietaryTags.map((tag) => (
                              <span
                                key={tag}
                                className="text-xs text-sage-600 bg-sage-50 px-2 py-0.5 rounded-pill"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-charcoal-500 font-medium whitespace-nowrap">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )
          })}
        </div>
      ) : (
        <p className="text-charcoal-400 text-center py-12">
          Menu coming soon. In the meantime, trust us — it&apos;s delicious.
        </p>
      )}
    </div>
  )
}
```

**Step 2: Verify**

Run `npm run dev` and visit `/menu`. Should show the "Menu coming soon" fallback until items are added in Sanity.

**Step 3: Commit**

```bash
git add src/app/menu/
git commit -m "feat: build menu page with category grouping and dietary tags"
```

---

### Task 20: Build the About page

**Files:**
- Create: `src/app/about/page.tsx`

**Step 1: Create the About page**

File: `src/app/about/page.tsx`

```tsx
export const metadata = {
  title: 'About — Caravan of Dreams',
  description: 'The story of Caravan of Dreams — from a 1991 East Village vision to a gathering space for dreamers.',
}

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-serif text-4xl md:text-5xl text-charcoal-700 mb-8">
        The Story
      </h1>

      <div className="space-y-8 text-charcoal-600 leading-relaxed text-lg">
        <p>
          In October 1991, Angel Moreno — a Spanish expatriate, nutrition
          scholar, and musician — opened the doors of a small restaurant at
          405 E 6th Street. He called it{' '}
          <span className="font-serif italic text-terracotta-500">
            Caravan of Dreams
          </span>
          .
        </p>

        <p>
          It was the first organic vegan restaurant in the East Village — a
          neighborhood that had already given the world the Beat poets, punk
          rock, and the Nuyorican literary movement. Moreno wasn&apos;t just
          opening a restaurant. He was building a space where health, music,
          art, and community could sit at the same table.
        </p>

        <div className="aspect-[16/9] bg-charcoal-200 rounded-card my-8" />

        <p>
          Within its first year, Caravan went fully plant-based. The kitchen
          served Mediterranean-inspired dishes made from organic ingredients.
          The dining room hosted live music almost every night. The walls
          displayed local art. Health seminars and yoga classes filled the
          quieter hours.
        </p>

        <p>
          For over three decades, Caravan of Dreams has been a steady presence
          in a neighborhood defined by change. While the East Village
          transformed around it, this corner kept doing what it always did —
          nourishing bodies and ideas in equal measure.
        </p>

        <div className="bg-sage-50 rounded-card p-8 my-8">
          <h2 className="font-serif text-2xl text-charcoal-700 mb-4">
            The East Village tradition
          </h2>
          <p>
            The East Village has always been where New York&apos;s next ideas
            germinate. From Allen Ginsberg&apos;s poetry to CBGB&apos;s stage
            to the community gardens that turned abandoned lots into gathering
            spaces — this neighborhood believes in the radical act of making
            something together.
          </p>
          <p className="mt-4">
            Caravan of Dreams carries that tradition forward. A place where a
            better world isn&apos;t just imagined — it&apos;s being built,
            one gathering at a time.
          </p>
        </div>

        <h2 className="font-serif text-2xl text-charcoal-700">
          A new chapter
        </h2>
        <p>
          Today, Caravan of Dreams is more than a restaurant. It&apos;s a
          free space for gathering, building, and dreaming. We invite thought
          leaders, changemakers, hackers, artists, and anyone with a vision
          worth sharing to use this space — for the simple cost of eating and
          drinking here.
        </p>
        <p>
          Because we believe that the most important conversations happen
          over shared meals. And that another world isn&apos;t just possible
          — it&apos;s already being built, right here on 6th Street.
        </p>
      </div>
    </div>
  )
}
```

**Step 2: Verify**

Run `npm run dev` and visit `/about`.

**Step 3: Commit**

```bash
git add src/app/about/
git commit -m "feat: build about page with founding story and East Village history"
```

---

## Phase 6: Final Polish

### Task 21: Add Sanity portable text styles for rich content

**Files:**
- Create: `src/components/PortableTextComponents.tsx`
- Modify: `src/app/events/[slug]/page.tsx`

**Step 1: Create shared portable text component config**

File: `src/components/PortableTextComponents.tsx`

```tsx
import type { PortableTextComponents } from 'next-sanity'

export const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="font-serif text-2xl text-charcoal-700 mt-8 mb-4">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="font-serif text-xl text-charcoal-700 mt-6 mb-3">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="text-charcoal-600 leading-relaxed mb-4">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-terracotta-300 pl-4 italic text-charcoal-500 my-6">
        {children}
      </blockquote>
    ),
  },
  marks: {
    link: ({ children, value }) => (
      <a
        href={value?.href}
        className="text-teal-600 underline hover:text-teal-700 transition-colors"
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    ),
    strong: ({ children }) => (
      <strong className="font-semibold text-charcoal-700">{children}</strong>
    ),
  },
}
```

**Step 2: Update event detail page to use the components**

In `src/app/events/[slug]/page.tsx`, import and pass `portableTextComponents`:

```tsx
import { portableTextComponents } from '@/components/PortableTextComponents'

// In the render, change:
<PortableText value={event.description} />
// to:
<PortableText value={event.description} components={portableTextComponents} />
```

**Step 3: Commit**

```bash
git add src/components/PortableTextComponents.tsx src/app/events/
git commit -m "feat: add styled portable text components for Sanity rich content"
```

---

### Task 22: Build and verify

**Step 1: Run the production build**

```bash
npm run build
```

Fix any TypeScript or build errors that arise. Common issues:
- Missing type imports
- Unused variables
- Server/client component boundary issues

**Step 2: Run the production server**

```bash
npm start
```

Visit all pages and verify:
- `/` — hero, manifesto, upcoming events, host CTA, space teaser, footer
- `/events` — list/calendar toggle, category filter, empty state
- `/host` — full form renders, fields validate
- `/space` — capacity, amenities, CTA
- `/menu` — empty state message
- `/about` — full narrative
- `/admin` — Sanity Studio loads (with valid credentials)
- Mobile responsiveness on all pages

**Step 3: Commit any fixes**

```bash
git add -A
git commit -m "fix: resolve build errors and type issues"
```

---

### Task 23: Seed sample event data in Sanity (optional)

This task requires valid Sanity credentials. If you have them configured:

**Step 1: Create a seed script**

File: `scripts/seed.ts`

```ts
import { createClient } from '@sanity/client'

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2024-07-11',
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
})

const events = [
  {
    _type: 'event',
    title: 'The Future of Food Systems',
    slug: { _type: 'slug', current: 'future-of-food-systems' },
    description: [
      {
        _type: 'block',
        _key: 'a1',
        children: [
          {
            _type: 'span',
            _key: 'a1s',
            text: 'A conversation about regenerative agriculture, local food networks, and how cities can feed themselves sustainably.',
          },
        ],
      },
    ],
    date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    hostName: 'Maria Chen',
    hostBio: 'Urban agriculture researcher and food systems advocate.',
    category: 'talk',
    status: 'approved',
    expectedSize: 25,
  },
  {
    _type: 'event',
    title: 'Climate Data Hackathon',
    slug: { _type: 'slug', current: 'climate-data-hackathon' },
    description: [
      {
        _type: 'block',
        _key: 'b1',
        children: [
          {
            _type: 'span',
            _key: 'b1s',
            text: 'Build tools and visualizations with open climate datasets. All skill levels welcome. Bring a laptop and curiosity.',
          },
        ],
      },
    ],
    date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    hostName: 'Open Climate Collective',
    hostBio: 'A collective of developers, scientists, and designers working on climate solutions.',
    category: 'hackathon',
    status: 'approved',
    expectedSize: 30,
  },
  {
    _type: 'event',
    title: 'Fermentation Workshop',
    slug: { _type: 'slug', current: 'fermentation-workshop' },
    description: [
      {
        _type: 'block',
        _key: 'c1',
        children: [
          {
            _type: 'span',
            _key: 'c1s',
            text: 'Learn the art and science of fermentation. Make your own kimchi, kombucha, and tempeh. All materials provided.',
          },
        ],
      },
    ],
    date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString(),
    hostName: 'Angel Moreno',
    hostBio: 'Founder of Caravan of Dreams and lifelong nutrition advocate.',
    category: 'workshop',
    status: 'approved',
    expectedSize: 15,
  },
]

async function seed() {
  for (const event of events) {
    const result = await client.create(event)
    console.log(`Created: ${result._id} — ${event.title}`)
  }
}

seed().catch(console.error)
```

**Step 2: Run the seed script**

```bash
npx tsx scripts/seed.ts
```

**Step 3: Verify events appear on the site**

Visit `/` and `/events` — the seeded events should appear.

**Step 4: Commit**

```bash
git add scripts/
git commit -m "feat: add seed script with sample event data"
```

---

## Summary

**Total tasks:** 23
**Estimated phases:** 6

### What you'll have when done:

1. A fully functional Next.js website with the Caravan of Dreams rebrand
2. Sanity CMS embedded at `/admin` for content management
3. Dynamic events calendar with list/calendar views and category filtering
4. Event submission form that creates pending events in Sanity
5. Menu, Space, and About pages with the brand's poetic voice
6. Responsive design with the eclectic/organic visual identity
7. Tag-based ISR for instant content updates
8. Sample seed data to demonstrate the full experience

### What needs to happen separately (not in this plan):

- Create the Sanity project at sanity.io/manage and get real credentials
- Add CORS origins for localhost and production domain
- Configure the revalidation webhook in Sanity dashboard
- Replace placeholder image rectangles with real photography
- Deploy to Vercel and configure environment variables
- Set up a custom domain
