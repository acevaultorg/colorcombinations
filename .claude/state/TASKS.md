# TASKS — ColorCombinations

**Objective:** Build V1 of The Dictionary of Color Combinations — a modern, monetized reinterpretation of Sanzo Wada's 1933 Japanese color dictionary. Ship a launch-ready static site with 30+ curated palettes, per-palette SEO pages, export features, and revenue scaffolding.

## Queue

- [x] `P0` INIT Astro 5 project with Tailwind v4 + TypeScript strict — `package.json`, `astro.config.mjs`, `tsconfig.json` [id:astro-init] [score:13.0] ✓ Astro 5.18.1 + Tailwind 4
- [x] `P0` DEFINE palette data schema (TypeScript type) — `src/types/palette.ts` [id:palette-schema] [needs:astro-init] [score:12.0] ✓ Pure TS types (simpler than content collections for V1)
- [x] `P0` SEED ~30 Wada-tradition palettes as structured data — `src/data/palettes.ts` [id:palette-seed] [needs:palette-schema] [score:11.5] ✓ 30 palettes, 8 featured, helpers
- [x] `P0` BUILD brand system — typography, colors, spacing tokens — `src/styles/global.css` [id:brand-system] [needs:astro-init] [score:11.0] ✓ Tailwind v4 @theme tokens (no tailwind.config.mjs needed in v4)
- [x] `P0` BUILD base layout — header, footer, nav — `src/layouts/BaseLayout.astro` [id:base-layout] [needs:brand-system] [score:10.5] ✓ Full SEO meta + a11y skip-link + JSON-LD slot
- [x] `P0` BUILD homepage — hero + featured palettes grid + value prop — `src/pages/index.astro` [id:homepage] [needs:base-layout,palette-seed] [score:10.0] ✓ Hero + 8 featured cards + how-it-works + newsletter
- [x] `P0` BUILD palette detail page template — SEO metadata, hex swatches, export, share — `src/pages/palettes/[slug].astro` [id:palette-detail] [needs:base-layout,palette-seed] [score:10.0] ✓ 30 static pages generated, breadcrumbs, JSON-LD, related
- [x] `P1` BUILD browse/filter page — search, filter by hue/era/mood — `src/pages/browse.astro` [id:browse-page] [needs:homepage] [score:8.0] ✓ Client-side filters, no rebuild needed
- [x] `P1` BUILD about page — Sanzo Wada story, mission, heritage — `src/pages/about.astro` [id:about-page] [needs:base-layout] [score:7.0] ✓ Full narrative, ethics statement, CTA
- [x] `P1` BUILD export component — copy hex, Tailwind config, CSS vars, JSON download — `src/components/ExportPalette.astro` + client script [id:export] [needs:palette-detail] [score:8.5] ✓ Built inline with palette-detail; 4 formats, clipboard + download, a11y status
- [x] `P1` BUILD email capture — newsletter form with ConvertKit/MailerLite-ready markup — `src/components/EmailCapture.astro` [id:email-capture] [needs:base-layout] [score:7.5] ✓ Provider-aware, client-side validation, used on homepage
- [x] `P1` ADD SEO infrastructure — sitemap, robots.txt, JSON-LD, OG meta per page — `@astrojs/sitemap`, `public/robots.txt`, BaseLayout meta [id:seo-infra] [needs:palette-detail] [score:8.0] ✓ 33-URL sitemap, global WebSite JSON-LD, per-page meta, favicon.svg, og-default.svg
- [x] `P1` BUILD 404 + root redirect handling — `src/pages/404.astro` [id:errors] [needs:base-layout] [score:5.0] ✓ 404 with 3 suggested palettes, noIndex meta
- [x] `P1` VERIFY build passes — `npm run build`, fix any errors, check dist/ output [id:verify-build] [needs:homepage,palette-detail,browse-page,about-page,seo-infra] [score:9.0] ✓ 34 pages, 796K dist, 757ms, 0 errors/warnings/hints
- [x] `P2` WRITE README + deploy instructions — `README.md` [id:readme] [needs:verify-build] [score:4.0] ✓ Full stack docs, deploy steps, post-launch TODO
- [x] `P2` WRITE GROWTH.md + GROWTH_ANALYTICS.md skeleton for post-launch tracking — `.claude/state/GROWTH*.md` [id:growth-state] [needs:verify-build] [score:4.5] ✓ Channels, funnel, KPIs, experiments seeded

## Human Actions (TaskAssistant)

- [x] `P0` BUY domain colorcombinations.org — `platform:cloudflare-registrar` [id:buy-domain] [score:10.0] ✓ Bought via Cloudflare Registrar 2026-04-10 (pivoted from Namecheap → cleaner because registrar + hosting in same ecosystem)
- [👤] `P0` CONNECT repo to Cloudflare Pages + custom domain — `platform:cloudflare-pages` [id:deploy-cloudflare-pages] [needs:buy-domain] [score:9.5] 👤 Repo live at https://github.com/acevaultorg/colorcombinations. Dashboard: dash.cloudflare.com → Workers & Pages → Create → Pages → Connect to Git → select acevaultorg/colorcombinations. Framework: Astro. Build: `npm run build`. Output: `dist`. Node: 20. Then Custom Domains → colorcombinations.org (DNS auto-wires since registrar is Cloudflare). See CONTEXT.md §Next Actions for full step-by-step.
- [👤] `P1` WIRE real email provider to newsletter form — `platform:convertkit|mailerlite` [id:wire-email] [score:7.0] 👤 Replace placeholder action URL in EmailCapture.astro with real endpoint
- [👤] `P2` GENERATE 1200x630 og-default.png — `tool:figma|canva` [id:og-png] [score:5.0] 👤 SVG works for most crawlers but PNG is safer for Twitter/FB/LinkedIn previews
- [👤] `P2` SET UP Plausible analytics (or similar) — `platform:plausible` [id:analytics] [score:5.5] 👤 Add script tag in BaseLayout.astro head; track RPU, export clicks, newsletter signups

## Blocked

<!-- Empty -->

## Deferred to V2

- Full Sanzo Wada 348 dataset import (requires verified source)
- Live Stripe checkout for Pro tier (V1 uses placeholder link)
- Printful/Gelato print-on-demand API integration (V1 uses affiliate links)
- Blog content — 3 pillar articles on color theory, Wada history, palette usage
- Custom OG image generation per palette (V1 uses static default)
- Advanced filters (color distance search, accessibility ratio)
- User accounts + saved palettes
- Figma plugin / Raycast extension
- Pinterest integration for viral loop
