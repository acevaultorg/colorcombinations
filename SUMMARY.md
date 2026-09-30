# Gap sweep — colorcombinations.org — 2026-09-30

Branch: `cloud/gap-colorcombinations-2026-09-30` (branched from `main` at `d9f4480`). Not merged, not deployed.

**Freeze check:** The only freeze note in the repo is the Mediavine one in `.claude/state/MONETIZATION_STACK.md`: "freeze provider settings through 2026-09-25". That date has passed, and none of these changes touch ad or provider settings. `package.json` also notes that GitLab CI minutes run out until 2026-10-01, so a push to `main` would not deploy. That doesn't matter here because this branch deploys nothing.

## What changed, ranked by expected effect

### 1. Amazon buttons now say "See price on Amazon" (site-wide)
- **Why:** The repo has no live price data: no Creators API or price feed, and no price fields in `src/config/monetization.ts`. The buttons said "View on Amazon" or "See on Amazon", and the /books/ links said "Find <title> on Amazon →". None of those tell the visitor what the click gives them. The new label is the one the rules require when there is no live price. It answers the visitor's first question at the point of click on every commerce page: 16,349 button instances across the built site.
- **Files:** `src/components/FurtherReading.astro`, `src/components/PaintThisPalette.astro`, `src/components/StickyBuyBar.astro`, `src/pages/books/[slug].astro`, `src/pages/books/index.astro`. On /books/, the link also gets an `aria-label` that includes the book title, so screen readers can tell the eleven links apart.
- **Not changed:** The inline sentence links "Get Sanzo Wada's 1933 Dictionary on Amazon →" on `/` and `/browse/` are text links in a sentence, not buttons, so I left them. The German page's "Bei Amazon ansehen" is also untouched.

### 2. The book card on every palette page now helps the visitor decide (all 378 `/palettes/` pages)
- **Why:** The "Go deeper on colour" card in the palette sidebar is the block the sticky buy bar mirrors. It showed only a cover, author, title and a small button, with no edition and no reason to buy. It now shows:
  - the edition note (`book.note`)
  - the shelf's reason for the book (`book.why`), from the existing FURTHER_READING record
  - a full-width 44px "See price on Amazon" button. Above 640px it used to be about 26px tall.
  - a "More about this book" link to the book's own `/books/<slug>/` page. According to the repo's notes, that is the site's best-converting template. The link appears only when that page exists.
- **Files:** `src/components/FurtherReading.astro`. The `full` and `compact` variants render exactly as before. I only moved their note, reason and buttons into a shared fragment.

### 3. Shelf pages answer "which book?" without extra clicks
- **Why:** The /books/ cards showed title and publisher but not why each book is on the shelf, so a visitor had to open each of the 11 pages to compare them. Each card now shows its `why` line. On the 11 book pages, the "Also on the shelf" rail was three plain text boxes. It now shows the covers the shelf already uses (self-hosted, or from Open Library as elsewhere on the site, with the same initials fallback) and each book's edition note.
- **Files:** `src/pages/books/index.astro`, `src/pages/books/[slug].astro`.

All text comes from data already in the repo. No new facts, specs or prices were added.

## Kept exactly as they were
Affiliate tag, every `/go/` href and `?c=` page class, `rel`, `data-event`/`data-book`/`data-from` attributes, all disclosures, analytics (`amazon-track.js`), robots.txt, sitemap logic, and canonicals. The repo's own guards pass on the new build:
- `amazon-tracking-guard`: OK, 45,012 affiliate links on 1,527 pages, all tracked and gated
- `verify-beacon-coverage`: OK
- `test-page-class`: 43/43 classes, 100% of links covered
- Mediavine exclusion guard: OK

## Build and page counts
| | Before | After |
|---|---|---|
| `npm run build` exit code | 0 | 0 |
| `.html` pages in `dist/` | 2192 | 2192 |

No pages were added or removed. An internal-link crawl of `dist/` found no broken links; the only two hits were JavaScript template strings, not real hrefs.

## Screenshots (`review/`, 375px and 390px wide, 2× scale)
- `books-375.png`, `books-390.png`: /books/ full page
- `books_interaction-of-color-*.png`, `books_a-dictionary-of-color-combinations-*.png`: book pages, full page
- `palette-book-card-*.png`: the new sidebar book card on `/palettes/akane-tokiwa/`
- `palette-studio-block-*.png`: the "Taking … off the screen" block with the new button labels
- `palette-sticky-bar-*.png`: the phone sticky bar with the new label
- `pairing-book-shelf-*.png`: the full shelf on `/colors-that-go-with/beige/bedroom/`

No page scrolls horizontally at either width (`scrollWidth` equals the viewport width). Measured button heights: 44px for the book buttons, the "More about this book" link and the sticky bar button; 52px for the studio buttons.

The screenshots used the preinstalled Chromium against a local static server with third-party requests blocked, so Open Library covers show the initials fallback and no ads load. On the live site the covers load as they already do elsewhere.

## Skipped, and why
- **Live prices / "View on Amazon":** there is no price source in the repo, and wiring the Creators API needs credentials and an integration that don't exist here. Once a live price source is added, buttons that carry a price should switch to "View on Amazon".
- **Product images for the art-supply shelf:** it uses drawn icons on purpose, because `monetization.ts` says Amazon images may only be used through the official API. Real photos need that API.
- **/books/ card layout at 375px:** the reason line sits in the narrow column beside the cover, which makes cards taller. It's readable, but a human may want the text to run under the cover on phones.

## What a human should check before this goes live
1. The sticky bar's longer label leaves less room for the book title at 375px ("Interaction…"). Decide whether that's acceptable, or shorten the button padding.
2. The palette-page book card is taller (about 230px more at 375px: 372px → 606px). The sticky bar hides while this card is on screen, which is unchanged. Check that the page still reads calmly.
3. Look at the Wada Vol. 1 reason line, which is now shown on /books/ and on palette pages that rotate to it. It openly says the plates are free on the site. That was deliberate in the data, but it now appears in more places.
4. Confirm the change in button wording on the affiliate dashboard / GA4 after deploy. Tracking is href-based, so no events should change.
