> Round cc-adsense-trends (2026-10-22) is first below. Earlier rounds follow it unchanged; round 2 is in `SUMMARY-R2.md`.

# Payoff round cc-adsense-trends — colorcombinations.org — 2026-10-22

Branch: `claude/adsense-readiness-trends-3juw15`, cut from `main` at `f60fe0a`. Nothing is merged or deployed. The task named `cloud/selfgap-colorcombinations-2026-10-22-1409`, but this session is locked to the branch above, so the work is there.

**Freeze/HOLD check:** the only freeze note in the repo is Mediavine's "freeze provider settings through 2026-09-25" in `.claude/state/MONETIZATION_STACK.md`. That date has passed, and nothing here touches ad provider settings. No HOLD note covers the /trends/ pages.

## Which change should move the metric, and how to read it

**The change:** a "Keep exploring" block on all three /trends/ pages, placed right after the list a visitor came for:
- `/trends/color-trends-2027/`: after the 14 pick cards, before the Rewild section
- `/trends/color-trends-2026/`: after "Every 2026 Color of the Year"
- `/trends/pantone-color-of-the-year/`: after the full list and its "How the match works" note

Each block has three real archive palettes, each made of the closest archive colours to that page's picks (for example "Closest to Rose Earth and Luminous Blue"), plus two large links to the other two trend reports. Before this change, the 2027 page's cards ran about 25 phone screens. The only way on was a small text link in each card, followed by sources, FAQ and books. Nothing invited a second page.

**Expected move:** pageviews per visit 2.35 → 2.45–2.60 within 21 days (whole site). The /trends/ landers bring about 700 landing sessions in 30 days according to the repo's notes, and earlier notes measured /trends/ landers at 1.26 pv/session.

**How to read it after deploy:**
1. GA4 → Explore: landing page contains `/trends/`, metric "Views per session". Compare the 21 days after the deploy date with the 21 days before.
2. GA4 events: the block's links carry `data-event="next_step_click"` with `data-variant` = `trends-2027-next` / `trends-2026-next` / `trends-pantone-next`. The site's existing click listener in `BaseLayout.astro` sends these to GA4 (`next_step_click`, parameter `variant`, plus `url`) and to Clarity, so clicks per block can be counted directly. No new analytics code was added.
3. Site-wide pv/visit is the NORTH_STARS figure (17,995 pv / 7,648 sessions over 30 days).

## AdSense review readiness

| Check | Result | Action |
|---|---|---|
| Privacy, about, contact and terms pages exist and are linked | Pass. All four are in the footer of every page (`SiteFooter.astro`). Privacy and terms already name Google AdSense, its cookies, Google's partner-sites page and the ad-settings opt-out, because `AD_PROVIDER` is `"adsense"`. | None |
| No ads on policy and buy-only pages | Pass. `BaseLayout.astro` does not load `adsbygoogle.js` on /about, /contact, /privacy, /terms, /copyright, /random, /gift-guide, /books/*, /shop/* or noindex pages. 1,533 of the 1,555 sitemap URLs load it. | None |
| ads.txt | Pass. `dist/ads.txt` has the Google line `pub-7449214764048186`. The Mediavine `/ads.txt` redirect is commented out in `dist/_redirects`. | None |
| Sitemap has no noindex, missing or duplicate pages | Pass. 1,555 URLs, 0 missing files, 0 noindex, 0 duplicate titles, 0 duplicate meta descriptions. Median main-text length is 1,548 words. | None |
| Thin pages in the sitemap | **Needs a human.** 13 URLs have under 300 words of main text, and all 13 already carry no ads: 11 /books/ pages (79–292 words, mostly a cover, the edition note and a buy button), /contact/ (123) and /random/ (254). Google reviews the whole site, and thin affiliate pages are a common reason for a "low value content" rejection. | Not fixed. Fixing it means either writing real reviews for the 9 short book pages (the repo has only `note` and `why` for each book, and new facts must not be invented) or taking /books/<slug>/ out of the sitemap. Sitemap logic is frozen for this round, and the repo's notes call /books/ the best-converting template, so this is the owner's call. |
| Ads only below buy blocks, never above or between them | **Cannot be enforced in code.** The site runs AdSense **Auto ads** (one script, no manual units), so Google chooses where units go. That can include above the "Mix the 2027 colours by hand" Amazon block near the top of the trends pages, or between the AmazonPick and PaintThisPalette blocks. The repo has no ad slot IDs, so manual units cannot be placed here without inventing IDs. This round added no ad code. | In AdSense → Ads → colorcombinations.org → Edit: either (a) turn off in-page Auto ads and create a display unit, then send its `data-ad-slot` id so a kit ad slot can be placed only after the buy blocks; or (b) at minimum, use the preview's "remove ad" control or page exclusions on positions above buy blocks. |
| Leftover Mediavine markup | `mv-content` class strings remain on two /trends/ sections as styling hooks (CSS selectors). Mediavine scripts and the blocklist div only render when `AD_PROVIDER === "journey"`. | None. They are harmless, and no Mediavine or Journey code was brought back. |

## What changed (files)
- `kit/next-step.mjs` (new kit block, documented in its header): `renderNextStep()` plus `NEXT_STEP_CSS`. It is a site-local Amili Kit block: calm card list, inline SVG arrow in `currentColor`, tap targets of 44px or more, no buy button or ad slot inside, and it renders nothing when it has nothing to link to. It is not vendored from fleet-kit; the header says how to promote it.
- `src/lib/trendPalettes.ts` (new): matches each trend hex to its nearest archive colour (CIELAB, the same method the Pantone page already uses), then picks palettes greedily so the three show different trend colours. It is deterministic, and every name and colour comes from `src/data`.
- `src/pages/trends/color-trends-2027.astro`, `color-trends-2026.astro`, `pantone-color-of-the-year.astro`: import the block and place it after the pick lists.
- `review/next-step-*.png`: screenshots.

**Kit blocks:** added `kit/next-step.mjs`. The pages also still use the existing `kit/product.mjs`, through `AmazonPick` and `PaintThisPalette`; both are untouched.

**Unchanged:** affiliate tag, every `/go/` route, disclosures, analytics snippets, robots.txt, sitemap logic, canonicals, `BaseLayout.astro`, ad provider config. No prices anywhere in the new block. No new pages.

## Build and page counts
| | Before (`main` f60fe0a) | After |
|---|---|---|
| `npm run build` exit code | 0 | 0 |
| `.html` files in `dist/` | 2,218 | 2,218 |
| Sitemap URLs | 1,555 | 1,555 |

Guards on the new build: `amazon-tracking-guard` OK (47,523 affiliate links on 1,548 pages); `verify-beacon-coverage` OK. All nine linked palette pages exist in `dist/`.

## Screenshots
Taken with the preinstalled Chromium (Playwright) against a local static server of `dist/`, at 2× scale with third-party requests blocked, so no ads or covers load:
- `review/next-step-trends_color-trends-2027-375.png`, `-390.png`
- `review/next-step-trends_color-trends-2026-375.png`, `-390.png`
- `review/next-step-trends_pantone-color-of-the-year-375.png`, `-390.png`

At both widths no page scrolls sideways (`scrollWidth` = viewport) and the smallest tap target in the block is 85px tall.

## Skipped, and why
- **Manual ad slots below buy blocks:** no slot IDs in the repo. See the table.
- **Thin /books/ pages:** needs real writing or a sitemap decision. See the table.
- **"The same colour in other trends" per colour:** each trend page keeps its picks inside its own file, and the 2027 hexes are mostly unpublished. The block therefore links to the other two reports as a whole instead of claiming colour-by-colour overlaps.
- **No measurement taken**, as instructed.

## What a human must check before it goes live
1. Read the three blocks on the live preview, and check that the palette choices read as sensible next steps.
2. Decide the AdSense placement question (Auto ads vs. one manual unit below the buy blocks).
3. Decide what to do with the 9 short /books/ pages before requesting an AdSense review.
4. Deploy with `bash deploy.sh` as usual. Do not push to main expecting CI to deploy.

---

> Round 2 (2026-10-01) is summarised in `SUMMARY-R2.md`. Below are both round-1 summaries, gap sweep first, growth sweep second.

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
