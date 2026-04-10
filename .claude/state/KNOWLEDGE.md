# KNOWLEDGE — ColorCombinations

## Project type
- **Archetype:** Content SEO + commerce-lite (print affiliate + Pro subscription) <!-- verified: 2026-04-08 -->
- **Stack:** Astro 5, Tailwind CSS v4, TypeScript (strict), MDX, Vercel <!-- verified: 2026-04-08 -->
- **Data source:** Curated Wada-tradition palettes (V1), full Wada 348 dataset (V2) <!-- verified: 2026-04-08 -->

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
- **Deploy command:** `git push` to GitHub, Cloudflare Pages auto-deploys from branch
- **Build:** `npm run build` (Astro default)
- **Output:** `./dist/`
- **Node version:** 20 (Cloudflare Pages default; Astro 5 requires ≥18.17)
- **Security headers:** `public/_headers` — OWASP baseline CSP, X-Frame-Options, Permissions-Policy
- **Redirects:** `public/_redirects` — empty for V1
- **Previous plan:** Vercel (locked in DECISIONS.md 2026-04-08) — pivoted because registrar colocation eliminates DNS cross-config

## Error patterns
<!-- Empty — new project -->

## Orient snapshot
ColorCombinations is a content + commerce-lite website built as a modern, monetized reinterpretation of Sanzo Wada's 1933 Dictionary of Color Combinations. Target users: designers, developers, artists, brand agencies. Revenue: print affiliate + Pro subscription + design-tool affiliate. Tech: Astro SSG for max SEO + minimal JS.
