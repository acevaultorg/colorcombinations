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

## 2026-04-11 — Monetization V1.1: reality check + reordered rails

**Decision:** Reframe the monetization stack after honest math on what this
audience actually pays for. Replace the "$12 product" positioning with
reality-based rails in priority order: affiliate (books + tools) → prints
waitlist → tip-jar bundle → Carbon Ads (traffic-gated, V1.5 only).

**Rationale — the honest math:**

| Traffic | AdSense | Carbon | Mediavine | Current $12 bundle (0.2% conv) | Affiliate (1% × $1 EPC) |
|---|---|---|---|---|---|
| 5k pv/mo | ~$10 | n/a | n/a | ~$12 | ~$5 |
| 20k pv/mo | ~$40 | ~$50-150 | n/a | ~$48 | ~$20 |
| 50k pv/mo | ~$100 | ~$150-300 | ~$1000-2000 | ~$120 | ~$50 |
| 250k pv/mo | ~$500 | ~$500-800 | ~$5000-12000 | ~$600 | ~$250 |

Below 20k pv/mo NO rail makes real money. The first 90 days are traffic
investment, not monetization tuning. Real compounding begins at 50k+.

Ad network note: Mediavine/Raptive make the most money at scale but destroy
the museum identity (4-8 slots, video autoplay, sticky banners). Carbon Ads
is the only network compatible with the brand — one tasteful slot, designer
audience, no tracking, no video. Used by Smashing, CodePen, JetBrains docs.
~20k monthly visits required for approval. Do not apply until qualified —
premature applications get rejected and are hard to re-appeal.

**The bundle problem:** Pretending a $12 bundle is a product when the same
data is free on the site AND free on GitHub under MIT is not credible. The
"$29 regular" anchor is not believable. Conversion math: 0.05-0.2% of visitors
at best. Even at 5k pv/mo that's ~$50-60/mo gross.

**The fix:** reposition as a PWYW tip jar with the bundle attached as a
thank-you deliverable. $3 minimum, $5 suggested. Copy shifts from "Get the
bundle" to "Support the archive." Subtext explicitly says "the archive
itself stays free, always." Stops overselling the free data on the site.

**What actually works for this audience:**

1. **Affiliate with book covers** — biggest single CTR lift available
   (research: cover images convert 3-5× over text-only). Extend from /about
   only to /about + /shop + 378 palette detail pages with deterministic
   rotation. 378 pages × unique-book-per-page = maximum impression spread.
2. **Higher-commission affiliate inventory** — books cap at ~$1 commission.
   Design tools (Framer $25 recurring, Figma plugins, courses) pay $5-$80.
   New `DesignTools` component on /shop with Framer affiliate slot.
3. **Prints via waitlist first** — validates demand before POD setup.
   Society6/Printful activation gated on "someone actually joined waitlist."
4. **Tip jar bundle** — honest framing converts better than fake product.
5. **Carbon Ads (V1.5 only)** — defer until 20k pv/mo. Config stubbed.

**Browse page UX — color-count filter:**
Added 2/3/4 colors pill filter to the browse page because that's exactly
how Wada's original book organizes plates (2-color, 3-color, 4-color
groupings). Counts: 120 × 2-color, 120 × 3-color, 108 × 4-color +
30 curated = 378. Pill buttons above the existing dropdowns. Pure DOM
filter — zero build cost, zero JS framework.

**Implementation notes:**
- Open Library covers API for book images — free CDN, graceful fallback.
- `?default=false` param forces 404 on miss instead of 1x1 placeholder,
  so `onerror` handler actually fires.
- Direct `olCoverId` preferred over ISBN when ISBN lookups fail
  (Chromaphilia's ISBN 0714873934 isn't indexed; using cover id 12410845).
- Deterministic book rotation via slug hash → `offset` param on palette
  pages. No random, stable per-URL (important for caching + analytics).

---

## 2026-04-10 — Monetization V1: digital bundle + affiliate books + Plausible

**Decision:** Revenue rails are a layered stack, no display ads.

1. **Primary** — digital product: "The Complete Wada Bundle" sold on Gumroad at $12 (regular $29 anchor). One-time purchase, no account creation, no recurring billing complexity. Contains Figma tokens, Tailwind v4/v3, CSS vars, SVG plates, full JSON — all 378 palettes (curated + Wada) in one 50K zip.
2. **Secondary** — Bookshop.org affiliate (10% commission) + Amazon Associates (4% fallback). Five curated books (Wada reprint, Albers, St. Clair, Finlay, Paul) on /about and /shop with FTC disclosure.
3. **Tertiary** — Print-on-demand rail stubbed on /shop behind a "join waitlist" CTA. Activated post-first-sale to validate demand before committing to Printful setup.
4. **Measurement** — Plausible analytics (9/mo, privacy-first, no cookies). Tagged-events script loads only when configured. Events: `bundle_cta_click`, `bookshop_click`, `amazon_click`, `export_click`, `newsletter_signup`, `prints_cta_click`.

**Rationale:**
- **No ads.** IDENTITY.md forbids display ads (museum identity). Per-visitor value of a $12 digital product at 1% conversion is ~24× AdSense RPM at the same traffic, without compromising brand.
- **Digital over subscription.** V1 doesn't need Stripe complexity. Gumroad ships a product in minutes; Stripe Checkout is a V1.1 decision once volume justifies the 3% processor overhead.
- **Bookshop before Amazon.** Aligns with museum/editorial voice. Amazon only as fallback where Bookshop doesn't carry a title.
- **Prints deferred.** Validates demand before committing to POD integration. A stub waitlist converts intent to list subscribers.
- **Plausible over Umami/GA.** GDPR-compliant by default, no banner required, privacy-first matches the brand's "free forever" ethos. Umami self-hosting is free but adds ops cost.

Revenue-first filter PASS: every task passed "generates or captures revenue within 30 days" or "unblocks revenue work."

Handoff: all URLs/IDs live behind `isLive` getters in `src/config/monetization.ts`. Operator pastes real values, redeploys, and revenue is live.

---

## 2026-04-10 — Full Wada 348 catalog import (strategic reversal)

**Decision:** Import ALL 348 combinations from Sanzo Wada's 1933 Dictionary of Color Combinations. Supersedes the 2026-04-08 "V1 ships 30 inspired-by, full Wada 348 deferred to V2" decision.

**Rationale (operator-directed, strategic):**
- Brand promise: the site is called "The Dictionary of Color Combinations." 30 palettes is a sample, not a dictionary. Completeness is the identity.
- Bundle economics: same $12 price, 12× more palettes — conversion math changes from "why would I pay for 30" to "this is the reference."
- SEO footprint: 348 new indexable URLs targeting long-tail queries ("sanzo wada plate 47", "english red cerulian blue", etc.) that nothing else on the web fully serves.
- Legal: individual hex values and color names are public-domain facts (Feist v Rural). Traditional Japanese color names are cultural commons. Wada's specific combinations as numbered plates are the gray area, but the community reconstruction approach (sanzo-wada.dmbk.io, mattdesl/dictionary-of-colour-combinations, jmaasch/sanzo R package) has been running unchallenged for years. We link to the source dataset on the about page and explicitly frame the archive as a reference to — not a substitute for — the Seigensha republication.

**Source data:** `mattdesl/dictionary-of-colour-combinations` (MIT) — 159 unique colors, 348 combinations, perceptual CMYK→RGB via SWOP v2.icc.

**Implementation:**
- `scripts/wada-source/colors.json` committed (60K, 159 color entries with combinations arrays)
- `scripts/generate-wada-palettes.mjs` auto-derives Palette schema from combination groups — dominantHue from HSL, moods from lightness+hue, tags per plate number. Deterministic, regeneratable.
- `src/data/wada-palettes.ts` — 348 generated Palette objects, slug `wada-NNN-firstname-secondname`.
- `src/data/palettes.ts` split into `curatedPalettes` (30 editorial) + imports `wadaPalettes` (348). Total 378.
- Hero copy leads with "All 348 historical color combinations." Featured section reframed as "Editorial picks."
- Bundle renamed "The Complete Wada Bundle," tagline updated, price upgraded $9 → $12.

**Risks accepted:** Seigensha theoretical takedown request. Mitigation: content is clearly framed as reference-not-substitute, source dataset linked, Seigensha edition recommended for purchase on about page. If a takedown arrives, we respond by removing plates on demand, not preemptively.

**Next:** re-enrich Wada plates with cross-referenced Japanese shikisai names over time (V1.1+). Currently they use Wada's English trade names; the 30 curated set keeps the kanji overlays.

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
