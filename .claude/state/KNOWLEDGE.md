# KNOWLEDGE — ColorCombinations

## Project type
- **Archetype:** Content SEO + digital product (Wada bundle) + book affiliate <!-- verified: 2026-04-10 -->
- **Stack:** Astro 5, Tailwind CSS v4, TypeScript (strict), MDX, Cloudflare Pages <!-- verified: 2026-04-10 -->
- **Data source:** 378 palettes total — 30 hand-written editorial (`curatedPalettes`) + 348 Wada historical plates (`wadaPalettes`, auto-generated from `mattdesl/dictionary-of-colour-combinations`) <!-- verified: 2026-04-10 -->

## Monetization stack (V1.1 — reality-check rails, live gated)
**Priority reordered 2026-04-11 after honest-math pass. See DECISIONS.md 2026-04-11.**

- **Primary:** `BOOKSHOP` (10% affiliate, 30-day cookie) + `AMAZON` (4% fallback) in `src/config/monetization.ts`. Five curated books rendered via `FurtherReading.astro` with **book cover images** from Open Library CDN (ISBN or `olCoverId` lookup, `?default=false` to force 404 on miss). Appears on: /about (full list), /shop (library section, hero position), /palettes/[slug] (sidebar with deterministic rotation via slug-hash offset → 378 pages × unique book per page). <!-- verified: 2026-04-11 -->
- **Secondary:** `DESIGN_TOOLS` in monetization config — `DesignTools.astro` on /shop. Framer affiliate slot (~$25 recurring), Figma (no affiliate), Coolors (no affiliate). Higher commission ceiling than books. <!-- verified: 2026-04-11 -->
- **Tertiary (waitlist):** `PRINTS` stub on /shop — join-waitlist CTA until Society6/Printful activation. Validates demand before POD commitment. <!-- verified: 2026-04-11 -->
- **Support (tip jar):** `BUNDLE` repositioned from "product" to PWYW tip jar. Gumroad, $3 min, $5 suggested. "Support the archive" copy. Bundle still built via `npm run bundle` → 384 files, 50K zip. Reframed as thank-you deliverable, not primary revenue. <!-- verified: 2026-04-11 -->
- **V1.5 (traffic-gated, not active):** `CARBON_ADS` config stub. Requires ~20k monthly visits to qualify. Do NOT apply until traffic threshold met. Only ad network compatible with museum identity. <!-- verified: 2026-04-11 -->
- **Analytics:** `ANALYTICS.plausibleDomain` — Plausible tagged-events script in BaseLayout, conditional. Event hooks: `bookshop_click`, `amazon_click`, `tool_affiliate_click`, `tool_click`, `bundle_cta_click`, `export_click`, `prints_cta_click`, `prints_waitlist_click`. <!-- verified: 2026-04-11 -->
- **Activation:** all live-gated behind `isLive` getters — production safe with placeholders. Operator pastes real values, redeploys, revenue active. <!-- verified: 2026-04-11 -->

## Realistic revenue ceiling (by traffic)

Based on 2026-04-11 honest-math pass (see DECISIONS.md):
- **5k pv/mo (V1 launch):** $10-30/mo total — NO rail makes real money. Focus on traffic, not tuning.
- **20k pv/mo (3-month target):** $50-150/mo — affiliate rails start paying; Carbon Ads qualifies.
- **50k pv/mo (stretch):** $300-700/mo — affiliate + Carbon compound; prints launch feasible.
- **250k pv/mo (big success):** $2k-5k/mo — Mediavine tier but destroys brand; keep Carbon.

**First 90 days = growth investment, not monetization tuning.** <!-- verified: 2026-04-11 -->

## Site structure
- **/** homepage — hero ("All 348 historical color combinations"), 8 featured editorial picks, how-it-works, BundleCta medium, EmailCapture. <!-- verified: 2026-04-10 -->
- **/colors** — color dictionary index with hue-family pill filters (red, orange, yellow, brown, pink, green, blue, purple, neutral). 211 unique named colors from 378 palettes. Swatch grid with square tiles, name, nameJa, hex, palette count. <!-- verified: 2026-04-12 -->
- **/colors/[slug]** — 159+ individual color detail pages. Hero swatch + hex + nameJa + meaning. Sidebar: hex/RGB/hue specs, WCAG contrast on white/black, quick-copy buttons (hex/RGB/CSS var). Main: palette grid of all palettes containing this color + FurtherReading sidebar (rotating book). JSON-LD CreativeWork + BreadcrumbList. <!-- verified: 2026-04-12 -->
- **/feed.xml** — RSS 2.0 feed with 30 editorial palettes. Atom self-link, content:encoded with swatch HTML previews. Auto-discovery `<link>` in BaseLayout `<head>`. <!-- verified: 2026-04-12 -->
- **/browse** — client-side filter over all 378 palettes with color-count pill filter (2/3/4 colors). <!-- verified: 2026-04-11 -->
- **/collections** — index of 8 themed collection cards (websites, branding, autumn, spring, minimalist, indigo, bold, heian). Each card shows 4 palette previews + count + tagline. <!-- verified: 2026-04-11 -->
- **/collections/[slug]** — 8 detail pages. Each has: breadcrumb → accent-square hero → long-form description → full palette grid (up to 24 palettes) → "Other collections" cross-link section → BundleCta medium. Full JSON-LD CollectionPage + BreadcrumbList. <!-- verified: 2026-04-11 -->
- **/palettes/[slug]** — 378 static detail pages. Sidebar order: ExportPalette → Details → ContrastMatrix (WCAG pairs) → ShareBar (copy/Twitter/Pinterest) → FurtherReading sidebar (rotating book). Body: hero → swatch grid → prose → "Featured in" collection chips → BundleCta compact → related. Each page has a per-palette OG image at `/og/[slug].svg`. <!-- verified: 2026-04-11 -->
- **/about** — mission, Wada biography, "What's actually here", FurtherReading library, BundleCta medium. <!-- verified: 2026-04-11 -->
- **/shop** — museum gift shop: hero → FurtherReading (books, covers) → DesignTools → Prints rail → BundleCta big → closing note. <!-- verified: 2026-04-11 -->
- **/og/[slug].svg** — 378 static OG images, one per palette, generated via Astro endpoint at build time. Modern platforms (Twitter, LinkedIn, Discord, Slack, Mastodon, Bluesky) render SVG OG; FB is the holdout. Cache-Control: immutable. <!-- verified: 2026-04-11 -->
- **/404** — noIndex error page with 3 suggested palettes. <!-- verified: 2026-04-10 -->
- **Build output:** 603 HTML pages + 378 OG SVGs, ~23M dist, ~2.73s build time. <!-- verified: 2026-04-12 -->

## Collections taxonomy (`src/data/collections.ts`)

- **Eight collections** shipped 2026-04-11: websites, branding, autumn, spring, minimalist, indigo, bold, heian.
- **Resolution pattern:** `paletteSetForCollection(collection)` returns curatedSlugs first (editorial order), then appends matched plates from the full archive via `collection.match()`. Deduped against curatedSlugs. Capped at `limit` (default 24).
- **Reverse lookup:** `collectionsForPalette(palette)` returns all collections that include a given palette. Used by the palette detail page to render the "Featured in" chip row.
- **Counts:** Websites 24, Branding 24, Autumn 24, Spring 7, Minimalist 24, Indigo 23, Bold 24, Heian 9. Narrow-filter collections (Spring, Heian) intentionally don't hit the 24-cap — those are high-quality curated shortlists. <!-- verified: 2026-04-11 -->

## Key competitors
- **Coolors.co** — palette generator, Pro tier ~$5/mo, large user base, generic <!-- verified: 2026-04-08 -->
- **Color Hunt** — curated public palettes, ad-supported, simple <!-- verified: 2026-04-08 -->
- **Adobe Color** — free tool, part of Creative Cloud ecosystem <!-- verified: 2026-04-08 -->
- **Happy Hues** — curated palettes with usage examples, free <!-- verified: 2026-04-08 -->
- **sanzo-wada.dmbk.io** — existing Wada tribute site, outdated design, not monetized, weak SEO <!-- verified: 2026-04-08 -->

## Revenue model (per GROWTH_ANALYTICS.md schema)
- **Model:** hybrid (affiliate + subscription + one-time merch)
- **Primary KPI:** RPU (revenue per unique visitor)
- **Currency:** USD
- **Attribution:** organic/SEO initially, email-drip follow-up

## Traditional Japanese color reference
These are PUBLIC DOMAIN cultural knowledge (centuries old), safe to use:

**Reds / Oranges:**
- 紅 Kurenai — deep crimson, safflower dye
- 茜 Akane — madder red, ancient dye
- 朱 Shu — vermillion, used in shrines
- 丹 Ni — orange-red, cinnabar
- 橙 Daidai — bitter orange
- 緋 Hi — scarlet
- 鉛丹 Entan — red lead

**Yellows / Golds:**
- 黄 Ki — yellow
- 山吹 Yamabuki — golden yellow (kerria flower)
- 鬱金 Ukon — turmeric yellow
- 女郎花 Ominaeshi — yellow flower
- 刈安 Kariyasu — grass yellow
- 黄土 Ōdo — ochre

**Greens:**
- 萌黄 Moegi — spring green, young bamboo
- 若竹 Wakatake — young bamboo green
- 松葉 Matsuba — pine needle dark green
- 常磐 Tokiwa — evergreen
- 青磁 Seiji — celadon
- 深緑 Fukamidori — deep green

**Blues:**
- 青 Ao — blue (historically broad, includes green-blue)
- 瑠璃 Ruri — lapis lazuli
- 群青 Gunjō — ultramarine
- 露草 Tsuyukusa — dayflower blue
- 紺 Kon — navy blue
- 縹 Hanada — indigo blue
- 藍 Ai — indigo
- 浅葱 Asagi — pale blue-green
- 空 Sora — sky blue

**Purples / Violets:**
- 菫 Sumire — violet
- 紫 Murasaki — royal purple
- 桔梗 Kikyo — bellflower purple
- 江戸紫 Edo-murasaki — Edo purple (cool-toned)
- 京紫 Kyō-murasaki — Kyoto purple (warm-toned)

**Browns / Earth:**
- 茶 Cha — brown/tea
- 鳶 Tobi — kite brown
- 煉瓦 Renga — brick red
- 柿 Kaki — persimmon
- 焦茶 Kogecha — burnt brown

**Pinks / Light:**
- 桜 Sakura — cherry blossom pink
- 撫子 Nadeshiko — pink flower
- 薄紅 Usubeni — light red/pink

**Greys / Neutrals:**
- 鼠 Nezumi — mouse grey
- 利休 Rikyū — Rikyū grey (tea master's restrained tone)
- 銀 Gin — silver grey
- 墨 Sumi — ink black
- 胡粉 Gofun — chalk white

## Historical eras to tag palettes
- **Heian** (794-1185) — imperial court colors, refined
- **Kamakura** (1185-1333) — warrior aesthetic
- **Muromachi** (1336-1573) — zen, tea ceremony influence
- **Edo** (1603-1868) — merchant class, ukiyo-e, printed patterns
- **Meiji** (1868-1912) — modernization, Western influence mixed
- **Taisho** (1912-1926) — Western-Japanese fusion
- **Showa** (1926-1989) — Wada's era (1933 book)

## Deploy target
- **Platform:** Cloudflare Pages <!-- verified: 2026-04-10 --> (pivoted from Vercel after operator purchased domain via Cloudflare Registrar — single-dashboard ecosystem simplifies DNS)
- **Registrar:** Cloudflare (colorcombinations.org bought 2026-04-10)
- **Project name:** `colorcombinations` (in acevaultorg Team plan account)
- **Pages hostname:** `colorcombinations.pages.dev`
- **Custom domain:** `colorcombinations.org` ✓ LIVE (SSL auto-provisioned, CNAME @ → colorcombinations.pages.dev)
- **Repo:** https://github.com/acevaultorg/colorcombinations (public)
- **Deploy command:** `wrangler pages deploy dist --project-name=colorcombinations --branch=main` (Git integration exists on acevaultorg but CLI deploy is proven-working path for this project)
- **Build:** `npm run build` (Astro default)
- **Output:** `./dist/`
- **Node version:** 20 (Cloudflare Pages default; Astro 5 requires ≥18.17)
- **Security headers:** `public/_headers` — OWASP baseline CSP, X-Frame-Options, Permissions-Policy — verified at edge
- **Redirects:** `public/_redirects` — empty for V1
- **Trailing slash:** `always` (matches CF Pages directory serving, zero redirect hops) <!-- verified: 2026-04-10 -->
- **Previous plan:** Vercel (locked in DECISIONS.md 2026-04-08) — pivoted because registrar colocation eliminates DNS cross-config

## Error patterns
<!-- Empty — new project -->

## Orient snapshot
ColorCombinations is a content + commerce-lite website built as a modern, monetized reinterpretation of Sanzo Wada's 1933 Dictionary of Color Combinations. Target users: designers, developers, artists, brand agencies. Revenue: print affiliate + Pro subscription + design-tool affiliate. Tech: Astro SSG for max SEO + minimal JS.
