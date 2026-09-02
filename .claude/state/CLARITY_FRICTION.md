
---

# SCROLL-REACH MEASURED — the mean was concealing a bimodal split, and it inverts the recommendation

Task mtjdnkph1i5h0r · measured 2026-09-02 from computer 2 (MacBook Pro), no Chrome MCP needed.

## The gate the task named, and why it didn't hold

The task said: *"I do not know what share of sessions reach the bottom. averageScrollDepth gives
the mean, not the distribution... The distribution is in Clarity's scroll-depth heatmap, which
needs the dashboard (computer 1)."*

It doesn't. **GA4's enhanced-measurement `scroll` event fires once per pageview at 90% depth** —
that IS "share reaching the bottom", on a 30-day window, at zero Clarity quota. Confirmed the
event exists on this property before relying on it: 2,718 `scroll` events / 30d.

## The number (GA4 prop 294106772, 30d, pagePath × eventCount)

```
page             pageviews   scroll@90%   share reaching bottom
/browse/              2235          653          29.2%     <- 1.55x site average
/                     3068          274           8.9%     <- 0.47x site average
/colors/               627          232          37.0%
/collections/          531           41           7.7%
SITE-WIDE            13207         2481          18.8%
```

Positive control: the method discriminates — it produces 0.0% (`/random/`, 185 pv) through 37.0%
(`/colors/`) across the same pull. It is not uniformly inflating.

## This REVERSES the task's proposal

The task reasoned from two near-identical Clarity means (27.3% on `/browse/`, 27.0% on `/`) that
`/browse/`'s bottom is "far past where anyone goes" while `/`'s is "plausibly still in reach",
and proposed **moving the shelf up on `/browse/` and leaving `/` alone**.

The distribution says the opposite. `/browse/`'s bottom is reached by **29.2%** — one of the
best-reached bottoms on the site. `/`'s is reached by **8.9%** — less than half the site average
and 3.3× worse than `/browse/`. **If either page has a placement problem it is `/`, not
`/browse/`.**

### Why the two means looked the same when the pages are not

`/browse/` is **bimodal**: visitors either bounce near the top or grind the whole 348-palette
grid (consistent with its 58s active time). 29.2% at ~95% plus ~71% at ~2% averages to ~28% —
which is the 27.3% Clarity reported. **Nobody is actually at 27%.** The mean is a real number
describing a population that does not exist, and both pages landing on ~27% by different routes
is a coincidence of shape, not a similarity of behaviour.

Same failure mode as the site-level average-position artifact in `chief-network.md`: a mean over
a bimodal distribution survives inspection while describing nothing. Ask for the histogram, or a
threshold count, before acting on any average.

## ⚠️ The premise also needs correcting: the shelf is NOT on these two pages

The task states *"`PaintThisPalette` is currently the last section in both files"*. In canonical
source it is **not on either**:

```
origin/main:src/pages/browse.astro   -> 0 references
origin/main:src/pages/index.astro    -> 0 references
live https://colorcombinations.org/browse/  -> PaintThisPalette absent
this checkout: working tree CLEAN, 0 ahead / 0 behind origin/main
```

It IS live on 8 other page types (`palettes/[slug]`, `colors/[slug]`, `paintings/[slug]`,
`shop`, `gift-guide`, `learn/why-painting-colours-shift`, `colors-that-go-with/…`). So the
uncommitted `browse.astro`/`index.astro` the task describes exist on **another machine's
checkout only** and were never pushed. The live question is therefore not "should we move it"
but "**should we add it, and where**" — and the answer for `/browse/` is that the bottom is a
defensible place, because 29.2% get there.

Confound checked and excluded: `/browse/` renders all ~348 palette cards in the initial HTML
(756 `/palettes/` occurrences; no IntersectionObserver, no infinite scroll, only 3
`loading="lazy"` on images). Document height is stable, so the 90% fire is against the real
bottom, not a lazy-loaded first chunk.

## Files deliberately NOT touched

`browse.astro`, `index.astro`, `collections/[slug].astro` — another session may still hold these
uncommitted elsewhere. This leg contributed the measurement only.

## Baseline for judging any future change

Per the task's own metric, captured now so it needn't be reconstructed: `amazon_click` = **225
events / 30d** site-wide (GA4). Beacon `amazon_clicks_30d` = 351/30d. Both are pre-change.
