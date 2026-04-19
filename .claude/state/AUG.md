# AUG.md — AceUserGrowth v3 Score (ColorCombinations)
# Project: colorcombinations.org
# Seeded: 2026-04-19 (v19.2 stub — no live traffic data yet)
# Formula: AUG_v3 = geometric mean × 10 across 7 factors (0-10 each)

## Weekly Score v3

| date | acq | act | eng | ret | adv | mon | perf | AUG_v3 | WoW | top_weakness |
|---|---:|---:|---:|---:|---:|---:|---:|---:|---|---|
| 2026-04-19 | 2 | 3 | 3 | 2 | 1 | 1 | 7 | ~3.5 | baseline | monetization + advocacy |

### 2026-04-19 stage notes
- **Acquisition (2/10):** Site live ~7 days at time of stub. Organic traffic minimal (no GSC data yet). No social/community channels activated. IndexNow not yet wired.
- **Activation (3/10):** Core tool (browse/export) works. No activation-event instrumentation live. Estimate based on product quality alone.
- **Engagement (3/10):** 603 static pages with internal linking. No scroll-depth or event data yet (Plausible not live). Estimate from design quality.
- **Retention (2/10):** No return-visit data. No email capture live. Low recurrence intent by design (reference use).
- **Advocacy (1/10):** No share-card per result. No embed widget yet. No k-factor signal.
- **Monetization (1/10):** All revenue rails gated (Gumroad placeholder, Bookshop.org placeholder, AdSense pre-approval). $0/week actual.
- **Performance (7/10):** Static export + Cloudflare Pages. LCP likely <1.5s (no CDN-level CWV data yet, but Next.js-level performance design). CLS 0 (no layout-shifting elements).

### Target trajectory
| milestone | acq | act | eng | ret | adv | mon | perf | AUG_v3 |
|---|---:|---:|---:|---:|---:|---:|---:|---:|
| Week 4 (2026-05-17) | 3 | 4 | 4 | 3 | 2 | 2 | 8 | ~6 |
| Week 8 (2026-06-14) | 4 | 5 | 5 | 4 | 3 | 4 | 8 | ~12 |
| Week 16 (2026-08-09) | 5 | 6 | 6 | 4 | 4 | 5 | 8 | ~17 |
| Year-1 target | 7 | 7 | 7 | 5 | 5 | 6 | 9 | ~31 |

### Kill criteria
I-35: AUG_v3 < 5 for 2 consecutive weekly measurements → 90-day kill-criteria candidate.
Current status: N/A (week 1 baseline, no consecutive period yet).

## Corrections
# (none)
