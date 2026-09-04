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

## 2026-04-11 — Collections: 8 themed landing pages with cross-linked palettes

**Decision:** Add a Collections feature — 8 curated thematic landing pages
grouping palettes by practical use case instead of era/hue/mood. Wire the
collections into every palette detail page via a "Featured in" chip row.

**The 8 collections:**
1. Websites — 24 palettes (capped at limit)
2. Branding — 24
3. Autumn — 24
4. Spring — 7 (narrow filter)
5. Minimalist — 24
6. Indigo — 23
7. Bold — 24
8. Heian — 9 (narrow era filter)

**Why collections (four reasons):**

1. **Commercial-intent SEO landing pages.** Queries like "color palettes
   for websites," "branding color palettes," "autumn color palettes,"
   "minimalist color palettes" have real search volume. The era/hue
   browse filters don't capture any of those queries. Each collection
   page is a high-quality, internally-linked landing page targeting
   exactly the phrases designers actually type.

2. **Internal link graph density.** Each collection links to up to 24
   palettes. Each palette links back to the 1-4 collections it
   appears in. Each collection detail page cross-links to 4 other
   collections at the bottom. The resulting link graph is dense enough
   to help Google understand the site's topical breadth.

3. **Practical browse path.** Real designers think in terms of "I need
   colors for a restaurant website," not "I need Heian-era palettes."
   The era/hue/mood filters on /browse are powerful for exploration
   but require the user to already know the vocabulary. Collections
   meet visitors where their actual project brief lives.

4. **No new dependencies, no new surface area.** Pure Astro static
   generation — `getStaticPaths` + collection data file + two templates.
   Adds 9 pages to the build (1 index + 8 details) and one reverse
   lookup helper on the palette side.

**Resolution strategy — curated + matched:**

Each collection has two sources:
- `curatedSlugs`: hand-picked priority order. These render first and
  carry the editorial judgment of the collection.
- `match(palette)`: predicate that pulls additional matching plates
  from the full 378-palette archive. Dedup'd against curatedSlugs.

This gives each collection editorial credibility (curated slugs set the
tone) AND automatic scale (Wada plates fill out the list). A collection
like "Indigo" gets 23 palettes — 8 hand-picked + 15 Wada matches — that
would take weeks to curate manually but zero maintenance to ship.

**Implementation notes:**
- `src/data/collections.ts` — 8 collection definitions + resolver
  helpers (`paletteSetForCollection`, `collectionsForPalette`,
  `collectionBySlug`, `allCollectionSlugs`).
- `src/pages/collections/index.astro` — grid of cards, each with
  4-palette preview swatches + title + tagline + count.
- `src/pages/collections/[slug].astro` — detail page with breadcrumb,
  accent-square hero, long-form description, full palette grid,
  cross-link section to other collections, BundleCta.
- Palette detail pages gain "Featured in" chip row just before the
  BundleCta — up to 4 chips per palette, deterministic ordering.
- Header nav: "Collections" added between Browse and About.
- Footer: "Collections" added to the Explore column.
- JSON-LD: CollectionPage schema with `hasPart` array of member
  palettes + BreadcrumbList on each detail page.

**Verified live:**
- 10 routes all 200 (/collections/, 8 detail pages, palette pages)
- /collections/websites → 24 listitems
- /collections/indigo → 23 listitems
- /collections/heian → 9 listitems (narrow)
- /collections/spring → 7 listitems (narrow)
- kurenai-kon featured in 4 collections
- wada-001 featured in 3 collections
- 391 URLs in sitemap (up from 382 — +9 collection pages)

---

## 2026-04-11 — Palette page enrichment: contrast matrix + share + per-palette OG

**Decision:** Add three durable additions to every palette detail page:
WCAG contrast matrix, share bar with viral-loop primitives, and per-palette
OG SVG images at build time.

**Why each one:**

1. **Contrast matrix.** The auto-generated 348 Wada pages share the same
   template structure, which Google can flag as "thin content" at scale.
   The contrast matrix differentiates every page with unique, factually-
   derived data (not fluff). It's also a real designer value-add —
   accessibility reviews are a mandatory step in every design handoff, and
   baking the check into every palette page turns this archive from "look
   up hex values" into "I can defend this palette in a design review."
   Uses the existing `contrastRatio()` in `src/lib/color.ts`. Zero new deps.

2. **Share bar.** Viral loop primitive — three actions: copy link,
   Twitter/X, Pinterest. Per-palette Pinterest intent includes the new
   per-palette OG image as `media`, so pinning auto-shows the palette.
   Plausible events wired: `share_copy`, `share_twitter`, `share_pinterest`.

3. **Per-palette OG images.** Critical viral loop amplifier. Before this
   change, every shared palette URL showed the generic site OG image on
   Twitter/LinkedIn/Discord/Slack. Now each of the 378 palettes has its
   own 1200x630 SVG with the actual colors, title, and site mark. Shared
   links become visual ambassadors for the archive instead of lookalike
   blobs. Built via Astro endpoint (`src/pages/og/[slug].svg.ts`) as
   static SVG at build time — 378 files, ~2KB each, ~750KB total.

**Format choice — SVG not PNG:**
- Modern platforms (Twitter, LinkedIn, Discord, Slack, Mastodon, Bluesky)
  all render SVG OG images.
- Facebook is the main holdout — for FB-specific traffic, add PNG
  fallback later via Sharp/Satori.
- SVG is ~10x smaller than equivalent PNG (~2KB vs ~20KB), and scales
  crisply at any viewport.
- Zero new deps for build-time generation (Astro endpoint pattern).

**Why this now (god mode priority):**
First 90 days are traffic investment. Everything that makes each page
more shareable / harder to flag as thin / more likely to rank on long-
tail queries compounds over months. These are three small changes that
ship forever-value improvements across 378 pages in one deploy.

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

## 2026-08-26 — Closed the "color of the year 2026" gap without disturbing the live Bing CTR test

**Decision:** task `mta84bc3iqdd1n` proposed a new `/color-of-the-year-2026` page for a Bing-measured query cluster (1,394 imp/mo, 0.57% CTR, ranking position 2-8). That page already exists at `/trends/color-trends-2026` (built + primary-sourced, FAQPage-schema'd) and is 2 days into a 14-day Bing title/CTR experiment (commit `a0d4510`) on this exact cluster. Building a competing new URL would split ranking authority and confound the live experiment.

Closed the gap additively instead, touching nothing on the experimental page's title/description/position surface:
- `_redirects`: 8 guessed paths → the real page (301)
- `trends/color-trends-2026.astro`: 1 new `FAQPage` entry for "What are the colours for 2026?" (British spelling, ranking position 2 at 0 clicks, previously unmatched)
- `index.astro` + `browse.astro`: internal-linked the trends page from both — it had zero incoming links from either, and the task explicitly asked for this

**Verify:** all 8 redirect variants live 301→200; new FAQ entry + both internal links confirmed on the deployed HTML. IndexNow (1,472 URLs) + direct Bing (200) + Yandex (202) submitted.

**Reversibility:** fully reversible, `git revert` commit `25eff5c`. None of it touches the a0d4510 experiment's measured surface — the 14-day read stays clean.

## 2026-09-02 — Protected the money path on every deploy, then raised basket size on 378 palette pages

**Context.** Chief directive from the 90-day revenue study: this is the #3 earner
($27 US NET / 425 clicks / $0.06 per click) and it lost ~10 clicks/day across two
`/go/*` 404 windows on Aug 27-28. Protect first, then raise basket size.

**Three ships, in dependency order.**

**1. The click beacon was blind to two of three link shapes.** `public/amazon-track.js`
matched affiliate clicks against an ENUMERATED list of href shapes. When non-book
ASINs moved to `/go/p/{asin}` on 2026-08-26 they became same-origin, matching neither
that pattern nor the `amazon\.` fallback, so the handler returned before ANY sink
fired — no Clarity, no GA4, no fleet beacon. `/go/prime` was never counted at all.
Verified live before changing anything: one palette page serves 4 `/go/p/` and 3
`/go/b/` links; against the built dist, 1,286 `/go/p/` and 229 `/go/prime` links were
uncounted.

The cost was not the missing count, it was what the count SAID.
`amazon_clicks_by_position_30d` read `{book: 107, tool: 2}`, which reads as "the
art-supply shelf does not convert" and means "is not counted" — an argument for
deleting the one surface built to raise basket size. Fixed by making the match
STRUCTURAL (same-origin + pathname starts with `/go/`, which is by construction the
affiliate-gate prefix here) rather than enumerated, so a fourth shape counts on the
day it ships. A header comment warning about this exact failure was already in the
file and had not prevented instances 2 or 3, so the fix is a guard:
`scripts/verify-beacon-coverage.mjs`, wired into `predeploy`.

**2. Deploy-integrity guard (`scripts/verify-deploy-integrity.mjs`).** `make-worker.mjs`
already fixed the CAUSE of the Aug 27-28 outage — dist is ~92MB so every deploy takes
the chunked direct-upload path, which ships static assets only and cannot compile a
Pages Function, so the four handlers are merged into `dist/_worker.js`. Nothing checked
the RESULT. `--pre` inspects dist before upload (worker present, parses, all four
routes plus the ASSETS fallthrough, gesture gate, page-count sanity) so a bad deploy
aborts without touching production; `--post` probes production afterwards. Both wired
into `npm run deploy`.

Non-US earnings (EUR 17.78 DE + GBP 4.15 GB / 30d — this is the fleet's only material
international earner) are protected by CODE-READ, not probe: Cloudflare overwrites
`cf-ipcountry`, so a live EU probe is impossible. `--pre` asserts `caslonmedia-21` is
present, AT/BE/IE/PT/DK/FI are still in `EU_ROUTED`, and DE/NL/FR/IT/ES/PL/SE are still
ABSENT (routing a Global-Earning country through .de credits the wrong tag). An honest
code-read beats a probe that cannot run. No probe ever generates an affiliate click:
every 302 check uses `redirect: "manual"` and reads the Location header.

**3. Basket size — the actual constraint.** Per-tag, window Aug 03-Sep 01: 425 clicks
→ 42 orders → 9.88%, the fleet's BEST conversion, earning $0.065/click, the fleet's
LOWEST, on a ~$21 average item. 251 of those clicks went to three ~$20 books earning
~$23. The audience acts; it is being handed cheap items. The catalogue already held the
high-basket end of the same intent (the print and calibrate groups) but the shelf
rendered a rotating two-of-ten in the sidebar, so many pages surfaced two of the
cheapest items and neither high-basket group.

Moved to peak intent — main prose column, straight after "Historical context", where
the reader has the hex codes — as three destination verdicts (…onto paper / …onto a
screen you can trust / …by hand). A MOVE, not an addition: the sidebar block is gone,
so page density is unchanged. Extended `PaintThisPalette` with a `destination` variant
rather than writing a new component, so zero new compliance surface. Result: **378 of
378 palette pages now carry both a print and a calibrate item**, where the old rotation
guaranteed neither.

**Measurement beat eyeballing, twice.** Headless screenshots proved an unreliable 375px
instrument — text clipped at the right edge in both `--headless` and `--headless=new`.
The control settled it: the same clipping appears on LIVE production, which does not
contain the new block, so it was a screenshot artifact. Switched to reading real
geometry from the rendered page: zero horizontal overflow at 375/768/1000/1400px, 52px
buttons everywhere (clears the 44px standard), and the block trimmed from 1175px to
886px on mobile by dropping the catalogue `why`, which was repeating the verdict above
it. Separately, the first version of the deploy guard's tracker check PASSED against
production when it should have failed — its needle existed in the old tracker too. A
control that both the good and the bad artifact satisfy is not a control; corrected to
assert the discriminating property.

**Verify.** Build 2128 pages, 0 typecheck errors, 0 content leaks. Deployed
`945766c1`, 3962 files, `_worker.js` in specials. Post-deploy: 14/14 pass. Live on 3
palette pages spanning the catalogue: 3 destination cards, 6 `/go/p/` links carrying
`c=palette-destination`, 3 book links intact, `rel="sponsored nofollow noopener"` on
all 10, FTC disclosure present, **zero prices**, **zero raw tagged Amazon hrefs**.
Sitemap 1469 = 1469, no page drop; 9 untouched page types all 200.

**IndexNow deliberately skipped.** Dry run reported 1,415 changed URLs, because the
same-day footer attribution commit re-hashed every page. Submitting 1,415 URLs for a
footer line plus a buy-block move is the batch-abuse shape Bing's detector is tuned
for, and neither change alters search intent. Manifest left unwritten, so these URLs
ride along with the next genuinely content-bearing deploy.

**Reversibility.** Fully reversible: `git revert 79d225a 46224da` for the AOV surface,
`9beddee` for the beacon. No monetization-layer change — same Amazon Associates layer,
same tag, same gate.

**Open, not done.** The 1000px viewport band gets a 1-column block because the 22rem
sidebar squeezes prose to 504px and two 240px columns need 508px — a 4px miss that
`minmax(14rem, …)` would win back. Left as is rather than spending a 9-minute rebuild.
The embed / CC BY dataset link-magnet promotion in the chief directive is untouched.

## 2026-08-27 — Shipped /gift-guide after confirming the 2026-08-24 shelf verdict cleared its gate

**Decision:** task `mry1jdydl0xfb9` ("gift-guide intersection around the proven Wada book cluster") was explicitly written as gated: build only if the linked verdict task (`mrudi4pywoizow`) showed the audience converts. Read that task's `result` field before starting anything — it was `status: done`, verdict "the site IS an Amazon asset" (306 clicks -> 35 orders -> $16.18/30d). Gate cleared; built the page.

Reused rather than invented: `FurtherReading` (books={the exact 3 proven ASINs, sliced from `FURTHER_READING`}) and `PaintThisPalette` for the studio shelf — both already carry the compliant rel/disclosure/no-price rendering, so the new page adds zero new compliance surface to audit. Cross-linked from `/compare/wada-vol-1-vs-vol-2` and the footer Shop column so it isn't an orphan; registered in `sitemap-ai.xml` at the same 0.5 commercial tier as `/shop`.

**Collision note:** the working tree carried an unrelated, uncommitted homepage title/H1 edit (`src/pages/index.astro`, a same-day entity-match SEO hypothesis) from a different in-flight session. Left it alone — staged and committed only the 4 files this task actually touched, pathspec-scoped, never `git add -A`.

**IndexNow:** submitted only the 2 genuinely-changed content URLs (`/gift-guide/`, `/compare/wada-vol-1-vs-vol-2/`) directly via the API rather than running `scripts/indexnow-ping.mjs`'s full-sitemap blast (2128 URLs) — the footer/sitemap-ai edits don't warrant re-crawling every page, and Bing's batch-abuse detector is tuned to exactly this kind of oversized submission on a small real change (see fleet rule: prefer the changed set).

**Verify:** build clean (2128 pages, 0 typecheck errors) · no content leaks · all 8 outbound links resolve to the right `/go/b/` + `/go/p/` shapes with `&c=` subtags · 3 JSON-LD blocks parse · deployed (Worker + Functions bundle) · live content + both gate shapes verified WITHOUT manufacturing a real Associates click (byte-compared the live interstitial against source; ran `tokenFresh()` as pure computation with a genuinely browser-minted token). Commit `c39682b`.

**Reversibility:** fully reversible, `git revert c39682b`. No monetization-layer change — this is a conversion-surface ship on the existing Amazon Associates layer.

## 2026-09-03 — Extended the peak-intent buy block to every surface that earns it, and rejected four that don't

**Decision:** carried the 2026-09-02 basket-size move (`/palettes/`) across the rest of the
site. Six more surfaces now carry a buy block at peak intent — the line where the reader is
holding a result, not choosing what to look at: `/colors/[slug]` (212 pages, moved off a
`limit={2}` sidebar shelf), `/collections/[slug]` (71 pages), `/trends/color-trends-2026`
(chief A1, board card `mtkltehvk2qm2l`), all six `/tools/` result pages, and the 11 `/learn/`
essays. 174 `/go/` affordances added to pages that previously had **zero**.

**The rejections are the more useful half of this entry.** Four candidates were measured and
NOT shipped; re-opening any of them is re-doing settled work:

- **`/colors/` + `/collections/` index hubs** (654 + 544 pv, the 3rd and 4th biggest single
  pages, both with no block — so they look like the obvious next target). `CLARITY_FRICTION.md`
  records them as the 3rd and 4th most-sampled LANDING pages at 4.37 pv/session, 3x the median:
  readers land, open a palette, come back, open another. Their job is routing readers INTO the
  pages that now carry the blocks, and only ~27-30% of page height is seen by the median
  visitor, so a block above the grid pushes the grid down and risks the loop that feeds the
  monetized pages. **The index is the funnel, not the destination.**
- **`/colors-that-go-with/`** (1,000 pv / 572 paths — the largest programmatic surface, still on
  the old `limit={2}` pattern, so converting it looks obvious). Its 12 contexts are
  `accent-wall, bathroom, bedroom, cabinets, curtains, front-door, kitchen, living-room, nursery,
  walls` + `an-outfit, clothes` — **ten of twelve are interior-decor paint intent.** The
  destination variant would show that reader a Pantone print deck and a monitor colorimeter, and
  the catalogue's "paint" group is *watercolour* supplies (Gansai Tambi, Strathmore), not house
  paint. **No variant fixes this: the catalogue has no decor product.** Real fix needs verified
  ASINs for paint fan decks / peel-and-stick samples — ASIN-gated, not buildable here, and a
  fabricated ASIN is a broken buy link or the wrong product.
- **`/embed/` link magnets** (closes the "untouched" item left open in the 2026-09-02 entry).
  658 pages built, `noindex,nofollow`, absent from the sitemap, no analytics (bare `<html>` by
  design, not BaseLayout), and the full untruncated 69-row referrer pull contains **ZERO embed
  hosts** — every third-party referrer is a search engine, AI assistant or social shortener. No
  demand. Also declined to add analytics: firing GA4/Clarity inside an iframe on a third party's
  site with no consent banner is real GDPR exposure, and this site's numbers are trusted
  precisely because it is the fleet's only ungated earner.
- **`/tools/` hub, `/random/`, `/data/`, `/methodology/`.** A hub visitor holds no result.
  `/random/` looked like the biggest miss at 185 pv until sessions showed **17** (~11 palettes
  flipped per visit). `/data/` is the CC BY open-dataset page — an authority/citation asset that
  affiliate links would undercut.

**Coverage is now measured, not assumed.** Joining the untruncated GA4 pull (1,320 paths,
`n=1320`; `limit=` is silently ignored by `/ga4-probe`) against the `/go/` count of every built
page: **1,272 of 1,296 eligible pages carry a buy path.** The remainder is 6 result pages
totalling 77 sessions/30d.

**Measurement fix shipped in the same session, and it was a defect in the above.**
`PaintThisPalette`'s destination variant hardcoded its subtag to `palette-destination`, so all
six new instrument surfaces reported as ONE bucket — the next per-tag Associates read could not
have answered which converts. `FurtherReading` already solved this with `pageClass` and says so
in its Props comment. Added the same prop; defaults preserve prior behaviour exactly, so
`/palettes/` keeps continuity under its existing label. Surfaces now distinct:
`palette-destination` / `color-destination` / `collection-shelf` / `trends-destination` /
`tools-destination`, plus the book subtags.

**Google: open question CLOSED, and closed rather than actioned.** `CLARITY_FRICTION.md` carried
"either a Clarity attribution artifact or a genuine ranking gap — I have not established which."
It is the ranking gap: GA4 names `google` as its own row at **28 sessions** against bing 662 and
duckduckgo 901, and GA4 is trustworthy here because this is the only ungated site. Not a
technical block — robots.txt allows all bar `/og/` and `/go/`, 0 CF-managed injection, Googlebot
200, no `meta robots`, sitemap-index 200. **GSC is verified via DNS TXT, NOT a meta tag** — the
home page has Bing's `msvalidate.01` but no `google-site-verification` meta, so a meta-only check
yields a false "unverified" and a wasted operator card; I nearly filed exactly that. Not actioned
because REVENUE-STUDY-2026-09-02 already documents it fleet-wide as "Google structurally dead...
**more pages hurt**".

**Deploy method corrected.** `package.json`'s note told the next session to use the chunked
deployer as though it were the only way to ship. Measured: **CI overwrote three local chunked
deploys within ~3 minutes of each push** (CF `c2da7fa0` commit 70cfb7a9 15:33 -> `a4f5d839`
DIRECT-UPLOAD 15:40 -> `56304e44` commit 3b8d6e4e 15:43, which went live). The two paths are
different BUILDS, not two ways to ship one: CI runs `npx astro build`, never `make-worker.mjs`,
so no `_worker.js` and wrangler compiles `functions/` natively. Advanced mode did NOT break
`_redirects` here — measured on the direct-upload deployment that actually carried `_worker.js`,
`/sitemap.xml` and all 8 COTY rules still 301. And `/_worker.js` 404s in BOTH modes, so it cannot
distinguish them; the valid instrument is the CF deployments API trigger metadata.

**Verify:** every ship built clean (astro check 0 errors, 2,128 pages, no page drop) and went out
via CI with its post-deploy assertion green (`1e90a5c5`, `2fe92fc7`). `verify-deploy-integrity
--pre/--post` passed on all six deploys; money path 14/14 each time. Affiliate leak gate 0 raw
amazon hrefs and 0 `tag=` across all built HTML on every deploy, with the `/go/` count as the
control — and the deltas matched the work exactly (41,912 -> 41,933 = +21 for three tool pages;
-> 42,065 = +132 for eleven learn pages; -> 42,086 = +21 for the last three tools). Live
fingerprints confirmed per surface, `cf-cache-status: DYNAMIC`. `offset` chosen per page to keep
the ~$1,900 ColorChecker Studio off every new block — verified 0 occurrences live on all of them.
IndexNow deltas stayed honest as the manifest healed: 1,415 (genuine site-wide, BaseLayout +
SiteFooter had changed) -> 71 -> 5 -> 3.

**Mobile:** code-read only, NOT a rendered check — no Chrome MCP on this device. The destination
grid is `repeat(auto-fit, minmax(15rem,1fr))` (container-based, 1 column at 375px) with
`min-height: 44px` links per the fleet mobile standard, and the added wrappers only set
`margin-block`. Low risk by construction; a real 375px pass is still owed per
`mobile-perfection-default`.

**Reversibility:** every surface is a separate commit and independently revertable. The subtag
change is additive with prior-behaviour defaults. No monetization-layer change anywhere — same
Associates layer, same tag, same gate.

**Open, not done.** (1) The decor-catalogue gap above — the largest programmatic surface has
demand for paint/decor products the catalogue does not contain; ASIN-gated. (2) `$/order`
($0.649) and clicks/user (0.097) both read from the next per-tag Associates export — worth
pulling now, because for the first time it can attribute per surface. (3) A rendered 375px pass
on the ~20 pages changed today. (4) The `{book:109, tool:2}` split should NOT be used to rank the
instrument shelf on this window: tool links were dark 08-26 -> 09-02, so it is partly "not
counted", not "does not convert" — the tracker's own header calls this "the more expensive kind
of wrong". All 42,086 `/go/` anchors are now labelled (0 untagged, measured), so the caveat
expires at the next read.

### 2026-09-03 (later) — the bundle CTA pointed at an empty invisible element

**Found by asking what the site's OTHER money path does.** `bundle_interest_click`
= 64/30d in GA4 — 30% of `amazon_click` volume, and I had flagged it twice as
"worth a look" without looking. It was worth looking.

`BundleCta` links to `/shop#bundle-coming-soon`. That anchor was literally:

```astro
<section id="bundle-coming-soon" aria-hidden="true" />
```

A zero-height, screen-reader-hidden element. So 64 clicks/month of purchase
intent scrolled to **nothing** and landed staring at the closing note. The
"Launching soon" line a visitor reads is the CTA they just clicked, not a
destination — I mistook it for a graceful holding state on first pass and had to
open the source to see there was no destination at all.

**Why capture and not a buy button:** `BUNDLE.checkoutUrl` is still
`/shop#bundle-coming-soon`; the config comment says "paste the Gumroad URL here
once the operator creates the product." No product exists. Creating one is
operator-gated (money). Shipping a buy button for a thing that isn't for sale
would be the dishonest fix.

**The trap that nearly made this worse.** `functions/api/subscribe.js` returns
`ok:true, pending:true` when `env.SUBSCRIBERS` is missing — "so the form never
*looks* broken while the binding propagates." That means a missing binding is
invisible: the form thanks the visitor and discards the address. Adding capture
on top of a broken binding would have been worse than the dead end. Verified via
the CF Pages project config API that `SUBSCRIBERS` **is** bound in production
(`2c0331068e074cafaf215ee6af1666b3`) before shipping. Same family as
`positive-control-before-absence`: an instrument that returns the reassuring
answer when it cannot see.

**Not verified:** current subscriber count. The Pages-scoped token has no KV read
scope (`Authentication error` on the keys endpoint), so list size is **unread**,
not zero.

`source="bundle-waitlist"` segments these from homepage newsletter signups in
the same KV, so a launch email goes to people who asked for *this*.

**Honest EV.** 64 clicks/mo is real intent but small; at a $3–5 PWYW this is tens
of dollars, not hundreds. It is worth doing because it is ~20 lines reusing
components that already exist, and because an owned list outlives any affiliate
program. It is **not** the biggest lever here — that remains Mediavine
(`mtlst3czyav7re`, ~$190–300/mo vs ~$27/mo Amazon) and it is operator-gated.

### 2026-09-04 — CI ran none of this repo's guards; and the CC-BY dataset shipped 447 dead URLs

**Two defects, same shape: a thing that exists and is never exercised.**

**1. The money-path guard was orphaned by my own correction.**
`verify-deploy-integrity.mjs` has existed since e1839f3 and CI had *never* called
it. It is wired to `npm run deploy` — the laptop path — and I changed
`_deploy_note` to "DEPLOY VIA CI, NOT FROM A LAPTOP" earlier the same day after
measuring that CI overwrites direct uploads. Correcting the deploy path silently
disabled the guard. CI calls `npx astro build` and `wrangler` directly, so no npm
`pre*`/`post*` hook fires either: `predeploy-git-guard` and
`verify-beacon-coverage` are bypassed the same way. **Installed is not invoked.**

Fixed in `a9543b3` (guard, `--post` only — `--pre` asserts `dist/_worker.js`
which CI correctly does not build) and `d06ee14` (page-count floor, which the
guard only had in `--pre`; `wrangler pages deploy` REPLACES the directory, so a
short build deletes live pages). Both pipelines green.

Added a `SUBSCRIBERS` KV binding assertion while there — `/api/subscribe`
returning 405 proves the Function is alive and says nothing about whether a
signup is *stored*, because it returns `ok:true` when unbound.

Two things that check taught me about itself, both kept:
- It first read `CLOUDFLARE_API_TOKEN` only, which locally is DNS-scoped and
  cannot read Pages, and reported UNVERIFIED while the answer sat in
  `CF_PAGES_TOKEN`. It now tries every candidate token.
- A WARN now propagates into the summary, so "integrity OK" can no longer print
  while a check silently did not run.

**Its CI-side verdict is UNKNOWN, not passing.** Reading the job log needs a
GitLab token with `Job: Read`; ours returns `insufficient_granular_scope`. A
green pipeline proves only that the step exited 0 — which a WARN also does.

**2. `og_url` advertised `.svg` for 447 records that only ship `.png`.**
`dist/og` holds 389 `.png` against 11 `.svg`, and every `.svg` is a static site
page (about, browse, index, learn…), never a palette. 378 + 69 = 447 dead URLs
in a CC-BY-4.0 dataset whose entire purpose is attracting attribution links —
consumers rendering our own `og_url` got a 404 from us. Fixed in `0ba7d3b`;
live-verified `200 image/png`.

Then checked **every** URL column rather than stopping at the one I sampled:
40 probes across all 10 columns in all three CSVs, all 200, control 404 correct.

**Three of my own readings in this session were wrong and are worth keeping:**
- Reported the dataset had no visible licence. It has a full "License +
  attribution" section; I searched `"CC BY"` and the page writes `CC-BY-4.0`.
  Wrong vocabulary, not a missing licence.
- Called `/embed` broken. That string is prose describing a **CSV column**, not a
  route — the 404 was correct. The real `embed_url` works (4/4, control 404s).
- Nearly read `grep -c` returning 2 on `.gitlab-ci.yml` as "a page-count floor
  exists". Both matches were the leak gate's `wc -l`. `grep -c` counts LINES.

The lesson under all three: **test a URL taken from the data, never one you
constructed**, and read the matches rather than the count.

### 2026-09-04 (late) — CI quota exhausted; two commits are pushed but NOT deployed

**READ THIS BEFORE DEPLOYING ANYTHING HERE.** Repo and live have diverged.

`ci_quota_exceeded` on the acevault-lab namespace, tonight. The job never starts
(`duration: null`), so this is not a code failure and not the new deploy gates.
readinglist-school deployed fine at 23:05 and this repo failed minutes later, so
the ceiling is namespace-wide — every GitLab-deployed fleet site is affected.

**Undeployed, in order:**
- `6389ac0` search: palettes findable by the colours they contain
- `a30cfd1` ci: docs-only short-circuit

Production still serves `321c2ae`. Both ship on the first successful CI run; no
action needed beyond restoring minutes. Operator card: `mtm6ocq8bs46ms`.

**I deliberately did NOT laptop-deploy them.** `npm run deploy` works and is
guarded, but it ships advanced-mode `dist/_worker.js` instead of CI's native
Functions compilation. That is a live mode change on the site carrying the
fleet's entire non-US Amazon business, and with CI down there would be **no way
to recover via CI** if it went wrong. A search improvement does not justify that
asymmetry. If something revenue-critical needs shipping before minutes return,
the laptop path is available and the guard covers it — the money path is
currently GREEN and untouched either way.

**My share of the cause, recorded so it is not repeated.** A build here is ~8-10
min against 400 compute-minutes/month for the WHOLE namespace — roughly 40-50
deploys a month across every repo. Two of tonight's builds were mine and touched
only `.claude/`, shipping no byte. `a30cfd1` makes that structurally impossible:
a commit whose paths are all under `.claude/` now exits before any build work.
Nothing under `.claude/` can reach the output — its only two mentions in `src/`
are inside comments, and there are no `.md` files under `src/`.

**Deliberately NOT done: a node_modules cache in CI.** There is no `cache:` block
and `npm ci` runs cold every build, which is a real cost. I did not add one
because I cannot test it — CI is blocked, and job logs are unreadable with this
token (`Job: Read` scope missing), so I could neither verify the config nor
measure the saving. A broken cache would fail the first build after the quota
returns, which is precisely the build that must succeed. Do it when CI is live
and the result is observable.

**Also unreadable with the current token, and worth fixing once:** CI job traces
(`Job: Read`) and namespace usage. Without traces, a green pipeline only proves
the step exited 0 — a WARN does that too, which is why the SUBSCRIBERS KV
assertion's CI-side verdict is still UNKNOWN rather than passing.

### 2026-09-04 — CSS colour-name aliases: computed, measured, NOT shipped

Follow-on from the search work. `beige` and `fennel` return nothing; the idea was
to alias modern colour words to their nearest Wada colour so the 210-colour
dictionary is reachable by contemporary vocabulary.

**The mechanism works.** Using the installed `color-name` package (the canonical
CSS list, 148 names) against the 210 Wada hexes with a redmean-weighted RGB
distance: 55 names land within 30, 89 within 50. `white` → Shiro at distance 0.
`beige` → Gofun (15) — Gofun is chalk white and is genuinely what beige is.

**Filtering to aliases that would add something:** 19 of the 89 already match by
text today (Wada names contain "blue", "pink", "green"…), leaving **70 new**.

**Not shipped, three reasons:**

1. **Measured demand is one term.** Of 39 distinct zero-result terms sampled
   across windows, exactly one (`beige`) is in the 70. `fennel` is not a CSS
   colour, so this would not fix it. Perhaps 10-15 of the 70 are plausible human
   searches; the rest (`papayawhip`, `blanchedalmond`, `lightgoldenrodyellow`)
   are spec artifacts nobody types.

2. **Numerically close can be semantically wrong, and the distance hides it.**
   `azure` → Shiro (WHITE) at 26, because CSS `azure` is #F0FFFF — nearly white.
   A reader typing "azure" expects blue. Same trap: `lavenderblush` → Kinari,
   `mintcream` → Shiro, `honeydew` → Kinari. All near-whites in the spec whose
   NAMES imply a hue. Shipping these would put confident wrong answers where
   there is currently an honest "no match" — worse on this site than nothing.

3. **Unverifiable right now.** CI is quota-blocked, so impact could not be
   observed after shipping.

**The worst matches are the commonest words, which is why this matters less than
it looks:** `blue` 249, `cyan` 213, `lime` 257, `magenta`/`fuchsia` 261. No 1933
pigment approaches an sRGB primary. But those words already work through Wada
names, so the alias layer was never going to help the high-frequency queries.

**If demand grows, build it curated, not wholesale:** require the CSS name's own
hue family to agree with the matched Wada colour, so `azure` is rejected rather
than mapped to white. Compute at build time and put it in `/search-index.json`
(fetched once, gzipped) — NEVER in the BaseLayout inline script, which ships in
all 2,128 pages and is already 6.9KB.

`color-name` is present only as a TRANSITIVE dependency. Anything built on it
should either declare it in package.json or bake its output into a committed
data file — do not silently rely on a transitive dep for build-time correctness.

### 2026-09-04 — this site is the fleet's AI-traffic outlier, and possibly its only clean denominator

From a peer session (device4-autopilot), re-verified here rather than taken on trust.

**VERIFIED, exactly.** `ai_sessions_30d` = **969**, which is **69.2%** of the
fleet's entire 1,400 AI-referred sessions, at **2.96 pageviews/session**. That
last number matters: an AI-referred session at ~1.0 pv/session is a crawler;
2.96 is a person browsing. So this site is not merely cited, it is the one place
in the fleet where citation converts into real readers. `ai_share` 14.1.

Reinforces what `ai-citation-channel.md` already says: fleet-wide the
citation→session rate is 0.21% median and colorcombinations is the lone live
exception. Growth work here should weight AI citation far above its fleet norm.

**VERIFIED 2026-09-04 (corrected in place — I first recorded this as
unverifiable, and that was my instrument error, not a gap in the data).**
6 of the 7 named earners carry a CONSENT-GATED flag; **colorcombinations.org is
the sole exception.** GA4 counts only consented visitors while the /c beacon
fires regardless, so per-visitor click and conversion rates on the other six read
high by an unmeasured factor.

    fitmylens.com          $176.89   CONSENT-GATED
    readinglist.school     $ 44.60   CONSENT-GATED
    dormbyschool.com       $ 32.85   CONSENT-GATED
    colorcombinations.org  $ 27.34   —  clean denominator
    cabinpets.com          $ 22.50   CONSENT-GATED
    sourdoughhydration.com $  3.30   CONSENT-GATED
    meeplepick.com         $  2.31   CONSENT-GATED

**The flag is a SUBSTRING in `flags[].t`, not a boolean field:**

    any('CONSENT-GATED' in (f['t'] if isinstance(f,dict) else str(f))
        for f in row.get('flags') or [])

16 rows carry it feed-wide. Control discriminates properly — colorcombinations
False, fitmylens True — so it is not matching everything.

**My mistake, worth more than the finding.** I probed named keys with `if k in r`
and reported "consent_gated reads None, so my instrument is blind". The data was
there the whole time under a different shape. I never ran `print(list(r.keys()))`
— one line that would have shown `flags` immediately. `ai-citation-channel.md`
already carries this exact lesson for `GroundingQuery` vs `Query` ("before
trusting any empty result, dump Object.keys(rows[0])") and I did not apply it.
**"The field is absent" and "I looked for the wrong field" are different claims,
and only one of them is about the world.** Dump the keys before declaring
blindness. Note also the full feed row has 68 keys against the MCP `by_domain`
projection's 10 — absence in the projection is never evidence about the data.

**The consequence, now confirmed rather than conditional:** this is the fleet's
only trustworthy per-visitor denominator among earners. Any benchmark of another
earner's click or conversion rate against this site is biased in the OTHER
site's favour. A peer retracted a "27% click rate" on watchspecdb for exactly
this. Same family as the crawler-share trap in `measured-vs-expected` — a rate is
a claim about its denominator first.

For reference here: ga4_users_30d 4281, affiliate_clicks_30d 426 → 9.95%
clicks-per-user. direct_share 45.7, so some crawler presence, but pv/session on
the AI segment is 2.96 and the site is NOT flagged crawler-inflated.

### 2026-09-04 — sitemap has no lastmod: confirmed, and deliberately left alone

Confirmed with the correct method: 1,469 `<loc>`, **0** `<lastmod>`. The file is
minified to a single line, so `grep -c '<loc>'` reports **1** — demonstrated live.
Use `grep -o '<loc>' | wc -l`. (Also: robots declares `/sitemap-index.xml` whose
only child is `/sitemap-0.xml`; a probe that does not follow one level down sees
1 URL and can read as "this site has no pages".)

A sitemap without lastmod is VALID — it is only a crawl-scheduling hint — and
there is no measurement that its absence costs anything here. The peer was
careful not to overclaim it, and I agree with not shipping.

**One reason to add, which strengthens the case for NOT doing it cheaply:** the
lazy implementation is actively harmful. Emitting build-time lastmod on all 1,469
URLs asserts that every page changed today, which is false, and a sitemap where
every lastmod is identical is a well-known low-trust signal — worse than having
none. Doing it honestly requires real per-page modification dates (the
`data/page-lastmod.json` pattern other fleet sites use, which has its own guard
because a sitemap disagreeing with that file is itself a defect class).

So the trade is not "marginal unmeasured gain vs a little work". It is "marginal
unmeasured gain vs either real work or an actively harmful shortcut". Skip until
someone measures a crawl-freshness problem.

### 2026-09-04 — STOP optimising this site on-site. The remaining upside is ~$5/mo, measured.

Went looking for the basket-size lever and found instead that the on-site work here
is finished. Recording the numbers so nobody re-derives this.

**Where the clicks actually come from (GA4, 30d):**

    page            views   /go/ links   clicks   rate
    /                3031        31         46     1.5%
    /browse/         2279        30         21     0.9%
    /shop/            175        54         70    40.0%
    /tools/           220         0          0      —
    /random/          185         0          0      —
    /paintings/       162         0          0      —

Only 33 of 1,325 paths with views produce any click at all.

**Two premises I had were wrong, both from page-count thinking:**

1. `/colors-that-go-with/` is the largest page class (703 pages) and I assumed it
   was the traffic and the basket opportunity — decorating intent, higher-ticket
   than $20 books. **It does not appear in the top 15 pages by views at all.**
   Built ≠ trafficked, again.
2. I said `/paintings/` had no buy affordance. **The detail pages carry 30 /go/
   links each.** Only the index and `/paintings/methodology/` have zero. I got
   this wrong twice in one session — first claiming it, withdrawing correctly,
   then re-asserting it after checking only the index and a methodology
   sub-page. An index is not its class.

**The upside of every remaining on-site optimisation, at the measured $0.064/click:**

    3 unmonetised hubs (567 views) @1.5%   ->  +$0.55/mo
    same @3%                                ->  +$1.09/mo
    / + /browse/ from 1.3% to 2.0%          ->  +$2.52/mo
    / + /browse/ from 1.3% to 2.5%          ->  +$4.22/mo
    ---------------------------------------------------
    realistic total                          ~  +$5/mo

On a site earning **$27.34/mo**. Mediavine, which is operator-gated, is
**$190-300/mo — 7 to 11 times the entire site.** Every hour of on-site CRO here
is competing against a single operator click worth an order of magnitude more.

**So: further on-site conversion work on colorcombinations is below the bar.**
Not "low priority" — measured at single-digit dollars per month. The next
session that feels an urge to add a buy block to `/tools/` or re-tune `/browse/`
should read this and go do something else.

**One instrument caveat that binds any future read of the table above.** GA4 and
the beacon disagree by **1.95x** on the same quantity: `amazon_click` = 219,
`affiliate_clicks_30d` = 426, over the same 30 days on a site that is NOT
consent-gated. Cause not determined here (a plausible one is that the beacon
counts /go/ hits including non-JS clients while GA4 only sees JS browsers, which
would make the BEACON inflated rather than GA4 deflated — the fleet already
documents beacon-vs-Amazon divergence). Consequence: the per-page rates above
are GA4-relative and must not be mixed with beacon totals. The $/click figure
uses the beacon denominator deliberately, which makes it the CONSERVATIVE
version of the upside — using GA4's 219 would roughly double every number and
still leave the conclusion unchanged.

### 2026-09-04 — SELF-CORRECTION: I repeated a stale claim across ~6 turns tonight

`mtltz9oozrtzz1` (GA4 amazon_click custom dimension registration) was cited by me,
repeatedly, as: unresolved · operator-only · forward-only · "losing value daily" ·
one of two remaining live blockers. **It was completed before most of those
citations, `completedAt` predates them.** I never re-checked the task between
citations — I trusted my own earlier framing instead of the board.

What actually happened, per the task's own result: it was done AUTONOMOUSLY, not
by the operator — GA4 custom dimension registration is reversible internal
config on an already-authorized property, not a hard gate, and the fleet's own
`/ga4-dimensions?create=1` endpoint did it directly. It also caught a real hazard
I never surfaced: TWO GA4 properties share the display name "ColorCombinations.org"
(294106772 live, 292973229 dead/empty duplicate) — the endpoint refused to guess
between them and failed loud instead. Same pass registered cabinpets.com too, and
found dormbyschool/fitmylens were already done, correcting a stale fleet-wide
audit that had caused three prior sessions to defer a DIFFERENT task believing
this work was still needed.

**The mechanical failure: I asserted a scope (this card's status) without
re-measuring it, across roughly six repetitions, in an operator-facing summary
each time.** This is the SAME failure class as the CI-quota card earlier tonight
— verify once, then keep citing the verified claim without re-checking as time
passes and other sessions act. The fix there was "measure the denominator before
a universal quantifier"; the fix here is the same shape one level up: **re-check
a cited task's live status before repeating it, especially in an operator-facing
summary, especially the Nth time you say it.**

Filed as its own reference so this doesn't repeat: `mtm97...` (Fleet Dashboard).

### 2026-09-04 — CI page-count floor verified offline; and `$?` after a pipe is not the script's status

`a30cfd1` and `d06ee14` shipped guards into a pipeline I could not run (quota
blocked). The first build after the quota returns is the one that must not fail,
so both were tested offline against the real `dist` and against synthetic ones.

**Page-count floor — all four cases correct:**

    real build      2129 pages  -> exit 0   passes
    short build       40 pages  -> exit 1   ABORTS, deploy prevented
    exactly 1500    1500 pages  -> exit 0   boundary right (guard is -lt)
    dist/ MISSING      0 pages  -> exit 1   FAILS CLOSED

The last row is the one that mattered. A missing `dist` is the blind case, and
the guard treats it as catastrophic rather than passing on empty output.

**But I nearly filed a critical bug against my own guard, on a broken harness.**
My first missing-dist test was:

    bash floor.sh 2>&1 | tail -3; echo "exit=$?"

which printed `exit=0` next to the word ABORT — the signature of a guard that
announces failure and returns success, the worst kind. **`$?` after a pipeline is
the LAST command's status**, so I was reading `tail`, not the script. Unpiped it
exits 1 correctly. `PIPESTATUS[0]` is the script's real status.

Same family as everything else caught tonight: an instrument that returns the
reassuring-shaped answer while measuring something other than what you asked.
Here it produced a false ALARM rather than a false absence — which is the cheaper
direction, but only because I re-ran it instead of writing it up.

**Rule: never read `$?` through a pipe when the exit status is the thing you are
testing.** Run the command bare, or read `PIPESTATUS[0]`. This applies to every
guard, gate and predeploy check the fleet has, since they are all exit-status
contracts and all naturally get piped to `tail`/`head` when inspected.
