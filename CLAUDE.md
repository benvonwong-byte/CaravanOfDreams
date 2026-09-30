# Caravan of Dreams

Site for a vegan restaurant and free community event space in NYC's East Village. Next.js 16 App Router, React 19, TypeScript, Tailwind v4 (CSS-first), Sanity v5.

## Commands

- `npm run lint && npm run typecheck`: after every change; keep both clean. There is no test suite.
- `npm run build`: slow. Only for routing, config, server-action or Sanity changes, and before a PR.

## Map

- `src/app/`: App Router routes. `admin` is Sanity Studio, `api/revalidate` the Sanity webhook, `actions/submitEvent.ts` the server action that writes to Sanity. `(collab)/brooklyn-bugs` has its own dark layout with no global header or footer.
- `src/components/`: shared UI; page-specific components in `home/`, `events/`, `host/`.
- `src/lib/events.ts`: `EVENT_CATEGORIES`, `EventSummary`/`EventDetail`, `categoryLabel`, `formatEventTime`.
- `src/lib/demo-events.ts`: events shown when Sanity returns none (server-only).
- `src/sanity/`: `lib/fetch.ts` (`sanityFetch`), `lib/queries.ts` (GROQ), `schemaTypes/`.
- `src/app/globals.css`: all design tokens.
- `docs/plans/2026-03-01-caravan-website-rebrand-design.md`: brand voice, palette, page intent. Read it before design or copy work.

## Rules

- Event categories and types: define only in `src/lib/events.ts`. Schema, filter, form and badges derive from it.
- Demo events: only in `src/lib/demo-events.ts`.
- Read Sanity through `sanityFetch` with `tags: ['<_type>']` (drives the revalidate webhook); `fallback: null` for single documents. Without env vars the site runs in demo mode. That is expected locally, not a bug.
- Server components by default; `'use client'` only for interactivity.
- Tailwind utilities with brand tokens only: colors `terracotta|sage|mustard|charcoal|cream|teal`, `rounded-card|button|pill`, `shadow-soft|card|elevated`, `font-serif` for headings, `font-sans` for body. No hex colors, no new CSS files.

## Efficiency

- `package-lock.json` and the implementation plan in `docs/plans/` are hidden from search via `.ignore`. Don't open them.
- `src/app/(collab)/brooklyn-bugs/page.tsx` is ~550 lines. Grep its section-banner comments and read only that range.
- Copy, style or single-component changes: edit directly, then lint and typecheck. Write plans only for multi-page features, as steps and file paths, never full code.
