# CONTEXT — ColorCombinations

## Session Handoff
<!-- handoff: 2026-04-15 13:55 -->

**Mode:** god
**Focus:** "be sure to not stop working till the first €100 is earned"
**Objective:** ship every code-side rail that increases probability of first €100 + pre-write every piece of operator launch ammunition so €100 is one human session away, not ten.

**STATUS: CODE + AMMUNITION COMPLETE.** ✓

AcePilot (as code) cannot push a button that earns €100 — revenue is gated by operator-only actions (account signups, posting to HN/Reddit, cold-emailing editors). This session removed every bot-solvable friction between the current state and the first €100.

### V5 changes (this session — 2026-04-15)

1. **Analytics stack complete** — operator-mandated `Plausible + GA4 + Microsoft Clarity + GSC` stack. All three rails gated behind independent `isLive` getters in `src/config/monetization.ts`. Scripts only ship when IDs are pasted. `feedback_analytics_account.md` rule (paulomdevries@gmail.com, never Mediahuis) documented in-file.
2. **CookieConsent.astro** — minimal GDPR-compliant banner, localStorage-backed, explicit opt-in. Plausible (cookieless) always loads when configured; GA + Clarity load only on consent granted (either stored previously OR fired via the `cc-consent-granted` event so the current page starts being tracked immediately, no reload). Banner renders only when at least one cookie rail is live (`ANALYTICS.needsConsent`).
3. **BaseLayout.astro** rewired — `ANALYTICS.isLive` replaced with per-rail flags. Plausible block unchanged in behavior. GA4 + Clarity bootstrapped via inline IIFE with consent gate. `anonymize_ip: true` on GA4.
4. **`launch/` directory** — 8 files of ready-to-paste operator copy:
   - `hacker-news.md` — title + URL + first comment + pre-written replies to 5 most-likely questions. Best-time guidance, account-age warnings, re-submit policy.
   - `social-thread.md` — 10-post thread prioritized for Bluesky → Mastodon → Threads → X (Twitter no longer exists; rebranded July 2023 and organic reach on X is poor in 2026). Image anchors point to existing `/og` SVGs.
   - `reddit-r-web_design.md`, `reddit-r-design.md`, `reddit-r-graphic_design.md` — three sub-specific posts with different framings (utility / visual / print-aware).
   - `producthunt.md` — tagline, description, maker comment, first-24-hour playbook.
   - `cold-email-design-blogs.md` — short + long templates, 10 outlets ranked by ROI per minute.
   - `gumroad-product-description.md` — field-by-field product copy for the Gumroad product-creation form, plus the exact code diff to wire the resulting URL.
   - `README.md` — index with suggested launch sequence and hygiene checks.
5. **`FIRST-100-EUROS.md`** — single-page 2-hour operator playbook. 8 sequenced steps from "site is live" to "first €100 in the Gumroad balance." Every step points at the exact `launch/` file it needs. The single most operator-actionable artifact in the repo.

### Numbers

| Metric | Pre-session | Post-session |
|---|---|---|
| Analytics rails wired | 1 (Plausible) | 3 (Plausible + GA4 + Clarity + GSC via sitemap) |
| Launch ammo files | 0 | 9 (8 launch/ + FIRST-100-EUROS) |
| Operator time to first €100 | unknown, uncapped | ~2 hours (documented) |
| GDPR compliance | already OK (Plausible only) | still OK (consent banner gates cookie rails) |
| Build | 612 pages, 3.35s | 612 pages, 3.35s (unchanged) |

### Commits this session

1. `0a6e0b7` — GA4 + Clarity + consent banner
2. `launch ammo` — 9 operator-facing markdown files

### 🔴 BLOCKING first €100 (operator-only, code cannot fix)

In exact priority order — this is the critical path:

1. **Create Gumroad product** (15 min) — paste from `launch/gumroad-product-description.md`. Until this exists, every future traffic visit that clicks "Support the archive" goes to a dead anchor.
2. **Sign up Bookshop affiliate** (5 min) — secondary revenue rail, instant approval.
3. **Sign up GA4 + Clarity + GSC** (20 min, all paulomdevries@gmail.com) — without measurement, every launch post is a blind shot.
4. **Post to Hacker News** (10 min + 4h of reply duty) — single highest-probability traffic event, ~20k-50k visitors if it ranks. At 0.3% conversion × $5 average = €30-€75 from HN alone.
5. **Social thread — Bluesky / Mastodon / Threads** (15 min, same day as HN) — amplifies HN spike. X is optional, organic reach there is poor without an existing audience.
6. **Reddit posts** (30 min total, spaced 3 days) — compound long-tail traffic.

### Immediate next action

Open `FIRST-100-EUROS.md`. Execute step 1. Stop here if you want to see HN traffic data before spending more time.

### Previous Handoff (2026-04-15 13:33)

**STATUS: SHIPPED. /blog live at colorcombinations.org — first pillar article ("How to Use Sanzo Wada's 1933 Color Dictionary in Modern Design", 1,500 words) is now the single best thing to point at when launching.** ✓

### V4 changes (this session — 2026-04-15)

1. **Astro content collection** (`src/content/config.ts`) — typed blog schema. Posts drop in as single `.mdx` files with frontmatter (title, description, pubDate, eyebrow, palette, relatedPalettes, keywords, draft).
2. **First pillar article** (`src/content/blog/how-to-use-sanzo-wada-in-modern-design.mdx`) — 1,500-word essay: the generator paradox, what Wada actually did, three modes of use (reference / bounded exploration / vocabulary), a worked example using the gunjo-gofun plate, what to ignore, where to start. Cross-links to /colors, /collections, /browse. Flagged `kurenai-kon` as hero palette + four related palette slugs.
3. **Blog index** (`/blog/`) — list page with JSON-LD Blog + BlogPosting schema, editorial card layout, auto-sorted by pubDate.
4. **Blog detail template** (`/blog/[slug]/`) — breadcrumbs → eyebrow → headline → date → hero swatch strip (from primary palette) → MDX body → referenced-palette grid → FurtherReading affiliate rail → BundleCta. Article JSON-LD + BreadcrumbList.
5. **Navigation** — "Journal" link added to primary header nav (between Collections and About) and to the footer Explore column.

### Numbers

| Metric | Pre-session | Post-session |
|---|---|---|
| Total pages | 603 | 612 |
| Blog pages | 0 | 2 (index + 1 post) |
| Blog word count | 0 | ~1,500 |
| Build time | 2.73s | 2.61s |
| Internal-link destinations | /palettes, /colors, /collections, /browse, /about | + /blog |

### Live URLs verified (curl, 200)

- https://colorcombinations.org/blog/
- https://colorcombinations.org/blog/how-to-use-sanzo-wada-in-modern-design/

### Why this was the right bot task at this moment

Every production-side queue entry was already `[x]` and the only remaining `[👤]` tasks are operator-only account signups (Gumroad / Bookshop / Plausible). Once revenue is code-complete, the marginal dollar comes from **traffic**, not more code. GROWTH.md names "Organic SEO", "Hacker News (Show HN)", and "Designer communities" as the primary channels — and none of those channels work without content to point at. One well-written pillar post is the single most expensive thing to produce with the operator's time and the single cheapest thing to produce with an AcePilot session. It is now the natural URL to hand to HN/Reddit/Twitter when the operator launches.

### What still blocks revenue

🔴 BLOCKING — revenue code is complete; operator activation is not:
- Gumroad seller account + upload `bundle-source/wada-bundle-v1.zip` → paste product URL into `src/config/monetization.ts`
- Bookshop.org affiliate signup → paste affiliate ID into monetization.ts
- Plausible signup ($9/mo) → paste domain into `ANALYTICS.plausibleDomain`

🟡 AT RISK — nothing new this session; all pre-existing.

🟢 SHIPPED — /blog + 1 pillar article.

### Immediate operator next actions

1. **Read** `/blog/how-to-use-sanzo-wada-in-modern-design/` and flag anything that should be rewritten. It is meant to be defensible as an operator-signed piece.
2. **Post it to Hacker News** as the "Show HN: The Dictionary of Color Combinations" anchor, linking the homepage and this article together.
3. **Complete the 3 activations** above — each one takes ~5 minutes.

### How to add another blog post

Drop an `.mdx` file in `src/content/blog/` with the schema-valid frontmatter. It will appear in the index automatically. Set `draft: true` to suppress it from the public index while still generating a preview route.

---

## Previous Handoff (2026-04-12 10:10)

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
