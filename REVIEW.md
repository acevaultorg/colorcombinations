# Review: `cloud/gap-colorcombinations-2026-09-30`

Reviewed 2026-09-30. The branch is 4 commits by an earlier session on top of `main` at `d9f4480`, plus 3 fix commits from this review. Not merged, not deployed.

## What I checked

**Build and page count**
- `npm run build` on `main`: exit 0, 2192 `.html` pages.
- `npm run build` on this branch, before and after my fixes: exit 0, 2192 `.html` pages. No pages were added or removed.
- The only build warnings are TypeScript/Astro hints that also appear on `main`.

**Things that must not change (compared in the built `dist/`, `main` against this branch)**
- Every `/go/` and Amazon `href`, with the count of each: identical.
- Affiliate tag: identical (`colorcombinations-20`).
- Canonical tags on all pages: identical.
- `robots.txt` and the sitemap files: byte-identical.
- The repo's guards all pass: `amazon-tracking-guard` (45,012 links on 1,527 pages), `verify-beacon-coverage`, `test-page-class` (43/43), and the Mediavine exclusion guard.

**Prices**
- The repo has no live Amazon price source: no Creators API client and no price fields for Amazon products. The "Ask Amili" embed is a site search, not a price feed.
- The page shows no prices anywhere. Every changed Amazon button says "See price on Amazon", which is correct when there is no live price.

**HTML**
- I read the full diff. Tags are balanced, and the reused book-detail block renders once per card.
- The `aria-label` on the /books/ buttons still contains the visible label, so voice control works.

**Layout at 375px and 390px**
- I measured the changed pages in Chromium: /books/, two book pages, a palette page, a pairing page, /data/, /random/ and /colors-that-go-with/beige/.
- No page scrolls sideways.
- Every changed button or link is at least 44px tall.
- The only element wider than the screen is the existing data table on `/data/sanzo-wada-wcag-contrast/`. It scrolls inside its own box and is the same on `main`.

**Wording**
- I read every new line a visitor sees. It all comes from the book records already in the repo.
- There are no card ids, internal labels, "Amili" mentions, hype or new claims.

## What I fixed (3 commits)

1. **Sticky buy bar on phones cut the book title to a few letters.** The longer "See price on Amazon" label on one line took 193px at 375px. That left 106px for the title, which showed as "Interaction…", and cut the "Amazon affiliate link" note to "Amazon affiliate …". The disclosure should never be cut off.
   - Fix: the button label now sits on two short lines ("See price / on Amazon"). It is still 44px tall, and the title gets 191px.
   - File: `src/components/StickyBuyBar.astro`.
2. **The book-list button wrapped on phones.** On pairing pages, /data/ and elsewhere, "See price on Amazon ↗" broke onto two lines at 375px. That made the button 56px tall and left the arrow alone on the right.
   - Fix: the label stays on one line below 640px. I measured it at 183×44px and it does not overflow.
   - File: `src/components/FurtherReading.astro`.
3. **One reason line assumed the reader knew who "Finlay" was.** The "On Color" reason ended with "Sits next to Finlay on a serious shelf." The branch now shows that line on palette pages, where Finlay's book isn't listed.
   - Fix: it now reads "A good companion to Victoria Finlay's Color, also on this shelf."
   - File: `src/config/monetization.ts`. This changes only that one text field.

I retook all screenshots in `review/` at 375px and 390px. The close-up shots hide the sticky header and bar so they don't cover the block being shown.

## Ready to go live?

**Yes, once a human has looked at the points below.** The build is clean, the page count hasn't changed, and the affiliate links, tag, tracking, disclosures, canonicals, robots.txt and sitemap are identical to `main`. The button wording follows the no-live-price rule, and the phone layout problems I found are fixed.

Worth a human glance before shipping:
- **Wada Vol. 1 reason line.** It tells visitors every plate is free to browse on the site and to buy the book "for the object rather than the data". It's honest and calm, but it now shows on /books/ and on some palette pages. Keep it only if that candour is wanted there.
- **Taller palette-page book card.** On phones the card is about 230px taller. Check that the sidebar still reads calmly on a real device.
- **Book covers.** The screenshots were taken with third-party requests blocked. Open Library covers show as initials, and the sticky bar thumbnail shows as a broken-image box. On the live site the covers load as they already do elsewhere. Check one book page and the sticky bar on a real phone after deploy.


---

# Review: `cloud/growth-colorcombinations-2026-09-30` (2026-09-30)

Reviewed the five commits this branch adds on top of `main` (d9f4480): title/description sizing, pairing-guide links on the colour-family pages, schema on `/colors-that-go-with/`, and a generated `/llms.txt`. Nothing was merged or deployed.

## What I checked

| Check | Result |
|---|---|
| `npm run build` on `main` (baseline, `astro build`) | exit 0, 2,192 `.html` files |
| `npm run build` on this branch, after my fixes | exit 0, 2,192 `.html` files; the file list is identical to `main` (no pages added or removed) |
| `astro check` | 0 errors, 0 warnings, 13 hints (same as before) |
| Repo guards: `amazon-tracking-guard`, `test-page-class`, `verify-beacon-coverage`, Mediavine exclusion guard | all OK (45,012 affiliate links on 1,527 pages tracked; 43/43 page classes) |
| Affiliate links, `/go/` routes, canonicals, analytics snippets, "View on Amazon" / "See price on Amazon" labels across all 2,192 pages | byte-identical to `main` (hashed the extracted sets from both builds) |
| Hardcoded prices (`$nn.nn`) in built HTML | none, on either build |
| `robots.txt`, `sitemap-index.xml`, `sitemap-0.xml`, `sitemap-ai.xml` | byte-identical to `main` |
| Diff read line by line for broken HTML, jargon, internal labels, card ids | no broken markup; visitor text is plain; no "Amili", card ids or internal labels on any page |
| All 69 collection meta descriptions | 93–159 characters, each ends in a full sentence |
| `/colors-that-go-with/` ItemList schema | same 54 names, order and URLs as the links on the page |
| `llms.txt` output | counts match the data; compared with the old hand-written file for anything dropped |
| 375px and 390px (Chromium, all outside requests blocked) | no horizontal overflow on any changed page; new guide links are 63px tall, 20px side gutter |

## What I fixed

1. **Guides filed under the wrong colour family** (`src/pages/colors/[hue]/index.astro`, commit b5c27a8). The hex classifier put "Colors that go with Emerald Green" and "Charcoal Grey" under *blue*, "Beige", "Tan" and "Universal Khaki" under *orange*, "Cream" and "Melodious Ivory" under *yellow*, and "Blush" under *red*. On a colour site that looks wrong to any visitor. These eight are now placed by their name (green, neutral, brown, pink). Result per page: red 4, orange 5, yellow 4, brown 6, pink 3, green 9, blue 7, purple 6, neutral 10 — all 54 guides, each exactly once.
2. **`llms.txt` dropped a few pages the old file listed** (`src/pages/llms.txt.ts`, commit c7f19f3): added `/glossary/`, `/random/`, the German guide `/de/farben-kombinieren/`, and `/feed.xml`.
3. `SUMMARY.md`: updated the two lines about the family placement so they match the fix.
4. Retook all 24 screenshots in `review/` from the fixed build (the colour-family ones now crop to the new section).

## Noted, not changed (outside this branch's diff)

- The setting pills on `/colors-that-go-with/` ("Cloud Dancer for walls" …) are 34px tall (the colour heading links 28px), under the 44px target. They were like this on `main` and this branch does not touch them; worth a separate small change.
- Titles that were over 60 characters now drop the " — The Dictionary of Color Combinations" suffix (about 1,200 pages, e.g. `/colors/blue/` is now "Blue Color Combinations"). This is deliberate and explained in SUMMARY.md, but it is a site-wide search change a human should agree with.

## Ready to go live?

**Yes**, once a human agrees with the site-wide title change above. The build is clean, the page set is unchanged, every affiliate/analytics/canonical/robots/sitemap output is identical to `main`, no prices are hardcoded, the visible text is plain, and the new section works at 375px and 390px. Deploying stays a human step; this review did not deploy.
