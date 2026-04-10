# The Dictionary of Color Combinations

A curated archive of historically-grounded color combinations inspired by Sanzo Wada's 1933 Japanese color dictionary. Built as a static site with Astro, Tailwind v4, and TypeScript strict.

**Status:** V1 launch-ready. Build clean, 34 pages, deploy pending domain purchase.

## What's inside

- **30 curated palettes** drawn from traditional Japanese shikisai (色彩) names across five historical eras (Heian → Meiji)
- **34 static HTML pages** — home, about, browse, 404, and one SEO page per palette
- **Client-side filters** on `/browse` (search, era, dominant hue, mood) — no rebuild needed
- **Export component** — copy hex list, Tailwind config, CSS variables, or download JSON
- **Full SEO infrastructure** — per-page JSON-LD (WebSite + CreativeWork + BreadcrumbList), OG meta, Twitter cards, canonical URLs, 33-URL sitemap
- **Accessibility** — skip link, focus-visible outlines, prefers-reduced-motion, aria-live status, automatic swatch text contrast

## Tech stack

- **Astro 5** — static-first, zero JS by default, per-palette page generated at build time
- **Tailwind v4** — via `@tailwindcss/vite` plugin, all design tokens in `src/styles/global.css` `@theme` block (no `tailwind.config.mjs` needed)
- **TypeScript strict** — with path aliases (`@components`, `@layouts`, `@data`, `@styles`)
- **MDX + sitemap** — Astro integrations for content and SEO
- **EB Garamond + Inter** — editorial serif for headlines, clean sans for UI (Google Fonts)

## Running locally

```sh
npm install
npm run dev        # dev server on http://localhost:4321
npm run build      # static build to ./dist
npm run preview    # preview the production build
```

## Project structure

```
colorcombinations/
├── public/
│   ├── favicon.svg         ← 3-dot palette brand mark
│   ├── og-default.svg      ← default social share image
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── EmailCapture.astro   ← newsletter form (ConvertKit/MailerLite-ready)
│   │   ├── ExportPalette.astro  ← 4-format export with clipboard + download
│   │   ├── PaletteCard.astro    ← reusable grid card
│   │   ├── SiteFooter.astro
│   │   └── SiteHeader.astro
│   ├── data/
│   │   └── palettes.ts          ← 30 seed palettes + helper functions
│   ├── layouts/
│   │   └── BaseLayout.astro     ← SEO, JSON-LD, skip link, header, footer
│   ├── lib/
│   │   └── color.ts             ← WCAG contrast, hex helpers
│   ├── pages/
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── browse.astro         ← client-side filter grid
│   │   ├── index.astro          ← homepage: hero + 8 featured + how + newsletter
│   │   └── palettes/
│   │       └── [slug].astro     ← 30 dynamic SEO pages
│   ├── styles/
│   │   └── global.css           ← Tailwind v4 @theme + brand tokens
│   └── types/
│       └── palette.ts           ← Palette, PaletteColor, Era, Mood, DominantHue
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Adding a new palette

Open `src/data/palettes.ts` and append an entry to the `palettes` array:

```ts
{
  slug: "your-slug",
  title: "Display Title",
  titleJa: "日本語タイトル",
  summary: "One-sentence summary (20-200 chars).",
  description: "Longer description for the detail page.",
  era: "edo",              // heian | kamakura | muromachi | edo | meiji | taisho | showa
  moods: ["bold", "warm"], // any of the 9 moods in src/types/palette.ts
  dominantHue: "red",      // any of the 9 hues
  colors: [
    { hex: "#AB1234", nameJa: "紅", nameRomaji: "Kurenai", meaning: "Crimson" },
    // 3-6 colors total
  ],
  featured: true,           // optional — show on homepage
  order: 31,                // optional — display order (lower = earlier)
  usage: ["Where this works"],
  tags: ["optional", "tags"],
},
```

Rebuild — the `/palettes/your-slug` page is generated automatically.

## Deploy to Cloudflare Pages

The domain `colorcombinations.org` is registered with **Cloudflare Registrar**, so deployment uses **Cloudflare Pages** (single ecosystem, no cross-platform DNS).

1. **Push to GitHub** — repo at `pmdevries-rgb/colorcombinations` (created by AcePilot)
2. **Open Cloudflare Dashboard** → Workers & Pages → Create → Pages → Connect to Git
3. **Select the repo** `pmdevries-rgb/colorcombinations`
4. **Configure build:**
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
   - Root directory: `/`
   - Node version: `20`
   - Environment variables: none required for V1
5. **Custom domain** → Set up → `colorcombinations.org` → auto-wired (registrar is Cloudflare, no DNS surgery)
6. First deploy happens automatically on connect; subsequent deploys happen on every push to `main`

The `public/_headers` file sets OWASP-baseline security headers at the edge.
The `public/_redirects` file is currently empty; add entries here for any V2 alias or marketing redirects.

Alternate hosts (same build output, deploy to any of them): **Vercel, Netlify, GitHub Pages** — all just need the repo connected and `npm run build` as the build command.

## Post-launch TODO

Tracked in `.claude/state/TASKS.md` (AcePilot state):

- [ ] Buy `colorcombinations.org` (human action)
- [ ] Generate 1200×630 PNG og-default (for Twitter/FB/LinkedIn — SVG default covers most crawlers)
- [ ] Wire real email provider in `EmailCapture.astro` action URL (ConvertKit or MailerLite)
- [ ] Replace placeholder form action on homepage newsletter
- [ ] Set up Plausible or similar privacy-respecting analytics (add script tag in `BaseLayout.astro`)
- [ ] Source and import full Wada 348 catalog (V2)
- [ ] Add Stripe Pro tier subscription (V2)
- [ ] Add print-on-demand affiliate (Printful/Gelato)
- [ ] Blog scaffold for 3 pillar SEO articles (V2)

## Data + ethics

The 30 V1 palettes are original curation drawing on traditional Japanese color names (shikisai) that have been in the cultural commons for centuries. Color hex values are facts and not copyrightable. Wada's specific 1933 book layout, plate sequence, and Seigensha republication are **not** reproduced here. See `.claude/state/DECISIONS.md` for the full legal reasoning.

## Credits

Built with AcePilot god mode. Design tokens inspired by museum editorial design — EB Garamond headlines, generous whitespace, swatches as display objects rather than widgets.
