# DECISIONS — ColorCombinations

Append-only. Never edited. Each entry: date | decision | rationale.

---

## 2026-04-08 — Strategic positioning: Sanzo Wada angle

**Decision:** Build as "The Dictionary of Color Combinations" with the Sanzo Wada 1933 historical angle, NOT as a generic palette generator.

**Rationale:** Market analysis shows generic palette tools (Coolors, Color Hunt, Adobe Color, Paletton, Khroma) dominate the generator category. A generic entrant has no moat, no SEO story, no brand wedge. The Wada angle provides: (a) unique ownable position, (b) built-in SEO via per-palette pages, (c) story hook for sharing, (d) print/merch revenue stream, (e) content moat through historical curation.

Source: god-mode directive expansion, 2026-04-08.

---

## 2026-04-08 — Tech stack: Astro + Tailwind + TypeScript + MDX

**Decision:** Astro 5 (static-first), Tailwind CSS v4, TypeScript strict, MDX for content, Vercel for hosting.

**Rationale:**
- **Astro** — purpose-built for content sites. Zero JS by default. Per-palette pages build to pure HTML at build time (maximum SEO, maximum speed). Content collections handle blog/palette data natively.
- **Tailwind** — rapid styling, no CSS bloat, design-system-friendly.
- **TypeScript strict** — catches errors early, palette data schema is type-safe.
- **MDX** — mix Markdown + components for blog articles (SEO content layer).
- **Vercel** — free tier, instant deploys, best-in-class SSG support, automatic preview URLs.

Alternatives considered: Next.js (too much JS runtime overhead for a content site), plain HTML (insufficient for 348+ generated pages + blog), SvelteKit (smaller ecosystem for content).

---

## 2026-04-08 — Data strategy: inspired-by, not direct-copy

**Decision:** V1 ships with ~30-40 historically-grounded Japanese color combinations presented as "inspired by Sanzo Wada's tradition". Full 348-palette import deferred to V2 with proper source verification.

**Rationale:**
- **Legal:** Color values (hex tuples) are facts and not copyrightable. Traditional Japanese color names (紅, 藍, 萌黄, etc.) have been in the cultural commons for centuries. However, Wada's specific 1933 book and Seigensha's 2010 republication have copyrightable layout, presentation, and editorial decisions. By building on the underlying tradition rather than reproducing the book, we stay safely on fact-based/tradition-based ground.
- **Practical:** V1 can launch faster with a curated 30-40 representative palettes. V2 can add the full dictionary once accurate Wada data is sourced (the existing sanzo-wada.dmbk.io tribute can be a reference).
- **Positioning:** "Inspired by the tradition of Sanzo Wada" is honest, defensible, and still SEO-valuable.

V2 task: source and import the full Wada 348 dataset with proper attribution.

---

## 2026-04-08 — Revenue model: stacked streams, primary KPI = RPU

**Decision:** Three revenue streams from day one:
1. **Print/merch** — print-on-demand affiliate (Printful/Gelato) for palette posters — immediate revenue, no inventory
2. **Pro tier** — Stripe subscription for export formats, brand kits, unlimited saves
3. **Affiliate** — design tool recommendations (Figma, Adobe, Sketch), design books, color theory books

**Primary KPI:** Revenue Per Unique Visitor (RPU). Secondary: conversion rate from browse → export → email signup.

**Rationale:** Aligns with prime directive (maximize revenue) and matches market. Coolors and Color Hunt both run Pro tiers + affiliate. Print/merch is underserved in this niche and leverages the heritage angle uniquely.

---

## 2026-04-08 — Ship scope: V1 is launch-ready foundation

**V1 (this session) includes:**
- Astro project initialized, Tailwind configured, TypeScript strict
- ~30-40 seed palettes with schema
- Homepage, browse page, per-palette detail page, about page
- Basic export (copy hex, Tailwind config, CSS vars, JSON)
- Email capture placeholder (ready for ConvertKit/MailerLite)
- SEO infrastructure (sitemap, robots.txt, JSON-LD, OG meta)
- Brand system and responsive layout
- Build passes, ready to deploy

**V1 does NOT include (deferred):**
- Full 348 Wada palette import
- Live Stripe integration (checkout link stub only)
- Live print-on-demand API (affiliate link placeholder)
- Blog content (scaffold only, articles come in V2)
- Custom OG image generation
- User accounts / saved palettes

**Rationale:** The Algorithm — simplest change that satisfies the need. V1 must be deployable, indexable, and look credible enough for launch. Everything else can iterate post-launch based on real traffic data.
