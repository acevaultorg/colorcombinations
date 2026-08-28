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

---

## Cycle 1 CALIBRATE — 2026-08-28 (Organic User Growth pilot, step 7/7)

### Projected vs actual against the trajectory above

The Week-16 row (2026-08-09) projected `AUG_v3 ~17`. **That number cannot be honestly
compared, because it was never measurable: 4 of its 7 factors were never wired.** The
baseline block above scored Performance 7/10 on "LCP *likely* <1.5s (no CDN-level CWV data
yet)" and Activation 4/10 with no activation event defined. Those are ESTIMATES presented in
a scoring table, and every AUG_v3 figure derived from them inherits that.

Recording it plainly rather than publishing a composite built on assumptions.

### What IS measured today (2026-08-28, fleet layer + GA4 30d)

| factor | measured value | score | basis |
|---|---|---:|---|
| Acquisition | 4,370 human visitors/30d | 4 | GA4 · rubric 3=~3k, 5=~10k |
| Engagement | 3.53 PV/visitor · 173s avg session · 58.9% bounce | ~6 | 15,449 PV ÷ 4,370 visitors; scroll depth NOT wired, so this is a partial composite |
| Monetization | 325 Amazon clicks/30d (beacon) | — | clicks measured; **$ per click NOT measured per-site**, so the $/week rubric cannot be applied |
| Activation | — | — | **NOT WIRED** — no activation event defined |
| Retention | — | — | **NOT WIRED** — no D1/D7/D30 cohorts |
| Advocacy | — | — | **NOT WIRED** — no share/embed/k-factor signal |
| Performance | — | — | **NOT WIRED** — no CrUX field data (the earlier 7/10 was inferred from stack choice, not measured) |

**AUG_v3 composite: NOT COMPUTED.** It is a 7-factor geometric mean; with 4 factors unwired
any number would be mostly invention. Correcting the stale line above: Monetization is no
longer "$0/week actual" — 325 tracked Amazon clicks/30d, and the site's Monetize stage sits at
650% of its conversions goal.

### Channel reality (drives cycle 2)

**BING-NATIVE: 472 Bing clicks (3.47% CTR) vs 6 Google clicks / 326 Google impressions,
avg position 57.9.** Google is not a meaningful channel here and Google-rank work would
optimise an engine this site does not use. Bing is also the index ChatGPT cites.

### What cycle 1 actually shipped (and why nothing is re-measurable yet)

Cycle 1 built **no new pages** — step 4 correctly refused: the intersection shape
`/colors-that-go-with/[color]/[context]` is 703 URLs (48% of the sitemap) and measured
~100% dark (0 of 122 cited pages), so extending it would have diluted crawl budget.
An honest no-build. What shipped instead were correctness fixes:

- `6bde4ff` every Amazon buy link was 404ing — the gate never shipped
- `0041b19` Prime free-trial bounty CTA on 405 pages
- `e457102` header overflowed the viewport 768-840px (iPad portrait), all 2,128 pages
- `9d993de` IndexNow was submitting all 1,469 URLs every deploy → now changed-only (2/deploy)
- `5c061a7` deploy used raw wrangler, which cannot work here (174MB vs ~56MB cap)
- `c61d793` /apple-touch-icon.png 404'd on all 1,470 pages

**None of these can be read at 7d today — they shipped hours ago.** Bing reports on a ~30d
window with a ~4-week lag, so the earliest honest re-measure is ~2026-09-25. Scheduled;
reading the metric before then would be measuring instrument lag, not effect.

### Cycle 2 entry decision

Do NOT re-run step 4 against `/colors-that-go-with/`. The binding gap is Pageviews (39% of
goal) and Human visitors (87%), on a Bing-native site whose citation strength is concentrated
in BOOK queries (45-75% citation share on "dictionary of colour combinations" and variants).
Cycle 2 should start from Bing AI Performance citations-per-page BY SHAPE and widen only a
shape with proven yield.

