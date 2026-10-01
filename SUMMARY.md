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
1. (Resolved in review) The sticky bar's label now wraps to two lines, so the book title shows in full at 375px.
2. The palette-page book card is taller (about 230px more at 375px: 372px → 606px). The sticky bar hides while this card is on screen, which is unchanged. Check that the page still reads calmly.
3. Look at the Wada Vol. 1 reason line, which is now shown on /books/ and on palette pages that rotate to it. It openly says the plates are free on the site. That was deliberate in the data, but it now appears in more places.
4. Confirm the change in button wording on the affiliate dashboard / GA4 after deploy. Tracking is href-based, so no events should change.

## Review follow-up (same day)
A review pass added three small fixes. `REVIEW.md` has the details.
- `src/components/StickyBuyBar.astro`: the button label wraps to two lines. The book title and the "Amazon affiliate link" note are no longer cut off at 375px.
- `src/components/FurtherReading.astro`: on phones, "See price on Amazon ↗" stays on one line in book lists instead of wrapping inside the button.
- `src/config/monetization.ts`: the "On Color" reason now names Victoria Finlay's book instead of just "Finlay".

After these fixes the build exits 0 with 2192 pages. Affiliate hrefs, canonicals, robots.txt and the sitemap are identical to `main`, and all repo guards pass. The screenshots in `review/` have been retaken at 375px and 390px.


---

# Growth sweep, second pass: search and AI-assistant traffic (2026-09-30)

Branch: `cloud/growth-colorcombinations-2026-09-30`. Not merged and not deployed.

## How the three changes were chosen

I built the site and audited all 2,192 generated HTML pages (1,533 of them indexable). For each page the audit looked at the title, the meta description, the JSON-LD types and how many internal links point to it. I also read the notes in `.claude/state/`. I used only data already in the repo and fetched nothing from outside.

The audit found these gaps:

| Finding | Scale |
|---|---|
| Titles longer than 60 characters, mostly because of the 39-character " — The Dictionary of Color Combinations" suffix | 1,276 indexable pages, including every `/colors-that-go-with/` page and 347 of 378 palettes |
| Collection meta descriptions that were the whole intro paragraph | All 69 collections, 304–866 characters |
| The 54 "colors that go with X" guides (the site's answer to its most common question) had few links pointing at them | 14 internal links each, all from their own index or their own child pages |
| `/colors-that-go-with/` index had no ItemList or BreadcrumbList schema, and its title was "Colors That Go With — pairing guides by color & setting" | 1 hub page, linked from every page |
| `/llms.txt` was hand-written in April and had fallen out of date | It listed 5 `/learn/` articles (there are 15) and gave 60 collections in one place and 69 in another. It never mentioned `/colors-that-go-with/` (756 pages, the largest page family) and left out trends, paintings, compare and books. |
| robots.txt and sitemaps | Already correct: AI crawlers are allowed and both sitemaps are referenced. Left untouched as required. |

## What changed

### 1. Titles and meta descriptions sized for search results
- `src/layouts/BaseLayout.astro`: the brand suffix is added only when the full title fits in 60 characters. Otherwise the page's own title is used alone. The brand still reaches search engines through `og:site_name` and the WebSite/Organization JSON-LD. Result: indexable titles over 60 characters dropped from **1,276 to 70**. The remaining 70 are pages whose own title is already long.
  - Example: "Colors That Go With Beige for living room — The Dictionary of Color Combinations" (80 characters) becomes "Colors That Go With Beige for living room".
- `src/pages/collections/[slug].astro`: new meta description built from the collection's tagline and its real palette count, for example "Fallen leaves, persimmons, burnt umber, late harvest. 24 palettes with hex codes, based on Sanzo Wada's 1933 color dictionary." Length is now 93–159 characters (was 304–866). The on-page intro, FAQ and JSON-LD are unchanged.
- `src/pages/browse.astro` (the site's busiest landing page): the title goes from "Browse all palettes" to "Browse 378 Color Palettes by Hue, Era & Mood". The description is shorter and names only filters the page actually has.

### 2. Internal links and schema for the "colors that go with" guides
- `src/pages/colors/[hue]/index.astro`: each of the 9 colour-family pages (`/colors/red/` … `/colors/neutral/`) now has a "What goes with each {hue} shade?" section. It links to the pairing guides whose reference colour falls in that family, 3 to 10 per page and 54 in total. Family is decided by the site's existing `classifyHue()` (now exported from `src/data/colors.ts`), except for eight everyday names the classifier would misfile (for example Emerald Green, Beige, Blush), which are placed by name (fixed in review, see REVIEW.md). Guides are filtered by the same quality rule that decides whether a guide page gets built, so no link can point at a page that does not exist.
- `src/pages/colors-that-go-with/index.astro`:
  - New title "What Colors Go Together? 54 Pairing Guides" and a shorter description.
  - Added BreadcrumbList and an ItemList of the 54 guides, in the same order, with the same names and URLs as the links on the page.

### 3. `/llms.txt` generated from the site's data
- New file `src/pages/llms.txt.ts`; removed `public/llms.txt`. The file is now built by `astro build` itself, so the GitLab CI path (`npx astro build`) ships it too.
- Every count is computed from the data modules. Article and tool titles and descriptions are read from each page's own source. Two pages build their titles at build time; for those the text is taken from the pages' own wording.
- It opens with the common questions the site answers and the URL pattern for each, then lists all 54 pairing guides, all 69 collections, all 15 articles, the trends, compare and data pages, the tools, books, the API/CSV endpoints, the source and license, and the contact address.

## Files touched
- `src/layouts/BaseLayout.astro`
- `src/pages/collections/[slug].astro`
- `src/pages/browse.astro`
- `src/pages/colors/[hue]/index.astro`
- `src/data/colors.ts` (the `export` keyword only)
- `src/pages/colors-that-go-with/index.astro`
- `src/pages/llms.txt.ts` (new)
- `public/llms.txt` (deleted; replaced by the generated file at the same URL)
- `review/*.png` (screenshots), `SUMMARY.md`

## Build and page counts
- Build before: `npm run build` exited **0**, **2,192** `.html` files.
- Build after: `npm run build` exited **0**, **2,192** `.html` files. I compared the full file lists and they are identical, so there are no new or removed pages. `astro check`: 0 errors, same hints as before.
- Guards run on the final build:
  - `amazon-tracking-guard`: OK, 45,012 links on 1,527 pages.
  - `test-page-class`: 43/43 classes, 100% of links covered.
  - `verify-beacon-coverage`: OK.
  - Mediavine exclusion guard: OK.
- Not touched: affiliate tags, `/go/` routes, disclosures, analytics snippets, `robots.txt` (`dist/robots.txt` is byte-identical to `public/robots.txt`), sitemap config and `sitemap-ai.xml`, canonicals, prices and Amazon buttons. No Amazon or `/go/` line appears in the diff.

## Screenshots
Taken with the preinstalled Playwright/Chromium against the built `dist/` served locally. All requests to other sites were blocked, so no analytics, ads or affiliate calls fired. 24 files are in `review/`, each at 375px and 390px wide:
- `colors-{red,orange,yellow,brown,pink,green,blue,purple,neutral}-{375,390}.png`: scrolled to the new pairing-guides section.
- `colors-that-go-with-index-*.png`, `browse-*.png`, `collections-japanese-*.png`: top of page. The changes on these pages are in the head (title, description, JSON-LD), so they look the same as before; the screenshots confirm the pages still render.

Measured on every page at both widths: no horizontal overflow. The smallest new link is 63px tall, above the 44px minimum.

## Skipped, and why
- **robots.txt:** left exactly as it is, per the rules. It names `Googlebot-Extended`; Google's documented token is `Google-Extended`. It also lacks explicit lines for `OAI-SearchBot`, `ChatGPT-User`, `Claude-SearchBot`/`Claude-User` and `Perplexity-User`. All of these are already allowed by `User-agent: * / Allow: /`, so nothing is blocked today. A human may want to correct the token.
- **Other long meta descriptions:** for example, 702 `/colors-that-go-with/{color}/{setting}/` descriptions are about 210 characters. Their first sentence already answers the query, so search results cut them after the useful part. That is lower value, and I left them alone rather than trim hundreds of descriptions mechanically.
- **`/api/learn.json`:** still lists 6 of the 15 articles. It is a separate API with its own schema version, so I did not change it; `llms.txt` now lists all 15.
- **Homepage and `/colors/` index titles:** left as they are. The homepage title was tuned deliberately (see the BaseLayout comments), and the `/colors/` title is long but specific.

## What a human should check before this goes live
1. **The title change is site-wide.** About 1,200 pages lose the " — The Dictionary of Color Combinations" suffix; short titles keep it. Spot-check a few in Search Console afterwards. Titles that Google rewrites should settle within a few weeks. Pages whose own title already contains the brand, such as the homepage and the two Wada book pages, are unaffected.
2. Read `https://<preview>/llms.txt` once and confirm you are happy listing the contact email there. It was already in the old file.
3. Look at one colour-family page, for example `/colors/neutral/`, on a phone and confirm the guide list reads naturally.
4. Deploy as usual. CI's `npx astro build` now produces `llms.txt`; nothing else in the deploy path changed.
