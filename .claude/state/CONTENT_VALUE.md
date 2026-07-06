# CONTENT_VALUE.md — colorcombinations.org

Append-only information-gain audit per `~/.claude/rules/information-gain-standard.md`.

## Audit + upgrade — 2026-07-06 — /colors/ surface → 100% Strong, prioritised by human demand

**Session:** q-autopilot (operator directive refined: "transform low-value → high-value pages BY PRIORITY of fastest human-user increase"). Chosen because fleet visitor data ranks colorcombinations.org (~2,093 Clarity visitors/30d) as the highest-traffic CLEAN lane — the top two (readinglist 5,788, readstacks 1,306) were actively owned by parallel sessions; secfilingdex (13.5k impressions) is a titles/meta CTR fix, not content-thin. Astro site → dist → CF Pages.

**Audit:** main surfaces already Strong (colors-that-go-with 520@1019w, palettes 378@715w). The thin surface was `/colors/[slug]` (208 named colours, 34 below 500w) and — the highest-VALUE gap — `/colors/[hue]` family pages (brown/purple/neutral/green/pink "Color Combinations", 379–454w), which are the **highest-volume colour queries on the site** yet had almost no prose (swatches + palettes only). The template had specs + curated palettes but NO colour harmony or usage guidance — ironic for a colour-combinations site.

**Upgrade shipped (commits c5c604a + hue-family, deploy 26113c72, LIVE + verified):**
- **NEW `src/components/ColorHarmony.astro`** — a fully-DERIVED, zero-fabrication section: complementary / analogous / triadic / split-complementary schemes computed from the colour's own hue (standard wheel math → RGB↔HSL), each a real usable hex swatch, + a "How to use" paragraph derived from lightness / saturation / WCAG contrast (the site's own lib/color). Answers the exact "what goes with X" intent.
- Wired into BOTH `/colors/[slug]` (per named colour's hex) AND `/colors/[hue]` (per family's meta.accentHex — so "what goes with brown/purple" etc.).
- **Result (live-verified):** entire `/colors/*` surface (213 pages) now Strong — **min 528w, median 611→768w, 0 below-500, 0 content leaks**. Named: fuji 485w→636w (live-confirmed harmony, cf-cache DYNAMIC). Hue-family: brown 379→528, neutral 419→567, purple 454→603, green 693, pink 713 — all with a live "Colours that go with [hue]" section. Zero regression (/, /colors 308 canonical, /browse 308). IndexNow 214 URLs → api.indexnow.org 200 + Bing 200.

**Discipline:** zero fabrication (pure colour-space math + WCAG, no authored prose); non-duplicative (template had curated palettes + specs but no algorithmic harmony/usage); on-brand (harmony IS the site's value prop); did NOT commit the stale cross-session `src/data/pairings.ts` edit. Deploy required 6MB chunked batches to clear intermittent SSL resets on large upload POSTs.

**Effect:** the highest-human-intent pages on the fleet's highest-traffic clean lane (brown/purple/… "color combinations") went thin → Strong, adding the "what goes with X" content those high-volume queries want + lifting the whole colour surface for ranking.
