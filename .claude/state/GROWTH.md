# GROWTH — ColorCombinations

State file for the Growth Engine. Read on creation directives and `god --launch`.

## Positioning

**Product:** The Dictionary of Color Combinations
**Target users:** Designers (primary), developers, artists, brand agencies
**Wedge:** Heritage + curation + story — not a random palette generator
**Cost to use:** Free

## Channels

| Channel | Status | Why | Owner |
|---|---|---|---|
| Organic SEO (EMD + per-palette pages) | 🟢 ready | 30 indexable landing pages, JSON-LD, sitemap | [automated] |
| Hacker News (Show HN) | 🔴 pending | Heritage angle + free tool — strong HN fit | [👤 human] |
| Designer communities (r/Design, r/web_design) | 🔴 pending | Visual content + niche reference | [👤 human] |
| Twitter / Threads / Mastodon | 🔴 pending | Palette-per-day content loop | [👤 human] |
| Newsletter (weekly palette) | 🔴 not wired | EmailCapture component ready, needs provider | [👤 human] |
| Print-on-demand affiliate | 🔴 deferred V2 | Printful/Gelato for palette posters | [deferred] |
| Pinterest | 🔴 deferred V2 | Each palette is a pinnable image | [deferred] |
| Guest posts on design blogs | 🔴 pending | Smashing, CSS-Tricks, Css Weekly | [👤 human] |

## Funnel (target)

```
Organic search
  ↓
Landing on a palette page (/palettes/[slug])
  ↓
Browse 2-3 more (related palettes, browse page)
  ↓
Export action (copy hex / Tailwind / CSS vars / JSON)
  ↓
Email signup (weekly palette newsletter)
  ↓
[Y2] Pro subscription OR print affiliate click
```

## V1 launch sequence (when domain is live)

1. **Technical**: buy `colorcombinations.org`, deploy to Vercel, verify SSL, submit sitemap to Google Search Console + Bing Webmaster
2. **Content**: write 1 launch blog post "Why I built a color dictionary in 2026" + 3 pillar articles (Wada biography, Japanese color theory, how to use historical palettes)
3. **Seeding**: Post Show HN with "Free: 30 curated color combinations from Sanzo Wada's 1933 dictionary tradition"
4. **Communities**: r/web_design, r/graphic_design, r/Design (1 per week, not all at once — mod rules)
5. **Newsletter**: Soft launch via personal contacts, promise 1 palette per week
6. **Measurement**: Plausible analytics, track RPU, bounce, export clicks, newsletter conversion

## Primary KPI

**Revenue Per Unique Visitor (RPU)** — per `REVENUE_MODEL.md`.

V1 baseline target (months 1-3):
- 500 uniques/mo from organic + seeding
- 10% export rate
- 3% newsletter signup rate
- Revenue: ~$0 (foundation, no monetization wired yet)

V1 goal (months 4-12):
- 5,000 uniques/mo from organic SEO maturity
- 15% export rate
- 5% newsletter signup rate
- $50-100/mo from affiliate + early Pro tier beta

Full revenue projections in DECISIONS.md 2026-04-08 (Y1 €4.5k-€15k, Y3 MRR €3.5k-€8k with Config X).

## Content engine (post-launch)

- Weekly: 1 new palette added + 1 newsletter issue
- Monthly: 1 pillar blog post (color theory / Japanese color history / palette usage)
- Quarterly: retrospective on usage patterns, republish top palettes with case studies
- As available: source full Wada 348 catalog, import in batches

## Viral loops

- **Export embed**: when exporting, include optional `/* colorcombinations.org/p/slug */` comment in the Tailwind/CSS output
- **OG image per palette**: every detail page shares its own colors in the preview (currently SVG default, PNG per-palette as a V2 task)
- **Share button**: add `navigator.share()` to palette-detail in V2
- **Iteration**: track which palettes get the most exports and promote them in newsletter

## Ship Log

_Growth-relevant ships from this session:_

- 2026-04-10: V1 static site built. 30 palettes, 34 pages, clean build. Deploy pending domain purchase.
