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

2026-04-27 17:47 | task:api-hue-json (PR #88) | archetype:dataset_json_api × +70 | projected:+5-12 LLM-citation referrals/wk over 90d (completes JSON-twin coverage; LLM consumers can fetch hue-aggregate data without scraping HTML) | confidence:0.55
2026-04-27 17:47 | api-hue-json (PR #88) | 9 new endpoints /api/hue/[hue].json + jsonAlternate on /colors/hue/[hue]/ + /api/index.json schemas + sitemap-ai xhtml:alternate + llms.txt documentation | @distributor (self) | SEO 0.4 · Share 0.3 · Channel 0.95 · Loop 0.85 · Moat 0.7 | **mean 0.64** PASS | archetype: dataset_json_api × +70 | no 🔴

2026-04-27 21:29 | task:api-learn-slug (PR #89) | archetype:dataset_json_api × +70 | projected:+5-12 LLM-citation referrals/wk over 90d (per-pillar editorial JSON exposes outline + cited terms with pronunciation + meaning — extractable structure beyond what palettes/colors/collections provide) | confidence:0.55
2026-04-27 21:29 | api-learn-slug (PR #89) | 6 new endpoints /api/learn/[slug].json + jsonAlternate on all 6 /learn/[slug]/ + /api/index.json + sitemap-ai pillar JSON twin + llms.txt | @distributor (self) | SEO 0.4 · Share 0.4 · Channel 0.95 · Loop 0.85 · Moat 0.75 | **mean 0.67** PASS | archetype: dataset_json_api × +70 | no 🔴

---

## Channel Reality — measured NEGATIVES (2026-09-05, Bing page+query pull)

Four hypotheses tested against live data. **All four came back clean — no defect, no work
filed.** Recorded so the next session does not re-derive them; on this fleet the missing-page
hypothesis is now **0-for-8** and re-deriving it has cost multiple sessions.

**Instrument:** `fleet.promptprio.com/bing-detail?site=colorcombinations.org&limit=5000` →
139 page rows / 924 query rows / 18,975 page impressions. Money-path positions measured on the
LIVE pages as a **percentage of `<body>` length** with a markup-anchored regex (`href="/go/`,
`href="/shop`) — never a raw string search, because Astro hoists component CSS into `<head>` and
a bare class-name match lands in the stylesheet rather than the markup.

### 1. Money path on the top-traffic pages — HEALTHY, no action

| page | Bing impr | body | `/go/` links | first `/go/` | ad target |
|---|--:|--:|--:|--:|--:|
| `/trends/color-trends-2026/` | 6,777 | 65,076 | 25 | **30%** | 1 |
| `/` (home) | 6,585 | 109,214 | 31 | **5%** | 1 |
| `/collections/japanese/` | 1,446 | 87,096 | 30 | **50%** | 1 |
| `/collections/y2k/` | 651 | 65,588 | 30 | **35%** | 1 |

All four carry a money path above or near the fold and a `.mv-content` ad target. This is NOT
the buried-callout defect fixed today on `/browse/` and `/colors/` — those were a *callout*
component sitting past the median scroll line, and both are now at 1.5% / 4.6%.

### 2. 🔴 The site's blended CTR is an OWNERSHIP artifact, not a defect — do NOT retitle

The query set splits cleanly into two families at nearly identical positions:

| family | impr | clicks | CTR | who owns the canonical answer |
|---|--:|--:|--:|---|
| "dictionary of color combinations" / Sanzo Wada | ~3,283 | 214 | **6.5%** (pos 3.0–3.6) | **we do** |
| "color of the year 2026" / Pantone | ~2,154 | ~9 | **0.42%** (pos 5.4–7.4) | **Pantone** |

The decisive row is **`what are the colours for 2026` — position 2.0, 43 impressions, ZERO
clicks.** At position 2 ranking cannot be the explanation. Pantone owns that answer and the
engine serves it inline. Per `affiliate-team-standard` § THE OWNERSHIP LAW this family is a
**citation/conversion surface, never a title-CTR target** — a rewrite spends a leg to move
nothing.

Consequence for reading this site's numbers: `/trends/color-trends-2026/` at 2.70% CTR is a
**blend** of an owned family and a Pantone-owned family, not underperformance. Do not rank it
against `/collections/japanese/` (6.09%) as though they compete for the same kind of query.

### 3. Missing-page hypothesis — REFUTED (0-for-8 fleet-wide)

"sanzo wada" (93 impr, pos 7.7) and "sanzo wada color combinations" (51 impr, pos 6.9) sit
3–4 positions below the Wada-dictionary cluster, which looks like a missing entity hub.
**354 Wada URLs already exist in the sitemap** (`/compare/wada-*`, `/learn/wada-*`,
`/data/sanzo-wada-*`). There is no supply gap. Sanzo Wada the *person* has an institutional
owner (Wikipedia), so position ~7.5 on the biographical phrasing is the ownership law again,
not an absence.

### 4. What is NOT measurable here — stated rather than guessed

`/colors/` takes 2,183 impressions at 1.42% CTR (pos 5.0) and **no query in the feed attributes
to it.** The `queries` array is click-selected (doctrine: 4.5–5.8× CTR-inflated, a clicked-query
sample rather than a census), so the low-CTR queries that drive `/colors/` are exactly the ones
it omits. Its 1.42% cannot be diagnosed from this instrument. Anyone picking this up needs
`GetQueryStats` filtered per-page, or GSC page-query pairs — not a harder look at this feed.

### What would change these verdicts
- A money-path regression: re-run the body-percentage measurement after any template change.
- Pantone family: only a *conversion* or *citation* metric can judge it. CTR cannot.
- `/colors/`: a per-page query source. Until then its CTR is unexplained, not bad.

### 5. `/colors-that-go-with/` — 48% of the sitemap, 0.09% of impressions — and it is NOT a defect

`/colors-that-go-with/<color>/<context>/` is **702 pages** (54 colors × 13 contexts) = 48% of the
1,470-URL sitemap, the largest template on the site. In the Bing feed **11 pages carry 17
impressions** — 0.09% of the site's 18,975.

That shape (huge built surface, ~no impressions) is the `realized-demand-discipline` fork: either
normal programmatic long-tail, or a **blocked asset** whose blocker is cheap to remove. The rule
says name the blocker or say there is none. Measured, in order:

| check | result |
|---|---|
| HTTP | 200 |
| `<meta name="robots">` | **none — fully indexable** |
| canonical | self-canonical, correct |
| unique body words | **~2,350/page** — substantial, not thin |
| linked from `/`, `/colors/`, `/browse/`, `/collections/` | **yes — 1 link each, to the hub** |
| hub → leaf links | **702** |
| position when it does surface | **1.0–5.0** (it WINS when shown) |

**There is no blocker.** Indexable, self-canonical, substantial, linked at depth 2 from every
major hub, and ranking 1–5 when it surfaces. The binding constraint is impressions — i.e. demand
or discovery — not quality, indexation, or the link graph.

**Do NOT expand this template on the strength of its CTR.** The 11 pages show 9 clicks on 12
impressions, and that ~75% is a **selection artifact**: the queries array is click-selected, so
zero-click queries in this family are precisely what it omits. Per `affiliate-team-standard`
§ the intersection law, the ranking signal for a cross-cut is **demand for the intersection**,
not the availability of two dimensions to multiply — and readinglist's `decade × grade` shipped
98 pages for 0 impressions on exactly that mistake. Demand here is **UNKNOWN from this
instrument**. Measure it (GSC page-query pairs, or a keyword source) before adding a 14th context
or a 55th color.

What IS sound from a click-selected feed is **presence**: the queries occur, and they are deep
long-tail — "what colours go with a mauve wedding guest", "what colour goes with mustard wallpaper
in bedroom", "what colors go with red maroon for clothes". We rank 1–2 for several.

Unmeasured observation, recorded without a proposed fix: the hub carries all 702 links on one
page. Whether that dilutes crawl or equity here has **not** been measured, and the pages are
indexed regardless, so no work is filed on it.

### 🔴 Instrument note — I made the SAME over-specified-pattern error twice in one session

Both times a trailing slash produced a confident false ABSENCE:

```
href="/shop/"                 -> homepage "has no shop link"   FALSE (7 links, real href is /shop)
href="/colors-that-go-with/"  -> "surface is ORPHANED"          FALSE (real nav href has no slash)
```

The second one had already reached a written finding ("blocker named: orphaned") before the
positive control — grepping the hub, which *must* contain those links — returned 702 and exposed
the pattern as blind. **When probing for the presence of a link, path or attribute, start with the
shortest distinctive prefix and only then narrow.** Every character added to a pattern is another
assumption, and an over-specified pattern fails silently in the reassuring direction.

### 6. Google is 0.02x of Bing here — and it is NOT a demotion. Do not diagnose it as one.

Measured 2026-09-05. This site's channel mix is inverted by two orders of magnitude versus every
normal site, and it looks alarming until you pull the history.

| engine | impressions | clicks | avg position |
|---|--:|--:|--:|
| Bing (28d) | 15,853 | **519** | 3.6–5.0 on top queries |
| Google (30d) | 342 | **4** | **58.3** site-level |

On the site's own brand-defining entity query, `a dictionary of color combinations`:
**Google position 79.9 / 0 clicks · Bing position 3.6 / 104 clicks.** A ~76-position gap on the same
query, same content, same month.

**Everything technical is clean** — checked before hypothesising: `robots.txt` is
`User-agent: * Allow: /`; Googlebot receives a full 200 with 2,831 words and no `noindex`, byte-comparable
to bingbot and to Chrome (no cloaking); canonical and `og:url` are consistent apex;
`www.colorcombinations.org` does not resolve, so there is no host split; the GSC property is
`sc-domain:colorcombinations.org`, a **domain property**, so scope covers every host and protocol.

**The GSC instrument is not blind** — fleet control: 365,601 GSC impressions vs 157,452 Bing across
the fleet (2.32x the other way), readinglist alone at 254,377 GSC impressions. The pull works.

**Google's coverage is broad, not missing** — 86 distinct pages take impressions across 12 templates
(/palettes, /collections, /colors, /compare, /colors-that-go-with, …). Google has crawled the site.
The constraint is position, not indexation.

#### 🔴 The history refutes the demotion reading

`fleet.promptprio.com/gsc-daily.csv`, monthly rollup for this site:

```
2026-06   133 impr    2 clicks
2026-07   223 impr    9 clicks
2026-08   376 impr    5 clicks      <- rising, +183% since June
2026-09    18 impr    1 click       <- 5 partial days, GSC lags 2-3d: NOT a signal
```

**There is no drop.** Google impressions are flat-to-rising. This site has never ranked on Google —
it is the slow Google authority clock, not a penalty, not an HCU hit, and not something a ship broke.
Bing simply rewards a young niche site far earlier than Google does.

Which means the standing Fleet Dashboard reference card **mtc0hoiiln1lqd — "READ BEFORE DIAGNOSING ANY
TRAFFIC DROP — external Google event 2026-08-16"** does not apply here either: there is no drop to
attribute. Reading it first is what stopped this becoming a filed emergency.

#### What NOT to do with this
- **Do not** treat it as a penalty and go hunting for a cause. Three technical hypotheses
  (robots / cloaking / host-split) and one instrument hypothesis were all tested and refuted.
- **Do not** mass-noindex the 702-page `/colors-that-go-with/` surface on a "scaled content" hunch.
  Those pages rank **1.0–5.0 on Bing** and serve real users; the blast radius is 48% of the sitemap
  and there is zero evidence Google's ranking is about them specifically. `information-gain-standard`
  requires the traffic veto before any such action, and nothing here has passed one.
- **Do** read Google as a long-clock channel on this site and judge it on trend (133 -> 376), not level.

**Watch item, not a finding:** September's partial month is running below August's daily rate. GSC
lags 2–3 days and 5 days is a thin sample — re-check in October before reading anything into it.

### 7. Segmentation (2026-09-05) — this site is the fleet's #1 AI-referred-human property by 14x

`/ga4-probe?prop=294106772&dims=<d>&mets=sessions,screenPageViews,totalUsers&days=30` — all three
pulls complete (`truncated: false`, returned == row_count), so no selection caveat applies.

**Channel — the headline:**

| channel | sessions | share | pv/sess | sess/user |
|---|--:|--:|--:|--:|
| Direct | 3,185 | 45.8% | 1.64 | 1.29 |
| Organic Search | 2,439 | 35.1% | 2.98 | 1.86 |
| **AI Assistant** | **1,042** | **15.0%** | **2.91** | 1.50 |
| Referral | 224 | 3.2% | 2.35 | 2.57 |

**1,028 of the fleet's 1,474 AI-referred sessions are this site — 70%, at the highest engagement
depth of any fleet property (2.92 pv/session).** `ai-citation-channel.md` already names why this
number is the one to trust: colorcombinations is the only UNGATED earner, so its GA4 is not
consent-suppressed the way every other site's is.

Read `ai_sessions_30d` · `ai_share` · `ai_pageviews_per_session` from
`fleet.promptprio.com/data.json` — **not** from `get_fleet_data`, whose 10-field projection omits
them (absence there is a property of the projection, not of the data).

**Device — no gap, do not chase one:** desktop 3,610 (52.3%, 2.21 pv/sess) vs mobile 3,229 (46.8%,
**2.45** pv/sess). Mobile is *deeper* than desktop here. There is no mobile deficit to fix.

**Geo — an instrument nuance worth stating, not acting on:**

| country | sessions | share | pv/sess | sess/user |
|---|--:|--:|--:|--:|
| United States | 1,484 | 21.0% | 2.81 | 1.82 |
| **Singapore** | **1,271** | **18.0%** | **1.07** | **1.01** |
| **China** | 311 | 4.4% | **1.31** | **1.04** |

Singapore and China carry the **crawler signature** (≈1.0 sessions/user AND ≈1.0 pageviews/session)
— ~22% of sessions. Yet the fleet's `crawler_shaped_share` correctly reports this site at **0.0%**,
because that test runs per CHANNEL and Direct here is 1.29 s/u · 1.64 pv/s, comfortably human.

**Both readings are right.** The channel test is not broken — it is answering a different question.
The generalisable point: **channel-level shape detection can miss country-concentrated crawler
traffic**, because datacenter traffic distributed across several channels never trips a per-channel
threshold.

**No decision changes, so no work is filed.** Even discounting SG+CN entirely, visitors run ~3,000
against a 1,500 goal — on-track either way. Recorded so nobody later "discovers" the 22% and reads
it as a contradiction of the 0.0% flag.
