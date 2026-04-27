# DISTRIBUTION.md — ColorCombinations

**Distribution Oracle v1** · per-task Δ weekly-organic-traffic projections + @distributor Fit log. Append-only (I-24, I-25, I-26).

## Header

- Project: ColorCombinations
- Organic baseline: unknown (Plausible placeholder — no GSC data yet)
- Domain Authority (cold): ~5 (new domain, launching)
- Confidence on cold-start multipliers: 0.3

## Calibration

2026-04-19 09:20 | task:shop-wada-vol2 | archetype:affiliate_inventory_expansion + editorial_curation_depth | projected:+1-3 visitors/wk long-tail for "Sanzo Wada Vol 2" / "Dictionary of Color Combinations Volume 2" queries | actual_7d:TBD | actual_28d:TBD | confidence:0.4 | hypothesis: adding Vol 2 mentions on /shop and /about creates 2 indexable surfaces for a real niche term; moat deepens via comprehensive Wada coverage

## Distribution Fit Log

2026-04-19 09:20 | shop-wada-vol2 | 6-book FurtherReading on /shop + /about | @distributor | SEO 0.6 · Share 0.2 · Channel 0.8 · Loop 0.3 · Moat 0.6 | **mean 0.50** | PASS at threshold | archetype verified (affiliate inventory, not content-SEO play) | no 🔴

2026-04-24 19:56 | task:collections-batch-v19 | archetype:programmatic_page_with_unique_data × +55 + SEO_page_addition × +50 | projected:+12-36 visitors/wk cumulative over 3-6 months post-index (2-6 per collection × 6 collections) — commercial-intent queries ("japandi color palette", "kitchen color palette", "bedroom color palette", "y2k color palette", "forest color palette", "maximalist color palette") all have real Google volume | actual_7d:TBD | actual_28d:TBD | confidence:0.6 | hypothesis: replays the proven 54-collection playbook at the same archetype; curated slugs verified against /src/data/palettes.ts; match predicates filter 378-plate Wada catalog; sitemap expanded from 54→60 collection URLs

2026-04-24 19:56 | collections-batch-v19 | 6 new SEO collections (japandi, kitchen, bedroom, y2k, forest, maximalist) | @distributor | SEO 0.8 · Share 0.4 · Channel 0.7 · Loop 0.5 · Moat 0.7 | **mean 0.62** | PASS | archetype verified: each collection is a unique synthesis of Wada plates through a hand-picked + match-filtered lens — not template programmatic | no 🔴 | no HARD-REJECT archetypes (no cloaking / doorway / keyword stuffing)

2026-04-24 20:15 | task:collection-embed-widget | archetype:embeddable_widget × +80 (calibrated per v18.0) | projected:+0.5-3 backlinks/wk within 90 days if even a single design blog / Medium writer embeds one collection; each permanent embed = recurring discovery channel; compounds for years | actual_7d:TBD | actual_28d:TBD | confidence:0.55 | hypothesis: collection pages target designer-intent queries (japandi/kitchen/bedroom) that bloggers/writers publish about — perfect embed-target audience; preview + copy snippet on every detail page makes the embed action zero-friction; replays proven /embed/[slug] palette widget pattern at a higher-intent granularity (collection vs. single palette)

2026-04-24 20:15 | collection-embed-widget | 60 per-collection embed widgets (560×320 iframe) + "Embed this collection" section on every /collections/[slug] + sitemap filter excludes /embed/* | @distributor | SEO 0.6 · Share 0.85 · Channel 0.8 · Loop 0.85 · Moat 0.7 | **mean 0.76** | PASS (strong) | archetype: embeddable_widget × +80 | no 🔴 | sitemap cleanup ships alongside (minor SEO hygiene: 438 noindex URLs removed from sitemap)

2026-04-27 11:58 | task:share-card-canvas-colors-collections | archetype:share_by_design_result × +95 | projected:+30-80 referral visitors/wk over 90d (Pinterest + Twitter compound; 275 surfaces × ~0.3 share rate × ~3 viewers/share = compounding loop) | actual_7d:TBD | actual_28d:TBD | confidence:0.55 | hypothesis: extends proven palette Canvas share-card pattern (PR #82, 2026-04-26) to /colors/[slug] (211) + /collections/[slug] (64); single-component change in ShareActions.astro, two pages updated to pass `download` prop; Canvas drawn client-side at click time so build size flat; auto-contrast hex on color hero swatch + 6-swatch dedup'd accent strip on collection hero; replays palette pattern at ~9× the surface count

2026-04-27 11:58 | share-card-canvas-colors-collections | Canvas PNG 1200×630 download on 275 detail pages (211 colors + 64 collections) | @distributor | SEO 0.5 · Share 0.95 · Channel 0.85 · Loop 0.85 · Moat 0.65 | **mean 0.76** | PASS (strong) | archetype: share_by_design_result × +95 | no 🔴 | no HARD-REJECT archetypes

2026-04-27 12:16 | task:api-random-json | archetype:dataset_json_api × +70 | projected:+5-15 LLM-citation referral visitors/wk over 90d | confidence:0.5 | hypothesis: extends /api/* surface to a 5th index endpoint; mirrors /api/palettes.json pattern; xorshift32-seeded shuffle gives per-build variety without runtime randomness; HTML companion link.rel=alternate signals twin to LLM crawlers

2026-04-27 12:16 | api-random-json (PR #84) | new endpoint /api/random.json + alternate link on /random/ HTML + index.json discovery map updated + llms.txt documented | @distributor (self) | SEO 0.5 · Share 0.4 · Channel 0.85 · Loop 0.7 · Moat 0.7 | **mean 0.63** | PASS | archetype: dataset_json_api × +70 | no 🔴

2026-04-27 12:48 | task:sitemap-ai-xml | archetype:sitemap_ai_xml_present × +20 + dataset_json_api × +70 | projected:+5-15 LLM-crawler citations/wk over 90d (priority-tiered crawl-budget allocation guides 9 LLM crawlers to highest-value pages first) | confidence:0.6 | hypothesis: implements rules/bot-harvest.md Lever 5 (Day-1 bot-readiness checklist); 677 URLs hand-tiered (1.0=homepage+6 pillars, 0.9=378 palettes+210 colors per-record, 0.8=69 collections, 0.7=E-E-A-T+index hubs, 0.6=utilities, 0.5=commercial); per-record entries advertise JSON twins via xhtml:link rel=alternate

2026-04-27 12:48 | sitemap-ai-xml (PR #85) | secondary sitemap at /sitemap-ai.xml + robots.txt second Sitemap line + llms.txt documents endpoint | @distributor (self) | SEO 0.4 · Share 0.2 · Channel 0.95 · Loop 0.7 · Moat 0.6 | **mean 0.57** | PASS | archetype: sitemap_ai_xml_present × +20 + dataset_json_api × +70 | no 🔴 | infrastructure-class ship (low Share by design; Channel + Moat carry)

2026-04-27 17:00 | task:hue-family-hub-pages (PR #86) | archetype:programmatic_page_with_unique_data × +55 + SEO_page_addition × +50 | projected:+8-25 long-tail visitors/wk over 3-6 months — 9 hue queries with real Google volume; ~24-50 unique-data colors + 24 hand-picked palettes per page + per-hue editorial cultural paragraph | confidence:0.6
2026-04-27 17:00 | hue-family-hub-pages (PR #86) | 9 new SEO pages /colors/hue/[hue]/ | @distributor (self) | SEO 0.85 · Share 0.4 · Channel 0.7 · Loop 0.7 · Moat 0.75 | **mean 0.68** PASS (strong) | archetype: programmatic_page_with_unique_data × +55 + SEO_page_addition × +50 | no 🔴

2026-04-27 17:35 | task:share-card-pillars-hue (PR #87) | archetype:share_by_design_result × +95 | projected:+10-25 referral visitors/wk over 90d — 15 high-citation-value surfaces (6 long-form pillars + 9 hue hubs) get downloadable 1200×630 PNG; long-form gets shared more than swatches per Pinterest data | confidence:0.55 | hypothesis: extends Canvas pattern via 3rd discriminated-union variant 'page' (kind: 'page' renders top region from swatchStrip OR accentHex OR plain paper); pillars use per-article accent (kurenai/imperial-purple/tea-tone/etc), hue hubs use 6-swatch strip + accentHex
2026-04-27 17:35 | share-card-pillars-hue (PR #87) | Canvas PNG download on 6 /learn pillars + 9 /colors/hue/[hue]/ | @distributor (self) | SEO 0.5 · Share 0.95 · Channel 0.9 · Loop 0.85 · Moat 0.75 | **mean 0.79** PASS (strong) | archetype: share_by_design_result × +95 | no 🔴 | no HARD-REJECT
