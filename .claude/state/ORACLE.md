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

## Calibration

Format: `ship_task_id | shipped_at | projected | actual_7d | actual_30d | drift_ratio`

(empty — no post-launch data yet)

## Corrections

(empty)
