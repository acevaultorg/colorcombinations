# GROWTH — ColorCombinations

State file for the Growth Engine. Read on creation directives and `god --launch`.

## Positioning

**Product:** The Dictionary of Color Combinations
**Target users:** Designers (primary), developers, artists, brand agencies
**Wedge:** The complete Wada 1933 catalog (348 plates) + 30 editorial deep-dives — historically grounded, free to browse, exportable in five formats. The other tribute sites stop at displaying the catalog; we add the editorial layer + the export rails + the bundle.
**Cost to use:** Free (browse, copy, export). Optional $12 bundle for the "I want it all in one download" workflow.

## Channels

| Channel | Status | Why | Owner |
|---|---|---|---|
| Organic SEO (EMD + per-palette pages) | 🟢 ready | 30 indexable landing pages, JSON-LD, sitemap | [automated] |
| Hacker News (Show HN) | 🔴 pending | Heritage angle + free tool — strong HN fit | [👤 human] |
| Designer communities (r/Design, r/web_design) | 🔴 pending | Visual content + niche reference | [👤 human] |
| Twitter / Threads / Mastodon | 🔴 pending | Palette-per-day content loop | [👤 human] |
| Newsletter (weekly palette) | 🔴 not wired | EmailCapture component ready, needs provider | [👤 human] |
| Print-on-demand affiliate | 🔴 deferred V2 | Printful/Gelato for palette posters | [deferred] |
| Pinterest | 🔴 deferred V2 | Each palette is a pinnable image | [deferred] |
| Guest posts on design blogs | 🔴 pending | Smashing, CSS-Tricks, Css Weekly | [👤 human] |

## Funnel (target)

```
Organic search
  ↓
Landing on a palette page (/palettes/[slug])
  ↓
Browse 2-3 more (related palettes, browse page)
  ↓
Export action (copy hex / Tailwind / CSS vars / JSON)
  ↓
Email signup (weekly palette newsletter)
  ↓
[Y2] Pro subscription OR print affiliate click
```

## V1 launch sequence (when domain is live)

1. **Technical**: buy `colorcombinations.org`, deploy to Vercel, verify SSL, submit sitemap to Google Search Console + Bing Webmaster
2. **Content**: write 1 launch blog post "Why I built a color dictionary in 2026" + 3 pillar articles (Wada biography, Japanese color theory, how to use historical palettes)
3. **Seeding**: Post Show HN with "Free: 30 curated color combinations from Sanzo Wada's 1933 dictionary tradition"
4. **Communities**: r/web_design, r/graphic_design, r/Design (1 per week, not all at once — mod rules)
5. **Newsletter**: Soft launch via personal contacts, promise 1 palette per week
6. **Measurement**: Plausible analytics, track RPU, bounce, export clicks, newsletter conversion

## Primary KPI

**Revenue Per Unique Visitor (RPU)** — per `REVENUE_MODEL.md`.

V1 baseline target (months 1-3):
- 500 uniques/mo from organic + seeding
- 10% export rate
- 3% newsletter signup rate
- Revenue: ~$0 (foundation, no monetization wired yet)

V1 goal (months 4-12):
- 5,000 uniques/mo from organic SEO maturity
- 15% export rate
- 5% newsletter signup rate
- $50-100/mo from affiliate + early Pro tier beta

Full revenue projections in DECISIONS.md 2026-04-08 (Y1 €4.5k-€15k, Y3 MRR €3.5k-€8k with Config X).

## Content engine (post-launch)

- Weekly: 1 new palette added + 1 newsletter issue
- Monthly: 1 pillar blog post (color theory / Japanese color history / palette usage)
- Quarterly: retrospective on usage patterns, republish top palettes with case studies
- As available: source full Wada 348 catalog, import in batches

## Viral loops

- **Export embed**: when exporting, include optional `/* colorcombinations.org/p/slug */` comment in the Tailwind/CSS output
- **OG image per palette**: every detail page shares its own colors in the preview (currently SVG default, PNG per-palette as a V2 task)
- **Share button**: add `navigator.share()` to palette-detail in V2
- **Iteration**: track which palettes get the most exports and promote them in newsletter

## Ship Log

_Growth-relevant ships from this session:_

- 2026-04-10: V1 static site built. 30 palettes, 34 pages, clean build. Deploy pending domain purchase.
- 2026-04-10: V1 SHIPPED to colorcombinations.org via Cloudflare Pages. All 11 routes 200, security headers applied at edge.
- 2026-04-10: Monetization V1 — `/shop` landing, BundleCta integrated on home/palette/about, FurtherReading affiliate on /about, Plausible event hooks wired, footer + header Shop link added. All revenue surfaces production-safe behind `isLive` getters until operator pastes real Gumroad/Bookshop/Plausible IDs.
- 2026-04-10: **WADA 348 IMPORTED.** Full Sanzo Wada 1933 catalog (348 historical combinations) now lives at /palettes/wada-NNN-*. Total archive: 378 palettes (30 editorial + 348 historical). Hero copy reframed around "complete dictionary." Bundle upgraded to "The Complete Wada Bundle" at $12 (was $9 for 30). Build: 383 pages, 1.88s, 10M dist. Source: mattdesl/dictionary-of-colour-combinations (MIT).
- 2026-04-24: **+6 SEO COLLECTIONS** (japandi, kitchen, bedroom, y2k, forest, maximalist). Targets high-volume commercial-intent designer queries at the intersection of the existing 378-plate catalog. Total collections 54→60. Build: 1042 pages, 2.52s, 0 errors. Archetype: `programmatic_page_with_unique_data × +55 + SEO_page_addition × +50`. Oracle projection: +12-36 visitors/wk cumulative, $0.30-1.20/wk post-affiliate-activation. @craftsman PASS (mean 0.70). @distributor PASS (mean 0.62). Replays proven 54-collection playbook.
- 2026-04-24: **EMBEDDABLE COLLECTION WIDGETS.** Per-collection iframe embed at /embed/collection/[slug] (560×320, 6 palette strips) + "Embed this collection" section on all 60 collection detail pages with copy-code button + live preview. Collections are higher-intent embed targets than single palettes — blog posts about "japandi color palette" will embed the collection gallery, each placement = permanent discovery channel for colorcombinations.org. Also: sitemap filter added to exclude /embed/* (removes 438 noindex URL leaks from sitemap). Build: 1102 pages, 3.84s, 0 errors. Archetype: `embeddable_widget × +80`. @craftsman PASS (mean 0.74). @distributor PASS strong (mean 0.76).

- 2026-04-24/25 (endless-loop session, 32 ships): SHIPPED IN ATOMIC PRs:
  - `/embed/*` X-Frame-Options + CSP fix — Chrome MCP-caught silent breakage; both palette and collection embeds were 200 but iframe-blocked. Two-commit fix (`! X-Frame-Options` then `! Content-Security-Policy` to unset inherited CSP before override). Without this fix every embed widget was unusable on third-party sites.
  - **Complete API surface (648 JSON endpoints):** /api/palettes/[slug].json (378), /api/collections/[slug].json (60), /api/colors/[slug].json (210). Versioned schemas (`colorcombinations-{palette,collection,color}/v1`), CORS, CC-BY-4.0, deep-link urls{canonical,embed,openGraph,api} per record. BaseLayout jsonAlternate prop emits `<link rel="alternate" type="application/json">` so LLM crawlers discover the data graph without scraping.
  - **Complete OG matrix (673 SVGs):** /og/[slug] palette OGs (already shipped) + /og/collections/[slug].svg (60 new) + /og/colors/[slug].svg (210 new) + /og/hue/[hue].svg (9 new) + 7 hand-crafted index OGs (/og/{index,collections,tools,browse,colors,shop,data}.svg). Every shareable URL on the site now serves a branded preview.
  - **Complete embed surface (648 iframe routes):** /embed/[slug] (existed) + /embed/collection/[slug] (60) + /embed/colors/[slug] (210). Three differently-sized cards optimized for different blog contexts (320×80 / 560×320 / 360×180).
  - Pinterest Article rich-pin meta + og:image dimensions on all 648 detail pages: og:type=article, article:published_time/modified_time/author/section, og:image:width/height/alt — Pinterest reads these for Article rich pins.
  - ShareActions component (Copy/Pinterest/X-Twitter) on collection + color detail pages, mirroring palette ShareBar.
  - Site-wide Organization JSON-LD with stable @id, knowsAbout topical entities, sameAs (GitHub), ContactPoint. WebSite schema gains SearchAction (sitelinks-search-box). Aleyda Solis #3 Recognizable.
  - Person schema for Sanzo Wada on /about with sameAs (Wikipedia + Wikidata Q1407928), Academy Award metadata, AboutPage cross-link to Organization. Aleyda #7 Credible — entity disambiguation for LLMs.
  - Freshness signals (datePublished/dateModified/license/publisher/isBasedOn-Wada-Book) on all 648 detail-page JSON-LD. Aleyda #9 Fresh + Google QDF.
  - 3 CSV bulk downloads (palettes 378 / colors 210 / collections 60) at /data/*.csv — RFC 4180, CORS, CC-BY-4.0. Wikipedia citation + LLM training pipeline ingestible without HTML scraping.
  - /data hub landing page with Schema.org DataCatalog + 3 nested Dataset entries — Knowledge-Graph-eligible as a data catalog.
  - /data wired into footer + /tools index card + stale "two tools" copy fixed.
  - Updated /llms.txt with full surface map (JSON API + Embed widgets + CSV downloads + 64-then-69 collection taxonomy).
  - SEO collections batch 2 (4): modernist, hygge, wabi-sabi, biophilic.
  - SEO collections batch 3 (5): gothic, art-nouveau, victorian, vaporwave, coquette.
  - Total collections 54 → 69.
  - **First /learn/ pillar article:** /learn/japandi-color-theory/ — ~720 words, 4 H2 sections, 17 internal links to relevant collections/palettes/colors/tools, full Article schema with isBasedOn Wada Book + author Organization + datePublished/Modified. Establishes /learn/ section for future pillars.

  Build: 603 → 1332 pages (+729). All 32 ships verified live + Chrome MCP visual verification on each user-facing surface. PRs #4 through #37 all squash-merged to main. Wrangler deploys all green (one EPIPE retry on PR #17 per known rules/cloudflare-pages-epipe.md).

  Specialist passes (self-review, archetype-aware):
  - @craftsman Love avg ~0.72 across all public ships, no 🔴 blocks
  - @distributor Fit avg ~0.69, archetypes verified per ship
  - Zero I-23 / I-26 violations
  - Zero dark-pattern incidents

  Archetype distribution: 23 ships with `dataset_json_api × +70` / `embeddable_widget × +80` / `programmatic_page_with_unique_data × +55` / `share_by_design_result × +95` / `original_research_with_dataset × +90` (the pillar). Heavy compound on autonomous-distribution archetypes.
