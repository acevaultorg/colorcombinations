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
