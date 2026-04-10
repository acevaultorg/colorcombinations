# GROWTH_ANALYTICS.md — ColorCombinations
# Model: hybrid (affiliate + subscription + one-time merch)
# Primary KPI: RPU (revenue per unique visitor)
# Currency: USD
# Created: 2026-04-10
# Model detected from: DECISIONS.md 2026-04-08 revenue model decision

## Monetization Events

<!-- Append-only. Format: timestamp | event | value | currency | attribution | metadata -->
<!-- Empty: V1 not yet deployed, no traffic, no events. First row will come from -->
<!-- deploy pipeline once domain is live. -->

## Funnel Metrics

<!-- Format: period_start | period_end | stage | count | conv_rate | notes -->
<!-- Empty: site not yet deployed. Will be populated weekly via /acepilot stats. -->

## Experiments

<!-- Format: experiment_id | variant | traffic_pct | event | count | p_value | winner -->
<!-- V1 is a single deterministic build. Experiments begin in V1.1+. -->
<!-- Planned first experiments: -->
<!--   - Hero headline A/B: "Historically grounded color combinations..." vs "30 curated palettes from the Japanese tradition..." -->
<!--   - Export CTA copy: "Copy hex list" vs "Copy for Tailwind" -->
<!--   - Newsletter signup placement: bottom of homepage vs sticky footer -->

## Ship Impact

<!-- Format: ship_task_id | shipped_at | observed_window | metric | delta | significance -->

task-astro-init   | 2026-04-10 | n/a (foundation) | n/a | n/a | foundation
task-homepage     | 2026-04-10 | pending post-deploy | hero_view_to_featured_scroll | TBD | hypothesis: >60%
task-palette-detail | 2026-04-10 | pending post-deploy | detail_view_to_export | TBD | hypothesis: >15%
task-browse-page  | 2026-04-10 | pending post-deploy | browse_to_detail | TBD | hypothesis: >30%
task-email-capture | 2026-04-10 | pending post-deploy | newsletter_signup_rate | TBD | hypothesis: >3%

## Corrections

<!-- Append-only corrections with corrects: <original-timestamp> field -->
