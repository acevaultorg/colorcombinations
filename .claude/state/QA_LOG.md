# QA_LOG.md — colorcombinations.org

Money-Page QA cycles. Append-only. Every number carries its instrument + date
(rules/measured-vs-expected.md).

---

## Cycle 1 — 2026-09-02 (Air lane) — task mtjrrssjcmo3v5

Method: live curl probes + real browser interaction at desktop, and a genuine
375px render. NOTE: the window would not resize below 1189px and the site sends
`x-frame-options: DENY` + `frame-ancestors 'none'` (correct posture), so mobile
was measured by mirroring the page to a local origin with a `<base>` tag and
framing THAT at 375px — `matchMedia('(max-width:640px)')` confirmed active
(viewport 371). Post-fix re-measure used the Astro dev server directly.

### 🔴/🟡 FOUND + FIXED THIS CYCLE (both shipped in one build — builds cost ~41 min)

**P1-a · Buy CTA below the tap floor on the money path.**
`.further-reading__link` overrides global `.btn` padding (0.75rem → 0.4rem), so
"View on Amazon ↗" rendered **36px** at 375px — 8px under the 44px floor — on
/trends/color-trends-2026/, the site's single most-cited page (6,064 citations).
Fix: `min-height:44px` inside `@media (max-width:640px)` (mobile-scoped so the
desktop compact look is untouched).
Verified post-fix: buy button heights `[44]`, **0 of 6 under 44**.

**P1-b · FTC disclosure ~2,000px below the first affiliate link.**
Measured on /trends/: 18 affiliate CTAs spanning y=7,691→9,507, with the sole
in-content disclosure at **y=9,664** — i.e. *below every CTA*;
`disclosureAboveFirstCTA: false`. A mobile reader passes ~2.4 screens of buy
buttons before seeing any disclosure.
⚠️ Controlled against /palettes/kurenai-kon/ — the page whose FTC gap was
deliberately fixed in `3c6708c`. That page ALSO renders its disclosure below the
CTAs (first CTA y=3,106, first disclosure y=3,794). **So "below" is the site's
accepted pattern, not a regression** — the real defect is DISTANCE: ≤690px on
the fixed control vs **1,973px** on /trends/, because /trends/ renders 6 books
(18 CTAs) under one trailing disclosure.
Fix: `FurtherReading.astro` now emits a lead disclosure ABOVE the list when
`books.length >= 5 && variant !== "sidebar"`; the trailing one is kept; both now
read from one `DISCLOSURE_TEXT` const. Short/sidebar lists unchanged.
Verified post-fix: lead y=7,670, first CTA y=7,765 → **95px gap** (was 1,973px).

### ✅ VERIFIED HEALTHY (no action)

| check | result |
|---|---|
| `/browse` filter pills | 378 → "2 colors" → **120 visible = 120 claimed**, 1ms |
| `/browse` search | "crimson" → 2 results; nonsense → 0 + empty state "No palettes match these filters. Clear filters" (not a dead end) |
| `/browse` reset | restores 378, clears the query |
| search instrumentation | `SearchNoResults` + Search events present; Clarity + gtag live |
| horizontal overflow @371px | **none** on /trends/ or /palettes/ |
| CLS | **observed 0**. (Images carry no width/height attrs, but a fixed CSS height reserves the box — a "6 unsized images" finding would have been FALSE; refuted by measurement.) |
| affiliate `rel` | **8/8** links `sponsored nofollow noopener` |
| price display | **0** price strings (Amazon ToS) |
| tag leak in live HTML | **0** `tag=colorcombinations-20` (control: 6 'colorcombinations' matches — grep works) |
| `/go/` gate (SAFE probe: no Sec-Fetch, no token, forged token) | `/go/b/…`, `/go/p/…`, `/go/prime` all 200 interstitial; forged `t=ZZZZZZ` refused; **nothing reached amazon with `tag=`**. No click manufactured. |
| 404 | real 404 (control: a page we DO build → 200) |
| sitemap | `/sitemap.xml` 301 → `/sitemap-index.xml`, which robots.txt declares |

### 🟢 P2 — filed, not fixed (proportionality)

- **Inline product/book TITLE links 18–37px** on /palettes/ (no class, plain `<a>`).
  Each has a sibling 44px button AND an 84px cover image to the same href, so the
  money path has adequate targets. Forcing 44px on inline title text would inflate
  the compact sidebar for little gain.
- **`form-action ... https://forms.example.com` in the production CSP** — a
  placeholder domain left in a live security header.

### Not re-proposed
Scroll-reach / CTA-position analysis — already done, per the task.
