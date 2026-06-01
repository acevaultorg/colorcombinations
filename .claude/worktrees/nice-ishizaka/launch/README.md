# Launch ammunition

Everything you need to post ColorCombinations to the distribution channels
named in GROWTH.md, without writing copy from a cold start.

All files below are copy-paste ready. The order is roughly the order of
highest-leverage actions.

| File | Platform | Time to post | Traffic potential |
|---|---|---|---|
| [`hacker-news.md`](./hacker-news.md) | Show HN | 10 min | 10k–50k in 24h if it ranks top-10 |
| [`social-thread.md`](./social-thread.md) | Bluesky · Mastodon · Threads · X | 15 min | Depends on account; reusable across platforms |
| [`reddit-r-web_design.md`](./reddit-r-web_design.md) | r/web_design (large dev-design sub) | 10 min | 2k–10k |
| [`reddit-r-design.md`](./reddit-r-design.md) | r/design (very large general-design sub) | 10 min | 2k–15k |
| [`reddit-r-graphic_design.md`](./reddit-r-graphic_design.md) | r/graphic_design (working designers) | 10 min | 1k–5k |
| [`producthunt.md`](./producthunt.md) | Product Hunt | 30 min | 1k–3k, converts well |
| [`linkedin.md`](./linkedin.md) | LinkedIn native post | 15 min | Brand / agency audience; different from HN |
| [`indiehackers.md`](./indiehackers.md) | Indie Hackers Show IH | 15 min | Maker community; values transparency |
| [`cold-email-design-blogs.md`](./cold-email-design-blogs.md) | Smashing / Sidebar.io / CSS Weekly / others | 5 min / outlet | Long-tail backlinks |
| [`gumroad-product-description.md`](./gumroad-product-description.md) | Gumroad product page | 5 min | Conversion, not traffic |
| [`content-calendar-7d.md`](./content-calendar-7d.md) | Bluesky / Mastodon / Threads drip | 5 min/day | Keeps flywheel turning after launch-day peak |

## The revenue flywheel (how €100 happens)

1. **Gumroad product description → live product.** First the $3-$5 tip-jar
   bundle needs to exist as a purchasable thing. Without this, zero of the
   traffic below converts into money. 5 minutes.
2. **Show HN post.** Biggest single traffic blast available. A top-10 HN
   ranking → ~20k–50k visitors in 24h → at a conservative 0.3% bundle-conversion
   rate × €5 average = €30–€75 from HN alone. This is the single most
   probable path to the first €100. Post on a Tuesday-Thursday morning
   Pacific time; re-post once if it doesn't rank.
3. **Social thread (Bluesky / Mastodon / Threads) + r/web_design (same
   day as HN).** These amplify and keep the flywheel turning after HN
   drops off the front page. X is optional — organic reach without paid
   boost is poor in 2026.
4. **Bookshop affiliate + Clarity + GA setup.** Don't block the launch on
   these — they're measurement + tail-revenue. Do them before the launch
   if you have 30 extra minutes; otherwise same-week.

**Don't launch on a Sunday.** HN weekend traffic is thin; Reddit design
communities are most active Tue–Thu.

## Hygiene checks before you post anything

- The three placeholders in `src/config/monetization.ts` resolved:
  `BUNDLE.checkoutUrl`, `BOOKSHOP.affiliateId`, at least one of
  `ANALYTICS.plausibleDomain / gaMeasurementId / clarityProjectId`.
- `colorcombinations.org` loads in incognito, renders in under 2 seconds,
  no console errors.
- `/shop` and `/blog/how-to-use-sanzo-wada-in-modern-design` both 200.
- A random Wada plate (e.g. `/palettes/wada-174-corinthian-pink-grayish-lavender-b/`)
  opens, exports copy to clipboard, and the BundleCta points somewhere real.

If any of those fail, **fix before launching**. A 50k-visitor blast onto a
broken checkout is a one-time failure you can't re-acquire.
