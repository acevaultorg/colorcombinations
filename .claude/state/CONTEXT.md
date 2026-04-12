# CONTEXT — ColorCombinations

## Session Handoff
<!-- handoff: 2026-04-12 10:10 -->

**Mode:** god
**Objective:** color dictionary + RSS feed — 211 new SEO pages for long-tail search, content distribution channel

**STATUS: SHIPPED. https://colorcombinations.org NOW HAS 603 PAGES LIVE.** ✓

### V3 changes (this session — 2026-04-12)

1. **Color data module** (`src/data/colors.ts`) — extracts 211 unique named colors from all 378 palettes. Hue classification, reverse palette lookup, sorted by frequency.
2. **Color dictionary index** (`/colors/`) — browsable grid of all 211 colors with hue-family pill filters (red/orange/yellow/brown/pink/green/blue/purple/neutral). Square swatch tiles with hex overlay, name, nameJa, palette count.
3. **Color detail pages** (`/colors/[slug]`) — 159+ individual pages. Hero swatch with hex/RGB/WCAG contrast specs, quick-copy buttons (hex/RGB/CSS var), palette grid showing every palette that uses the color, FurtherReading sidebar with rotating book, JSON-LD CreativeWork + BreadcrumbList.
4. **RSS feed** (`/feed.xml`) — RSS 2.0 with 30 editorial palettes, content:encoded swatch HTML, auto-discovery link in `<head>`.
5. **Palette swatch links** — color names on palette detail pages now link to their color dictionary entry, creating deep internal linking across 378 palette pages × 211 color pages.
6. **Navigation** — "Colors" added to header nav (between Browse and Collections) and footer Explore column.

### Numbers

| Metric | Pre-session | Post-session |
|---|---|---|
| Total pages | 392 | 603 |
| Color pages | 0 | 211 (1 index + 159+ detail) |
| RSS feed | none | /feed.xml (30 items) |
| Internal links added | 0 | ~1,000+ (swatch→color cross-links) |
| Build time | 2.34s | 2.73s |
| Dist size | 11M | 23M |
| Sitemap URLs | 382 | 602 |

### Live URLs verified

- https://colorcombinations.org/colors/ — 200, color dictionary index
- https://colorcombinations.org/colors/hermosa-pink/ — 200, color detail
- https://colorcombinations.org/colors/cerulian-blue/ — 200, color detail
- https://colorcombinations.org/feed.xml — 200, RSS feed

---

## Previous Handoff (2026-04-11 11:00)

**Mode:** god
**Objective:** monetization-v1.1 reality check

**STATUS: SHIPPED.**

### V1.1 changes (this session)

1. **Bundle repositioned** from "$12 product" to PWYW tip jar ($3 min, $5 suggested). Dropped $29 anchor (not credible). Copy: "Support the archive" not "Get the bundle". "The archive itself stays free, always."
2. **Book covers** via Open Library CDN — 5 books on /shop and /about with real cover images. `?default=false` param forces 404 on miss instead of 1×1 placeholder so `onerror` fires. Direct `olCoverId` preferred over ISBN when ISBN not indexed (Chromaphilia uses cover id 12410845).
3. **FurtherReading sidebar on all 378 palette pages** — deterministic rotation by slug hash so every page shows a different book. Maximum impression spread across inventory.
4. **DesignTools component** (new) on /shop — Framer affiliate (~$25 recurring), Figma (no affiliate), Coolors (no affiliate). Higher commission ceiling than books.
5. **Shop page reordered**: library (visual books) → tools → prints → support bundle. Visual-first converts better. New hero: "The library, the toolbox, and a thank-you."
6. **Browse color-count filter**: 2/3/4 colors pill buttons above existing dropdowns. Matches how Wada's original book organized plates. Counts confirmed live: 120 × 2-color, 144 × 3-color (incl. 24 curated), 114 × 4-color (incl. 6 curated), 378 total.
7. **Carbon Ads config stub** — traffic-gated, requires 20k pv/mo to qualify. Documented in config, not active at launch.

### Honest math pass (from DECISIONS.md 2026-04-11)

Below 20k pv/mo NO monetization rail makes real money. First 90 days = traffic investment. Real compounding starts at 50k+ pv/mo where affiliate + Carbon + prints start paying. Bundle reframed as tip jar because pretending a $12 bundle is a product when the data is free on the site AND free on GitHub is not credible — honest framing converts better.

Historical context preserved — see prior handoff below.

---

## Previous Handoff (2026-04-10 18:00)

**Mode:** god
**Objective:** monetization-v1 + wada-348-import — wire revenue rails AND ship the full Sanzo Wada catalog (operator-directed mid-session expansion)

**STATUS: BOTH SHIPPED. https://colorcombinations.org IS LIVE WITH 378 PALETTES + REVENUE RAILS.** ✓

### Progress

**Session 2026-04-10 (V2 — Wada 348 + monetization)** — complete ✓

Shipped in two atomic commits:

1. **acepilot: monetization-v1 — bundle + affiliate + /shop**
   - `src/config/monetization.ts` — central revenue config (BUNDLE, BOOKSHOP, AMAZON, PRINTS, ANALYTICS, FURTHER_READING). All gated behind `isLive` getters so production stays safe with placeholders.
   - `src/components/BundleCta.astro` — three variants (big/medium/compact), used on home/palette/about/shop.
   - `src/components/FurtherReading.astro` — affiliate book list, FTC disclosure, on /about and /shop.
   - `src/pages/shop.astro` — museum gift shop landing with bundle, prints rail, books, closing note.
   - `src/components/SiteHeader.astro` + `SiteFooter.astro` — Shop link added.
   - `src/layouts/BaseLayout.astro` — Plausible analytics tag (conditional on config), tagged-events script + outbound-link tracking.
   - `src/components/ExportPalette.astro` — `data-event="export_click"` + `data-format` on each button.
   - `scripts/build-bundle.mjs` — generates wada-bundle-v1.zip with Figma tokens, Tailwind v4/v3, CSS vars, SVG plates, JSON. 50K, 384 files.
   - `package.json` — `npm run bundle` script.

2. **acepilot: wada-348 — full dictionary import**
   - `scripts/wada-source/colors.json` — 60K dataset from `mattdesl/dictionary-of-colour-combinations` (MIT).
   - `scripts/generate-wada-palettes.mjs` — transforms 159 colors × 348 combinations into 348 Palette objects with auto-derived dominantHue/moods/tags. Run with `npm run generate:wada`.
   - `src/data/wada-palettes.ts` — 348 generated palette entries, slug `wada-NNN-firstname-secondname`.
   - `src/data/palettes.ts` — split into `curatedPalettes` (30 editorial) + `wadaPalettes` (348 historical) = 378 total. New helpers: `editorialPalettes()`, `wadaCatalog()`.
   - Hero copy reframed: "All 348 historical color combinations, free for working designers."
   - About page reframed: removed "inspired-by, not copied" stance, added explicit "What's actually here" section linking to source dataset.
   - Bundle upgraded: "The Complete Wada Bundle" at $12 (was $9), regular price anchor $29.
   - All 348 plates have static SEO pages with breadcrumbs, JSON-LD, swatch grids, exports, related palettes.

### Numbers

| Metric | Pre-session | Post-session |
|---|---|---|
| Total palettes | 30 | 378 |
| Static pages | 35 | 383 |
| dist size | 1.0M | 10M |
| Build time | 1.18s | 1.88s |
| Sitemap URLs | 34 | 382 |
| Bundle palettes | n/a | 378 |
| Bundle file count | n/a | 384 |
| Bundle zip size | n/a | ~50K |
| Live revenue surfaces | 0 | 4 (BundleCta × home/palette/about/shop, FurtherReading × about/shop, prints stub × shop, analytics events × everywhere) |

### Live URLs verified

- https://colorcombinations.org/ — 200, hero shows "All 348 historical color combinations"
- https://colorcombinations.org/shop/ — 200, museum gift shop landing
- https://colorcombinations.org/browse/ — 200
- https://colorcombinations.org/about/ — 200, FurtherReading library visible
- https://colorcombinations.org/palettes/wada-001-english-red-cerulian-blue/ — 200, plate 1 of 348
- https://colorcombinations.org/palettes/wada-174-corinthian-pink-grayish-lavender-b/ — 200, mid-catalog
- https://colorcombinations.org/palettes/wada-348-olive-buff-cossack-green/ — 200, plate 348 of 348
- https://colorcombinations.org/palettes/kurenai-kon/ — 200, curated editorial pick

Zero JavaScript console errors observed via Chrome MCP on home + shop + palette routes.

### Operator activation needed (revenue is gated until these run)

**Critical path to first $:**

1. **Gumroad** — sign up (free, 30 sec), upload `bundle-source/wada-bundle-v1.zip`, set price $12, copy product URL, paste into `BUNDLE.checkoutUrl` in `src/config/monetization.ts`, redeploy. **30-min activation, unblocks all primary revenue.**
2. **Bookshop.org affiliate** — sign up (free, instant), copy affiliate ID, paste into `BOOKSHOP.affiliateId` in monetization.ts, redeploy. **5-min activation, unblocks secondary revenue.**
3. **Plausible** — sign up at plausible.io ($9/mo), add `colorcombinations.org` site, paste domain into `ANALYTICS.plausibleDomain`, redeploy. **5-min activation, unblocks measurement (you can't optimize what you can't measure).**

Optional / V1.1:
4. **Amazon Associates** — sign up, get tag, paste into `AMAZON.tag`. Backup affiliate where Bookshop is missing a title.
5. **Printful** — set up store after first Gumroad sale validates demand, paste store URL into `PRINTS.storeUrl`.
6. **ConvertKit/MailerLite** — replace `https://forms.example.com/subscribe` in `EmailCapture.astro`.
7. **OG PNG** — generate 1200×630 in Figma/Canva, replace `og-default.svg` with `og-default.png` in `BaseLayout.astro`.

All steps documented in `[👤]` tasks in TASKS.md.

### How to redeploy after code changes

```sh
cd "path/to/ColorCombinations"
npm run build
wrangler pages deploy dist --project-name=colorcombinations --branch=main
```

### How to regenerate the bundle (after palette data changes)

```sh
cd "path/to/ColorCombinations"
npm run generate:wada    # only if updating Wada source data
npm run bundle           # builds bundle-source/wada-bundle-v1.zip
# Then re-upload the zip to Gumroad
```

### Momentum

**Very high.** Site is the most complete public Wada catalog with editorial overlay + export rails + monetization stack. The brand promise is now real ("The Dictionary of Color Combinations" actually IS a dictionary of 378 combinations). Next 90 days are all about traffic acquisition (Show HN, r/web_design, Twitter launch thread) and revenue activation (3 placeholder URLs to paste).

### Open questions

- Email provider: ConvertKit, MailerLite, Buttondown, or Loops?
- Should the 348 Wada plates eventually get cross-referenced Japanese shikisai names (V1.1+)?
- Print product set: per-plate posters, era-grouped sets, or thematic series?

### Research archive

Prior session artifacts in `domain-research/` (legacy from research session):
- `REPORT.md` / `REPORT-V2.md` / `TOP100-AVAILABLE.md` — domain analysis
- `available-merged-all.txt` — 1,077 verified available domains
- `generate*.mjs`, `check*.sh` — the tooling

Wada source data:
- `scripts/wada-source/colors.json` — 60K, 159 colors × 348 combinations from `mattdesl/dictionary-of-colour-combinations` (MIT)
- Original book: Wada, Sanzo. *A Dictionary of Color Combinations*. 1933 (six volumes)
- Modern reprint: Seigensha Art Publishing, 2010 (recommended on /about for purchase)
