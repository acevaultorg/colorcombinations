# Self-gap sweep: colorcombinations.org, 2026-10-22

Branch: `cloud/selfgap-colorcombinations-2026-10-22-1301`, branched from `main` at `3ca29ae`. Not merged and not deployed.
Earlier rounds are in `SUMMARY-R1.md` (round 1, 2026-09-30) and `SUMMARY-R2.md` (round 2).

**Freeze check.** The only freeze note in the repo is the Mediavine "freeze provider settings through 2026-09-25" in `.claude/state/MONETIZATION_STACK.md`. That date has passed, and nothing here touches ad or provider settings. The release-guard freeze register that `deploy.sh` checks exists only on the owner's Macs, so `deploy.sh` will check it at deploy time. This branch deploys nothing.

## What changed, ranked by expected effect

### 1. The Vol 1 vs Vol 2 page gets a button for each half of its answer, on the first screen
- **Page:** `/compare/wada-vol-1-vs-vol-2/`. It is the buying-decision page for the site's top two Amazon products (the two Wada volumes).
- **Why:** The page's first lines say "buy Vol 1 if you are new to Wada, Vol 2 if you already own it." Before this change its only buttons were in the shelf at the very bottom, about 4,500px further down at 375px. A visitor who had already decided had to scroll through the whole article to act. The repo's own data says placement matters: commit `0cd58a3` records 16 clicks in 4 days for a button on the first phone screen of /browse/, against 1 for the same button eight screens down on the home page.
- **What a visitor sees:** two short cards under the answer:
  - "New to Wada": Vol 1
  - "Already own Vol 1": Vol 2

  Each card shows the book's title and edition note, taken from the existing shelf records. Each has a 44px "See price on Amazon" button. A one-line affiliate disclosure sits directly under the buttons.
- **Kit:** a new block, `kit/answer-pick.mjs`. It refuses any link that is not a `/go/` route. The links are the same `/go/b/<isbn>?c=compare` routes the shelf at the bottom of the page already uses, and they carry `data-surface="compare-answer"` so these clicks can be told apart from the shelf's.

### 2. Book shelf buttons now match the price shown next to them (1,524 pages)
- **Why:** The shelf (`FurtherReading`, used on palette, colour, pairing, collection, trends, compare and other pages) already shows the live Amazon price from the kit. Its button still said "See price on Amazon" with the price printed right beside it. The button now says "View on Amazon" once a live price is shown. When there is no price (the API has not answered, or the price is older than 23 hours), it keeps "See price on Amazon". That follows the rule for both cases.
- **Kit:** a new block, `kit/buy-label.mjs`. It is CSS only: `:has()` checks the kit's own price slots. Without JavaScript, or in a browser without `:has()`, the button falls back to "See price on Amazon".

### 3. Books with no cover now show their Amazon photo instead of a blank or broken image
- **Why:** Open Library has no cover for two editions on the shelves: *Pantone: The Twentieth Century in Color* (main shelf) and *Werner's Nomenclature of Colours* (reference library). Before this change:
  - The phone sticky buy bar showed a broken-image box for Pantone on 27 palette pages and 15 colour pages.
  - The Pantone book page had an empty cover area.
  - Shelf cards showed grey initials tiles.
- **Fix:** When the cover fails, the image becomes a kit image filled with the live Amazon photo, using the site's existing `/amz/items` route (the Creators API). Nothing is stored or baked into the HTML, which Amazon's image licence requires. If Amazon has no photo either, the old initials tile still shows.
- **Kit:** a new block, `kit/cover-fallback.mjs`. It is used in `FurtherReading`, `StickyBuyBar`, `/books/` and `/books/<slug>/`. The book pages now load `/kit-product.js`, the existing kit script.

## Kit blocks
- **Added:**
  - `kit/answer-pick.mjs`
  - `kit/buy-label.mjs`
  - `kit/cover-fallback.mjs`

  Each sits in its own file with a usage note at the top.
- **Used:** `kit/product.mjs` (its browser script `/kit-product.js` and the `TRANSPARENT` placeholder). The vendored kit files were not edited.

## Files touched
- `kit/answer-pick.mjs`, `kit/buy-label.mjs`, `kit/cover-fallback.mjs` (new)
- `src/components/FurtherReading.astro`, `src/components/StickyBuyBar.astro`
- `src/pages/compare/wada-vol-1-vs-vol-2.astro`, `src/pages/books/[slug].astro`, `src/pages/books/index.astro`
- `review/selfgap-*.png` (14 screenshots)
- `SUMMARY.md` (this file). The previous summary was renamed to `SUMMARY-R1.md` unchanged.

## Build and checks
| | `main` (3ca29ae) | this branch |
|---|---|---|
| `npm run build` exit code | 0 | 0 |
| `.html` pages in `dist/` | 2,218 | 2,218 (identical file list, no new pages) |

- **Affiliate links:** compared page by page across all 2,218 pages. Every `/go/` and Amazon `href` is identical, except for the two new links on the compare page (`/go/b/4861522471?c=compare`, `/go/b/4861527724?c=compare`).
- **Disclosures:** identical everywhere, except one added line on the compare page.
- **Unchanged on every page:** the affiliate tag, canonicals and analytics snippets.
- **Byte-identical to `main`:** `robots.txt`, all three sitemaps, `_redirects`, `_headers`.
- **Repo guards, all OK:**
  - `amazon-tracking-guard`: 47,525 links on 1,548 pages
  - `test-page-class`: 67/67 classes, 100% of links
  - `verify-beacon-coverage`
  - Mediavine exclusion guard
- **Internal links:** no broken internal links in either build. I checked them with a crawl of `dist/`.
- **Prices:** no price is written in source or HTML. Prices appear only from the kit's live answer, with its "as of" time.

## Screenshots (`review/`, 375px and 390px, 2× scale)
`selfgap-compare-top`, `selfgap-compare` (full page), `selfgap-books`, `selfgap-book-pantone`, `selfgap-palette-sticky-pantone`, `selfgap-palette-book-card-pantone`, `selfgap-reference-library-prices`, each at `-375` and `-390`.

How they were taken:
- Built site served locally, viewed in the preinstalled Chromium.
- `/amz/items` was answered by the site's own live endpoint, which is where the real prices and "as of" times come from.
- Amazon's image CDN was **not** contacted. Product photos were replaced by a plain grey stand-in tile, so the screenshots show where the live photo appears, not the photo itself.
- Open Library covers loaded normally. All other third-party requests, including ads, were blocked.

Measured on every changed page at both widths:
- No sideways scroll.
- The new buttons are 44px tall.
- Shelf labels read "View on Amazon" next to a live price.
- The Pantone and Werner covers switch to the kit image.

## Skipped, and why
- **The `AmazonPick` button** (home, /browse/, both trends pages, all 378 palette pages) says "Kuretake Gansai Tambi 48 on Amazon" while it can show a live price. That doesn't match the "View on Amazon" / "See price on Amazon" rule. I left it alone because commit `0cd58a3` placed this button an hour before this sweep, for a click read on Monday. Changing its label now would spoil that read, and the label is the only place the product's name appears. This is a decision for the owner once the read is in. `kit/buy-label.mjs` can do it in one line.
- **Live prices on the book pages and in the paint shelf.** `0cd58a3` records that after a live price was put in the paint shelf, its clicks fell from 13.2 to 1.0 per day. The paint shelf was set back to photo only, so I did not add prices to more surfaces.
- **Product-name links of 37–39px** (paint shelf names, share buttons, filter chips). Each sits beside a 44px button that goes to the same place, so I ranked them below the three changes above.

## What a human must check before this goes live
1. **Compare page, first screen on a real phone.** The two cards push the "At a glance" table down by about 450px (half a phone screen) at 375px. Check that this reads calmly.
2. **Pantone and Werner covers on the live site.** Open a palette page whose sticky bar shows *Pantone: The Twentieth Century in Color* (for example `/palettes/asagi-shu/`), plus `/books/pantone-the-twentieth-century-in-color/`. The real Amazon photo should appear. My screenshots use a grey stand-in.
3. **The label switch.** On any palette page, the sidebar book's button should read "View on Amazon" when a price is shown under it, and "See price on Amazon" when none is.
4. **The `AmazonPick` image area.** On `/palettes/asagi-shu/` the image space above "Make it yourself" looked empty in my run. This is existing behaviour that I did not change. Check on a real device that the photo fills it.
5. **Beacon read.** The new compare buttons report through the same tracker with `c=compare`, with `data-surface="compare-answer"` added. No new `f=` position key was added.
