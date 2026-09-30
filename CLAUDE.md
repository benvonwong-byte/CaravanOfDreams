# Caravan of Dreams

Website for Caravan of Dreams, a vegan restaurant and free community event space at 405 E 6th St, NYC.
Next.js 16 App Router · React 19 · TypeScript · Tailwind v4 (CSS-first) · Sanity v5 (Studio embedded at `/admin`).

## Commands

- `npm run lint && npm run typecheck`: fast checks. Run after every change; both must stay clean.
- `npm run build`: slow and verbose. Run only when touching routing, config, server actions or Sanity setup, or before opening a PR.
- There is no test suite.

## Map

- `src/app/`: routes (`/`, `events`, `events/[slug]`, `host`, `space`, `menu`, `about`, `admin`, `api/revalidate`, `(collab)/brooklyn-bugs`)
- `src/components/`: shared UI (`Header`, `Footer`, `EventCard`, …) plus per-page folders `home/`, `events/`, `host/`
- `src/lib/events.ts`: event categories, `EventSummary`/`EventDetail` types, `categoryLabel`, `formatEventTime`
- `src/lib/demo-events.ts`: demo events shown when Sanity has none (server-only)
- `src/sanity/`: `lib/fetch.ts` (`sanityFetch`), `lib/queries.ts` (GROQ), `schemaTypes/`, `sanity.config.ts`
- `src/app/globals.css`: all design tokens (`@theme`)
- `docs/plans/2026-03-01-caravan-website-rebrand-design.md`: brand voice, palette, page intent. Read it for design or copy work.

## Rules

- Event categories live only in `EVENT_CATEGORIES` (`src/lib/events.ts`). The schema, filter pills, host form and badges all derive from it. Never redefine category lists, labels or the event types elsewhere.
- Demo events live only in `src/lib/demo-events.ts`.
- Fetch Sanity data through `sanityFetch` with `tags: ['<_type>']` so the revalidate webhook works. Pass `fallback: null` for single-document queries. With no env vars (see `.env.example`), the site runs in demo mode.
- Server components by default. Use `'use client'` only for interactivity.
- Style with Tailwind utilities and the brand tokens: `terracotta`, `sage`, `mustard`, `charcoal`, `cream`, `teal`; `rounded-card|button|pill`; `shadow-soft|card|elevated`; `font-serif` (Fraunces) for headings, `font-sans` (DM Sans) for body. No raw hex colors, no new CSS files.
- `(collab)` pages use their own dark layout that hides the global header and footer.

## Working efficiently

- `package-lock.json` and the old implementation plan are hidden from search via `.ignore`. Don't open them.
- `src/app/(collab)/brooklyn-bugs/page.tsx` is about 550 lines. Grep for the section banner comment and read only that range.
- Match process to size. Copy, style or single-component changes: edit directly, then lint and typecheck. Save written plans for multi-page features, and keep them to steps and file paths, not full code.
