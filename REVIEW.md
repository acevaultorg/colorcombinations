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
