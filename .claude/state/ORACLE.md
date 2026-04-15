# ORACLE.md — Revenue Oracle v1 log

Append-only. Do not edit existing rows. Corrections use the `## Corrections`
section with a `corrects: <original-timestamp>` field (I-18).

## Meta

- **Project:** ColorCombinations
- **Revenue model:** hybrid (affiliate + tip-jar bundle + future Pro)
- **Primary KPI:** RPU (revenue per unique visitor)
- **Baseline weekly revenue:** $0 (pre-revenue — operator activation pending)
- **Currency:** USD (Gumroad default) · EUR (operator-facing)
- **Oracle version:** v1 (deterministic heuristic, no ML)
- **First row:** 2026-04-15

## Archetype multipliers (local calibration)

No calibration data yet — using v1 defaults from the brain spec. First
recalibration happens after 10 same-archetype ships with actual 7d/30d
data. Until then, every row logs `calibration: cold`.

| archetype | v1 multiplier | local multiplier | calibration |
|---|---|---|---|
| pricing_page_change | 1.00 | 1.00 | cold |
| signup_flow_change | 0.80 | 0.80 | cold |
| new_landing_page | 0.60 | 0.60 | cold |
| auth_flow_fix | 0.40 | 0.40 | cold |
| conversion_copy_fix | 0.30 | 0.30 | cold |
| SEO_page_addition | 0.15 | 0.15 | cold |
| analytics_wiring | 0.10 | 0.10 | cold |
| cleanup_refactor | 0.00 | 0.00 | n/a |
| infrastructure | 0.05 | 0.05 | cold |
| bug_fix_blocking_revenue | 0.50 | 0.50 | cold |
| specialist_review | 0.00 | 0.00 | n/a |

## Projections

Format: `timestamp | task-id | archetype | projected_$/wk | confidence_0_to_1 | hypothesis`

2026-04-15 13:25 | pillar-article-1 | SEO_page_addition | 0.10 | 0.3 | Single pillar post, cold site (0 current weekly revenue). Oracle is near zero because any multiplier × $0 baseline = $0. Real value is HN-launch-anchor — measured after launch.
2026-04-15 13:34 | analytics-config | analytics_wiring | 0.00 | 0.3 | Pre-revenue site; analytics only pays off once traffic exists. Long-term enabler for every other decision.
2026-04-15 13:36 | cookie-consent | infrastructure | 0.00 | 0.3 | Required for GDPR with GA/Clarity. Enabler for #analytics-config projection to land at all.
2026-04-15 13:40 | hn-ammo | distribution_asset | 2.00 | 0.5 | Ready-to-post HN copy removes operator friction on the single highest-variance traffic event available. If HN posts even once and ranks top-20, this pays back many times over.
2026-04-15 13:52 | gumroad-ammo | conversion_copy_fix | 0.50 | 0.5 | Gumroad product copy + pricing psychology drives bundle conversion when operator uploads. Keyed to bundle-conversion rate on /shop visitors post-activation.
2026-04-15 13:55 | 100eur-playbook | distribution_asset | 1.00 | 0.5 | Compresses operator path-to-first-€100 from unbounded to ~2 hours. Whole-session value; hard to attribute to any single task but real.
2026-04-15 14:20 | pillar-article-2-neutrals | SEO_page_addition | 0.15 | 0.4 | Second pillar keeps the series promise from article 1 and adds a second HN/Reddit anchor. Compounds with article 1, not additive — think of it as risk-diversification on launch content.
2026-04-15 14:22 | pinterest-rich-pins | infrastructure | 0.10 | 0.3 | Pinterest Rich Pin meta tags on article-type URLs unlock visible-preview distribution on Pinterest, LinkedIn, Slack, Mastodon. Value bounded by whether operator ever pins anything; cheap to add.
2026-04-15 14:25 | csil-audit-1 | specialist_review | 0.00 | 0.5 | First CSIL audit on this project. Finding: PATTERNS.md was missing; seeded via proposed mutation M-2026-04-15-01.
2026-04-15 16:50 | pillar-article-3-seasons | SEO_page_addition | 0.15 | 0.4 | Closes the three-pillar series. Each article reinforces the others via cross-links; traffic compounds across them more than standalone posts would. Real value ties to HN launch performance.
2026-04-15 16:52 | linkedin-launch-copy | distribution_asset | 0.80 | 0.4 | LinkedIn hits design-director / brand-lead audience absent from HN / Reddit. Single post can reach decision-makers who control agency budgets.
2026-04-15 16:53 | indiehackers-launch-copy | distribution_asset | 0.30 | 0.4 | IH audience is pre-revenue founders — medium-high resonance, but modest direct revenue contribution. Useful for peer feedback + long-tail discovery.
2026-04-15 16:54 | content-calendar-7d | distribution_asset | 0.50 | 0.5 | 7 ready-to-post drip items remove the "what do I post today?" friction during launch week. Sustains organic reach past the launch-day peak.
2026-04-15 19:50 | json-api-catalog | infrastructure | 0.25 | 0.4 | Developer-facing JSON endpoints for /api/palettes.json + /api/palettes/[slug].json. Value is indirect: developer tools consuming the API produce backlinks + organic discovery among designers-who-also-code. Hard to measure directly; bet on HN/IH + long-tail GitHub dep-graphs.
2026-04-15 19:52 | embed-widget | distribution_asset | 1.50 | 0.5 | /embed/[slug] renders a self-contained iframe-safe palette card. Every external blog or Notion doc that embeds a plate = a backlink + a viewer who didn't know the archive existed. GROWTH.md names this explicitly as a viral loop. Value scales with adoption.
2026-04-15 19:53 | api-docs-page | infrastructure | 0.10 | 0.4 | /api documentation page makes the endpoints discoverable. Without it, the JSON routes would exist but nobody would find them. Required complement to the API itself.
2026-04-15 20:35 | privacy-terms | bug_fix_blocking_revenue | 2.50 | 0.6 | Without /privacy and /terms, the GA/Clarity stack is GDPR-non-compliant the moment operator activates. Unblocks legitimate measurement activation — the highest-value single task this session since it removes a legal blocker, not just marginal polish.
2026-04-15 20:38 | era-landing-pages | SEO_page_addition | 0.45 | 0.4 | 7 new indexable pages at /era/[slug] targeting "heian color palette" class queries. Each carries editorial description + 2-era cross-links + palette grid. Compounds with existing collection SEO surface.
2026-04-15 20:41 | mood-landing-pages | SEO_page_addition | 0.50 | 0.4 | 9 new indexable pages at /mood/[slug]. Covers queries that collections don't (serene, austere, playful, solemn) — moods map to client-brief language better than eras do.
2026-04-15 20:42 | blog-rss-feed | infrastructure | 0.15 | 0.4 | Dedicated /blog/rss.xml (separate from existing palette /feed.xml). Auto-discovery link in blog index head. Feedly + Inoreader + newsletter-auto-syndication pick this up.

## Calibration

Format: `ship_task_id | shipped_at | projected | actual_7d | actual_30d | drift_ratio`

(empty — no post-launch data yet)

## Corrections

(empty)
