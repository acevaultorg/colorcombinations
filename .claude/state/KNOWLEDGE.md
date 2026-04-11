# KNOWLEDGE — ColorCombinations

## Project type
- **Archetype:** Content SEO + digital product (Wada bundle) + book affiliate <!-- verified: 2026-04-10 -->
- **Stack:** Astro 5, Tailwind CSS v4, TypeScript (strict), MDX, Cloudflare Pages <!-- verified: 2026-04-10 -->
- **Data source:** 378 palettes total — 30 hand-written editorial (`curatedPalettes`) + 348 Wada historical plates (`wadaPalettes`, auto-generated from `mattdesl/dictionary-of-colour-combinations`) <!-- verified: 2026-04-10 -->

## Monetization stack (V1 live, awaiting operator activation)
- **Primary:** `BUNDLE` in `src/config/monetization.ts` — Gumroad digital product "The Complete Wada Bundle" at $12 (regular $29). Bundle built via `npm run bundle` → `bundle-source/wada-bundle-v1.zip` (50K, 384 files: 5 format files + 378 SVG plates + README + figma-tokens.json + palettes.json). <!-- verified: 2026-04-10 -->
- **Secondary:** `BOOKSHOP` (10% affiliate) + `AMAZON` (4% fallback) in monetization config. Five curated books rendered via `FurtherReading.astro` on /about and /shop with FTC disclosure. <!-- verified: 2026-04-10 -->
- **Tertiary:** `PRINTS` stub on /shop — waitlist CTA until operator sets up Printful post-first-Gumroad-sale. <!-- verified: 2026-04-10 -->
- **Analytics:** `ANALYTICS.plausibleDomain` in config. Plausible tagged-events script loads conditionally in BaseLayout. Event hooks already wired on: `.btn[data-event]`, `[data-copy]` (export buttons), `.further-reading__link`, `.further-reading__amazon`. <!-- verified: 2026-04-10 -->
- **Activation:** all live-gated behind `isLive` getters — production safe even when placeholders are in place. Operator pastes real values, redeploys, revenue active. <!-- verified: 2026-04-10 -->

## Site structure
- **/** homepage — hero ("All 348 historical color combinations"), 8 featured editorial picks, how-it-works, BundleCta medium, EmailCapture. <!-- verified: 2026-04-10 -->
- **/browse** — client-side filter over all 378 palettes. <!-- verified: 2026-04-10 -->
- **/palettes/[slug]** — 378 static detail pages (30 curated + 348 `wada-NNN-*`). Each has: breadcrumb → hero → swatch grid → body prose → ExportPalette → details plate → BundleCta compact → related palettes. <!-- verified: 2026-04-10 -->
- **/about** — mission, Wada biography, "What's actually here" (explaining both collections), FurtherReading library, BundleCta medium. <!-- verified: 2026-04-10 -->
- **/shop** — museum gift shop: shop hero → BundleCta big → Prints rail → FurtherReading → closing note. <!-- verified: 2026-04-10 -->
- **/404** — noIndex error page with 3 suggested palettes. <!-- verified: 2026-04-10 -->
- **Build output:** 383 pages, ~10M dist, ~1.9s build time. <!-- verified: 2026-04-10 -->

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
