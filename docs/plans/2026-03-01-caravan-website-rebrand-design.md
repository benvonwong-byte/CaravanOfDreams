# Caravan of Dreams — Website Rebrand Design

## Overview

A complete rebrand of caravanofdreams.net, transforming it from a restaurant website into an events-first cultural portal. The site invites thinkers, doers, and changemakers to host gatherings at this East Village vegan space — where the only cost of dreaming is eating and drinking.

## Brand Positioning

- **Events-first, food enables.** The site leads with the mission, community, and calendar. Food is the beautiful "cost of entry," not the hero.
- **Voice:** Poetic and invitational. Lyrical warmth that draws you in. "Another world is possible. We're building it over dinner."
- **Activist bent:** Positive, hopeful, action-oriented. Not angry — generative. Believes a better world is being built, one gathering at a time.
- **Heritage:** Draws on the East Village's counterculture roots (Beat poets, punk, activism) and Caravan's 35-year history as a community anchor since 1991.

## Tech Stack

- **Frontend:** Next.js (App Router) with React
- **CMS:** Sanity (headless, embedded Studio at `/admin`)
- **Deployment:** Vercel with ISR (Incremental Static Regeneration)
- **Styling:** Tailwind CSS with custom design tokens
- **Forms:** Event submission creates Sanity documents with `status: "pending"`

## Visual Identity

### Color Palette

| Role      | Color            | Hex       | Rationale                        |
|-----------|------------------|-----------|----------------------------------|
| Primary   | Deep terracotta  | `#C45D3E` | Warmth, earth, East Village brick |
| Secondary | Sage green       | `#7A8B6F` | Organic, growth, vegan roots      |
| Accent    | Mustard gold     | `#D4A843` | Energy, optimism, "the dream"     |
| Dark      | Charcoal brown   | `#2C2420` | Grounding, readable text          |
| Light     | Warm cream       | `#F5F0E8` | Aged paper, organic feel          |
| Pop       | Deep teal        | `#2A6B6B` | Depth, counterculture edge        |

### Typography

- **Headlines:** Bold, slightly irregular serif (Recoleta or Fraunces) — handmade, warm, literary
- **Body:** Clean sans-serif (Inter or DM Sans) — modern contrast
- **Accents/Quotes:** Hand-drawn or script font for pull quotes and manifesto-style hero text (used sparingly)

### Visual Elements

- Hand-drawn illustration accents: vine-like borders, sketched icons for event categories
- Layered paper textures as subtle backgrounds (journal/zine feel, not flat white)
- Warm, candid photography: people in conversation, food mid-preparation, the space at golden hour
- Organic, asymmetric layouts: content doesn't always sit in perfect grids, some sections overlap, some breathe

### Overall Feel

Walking into an independent bookstore that hosts poetry readings and serves incredible food. The walls have art. The shelves have manifestos. Someone's tuning a guitar in the corner. You want to stay.

## Site Architecture

```
caravanofdreams.net/
├── /                    ← Home (hero + mission + upcoming events + CTA to host)
├── /events              ← Calendar view + list view toggle, filterable by category
├── /events/[slug]       ← Individual event detail page
├── /host                ← "Host an Event" submission form
├── /space               ← Physical space details (photos, capacity, amenities)
├── /menu                ← Food & drink menu
├── /about               ← The story (Angel Moreno, 1991, East Village roots)
└── /admin               ← Sanity Studio (protected, staff only)
```

## Sanity Content Schema

### Event

| Field          | Type           | Notes                                                  |
|----------------|----------------|--------------------------------------------------------|
| title          | string         | Required                                               |
| slug           | slug           | Auto-generated from title                              |
| description    | block content  | Rich text with images                                  |
| date           | datetime       | Event start date/time                                  |
| endDate        | datetime       | Optional end time                                      |
| hostName       | string         | Who's hosting                                          |
| hostBio        | text           | Short bio of the host                                  |
| hostEmail      | string         | Not displayed publicly                                 |
| category       | string         | Enum: talk, hackathon, gathering, workshop, performance, screening |
| expectedSize   | number         | Expected attendance                                    |
| status         | string         | Enum: pending, approved, past, cancelled               |
| featuredImage  | image          | Hero image for the event                               |
| notes          | text           | Internal notes (not public)                            |

### MenuItem

| Field       | Type          | Notes                                      |
|-------------|---------------|--------------------------------------------|
| name        | string        | Dish/drink name                            |
| description | text          | What it is                                 |
| price       | number        | In USD                                     |
| category    | string        | Enum: mains, small plates, drinks, desserts |
| dietaryTags | array[string] | e.g., raw, gluten-free, nut-free           |
| image       | image         | Optional food photo                        |

### Page (About, Space)

| Field   | Type          | Notes                         |
|---------|---------------|-------------------------------|
| title   | string        | Page title                    |
| slug    | slug          | URL path                      |
| content | block content | Flexible rich text with images |

### SiteSettings (singleton)

| Field        | Type          | Notes                        |
|--------------|---------------|------------------------------|
| tagline      | string        | Hero text                    |
| mission      | block content | Mission statement            |
| address      | string        | Physical address             |
| hours        | text          | Operating hours              |
| socialLinks  | array[object] | Platform + URL pairs         |
| contactEmail | string        | General contact              |

## Page Designs

### Home Page (`/`)

1. **Hero section** — full viewport. Layered texture background with warm photography of the space. Large poetic headline ("Another world is possible. We're building it over dinner."). Two CTAs: "Explore Events" and "Host a Gathering."

2. **Manifesto section** — 2-3 sentences of poetic copy about the mission. "Since 1991, this corner of the East Village has been a space for dreamers..."

3. **Upcoming Events** — horizontal scroll or grid of 4 next events. Each card shows date, title, category, and host. Link to full events page.

4. **Host at Caravan CTA** — "Got an idea? A movement? A conversation that needs a room?" Photo of the space during an event. Link to submission form.

5. **The Space teaser** — large atmospheric photo. "405 E 6th St — where the East Village still dreams." Link to space page.

6. **Footer** — address, hours, social links. Tagline: "Eat. Dream. Build."

### Events Page (`/events`)

- Header: "What's happening at Caravan"
- Toggle between calendar view (month, with dots on event days) and list view (chronological)
- Category filter dropdown (All, Talks, Hackathons, Gatherings, Workshops, Performances, Screenings)
- Click a day in calendar view to show that day's events below
- List view shows date, title, host, time in a clean scannable format
- Past events accessible but visually dimmed
- Persistent CTA: "Want to host? Submit your event"

### Event Detail Page (`/events/[slug]`)

- Hero image
- Title, date/time, host name + bio
- Full rich text description
- Category tag
- Back to events link

### Host Page (`/host`)

- Poetic intro about what hosting means — the only cost is eating/drinking
- "What we're looking for" section with category icons
- Submission form: name, email, event title, description (rich text), category (dropdown), preferred dates, expected attendance, additional notes
- Submit creates a Sanity document with `status: "pending"`
- Confirmation message: "We review submissions within 48 hours. Bring the ideas, we'll bring the food."

### The Space (`/space`)

- Full-bleed photography of the interior
- Capacity info, amenities (WiFi, projector, sound system)
- Layout options and availability hours
- CTA to host an event

### Menu (`/menu`)

- Organized by category (mains, small plates, drinks, desserts)
- Warm food photography
- Callout: "Your meal is your ticket to dream"
- Dietary tags visible on each item

### About (`/about`)

- The Angel Moreno story, 1991 founding
- East Village history and counterculture roots
- The mission evolution — from restaurant to cultural space
- Archival and current photography
- Poetic, narrative tone

## Event Submission Flow

1. Visitor fills out form at `/host`
2. Form submission creates a Sanity `Event` document with `status: "pending"`
3. Caravan staff receives email notification (via Sanity webhook or form handler)
4. Staff reviews in Sanity Studio at `/admin`, changes status to `approved` or declines
5. Approved events appear on the public calendar immediately (ISR revalidation)
6. Optional: confirmation email sent to the host

## Responsive Design

- Mobile-first approach
- Navigation collapses to hamburger menu on mobile
- Calendar view switches to a simplified list on small screens
- Event cards stack vertically on mobile
- Full-bleed images scale appropriately
- Form fields stack vertically with generous touch targets

## Key Technical Decisions

- **App Router** over Pages Router for better layouts, server components, and streaming
- **Sanity embedded Studio** at `/admin` for a single-deployment experience
- **ISR with on-demand revalidation** so approved events appear quickly without full rebuilds
- **Tailwind CSS** for rapid styling with design tokens matching the brand palette
- **Server components by default**, client components only for interactive elements (calendar navigation, form, view toggle)
