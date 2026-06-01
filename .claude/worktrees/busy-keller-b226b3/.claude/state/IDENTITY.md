# IDENTITY — ColorCombinations

## Project

**Name:** ColorCombinations (working) — final name TBD
**Working title:** The Dictionary of Color Combinations
**Tagline:** "348 historical color combinations, reborn for modern designers."
**Mission:** Give designers, artists, and developers a beautiful, searchable, exportable archive of historically-significant color combinations — starting with Sanzo Wada's 1933 Japanese color dictionary.
**Created:** 2026-04-08

## Positioning

**What it is:** A curated, historically-grounded color combination reference.
**What it is NOT:** Another random palette generator (that's Coolors / Color Hunt territory).

**The wedge:** Heritage + curation + story. Every palette is documented, dated, and contextualized — not algorithmically generated.

## Brand Voice

- **Tone:** Reverent but not stuffy. Design-historian confidence. Quiet, assured, thoughtful.
- **Not:** Playful, gimmicky, meme-y, tech-bro, "AI-powered".
- **Inspiration:** A museum gift shop crossed with a well-designed textbook. Type-heavy. Print-inspired. Restrained animation.
- **Never writes:** "Unleash creativity", "Discover your perfect palette", "AI-generated", "revolutionary", "game-changing".

## Visual Direction

- **Type:** Serif for headlines (evokes book/editorial), sans for UI and body. Candidates: Fraunces + Inter, or EB Garamond + IBM Plex Sans.
- **Layout:** Generous whitespace. Grid-heavy. Museum-plate feel. Each palette card is a display object, not a widget.
- **Colors:** Neutral-dominant UI (off-white, warm grey, deep ink). The palettes themselves are the stars — UI must never compete.
- **Imagery:** Solid swatches. No gradients, no noise, no AI art. Optional: subtle paper-texture background.
- **Motion:** Minimal. Fade + micro-shifts only. No parallax, no animated emojis, no confetti.

## Source annotations

- `engine-generated` — AcePilot expansion default. Override when the operator weighs in.
- `user-confirmed` — explicit operator decision. Always wins over engine defaults.

All entries above: `engine-generated` (2026-04-08, god-mode expansion). Awaiting operator confirmation on name, type, domain.

## Decisions pending (user-confirmed required)

- [x] Final product name — "The Dictionary of Color Combinations" (user-confirmed via launch, 2026-04-10)
- [x] Domain name — colorcombinations.org (user-confirmed via Cloudflare Registrar purchase, 2026-04-10)
- [x] Exact typography pair — EB Garamond (serif) + Inter (sans) (user-confirmed via shipped V1, 2026-04-10)
- [x] Full Wada data import strategy — IMPORTED ALL 348 from `mattdesl/dictionary-of-colour-combinations` MIT dataset (user-directed, 2026-04-10). Decision details in DECISIONS.md 2026-04-10 "Full Wada 348 catalog import (strategic reversal)".
- [ ] Whether to add Japanese shikisai cross-references to the 348 Wada plates over time (V1.1+)

## Catalog scope (2026-04-10)

- **30 editorial deep-dives** — hand-written, traditional Japanese shikisai names with kanji + romaji + meaning + era + usage notes. These are the "museum plates" — featured on the homepage as "Editorial picks."
- **348 historical Wada plates** — auto-generated from the community-reconstructed dataset, slug `wada-NNN-firstname-secondname`, full SEO surface, basic taxonomy auto-derived.
- **Total: 378 palettes**, all browsable, all exportable, all in the bundle.
