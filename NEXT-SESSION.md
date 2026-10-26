# Next session: Caravan of Dreams print + Dream Room

Handoff from the Claude session that ran Sept 14 to Oct 26, 2026. Branch: `print-and-dreamroom-2026-10`. Nothing here is merged to `main`.

## What is in this branch

| Path | What it is | Rebuild |
|---|---|---|
| `flyer/lib.mjs`, `flyer/build.mjs`, `flyer/social.mjs`, `flyer/events.json`, `flyer/prices.json` | Climate Week flyers and social tiles (tarot style: lapis sky, gold double frame, Lora + Inter) | `node flyer/build.mjs [WxH] [front names|back] [--public]` |
| `flyer/scenarios/` | Four "June 2036" scenario worksheets for the Imaginarium dinner, US Letter, black and white | `node flyer/scenarios/build.mjs` |
| `flyer/ratecard/build.mjs` + `out/`, `out-bw/` | Dream Room price flyer, 8.5x11 (color, black and white, bleed) | `node flyer/ratecard/build.mjs [--bw]` |
| `flyer/ratecard/poster.mjs` + `out-poster/`, `out-poster-bw/` | Same prices as a 16:9 poster (1080p, 4K, 20 x 11.25 in PDF) | `node flyer/ratecard/poster.mjs [--bw]` |
| `speaker-slides/` | Climate Week speaker slides plus the Dear Crisis join slide (4K) | `python3 speaker-slides/build_speaker_slides.py` |

The flyer scripts read fonts and the `qrcode` package from a sibling checkout of the Dear Crisis repo (`../DearCrisis`), and render with Google Chrome headless. PDFs print from a copy without text glow, because macOS Preview draws Chrome's text-shadow as boxes.

Rebuild all four Dream Room print files after any price change:

```bash
for a in "" "--bw"; do node flyer/ratecard/build.mjs $a; node flyer/ratecard/poster.mjs $a; done
```

## Dream Room prices (source of truth: the website)

The booking page is dearcrisis.com/dreamroom, in the private Dear Crisis repo (`functions/dreamRoom.js`, `src/components/dreamroom/`). It is live and deployed; last change PR #114 (Oct 26). Change prices there first, then mirror them in `flyer/ratecard/*.mjs`.

- Public events, 3 hours in the room (2-hour event plus setup): Free with 15+ guests and a $600 food minimum; $100 plus 30% of tickets; $300 flat.
- Private hire: $400 for 3 hours, any day. Mission-aligned organizations can apply for a lower rate on the site.
- Each hour past three costs $10 less than the one before: public extras $75, $65, $55...; private extras $100, $90, $80...
- Food: finger foods (quote), prix fixe $45 per person all in, tea and water free.
- Pay by Venmo @caravanofdreams, Zelle reservations@caravanofdreams.net, or cash. Cards add 3%. Never mention tax anywhere (Ben's rule, Sept 30).
- Copy style: plain, short sentences (Ben, Oct 26).

## Not in this branch, on purpose

This repo is public. These stay on Ben's machine only: the event tracker spreadsheet (host phones), the poll deck and mingle slide (guest names and answers), the Luma blast drafts and door lists, `luma covers/`, local `.claude/` settings, and the regenerable image exports (`flyer/out*`, `flyer/social*`, scenario PNGs). Booking-admin sign-in details live only in the private Dear Crisis repo.

## Open items for Ben

- Merge this branch to `main`, or keep it as a branch.
- The booking admin accepts two spellings of one password; confirm which is real so the other can be removed (details in the private repo, `checkAdminLogin`).
