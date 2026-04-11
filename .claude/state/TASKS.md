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

## Queue — Monetization V1 [objective:monetization-v1]

- [x] `P0` CREATE monetization config — centralize Gumroad URL, Bookshop.org ID, Printful URL — `src/config/monetization.ts` [id:monet-config] [score:12.5] ✓
- [x] `P0` CREATE bundle generation script — package palettes into Figma/Tailwind/CSS/SVG/JSON bundle for Gumroad upload — `scripts/build-bundle.mjs` [id:bundle-script] [needs:monet-config] [score:12.0] ✓
- [x] `P0` CREATE BundleCta component — editorial "get the bundle" CTA — `src/components/BundleCta.astro` [id:bundle-cta] [needs:monet-config] [score:11.5] ✓
- [x] `P0` CREATE FurtherReading component — affiliate book list — `src/components/FurtherReading.astro` [id:further-reading] [needs:monet-config] [score:11.0] ✓
- [x] `P0` CREATE /shop landing page — `src/pages/shop.astro` [id:shop-page] [needs:bundle-cta,further-reading] [score:10.5] ✓
- [x] `P1` INTEGRATE BundleCta + FurtherReading into palette-detail pages [id:integ-palette] [score:10.0] ✓
- [x] `P1` INTEGRATE BundleCta into homepage [id:integ-home] [score:9.5] ✓
- [x] `P1` INTEGRATE FurtherReading into about page [id:integ-about] [score:9.0] ✓
- [x] `P1` UPDATE footer — add "Shop" column [id:footer-shop] [score:8.5] ✓
- [x] `P1` ADD Plausible analytics script + event hooks — conditional on config [id:analytics] [score:8.0] ✓
- [x] `P1` GENERATE bundle files — 384-file zip verified [id:bundle-output] [score:7.5] ✓
- [x] `P1` VERIFY monetization build passes [id:verify-monet] [score:7.0] ✓
- [x] `P0` DEPLOY monetization V1 to Cloudflare Pages [id:deploy-monet] [score:6.5] ✓
- [x] `P1` VERIFY live [id:verify-live] [score:6.0] ✓

## Queue — Wada 348 Full Import [objective:wada-348]

- [x] `P0` FETCH authoritative 348-combination dataset — `scripts/wada-source/colors.json` from mattdesl/dictionary-of-colour-combinations (MIT) [id:wada-fetch] [score:12.5] ✓ 60K, 159 colors × 348 combinations
- [x] `P0` WRITE generate-wada-palettes.mjs — transforms dataset to Palette schema with auto-derived taxonomy [id:wada-gen-script] [needs:wada-fetch] [score:12.0] ✓
- [x] `P0` GENERATE src/data/wada-palettes.ts — 348 Palette entries [id:wada-data] [needs:wada-gen-script] [score:11.5] ✓
- [x] `P0` MERGE curated + wada in palettes.ts — split into curatedPalettes (30) + wadaPalettes (348), re-export as palettes (378) [id:wada-merge] [needs:wada-data] [score:11.0] ✓
- [x] `P0` UPDATE bundle script to concatenate both source arrays [id:bundle-update] [needs:wada-merge] [score:10.5] ✓
- [x] `P0` UPDATE hero copy + about copy + bundle name — reframe around "complete dictionary" [id:wada-copy] [needs:wada-merge] [score:10.0] ✓
- [x] `P0` REGENERATE bundle with 378 palettes (384 files, 50K zip) [id:bundle-regen] [needs:wada-copy] [score:9.5] ✓
- [x] `P0` REBUILD astro — 383 pages in 1.88s, 0 errors [id:wada-rebuild] [needs:wada-copy] [score:9.0] ✓
- [x] `P0` REDEPLOY — 390 files uploaded to Cloudflare Pages [id:wada-redeploy] [needs:wada-rebuild] [score:8.5] ✓
- [x] `P0` VERIFY live — plate 1, plate 174, plate 348 all 200, homepage shows "All 348 historical" [id:wada-verify] [needs:wada-redeploy] [score:8.0] ✓

## Queue — State + Handoff [objective:monetization-v1]

- [x] `P1` UPDATE state files — DECISIONS.md (two new entries), KNOWLEDGE.md (revenue model + catalog), GROWTH.md (ship log), GROWTH_ANALYTICS.md (ship impact hypotheses), IDENTITY.md (catalog scope), CONTEXT.md (handoff) [id:state-monet] [score:5.5] ✓
- [ ] `P0` WRITE [👤] handoff guide — operator actions to activate revenue (Gumroad signup + upload bundle, Bookshop.org signup, Amazon Associates, Plausible signup, Printful future) [id:handoff-monet] [score:10.0]

## Human Actions (TaskAssistant)

- [x] `P0` BUY domain colorcombinations.org — `platform:cloudflare-registrar` [id:buy-domain] [score:10.0] ✓ Bought via Cloudflare Registrar 2026-04-10 (pivoted from Namecheap → cleaner because registrar + hosting in same ecosystem)
- [x] `P0` CONNECT repo to Cloudflare Pages + custom domain — `platform:cloudflare-pages` [id:deploy-cloudflare-pages] [needs:buy-domain] [score:9.5] ✓ DEPLOYED 2026-04-10 via `wrangler pages deploy dist` — 34 pages live, all routes 200, custom 404 serving, security headers applied. Also fixed trailing-slash redirect hop.
- [👤] `P0` SIGN UP for Gumroad (or Lemonsqueezy) seller account + upload `bundle-source/wada-bundle-v1.zip` as $9 product — `platform:gumroad` [id:gumroad-setup] [score:12.0] 👤 REVENUE-CRITICAL
- [👤] `P0` SIGN UP for Bookshop.org affiliate (instant, free) + get affiliate ID — `platform:bookshop.org` [id:bookshop-setup] [score:11.5] 👤 REVENUE-CRITICAL
- [👤] `P1` PASTE Gumroad product URL + Bookshop.org affiliate ID into `src/config/monetization.ts` + redeploy — `file:monetization.ts` [id:monet-wire] [needs:gumroad-setup,bookshop-setup] [score:11.0] 👤
- [👤] `P1` SIGN UP for Plausible (9/mo) or self-host Umami free + paste script domain — `platform:plausible` [id:plausible-setup] [score:9.0] 👤 measurement rail — can't optimize what you don't measure
- [👤] `P2` SIGN UP for Amazon Associates + get tag + paste into monetization config (backup for books not on Bookshop) — `platform:amazon-associates` [id:amazon-setup] [score:6.0] 👤
- [👤] `P2` SET UP Printful store when first Gumroad sale hits (validates demand) — `platform:printful` [id:printful-setup] [score:5.0] 👤
- [👤] `P1` WIRE real email provider to newsletter form — `platform:convertkit|mailerlite` [id:wire-email] [score:7.0] 👤 Replace placeholder action URL in EmailCapture.astro with real endpoint
- [👤] `P2` GENERATE 1200x630 og-default.png — `tool:figma|canva` [id:og-png] [score:5.0] 👤 SVG works for most crawlers but PNG is safer for Twitter/FB/LinkedIn previews

## Blocked

<!-- Empty -->

## Deferred to V2

- Full Sanzo Wada 348 dataset import (requires verified source)
- Live Stripe Pro tier subscription (V1 uses Gumroad one-time bundle instead — simpler, no accounts)
- Printful/Gelato POD API integration (V1 uses external store link)
- Blog content — 3 pillar articles on color theory, Wada history, palette usage
- Custom OG image generation per palette (V1 uses static default)
- Advanced filters (color distance search, accessibility ratio)
- User accounts + saved palettes
- Figma plugin / Raycast extension
- Pinterest integration for viral loop
