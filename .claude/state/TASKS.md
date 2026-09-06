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
- [x] `P0` WRITE [👤] handoff guide — operator actions to activate revenue (Gumroad signup + upload bundle, Bookshop.org signup, Amazon Associates, Plausible signup, Printful future) [id:handoff-monet] [score:10.0] ✓ REVENUE-ACTIVATION.md updated for V1.1 PWYW reframe

## Human Actions (TaskAssistant)

<!-- 2026-04-24: Clarity Card format per I-27 — surfaced by specialist audit on shop rail ship. -->

### 🔴 REQUIRED — Re-auth wrangler so brain can keep deploys live

**WHAT:** Run `wrangler login` once in your terminal. The Cloudflare OAuth token saved at `~/Library/Preferences/.wrangler/config/default.toml` expired 2026-04-26 and the refresh failed (400 from CF auth). Brain merged PR #83 to main but can't push the new build to Cloudflare Pages without a valid token.

**WHY:** The share-card Canvas ship (PR #83) is queued for deploy — 275 new shareable surfaces (Pinterest/Twitter-ready PNGs across all `/colors/*` + `/collections/*`) sitting in `dist/`. Until token is fresh, every brain session ends with the same blocker. After this single one-time login, every future `/acepilot auto` ships live without asking. **Cost of skipping: every deploy from now on emits this Clarity Card; revenue/distribution improvements stall at "merged to main but not live."**

**TIME:** ~30 seconds.

**HOW:**
1. Open Terminal anywhere on your laptop. Paste:
   `wrangler login`
   → expected: a browser window opens to `dash.cloudflare.com/oauth2/authorize?...`. Click "Allow" on the Cloudflare permissions page.
2. Terminal then prints "Successfully logged in." → done.

**VERIFY:**
`wrangler whoami`
→ expected: prints your CF account email + account ID. (If still "Not logged in," the OAuth Allow step didn't complete; redo step 1.)

**IF STUCK:**
- **Browser doesn't open:** copy the URL from the terminal output and paste it manually.
- **"Failed to fetch auth token: 400":** delete the stale config first → `rm ~/Library/Preferences/.wrangler/config/default.toml` → re-run `wrangler login`.
- **You'd rather use an API token:** run `export CLOUDFLARE_API_TOKEN=...` (paste a token from `dash.cloudflare.com → My Profile → API Tokens → Create → "Edit Cloudflare Workers" template`); brain reads this env var.

[id:wrangler-reauth] [score:13.5] 👤 — UNBLOCKS PR #83 + EVERY FUTURE DEPLOY

After this, `dist/` is already built and ready — brain on next session can deploy with one bash call. Or you can run the deploy yourself right after re-auth: `cd "[project root]" && wrangler pages deploy dist --project-name=colorcombinations --branch=main --commit-dirty=true` (~60 sec upload).

---

### 🔴 REQUIRED — Activate the Bookshop.org affiliate ID

**WHAT:** Paste your real Bookshop.org affiliate associate ID into the project config. Today the shop book rail renders `PLACEHOLDER_BOOKSHOP_ID` — every Bookshop link still fires click-tracking, but zero commission flows because the URL has no `aid=`. This is the single highest-$/week unlock.

**WHY:** The shop page is live with 5 of 6 books pointing to Bookshop as the primary CTA (the sixth, Wada Vol. 2, points to Amazon because Bookshop US doesn't stock the import). At ~2,000 visits/week × 5% click-through × 15% conversion × $35 AOV × 10% commission, pasting the real ID activates **~$52/week** of passive revenue that is currently $0. Cost of skipping: every book click on colorcombinations.org today earns nothing.

**TIME:** ~6 minutes end-to-end (5 min signup, 1 min paste + redeploy).

**HOW:**
1. Open Bookshop.org's affiliate signup page in your browser:
   `https://bookshop.org/affiliates/apply`
   → expected: 1-page form asking site URL + payout method. Approval is instant for content sites.
2. Fill in site URL `https://colorcombinations.org` + your PayPal / bank payout info + submit.
   → expected: approval email within minutes with your affiliate ID (format: usually a lowercase slug like `color-combinations` or a 4–6 digit number).
3. Open `src/config/monetization.ts` locally. Line ~90 reads `affiliateId: "PLACEHOLDER_BOOKSHOP_ID",`. Replace `PLACEHOLDER_BOOKSHOP_ID` with your new ID (keep the quotes).
4. Rebuild + deploy:
   `npm run build && wrangler pages deploy dist --project-name=colorcombinations --branch=main`
   → expected: "✨ Deployment complete!" + a `*.colorcombinations.pages.dev` URL.

**VERIFY:**
`curl -sS "https://colorcombinations.org/shop/" | grep -oE 'aid=[a-z0-9-]+' | head -1`
→ expected: `aid=[your-id]` — matches what you pasted. If output is `aid=PLACEHOLDER_BOOKSHOP_ID`, the deploy hasn't propagated yet; retry in 30 seconds.

**IF STUCK:**
- **Signup form errors out:** make sure you used the US Bookshop.org site, not UK (`uk.bookshop.org` has a different affiliate program with different IDs).
- **`wrangler` not found:** run `nvm use 20 && npm i -g wrangler@latest` first, then re-try.
- **Deploy succeeds but `aid=` still PLACEHOLDER in output:** Cloudflare edge cache — wait 60 sec then retry verify, or curl the `*.pages.dev` preview URL directly.

[id:bookshop-id-activate] [score:14.0] 👤 — ESTIMATED +$52/WEEK once live

### 🟡 RECOMMENDED — Enable Cloudflare Pay-Per-Crawl on the zone

**WHAT:** Flip the "Enable Pay-Per-Crawl" toggle in the Cloudflare dashboard for `colorcombinations.org`. Cloudflare will bill AI crawlers (GPTBot, ClaudeBot, PerplexityBot, etc.) on your behalf and deposit a share to you. Your `robots.txt` already has the 9-crawler allowlist per v19.4 — PPC turns the bot traffic from cost center into revenue.

**WHY:** Even at modest bot-crawl volumes (100–500 crawls/day), direct PPC revenue lands $3–$30/month. Cost of skipping: those crawls happen anyway (they're already in your server logs per v19.4 bot-harvest rule), just uncompensated. Small money but fully passive.

**TIME:** ~2 min UI toggle + ~5 min one-time payout method setup.

**HOW:**
1. Open Cloudflare dashboard: `https://dash.cloudflare.com`.
2. Select the `colorcombinations.org` zone (left-nav).
3. Navigate: AI Audit (left sidebar) → "Enable Pay-Per-Crawl".
4. Agree to marketplace Terms (legal review on first-time setup).
5. Configure payout method (bank transfer or Stripe Connect).
6. Optional: override per-crawler pricing tiers (defaults are reasonable for a V1 site — leave as-is).

**VERIFY:**
After 24 hours, Cloudflare dashboard → AI Audit → Reports should show bot crawls being monetized. First earnings row may take 7 days.

**IF STUCK:**
- **"AI Audit" not visible:** your Cloudflare plan level may hide it — check Cloudflare Pro / Business features in the same left-nav.
- **Payout method rejects bank info:** use Stripe Connect instead (supported everywhere Stripe operates).

[id:cf-ppc-enable] [score:9.0] 👤 — ~$3–30/mo passive, payment-gated

### 🟢 OPTIONAL — Email Perplexity Publishers Program

**WHAT:** Send a short email to `publishers@perplexity.ai` proposing colorcombinations.org for their publisher revenue-share program. Perplexity runs an 80/20 revenue split on a ~$42.5M publisher pool for sites they cite in AI-search answers. Museum-grade reference content is exactly what they want.

**WHY:** Free to pitch. Zero commitment required if not accepted. If accepted, a side bonus: free Perplexity Enterprise Pro account (~$200/mo value). Cost of skipping: zero downside, just leaves a small revenue lane unexplored.

**TIME:** ~5 min to draft + send.

**HOW:**
1. Open your email client.
2. To: `publishers@perplexity.ai`.
3. Subject: `Publisher program inquiry — colorcombinations.org (color reference archive)`.
4. Body (template):
   > Hi Perplexity team,
   >
   > I run colorcombinations.org — a modern, editorially curated archive of Sanzo Wada's 1933 Dictionary of Color Combinations. 378 palettes with historical context, Japanese shikisai names, and free-to-copy hex values.
   >
   > The site is designed for LLM citation: static HTML, schema.org markup, llms.txt manifest, stable URLs, comprehensive metadata. Would you like to evaluate it for the Publishers Program?
   >
   > URL: `https://colorcombinations.org`
   > Traffic: [your current number from Cloudflare / Plausible]
   > Contact: [your email]
   >
   > Thanks,
   > [your name]

**VERIFY:** Auto-reply confirms receipt within 1 hour. Team response within 5–10 business days.

**IF STUCK:**
- **No auto-reply:** email the form at `https://www.perplexity.ai/hub/publishers` as a backup.
- **They want analytics numbers you don't have:** say "building measurement — current Cloudflare Web Analytics visibility only" and share the CF dashboard link.

[id:perplexity-publishers-email] [score:6.0] 👤 — free / no downside

---


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

## Queue — Color Dictionary + RSS [objective:color-dictionary-v1]

- [x] `P0` CREATE color data module — extract 211 unique named colors from 378 palettes, hue classification, reverse palette lookup — `src/data/colors.ts` [id:color-data] [score:12.0] ✓
- [x] `P0` CREATE color detail pages — 159+ static pages at /colors/[slug] with hex specs, WCAG contrast ratios, quick-copy buttons, palette cross-links, FurtherReading sidebar — `src/pages/colors/[slug].astro` [id:color-detail] [needs:color-data] [score:11.5] ✓
- [x] `P0` CREATE color index page — browsable dictionary at /colors/ with hue-family pill filters, swatch grid — `src/pages/colors/index.astro` [id:color-index] [needs:color-data] [score:11.0] ✓
- [x] `P1` CREATE RSS feed — 30 editorial palettes at /feed.xml with content:encoded, swatch preview, auto-discovery link — `src/pages/feed.xml.ts` [id:rss-feed] [score:10.5] ✓
- [x] `P1` ADD color links in palette swatches — nameRomaji on palette detail pages now links to /colors/[slug] — `src/pages/palettes/[slug].astro` [id:swatch-links] [needs:color-detail] [score:10.0] ✓
- [x] `P1` ADD Colors to nav + footer + RSS discovery link in BaseLayout — `SiteHeader.astro`, `SiteFooter.astro`, `BaseLayout.astro` [id:color-nav] [needs:color-index] [score:9.5] ✓
- [x] `P0` BUILD + VERIFY + DEPLOY — 603 pages, 2.73s, 0 errors, all live at colorcombinations.org [id:color-deploy] [needs:color-nav,rss-feed,swatch-links] [score:9.0] ✓

## Queue — SEO Collections Batch v19 [objective:seo-expansion-batch]

- [x] `P1` ADD 6 commercial-intent SEO collections — japandi, kitchen, bedroom, y2k, forest, maximalist — `src/data/collections.ts` [id:collections-batch-v19] [score:9.0] [oracle:$0.30-1.20/wk post-index] [reach:+12-36 visitors/wk long-tail] ✓ 60 total collections, 1042 build pages, 0 errors, sitemap clean
- [x] `P1` SHIP embeddable collection widgets — per-collection iframe at /embed/collection/[slug] (560×320) + "Embed this collection" section on every collection detail page + sitemap filter to exclude /embed/* — `src/pages/embed/collection/[slug].astro`, `src/pages/collections/[slug].astro`, `astro.config.mjs` [id:collection-embed-widget] [score:9.5] [reach:advocacy archetype embeddable_widget × +80] ✓ 60 embed routes, 1102 build pages, sitemap 0 noindex leaks

## Queue — Endless-loop session 2026-04-24/25 [objective:infrastructure-completeness]

Session shipped 32 atomic ships, all live + Chrome MCP verified. Site went 603 → 1332 build pages.

- [x] `P1` FIX `/embed/*` X-Frame-Options + CSP frame-ancestors override (2 commits — `! X-Frame-Options` then `! Content-Security-Policy`) — `public/_headers` [id:headers-fix] [score:14.0] ✓ Chrome MCP-caught silent bug; both palette + collection embeds were 200 but iframe-blocked
- [x] `P1` SHIP per-collection OG endpoint — 60 SVGs at build [id:per-collection-og] [score:9.5] [reach:share_by_design_result × +95] ✓
- [x] `P1` SHIP JSON APIs (palettes 378 + collections 60) with versioned schemas + rel=alternate meta [id:json-api-batch1] [score:11.0] [reach:dataset_json_api × +70] ✓
- [x] `P1` UPDATE /llms.txt with full surface map [id:llms-txt-v2] [score:8.0] ✓
- [x] `P1` SHIP /api/colors/[slug].json (210) with WCAG contrast + RGB [id:json-api-colors] [score:10.0] ✓ completes API surface
- [x] `P1` ADD freshness signals to detail JSON-LD — datePublished/dateModified/license/publisher/isBasedOn(Wada Book) [id:freshness-jsonld] [score:9.5] [reach:Aleyda Solis #9 Fresh] ✓
- [x] `P1` SHIP per-color embed widgets (210, 360×180) [id:per-color-embed] [score:9.0] [reach:embeddable_widget × +80] ✓
- [x] `P1` SHIP per-color OG endpoint (210) with WCAG badges [id:per-color-og] [score:9.0] ✓ + visual fix on site mark position
- [x] `P1` SHIP Pinterest article rich-pin meta + og:image dimensions on 648 detail pages [id:pinterest-rich-pin] [score:9.0] ✓
- [x] `P1` SHIP ShareActions component (Copy/Pinterest/X-Twitter) on collection + color detail pages [id:share-actions-component] [score:8.5] ✓
- [x] `P0` SHIP site-wide Organization JSON-LD + WebSite SearchAction [id:org-schema-sitewide] [score:11.5] [reach:Aleyda #3 Recognizable + Knowledge Graph] ✓
- [x] `P1` SHIP CSV bulk downloads (palettes/colors/collections, RFC 4180, CORS, CC-BY-4.0) [id:csv-bulk] [score:9.0] [reach:Wikipedia citation + LLM training] ✓
- [x] `P1` SHIP SEO collections batch 2 — modernist/hygge/wabi-sabi/biophilic [id:seo-collections-batch2] [score:8.5] ✓ 60→64
- [x] `P1` SHIP /data hub with DataCatalog schema + 3 nested Dataset entries [id:data-hub] [score:9.0] ✓
- [x] `P2` WIRE /data into footer + /tools index card + fix stale "two tools" copy [id:data-nav] [score:6.5] ✓
- [x] `P1` SHIP 7 index page custom OGs (/, /collections/, /tools/, /browse/, /colors/, /shop/, /data/) + hex-overlap fix [id:index-page-ogs] [score:8.0] ✓
- [x] `P1` SHIP SEO collections batch 3 — gothic/art-nouveau/victorian/vaporwave/coquette [id:seo-collections-batch3] [score:8.0] ✓ 64→69
- [x] `P1` SHIP Person schema for Sanzo Wada on /about — Wikipedia+Wikidata sameAs, AboutPage cross-link to Org [id:wada-person-schema] [score:8.5] [reach:Aleyda #7 Credible] ✓
- [x] `P1` SHIP /og/hue/[hue].svg parameterized endpoint — 9 hue-family OGs pulling live data [id:hue-ogs] [score:7.5] ✓
- [x] `P1` SHIP /learn/japandi-color-theory/ pillar article — ~720 words, 17 internal links, Article schema [id:pillar-japandi] [score:10.0] [reach:original_research_with_dataset × +90] ✓ establishes /learn/ section
- [x] `P1` SHIP /learn/ section landing page with Blog + nested BlogPosting schema [id:learn-index] [score:8.0] ✓
- [x] `P2` WIRE /learn/ link into header nav (between Tools and About) + footer Explore column [id:learn-nav] [score:6.5] ✓
- [x] `P1` SHIP /learn/wabi-sabi-color-theory/ — second pillar (~720 words, tea-room palette codification, 5 named-pigment links, 3 exemplars) [id:pillar-wabi-sabi] [score:9.5] ✓
- [x] `P1` SHIP /learn/japanese-reds/ — third pillar (~740 words, 4 reds × cultural register × working palette, 4-question picker framework) [id:pillar-reds] [score:9.5] ✓
- [x] `P1` SHIP final 2 index OGs (/og/learn.svg + /og/about.svg) — completes index OG matrix (9 static SVGs) [id:learn-about-ogs] [score:7.0] ✓
- [x] `P1` SHIP RSS feed extension — /learn/ articles at top of /feed.xml, item count 30→33 [id:rss-learn] [score:7.0] ✓
- [x] `P1` SHIP homepage Learn feature section — 3-card pillar showcase + "All articles →" link [id:home-learn-section] [score:8.5] ✓ converts homepage traffic into pillar reads
- [x] `P1` SHIP pillar cross-link callouts on matching /collections/ pages — japandi/wabi-sabi/red → matching /learn pillar [id:collection-pillar-cross-link] [score:8.0] ✓ compounds internal-link density

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

## Session log — 2026-04-25 endless-loop continuation (15 PRs)

Operator's persistent "endless loop" directive ran 15 ships through PR-merge → deploy → Chrome-MCP-verify cycles:

- [x] PR #54: PillarNav prev/next component on 3 pillars
- [x] PR #55: Pillar callout on /colors/[slug] for 12 named colors
- [x] PR #56: 4th pillar — /learn/scandinavian-color-theory/ (760 words)
- [x] PR #57: /og/learn.svg 4-card layout
- [x] PR #58: Color Story sections on 12 named-color pages
- [x] PR #59: Per-pillar /og/learn/[slug].svg dynamic OG endpoint
- [x] PR #60: 'More from this collection' siblings widget on /palettes/[slug]
- [x] PR #61: 5th pillar — /learn/heian-court-color-theory/ (720 words, made first in ORDER)
- [x] PR #62: /og/learn.svg 5-card layout
- [x] PR #63: Expanded pillar callout map 6 → 18 collections
- [x] PR #64: Suggested reading order intro on /learn/ index
- [x] PR #65: /random/ permalink-shareable random palette
- [x] PR #66: llms.txt refresh (5 pillars + /random + /methodology + /data)
- [x] PR #67: /tools/ index 4th card for Random Palette
- [x] PR #68: Site footer Tools column adds Random palette link

Build trajectory: 1335 → 1339 pages. All visually verified live via Chrome MCP.

Compounding installed: 5 pillars × bidirectional nav, 18 collection → pillar callouts, 12 color → pillar callouts, 12 named-color story sections, reading-order intro, /random/ utility.

## Session log — 2026-04-26 endless-loop continuation, segment 2 (9 PRs, PR #70 → #78)

- [x] PR #70: Pillar callout on /palettes/[slug] — closes the triangle (271/378 palettes mapped via shared `@data/pillarMap`)
- [x] PR #71: Color stories expanded 12 → 20 named colors (added murasaki, ai, asagi, ruri, tokiwa, kon, kuro, yamabuki)
- [x] PR #72: /learn/japanese-color-glossary/ — single-page 20-color reference + DefinedTermSet schema
- [x] PR #73: Homepage Learn feature 6th card for glossary
- [x] PR #74: Per-glossary OG /og/learn/japanese-color-glossary.svg
- [x] PR #75: 'See in Glossary' anchor CTA on the 20 colored-stories /colors pages
- [x] PR #76: llms.txt update for glossary + 20 named colors
- [x] PR #77: Glossary banner on /colors/ index
- [x] PR #78: /api/learn.json endpoint with editorial index schema

Build trajectory: 1339 → 1340 pages.

Cumulative this resumed-session loop (PR #54 → #78): 25 PRs merged + deployed + Chrome-MCP-verified.

## Queue — Tier-A monetization depth expansion (operator directive 2026-04-27)

Tier-S retrofit shipped this session (Adobe + Canva + Tailwind UI + Khroma + Skillshare + Domestika + Coursera + Printful + Printify on /shop). Tier-A pages below are queued for future ships. Each is a substantial PR; pick by Oracle weight + dependency order:

- [x] `P0` SHIPPED 2026-06-20 `/trends/color-trends-2026/` annual report (14 authorities, cited, Amazon book CTAs, FAQ+ItemList schema, live+IndexNow) — PR-pitchable; brand-tool affiliate; press-bait [archetype:annual_report_state_of_x × +85] [oracle:high — viral potential]
- [x] `P1` (already built — pages exist) `/compare/pantone-vs-ral/` + `/compare/hsl-vs-lch/` + `/compare/adobe-vs-coolors/` — color-tool comparison pages with structural Adobe + Coolors + Tailwind UI affiliate per page [archetype:comparison_vs_competitor_page × +60]
- [ ] `P1` BUILD `/courses/` brand-identity course affiliate hub — uses LEARN_RESOURCES from monetization.ts [archetype:programmatic_page_with_unique_data × +55]
- [ ] `P1` BUILD `/industry/[slug]/` programmatic — 8-12 pages: tech / finance / health / retail / hospitality / nonprofit / education / wellness — color theory by industry with brand-tool affiliate [archetype:programmatic_page_with_unique_data × +55]
- [ ] `P1` BUILD `/pod/` print-on-demand landing — uses POD_PROVIDERS from monetization.ts; how-to guide for taking Wada palette into Printful/Printify [archetype:editorial_curation_depth × +50]
- [x] `P1` (COVERED — checked 2026-09-06, do NOT build a standalone /tailwind/ page) Palette→Tailwind-config export already ships on every one of the 378 palette pages via `<ExportPalette>` ("Copy Tailwind config" button, real `theme.extend.colors` JSON, per-palette). A dedicated landing page would duplicate this with narrower reach (1 page vs. 378). [archetype:shareable_tool_calculator × +65]
- [x] `P1` (COVERED — checked 2026-09-06, do NOT build /wcag/) `/tools/contrast-checker/` is already the "deep" tool this line asked for, not the starter it describes: 721 lines, AA/AAA grades for normal text / large text / UI components, full explanatory copy on the legal thresholds. Backlog line predates the tool's later build-out. [archetype:shareable_tool_calculator × +65]
- [x] `P1` (COVERED — /colors/ "Color Dictionary" index + 213 per-color pages already IS the color-name DB; do NOT build a duplicate /names/) color-name database — LLM-citation magnet [archetype:programmatic_page_with_unique_data × +55]
- [x] `P1` SHIPPED 2026-06-21 `/color-psychology/` honest design guide (11-hue ref, FAQ schema, book CTAs, live) + design-course affiliate [archetype:editorial_curation_depth × +50]
- [x] `P1` SHIPPED 2026-09-06 `/material-design/` M2-vs-M3 color explainer (8-dim table, HCT explainer, real-archive-plate computed seed example, 7 DesignTools affiliate cards, 6-item FAQ) — live-verified, TaskPeace mtp1szr5ckmbgg. Bonus: found + fixed `/compare/adobe-vs-coolors` + `/compare/pantone-vs-ral` were orphaned (zero inbound links outside their own closed 3-page triangle) — added a pointer from `/tools/` (real hub) to all 4 pages [archetype:comparison_vs_competitor_page × +60]
- [ ] `P2` BUILD `/brands/` favorite-colors-of-brands database — long-tail SEO [archetype:programmatic_page_with_unique_data × +55]
- [x] `P2` SHIPPED 2026-09-06 `/accessibility/color-blind-tools/` 6-tool comparison (own simulator + Sim Daltonism + Color Oracle + NoCoffee + Chromatic Vision Simulator + Adobe Proof Colors), reciprocally de-orphaned from /tools/color-blindness-simulator/ in the same commit — live-verified, TaskPeace mtp23dj08mywfa. Tier-3 ("weak evidence" per 2026-09-05 re-rank) is now the last tier worth building from this list — do NOT proceed to /industry/, /brands/, /courses/, /pod/ (tier-4, explicitly DEPRIORITIZE) or /color-by-emotion/ (tier-5, Leave) [archetype:comparison_vs_competitor_page × +60]
- [x] `P2` SHIPPED 2026-09-06 `/glossary/` design-terminology DefinedTerm hub (22 terms, 4 sections, 4 computed archive-example terms) — live-verified, TaskPeace mtp0nw11u2p75r [archetype:llm_citation_quote_ready × +75]
- [ ] `P2` BUILD `/color-by-emotion/` emotional color mapping — risky thin-content territory; needs editorial depth [archetype:editorial_curation_depth × +50]

## Human Actions (TaskAssistant) — Tier-S affiliate IDs

### 🔴 REQUIRED — Activate the 8 affiliate IDs in monetization.ts

**WHAT:** PR #90 shipped 8 affiliate-link surfaces on `/shop` (Adobe Creative Cloud, Canva, Tailwind UI, Skillshare, Domestika, Coursera Design Certificate, Printful, Printify). Every URL today has `PLACEHOLDER_*` in `src/config/monetization.ts` — clicks work (no broken UX, all links go to the real platform homepage), but every conversion earns $0 because no affiliate ID is attached.

**WHY:** Math on this single action: 2,750 visits/mo × 5% CTR × $30-100 per conversion (Impact.com Adobe alone is $30-100) = realistic **$300-700/mo** within 30 days of IDs going live. Today: $0. This is the single highest-$ operator action queued across the entire ColorCombinations work pipeline.

**TIME:** ~30 minutes total signups + 5 minutes paste/redeploy. Some platforms approve instantly (Canva, Domestika, Printful, Printify); some review 1-5 business days (Adobe, Skillshare, Coursera).

**HOW:**
1. Adobe Creative Cloud (Impact.com) — apply at `https://creativecloud.adobe.com/affiliate-program/` → 2-5 business day review → replace `PLACEHOLDER_IMPACT_ADOBE` in `src/config/monetization.ts` (~line 377)
2. Canva — apply at `https://www.canva.com/affiliates/` → instant → replace `PLACEHOLDER_CANVA_REFERRAL` (~line 388)
3. Tailwind UI — apply at `https://tailwindui.com/affiliate-program` → ref ID at signup → replace `PLACEHOLDER_TAILWIND_REFERRAL` (~line 407)
4. Skillshare (Impact.com) — apply via `https://app.impact.com/secure/skillshare-program` → 1-3 day review → replace `PLACEHOLDER_SKILLSHARE_IMPACT` (~line 451)
5. Domestika — apply at `https://www.domestika.org/en/affiliate-program` → instant → replace `PLACEHOLDER_DOMESTIKA_REFERRAL` (~line 460)
6. Coursera (Impact.com) — apply at `https://about.coursera.org/affiliates/` → 2-5 day review → replace `PLACEHOLDER_COURSERA_IMPACT` (~line 469)
7. Printful — apply at `https://www.printful.com/affiliate-program` → instant → replace `PLACEHOLDER_PRINTFUL_REFERRAL` (~line 492)
8. Printify — apply at `https://printify.com/affiliate-program/` → instant → replace `PLACEHOLDER_PRINTIFY_REFERRAL` (~line 498)

After paste:
```bash
npm run build && wrangler pages deploy dist --project-name=colorcombinations --branch=main
```

**VERIFY:**
```bash
curl -sS "https://colorcombinations.org/shop/" | grep -oE 'href="[^"]*PLACEHOLDER[^"]*"' | head
```
→ expected: zero matches (every PLACEHOLDER replaced). If matches remain, those specific links are still earning $0.

**IF STUCK:**
- Application denied on first review (Adobe/Coursera/Skillshare): re-apply with site URL + visitor count + content vertical match. Most reapprovals succeed within a week.
- Tailwind UI affiliate not visible: it's only available to existing Tailwind UI subscribers — start a subscription first if needed (or skip Tailwind UI if not worth subscribing for).
- Wrangler `whoami` → 400 (auth expired): run `wrangler login` (browser pop, ~30 sec) before deploying.

[id:tier-s-affiliate-ids] [score:14.0] 👤 — ESTIMATED +$300-700/MO once live

---

## 2026-09-05 — EVALUATION of the open backlog + the affiliate-ID card against measured reality

The Tier-A backlog and the 🔴 affiliate-ID card were written 2026-06-21. Both predate every
measurement in `.claude/state/DISTRIBUTION.md` §§1–8 (2026-09-05) and one binding fleet rule.
Nothing below is deleted — this re-ranks and corrects.

### A. The affiliate-ID card is STALE in its premise and its reach figure — correct before running it

**Measured live 2026-09-05 on `/shop/` (116 hrefs, positive control passed):**

| card says | measured |
|---|---|
| "every URL has `PLACEHOLDER_*` … clicks work, all links go to the platform homepage" | **0 PLACEHOLDER hrefs live.** All 8 partner links (adobe · canva · tailwind · skillshare · domestika · coursera · printful · printify) are **ABSENT from the page entirely.** 10 `PLACEHOLDER_*` constants remain in `src/config/monetization.ts`, but the site correctly suppresses ID-less links rather than shipping un-monetized ones. |
| implied: revenue is *leaking* | revenue is **not yet built**. No $0 clicks are being wasted; the surfaces do not exist. Good design — do not "fix" the suppression. |

**🔴 The reach figure must change before any application is filed.**
`affiliate-application-criteria-first.md` (2026-09-02, *after* this card) makes a REACH row
mandatory and states the source explicitly: **Search Console clicks or the Amazon per-tag report —
never a GA4 session total**, because fleet GA4 totals are 68–97% crawler on data sites and "a
reviewer can disprove them in about a minute; citing one is worse than citing nothing."

This card cites **"2,750 visits/mo × 5% CTR"** — a GA4-shaped number, and exactly the kind that gets
an account auto-declined. Semrush declined a fleet account on 2026-09-02 with the stated reason
*"Low reach (traffic, followers)."*

**The sanctioned numbers for this property, measured 2026-09-05:**

| source | value | usable? |
|---|--:|---|
| Amazon per-tag (30d) | **594 affiliate clicks · 64 orders · $52.32 commission** | ✅ **use this** — a real commerce record |
| Bing Webmaster (28d) | 519 clicks / 15,853 impressions | ✅ supporting |
| Google Search Console (30d) | **4 clicks** | ❌ never cite — see DISTRIBUTION §6 |

colorcombinations IS on the criteria-first ✅ "properties that have reach" list. Lead with the
Amazon record, support with Bing, and never mention the GSC number.

**Still operator-gated and unchanged:** signups are new accounts + operator identity = HARD GATE.
Nothing here is brain-doable. Write the criteria table into the ledger *before* applying, per the
rule's definition of done.

### B. Backlog re-rank — the constraint is DEMAND, not supply

The decisive measurement: **`/colors-that-go-with/` is 702 pages (48% of the sitemap) and takes 17
Bing impressions.** Supply is demonstrably not this site's constraint. Meanwhile the ONE backlog
item that shipped and became the site's #1 page — `/trends/color-trends-2026/`, 6,777 impressions
and ~96% of the site's AI citations — was the **highest**-Oracle-weight item on the list
(`annual_report_state_of_x × +85`). The backlog's own weighting was right; follow it.

| item | archetype | 2026-09-05 verdict | 2026-09-06 status |
|---|---|---|---|
| `/glossary/` DefinedTerm hub | `llm_citation_quote_ready × +75` | **BUILD FIRST.** Highest remaining weight, and citation-shaped on the site that is **70% of all fleet AI-referred human sessions**. | **SHIPPED.** `21d9ce4` + fix `cca2d11`. Live-verified 2026-09-06: `/glossary/` returns 200, DefinedTerm schema present, title matches ("22 Terms Every Palette Page Uses"). |
| `/tailwind/` · `/wcag/` tools | `shareable_tool_calculator × +65` | **Second.** Linkable assets, not thin supply — a different archetype from the 702-page surface. | **COVERED, not built standalone** — see lines 308-309 below: `<ExportPalette>` already ships a Tailwind-config export on all 378 palette pages (broader reach than one landing page), and `/tools/contrast-checker/` (721 lines) is already the WCAG-depth tool this line asked for. |
| `/material-design/` · `/accessibility/color-blind-tools/` | `comparison_vs_competitor_page × +60` | **Weak evidence:** the existing `/compare/*` pages take 32 Bing impressions across 2 pages. | **SHIPPED anyway** this session (`d9bc069`/`b2b7212`, `2592dc6`) — real, non-fabricated pages with computed examples, de-orphaned via inbound links from `/tools/` and `/tools/color-blindness-simulator/`. Evidence caveat above still holds; treat as a low-confidence bet, not a proven win. |
| `/industry/[slug]/` · `/brands/` · `/courses/` · `/pod/` | `programmatic_page_with_unique_data × +55` | **DEPRIORITIZE.** This is the exact archetype whose 702-page instance earns 17 impressions. Building 8–12 more is vanity supply per `realized-demand-discipline`. | Still deprioritized. No new evidence since 09-05 changes this. |
| `/color-by-emotion/` | `editorial_curation_depth × +50` | **Leave.** The task itself flags thin-content risk; nothing since has reduced it. | Still left. |

**2026-09-06 read: every ranked item in this table is now either shipped or explicitly deprioritized/left.** The backlog has no remaining "build" item its own evidence supports. The next session/lane should NOT default to more programmatic-page supply (measured lever, not this one) — check the fleet metrics layer / Bing Webmaster data fresh, or work systemic (CI/deploy/monetization-activation) gaps instead of adding pages.

**…and then that read was immediately proven too narrow, which is the more useful lesson.** Within the same session, `/trends/color-trends-2027/` shipped (c9a4d98) — a genuinely high-value page that appears NOWHERE in the table above. It was invisible to the backlog for a specific, repeatable reason: **this table ranks page TYPES, and the highest-weight type here is seasonal.** `annual_report_state_of_x × +85` is the archetype that produced the site's #1 page, and its opportunity is not "a page we haven't built" but "a page whose season just opened." On 2026-09-06 the 2027 Color of the Year season was a month old (Valspar 5 Aug, Dutch Boy 25 Aug, Behr late Aug, Pantone due December) and the site had zero references to 2027 anywhere.

So "the ranked backlog is exhausted" is NOT the same as "there is no high-value work." Before concluding a site is saturated, check the two classes a static table cannot hold:

1. **Timing** — is a proven archetype's season open right now? For this site that is the COTY cycle (late July → early December). A recurring task now tracks it (`mtp5sziorcb2c6`, monthly from 2026-10-01) so this specific one cannot be missed again.
2. **Documented levers not yet run here** — the fleet's own gap-sweep categories: a live bug · an unshipped asset · the biggest gap-to-goal in the instruments · a fleet-proven pattern missing on this site. A defect sweep searches a different space than a lever sweep; exhausting one says nothing about the other.

Both of this session's largest wins came from outside the table: the 2027 page (timing) and wiring IndexNow into CI (a documented lever that had never been run from the deploy path — 936756e).

### C. Measured 2026-09-06 — "BUILD COSTS ~41 MINUTES" does not describe CI

The TaskPeace project note for this site says builds cost ~41 minutes because of OG/pin
rasterization, and concludes **"BATCH every change into ONE build."** That advice is sound for a
LOCAL build and misleading for the deploy path we actually use. Measured across 8 consecutive
pipelines today (GitLab API, `deploy_cf_pages` job duration):

| pipeline   | commit   | duration |
|------------|----------|---------:|
| 2823542381 | c9a4d98  |  148.9 s |
| 2823529621 | 75dcb84  |  144.5 s |
| 2823517041 | ece0559  |  147.3 s |
| 2823469638 | 83bb98f  |  137.0 s |
| 2823455043 | afa6877  |  243.7 s |
| 2823443771 | a8464aa  |  236.6 s |
| 2823546269 | 1ec5ca5  |   21.4 s | ← docs-only short-circuit, correctly skipping |
| 2823464286 | a7081f1  |   30.5 s | ← same |

**Real CI builds are 2.3–4.1 minutes, not 41.** The images are not being skipped either — OG
images were resolved from the sitemap (never constructed) and every one returns 200 with real
bytes: akane-tokiwa 37,499 b · ao-shiro 25,753 b · asagi-shu 34,275 b · colors 46,841 b.

What this does NOT establish: I did not run a local build, so the 41-minute figure may be
perfectly accurate for the operator's machine — CI hardware being ~10–16× faster at resvg
rasterization is the obvious explanation, and the note's own "~1 image/second" is roughly what a
laptop would do. Stated as measured, not as a refutation of a number I did not re-measure.

**Practical consequence:** package.json's own `_deploy_note` already says "DEPLOY VIA CI, NOT FROM
A LAPTOP", and on that path iteration is cheap. Do not batch risky changes together to avoid a
41-minute cost that CI does not charge — batching hurts, because it makes a failure harder to
attribute. Four separate ships went out today in ~10 minutes of total CI time.

Two instrument traps hit while measuring this, both already in fleet doctrine and both worth
re-noting because they produced wrong numbers here before being caught:
- `grep -c "<loc>" sitemap-0.xml` returns **1**. The sitemap is single-line, and `grep -c` counts
  matching LINES, not matches. The real count is 1,473 via `grep -o "<loc>" | wc -l`.
- `/og/matsuba.png` 404s, which looked like a missing-image defect. The slug was invented. Every
  OG URL resolved from the sitemap returns 200. Never construct a URL to test whether a thing
  exists.

### D. ANSWERED 2026-09-06 — the "Sanzo Wada entity gap": demand is real, and it is BOOK-intent

The project note carries this as open and explicitly gated: *"Whether 'Sanzo Wada' is a demand pool
worth its own hub is UNMEASURED … Do not build it on the hypothesis."* Measured, from the Bing
per-query feed (`/bing-detail`, 924 query rows, 8,717 impressions, under the 5,000 limit so not
truncated):

| bucket | rows | impressions | share of feed |
|---|---:|---:|---:|
| queries containing "sanzo" | 79 | 338 | 3.9% |
| queries containing "wada" | 81 | 344 | 3.9% |
| **person / biography-shaped** ("who was", "biography", "born", "artist") | **1** | **4** | **0.0%** |

**Verdict: a `/sanzo-wada/` person hub is NOT supported. Do not build it.** The name-demand is
real, but every query carrying it is after the BOOK — "sanzo wada color combinations" (51 impr),
"a dictionary of color combinations sanzo wada" (24), "sanzo wada dictionary of color
combinations" (11), "sanzo wada book" (6), "sanzo wada color combinations pdf" (5). Biography
intent is essentially absent. That matches the strength the project note already records — 45-75%
citation share on BOOK queries — and the homepage already serves this cluster at position 4.1 with
6,585 impressions and 471 clicks, the best page on the site.

`/about/` already carries the "Who was Sanzo Wada?" H2, the 1883-1967 biography and Person schema,
and takes 25 impressions at position 10.5. A separate hub would duplicate that against ~4
impressions of genuine person-intent demand — vanity supply in the precise sense
`realized-demand-discipline` means. This is the 9th consecutive refutation of a
missing-page hypothesis on this fleet; the running record is documented as 0-for-8 before this.

Caveat stated honestly: absence in a selected feed is weaker evidence than presence. It carries
here because zero-click rows are abundantly represented (565 of 924 rows, 61.1%), so low-click
informational queries — which is what biography intent looks like — are clearly not being filtered
out. The feed covers 55% of the site's Bing impressions, so treat 338 as a floor, not a total.

### E. FEED CALIBRATION 2026-09-06 — this site's Bing per-query feed is 2.54x CTR-enriched

The fleet flag says not to act on per-query or per-page Bing CTR until the feed is calibrated for
the site being read. Calibrated here against the unselected site rollup in `data.json`:

```
/bing-detail feed:   8,717 impr    725 clicks   8.32% CTR
site rollup:        15,853 impr    519 clicks   3.27% CTR
                    ----------------------------------------
impression coverage 55.0%   click coverage 139.7%   CTR enrichment 2.54x
```

**Click coverage above 100% is the tell** — a feed cannot contain more clicks than the site
recorded unless it is selecting for clicked rows over a differently-bounded window. So:

- ❌ **Never quote a per-query or per-page CTR from this feed.** It runs ~2.5x high. Dividing its
  clicks by its impressions has already shipped 21 meta rewrites on a false premise elsewhere in
  the fleet.
- ⚠️ Impressions are a FLOOR at ~55% coverage, not a total.
- ✅ Presence and query-shape are sound, which is what section D rests on.

Use `GetRankAndTrafficStats` (the unselected daily rollup) for any rate or denominator.

**Before building any of them:** check demand for the specific intersection first
(`affiliate-team-standard` § the intersection law — readinglist shipped 98 decade×grade pages for 0
impressions on exactly this mistake), and check no other lane is on it (one shipped to
`/shop/` + `monetization.ts` during this very session).

---

## 2026-09-06 · imac-color-lane · what the site's own data says (read this before proposing work)

Fifteen hypotheses tested in one session. **Thirteen were refuted by measurement.** Recording the
survivors and — more usefully — the things that look obviously worth doing and are not, because
every one of them was arrived at independently and cost a leg.

### The two findings that survived

**1. The AI channel is real, measured, and converts.** GA4 30d, complete pulls:

```
channel           sess     pv  users  pv/s  s/u   amazon_clicks  clk/1k sess  scroll90
Direct            3216   5243   2485  1.63 1.29             32         10.0     17.2%
Organic Search    2451   7298   1321  2.98 1.86            129         52.6     17.7%
AI Assistant      1055   3074    701  2.91 1.50             63         59.7     17.4%
```

15.0% of sessions → **26.1% of Amazon clicks**. Statistically **at parity** with Organic Search
(z=0.85, p=0.398 — claim parity, NOT superiority) and **6× Direct** (p=1.9e-21). Scroll engagement
is flat across channels, so it is intent, not attention. The cohort is human-shaped (1.50 s/u) and
this site is separately measured at 0.0% crawler-shaped, so the denominator is clean.

**2. Four URLs carry 14.1% of that channel** — 0.27% of the ~1,470-page sitemap:

```
/books/a-dictionary-of-color-combinations/   86 AI sessions   <- 94.5% of ALL /books/ AI traffic
/data/                                       28              <- 100% of /data/
/compare/wada-vol-1-vs-vol-2/                24              <- 100% of /compare/
/learn/color-data-analysis/                  11
```

Treat as crown jewels: protect freshness, schema and paths; never silently restructure them.

### Page ROLE — the single most useful table here

Judging any surface on another's metric produces a wrong verdict. This site has exactly **two**
commercial-intent surfaces; everything else is acquisition or citation inventory.

```
surface                 pages   pv    clk/1k pv   CTAs   PER-CTA   role
/books/a-dict...            1  163       165.6       1     165.6   COMMERCIAL
/compare/wada...            1   67       164.2      10      16.4   COMMERCIAL
/shop/                      2  180       383.3      54       7.1   index (density, not persuasion)
/learn/                    13  261         0.0      12       0.0   citation + ad inventory
/colors-that-go-with/     703  824         2.4      38       0.1   ANSWER surface
/palettes/                378  968         3.6       —         —   browse
/colors/                  223 1831         5.7       —         —   browse
```

**Do not add CTAs anywhere.** The relationship is inverse across two orders of magnitude:
1 CTA → 165.6 per-CTA · 10 → 16.4 · 12 → 0.0 · 54 → 7.1. The site's single best commercial
affordance is **one link on one page**.

### Refuted — do not re-derive these

| hypothesis | killed by |
|---|---|
| search-index has gaps | already fixed 09-03/04; verified live (696 `wada` tokens, hex indexed, alias present) |
| search instrumentation broke 09-04 | daily series minimum is **0** (range 0–34); n=1 clean day. Gated to 09-09 |
| `/colors-that-go-with/` 1.06 pv/sess is a leak | 27.7% scroll-90 (2nd best on site), links in top quarter — it is the page's ROLE |
| ...and it under-converts | n=2 clicks, P(≤2)≈0.31 |
| perf 50 / LCP 11.7s is real | **lab-only**; CrUX field PASSES (LCP 1.0s, INP 113ms, CLS 0) |
| expand `/books/` (7.58 AI sess/page) | 94.5% is ONE page wearing a template average; a 13th page draws ~0.5 |
| route internal traffic to converters | `/shop` has **6× the links** of `/books` and the SAME pageviews (8,820 instances → 180 pv) |
| `/learn/` 0 clicks is a placement bug | CTAs sit mid-body at 43–59%; cause is intent (research surface) |
| 40 titles exceed 95 chars | 38 of them sit on pages with **35 impressions total** |
| `/collections/y2k/` 1.54% vs sibling 6.09% is a title bug | SERP intent: y2k = 4/10 image-marketplace results, japanese = 1/10 |
| add LAB to match the competitor | **0 of 455** distinct search terms in 30d contain "lab" |
| competitor is client-rendered (AI can't read them) | their `/colors` serves 171 hex codes in HTML |
| `/palettes/` 404s | intentional non-page — not in sitemap, nothing links it; `/browse/` is the index |

### Competitor

**`wada-sanzo-colors.com`** — same dataset, near-same name — ranks page 1 for `japanese color
palette`, our best query (1,446 impr, pos 4.2 — CTR withheld, feed failed the click-selection guard). They have 553 pages to our 1,470 and emit
**`WebSite` schema only** against our BreadcrumbList/FAQPage/CreativeWork/Book/Dataset. Schema
richness + surface size is our moat; protect it. Their LAB pitch is not a gap (above).

### Ownership check — first run on this site

`color of the year 2026` (6,777 impr = **35.7% of all site Bing impressions**, pos 4.9) is
**NOT institution-owned** — manufacturers cover only their own colour, no Pantone page ranks, and
three archetype peers hold page 1. **Winnable. The lever is position (4.9 → top-3), not the
title** — the 95-char title is correctly front-loaded and intent-matched.

### Verified clean (do not re-check)

- Money path: 13/13 live checks, detector controlled via `VERIFY_ORIGIN=example.com` (9 FAILs).
- IndexNow: **200** from both `api.indexnow.org` and Bing — genuinely registered, not silently
  403ing behind the CI's non-fatal `||`.
- copyright-safety: `/copyright/` 948w with notice-and-takedown + non-affiliation; contact is in
  JSON-LD `ContactPoint` (the `[email protected]` render is Cloudflare obfuscation, not a gap).
- Breadcrumb schema: 18 templates audited, **zero** visible-crumb-without-`BreadcrumbList`.

### Shipped

`d0619ff` verify-guard (a negative assertion passed vacuously for an absent file) ·
`77283b3` BreadcrumbList on `/books/[slug]`, live-verified with controls.

### Scheduled gates (fireable — `status: scheduled`, non-null `scheduledFor`)

- **2026-09-09** `mtp8e5hv6zefhh` — search zero-result rate; baseline to beat **34.0%**. Read the
  RATE not the count; post-fix n was only 5 events.
- **2026-10-06** `mtp835nfohbpez` — AI citation share. Needs a Chrome-MCP lane; the public API has
  no AI-performance surface (probed, 404 against a passing `GetCrawlStats` control).

### E3. AUTHORITY MEASURED 2026-09-06 — the site has NINE external inbound links

Found while running a positive control for something else, which is the second time tonight the
control was worth more than the thing it was controlling for.

`bing-probe?method=GetCrawlStats`, latest row (2026-09-04), against sibling sites in the same call:

| site | InLinks | InIndex | Code2xx |
|---|---:|---:|---:|
| readinglist.school | **983** | 12,032 | 8,383 |
| **colorcombinations.org** | **9** | 1,940 | 2,161 |
| fitmylens.com | 1 | 2,369 | 3,181 |
| cabinpets.com | 4 | 182 | 231 |

**The field is real.** It takes 8 distinct values across our own 91-day series (0 -> 9, climbing)
and reads 983 on a sibling in the same call — so it is neither frozen nor unpopulated. That
control mattered: a value identical on every visible day is normally the signature of a dead
field, and this one looked like that until the series and the sibling were checked.

**Index health is FINE — do not go looking for a problem here.** `InIndex` 1,940 against a
~1,470-page sitemap, `Code5xx` 0, `DnsFailures` 0, `ConnectionTimeout` 0, `Code4xx` 15 of 2,161.
The `AllOtherCodes` 94 is ~4% and is almost certainly 304s. Nothing to fix.

⚠️ **These rows are SNAPSHOTS, not daily deltas** — `Code2xx` climbs 1,872 -> 2,161 across the
window. Summing the 91 rows produces a meaningless 120,799. Read the LAST row only.

**What it means, both directions.** The open lever card says *"the answer is authority from
outside, not internal plumbing."* That quantity is now measured and it is ~zero. It STRENGTHENS
the internal-link test (with no external authority, internal plumbing is the only lever available
without operator time) and it CAPS the expectation (9 inbound links moving 4.9 -> top-3 on
internal links alone is optimistic). If the collections test comes back flat, this is why.

**Caveat:** Bing's `InLinks` is Bing's own count and under-reports real backlinks. Treat 9 as
directionally near-zero, not a census. The comparison is what carries the meaning — same
instrument, same call, same day.

Operator card filed: `mtpazjk33khznb` (Wikipedia already links two rival colour-dictionary sites
and zero to us; propose parity on the Talk page with COI disclosed — one link, honestly sized).

### E4. UNRUN LEVER — Bing SEO recommendations need a Chrome-MCP lane

`bing-recommendations-autopilot` is a documented fleet lever that has **never been run on this
site**. Its endpoint is dashboard-session-only. Verified today rather than inherited from the
rule, with a passing control:

```
GetCrawlStats          -> 200  (real data)      <- CONTROL
GetSeoReports          -> 404
GetRecommendations     -> 404
GetSeoRecommendations  -> 404
GetSiteSeoReports      -> 404
```

So the rule's "no REST equivalent" claim holds here too. This lane has no Chrome MCP, so the lever
is unrunnable from it — filed for a Chrome-MCP lane, not silently skipped. The fleet-wide finding
that rule reports (`50 Title too long`, High, 23 sites) may or may not include this site; unknown
until someone runs it.


### E5. SHIPPED 2026-09-06 — the link-concentration TEST (51 collections -> /trends/), with its baseline

The one lever from tonight's 15-hypothesis sweep that survived refutation, now shipped as a
**test on one template**, not a bulk change. Commit `a04220e`.

**What changed:** `TRENDS_FALLBACK` in `src/data/pillarMap.ts`, consumed only by
`/collections/[slug].astro`. The 18 collections with a `/learn` pillar keep it; the 51 without one
now render the colour-trends editorial in the existing, already-styled
"From the editorial · Long read" slot. No new nav block.

🔴 **Deliberately NOT wired into `pillarForCollection()`** — `/palettes/[slug]` imports that same
helper (378 pages). Changing it there turns a 51-page test into a 429-page bulk change, which is
the exact shape refuted 14 times in one session. Verified before push: `git diff --name-only |
grep -c palettes` = **0**.

**The diagnosis it tests** (impressions + position ONLY — the CTR columns failed the guard, § E2):

| 2026 cluster | rows | impressions | impression-weighted position |
|---|---:|---:|---:|
| HEAD keywords (>=100 impr) | 5 | **2,080 (85%)** | **5.89** |
| CONVERSATIONAL (what/which/how) | 20 | 118 (5%) | **2.36** |

We rank **2.36 where there is no volume and 5.89 where 85% of it is**. So content quality is not
the constraint — the page wins outright where competition is thin. Authority is: 2 internal
inbound links, and 9 external inbound links site-wide (§ E3).

**BASELINE, 2026-09-06, to be re-read after 3-4 weeks:**

```
page  /trends/color-trends-2026/     6,777 impr   pos 4.9
head  "color of the year 2026"       1,266 impr   pos 5.5
2026 cluster (127 rows)              2,443 impr   weighted pos 5.54
```

**Success = position moving toward 3, read from `GetRankAndTrafficStats`. NOT CTR.** A 1-week read
is noise. If 51 pages move nothing, internal linking is dead as a lever on this site and the
constraint is external authority — which is operator-gated (card `mtpazjk33khznb`).

### E6. REFUTED 2026-09-06 — "the 2026 trends page is stale, pivot to 2027" (my own, 5 minutes old)

Refutation #14, and I generated the hypothesis myself. It was plausible: it is September 2026, the
site's #1 page by impressions is titled "Color of the Year **2026**", a `color-trends-2027.astro`
already exists and serves 200, and `/trends/` itself is a 404. Every one of those is true.

Measured before acting:

| | rows | impressions | share of query impressions |
|---|---:|---:|---:|
| queries containing **2026** | 127 | **2,443** | 28.0% |
| queries containing **2027** | 2 | **2** | 0.02% |

**2026 demand is very much alive in September 2026 and 2027 demand has not started.** The 2027
page sitting at zero impressions is *correct pre-positioning* ahead of the December Pantone
announcement — not a defect, and not something to "fix". Do not re-derive this.

Worth keeping as a shape: a page whose TITLE contains a past year looks stale, and the title is
not the demand. Check the query cluster before treating a dated page as expired.

(`/trends/` returning 404 with no section index is real but was not pursued — it has no measured
demand behind it, and inventing a hub on a hypothesis is what this session refuted 14 times.)


### E7. BUILD COST — three different numbers, and the project card quotes the wrong one for CI

Measured 2026-09-06 on the real code ship (`a04220e`, pipeline 2823725859):

| where | cost | what it is |
|---|---|---|
| **local `npm run build`** | **~41 min** | cold, rasterizes ~1,500 OG + /pin/ images at ~1/sec |
| **CI (GitLab, this commit)** | **139 s** | the actual deploy path |
| CI comment's own estimate | "~8-10 min" | conservative; the measured run was 4x faster |

The project card's "🔴 BUILD COSTS ~41 MINUTES" is true of the **local** build and is the reason
its "BATCH every change into ONE build" advice exists. It is NOT the cost of shipping — CI does it
in ~2.3 minutes. So the batching discipline still matters locally, but a docs-only or single-file
fix does not need to be hoarded for fear of a 41-minute penalty.

⚠️ Do not read 139s as "CI skipped the build" — it did not short-circuit (the diff touched `src/`,
and the short-circuit only fires when every path is under `.claude/`). Confirmed the honest way,
by checking the **served artifact** rather than the exit code: the new link is live on
coquette/y2k/gothic, absent on japandi (which kept its own pillar), and absent on /palettes/.

Also corrected: the project card gives the repo as `acevault-lab/55-colorcombinations`. The real
remote is **`acevault-lab/colorcombinations`** (no `55-` prefix — that is the local *directory*
score-prefix convention leaking into the recorded repo path). The wrong path returns
`404 Project Not Found` from the GitLab API, which reads exactly like a token-scope problem and
is not. Resolve it with `git remote get-url origin`, never from the card.


### E8. CHANNEL MAP 2026-09-06 — Bing WMT sees only 26% of the Bing-index channel here

The DATA block flags traffic-source segmentation as "not yet wired", and the numbers did not add
up: 4,517 human visitors against 519 Bing + 4 Google clicks. So ~4,000 humans/month were arriving
from something nobody had identified. Measured (GA4, 30d, `truncated:false` on the channel pull):

| channel | sessions | share | pv/session |
|---|---:|---:|---:|
| Direct | 3,116 | 45.6% | 1.62 |
| Organic Search | 2,380 | 34.9% | **2.99** |
| **AI Assistant** | **1,037** | **15.2%** | **2.92** |
| Referral | 226 | 3.3% | 2.41 |
| Unassigned / Organic Social | 68 | 1.0% | — |

**Direct is NOT crawler-shaped here** — s/u 1.29, pv/s 1.62, against the 1.00/1.00 signature. That
matches this site's standing 0.0%-crawler flag, so these are real people and the denominator is
sound. (Worth stating explicitly: on most fleet sites a 45.6% Direct share would be the first
thing to distrust.)

**🔴 The finding: Bing Webmaster Tools massively under-reports this site's search channel.**

```
organic by source          sessions
  duckduckgo                   881   42.7%
  bing                         696   33.7%
  ecosia.org                   387   18.8%
  yahoo                         43    2.1%
  ------------------------------------------
  Bing-index family          2,007
  google                        19    0.9%   <- essentially zero

Bing WMT reports              519 clicks
=> WMT sees 25.9% of the Bing-index channel; the channel is ~3.9x its console view.
```

DuckDuckGo **alone** (881) outdraws Bing itself (696). DDG, Ecosia and Yahoo are all served from
the Bing index and none of them appear in Bing Webmaster Tools — the same blindness recorded for
fitmylens in `fleet-session-control`, but far larger here (3.9x vs 1.47x there). **Per-site, not
inheritable: measure it rather than carrying either multiplier across.**

**What this changes:**
1. **The link-concentration test (§ E5) is ~3.9x more valuable than its WMT baseline implies.** A
   position gain on `color of the year 2026` moves DDG + Bing + Ecosia + Yahoo together.
2. **Google is confirmed worthless here — 19 sessions, position 58.3.** Do not spend effort on
   Google rank on this site. This upgrades the project card's existing note from a CTR observation
   to a session-count measurement.
3. **The AI channel is ChatGPT, specifically** — `chatgpt.com / ai-assistant` = 1,021 of the 1,037
   AI sessions, at 2.92 pv/session (as deep as organic). Not a generic "AI" bucket.

⚠️ **Caveat:** the source/medium pull was `truncated: true` (60 of 72 rows). The 8 organic sources
above are the head, so the Bing-family total is a **floor** — the missing tail can only raise it,
never lower it. The 3.9x is therefore conservative.

⚠️ Do not read the 2,380 GA4 "Organic Search" against 2,007 summed sources as a discrepancy — the
channel pull and the source pull are different queries over different row sets, and the latter was
truncated. Compare like with like.


### E9. STRUCTURAL SEO CENSUS 2026-09-06 — 4 of the 5 remaining Bing rules are clean, first-party

A device4 lane answered Bing rule `50 Title too long` first-party (41 pages > 95 chars, ~35
impressions between them, worth <$1/mo). This closes four more **without** the dashboard, by
sampling **one page per template (35 templates)** rather than re-fetching all 1,474 URLs — the
sitemap emits no page shape outside those 35.

**Detector controlled first**, because 35/35 identical results is exactly when an instrument
should be distrusted: on `/about/`, `<h1>`=1 while `<marquee`=0 and `name="nonsense"`=0. It can
return zero.

| Bing rule | verdict | evidence |
|---|---|---|
| 5 missing `<h1>` | ✅ clean | exactly 1 per template, 35/35 |
| 7 missing meta description | ✅ clean | exactly 1 per template, 35/35 |
| 121 Missing Title Tag | ✅ clean | exactly 1 per template, 35/35 |
| 101 robots blocks bingbot | ✅ clean | only `Disallow: /og/` + `/go/`; live `bingbot/2.0` fetch = **200** |
| 118/114 meta description length | 🔴 **27 of 35 > 160 chars** | worst `/collections/art-deco/` **747**, `/glossary/` 365, `/material-design/` 313 |

`Disallow: /og/` and `/go/` are correct and must stay — OG image routes and the affiliate
redirect endpoint, neither of which is content.

**The one finding is recorded, not funded.** A long description costs a truncated snippet, not
rank (descriptions are not a ranking factor). Its CTR effect is *unmeasurable on this site* — the
feed failed the click-selection guard (§ E2), so there is no trustworthy before/after to test it
against. At $0.0117/session, with the worst offender sitting on 93 impressions, even a large CTR
swing is worth cents. Trim the 747-char outlier only as a ride-along if someone is already editing
that template.

**Consistent with the two prior prices on this site**: the title lever <$1/mo, and this one lower.
Three independent SEO-hygiene levers have now been measured and all three priced out. That is a
finding in itself — hygiene is not this site's constraint. Its constraint is authority (§ E3: nine
external inbound links) and its opportunity is the Bing-index channel being ~3.9x its console view
(§ E8).


### E10. REFUTED 2026-09-06 — "Direct is the shallowest channel, raise its depth" (mine, #15)

The setup was clean and the arithmetic correct: Direct is **45.6% of sessions but 31% of
pageviews**, at **1.62 pv/session** against Organic's 2.99 and AI's 2.92. It is the largest
channel and the shallowest, and Pageviews is the site's #1 gap (41% of goal). Closing that spread
looked like ~+4,270 pageviews.

Refuted by looking at WHERE Direct lands before prescribing anything:

```
Direct head landing pages          sess   pv/s
  /                                 590   2.49
  /browse                           339   2.15
  /collections                       31   4.48
  /colors                            27   4.63
  (not set)                          75   0.00   <- unattributed, drags every channel
```

**Direct's head is healthy** — `/collections` and `/colors` are its *deepest* entries on the
site. The 1.62 average comes from its **tail**: Direct spreads across **278 landing pages**
against Organic's 61 and AI's 45. Those are people arriving straight at one specific palette or
colour page (`/palettes/entan-sumi` 21 sess @ 1.10) — ~~bookmarks and returning visitors.~~

~~**A bookmark-return visit to one palette page is a SUCCESS, not a depth failure.**~~
**(EXPLANATION SUPERSEDED 2026-09-06, same session, by measurement — see § E12. Direct is
**87% NEW users** (2,354 new vs 396 returning, 12.8% returning — the LOWEST of any real channel,
against Organic's 31.7% and AI's 24.8%). It is not bookmark traffic and the "returning user
succeeding" reading is wrong.)**

**What survives and what does not.** The MEASUREMENTS in this section stand: the head is healthy,
the 1.62 mean comes from a 278-page tail plus 75 unattributed sessions at 0.00 pv/s, and depth is
a cost on lookup surfaces rather than a goal. **The conclusion — "do not prescribe more depth" —
also still stands**, because the tail is single-page lookups either way. What dies is the *reason*
I gave for it.

Also note `(not set)` appears in every channel at 0.00 pv/s (Direct 75, Organic 133, AI 47) —
sessions GA4 could not attribute a landing page to. They depress every channel's mean, so
cross-channel pv/s comparisons carry that noise and should not be read to two decimals.

⚠️ The pull was `truncated: true` (400 of 1,300 rows), so the tail is only partially visible.
That does not change the refutation — the head is enough to show Direct's shallow average is
composition, not a defect — but it does mean no *positive* claim should be made about the tail.

**What did survive:** `/books/a-dictionary-of-color-combinations` is the AI channel's #3 landing
page at **3.51 pv/session**, its deepest-engaging real entry point, which is consistent with the
site's 45-75% citation share on book queries. The AI-channel gate (2026-10-06) is the right place
to act on that, not a depth campaign.


### E11. GUARD VERIFIED + 89.9% PAGE COVERAGE (self-improvement leg, 2026-09-06)

`information-gain-standard` records that `check-safe-to-delete.mjs` once **failed OPEN** on paths
containing spaces (`import.meta.url` percent-encodes, `argv[1]` does not, so `isMain` never
matched and node exited 0 with no output — "safe to delete" for every URL). **This machine's vault
path contains two spaces**, so that bug would be live here. Verified rather than assumed:

- ✅ The fix is present: `const isMain = import.meta.url === pathToFileURL(process.argv[1]).href;`
- ✅ It BLOCKS with evidence: `/trends/color-trends-2026/` → exit 1, 367 bytes, `entrances:245,
  pageviews:289, entry_rank:3/1325`. Matches the doctrine's own test — a genuine verdict PRINTS
  EVIDENCE; silence plus rc=0 means it never ran.
- ✅ It DISCRIMINATES rather than always-blocking: entry_rank came back 3 · 98 · 130 · 525 across
  the sampled pages, i.e. it is reading real per-page data, not returning a constant.

**Why I could not obtain an `OK` verdict, and why that is a finding rather than a gap:** 8 of 8
pages I sampled blocked — including five `/paintings/` pages picked precisely because a sibling
lane measured that whole type at ~1 Bing impression. They blocked because they have **GA4
traffic** (`water-lilies`: 6 entrances, 11 views, entry rank #98). The tool's own source confirms
`verdict: 'OK'` is reachable (`gsc+ga4-pages-live`). It is simply hard to find an orphan here:

```
pages_seen_for_site (GA4, 30d)   1,325
sitemap URLs                     1,474
                                 -----
coverage                          89.9%   <- ~149 pages without traffic, out of 1,474
```

**Two consequences:**
1. **"Prune the thin pages" is a non-starter on this site.** ~90% of pages received real traffic
   in 30 days. There is no dead weight to remove, and the traffic veto would correctly block
   nearly every candidate. Do not open that line of work here.
2. This partially answers the DATA block's unwired **"indexation coverage (indexed vs sitemap)"**
   — 89.9% of sitemap URLs have GA4 traffic, and Bing reports `InIndex` 1,940 against the same
   1,474-URL sitemap (§ E3). Both point the same way: discovery is not this site's problem.

⚠️ Careful reading: `pages_seen_for_site` counts pages GA4 has *rows* for, which is not identical
to "indexed". It is a floor on coverage, not a search-index census. The Bing `InIndex` figure is
the closer instrument for indexation, and it agrees.


### E12. REFUTED 2026-09-06 — my own E10 explanation, 20 minutes after committing it (#16)

E10 concluded Direct's 1.62 pv/session was "bookmarks and returning visitors succeeding". The
DATA block lists new-vs-return segmentation as **not yet wired**, so I measured it rather than
leaving my own explanation untested. Complete pull, `truncated: false`, 20 of 20 rows:

| channel | new | returning | % returning |
|---|---:|---:|---:|
| **Direct** | **2,354** | 396 | **12.8%** |
| Organic Search | 1,198 | 757 | 31.7% |
| AI Assistant | 673 | 258 | 24.8% |
| Referral | 75 | 92 | 40.7% |
| Organic Social | 30 | 2 | 6.1% |

**Direct is 87% NEW users — the LEAST returning channel on the site.** The bookmark reading is
dead. E10's explanation is superseded in place above; its measurements and its practical
conclusion are unaffected.

**What Direct actually is remains UNIDENTIFIED, and I am not going to guess it.** The obvious
candidate is referrer-stripped AI traffic — this site carries ~25,000 Copilot citations/30d while
only ChatGPT arrives tagged (1,021 sessions), so Copilot referrals would land exactly here. But
the landing mix does not settle it: Direct is homepage-heavy (`/` 590, `/browse` 339), which fits
typed/brand traffic as readily as it fits AI. Do not write "Direct is Copilot" into anything
without evidence that separates the two.

**The one thing this DOES re-open:** 2,354 new users at a shallow tail is a different proposition
from returning bookmarkers. New-user shallowness *can* be an activation problem. It is still not
obviously actionable — Direct's own head pages are the site's deepest — but "returning users
succeeding" is no longer available as the reason to dismiss it.

**The lesson, and it is the one this session keeps re-learning:** I had a correct measurement, a
plausible mechanism, and I committed the mechanism as if it were measured. The measurement that
tested it took one API call and existed the whole time — it was sitting in the project's own
"not yet wired" list. **When a card offers an explanation for a number, check whether the
instrument that would test the explanation is one call away.**


### E13. DEVICE SPLIT 2026-09-06 — mobile converts 1.74x BETTER than desktop here

Last of the DATA block's unwired segmentation. Both pulls complete (`truncated: false`, 3/3):

| device | sessions | pageviews | pv/session | converting sessions | conv rate |
|---|---:|---:|---:|---:|---:|
| **mobile** | 3,218 | 7,843 | **2.44** | 104 | **3.23%** |
| desktop | 3,497 | 7,775 | 2.22 | 65 | 1.86% |
| tablet | 65 | 306 | 4.71 | 3 | 4.62% |

**Mobile is the better half on both axes** — deeper (2.44 vs 2.22 pv/session) and converting
**1.74x** better. That inverts the usual fleet assumption that mobile is the weaker surface, and
it is worth stating plainly because it changes where UI care is best spent here.

**Consequence — it re-prices an existing operator card.** `ms072bswpegdnj` asks the operator to
verify changes on a real phone (a 2026-07-23 honest gap: Chrome MCP could not set the viewport on
that lane). That reads like routine hygiene. It is not: **mobile is ~48% of sessions and the
better-converting half of the site.** A mobile regression here costs more than a desktop one.

⚠️ **Two caveats, both real:**
- GA4 records **232** `amazon_click` events against the beacon's **366** (63%). GA4 is
  consent-gated on this site, so it sees a subset. The device *rates* above are only comparable if
  consent rates are similar across devices — **which is unverified**. Treat 1.74x as directional,
  not exact. The direction is large enough to survive a moderate consent skew; the precise ratio
  is not.
- These are event-level conversions, not orders. Per the fleet's standing correction, clicks are
  not revenue; rank on `$/click x clicks` when money is the question.

**What this does NOT license:** no mobile-specific redesign, and no desktop "fix". Desktop at
1.86% on 3,497 sessions is not broken — it is a different surface with different intent. The
finding is about where verification effort matters, not about a defect.


### E14. SHIPPED 2026-09-06 — malformed BreadcrumbList on the site's #1 page (fbe7053)

A genuine correctness defect, not an optimisation — which is why this one shipped where the three
hygiene levers did not. `/trends/color-trends-2026/` (6,777 impressions, 35.7% of site volume)
emitted:

```
1 Home   -> /
2 Trends -> /trends/color-trends-2026/     <- the page ITSELF
3 Colors of the Year 2026
```

The middle crumb pointed at the same URL as the leaf, because **there is no `/trends/` hub — that
path 404s**. A self-referential breadcrumb is malformed; engines may discard the whole rich result.

**Isolated, and verified rather than assumed** — exactly **2 occurrences across the 45 files
containing a BreadcrumbList**, both trends pages. Every other template is correct and points at a
hub that resolves:

| template | crumb 2 | resolves? |
|---|---|---|
| `/collections/japanese/` | `/collections` | ✅ |
| `/colors/aconite-violet/` | `/colors` | ✅ |
| `/books/*` (shipped earlier tonight) | `/books/` | ✅ |
| **`/trends/color-trends-2026/`** | **itself** | ❌ fixed |

Fix is `Home > leaf`, correct until a real `/trends/` index exists.

**Deliberately did NOT build the `/trends/` hub.** It has no measured demand — queries containing
"2027" carry **2 impressions site-wide** (§ E6) — and inventing a hub on a hypothesis is the exact
shape refuted 16 times in this session. The 404 parent is noted, not fixed by invention.

**Why this passed the funding bar when title/meta/CTR did not:** those were *optimisations* whose
effect is unmeasurable here (the CTR feed failed the click-selection guard). This is a
*correctness* bug in structured data on the highest-value page, the fix is four lines, and CI
builds cost 139s. Different category, different bar.

Both files batched into one build per the project's batching note.


### E15. REFUTED 2026-09-06 — "378 palette pages have a broken breadcrumb" (#17, the alarming one)

The E14 fix prompted a structural sweep: which top-level parent paths 404 while having children?
Four do, and one looked serious:

| parent | children | status |
|---|---:|---|
| **`/palettes/`** | **378** | **404** |
| `/compare/` | 4 | 404 |
| `/trends/` | 2 | 404 |
| `/accessibility/` | 1 | 404 |

Control passed — `/` and nine other parents return 200 — so the 404s are real. A 404 parent under
the site's second-largest page type reads like 378 broken breadcrumbs.

**It is not.** Checked the children before filing anything:

- `/palettes/kurenai-kon/` → crumb 2 is **"Browse" → `/browse`**, which is **200**. The palette
  pages were never routed through `/palettes/`. And `href="/palettes/"` appears **0** times on the
  page — nothing links to the 404 at all.
- `/accessibility/color-blind-tools/` → already `Home > leaf`, the exact shape E14 just shipped.
- `/compare/adobe-vs-coolors/` → middle crumb carries no `item`. Permitted by schema.org and
  inconsistent with other templates rather than malformed. 4 pages. Not worth a build.

So the sweep found **one** real defect (`/trends/`, fixed in `fbe7053`) and refuted the
larger-looking one. **The `count: 0` control is what settled it** — a 404 parent only matters if
something points at it, and measuring "does anything link here" is one grep.

**The shape worth keeping:** an unreachable URL is not a defect on its own. It becomes one only
when something references it — a breadcrumb, a nav link, a sitemap entry, a canonical. Check the
references before sizing the problem by the number of children.


### E16. REFUTED 2026-09-06 — "AI visitors bounce because the colour pages are thin" (#18)

`ai-citation-channel` LAW 4 says the binding constraint is **citation -> click**, and this site is
the fleet's #2 by citations (~25,000 Copilot/30d) converting to ~1,037 AI sessions. Its AI landing
data shows `/colors/kon` at **1.08 pv/session** — land, verify, leave. The rule's own prompt is
"what can this page give the reader that the AI answer cannot?", which invites the conclusion that
the page is thin.

Checked the page before concluding anything. It already carries **12 sections**:

```
About Kon · The story of Kon · Colours that go with Kon · How to use Kon ·
Taking Kon off the screen · Palettes with Kon · Specifications · Quick copy ·
Go deeper on colour · Embed this color · Support the archive · [request a combination]
```

plus 31 copy affordances, an embed widget, and downloads. **It is already doing everything the AI
answer cannot.** The 1.08 pv/session is an *answer page succeeding* — the reader got the fact they
came for. Depth is a cost on a lookup surface, not a goal (§ E10, and `measured-vs-expected` on
page ROLE).

**No defect. Do not "enrich" the colour pages.** Adding more to a page that already answers the
question would trade against the thing that makes it citable.

**This is the eighteenth refutation in this session and it closes the pattern**: every
content/hygiene/UX hypothesis tested on this site has come back either already-correct or priced
under $1/mo. The picture is coherent and worth stating plainly rather than re-testing —

- pages are well-built (one real structural defect found all session: § E14, fixed)
- 89.9% of pages get traffic; there are essentially no orphans (§ E11)
- the constraint is **external authority**: 9 inbound links vs a sibling's 983 (§ E3)
- the opportunity is the **Bing-index channel at ~3.9x its console view** (§ E8), which the
  shipped link test targets (§ E5, gate 2026-10-06)

A future lane arriving here should start from that summary, not re-run the sweep.


### E2. THE FEED CALIBRATION HAS A TOOL, AND THIS SITE FAILS ITS GUARD (2026-09-06)

§ E above derived the 2.54× enrichment by hand. There is a **fleet tool** that answers this
properly and I did not know it existed until the project card named it:

```
node tooling/55-fleet-dashboard/scripts/bing-ctr.mjs colorcombinations.org
```

Its verdict on this site, run 2026-09-06:

```
queries  clicked=359  clicks>=impr=169  medianImpr= 2  -> CLICK-SELECTED - CTR UNAVAILABLE
pages    clicked= 31  clicks>=impr=  5  medianImpr= 8  -> CLICK-SELECTED - CTR UNAVAILABLE
X the PAGE feed also failed the guard - no CTR on this site is trustworthy.
```

**POSITIVE CONTROL RUN, and it passes** — without it, "failed the guard" could just mean the
guard always fails. `node scripts/bing-ctr.mjs cabinpets.com` reports pages **`clean`**
(clicks>=impr = 0, median 79 impressions) and hits its reference figure (2.24% vs ~2.3% expected
-> PASS). So the instrument discriminates, and its verdict here is real.

**What is and is not usable from `/bing-detail` on this site:**

| quantity | usable? | why |
|---|---|---|
| page/query **impressions** | ✅ yes | the demand-shape column the tool endorses |
| **position** | ✅ yes | not a ratio of the two corrupted columns |
| absolute **CTR** | ❌ no | feed failed the guard |
| **CTR ratio** between two pages | ❌ no | selection is per-row, not a scale factor |
| any **per-query** CTR | ❌ never | the tool refuses it under any flag, on any site |

**This does not move tonight's two surviving findings.** The open lever card
(`mtpael6g080ld1`) rests on impressions + position + internal-link counts; the AI-channel finding
is GA4-sourced. Both are independent of this feed's clicks column. The `/collections/y2k/`
"title bug" hypothesis was killed by an independent SERP read, not by the CTR it was explaining —
so that refutation stands, and is now doubly supported.

**Standing instruction for the next lane on this site: run `bing-ctr.mjs` BEFORE quoting any
rate, and run its cabinpets control before believing a failure verdict.** The tool's header
records four published-then-retracted fleet findings from this exact trap; a prose memory existed
for two of them and stopped neither.

### Method note

I used the `/bing-detail` per-page CTRs before noticing this file's own **2.54× enrichment
calibration** above. ~~Ratios between pages survive a uniform enrichment; absolute CTRs do not.~~
**(SUPERSEDED 2026-09-06, same session, by measurement — see § E2. The page feed is
CLICK-SELECTED, not uniformly enriched: 5 of its 31 clicked rows carry `clicks >= impressions`
(all at impr=1, clicks=1 → a literal 100% CTR). That is per-row selection concentrated at the
low end, so it does NOT cancel in a ratio between two pages either. Neither absolute CTRs nor
inter-page CTR ratios from this feed are usable.)**
Use `GetRankAndTrafficStats` for any rate. Searching the board is not enough — **read this file
first**; that lesson cost a duplicate card tonight.

### E17 · 2026-09-06 — retention measured (the unwired axis), and it reframed the whole session: ORGANIC SEARCH IS FLAT, ChatGPT is the #2 source

The DATA block's "not yet wired" list names `Retain: D1/D7/D30 cohorts`. Unlike the AEO item it does
NOT need Chrome, so it was the one genuinely-unrun in-scope lever left. Ran it. It answered a smaller
question than expected and surfaced a much bigger one.

**Instrument note first:** true D1/D7/D30 cohorts need GA4's `cohortSpec`, which `/ga4-probe` does not
expose. `daysSinceLastSession` is a **Universal Analytics** dimension and is invalid in Data API v1
(`"Field daysSinceLastSession is not a valid dimension"` — with a passing control on `newVsReturning`
in the same minute, so that absence is the API's, not the probe's). What follows is the daily
new-vs-returning series, an honest **proxy**, not cohorts. Do not quote it as cohort retention.

#### Retention: real, healthy, and not worth building for

30d, 90/90 rows, `truncated:false`:

| | users | share | pv/session |
|---|--:|--:|--:|
| new | 4,357 | 81.7% | 2.30 |
| returning | 974 | 18.3% | 3.35 |

Returning users are 18.3% of users but **33.8% of pageviews**.

🔴 **One day (2026-08-14) shows returning pv/session of 23.29** — 17 users, 21 sessions, 489 pageviews,
i.e. one very heavy session. Checked rather than reported, per the dominant-member rule:

```
WITH outlier      new 2.30  ret 3.35  = 1.46x
WITHOUT outlier   new 2.29  ret 3.07  = 1.34x
medians           new 2.28  ret 2.94  = 1.29x
returning out-reads new on 24 of 30 days
```

So the effect is real and consistent, and the headline 1.46× was inflated ~9% by one session.
**Use 1.34×.**

**Priced before proposing anything.** Site earns $0.0117/session (measured this session); pageviews
gap is 16,213 → 40,000, i.e. **+146%**:

| returning share | extra pv | % of the gap | $/mo |
|---|--:|--:|--:|
| 18.3% → 22% | +610 | 3.8% | $2.33 |
| 18.3% → 25% | +1,101 | 6.8% | $4.20 |
| 18.3% → 30% | +1,920 | 11.8% | $7.32 |

A **heroic** 18.3%→30% closes 11.8% of a 146% gap for $7.32/mo. ⇒ **Do not fund retention work here.**
Checked what already exists before saying that: `EmailCapture.astro` ships, share/Pinterest/save-image
ships, and there is **no** saved-palettes / favourites / recently-viewed feature. That is the obvious
lever and it is the one the arithmetic kills.

#### 🔴 The finding that actually matters — I had been working a FLAT channel all session

Same window, sessions by channel, first 15d → last 15d (158/158 rows, `truncated:false`):

```
Direct          1319 -> 1772   +453  (+34%)   1.64 pv/s   <- SUPERSEDED by §E20: this is +678% CRAWLER; Direct HUMAN is -21.8%
AI Assistant     443 ->  600   +157  (+35%)   2.90 pv/s   <- deepest channel on the site
Referral         104 ->  122    +18  (+17%)
Organic Search  1196 -> 1194     -2   (-0%)   2.98 pv/s   <- FLAT
TOTAL           3089 -> 3731   +642  (+21%)
```

**Organic Search is flat.** Every lever I priced this session — title length, meta descriptions, the
Bing SEO rules, breadcrumbs — sits on that channel. They were all correctly measured and all
correctly priced under \$1/mo, and now I can see they were also aimed at the one channel that is not
moving. ~~The growth is Direct (+34%) and AI Assistant (+35%).~~ **(SUPERSEDED same session by §E20 — Direct's +34% is a crawler block arriving mid-window, +678%; Direct HUMAN traffic is DECLINING -21.8%. AI Assistant +35% stands and is the ONLY growing human channel.)**

#### Sources, and the sharp contrast inside them

72/72 rows, `truncated:false`:

```
(direct)        3122   Direct          1.62 pv/s
chatgpt.com     1022   AI Assistant    2.93 pv/s   <- #2 source on the whole site
duckduckgo       882   Organic Search  2.57
bing             696   Organic Search  2.98
ecosia.org       387   Organic Search  3.84
yandex.ru        207   Organic Search  3.06
```

**ChatGPT outranks every individual search engine on this site.** AI Assistant breaks down as
chatgpt.com 1,022 · copilot.com 9 · claude.ai 5 · perplexity.ai 2 — **98.5% ChatGPT**.

🔴 **And this site is credited with ~24,987 Copilot citations/30d, which return NINE copilot.com
sessions.** 0.036%. That is `ai-citation-channel` LAW 4 made concrete inside one site: the engine the
site is famous for citing it sends essentially nobody, and the traffic comes from a different
assistant entirely. Flagged upstream — see the fleet-rule note, because the rule's headline 3.63%
citation→click figure for this site joins a Bing-WMT **Copilot** citation count to a GA4 session count
that is 98.5% **ChatGPT**.

#### Landing pages (1000/1492 rows, TRUNCATED — head complete, tail cut, figures are FLOORS)

```
ChatGPT   /  53.0%   /browse 9.9%   /books/ 8.9%   ( /books/a-dictionary-of-color-combinations = 86 sess @ 3.51 pv/s )
Bing      /  38.4%   /trends/ 16.0% /collections/ 13.6%
DDG       /  46.8%   /browse 12.8%  /collections/ 11.8%
```

ChatGPT lands on the homepage and the book page — entity-driven, exactly matching the site's known
45–75% citation share on "dictionary of colour combinations" queries. **The AI channel is working,
deep, growing, and landing on the right pages. There is no defect here to fix.**

#### What this changes for whoever works this site next

- Stop pricing search-side hygiene levers. Measured flat, and separately worth <\$1/mo each.
- Retention is measured, healthy (1.34× depth), and not fundable (\$7.32/mo at a heroic target).
- ~~The two growing channels are Direct (+34%) and AI/ChatGPT (+35%).~~ **(SUPERSEDED by §E20: AI/ChatGPT +35% is the ONLY growing human channel; Direct human is -21.8%.)** Direct reads shallowest
  (1.64 pv/s) and is 42% of sessions — **it is the largest unexamined block on the site** and the
  honest next question, though note §E12 already established Direct here is 87% new users, so it is
  not returning-visitor traffic wearing a Direct label.

### E18 · 2026-09-06 — hypothesis REFUTED as stated, and the refutation found a real measurement error: a CRAWLER-SHAPED sub-block hiding inside a channel that passes the crawler test

Ran the card I filed one leg earlier (`mtpd5oldyw1qcx`): *is Direct referrer-stripped AI traffic?*
Falsification criteria were written into the card **before** any pull. All three are met. The
hypothesis is dead — and the measurement that killed it is more valuable than the hypothesis was.

#### The kill (1,492/1,492 rows, `truncated:false`)

Landing-page mix by source, and the cosine similarity of Direct's mix against each:

```
                       DIRECT  ChatGPT     Bing      DDG
/colors-that-go-with/   30.4%     3.4%     2.8%     1.1%
/                       19.7%    53.1%    39.6%    46.7%
/collections/            3.9%     1.8%    14.7%    12.2%
/trends/                 1.7%     0.0%    16.5%     3.7%
(distinct landing pages)  929       97       90      114

cosine(DIRECT, ChatGPT) = 0.6180
cosine(DIRECT, Bing)    = 0.6142
cosine(DIRECT, DDG)     = 0.6157
control cosine(ChatGPT, Bing) = 0.8800
control cosine(Bing, DDG)     = 0.9490
```

Direct resembles ChatGPT **no more than it resembles Bing or DDG** — 0.618 vs 0.614 vs 0.616, a
0.004 spread. The controls prove the metric discriminates: the three *referred* channels resemble
each other at 0.88–0.95. Device kills it independently — Direct is **65.6% desktop**, ChatGPT is
**76.8% mobile**. Both stated kill criteria fired.

#### 🔴 What the kill exposed

Direct is not head-concentrated like a referred channel; it is an extreme flat tail:

```
                top-10 pages    distinct pages   median sess/page
DIRECT              38.8%             930              1
ChatGPT             86.5%              98              —
Bing                84.6%              91              —
```

**597 of Direct's 930 landing pages received exactly one session.** And 30.4% of Direct — 915
sessions — lands on `/colors-that-go-with/`, spread over **553 distinct URLs at a median of 1 session
each**. So I shape-tested that block on its own:

```
                                  sess   pv/s   s/u   fleet test (s/u<=1.02 AND pv/s<=1.10)
Direct AS TESTED (channel level)  3089   1.64  1.19   passes as human
  |- /colors-that-go-with/ block   915   1.00  1.00   CRAWLER-SHAPED
  |- everything else              2174   1.91  1.29   passes as human
controls: chatgpt.com             1031   2.94  1.28   human
          bing                     695   2.99  1.32   human
```

**915 sessions, 915 users, 915 pageviews — exactly 1.00 on both ratios.** That is the signature the
fleet crawler test exists to catch, and the channel-level test **misses it**, because the block is
diluted by 2,174 genuinely human Direct sessions into an aggregate of 1.64 pv/s.

#### Why this matters beyond this site

This site is recorded fleet-wide as **0.0% crawler-shaped** and `ai-citation-channel` calls it *"the
only ungated earner, the one number to trust unreservedly."* Both statements are true **at the
channel level** and both are misleading, because the crawler test as applied is a per-channel test
and this contamination lives one level below it.

Corrected figures:

| | as reported | crawler block | corrected | overstated by |
|---|--:|--:|--:|--:|
| GA4 users/30d | 4,517 | 915 | **3,602** | **25.4%** |
| pageviews/30d | 16,213 | 915 | **15,298** | 6.0% |

The users figure — the one on the "Human visitors 4,517 / goal 5,000 / 90%" progress bar — is
**overstated by a quarter**. Real progress against that goal is 72%, not 90%.

#### Second finding, free from the same pull

`/colors-that-go-with/` takes **983 sessions from ALL sources at 1.06 pv/s** — 915 Direct-crawler
plus 68 from everywhere else (chatgpt 34, bing 18, ddg 9, ecosia 3, yandex 1). Essentially the
**entire page type is non-human**. 553 landing URLs with ~zero human demand: built ≠ trafficked,
exactly the `realized-demand-discipline` case.

⚠️ **Do NOT noindex or prune it on this evidence.** The traffic veto is mandatory before any such
action, and separately: a page type with no *human* traffic may still be earning AI citations, which
is this site's actual strength. Measure that first. This is a note, not a licence.

#### What I got wrong, and what the process got right

The hypothesis was wrong. Writing the three kill criteria into the card **before** pulling is what
made the refutation fast and unambiguous — with a cosine spread of 0.004 and a passing control at
0.88+, there was no room to talk myself into a resemblance. That is the matcher trap in
`positive-control-before-absence` not firing, because the control was chosen first.

### E19 · 2026-09-06 — 47.7% of the sitemap is a page type with no demand, and it is NOT an indexation blocker (measured, not inferred)

Follow-on from §E18. The `/colors-that-go-with/` block that turned out to be crawler traffic is not a
small corner of the site:

```
sitemap URLs (live, sitemap-0.xml)        1474
  /colors-that-go-with/                    703   47.7%
  /palettes/            (control)          378   25.6%
```

**Nearly half the site's indexable surface is one page type.** What it earns:

```
Bing impressions (30d)          17   across 11 pages   (site total 18,975)
human sessions, ALL sources    ~68   (chatgpt 34, bing 18, ddg 9, ecosia 3, yandex 1)
crawler sessions               915   (the §E18 block, 1.00 pv/s, 1.00 s/u)
```

0.1% of the site's search impressions for 47.7% of its URLs.

#### The question that decides what to do — answered

Per `realized-demand-discipline`, a large built asset with no traffic is a **blocked asset** (cheap
unblock, real ceiling) *or* genuinely demandless (a valuable finding that prevents work). Those need
opposite responses, and the rule is explicit that you must name the blocker rather than assume.
Measured it with `GetCrawlStats`:

```
InIndex        1940      <- vs 1474 sitemap URLs = 131.6%
CrawledPages    780
Code2xx        2161   Code301 1   Code302 0   Code4xx 15   Code5xx 0
InLinks           9
```

**Bing has MORE pages indexed than the sitemap lists.** There is no indexation blocker, no crawl
error wall (15 4xx out of 2,161), nothing to unblock. The pages are indexed and nobody searches for
them. ⇒ ~~**Genuinely demandless.**~~ **(REFINED by §E21 — demandless at the TYPE level, but not uniformly: 43 of 703 pages (6.1%) take referred traffic and 16 (2.3%) read at human depth. 'Demandless' is right in aggregate and too strong as a blanket.)** That is the finding, and per `realized-demand-discipline` a
measured "there is nothing here" is worth more than the work it prevents.

`InLinks = 9` independently reconfirms §E3 — external authority (9 inbound vs a fleet sibling's 983)
remains this site's actual constraint, and it is not something page-level work reaches.

#### Instrument note — a control caught my own bad call

First `GetCrawlStats` attempt returned a 53-byte `{"ErrorCode":8,"Message":"ERROR!!! InvalidParameter"}`
and `params: "(none)"`. Before reading that as "this site has no crawl data", I ran the same call
against **fitmylens** — which failed **identically**. So the fault was mine: the method takes
`siteUrl=`, not the `site=` the other endpoints use. With `siteUrl=https://colorcombinations.org/`
it returned 28,809 bytes and 91 rows. Also confirmed: **rows are NOT date-sorted** — the latest row
was not `rows[0]`, so sort by the epoch inside `/Date(...)/ ` before reading "latest".

Without the cross-site control this would have been filed as a false absence about the site.

#### What this does and does not license

- ✅ It **closes** the "is this page type a blocked asset?" question. Do not re-open it without new
  evidence; it is indexed and unsearched.
- ❌ It does **not** license a prune. The traffic veto (`check-safe-to-delete.mjs`) is mandatory
  before any noindex/de-sitemap, and separately these pages may carry AI citations — this site's
  actual strength — which no search metric here measures. `/colors-that-go-with/` took 34 ChatGPT
  sessions, so the AI channel does reach it.
- ⚠️ It **does** mean: do not build more of this page type, and do not count its 703 URLs as
  progress toward the pageviews goal.

### E20 · 2026-09-06 — I have to correct my own E17: the "+34% Direct growth" is the crawler arriving. Direct HUMAN traffic is DECLINING 21.8%

§E17 (written ~40 min earlier this session) reported Direct as one of two growing channels, +34%.
§E18 then found a 915-session crawler block inside Direct. The obvious follow-up — **did that block
arrive during the window, and is it what "growth" was measuring?** — I did not run before publishing.
Running it now inverts the finding.

#### The signature

Direct's daily series, first 15d vs last 15d:

```
sessions   1319 -> 1772   +34.3%
pv/session 1.84 -> 1.49   -19.1%
```

**Sessions up, depth down** is the crawler-dilution signature. Real growth in a human channel does
not systematically shallow the sessions; a growing population of 1.00-pv/s hits does exactly that.
The two heaviest days are visible in the raw series — 2026-08-22 (241 sessions @ 1.17 pv/s) and
2026-08-26 (209 @ 1.26).

#### Decomposition, with the two inputs measured rather than assumed

Both pv/s constants come from §E18's direct measurement, not from fitting:

```
crawler pv/s = 1.00   (the block, measured exactly)
human   pv/s = 1.91   (Direct-minus-block, measured)

total_pv   = c*1.00 + h*1.91
total_sess = c + h            ->   h = (pv - sess) / 0.91
```

|  | sessions | human | crawler |
|---|--:|--:|--:|
| first 15d | 1,319 | 1,213 | 106 |
| last 15d | 1,772 | 948 | 824 |
| **change** | **+34.3%** | **−21.8%** | **+678%** |

#### 🔴 Positive control on the decomposition — this is why I trust it

The model predicts **929** total crawler sessions across the window. §E18 measured **915** directly,
by a completely unrelated route (landing-page × source, counting the 1.00/1.00 block). **1.6% apart.**
Two independent methods, same answer — so the split is a measurement, not a curve-fit.

#### Corrected channel picture

```
Direct human       1213 -> 948    -21.8%   DECLINING
Organic Search     1196 -> 1194    -0.2%   flat
AI Assistant        443 ->  600   +35.4%   the ONLY growing human channel
```

Every human channel on this site is flat or shrinking **except AI**. That is a materially different
site than the one §E17 described, and it was one arithmetic step away from the data I already had.

#### What I got wrong, precisely

I measured a channel-level aggregate, found growth, and published it — then found a crawler block in
that same channel one leg later and **did not go back and re-ask whether the growth was the block**.
The finding and its refutation were 40 minutes apart in the same session, using the same dataset.
This is `measured-vs-expected` § crawler denominators in its trend form: contamination does not only
depress a *rate*, it can manufacture a *trend*, and the trend is the more persuasive artifact
because it looks like momentum.

**Standing check for this site:** any Direct-channel figure must be decomposed before use. The
channel-level crawler test passes here (§E18) and will keep passing, because dilution is exactly what
it cannot see.

### E21 · 2026-09-06 — ran the mandated traffic veto, caught my own invalid probe, and got a precise answer plus a tool limitation

§E19 left the prune question open with a caveat. Closed it — after first invalidating my own test.

#### 🔴 My first veto run was worthless, and it "passed"

I fed the tool `https://colorcombinations.org/colors-that-go-with/an-outfit`. It returned
**✅ OK — safe to delete, 0 impressions, 0 views**, twice, with a passing control (the trends page
correctly returned 🔴 BLOCK at 245 entrances). Everything looked clean.

**That URL does not exist.** The real structure is two-segment —
`/colors-that-go-with/<colour>/an-outfit`. I built the URL from my own bucket aggregation, which
strips to the first path segment. So the tool correctly reported no traffic for a page that isn't
there, and I nearly recorded it as evidence the page type is safe to prune.

Caught only because the verdict **contradicted my own data**: I had `an-outfit` at 17+13+13 sessions.
Two instruments disagreeing is the signal; picking the convenient one is the failure. The real
strings are 51 distinct `/colors-that-go-with/<colour>/an-outfit` pages.

`positive-control-before-absence` says it outright: *URLs come from the sitemap, verbatim; never
construct one to test whether a thing exists.* I constructed one. The control passing did not save
me, because the control tested the instrument, not my URL.

#### Re-run with verbatim sitemap URLs — now it discriminates

```
A  /colors-that-go-with/rust/an-outfit        🔴 BLOCK  16 entrances, 16 pv, entry rank #27/1325
B  /colors-that-go-with/turquoise/nursery/    ✅ OK     0 GSC impressions AND 0 GA4 views
C  /colors-that-go-with/burgundy/an-outfit    🔴 BLOCK  GSC serving it: 1 impr at avg position 2
```

#### 🔴 Tool limitation worth carrying: the veto does not apply the crawler-shape test

Case A is **16 entrances / 16 pageviews — exactly 1.00 pv/s**, i.e. the §E18 crawler. The veto calls
it *"a working page"* and blocks.

That is **conservative in the correct direction** — protecting a crawler-only page costs nothing,
deleting a human page costs a lot — so this is not a defect to fix. But it does mean: **on a
crawler-contaminated site, a `BLOCK` verdict does not imply humans use the page.** Read the evidence
line, not just the verdict; `entrances == pageviews` is the tell.

#### The precise answer §E19 should have given

Of the 703 `/colors-that-go-with/` URLs, over 30d:

| | pages | share |
|---|--:|--:|
| appear in GA4 at all | 565 | 80.4% |
| **have ANY referred (non-Direct) session** | **43** | **6.1%** |
| **read deeper than 1.10 pv/s (human-shaped)** | **16** | **2.3%** |
| never seen at all | 138 | 19.6% |

Referred traffic to the whole type: **68 sessions across 43 pages.** Some of it is genuinely good —
`/burgundy/an-outfit` takes 4 ChatGPT sessions at **3.50 pv/s**, and case C shows Google ranking one
at **position 2**.

So the type is demandless *in aggregate* with a small real tail, not uniformly dead. §E19's
"genuinely demandless" is corrected in place above.

#### Standing verdict for the next lane

- ✅ **Do not build more of this page type.** 703 URLs returning 68 referred sessions is settled.
- ❌ **Do not bulk-prune it either.** 43 pages have referred demand and Google ranks at least one at
  position 2; a type-wide noindex would cut them. Any prune must be **per-URL through the veto**, and
  the veto's BLOCKs must be read for `entrances == pageviews` to avoid protecting crawler-only pages.
- The honest middle option nobody has costed: prune only the 138 never-seen URLs. That is 19.6% of
  the type and 9.4% of the sitemap — and per §E20 the site's constraint is external authority
  (`InLinks = 9`), which pruning does not touch. **Measure the benefit before doing it.**

### E22 · 2026-09-06 — the "Refer / advocacy" axis is NOT unwired: the site emits it, the LAYER doesn't read it. Measured 2.95%. Plus an instrument trap that gave me a 3.7×-wrong number

Last runnable item on the DATA block's "not yet wired" list that does not need Chrome
(`Refer: k-factor / shares / embeds / TikTok→site`). It turns out to be a labelling problem, not a
measurement gap.

#### The site has been emitting advocacy events all along

GA4 event inventory, 30d, 26/26 rows `truncated:false`:

```
share:        download_share_card 157 · share_pinterest 8 · share_download 4
              quick_share_twitter 3 · share_copy 1 · share_twitter 1      = 174
take-away:    export_click 48 · copy_hex_all 45 · GradientCopy 3          =  96
(context)     amazon_click 232 · Search 342 · SearchNoResults 186 · explorer_use 612
```

Mechanism, read rather than assumed: components carry `data-event="share_pinterest"` etc.
(`ShareActions.astro:103,132`, `ShareBar.astro:87`, `palettes/[slug].astro:425,442`) and a delegated
emitter in `BaseLayout.astro:396` fires `gtag('event', name, {page: location.pathname, ...props})`.
Grepping `ShareActions.astro` for `gtag` returns nothing — the emitter is one level up, which is why
a component-local grep would have produced a false "not instrumented".

So **"not yet wired" describes the fleet dashboard's metric coverage, not the site.** The data
exists; the layer isn't reading it. That makes this a much cheaper dashboard win than "build to light
up" implies — it is a read, not a build.

#### Measured

| | value | reference |
|---|--:|---|
| share-per-session | **2.95%** (174 / 5,905 human sessions) | `aceusergrowth` Part 12 target ≥3% |
| incl. take-aways | 4.57% (270 / 5,905) | — |
| amazon_click rate | 3.93% (232 / 5,905) | — |

Essentially **at** the advocacy target. Not a gap, and not worth funding.

`download_share_card` at 157 is 90% of all share events — the Canvas-drawn 1200×630 PNG. The social
buttons (pinterest 8, twitter 3+1, copy 1) are near-zero. Per `aceusergrowth` Part 12 V-F1 the share
card is the highest-k-factor affordance, so the mix is the *right* one; do not "fix" the social
buttons.

#### 🔴 The instrument trap — I nearly published 6.89%

To get the denominator I called `/ga4-probe` with **metrics and no `dims`**, expecting one total row.
It returned `sessions=2524`. I computed 174/2524 = **6.89%** and was about to write it down.

**`/ga4-probe` injects `dims=pagePath` when you pass none, with a default `limit: 15`.** The echoed
`request` shows it plainly. So `rows[0]` was the **homepage** — 2,524 sessions for `/` — and I read a
single page's number as the site total. The output is a plausible integer with no error and no flag.

Real denominator, built by two independent routes:

```
date x channel        6820 sessions   15948 pageviews
landingPage x source  6807 sessions   15948 pageviews
agreement                0.2%             0.0%
```

Corrected: 174 / (6,820 − 915 crawler) = **2.95%**. The figure I nearly shipped was **3.7× too high**.

**Standing rule for this endpoint:** it has no "site total" mode. To get a site aggregate, pull a
dimension you can sum and sum it — and cross-check with a second dimension, because a single summed
pull cannot detect its own truncation. Never read `rows[0]` of a dimensionless call as a total.

That is the third time tonight the same shape has bitten: §E19 (guessed field names on `/bing-detail`
→ division by zero), §E21 (constructed a URL that didn't exist → false "safe to delete"), and now a
default dimension I didn't ask for. **Print the echoed `request` before trusting any figure from this
endpoint.**

**§E22 precision fix (same leg):** I called 2.95% a "share-per-session rate", and 90% of that number
is `download_share_card` — a **download**, which is an *intent* to share, not a confirmed share. The
actual posting happens off-site and is unmeasurable from here. So:

- ✅ **2.95% is a real share-*affordance-use* rate** and is the right number to compare against the
  ≥3% target.
- ❌ It is **not** k-factor. `aceusergrowth` Part 12 V1 (k-factor = new users brought per user)
  remains genuinely **unmeasured** on this site, and nothing available without inbound-attribution
  data can measure it. The DATA block's "Refer: k-factor ... not yet wired" is therefore **correct
  about k-factor specifically** — my §E22 heading overstated by treating the whole axis as covered.

What §E22 does establish: the *share-event* half of that axis is instrumented and at target, so the
layer can read it today. The *k-factor* half is a real gap and stays open.

### E23 · 2026-09-06 — the crawler block is ONGOING (41% of Direct in the last 5 days), so the site's numbers keep drifting

§E18/§E20 established the block and its effect on the 30d window. The question that decides whether
anyone needs to act: **is it still happening, or did it pass?** Decomposed the recent daily series
using the same two measured constants (crawler 1.00 pv/s, human 1.91 pv/s):

```
day         sess  human  crawler  crawler%
20260901     117     58       59       50%
20260902     106     74       32       31%
20260903      96     43       53       55%
20260904     108    100        8        7%
20260905      55      9       46       84%

last 5 days: 482 sessions -> human 284, crawler 198  (41%)
```

**Ongoing.** So `visitors_best` for this site will keep reading high until the block stops or the
metrics layer accounts for it, and each week's figure drifts by however much the crawler did that
week. That is the argument for the Fleet Dashboard card (`mtpdoesf3e5cam`) being worth doing rather
than filed-and-forgotten.

#### ⚠️ Limitation of the daily decomposition — do not quote single days

2026-08-25 yields **human 99 against 94 sessions, i.e. crawler = −5**, which is impossible. The model
assumes a fixed human pv/s of 1.91; on a day when real human reading ran deeper than that, it
over-attributes and the residual goes negative.

So: the **aggregate** decomposition is sound — it reproduced the independently-measured 915 to within
1.6% (§E20) — and the **per-day** figures are noisy. Use 5-day or 15-day windows. A single day's
crawler share from this method is not a measurement.

That caveat is the honest counterpart to §E20's positive control: the same model that agrees to 1.6%
over 30 days produces an impossible value on one day, and both facts are true. Aggregate agreement
does not license per-element precision.

### E24 — Shelf attribution: NOT broken. GA4 shows 87.5% `(not set)` because the custom dimensions were registered 2026-09-04 (forward-only). The beacon has the answer for the full 30d. (2026-09-06)

Gap-sweep leg. Chased the money constraint recorded in `PaintThisPalette.astro` and card
`mspu9hngsintyv` — conversion is fleet-BEST (9.23%) while $/click is fleet-WORST, so **basket
size**, not persuasion, is the lever. To act on that you must know which shelf earns. Measured it.

**GA4 `amazon_click`, 30d — reads BROKEN, is not:**

| dimension | `(not set)` | tagged |
|---|--:|--:|
| `customEvent:shelf` | 203 (87.5%) | book 20 · tool 9 |
| `customEvent:dest`  | 203 (87.5%) | amazon 29 |
| `customEvent:asin`  | 203 (87.5%) | 11 distinct ASINs |

Identical 203 across all three = same-source signature. Split by date it is a **perfectly clean
cutover — 0 tagged on every day 08-07→09-03, 100% tagged on 09-04 and 09-05, not one mixed day.**

**Cause is registration, not code.** `public/amazon-track.js` has sent `{page, asin, dest, shelf}`
since at least `9beddee` (2026-09-02), and `&f=<shelf>` on the beacon since `f642415`
(2026-08-24, *"177 clicks/30d were arriving unattributed"*). Verified by reading the pre-09-04
blob: `git show 9beddee:public/amazon-track.js` contains `shelf:shelf`, `asin:asin`, `dest:dest`.
So the params were being SENT and simply not RECORDED as dimensions until registered — and GA4
custom-dimension registration is **forward-only**. The 08-07→09-03 window is permanently
unattributable *in GA4*.

🔴 **The trap: a 30d GA4 query today returns 87.5% `(not set)` and reads exactly like broken
instrumentation.** It is not. Window any shelf/asin/dest analysis to **≥ 2026-09-04**, or use the
beacon.

**The beacon already has the full 30d** (`data.json`, `amazon_clicks_by_position_30d`):

```
book 144  ·  tool 25  ·  reviewprobe 1      (170 tagged of 366 beacon clicks)
```

So the high-basket rail (`tool` = ART_SUPPLIES: Pantone guides, Calibrite colorimeter) takes
**14.7% of tagged clicks**; books take **84.7%**. The rail is NOT structurally unreachable — it
renders on the four largest page types (`/colors/[slug]`, `/colors-that-go-with/[color]/[context]`,
`/collections/[slug]`, `/palettes/[slug]`), and a served `/palettes/akane-tokiwa/` carries 9
`amazon_click` anchors, 6 with `data-tool`.

**Money, same window:** $52.32 / 594 Amazon-counted clicks = **$0.088/click**, 64 orders, 9.23%.

**What this does NOT establish — and must not be read as establishing.** A shelf CLICK mix is not
a shelf REVENUE mix. Shifting clicks book→tool is a *hypothesis*, not a conclusion: a $200+
Pantone fan guide is a considered professional purchase and may convert far below a $15 Wada
volume, so `clicks × conv × AOV × commRate` could fall. Per `earner-allocation-floor`, never rank
a shelf on click share alone.

**The measurement that would settle it** is per-shelf revenue = Amazon **Linked-Product** report
joined to the now-live `asin` dimension. Linked-Product is not in `data.json`; the per-tag report
carries tags without products and vice-versa (see `affiliate-link-gate` § attribution limit). That
join — not another page type — is the next real step on the basket-size thesis.

**Caveat on the mix itself:** beacon undercounts Amazon 1.62× (594/366 — consent + adblock). If
adblock correlates with the professional audience that buys the `tool` rail, 14.7% is a *floor*.

**Instrument notes from this leg (both cost a wrong answer first):**
- Probed `customEvent:tool` / `customEvent:book` initially — params `amazon_click` **never sends**.
  Returned a plausible 222/10 split that meant nothing. The real names are `shelf`/`asin`/`dest`,
  and they live in `public/amazon-track.js`, not in `BaseLayout.astro` — whose delegated listener
  **explicitly skips** `amazon_click` (`if (name !== 'amazon_click')`, to avoid double-counting).
  Read the actual sender before naming a param.
- `sed 's|</\?loc>||g'` on the sitemap: BSD sed needs `-E` for `\?`, so the `<loc>` tags survived,
  curl rejected the URL, and every count came back 0 — including the control. Caught only because
  the control was there.
### E25 — Ownership check on the COTY cluster: NOT owned, page already best-in-class, CTR is definitional zero-click. NO title work. (2026-09-06)

Ran the `ai-citation-channel` ownership procedure (one WebSearch per query) on this site for the
first time. Site's search channel is effectively Bing-only: 519 Bing clicks vs 4 GSC clicks.

Two clusters (/bing-detail, limit=5000, 931 query rows / 139 page rows):

| cluster | impr | clicks | CTR |
|---|--:|--:|--:|
| "dictionary of color combinations" (7 variants) | ~3,502 | 239 | 6.8% |
| "color of the year 2026" (5 variants) | ~2,080 | 9 | 0.43% |

WARNING: that 0.43% is a query-feed artifact — do not quote it. The queries array is
click-selected. At PAGE level:

    /trends/color-trends-2026/   6,777 impr   183 clicks   2.70%   pos 4.9   <- #1 page by impressions
    / (home)                     6,585 impr   471 clicks   7.15%   pos 4.1   <- same-site control

OWNERSHIP VERDICT: NOT OWNED. Searched "color of the year 2026"; 7 results. Benjamin Moore,
Sherwin-Williams and Pantone each publish a page covering ONLY their own colour, on an inherently
cross-brand question with 14 official answers. No standards body, no on-topic Wikipedia. The only
aggregators are incidental one-off articles from non-specialists (Young House Love, wunderlabel x2,
ArchDaily) — not exact-match dedicated domains, so not PEER-SATURATED either.

I would have guessed "Pantone owns it." Measured, that is wrong — a brand page covering only its
own colour cannot be the canonical answer to a cross-brand query. 3rd armchair owner-guess to miss
on this fleet; run the search.

BUT THE CONCLUSION IS STILL: do nothing to the title. Not-owned + top-5 + CTR 2.6x below the site's
own control is normally the one case where title work IS indicated. It fails at the next step
because the page is already best-in-class:

  title: Color of the Year 2026: Pantone Cloud Dancer + 13 More — The Dictionary of Color Combinations
  meta : All 14 official 2026 Colors of the Year in one place — Pantone Cloud Dancer, Benjamin Moore
         Silhouette, Behr Hidden Gem, Sherwin-Williams Universal Khaki and more.
  H1   : The 2026 Colors of the Year
  brands on page: Pantone 43 · Benjamin Moore 20 · Behr 18 · Sherwin 17 · Coloro 11 · WGSN 11 · Dulux 5

Front-loaded, intent-matched, names the headline answer AND the aggregation, and covers more brands
than any competitor that ranks. Nothing a rewrite would add.

=> The 2.70% is the DEFINITIONAL ZERO-CLICK signature: the headline fact ("Pantone Cloud Dancer") is
one sentence, so the SERP answers it, and only the minority wanting all 14 + hex + palettes click.
Not a defect; no copy change moves it. Judge this page on conversion + AI citation, not SERP CTR.

Upside is on the AI axis: same cluster carries ~342 citations at 8-24% share, ~1,737 unwon, on the
site's only growing human channel (AI +35.4%). Feeds existing gate mtp835nfohbpez (2026-10-06).

Net: a measured negative that prevents work on the site's #1 page. 8-for-8 on this fleet for "the
obvious content/title fix, refuted on measurement."

### E26 — the IndexNow manifest was git-tracked but never ADVANCED; next deploy would have announced 94% of the sitemap

Closes card mtp18dxy3lsx9i, which asked for CI IndexNow wiring and named manifest persistence as the
blocker. Two corrections came out of checking it.

**1. The card's blocker was a false absence.** It concluded the manifest is untracked from
`git ls-files | grep -i changed-urls` → zero results. That grep is for the wrong filename. The file
is `.indexnow-manifest.json`, and it has been git-tracked since 46b11cd (2026-09-04). `.gitignore`
does list `.changed-urls.json` — a different, optional producer file the script treats as input #1.
So the wiring was already safe to do, and a prior leg had already shipped it (936756e). The lease
expired before `complete_task`, which is why the card was still open.

**2. The real defect was one layer down, and the card's own instruction is what found it** —
*"verify by observing an actual deploy's submitted URL count, not by reasoning about it."*
CI always had A baseline; it never had an ADVANCING one. Each job wrote a refreshed manifest into
the container and discarded it, so the baseline stayed frozen at its commit date while content
shipped over it. Measured, 35 `src/` commits past the baseline (incl. `21ad1ca` which touches all
348 colour pages):

```
sitemap URLs 1,474 · manifest entries 1,471
  unchanged (matches manifest)     54
  genuinely CHANGED             1,386
  NEW (absent from manifest)        3
  => next deploy submits ~1,389 of 1,474  (94%)
```

Once is defensible — those pages really did change. The defect is that it repeats on EVERY deploy,
because nothing advances the baseline. That is the batch-abuse pattern `scripts/indexnow-ping.mjs`
exists to prevent, reached from the other side. It matters here specifically: Bing is this site's
live channel (519 clicks vs 4 Google/30d) and ChatGPT grounds on the Bing index.

**Fix (6abe199):** GitLab CI `cache:` keyed by `$CI_COMMIT_REF_SLUG` on `.indexnow-manifest.json`.
Cache restores AFTER checkout, so the advanced manifest overwrites the git baseline; the job saves
the refreshed one. Chosen over a git write-back because that needs a push credential this job does
not have (minting one is an operator decision). **Cannot regress:** a cache miss leaves the
git-tracked baseline in place — exactly today's behaviour.

#### Three instruments that lied on the way, all caught by controls

- **`git ls-files | grep changed-urls`** — the card's own blocker. Right command, wrong filename.
- **`INDEXNOW_DRY_RUN=1` locally reported "1 URL"** and I nearly filed that as "verified, changed-only
  works." It was an artifact: the script reads `dist/sitemap-0.xml`, my local `dist/` has no sitemap
  at all (incomplete build — 2,102 html vs the CI floor's 2,128), so it fell through to the single
  `PRIORITY_URLS` entry. A reassuring number produced by a blind instrument.
- **Live-page hashing is unusable on this site.** Three fetches of `/about/` gave three different
  `<main>` hashes at identical byte length — Cloudflare rotates `data-cfemail` email-obfuscation
  tokens per request. Any live-vs-build comparison here is noise. Only build-output-vs-manifest is
  valid. Caught only by fetching the same page three times before trusting one comparison.

Also worth noting: the script's own header already said the job log proves nothing
(*"a full submit and a correct submit produce near-identical logs"*) and prescribed the behavioural
dry run. I spent a round chasing the CI job trace before reading that — and the trace was 403 anyway
(`insufficient_granular_scope`, needs `Job: Read`; `ci/lint` likewise needs `CI Config: Validate`).
Two more instances of the granular-PAT gap already recorded for `Merge Request: Merge`.

#### Verification status — deliberately partial, and the gap is named

**Verified:** YAML parses and GitLab accepted the `cache:` config; pipeline `2823866911` on `6abe199`
ran a real build and reached **success in 171s**; site live after deploy (`/`, `/glossary/`,
`/colors-that-go-with/` all 200); money path intact — a tokenless `/go/b/0714873896?c=book` probe
returns **302 to bare root** (path stripped ⇒ the gate rejecting, not a canonical redirect), with
`/shop/` at 54 `/go/` links as the positive control, and the leak detector self-tested against a
synthetic tagged URL first.

**NOT verified — the one thing the card actually asked for.** It said to confirm by *observing an
actual deploy's submitted URL count*. I could not: reading a job trace needs a PAT with `Job: Read`,
which this token lacks (403 `insufficient_granular_scope`), and there is no Chrome MCP on this lane
to use the documented session-cookie path. So the cache round-trip — that run N+1 restores the
manifest run N saved — is **reasoned, not measured**. I am not claiming it.

What makes shipping it anyway defensible is the failure direction, not confidence: a cache miss
leaves the git-tracked baseline in place, which is precisely today's behaviour. The change can be
inert; it cannot be worse. That asymmetry is the whole argument.

**The one command that closes it**, for whoever next has the scope or a browser — read the second
deploy's log and look at the `changed:` figure:

```
Sitemap+priority: 1474 URLs · changed: N · via content-hash
  N ~= 0-few  -> cache round-trip works, changed-only restored
  N ~= 1,389  -> cache is NOT persisting; the baseline is still frozen
```

### E27 · 2026-09-06 — 702 pages (47.7% of the sitemap) breadcrumb-linked to a 404, plus two dead editorial links; all three fixed live

Gap-sweep leg, board's agent zone empty (only `assignee:human` + `kind:reference` cards left).
Swept all 1,474 sitemap URLs (probe controlled both directions: a known-404 URL 404s, home 200s)
— clean, 1,474/1,474 200. Then swept every internal `href` on a 57-page stratified sample (one per
sitemap type, 4 random from larger types) against the sitemap and every static href in `src/`
against live status. Found three real defects.

**The big one: `/colors-that-go-with/<color>/<context>/` (702 pages, 47.7% of the sitemap) emits a
visible breadcrumb `<a>` AND a `BreadcrumbList` JSON-LD `item:` both pointing at
`/colors-that-go-with/<color>/`, which does not exist** — only `[color]/[context].astro` is built;
there is no `index.astro` under `[color]/`. 11/11 sampled child pages confirmed: href present,
JSON-LD item present, parent 404.

This is the SAME shape §E15 swept for and correctly refuted at the top-level `/palettes/` parent
("an unreachable URL is not a defect on its own... check the references before sizing the problem
by the number of children" — count was 0 there). §E15 swept top-level parents only; this is a
second-level parent it never reached. The count here is not 0 — it's 11/11.

**Fix**, matching an existing in-repo pattern rather than inventing one: `compare/hsl-vs-lch.astro`'s
BreadcrumbList already has a position-2 ListItem with `name` only, no `item` — valid schema.org, and
already shipped. Applied the same shape: de-linked the visible crumb (`<a>` → `<span>`), dropped the
JSON-LD `item` key. Did NOT build `[color]/index.astro` — that page type (parent hubs over 703
already-demandless children) has no basis to expect demand, and §E19 explicitly says don't build
more of this page type.

**Two smaller, unrelated defects found in the same sweep, both live editorial-page dead links:**
- `/palettes/` (8 links, 7 editorial pages) — 404. `/browse/` is the real palettes index (title
  "Browse all palettes," carries all 378 palette hrefs) — repointed. Does not contradict §E15: that
  swept palette-PAGE breadcrumbs (0 references, correctly refuted); these are editorial-page
  references §E15 never sampled.
- `/colors/rikyu/` (2 links, learn/wabi-sabi-color-theory) — 404. Control: sibling links
  `/colors/seiji/` and `/colors/kogecha/` both 200, so the route works and the colour is genuinely
  absent from the corpus. Repointed to `/palettes/kariyasu-rikyu/` — literally titled "Grass Yellow
  & Rikyū Grey," the exact colour the prose names.

**Verify:** `astro check` 0 errors / 0 warnings before commit. Post-deploy full sitemap re-sweep
1,474/1,474 → 200, unchanged. Money path re-checked safely in the same pass — bare + forged-token
`/go/` probes both 302→bare own-origin root, zero clicks fabricated (no `-L`, no minted token, no
forged Sec-Fetch headers).

**Collision, handled:** a sibling session was concurrently committing `.claude/state/TASKS.md`
(§E26, the IndexNow manifest fix) in this same checkout. Committed my 9 `src/` files by explicit
pathspec — `git show --name-only` on the resulting commit confirmed zero `.claude/` paths — pushed,
and verified the push landed via `origin/main` SHA match before moving on.

**What this does NOT license:** the 702-page count is now correctly LINKED, not made more valuable.
§E19's finding stands — this page type is indexed and essentially unsearched (0.1% of the site's
search impressions). The fix removes a real schema/UX defect (a dead breadcrumb reference on nearly
half the site); it is not evidence the page type deserves more investment.

### E28 · 2026-09-06 — shipped the 54-hub build the Ownership Law check justified (card mtph3aaiz2ylei), live and verified

Card ran the search-index gap measurement + the Ownership Law check on both head queries ("colors
that go with beige" / "...green") — NOT OWNED on both, `palettehunt.com` the only archetype peer
(existence proof, not saturation) — and handed off at that decision point, deliberately not
half-building. Picked it up, built option 2 exactly as scoped, shipped `a8adb1c`.

**What shipped:** `src/pages/colors-that-go-with/[color]/index.astro`, 54 static hub pages (one per
`commonColors` entry that clears the same `MIN_PALETTES>=4` quality guard the 702 leaves already
use). Zero fabrication — every figure is either computed from the hex (RGB/CMYK/HSL/contrast,
identical formulas to `[context].astro`) or drawn from the existing archive-match engine
(`@data/pairings`' `palettesFor`/`partnerColors`, already used by the leaves). Each hub: colour
reference block, 5 HSL-derived theoretical partners, a per-setting roll-up linking that colour's own
leaves (each with its live archive-match count, not a bare link list), up to 6 deduped archive
palette matches, FAQ matching its own FAQPage schema. Monetization placement mirrors the leaf
template exactly (PaintThisPalette + BundleCta + FurtherReading).

**Wired the internal-link graph both directions**, closing the exact defect §E27 fixed by removing:
- `colors-that-go-with/index.astro`'s 54 `<h2>` headings now link to their hub (were plain text).
- `[color]/[context].astro`'s breadcrumb + JSON-LD `item` — REMOVED this morning in `cbf38e4` because
  the parent genuinely 404'd for all 702 leaves — RESTORED here, now correctly, because the hub this
  commit builds is what makes the link valid. Same code, opposite correctness, because the target
  changed underneath it.
- `search-index.json.ts`: indexed the 54 hubs, one row per colour, deliberately NOT the 702 leaves —
  the card's own stated reason (13 near-identical "X — bedroom / X — bathroom" rows would crowd out
  the Wada archive colours for a bare colour-name search) is exactly the crowding risk it flagged for
  option 1. Also fixed a comment the card identified as falsified: it claimed "no Wada colour is
  named or means beige... dataset absence" — true of the Wada PALETTE dataset, false of the site once
  the pairing engine's 54 common colours (incl. Beige, Burgundy, Emerald Green) existed. Corrected in
  place; "matcha and white" remains a genuine absence and is untouched.

**Verify, live:**
```
sitemap        1,474 -> 1,528   (+54, exact — no other change)
54 spot-checked hub URLs         all 200
search-index.json cgw entries    54 total, exactly 1 per colour (beige: 1 row, not 13)
JSON-LD types on /beige/         CollectionPage + BreadcrumbList + FAQPage all present
undefined/NaN/[object] leak      none
breadcrumb restored on a leaf    /colors-that-go-with/beige/bedroom/ links back to the hub, live
root index heading links hub     confirmed live
money path on the new page       /go/b/... bare probe -> 302, bare own-origin, zero clicks fabricated
astro check                      0 errors / 0 warnings, twice (before + after the follow-on files)
```

Not run: a full local `npm run build` (image rasterization ~41 min) or a CI-log read — CI is the
sole deploy path here (`_deploy_note`) and already gates page-count / affiliate-leak / a post-deploy
production assertion; verified against the SERVED site instead, which is the standard this file's
own instrument-trap sections argue for over trusting a green pipeline.

**Explicitly not claimed:** the 702 existing leaves this hub links to draw ~17 Bing impressions/30d
combined — weak evidence the section can rank at all. The ownership check says the head query is
winnable; it does not prove this site wins it. This is a measured ship, not a booked one — re-check
Bing impressions on `/colors-that-go-with/beige/` et al. in a future pass rather than assuming.

### E29 · 2026-09-06 — checked the remaining zero-result search terms after §E28; "wada"/"292" are already fixed, not a residual gap

Board's agent-zone empty after §E27+§E28. Pulled the full zero-result search log fresh
(`GA4 SearchNoResults`, 30d, `truncated: false`, 164/164 rows) to see if anything else cheap and
real was left, now that the search-index instrument was already warm.

`wada` and `292` each still show 2 events in the 30d window. `search-index.json.ts`'s own comment
claims both were fixed. Verified against the LIVE index rather than trusting the comment: `wada`
matches 348 rows, `292` matches exactly 1 (the correct plate — `/palettes/wada-292-...`). Simulated
the site's own match logic (title+x, lowercased substring) against both terms directly. **Both are
genuinely fixed and live.** The 2 events each are residual from inside the 30-day window, before the
fix shipped — not an ongoing gap. Nothing to do here; recording it so a future session doesn't
re-open it on the strength of the raw event count alone (this file's own doctrine: a fleet flag is a
timestamp, not a state).

Everything else in the top 30 zero-result terms is either already-documented-as-genuine-absence
(`Pale Purplish Vinaceous`, `Sulphur yellow`'s upstream typo), a bare hex code (routed to
`/tools/palette-from-color` per the generator's existing comment), a non-English query
(`Коричневый`), or a typing fragment of an already-fixed term (`black wi` → `black white`, fixed
per the generator's own before/after table). No further action identified. Closing this leg here —
agent-eligible queue is empty; remaining cards are `assignee:human` or `kind:reference`.

### E30 · 2026-09-06 — shipped the OG-image + ShareBar fix for the 54 hubs (card mtpi1k9k835vk8), after correcting my own filed risk estimate

Immediately after §E28's hub build, checked OG/share coverage and found `/colors-that-go-with/`
(756 URLs, 49.5% of the sitemap) was the only major page type using the shared `og-default.png`
with no ShareBar — every other type (`palettes`, `colors`, `collections`, `learn`) has both. Filed
card `mtpi1k9k835vk8` first, citing this project's own "~41 minutes" build doctrine as a reason to
check CI-minutes headroom before adding image generation, on a namespace that hit `ci_quota_exceeded`
for real on 2026-09-04.

**Then checked the actual GitLab job trace instead of trusting the doctrine note**, per this file's
own repeated lesson about the gap between local and CI build cost. Measured: `og/collections/*.png.ts`
rasterises at **~20ms/image** on CI, the whole 2,187-page `astro build` step took **~94 seconds**, and
the full pipeline (checkout→build→deploy→assert→indexnow) ran **149 seconds**. The namespace also now
carries `extra_shared_runners_minutes_limit: 1000` on top of the 400 free — the quota-exhaustion
incident the risk was based on has been resolved. Corrected the card in place rather than leaving the
inflated estimate standing, then built design 2 (54 hub-only images, per the card's own
crowding-avoidance reasoning from §E28) in the same leg.

**Shipped, `59b9750`:**
- `og/colors-that-go-with/[slug].png.ts` — 1200×630 SVG→PNG, one per `commonColors` entry passing
  the hub pages' own `MIN_PALETTES` guard. Mirrors `og/colors/[slug].png.ts`'s layout exactly;
  right column shows the 3 computed HSL partner swatches (this type's real content) instead of a
  palette count.
- `ShareBar.astro` generalised from palette-only (`{palette, url}`) to generic
  (`{title, url, tweetText, pinterestMedia}`). The one existing caller (`palettes/[slug].astro`)
  moved its provenance branching (Wada plate vs. editorial) to the call site — behaviourally
  identical, verified by control below.
- Hub page (`[color]/index.astro`) now passes `image={...}` to `BaseLayout` and renders `<ShareBar>`
  with a real `pinterestMedia` — never the shared default, matching the card's explicit requirement
  that a generic Pinterest image is worse than no button.

**Verify, live, via a fresh sitemap+API poll (not a guessed sleep — measured CI duration, then
polled the pipeline status directly):**
```
deploy                 pipeline 2823918613, 59b9750, success in ~110s
/og/colors-that-go-with/beige.png     200, image/png, 1200x630, 37,192 bytes
4 sampled hub images    37192 / 38124 / 45403 / 46129 bytes — genuinely distinct, not one template
hub og:image            now /og/colors-that-go-with/beige.png (was og-default.png)
hub ShareBar            renders (data-share-bar, share__btn present)
CONTROL: palette page   ShareBar still renders; Pinterest media URL unchanged
                        (/og/wada-292-.../png, same as before the refactor)
sitemap                 unchanged at 1,528 (OG routes correctly excluded, matching every
                        other page type's OG routes)
astro check             0 errors / 0 warnings (one HexColor type error caught and fixed
                        on the first pass)
```

Card `mtpi1k9k835vk8` updated with both the correction and the shipped result rather than left as a
pure decision record.

### E31 · 2026-09-06 — gap sweep after E30: found + fixed sitemap-ai.xml missing the 54 hubs entirely

Queue was empty after E30's `complete_task`. Per the standing "empty queue is not the end — refuel"
rule, ran a live health sweep on everything shipped tonight instead of stopping.

**Caught my own instrument mistake mid-sweep, in the ordinary sense this file keeps recording:**
`curl sitemap.xml | grep -c '<loc>'` returned 0 and briefly read as "sitemap emptied." Two compounding
causes, both already documented elsewhere in this codebase's own doctrine and both re-confirmed live
rather than assumed: (1) `robots.txt` declares `/sitemap-index.xml` → `/sitemap-0.xml`, not
`/sitemap.xml` (a 301 stub); (2) `sitemap-0.xml` is 132KB on ONE line, so `grep -c` counts matching
LINES (1) not occurrences. `grep -o '<loc>' | wc -l` gives the real number: **1,528, unchanged** —
confirms E30's sitemap claim was correct, now independently re-derived rather than just re-asserted.
Also re-verified the earlier count split cleanly: 1 index page + 54 hubs + 702 leaves = 757 under
`/colors-that-go-with/`, 0 `/og/` routes leaked into the sitemap (correctly excluded, matching every
other page type).

Spot-checked 5 live URLs (4× 200, 1× 404 — the 404 was my own guessed context slug
`emerald-green/beach-house/`, not a real one; confirmed against the sitemap's actual context list
before concluding it was my probe, not a defect — never construct a URL to test existence).
`search-index.json` re-verified live: 711 entries total, exactly 54 under `colors-that-go-with`,
matching E28's design. Money-path bare probe (`/go/b/4861522471`, no `-L`, no minted token, no forged
headers) → clean 302 to bare own-origin, the healthy rejection signature.

**The real gap:** `sitemap-ai.xml` — this site's own curated LLM-citation-priority sitemap
(`rules/bot-harvest.md` Lever 5) — carried 737 URLs and **0** under `colors-that-go-with`, because the
file predates E28's hub build and nobody had wired the new page type in since. Its own doc comment
already describes exactly this page type's shape ("deep aggregation... within a hue family" at
priority 0.8 for the 9 hue hubs) — the 54 new hubs are the same kind and were simply missing.

Fixed `src/pages/sitemap-ai.xml.ts` (commit `6455d55`): added the 54 hub URLs at priority 0.8,
hub-only (not the 702 leaves) — same reasoning applied twice already tonight (§E28 search-index
scoping, §E28 the hub build itself): a curated citation-priority list is weakened by near-duplicate
leaves. No `jsonAlt` — no JSON API twin exists for this page type (checked: no
`src/pages/api/**colors-that-go-with**`), matching several other entries in the same file that also
lack one.

**Verify, live:** `astro check` 0 errors/0 warnings before push. Pipeline `2823934672` (`6455d55`)
success in ~154s. `sitemap-ai.xml` now serves **791** URLs (737+54, exact match), all 54 present with
`<priority>0.8</priority><changefreq>monthly</changefreq>`, XML well-formed
(`xml.etree.ElementTree.parse` clean), pipeline's own post-deploy assertion also passed.

### E32 · 2026-09-06 — closing sweep: verified affiliate gate + nav + Bing-CTR guard on tonight's work; nothing further to fix right now

Continued the gap sweep after E31. Two more checks, both closed clean (no false findings shipped,
two near-misses caught before being reported):

- **Affiliate compliance on the new hub pages.** `grep amazon` on `/colors-that-go-with/beige/`
  returned 0 — nearly read as "monetization missing." It isn't: this site gates the tag behind
  `/go/b/<isbn>?c=colors-that-go-with` (the tag never lives in served HTML, per this codebase's own
  affiliate-link-gate pattern), confirmed present with `rel="sponsored nofollow noopener"`,
  `target="_blank"`, `data-event="amazon_click"`, and the FTC disclosure text — identical on hub and
  leaf. 100% compliant, matching every other page type.
- **Nav-link trailing slash.** `/colors-that-go-with` is in the sitewide primary nav ("Colors that go
  with…"), consistent with `/browse`, `/colors`, `/collections` — all trailing-slash-free, all 308 to
  the slashed form. Not a regression, not isolated to this page type; the site's existing convention.

**Checked the fleet metrics layer's own flags before considering any further work.** Confirmed via
`node scripts/bing-ctr.mjs colorcombinations.org`: the page-level Bing feed **fails the
click-selection guard here** (exit 2, CTR withheld) — exactly what this project's own flag already
warned ("do NOT act on per-page Bing CTR until the script prints clean; 21 meta rewrites already
shipped on a false premise"). No page-level Bing CTR lever is currently safe to act on for this site;
did not chase one. Field CWV is GOOD (desktop LCP 0.92s, INP 24ms, n=6770) — the 50 lab score flag
explicitly says not to fund a refactor on it. `/colors-that-go-with/*` carries no meaningful Bing
impressions yet (too new — IndexNow submitted tonight, per E31/§CI trace).

**No further genuine gap found this pass.** Session total tonight: §E27 (3 link-defect classes
fixed) · §E28 (54-hub build) · §E29 (verified, no action needed) · §E30 (OG images + ShareBar) ·
§E31 (sitemap-ai.xml fix) · §E32 (this closing sweep, clean). Board (`colorcombinations.org` project)
carries no further agent-eligible work as of this leg — remaining open items are all `assignee:human`
(Wikipedia outreach `mtpazjk33khznb`, Pinterest setup `mq0supbru74rv5`, both need operator
credentials/action) or `kind:reference` (the `/for-you` swipe-feed spec, deliberately bottom-ranked,
a real but large speculative build not a filed task ready to pull).

### E33 · 2026-09-06 — shipped the /colors/[slug] cross-link (4/10 reachable) + found a pre-existing 6-page route collision while verifying it

Continued the gap sweep after E31/E32. Found: none of the 10 `/colors/[slug]/` pages whose slug
also exists in `commonColors` (black, blue, brown, green, khaki, olive-green, orange, red, white,
yellow — the only real overlap between the 210-entry Wada archive and the 67-entry modern-paint
pairing dataset) linked to their matching `/colors-that-go-with/` hub. Shipped `69952c0`: a
conditional callout on `src/pages/colors/[slug].astro`, gated on the identical
`commonColors.find + palettesFor + MIN_PALETTES` check the hub pages themselves use, reusing the
page's existing scoped `.pillar-callout` markup/CSS verbatim.

**Live-verifying it caught a real, pre-existing defect unrelated to tonight's work.** 6 of the 10
target URLs (blue, brown, green, orange, red, yellow) showed the callout NOT rendering — confirmed
against a fresh cache-busted fetch (`cf-cache-status: DYNAMIC`, not a caching artifact) before
suspecting my own code. Traced it to Astro's OWN build-log warning, present verbatim in every deploy
trace including tonight's (`08:21:35 [WARN] [build] Could not render /colors/blue from route
/colors/[slug] as it conflicts with higher priority route /colors/[hue]`): those 6 slugs collide
with the 9-member `HUE_SLUGS` list (`src/pages/colors/[hue]/index.astro`, `/colors/hue/[hue]/`'s
sibling directory route also matches bare `/colors/[hue]/`), so the individual-colour detail page
for exactly those 6 names has been silently unreachable/shadowed by the hue-family aggregation page
— confirmed live: `curl /colors/blue/` returns the hue hub's "Blue Color Combinations." H1, not the
individual colour page; `/api/colors/blue.json` (a separate, unaffected route) still serves the
correct individual-colour data, so this is an HTML-surface routing bug, not a data bug.

**Did not fix the collision in this leg** — deciding which of the two templates should own
`/colors/blue/` (and what happens to the other's content/URL/backlinks) is a judgment call with
SEO implications, not a mechanical fix, and it predates tonight's work entirely (present in the
prior deploy's trace too). Filed as its own task rather than folded into this one, so it gets
deliberate attention rather than a rushed decision at the tail of an unrelated leg.

**Honest scope of what shipped:** the callout is live and correct on all 4 reachable slugs
(black, khaki, olive-green, white) — verified rendering + correct hub href on each, and verified
absent on 3 non-overlapping control colours (kurenai, akane, matsuba). It is present in source and
correctly gated for the other 6, but cannot render there until the routing collision is resolved —
not a defect in this leg's code, a pre-existing block on 6 of the 10 target pages.

### E34 · 2026-09-06 — fixed mtpju7edkbygfv: stopped advertising the 6 shadowed /colors/[slug] pages, hit + fixed a real Astro build gotcha along the way

Ranked and worked the routing-collision task filed in E33 myself rather than leaving it purely for
a human — the diligence its own "suggested next step 1" asked for (check `COLOR_STORIES` for unique
content on the 6 colliding slugs) answered the open question: that set is fixed at the 20 canonical
Japanese names in `colorStories.ts`; none of blue/brown/green/orange/red/yellow are in it. No unique
editorial content exists at the shadowed URL, so "which template should own it" resolves itself —
there's nothing to preserve, so the correct minimal fix is to stop CLAIMING an individual page
exists there, not relocate one.

**Shipped `31621cc` → broke CI → fixed with `87866fa`, all in this leg, live site never affected.**
First commit excluded the 6 slugs from `[slug].astro`'s `getStaticPaths()` and from
`sitemap-ai.xml.ts`'s per-colour loop, via a module-scope `const HUE_COLLISION_SLUGS`. `astro check`
passed clean (0 errors) — and then the real GitLab build failed:
`[ERROR] Failed to call getStaticPaths for src/pages/colors/[slug].astro — HUE_COLLISION_SLUGS is
not defined`, thrown from the compiled `_slug_.astro.mjs`. Real, reproducible Astro behaviour:
`getStaticPaths()` is extracted and run in an isolated context at build time, and a sibling
module-scope `const` is not guaranteed to survive that extraction — confirmed by hitting it, not
by reading docs first. **`astro check` cannot catch this class of bug — it verifies types, not this
build-time extraction behaviour** — worth remembering for every future `getStaticPaths` edit on this
codebase: a clean `astro check` is not sufficient, only a real GitLab build confirms it.

Checked the live site immediately per this project's own deploy-truth doctrine before touching
anything further: a failed pipeline never reaches the deploy step, so `29109fd` (the last successful
deploy) stayed live and unaffected throughout — this was a same-session catch-and-fix, never an
incident. Fixed by moving the `Set` inside `getStaticPaths()` itself, self-contained. Left
`sitemap-ai.xml.ts`'s identical `Set` untouched — it's declared inside a plain `GET` function (no
`getStaticPaths` extraction involved, a different execution model), and the first build never even
reached it (aborted earlier, at `colors/[slug].astro`, in build order) — confirmed clean on this
successful build rather than assumed safe.

**Verify, live, pipeline `87866fa` success:**
- Build trace: 0 collision warnings (was 1+ on every prior deploy).
- `/colors/blue/` still correctly serves the hue-family page — unaffected, as expected (this fix
  only stops the futile competing build, it doesn't change which template wins).
- `/api/colors/blue.json` still 200 — unaffected route, as expected.
- `sitemap-ai.xml` now serves exactly **785** URLs (791 − 6), all 6 excluded slugs confirmed absent
  from the `/colors/<slug>/` entries specifically (their sitemap `/colors/hue/<slug>/` counterparts,
  a different path, are untouched).
- E33's cross-link callout re-verified still correct on khaki (one of the 4 reachable colours) —
  this fix didn't regress the earlier ship.

**Documented, not fixed (same root cause, lower severity, deliberately out of scope for this leg):**
`/api/colors/blue.json`'s own `urls.canonical` field still points at `/colors/blue/` (pre-existing,
unaffected either way by this fix); `search-index.json.ts` and `colors/index.astro` still list these
6 (both resolve to the hue page, a valid destination, just not an individual-colour one);
`og/colors/[slug].png.ts` still generates a per-colour OG image for all 6 (harmless — no route
collision exists for image assets).

### E35 · 2026-09-06 — closing sweep: no other instance of the [dir]-vs-[file] route collision; full sitemap regression-clean

Checked whether the E34 bug class (a directory-style dynamic route colliding with a same-shape
dynamic file route) has any other live instance in this codebase before considering it closed.
Enumerated every `[param]` directory route (`find src/pages -type d -iname "[*]"`): exactly two
exist — `colors/[hue]` (the one just fixed) and `colors-that-go-with/[color]` (this session's own
E28 build, which has no sibling file-route at the same URL shape — no collision, already verified
clean across 4 successful deploys tonight). No other instance found; this bug class is fully closed
for the current codebase.

Final full-site regression check post-E34: main sitemap unchanged at **1,528** (auto-derived by
`@astrojs/sitemap` from actual built output, so it was never affected by the collision or its fix
either way — confirmed rather than assumed). 12-URL random sample across palettes/collections/tools/
colors-that-go-with all 200.

Session total tonight (E27-E35, 9 legs, project `colorcombinations.org`): 3 link-defect classes
fixed · 54-page pairing-hub surface built + indexed (sitemap, sitemap-ai, search) · per-hub OG images
+ generalised ShareBar · sitemap-ai.xml gap closed · 10-page cross-link shipped (4 reachable) ·
a pre-existing 6-page route-collision found, diagnosed, and fixed, including catching + fixing a
real Astro `getStaticPaths`-extraction regression in the same leg with zero live-site impact. Board
carries no further agent-eligible work — remaining open items are `assignee:human`
(Wikipedia outreach `mtpazjk33khznb`, Pinterest setup `mq0supbru74rv5`) or `kind:reference`
(`/for-you` swipe-feed spec, deliberately bottom-ranked).

### E36 · 2026-09-06 — checked the /for-you reference card before touching it; it says stop, so stopped

Board empty again after E35. Only non-human-gated item was the bottom-ranked `kind:reference`
`/for-you` swipe-feed card (`mqmhf8m6ubdiay`). Read its FULL body via `update_task` (not the
truncated `_big:1` summary) before considering it — and it already contains 4 independent prior
sessions' triage, all reaching the same conclusion: do not build (measured against a ~$7.32/mo
retention ceiling, `InLinks=9` domain-wide authority constraint, and — the sharpest one — that it's
invisible to this site's one actually-working channel (Copilot/AI citation, ~25K/30d, 45-75% share
on book queries), since a client-side swipe overlay adds 1 sitemap URL and zero new extractable
facts. The card's own closing note anticipates exactly this moment: *"if you are reading this card
and neither [condition] has happened, stop here rather than re-verifying the resume condition a
fifth time."* Stopped there — did not re-run the collision check, did not build. Would have been
the 5th session to independently re-derive an answer already settled 4 times.

### E37 · 2026-09-06 — swept page types not yet checked tonight; all clean, no defects found

Checked page types untouched by E27-E36: the two priority-1.0 citation data studies + their CSV
twins, the bulk `/data/colors.csv`, `/feed.xml`, `/methodology/`, `/about/`, `/shop/`, an embed
route, and 3 `/tools/*` pages. All 200 with correct content-types; CSVs have real row data (177 rows
on the color-analysis study, not empty/truncated); `feed.xml` parses as valid XML with 36 items.

No defects found on this pass — recorded as "this class of check is clean," not as "the site is
saturated" (a defect-check sweep only speaks to the classes it tested).

### E38 · 2026-09-06 — logged a pre-change Bing crawl-stats baseline; nothing actionable yet (reporting lag)

Board still empty. Checked `GetCrawlStats` (Bing WMT) as a genuinely new signal — none of tonight's
checks so far covered index-crawl PROGRESS, only my own code's live correctness. Parsed the response
properly (rows are NOT date-sorted, per `ai-citation-channel.md` — sorted by the embedded `/Date()/`
epoch before reading, not `rows[0]`).

Latest available row is **2026-09-04** — 2 days of reporting lag, so tonight's IndexNow submissions
(E30/E31, the 54 hub pages) aren't reflected yet; too early to see any effect, as already expected
from E31's own note. Recorded as a baseline for a later session to diff against:

```
2026-09-01  InIndex=1932  CrawledPages=378   InLinks=9
2026-09-02  InIndex=1934  CrawledPages=411   InLinks=9
2026-09-03  InIndex=1937  CrawledPages=420   InLinks=9
2026-09-04  InIndex=1940  CrawledPages=780   InLinks=9   <- latest available
```

`InLinks=9` domain-wide, unchanged across the whole window — confirms the external-authority
constraint the `/for-you` card's triage (E36) cited independently from Bing's own stats. `InIndex`
climbing steadily (+207 over 9 days) — healthy trend, nothing broken. No action taken; nothing to
act on until the lag clears.

### E39 · 2026-09-06 — found the *cause* behind E34: all 9 hue families are published twice, at two indexed URLs with identical titles

Swept a genuinely new angle after E38 (nothing else had checked whether the two hue URL shapes are
duplicates). They are — and this is the second-order cause of the E34 route collision: the
`colors/[hue]/` directory route exists at all because a **second, redundant hue-page implementation**
was built at some point, unaware of the first.

Both templates say so in their own header comments: `colors/[hue]/index.astro` (420 ln) — *"9 SEO
landing pages targeting 'red color palettes', 'blue color combinations'"*; `colors/hue/[hue].astro`
(467 ln) — *"hue-family landing pages (9 routes). Programmatic SEO hub for 'X color palettes' /
'[hue] color combinations' queries"*. Same feature, same target queries, **byte-identical
`<title>`**, both self-canonical, both in `sitemap-0.xml`. 18 indexed URLs where 9 belong.
Measured rendered overlap: **Jaccard 0.688** — genuinely different content (design-guidance vs
cultural-archive), same subject and title.

**The traffic veto blocked the fix, and inverted my read twice — recording both misses:**
1. Sampled `/colors/hue/blue/` alone, got `✅ OK` (0 entrances, 0 views, 0 GSC impressions), and
   nearly concluded the whole `/colors/hue/*` set was orphaned. Ran all 9: **7 of 9 are `🔴 BLOCK`
   with live traffic.** Only blue and purple are orphans. One sample was not the set.
2. Every *proxy* signal pointed the wrong way. `/colors/hue/{hue}/` is the richer template (more
   lines, ShareActions, collections cross-links, its own OG image) and the only one in
   `sitemap-ai.xml` — yet `/colors/{hue}/` carries ~10x the pageviews (`/colors/blue/`: 5 entrances,
   53 views, entry rank #111/1325). Rank by the measured outcome, never by template richness or
   sitemap presence.

Also worth noting: **neither variant appears anywhere in the Bing per-page feed** (139 rows against
`limit=5000`, so untruncated; positive control `/colors/daidai/` at 17 impr *does* appear) — 18 URLs
targeting "X color combinations" and not one surfaces. Consistent with the cannibalisation reading,
on a site whose measured constraint is `InLinks=9` domain-wide (§E38).

**Shipped nothing.** Both variants have live traffic, so noindex / de-sitemap / 301 / cross-canonical
are all vetoed. The only survivor is differentiating the titles — a 9-18 page rewrite on trafficked
pages, which needs its own deliberate pass with a SERP ownership check first (and explicitly *not*
justified by Bing CTR, which `bing-ctr.mjs` reports CLICK-SELECTED/unavailable here). Filed with the
full measurement as `mtpl97zgpdxt7e` rather than rushed at the tail of a long session — same call as
E33→E34, which worked well.

### E40 — the 9 hue families were published at two indexed URLs with the SAME `<title>`; gave the lower-traffic variant its own (2026-09-06)

**What was true.** Every one of the 9 hue families ships at two self-canonical, sitemapped
URLs — `/colors/{hue}/` (`colors/[hue]/index.astro`) and `/colors/hue/{hue}/`
(`colors/hue/[hue].astro`) — and both served a **byte-identical `<title>`**. Measured on the
live site before the change, 9 of 9 pairs matched exactly:

```
red      hue/: Red Color Combinations — The Dictionary of Color Combinations
         colors/: Red Color Combinations — The Dictionary of Color Combinations   IDENTICAL
… same for orange, yellow, brown, pink, green, blue, purple, neutral (9/9)
```

18 indexed URLs targeting 9 queries. Descriptions already differed, so **the `<title>` was
the only field actually colliding** — a much smaller fix than the card estimated.

**Why it is worth fixing here specifically.** The site's measured binding constraint is
external authority: Bing `GetCrawlStats` reports `InLinks = 9` domain-wide, flat across the
whole reporting window (§E38). Splitting nine queries across two self-canonical URLs dilutes
exactly the signal that is already scarce. Neither variant appears anywhere in the Bing
per-page feed (139 rows against `limit=5000`, so untruncated — positive control
`/colors/daidai/` at 17 impressions does appear), so neither is currently ranking.

**Removal was ruled out by measurement, not preference.** `check-safe-to-delete.mjs` BLOCKs
7 of the 9 `/colors/hue/*` pages on live entrances (`/colors/hue/neutral/` 5 ent,
`/colors/hue/pink/` 4 ent) **and** BLOCKs the `/colors/{hue}/` counterparts too
(`/colors/blue/` 5 ent / 53 views / entry rank #111 of 1,325). So: no noindex, no 301, no
cross-canonical — canonicalising a page that receives entrances deindexes a working page.
Differentiating the titles is the only intervention that survives the veto.

**Ownership check run first** (`affiliate-team-standard.md` § THE OWNERSHIP LAW), before
writing a single title. `WebSearch("blue color combinations")` returns venngage, canva,
**palettehunt.com**, pinterest ×3, farrow-ball (its own paint range only), and Wikipedia on
**"Baby blue"** — an *adjacent* entity, which that rule reads as absence, not ownership. No
standards body, no on-topic Wikipedia, **one** dedicated archetype peer rather than 3+.
Verdict: **NOT OWNED — winnable wedge**, so retitling is worth doing rather than a page to
judge on conversion instead.

**The fix.** `metaTitle` added to `HueMeta` in `colors/hue/[hue].astro`; it feeds the
`<title>` **only**. The nine new titles describe what that template actually contains, which
its own copy already says — every lede there is Japanese-tradition specific (sora / asagi /
hanada / kon; murasaki / kikyo / fuji; gofun / kinari / nezumi) and its keyword array already
carried `Japanese {hue} colors`:

```
Japanese Red — Traditional Color Names & Palettes      (… ×9)
```

Checked against the neighbours so this does not create a NEW duplicate:
`/learn/japanese-reds/` = "The Four Reds: Kurenai, Akane, Shu, Entan";
`/learn/japanese-color-glossary/` = "Japanese Color Glossary: 20 Traditional Named Colors";
`/colors-that-go-with/{hue}/` = "Colors That Go With X — Pairing Guide" (already distinct).

**Deliberately minimal.** The visible H1, the OG share card and the meta description are
untouched — no user-visible content change on 9 pages that carry live traffic. One string
field, fully reversible.

**NOT justified by Bing CTR.** `bing-ctr.mjs` prints `CLICK-SELECTED — CTR UNAVAILABLE` for
this site, so per-page Bing CTR must not be used here (21 meta rewrites already shipped
fleet-wide on that false premise). The basis is the identical `<title>` string, readable
straight from the served HTML.

**Honest residual.** The two pages still carry ~0.69 Jaccard content overlap; only the title
signal is separated. If Google or Bing later collapses them anyway, the next move is a
content split (make `/colors/hue/*` genuinely the Japanese-tradition view and `/colors/{hue}/`
the modern-palette view) — a bigger job, and one that needs the traffic veto re-run at the
time.

**Same-leg correction — I fixed one signal and breached another.** Live-verifying the first
deploy (`7cf2224`) showed the differentiation worked, and that 3 of the 9 new titles rendered
**95 / 95 / 97 characters** (yellow, purple, neutral) — at or over the ~95 bound Bing flags as
rule 50 "Title too long" (`bing-recommendations-autopilot.md`; already hitting 23 fleet sites
/ 134 pages). Cause: the layout appends `" — The Dictionary of Color Combinations"` (39 chars),
so `metaTitle` has a **56-char budget** and `"… Traditional Color Names & Palettes"` is 53–58.
Dropping the redundant "Color" — the word still appears twice in the full rendered string —
brings all nine to **82–87 characters** (max 87, neutral). Shipped as `2782910`; the budget is
now a comment on the `HueMeta.metaTitle` field, including what the first form measured, so the
next edit does not re-breach it.

**Verified live after `2782910`** (pipeline `success`, served HTML):

```
9/9 pairs differentiated · max title 87 chars (bound 95) · 0 breaches
h1 on /colors/hue/{hue}/ unchanged: "Red Color Combinations" … (9/9)
/colors/blue/ title unchanged: "Blue Color Combinations — The Dictionary of Color Combinations"
money path unaffected: /go/b/4861522471?c=book → 302 → https://colorcombinations.org/
```

**Measurement note:** `${#T}` in bash counts BYTES, and the em-dashes are 3 bytes each — the
shell reports 86–91 where the character count is 82–87. Both are under the bound; the
character count is the one the rule means.

### E41 — swept every sitemap URL for dead links; exactly one, and it was the palettes index (2026-09-06)

**Why this sweep.** Crawl budget is the scarce resource on this site: Bing `GetCrawlStats`
reports `InLinks = 9` domain-wide, flat across the reporting window (§E38). A dead URL in a
sitemap spends that budget on nothing.

**Method + control.** Pulled `sitemap-index.xml` → `sitemap-0.xml` (1,528 locs) and
`sitemap-ai.xml` (785 locs), deduped to 1,529 unique, appended a
`this-page-cannot-exist-control-9z/` probe, and checked all 1,530 at concurrency 12.

```
1528  200
   2  404   <- one is the control (fired correctly), one is real
```

The detector is proven in both directions: the control returned 404, and 1,528 real URLs
returned 200. The one genuine dead URL: **`https://colorcombinations.org/palettes/`**.

**What it was.** `sitemap-ai.xml.ts` line 186 pushes `/palettes/` at priority 0.7 as "the
palettes index" — but `src/pages/palettes/` contains only `[slug].astro`. The index page was
never built. The real one has always been **`/browse/`** ("Browse all palettes", 200, links
all 378 children, already in *both* sitemaps).

**Build the missing page? No — deliberately rejected.** A real `/palettes/` index would be a
SECOND hub over the same 378 pages, which is precisely the duplicate-landing-page defect
fixed one leg earlier (§E40: two indexed URLs per hue with identical titles). Adding one on
purpose would be shipping the bug just removed.

**Traffic veto, and an honest note about its verdict.** `check-safe-to-delete.mjs` returns
**BLOCK** — 5 pageviews/30d, 0 entrances, entry rank #1105/1325. Its label reads "deleting or
noindexing would cut a working page", and a direct HTTP check refutes that premise: the URL
is a **404**, so those 5 views are 5 wasted visits, not a working page. The measurement is
right; the inference the label draws does not apply to a URL with no page behind it.

**So the fix removes nothing — it makes the URL work.** `public/_redirects` gains an
**exact-match** `301 → /browse/` (never `/palettes/*`; the 378 children are healthy and must
not be caught). Nothing is deleted, noindexed or de-sitemapped, so the class of harm the veto
guards cannot occur; the 5 visits gain the real hub instead of a dead end.

**Mechanism positive-controlled before writing a line.** `_redirects` is live here — the site
has `functions/` but no `out/_worker.js`, so Pages advanced mode does not disable it — and the
existing `/color-of-the-year-2026`, `/coty-2026` and `/sitemap.xml` rules all fire 301 today.
This follows their own documented precedent: *catch a guessed/stray path rather than leave a
searcher at a dead end.*

**Verified live after `d6f2e4f`** (pipeline `success`, served responses):

```
/palettes/  301 → https://colorcombinations.org/browse/     /browse/ 200
/palettes   301 → https://colorcombinations.org/browse/
children untouched: kurenai-kon · akane-tokiwa · ao-shiro · asagi-shu  → 200 (4/4)
no regression: hue titles still differentiated · /go/b/… → 302 → own-origin
```

**A false finding I caught before reporting it.** Mid-sweep I measured "378 `/palettes/*`
pages are absent from the site's own search index" — 711 entries, 0 matches. Wrong: I keyed
on `url`/`slug`, and the row shape is `{s,t,k,x}`. Re-measured on the real shape: **378
Palette rows present**, exactly as `search-index.json.ts` builds them. Textbook
`positive-control-before-absence` § *a row shape you guessed returns zero for everything* —
the zero was my accessor, not the data. A second instrument failure the same hour: zsh globbed
an unquoted `--include=*.astro`, so a `grep` reported `0` internal links while actually
erroring out; quoting it and adding a must-be-non-zero control returned 13.

**Residual, left alone on purpose.** `/palettes/` now 301s instead of 404ing, but it is still
listed in `sitemap-ai.xml` — a sitemap ideally lists final URLs, and this one redirects to
`/browse/`, which is already in the same file. Removing that entry is a *de-sitemap*, which
the veto BLOCKed, so it is filed as its own card with the evidence rather than actioned here.

### E42 — full internal-link graph: the site has essentially NO orphans, and `/collections/` is the starved-but-efficient type (2026-09-06)

**What was measured.** Fetched **all 1,529** sitemap URLs (0 empty, 0 failures), extracted every
`href`, normalised to absolute + trailing-slash, and built the complete inbound-link graph.

**Controls first** (an orphan claim is an absence claim):

```
home outbound degree ......... 67     (must be > 0)   ✅
inbound to /browse/ .......... 1527   (known hub)     ✅
inbound to /colors/blue/ ..... 23                     ✅
pages with 0 outbound links .. 1      (should be ~0)  ✅  — and it is /palettes/, the redirect from E41
```

**Result: 1 orphan out of 1,529** — and it is `/palettes/`, the URL fixed one leg earlier in
§E41. Every other page in the sitemap has ≥1 inbound internal link. The orphan hypothesis is
**refuted**, which matches §E11's earlier "essentially no orphans here" and is worth recording so
nobody spends another leg hunting them.

**The real finding is the DISTRIBUTION, not the orphans.**

| page type | pages | median inbound | min | pageviews/30d | pv per page |
|---|---:|---:|---:|---:|---:|
| `/palettes/` | 379 | 20 | 0 | 3,279 | 8.7 |
| `/colors-that-go-with/` | 757 | 14 | 14 | 1,059 | 1.4 ⚠️ newly built — see correction below |
| `/colors/` | 223 | 8 | 4 | 2,772 | 12.4 |
| **`/collections/`** | **70** | **2** | **1** | **1,630** | **23.3** |

`/collections/` is the **5th-largest page type by traffic** (1,630 pv / 1,390 sessions) at
**23.3 pv/page**, while receiving roughly **one-seventh** the internal link equity of the types
around it.

⚠️ **CORRECTED same session:** this originally read "16× `/colors-that-go-with/`", which is an
unfair comparison and I should not have made it. `/colors-that-go-with/` is a **newly built** page
type — §E32 recorded that it "carries no meaningful Bing impressions yet (too new — IndexNow
submitted tonight)". Its 1.4 pv/page measures how long it has been indexed, not how well it
performs; comparing a mature type against a brand-new one is the window error from
`measured-vs-expected` in a different costume. The honest contrast is against the **mature** types:
`/palettes/` 8.7 pv/page at median 20 inbound and `/colors/` 12.4 pv/page at median 8 inbound —
against which `/collections/` still stands out at 23.3 pv/page on median 2. The finding survives;
the multiplier does not. 43 of the 70 sit at ≤3 inbound; 25 at
exactly 1 (their own index). Traffic is real and spread, not one page: `/collections/japanese/`
239 pv, `/websites/` 74, `/autumn/` 55, `/branding/` 51, `/minimalist/` 47, and 71 collection
URLs have traffic at all.

That is the clearest internal-linking asymmetry on the site, and internal plumbing is the only
lever available without operator time (§E3: **9** external inbound links, site-wide).

**🔴 DELIBERATELY NOT SHIPPED — it would confound a running experiment.** §E5 shipped the
link-concentration test *this same day* (`a04220e`): 51 collections now link out to
`/trends/color-trends-2026/`, with a recorded baseline (`6,777 impr, pos 4.9`) to be re-read on
**2026-10-06**. Adding inbound links *to* collections raises collections' own equity, which
changes how much they pass onward to `/trends/` — so it would inflate that test's effect size and
make the read unattributable. §E5 states the stakes plainly: *"if 51 pages move nothing, internal
linking is dead as a lever on this site."* Contaminating the one experiment that answers that
question costs more than the fix gains.

Verified the gate can actually fire rather than assuming it: task `mtpbh3t3zij2cx`,
`status: scheduled`, `scheduledFor` = 2026-10-06. Armed.

Filed as a scheduled card for after the gate reads out. **Do not ship before 2026-10-06.**

**Method note for whoever repeats this.** `xargs -P … -I{} sh -c '<long string>'` dies with
`command line cannot be assembled, too long` on a 1,529-URL list and fetched **2** of them while
exiting 0 — a silent near-total failure that reads like success. Put the body in a script file and
use `xargs -P 14 -n 1 ./fetch.sh`, then assert `mapped == input lines` before trusting anything
downstream.

### E43 — the site's own search could not find its highest-impression page (2026-09-06)

**The gap.** `search-index.json` carried **711 rows of exactly four kinds** — Palette 378, Color
210, Collection 69, Pairing guide 54. Every `/learn/`, `/tools/`, `/paintings/`, `/trends/` and
`/glossary/` page was unreachable from the site's own search, including
**`/trends/color-trends-2026/` — the single highest-impression page this site has in Bing**
(6,777 impr, pos 4.9). The 703 `/colors-that-go-with/` leaves are excluded *by a documented
decision*; these ~100 pages were not — no exclusion reasoning exists for them anywhere in the
source.

**Measured, using the site's own matcher.** GA4 30d: **342 `Search` / 186 `SearchNoResults`** —
54% of searches return nothing. Lifted `srch` / `loose` / `hexOf` verbatim out of
`BaseLayout.astro` and ran them against the live index and all 164 distinct failing terms:

```
"year"             x2  -> 0 results     the 2026 trends page exists AND ranks
"contrast checker"     -> 0 results     the tool exists
"monet"                -> 0 results     12 Monet-adjacent painting pages exist
"Triadic"              -> 0 results     defined in /glossary/
```

**🔴 The crowding constraint is the design, and it is measured — not caution.** Ranking scores a
title-prefix hit `100` and tie-breaks on **shortest title**, so a 7-character `"Contact"` beats
`"Coral Red"` for the query `"co"`. Simulated against the **226 real successful search terms** of
the last 30 days:

| candidate set | gained | **regressed** |
|---|---:|---:|
| all 115 unindexed pages | 13 events | **11 events** — `co`/`con`→`/contact/`, `pr`→`/privacy/`, `Ter`→`/terms/`, `bu n`→`/shop/` |
| content-only (index/legal dropped) | 12 events | 3 events |
| **final shipped set (58 rows)** | **7 events** | **2 events** |

Both remaining displacements are garbled mid-typing states (`pr i nt`, `un`), not real queries.
Section indexes and boilerplate are therefore excluded deliberately, and the reason is recorded
inline in the source so nobody "completes" the set later.

**Built data-driven** from `PILLAR_LINKS`, `PAIRS` + `FORMATS` and `allPaintings()` so it does not
rot as pages are added; only the ~12 standalone editorial/tool pages are listed explicitly.

**Verified live after `4fd9944`** (pipeline `success`, served `/search-index.json`):

```
711 -> 769 rows (+58)   Guide 9 · Tool 22 · Painting 25 · Trend 2
controls: 'zzzqqq' 0 · 'kurenai' -> /colors/kurenai/ UNCHANGED · 'beige' -> /colors-that-go-with/beige/ UNCHANGED
recovered: year -> /trends/color-trends-2026/ · contrast checker -> /tools/contrast-checker/
           monet -> /paintings/water-lilies/ · Triadic -> /glossary/ · gradient -> /tools/gradient-generator/
net on real 30d traffic: +7 events recovered / -2 displaced
```

**The simulation predicted reality exactly** — +58 rows predicted / +58 actual, +7/−2 predicted /
+7/−2 actual. Recording that because it is the justification for simulating against real query
logs before shipping a ranking change, rather than shipping and watching.

**Does not touch the running §E5 test.** This adds JSON rows to a client-fetched index, not
`<a href>` links, so no internal link equity moves and the 2026-10-06 read on
`/trends/color-trends-2026/` stays clean. It also leaves that page's `<title>` alone (mid a
separate Bing experiment, `a0d4510`).

**A false zero caught by a control.** The first pull used `ev=search_no_results` and returned 0
rows — the event is **`SearchNoResults`** (CamelCase). Enumerating `dims=eventName` is what found
it, and the endpoint's own `warning: zero_rows — this is NOT proof the site is untagged` is what
prompted the enumeration. Guessing the event name would have produced "this site has no failing
searches", the exact opposite of the truth.

**Still zero after this ship, and honestly so:** `Pale Purplish Vinaceous` (4) — genuine dataset
absence, already documented; `fennel` (3); `Коричневый` (2, Russian "brown" — no i18n on this
site); bare `#` (3). None is fixable by indexing.

### E44 — REFUTED: "87.5% of amazon_click events are unattributed" (my own, ~10 minutes old) (2026-09-06)

Chased it because the fleet feed's `amazon_clicks_by_position_30d` reads
`{book:144, tool:25, reviewprobe:1}` = **170 against `amazon_clicks_30d: 366`**, which looks
exactly like half the clicks losing their attribution. GA4 appeared to confirm it:

```
customEvent:shelf   203 '(not set)'   20 'book'    9 'tool'     (232 events, 30d)
customEvent:dest    203 '(not set)'   29 'amazon'
```

**The control is what killed it.** `dest` is `(not set)` on the *same* 203 — so it was never
"`shelf` is unset on some links", it was "these events carry no custom params **at all**", which
points at a second emitter rather than a missing attribute. Splitting by date settled it:

```
date        (not set)   book   tool
2026-08-07 .. 09-03        ALL      0      0
2026-09-04                   0      7      6
2026-09-05                   0     13      3
```

A clean cutover on **2026-09-04**, no mixing on either side. That is GA4 custom dimensions
behaving exactly as documented: **registration is FORWARD-ONLY and never backfills**, so every
event collected before the dimension existed reads `(not set)` forever. Nothing is broken; the
`(not set)` block ages out of the 30-day window on **2026-10-04**.

**Two things I nearly filed and should not have.**

1. **`cta_position` "missing".** `/ga4-dimensions` reports it absent on this property — but that
   endpoint audits a *fixed fleet-standard* request list (`cta_position, asin, dest, page`). This
   site emits `{page, asin, dest, shelf}` from `public/amazon-track.js`, and all four are
   registered. `cta_position` is not emitted anywhere in `src/` or `public/`, so registering it
   would create a permanently empty dimension. **Read the emitter before acting on that audit.**
2. **The second-emitter hypothesis.** `BaseLayout.astro` does carry a generic `[data-event]`
   delegated handler, and it already excludes `amazon_click` explicitly ("already dual-sunk by
   /amazon-track.js — don't double-count"). Reading it, rather than inferring from the shape of
   the numbers, is what ruled it out.

**The one thing worth carrying forward:** until 2026-10-04, both the GA4 shelf split and the
fleet's `amazon_clicks_by_position_30d` describe a partial window and will read as a large
unattributed majority. That is the same class the feed already flags for `ga4_key_events_30d`
("NOT a 30d figure — it covers 2 of 30 days"). Do not re-derive "attribution is broken" from it,
and do not rank surfaces on it before that date — the honest read of 2026-09-04..05 is
**book 20 / tool 9**, on n=29.

### E45 — closing sweep: a dead duplicate GA4 property, and the enumerated levers that remain (2026-09-06)

**🔴 There are TWO GA4 properties named "ColorCombinations.org", and one is dead.**

```
292973229   measurement_id: None   0 sessions · 0 pageviews / 30d   0 registered dimensions
294106772   measurement_id: G-QT7PC59PV6   6,821 sessions · 15,963 pv / 30d   10 dimensions
live site ships: G-QT7PC59PV6   (grepped from the served homepage)
```

`/ga4-dimensions?prop=colorcombinations.org` refuses with `ambiguous: colorcombinations.org
matches 2`. That refusal is the safe behaviour — **the hazard is any tool that resolves by domain
and silently takes the first match**, which would report zeros for the fleet's #2 earner and read
exactly like "this site is untagged". `/ga4-probe` handles it correctly
(`resolved_by: exact_host+tenant_filtered`) and every measurement in §E42–E44 was verified to have
landed on 294106772 before being used.

**Prefer `prop=294106772` over `prop=colorcombinations.org` on this site.** Deleting the empty
property is a Google-account action, so it is not brain-doable; recording it is what prevents the
false finding.

**Two more instrument traps hit and recorded this session**, both of which returned a confident
wrong answer rather than an error:

1. `xargs -P … -I{} sh -c '<long string>'` on 1,529 URLs dies with `command line cannot be
   assembled, too long`, fetches **2**, and **exits 0**. Put the body in a script file
   (`xargs -P 14 -n 1 ./fetch.sh`) and assert `mapped == input lines`.
2. Five guessed GA4 dimension names (`cta_position`, `position`, `from`, `data_from`, `source`)
   all returned `rows=None`. The site emits `{page, asin, dest, shelf}`. Enumerate
   `dims=eventName` / read the emitter; never guess the param name (§E44).

#### Levers enumerated, not just defects counted

Per `positive-control-before-absence` § *N negative defect-checks do not license a "saturated"
claim*: the checks below are **defect** checks, and passing them proves nothing about levers. So
the levers are enumerated separately, by name, with why each is not runnable from this lane.

| lever | state |
|---|---|
| IndexNow on deploy | ✅ **verified firing**, not assumed — CI job trace `16330909070`: changed-only (2 URLs), Bing + Yandex + api.indexnow.org all HTTP 200, manifest updated |
| AI-crawler access | ✅ 9 crawlers explicitly allowlisted, **0** CF-Managed injection, GPTBot/ClaudeBot/PerplexityBot/bingbot all 200; `/go/` + `/og/` correctly disallowed |
| On-site search | ✅ fixed this session (§E43) |
| Sitemap integrity | ✅ fixed this session (§E41) |
| Internal link graph | ✅ measured (§E42); the actionable half is **time-gated** to 2026-10-07 |
| Schema / OG / ShareBar | ✅ shipped §E30 |
| Bing SEO recommendations | ⛔ **never run on this site** — dashboard-session only, needs a Chrome-MCP lane (§E4) |
| AI citation share | ⛔ needs a Chrome-MCP lane (`mtp835nfohbpez`, scheduled 2026-10-06) |
| Wikipedia link parity | 👤 operator (`mtpazjk33khznb`) — the site has **9** external inbound links |
| Press pitch (Wada study) | 👤 operator (`mrt6tb0g2cgm8e`) |
| Pinterest distribution | 👤 operator (`mq0supbru74rv5`) |
| Link-concentration read | ⏳ 2026-10-06 (`mtpbh3t3zij2cx`) |
| `/collections/` de-thin | ⏳ 2026-10-07 (`mtpmjbvtaw120w`), gated behind the read above |

**Every remaining lever is operator-gated, tool-gated, or time-gated.** That is the honest state —
not "nothing left to do", and not a claim earned by counting clean defect checks. The single
highest-value item on the list is unchanged and unchangeable from here: **9 external inbound
links** is the binding constraint, and closing it needs the operator.

### E46 — 1,364 pages ship `FAQPage` schema whose Q&A is NOT on the page (2026-09-06)

Found in a structured-data integrity pass over all 1,529 crawled pages. Filed, **not fixed** — it
is a 1,364-page policy judgement on the #2 earner, and this codebase's own repeated lesson is that
a bulk change of that shape needs its own deliberate pass.

**Structured data is otherwise in excellent health:** 1,528 of 1,529 pages carry JSON-LD,
**0 malformed**, and the only page without any is `/palettes/` — correctly, since §E41 made it a
301. `@type` histogram is sane (WebSite 1529, Organization 1528, BreadcrumbList 1513, WebPage 1357,
ItemList 708, Person 72, Dataset 2…).

**The finding.** Every `FAQPage` block on the site has exactly ONE block per page with 3–6 Q&A
pairs — the count discipline `seo-geo-mastery` Part 14.1 asks for is followed exactly, and
**0 pages** have multiple blocks (the `faqpage_schema_spam_multiple_blocks × -1000` hard-reject
does not fire). What fails is *visibility*:

| page type | FAQ rendered | **FAQ schema-only** |
|---|---:|---:|
| `/colors-that-go-with/` hubs (`[color]/index.astro`) | **54** | 0 |
| `/colors-that-go-with/` leaves (`[color]/[context].astro`) | 0 | **702** |
| `/palettes/[slug]` | 0 | **378** |
| `/colors/[slug]` | 0 | **204** |
| `/collections/[slug]` | 0 | **69** |
| `/tools/`, `/compare/`, `/trends/` | 17 | 7 |
| **TOTAL** | **71** | **1,364** |

**The detector is controlled in both directions** — 71 pages (the newer hub/tool/compare templates)
render every schema question verbatim in rendered text, so it is not flagging everything. Verified
by hand on `/collections/boho/`: the string `What is in the "Boho Color Palettes" collection?`
occurs **only inside the `<script type="application/ld+json">` block** (escaped as `\"`, immediately
followed by `,"acceptedAnswer"`), and the page's rendered headings are the collection title, share,
six palette names and "Off the screen". The one `<details>/<summary>` on the page is the data
disclosure, not an FAQ.

**It was introduced deliberately.** Both emitters carry the comment
`// FAQPage + Speakable per rules/seo-geo-mastery.md Part 14.` — so this is a rule being followed,
not an oversight. **The rule specifies the count discipline and omits Google's visibility
requirement**, which is a gap that affects every fleet site using Part 14, not just this one.

**External check, because the severity depends on current policy** (searched 2026-09-06): Google's
general structured-data guidelines still require markup to match visible page content — *"every
question and answer in the JSON-LD must appear in visible HTML"* — while FAQ **rich results were
deprecated on 2026-05-07** and no longer render in Search at all.

So the honest severity is **moderate, not catastrophic**: there is no rich result left to lose and
no obvious manual-action trigger, but it breaches the general guideline and this fleet's own I-43
Schema Honesty dimension. And it cuts the other way too — with rich results gone, the schema's only
remaining purpose is AI extraction, and **AI extractors read rendered content anyway**, so a
schema-only FAQ is of dubious value even for the reason it was added.

Filed as `mtpngwzp68woij` with three options (render / drop / leave). Not actioned here.

### E47 — SHIPPED: rendered the FAQ on `/colors/[slug]` — 204 pages had answers nobody could see (2026-09-06)

The first template fixed out of §E46's 1,364. **One template, deliberately** — E5's precedent in
this repo is a test on one template, not a bulk change.

**Why render rather than delete the schema — and a correction to my own first read.** I initially
assumed these FAQs were template boilerplate, because the *question* on `/collections/boho/` reads
like it (`What is in the "Boho Color Palettes" collection?`). I had not read the **answers**. They
are substantive and computed per page:

```
What does Kurenai look like on white and black backgrounds?
  → "Kurenai (#9A2A2A) has a WCAG contrast ratio of 7.67:1 against white and 2.74:1
     against black. WCAG AA requires 4.5:1 for normal text and 3:1 for large text."
```

That is real, per-page, computed content that 204 pages were hiding. Judging a block by its
question text and not its answer text is the same shape as judging a page by its slug.

**Policy checked, not assumed** (2026-09-06): Google's general structured-data guidelines still
require markup to match visible content — *"every question and answer in the JSON-LD must appear in
visible HTML"* — while FAQ rich results were **deprecated 2026-05-07**. So there is no rich result
to lose, the schema's only remaining purpose is AI extraction, and AI extractors read *rendered*
content. Invisible answers helped nobody in either direction.

**Shape.** Extracted the four Q&As into a single `colorFaq` array feeding **both** the FAQPage
schema and a new visible `<section>`, so the two cannot drift apart. Pattern copied from
`colors-that-go-with/[color]/index.astro` — the one template that already did this correctly
("visible text matches schema"). Scoped CSS matching *this* page's conventions, not the Tailwind
utilities that template uses.

**Chose `/colors/[slug]` on purpose:** mature, genuinely distinct per-page content, and **not part
of the running link-concentration test**. Explicitly did **not** touch `/collections/` before the
2026-10-06 read (`mtpbh3t3zij2cx`), nor the 702 `/colors-that-go-with/[context]` leaves, where
rendering near-identical FAQ blocks would risk thin content.

**Verified live after `82922e1`** (pipeline `success`), controls in both directions:

```
/colors/kurenai/   schema 4 · rendered 4 · heading present     ✅
/colors/ai/        schema 4 · rendered 4                       ✅
/colors/gofun/     schema 4 · rendered 4                       ✅
CONTROL  /collections/boho/            schema 4 · rendered 0   ✅ unchanged — the checker discriminates
CONTROL  /colors-that-go-with/beige/   schema 3 · rendered 3   ✅ reference template unaffected
```

Remaining from §E46: **1,160 pages** across `/palettes/` (378), `/colors-that-go-with/[context]`
(702), `/collections/` (69) and a handful of standalone pages. Carried on `mtpngwzp68woij`.

### §E48 — render the FAQ that was schema-only on 378 `/palettes/` pages (2026-09-06)

Second template of the §E46 defect (1,364 of 1,529 crawled pages ship FAQPage
JSON-LD whose Q&A renders nowhere). Same fix as §E47, chosen next because
`/palettes/` is the largest block outside the running §E5 link-concentration
test.

**Shipped** `ae36a96` — `src/pages/palettes/[slug].astro`:
- extracted the 4 inline Q&As into `const paletteFaq` (single source, doc-commented)
- `mainEntity` now maps that array — schema and visible text cannot drift
- visible `<dl class="palette-faq__list">` before the `related` section, scoped
  CSS (this template is scoped-CSS, not Tailwind — the `colors-that-go-with`
  precedent uses Tailwind and could not be copied verbatim)

Rendered rather than deleted because the answers are computed per palette:
actual colours with hex, era, provenance (Wada 1933 vs original editorial),
and the licence position. `isWada` branching preserved verbatim.

**Verified live** (4 slugs pulled from the live sitemap, not guessed — a guessed
slug 404s and reads as a failure):

```
/palettes/kurenai-kon/                              http=200 schema=4 rendered=4 heading=1 junk=0
/palettes/wada-176-hermosa-pink-seashell-pink/      http=200 schema=4 rendered=4 heading=1 junk=0
/palettes/wada-064-aconite-violet-dark-soft-violet/ http=200 schema=4 rendered=4 heading=1 junk=0
/palettes/fuji-ai/                                  http=200 schema=4 rendered=4 heading=1 junk=0
control A /colors/kurenai/    (fixed §E47)          http=200 schema=4 rendered=4 heading=1 junk=0
control B /collections/boho/  (untouched)           http=200 schema=4 rendered=0 heading=0 junk=0
```

Control B is the one that matters: the detector still reads 0 on an untouched
template, so the four 4/4 readings are a measurement and not a constant-true.
`astro check` 0 errors / 0 warnings. `junk=0` = no `undefined`/`NaN`/`[object`/
`>null<` in the rendered answers.

**Running total:** 582 of 1,364 schema-only pages fixed (204 `/colors/` + 378
`/palettes/`). Remaining: 702 `/colors-that-go-with/[color]/[context]`, 69
`/collections/` (**deferred until after 2026-10-06** — that template is inside
the §E5 test and a content change would confound it), ~11 standalone pages.

### §E49 — 705 more schema-only FAQs rendered, and a CORRECTION to the §E46 count (2026-09-06)

Third pass on the §E46 defect, plus a measured correction to my own earlier
audit.

**Shipped `2cac3c5`** (704 pages) + the `/learn/` straggler:
- `colors-that-go-with/[color]/[context]` — **702 pages**. `faq` was already a
  frontmatter const feeding `mainEntity`; only the visible block was missing.
  Tailwind classes here, matching the sibling `index.astro` that has rendered
  its FAQ all along — the leaf was the one template that never did.
- `color-psychology` (1) · `tools/color-blindness-simulator` (1) ·
  `learn/why-painting-colours-shift` (1) — inline Q&As extracted into
  `cpsyFaq` / `cvdFaq` / `shiftFaq` so schema and visible text share one source.

**Verified live** (4 leaves drawn at random from the live sitemap):

```
/colors-that-go-with/mint/clothes/            http=200 schema=3 rendered=3 junk=0
/colors-that-go-with/emerald-green/front-door/ http=200 schema=3 rendered=3 junk=0
/colors-that-go-with/cloud-dancer/cabinets/   http=200 schema=3 rendered=3 junk=0
/colors-that-go-with/yellow/living-room/      http=200 schema=3 rendered=3 junk=0
/color-psychology/                            http=200 schema=4 rendered=4 junk=0
/tools/color-blindness-simulator/             http=200 schema=2 rendered=2 junk=0
control /collections/boho/  (untouched)       http=200 schema=4 rendered=0 junk=0
control /colors/kurenai/    (§E47)            http=200 schema=4 rendered=4 junk=0
```

#### 🔴 CORRECTION — the "~11 standalone pages" tail in §E46 was OVERCOUNTED

My audit checker did an exact substring match of each schema question against
the stripped page text. **It does not decode HTML entities.** Rendered HTML
carries `What&#39;s the difference…` while the JSON-LD carries `What's the
difference…`, so every question containing an apostrophe read as MISSING on a
page that renders it perfectly.

Caught because the failures were suspiciously patterned — *every* MISS
contained an apostrophe and *every* OK on the same page did not. Confirmed by
reading the raw bytes at both sites:

```
JSON-LD : "name":"What\'s the single best gift for someone who loves color theory?"
rendered: <summary …>What&#39;s the single best gift for someone who loves color theory?</summary>
```

Re-run with `html.unescape` + NFKC + curly-quote folding, controlled in both
directions (`/colors-that-go-with/beige/` must read OK, `/collections/boho/`
must read SCHEMA-ONLY — both did):

| page | before (buggy) | after (correct) |
|---|---|---|
| `/gift-guide/` | 2 of 4 | **4 of 4 — fine all along** |
| `/material-design/` | 5 of 6 | **6 of 6** |
| `/accessibility/color-blind-tools/` | 5 of 6 | **6 of 6** |
| `/trends/color-trends-2027/` | 4 of 5 | **5 of 5** |
| `/learn/why-painting-colours-shift/` | 0 of 2 | 0 of 2 — genuinely broken |

So **9 of the ~11 standalone pages were never defective**; only 3 were
(`color-psychology`, `color-blindness-simulator`, `why-painting-colours-shift`),
and all 3 are now fixed. The large template blocks (`/colors/`, `/palettes/`,
`[context]`, `/collections/`) are unaffected by this correction — those were
confirmed by *reading the templates* (no FAQ markup in the body at all), not by
the string matcher.

Generalisable: an exact-substring check against rendered HTML is blind to
entity encoding and to typographic quote substitution, and it fails in the
alarming direction — it manufactures defects on healthy pages. Decode and
normalise before comparing, and treat a MISS/OK split that correlates with a
punctuation character as an instrument fault rather than a finding.

**Running total: 1,287 of 1,364 fixed.** Remaining: **69** `/collections/[slug]`
pages, deliberately deferred until after **2026-10-06** — that template is
inside the running §E5 link-concentration test and a content change would
confound the read. Nothing else is outstanding.

### §E50 — the search-term instrument was never dark; typo rescue shipped (2026-09-06)

Refuel leg (queue empty). Ran the `fleet-search-standard` demand-discovery lever,
which had never been read on this site. Four instrument findings, one ship.

#### 🔴 1. `search_term` is a GA4 RESERVED parameter — `customEvent:search_term` is permanently `(not set)`

The emitter has always sent it (`gtag("event", z?"SearchNoResults":"Search",
{search_term: sq, results, fallback_shown})`), and `search_term` **is registered
as a custom dimension** on the property. Querying it returns `(not set)` for
**100% of 342 Search + 186 SearchNoResults events over 30d** — so the obvious
reading is "the instrument is dark, file a defect".

It is not. `search_term` is GA4's reserved parameter for site search, so the
value lands in the **built-in `searchTerm` dimension**, never in a custom one.
The custom-dimension registration for it is inert.

```
dims=customEvent:search_term  ev=SearchNoResults  30d ->   1 row: "(not set)" 186
dims=searchTerm               ev=SearchNoResults  30d -> 164 rows of real queries
```

Positive control that made the diagnosis safe rather than a guess:
`customEvent:page` on `amazon_click` returns **real values** (29 events) beside
203 `(not set)` — the forward-only registration boundary. So custom dimensions
on this property demonstrably work; only the reserved name does not.

**For every future session: query `dims=searchTerm`, never
`dims=customEvent:search_term`.** Registering a custom dimension on a reserved
GA4 parameter name produces a dimension that exists, accepts the registration,
and can never return a value — a false absence that reads exactly like a broken
emitter.

#### 🔴 2. The 09-04 search collapse is the de-dupe fix WORKING, not a bug

Total searches/day fell from 24 · 43 · 21 (09-01..09-03) to **3** on 09-04, while
pageviews (511), `scroll` (89) and `explorer_use` (105) all stayed normal. That
reads as a broken search widget on the #2 earner.

It is not. `304d344` (09-03 20:23) shipped the typing-session de-dupe + 1800ms
settle from `fleet-search-standard`. The pre-fix data still carries the ladders
it was written to collapse:

```
Emer · Emeral · Emerald gree · Emerald green
Brown, bi · Brown, biege · Brown, biege and ora · Brown, biege and orange
Kopenha · Kopenhavn · Kopenhavngreen
```

Collapsing the 164 distinct zero-result queries with the site's own 60%-prefix
rule removes **52 of them (32%)** — direct evidence of the inflation the fix
targets. Pre-fix search rate was 8.3% of pageviews, which is implausibly high for
a content site; post-fix 0.6% is ordinary.

The discriminator that ruled out a code fault: `explorer_use` and the search
widget were both in the five scripts `8820db2` moved to `type="module"`. The
explorer is unaffected (137 · 105 · 114 · 132), so `type="module"` did not break
anything. **09-05 data is incomplete** (`scroll` 8 vs ~90) — GA4 lag; only 09-04
is a complete post-fix day, so this is n=1 and stated as such.

#### 3. Today's two search commits measurably fixed 29% of the dead-end pool

Replaying all 164 zero-result queries against the **current** live
`/search-index.json` (769 rows) using the site's own `srch()` + `loose()`:

| outcome | queries | events | share |
|---|---:|---:|---:|
| now found by strict search (fixed by `a8adb1c` + `4fd9944`) | 17 | 41 | 29% |
| strict miss, loose fallback rescues it | 23 | 45 | 32% |
| nothing at all | 38 | 56 | 39% |

`beige`, `Burgundy`, `Emerald green` now hit the 54 new hub pages; `year` and
`Triadic` hit the newly-indexed editorial pages. Loop closed on both ships.

**`SearchNoResults` overstates true dead-ends by ~32%** — it fires whenever
*strict* search misses, even when the loose fallback showed relevant results.
The `fallback_shown` param already records which. Read the two together.

#### 🔴 My own simulation over-counted dead ends — the hex tier was missing

The "nothing at all" bucket contains `#71406B`, `F0CCAC`, `ff4d52`, `104C90` and
~14 more hex-shaped queries. My replay implemented `srch()` and `loose()` but
**not `hexOf()`**, the route-before-search tier that sends a pasted hex to the
converter. The live site handles those; my simulation did not. True dead-end
count is therefore materially below 56, and any figure quoted from that bucket
must exclude hex/plate shapes.

#### The ship: tier-3 typo rescue

18 of the remaining dead ends are **single-character misses on colours the
dictionary already has** — not content gaps, search failures:

```
lavendar        -> Grayish Lavender - B      cinamon   -> Cinnamon Buff
Eugenua         -> Eugenia Red | B           Contiga   -> Cotinga Purple
rosalanc purppl -> Rosolanc Purple           coquetre  -> Coquette Color Palettes
```

Added a third tier that runs **only when strict and loose have both returned
nothing**, so it cannot alter any query either already answers — verified against
the 30d successful-search log (226 queries / 342 events): 0 regressions by
construction. Bounded edit distance (≤1 for words ≤5 chars, ≤2 above) over an
805-word vocabulary built once and cached.

Tested by extracting the **shipped** functions and running them against the
**live** index — not a re-typed copy: 6/6 typo cases rescued, 4/4 controls
(`kurenai`, `beige`, `boho`, `emerald green`) still answered by strict search so
the fuzzy tier is never reached. `ed()` unit-tested against known distances
including `kitten`→`sitting`=3. `node --check` clean on both patched regions.

**Honest EV: ~18 events/30d.** Small on a site earning $51.53/mo. Shipped because
it is ~15 lines, zero-regression by construction, permanent, and generalises to
every future typo rather than a hand-maintained alias list. The residual dead
ends are non-English colour names (`Коричневый`, `Glicinia roxa`, `Kopenhavngreen`)
and context words (`Clothing`, `monotone`, `high tech`) — both real but ~11-13
events/30d each, and the context case has no clean fix: 702 `[context]` pages
exist but there is no per-context landing page to point a search at, and indexing
all 702 would double the 118KB payload every page downloads. Left unfixed
deliberately, with the numbers recorded rather than a speculative change shipped.

#### §E50 addendum — a cross-site "correction" I nearly filed, and the control that killed it

Sibling card `mtp8gokr3mtgox` (readinglist.school) is a 2026-09-13 gate whose
premise is *"the instrument only started capturing `q` on 2026-09-04, so no
readable demand data exists yet"*. Having just found the reserved-name trap here,
the obvious move was to tell them their data already exists in the built-in
dimension — a week of waiting saved.

First read supported it: `dims=searchTerm` on readinglist returns **20 real
queries** (`2nd grade math`, `Girl in the arena`, `The book of bones`…).

Split by event, it collapses:

```
readinglist  dims=searchTerm      ev=SearchNoResults  30d -> 1 row, BLANK, 357 events
readinglist  dims=customEvent:q   ev=SearchNoResults  30d -> 1 row, "(not set)", 357
```

**Neither dimension carries their zero-result queries.** The 20 values come from
other events. Their gate card is right and my correction would have been wrong.

Why the two sites differ: colorcombinations sends the **reserved** `search_term`,
so its values land in the built-in dimension by accident of naming; readinglist
sends `q`, which is not reserved, so its built-in stays empty and its custom
dimension is genuinely on the forward-only boundary. **The finding in §E50 is
site-specific, not fleet-general** — the reference card was written before this
check and says "any fleet site following `fleet-search-standard` will show the
same `(not set)`", which is true of the custom dimension but does **not** imply
the built-in has the data. Corrected in the card.

The discriminator was one extra parameter — `ev=SearchNoResults` — on a query I
had already run without it. An aggregate that mixes events answers a different
question than the one being asked, and the aggregate's answer was the flattering
one.

#### §E50 verified live + a deploy-polling trap

```
served HTML   function fuzzy=1  function ed(=1  "did you mean"=1   (control: function zzznope=0)
LIVE code vs LIVE index:  6/6 typo cases rescued
  lavendar -> Grayish Lavender - B      cinamon  -> Cinnamon Buff
  Eugenua  -> Eugenia Red | B           Contiga  -> Cotinga Purple
  rosalanc purppl -> Rosolanc Purple    coquetre -> Coquette Color Palettes
NEGATIVE CONTROL  fuzzy("zzqxwvpl") = 0        (not a constant-true)
POSITIVE CONTROLS kurenai 3 · beige 1 · boho 1 · emerald green 1 — all answered by
                  strict search, so the fuzzy tier is never reached for them
```

Extracted the functions from the **served page**, not the repo, and ran them
against the **served index** — a re-typed copy would test the copy.

**Polling trap worth remembering:** the verification job polled the pipeline for
commit `275ea2a` and would have spun for its full 30-minute budget. Pushing a
second commit (`6c2b0b9`, state only) made GitLab **auto-cancel** the first
pipeline as redundant — so its status went to `canceled`, which the loop treated
as neither success nor failure. The site was already deployed by the newer
pipeline. **A per-SHA pipeline poll is only valid while that SHA is the tip;
break on `canceled`/`skipped` as well, or poll the branch rather than the SHA.**

### §E51 — ran the ownership test on both named headroom clusters; both close, nothing to ship (2026-09-06)

`affiliate-team-standard` § THE OWNERSHIP LAW names two colorcombinations
headroom items and says the deciding question — *who wins the citations we do
not?* — is "answerable and nobody has asked it". Asked it. Both close, and
neither closes toward a build.

#### Cluster 1 — `y2k colors` (467 citations, 13–22% share, ~2,398 "unwon"): PEER-SATURATED, do not fund

`WebSearch("y2k colors")` verbatim, result set classified per the rule's table:

```
colormagic.app       palette tool          <- dedicated archetype peer
color-hex.com  x2     palette database      <- dedicated archetype peer (two rows)
y2k-drip.com          shop + palette page   <- dedicated peer
Wikipedia "Y2K aesthetic"                   <- ON-TOPIC -> contributes to OWNED
pinterest / fizzymag / zazufeu              <- media
```

No standards body and no manufacturer, so it is not OWNED in the institutional
sense — but **three or more dedicated peers whose whole product is this query**
is the PEER-SATURATED verdict, not the winnable-wedge one. The rule's own
warning applies exactly: *one* archetype peer is an encouraging existence proof,
**three is the market**. Same "don't fund CTR" outcome, different reason, and
only the institutional kind is ever worth revisiting.

Bing volume confirms the scale is small anyway: the whole y2k cluster is
**≥37 + 16 + 6 + …≈ 90 impressions** (floor) at positions 2–10.

#### Cluster 2 — `color of the year 2026`: NOT owned, and still nothing to ship

Ownership test says **winnable**: Benjamin Moore and Sherwin-Williams rank, but
each covers **only its own brand** on a cross-brand question — per the rule's
table that is ✅ not owned. The cross-brand answer is held by independent media
(younghouselove "Every 2026 Color of the Year", wunderlabel, archdaily), no
Wikipedia, no institution.

But the build the verdict would license **already exists and is better**:

```
/trends/color-trends-2026/   title names "Pantone Cloud Dancer + 13 More"
                             2,446 words · all 14 brands · 2025 comparison
                             meta-trend section · sources & methodology · FAQ
                             the site's #1 AI-cited page (6,064 citations/30d)
Bing:  "color of the year 2026"  impressions >=632 (3rd-largest query)  position 5.0
```

So this is the **definitional zero-click** shape from `ai-citation-channel`, not
a title or content defect: the query has a short factual answer, the AI gives it,
and the citation does not become a click. The only remaining lever is *position*
(5.0 → top-3), which is authority and internal linking — **not** a title rewrite.
I did not touch the page: it earns 6,064 citations/30d and changing the fleet's
most-cited asset on a hunch is the "remedy worse than the disease" trade.

⚠️ **I also could not have judged CTR here even if I wanted to.** `bing-ctr.mjs`
flags this site CLICK-SELECTED — CTR UNAVAILABLE, and the query feed is
rank-ordered, so the `632 impressions / 2 clicks` above is a floor on impressions
and says nothing reliable about rate.

#### The forward-looking check — already done by someone else today

The 2026 cluster is seasonal and will decay as 2027 announcements land
(Sept–Dec 2026). `/trends/color-trends-2027/` is **already live, 2,069 words,
`dateModified` 2026-09-06, "Verified 6 September 2026"**, covering the three
announced picks (Valspar Cottage Door, Dutch Boy Deep Rooted, Behr Grounded),
who has not announced, and correctly separating Sherwin-Williams *Rewild* as a
forecast rather than a Color of the Year. Nothing to add. Checked before
proposing, per `measured-vs-expected` § a fleet flag is a timestamp.

#### 🔴 Instrument: `bing-probe`'s `chars` is CLAMPED at 200,000

I passed `chars=400000` and got back a body of **exactly 200000** characters,
cut mid-object, which threw `JSONDecodeError` at column 200001. My length guard
tested `>= 399000` — the wrong threshold — so it printed "truncated? False" one
line before the parse failed.

Test **length at cap**, never parse-success, and know the cap is 200k not
whatever you asked for. Repaired by trimming to the last complete object (965 of
an unknown larger set, 716 distinct queries, ≥5,385 impressions) and every figure
above is labelled a floor. The sample is also **rank-ordered**, so absent queries
are unknown rather than zero.

**Outcome: two named headroom items closed as not-fundable, with the evidence,
instead of a speculative change to the site's most-cited page.**

### §E52 — sitemap-ai.xml still advertised the URL §E41 turned into a 301 (2026-09-06)

Refuel leg. Ran the one documented lever never checked on this site — **Bing
indexation** — which came back healthy, and found a real defect one step to the
side of it.

#### Indexation: healthy, lever closed

`bing-probe?method=GetCrawlStats`, rows sorted by their epoch (**the API does not
return them date-sorted** — `rows[0]` was not the latest):

```
date        InIndex  Crawled  2xx   4xx  5xx  BlockedByRobots
2026-09-04  1940     780      2161  15   0    66
2026-09-01  1932     378      2116  2    0    61
2026-08-22  1717     144      1820  9    0    44
```

**InIndex 1,940 against a 1,528-URL sitemap = 127%**, rising steadily
(+223 in two weeks). Bing holds more than the sitemap advertises, so there is no
indexation gap to close. `BlockedByRobotsTxt: 66` is **correct, not a defect** —
robots.txt deliberately disallows `/og/` and `/go/` (the affiliate gate, where
every crawler hit that reached Amazon would be a tagged click on a fleet-shared
Associates account). Bing is being politely refused, as designed.

#### The defect: one stale URL, and it is the one this repo warned about

`sitemap-ai.xml.ts` is hand-maintained while `sitemap-0.xml` is generated by
`@astrojs/sitemap`. §E41 turned `/palettes/` into a 301 → `/browse/` and dropped
it from the generated sitemap. The hand-written one kept advertising it.

Swept **all 1,459 URLs** in `sitemap-ai.xml` (785 `<loc>` + 674
`<xhtml:link>` JSON twins), controls asserted first (`/` → 200,
`/zzz-not-a-page-control/` → 404), and `checked == input` enforced so a partial
sweep could not read as a clean one:

```
1458  200
   1  301   https://colorcombinations.org/palettes/   -> /browse/
```

Cross-checking the two sitemaps against each other gives the same answer from a
second direction: **exactly one** loc is in `sitemap-ai` and not in `sitemap-0`,
and it is this URL. 784 of 785 shared (the control — a small overlap would have
meant my extraction was wrong).

**Shipped:** dropped the `/palettes/` entry and moved its `jsonAlt`
(`/api/palettes.json`, verified 200) onto the `/browse/` entry, which had none —
so the JSON twin stays advertised on the surface that actually serves. Left a
comment at the line so the next hand-edit does not reintroduce it.

#### Two instrument notes from this leg

- **`grep -c '<loc>'` on a sitemap returns 1**, because the XML is one line.
  It read as "the sitemap has 1 URL" for a 1,528-URL file. Use
  `grep -o '<loc>' | wc -l`. Same trap as `positive-control-before-absence`
  § *grep -c counts lines, not matches* — met here on a different file type.
- **`GetCrawlStats` rows are not date-sorted.** Reading `rows[0]` as "latest"
  gives a row from weeks ago. Sort by the epoch inside `/Date(...)/` first.

### §E53 — affiliate compliance + money path audited: both clean, with controls (2026-09-06)

Two hard gates that had not been checked this session. Both pass. Recorded with
the evidence and the controls, because a "clean" verdict is worth nothing without
proof the detector could have said otherwise.

#### Compliance — 36 pages, 843 affiliate links, 100% conformant

`affiliate-team-standard` Pillar 4 is a **hard gate**: this site shares an
Associates account with the whole fleet, so one breach risks every site.

30 pages drawn at random from the live sitemap + 6 chosen money pages:

```
pages_with_tag_leak      0     (no raw amazon.*tag=…-20 anywhere in served HTML)
go-links != sponsored    0     (all 843 carry rel="sponsored nofollow noopener")
pages_with_price         0     (Amazon forbids displaying price)
FTC disclosure           present on every page (6-20 mentions)
```

Every page type covered: `/`, `/shop/`, `/books/…`, `/palettes/…` (10 links),
`/colors/…` (40), `/colors-that-go-with/…/…/` (38), `/collections/…` (30),
`/trends/…` (25), `/learn/…` (12), and `/tools/color-converter/…` (0 — a tool
page with no affiliate surface, correctly).

**Detector control — synthetic bad HTML, run in the same pass:**

```
<a href="/go/b/123">buy</a>                                     -> go=1 sponsored=0  ✓ flags missing rel
<a href="…amazon.com/dp/B01?tag=colorcombinations-20">leak</a>  -> LEAK=1            ✓ flags a tag leak
<p>Only $19.99 today</p>                                        -> price=1, ftc=0    ✓ flags price + missing FTC
```

Without that control the 36 clean rows would be indistinguishable from a broken
grep.

#### Money path — healthy, and probed without fabricating a single click

Hrefs resolved from the **live HTML** (never a guessed shape — a wrong shape 404s
and reads as a revenue outage). **No `-L`, no minted `?t=` token, no forged
`Sec-Fetch-*` headers**, so nothing reached Amazon:

```
/                 /go/b/4861522471?c=home             -> 302  https://colorcombinations.org/
/shop/            /go/b/4861522471?c=shop             -> 302  https://colorcombinations.org/
/colors/kurenai/  /go/p/B0BJ13LVD4?c=color-destination-> 302  https://colorcombinations.org/
forged ?t=ZZZZZZ                                      -> 302  https://colorcombinations.org/
```

All four reject to **bare own-origin** — path stripped, which is the gate
discarding the request. A canonicalising redirect *preserves* the path, so the
distinction is unambiguous.

**Positive control that makes those 302s readable:** `/` and `/colors/kurenai/`
both return **200 with no redirect**, so the site does not blanket-redirect and
the `/go/` 302s are genuinely the gate rather than canonicalisation. Without it,
a site that 30x'd everything would score identically.

This site runs the 302-to-home gate design, not the 200-interstitial one — both
are healthy refusals, and comparing across sites on status code alone would
misread one of them.

**Outcome: both hard gates verified clean. No change shipped, because there was
nothing to fix — recorded so the next audit can start from evidence rather than
re-run it.**

### §E54 — images lever checked: the 18 "unsized" images are a FALSE POSITIVE I caught before filing (2026-09-06)

`fleet-images-standard` requires every image lazy + **sized** so CLS is zero.
Measured across 6 page types:

```
/                    imgs=3   lazy=3   width+height=0
/paintings/          imgs=25  lazy=25  width+height=25   <- the detector discriminates
/palettes/fuji-ai/   imgs=1   lazy=1   width+height=0
/colors/kurenai/     imgs=11  lazy=11  width+height=0
/shop/               imgs=11  lazy=11  width+height=0
/collections/boho/   imgs=3   lazy=3   width+height=0
```

18 of 18 book covers carry no `width`/`height`. That reads as a fleet-standard
breach on the site's #2-earner, and `/paintings/` scoring 25/25 proves the check
is not blind — so it looked like a genuine finding.

**It is not.** The rule's own wording allows *"explicit `width`/`height` **or a
fixed-ratio container / `aspect-ratio`**"*, and the second form is what this
component uses. Read from the served CSS (`/_astro/about.nhzKXRgV.css`):

```css
.further-reading__cover      { display:block; position:relative; width:100%; aspect-ratio:2 / 3; overflow:hidden }
.further-reading__cover img  { position:absolute; inset:0; width:100%; height:100%; object-fit:cover }
```

Space is reserved by the wrapper before the image exists, so CLS is zero by
construction. **18 of 18 unsized images sit inside that ratio-reserved wrapper** —
checked per image, not assumed from one sample.

The component also implements the accuracy gate the same rule asks for:
`onerror` plus `onload` with `naturalWidth < 10` adds `.is-missing`, which hides
the `<img>` and reveals a CSS fallback layer showing the book's initials — so a
cover that fails to load degrades to a designed placeholder rather than a broken
image or, worse, a wrong one.

**I flagged an attribute and had not read the mechanism** — `measured-vs-expected`
§ *a defect in code you have not read is a guess about its author*. Caught before
it reached a card; the cost of filing it would have been someone adding redundant
`width`/`height` to 18 images across four templates for no CLS gain.

⚠️ **My own control also mis-fired and I nearly let it pass unexplained.** A final
`grep 'aspect-ratio:2 / 3'` against `about.BKX23xc5.css` returned nothing, which
would read as "the rule isn't in the served CSS". The page links **three**
stylesheets and the rule is in `about.nhzKXRgV.css` (0 · 1 · 0 across the three).
A single-file grep is a claim about that file; the earlier concatenated fetch of
all three is what actually established it.

**Levers now run on this site, with the verdict:** FAQ render (fixed, 94%) ·
search zero-result demand (fixed) · sitemap-0 sweep (fixed) · sitemap-ai sweep
(fixed) · internal linking (healthy, measured) · AI-citation ownership (both
clusters not-fundable) · titles (done) · Bing indexation (healthy, 127%) ·
affiliate compliance (clean, 843 links) · money path (clean, safely probed) ·
images (clean). **Remaining known work is one date-gated item**: the 69
`/collections/` FAQ renders, after 2026-10-06.

## §E55 — CI silently dropped a code deploy: docs-only skip now diffs against the LIVE commit (2026-09-06)

**Found while verifying §E52.** `src/pages/sitemap-ai.xml.ts` was committed (`5bab2ac`) and
pushed, `origin/main` has it, the local tree matches origin — and live still served the old
file. Cache-busted, `cf-cache-status: DYNAMIC`, 785 locs including the `/palettes/` 301 the
commit removed.

**Root cause — two correct mechanisms combining into a silent hole:**

1. `interruptible: true` (+ auto-cancel-redundant-pipelines). The `5bab2ac` pipeline was
   auto-cancelled ~4s later by the `b7f456d` push.
2. The DOCS-ONLY SHORT-CIRCUIT diffed `CI_COMMIT_BEFORE_SHA..CI_COMMIT_SHA`, i.e. against the
   commit's own PARENT. `b7f456d` and `ea62f2a` were `.claude/`-only, so each correctly
   skipped — against its own parent. Nothing ever asked "is what is LIVE behind what is on
   main?", so the cancelled code change was never rebuilt and never would be.

Measured evidence: pipelines on main = `ea62f2a success (31s)`, `b7f456d success (22s)`,
`5bab2ac canceled`, `275ea2a canceled (173s)`. CF Pages API: latest successful production
deployment `commit=275ea2a @ 2026-09-06T10:45:21`. **A 22s "success" is the tell** — a full
1,528-page Astro build plus a CF upload cannot happen in 22 seconds.

**The failure shape:** every signal green. Green pipelines, clean `git status`, `0 behind`,
code present on origin. Only the served bytes disagreed. Same family as `deploy-truth` —
an instrument that reports success while the artifact is stale.

**Fix (this commit).** BASELINE = the commit CF Pages is actually serving, read from the CF
Pages API (the same endpoint the post-deploy assertion already calls), and the docs-only
diff runs against THAT. Properties:

- **Self-healing.** The baseline only advances when something actually ships, so a dropped
  deploy is picked up automatically by the next push of any kind.
- **Fails open, loudly.** API down / no token / commit unknown to a shallow clone → try one
  `git fetch --depth=1`, then BUILD and say so. It never falls back to
  `CI_COMMIT_BEFORE_SHA`, which is precisely the blindness being removed.
- **Still skips what it should.** A `.claude/`-only push on top of a live-current main is
  still docs-only against the live commit and still skips.

**Verified locally before pushing** (real CF API response, real repo):
- parser returns `275ea2ac32c1e90988ba4b62886a4d93378dcb2b`
- controls: empty stdin → empty, garbage stdin → empty (both fail open) ✅
- `git cat-file -e 275ea2a` → known to git ✅
- `git diff --name-only 275ea2a HEAD` → `.claude/state/TASKS.md` **+ `src/pages/sitemap-ai.xml.ts`**
  → **BUILD**. Under the old logic the same push was `.claude/`-only → SKIP. That difference
  is the whole fix, and it is what recovers the stranded §E52 change.

**Do not "simplify" this back.** Dropping `interruptible: true` would fix the symptom by
making every push burn a full build; diffing against live fixes the cause and keeps the
cancellation benefit.

### §E55-verification — the fix ran, the stranded §E52 change shipped (2026-09-06 11:08 UTC)

**CI job trace (positive control that the NEW code path executed, not the old one):**
```
docs-only check: baseline = live deployment 275ea2ac32c1e90988ba4b62886a4d93378dcb2b
docs-only check: building (changed paths include non-.claude files)
$ npx astro build
```
Pipeline `2824114933` (e9ee68e) → **success in 174s**. Contrast the two skipped jobs it
replaces: 22s and 31s. Duration is the cheapest ongoing tell — a build that ships 1,528
pages cannot finish in 22 seconds.

**CF Pages production deployments (baseline advanced, so the skip is now self-healing):**
```
success  e9ee68e5b  2026-09-06T11:08:32Z   <- this fix + the recovered sitemap-ai change
success  275ea2ac3  2026-09-06T10:45:21Z   <- what live was stuck on for 23 min
success  8e6d424ca  2026-09-06T10:34:24Z
```

**Live `sitemap-ai.xml`, cache-busted, `cf-cache-status: DYNAMIC`:**
| check | expect | got |
|---|---|---|
| locs | 784 | **784** ✅ |
| bare `<loc>…/palettes/</loc>` (the 301) | 0 | **0** ✅ |
| `/browse/` present | 1 | **1** ✅ (control — proves the grep can find a loc) |
| per-palette URLs present | ≥1 | **378** ✅ (control — proves the file is the real sitemap) |
| `api/palettes.json` alternate on `/browse/` | 1 | **1** ✅ |

`/browse/` now reads:
`<loc>…/browse/</loc><changefreq>weekly</changefreq><priority>0.7</priority><xhtml:link rel="alternate" type="application/json" href="…/api/palettes.json"/>`

**Parity restored:** `sitemap-0.xml` = 1,528 locs, bare `/palettes/` count **0** — both
sitemaps now agree, which was the whole point of §E52.

**What this leg actually cost, honestly:** §E52's code was correct and merged 23 minutes
before anyone noticed it had not shipped. It was found only because the verification step
fetched the LIVE file instead of trusting the green pipeline. Had §E52 been "verified" by
reading `origin/main`, the defect would still be live and the CI hole would still be open.

## §E56 — the search lever, CLOSED on measurement: 82.3% of the zero-result log already resolves (2026-09-06)

Refuel leg — board empty, so ran the documented `fleet-search-standard` demand-discovery
lever. Result: **no fundable gap, and two shipped fixes verified against real user queries
for the first time.**

### Method

Replayed **all 164 distinct zero-result queries (186 events, 30d, `truncated=false`)** against
the **live** `/search-index.json` (769 entries) through a faithful Python port of the live
matcher — `hexOf()` → `srch()` → `loose()` → `fuzzy()`, same scoring constants, same
`norm()`.

Controls both directions: `srch("kurenai")` → 3 hits ✅ · `srch("beige")` → "Colors that go
with Beige" ✅ · `srch/loose/fuzzy("zzqxwv")` → 0/0/0 ✅. A matcher that matched everything or
nothing would have been caught.

### Result

| outcome on the live site | events | share |
|---|--:|--:|
| strict `srch()` match | 55 | 29.6% |
| hex → palette-from-color tool row | 36 | 19.4% |
| `loose()` match | 33 | 17.7% |
| `fuzzy()` typo rescue (§E50) | 29 | 15.6% |
| **STILL dead** | **33** | **17.7%** |

**82.3% of what dead-ended over 30 days now resolves.**

### 🔴 That 82.3% is an IN-SAMPLE fit, not a forecast

Both fixes that produce most of it were **built from this exact log**: `hexOf` routing
(§ 2026-09-03, comment cites `#71406B`, `#df6616`, `00908a`, `F0CCAC`, `ff4d52` — five of the
hexes in this window) and `fuzzy()` (§E50, built today from "lavendar"/"cinamon"/"Eugenua").
The sibling lane's 54 `/colors-that-go-with/` "Pairing guide" index entries (`a8adb1c`, card
`mtph3aaiz2ylei`) were likewise found by reading this log.

So this measurement proves the fixes **do what they were built to do on the data they were
built from**. It does not predict the next 30 days. A forward number needs a fresh window —
which the gate on card `mtppvsfvvdszfx` will produce.

### The residual, itemised — 33 events, 30 distinct, ~1.1/day

- **typing fragments** (`Bor`, `Buttr`, `Conti`, `Olv`, `Eis`, `Contains p`, bare `#` ×3): ~9 ev — noise, not fixable
- **Cyrillic** (`Коричневый` ×2, `коричневый`, `Корич`, `Темно коричневый`, `виноград`): 6 ev — real Russian colour queries (brown, dark brown, grape); no i18n index. `пкуу`/`пщдв` are Latin typed on a Cyrillic layout = noise
- **genuine one-off English words**: `Copenhagen`/`Kopenhavn`/`Kopenhavngreen` (3 ev — likely Copenhagen green pigment), `Glicini`/`Glicinia` (2 — wisteria), `biscuit`, `hemp`, `nude`, `monotone`, `chinese`, `R102B`
- **format/feature intent, not colour**: `tech`/`technical`/`technology` (3), `print`, `csv` (2)

### Why this is CLOSED and not a build queue

33 events / 30 days ≈ **1.1 dead searches per day** against ~230 sessions/day. Every
sub-cluster is 1–3 events. There is no cluster large enough to fund, and the fleet has now
closed this same lever with a measured negative on four sibling sites the same week —
readinglist (`mtpdoou5yer7mc`, ceiling $0.53/mo), fitmylens (`mtpdg5qlx6b72e`, no gap on 5
axes), cabinpets (`mtp9ygyqavnges`, zero search events in 90d), and here.

**Do not re-open this by re-reading the zero-result log.** The log is a *timestamp*, not a
state: 82.3% of it is already answered in production. Re-derive from a window that starts
**after 2026-09-07** or not at all.

## §E57 — the "#2 landing template is a dead end" finding was FALSE: it is 93.1% crawler (2026-09-06)

Refuel leg, continuing from §E56. The project cockpit names **Pageviews (16,213 / 40,000,
41%, at-risk)** as the biggest gap, so I went looking for where depth dies. What I found
looked like the clearest defect on the site — and it is not one.

### The finding that was available, and wrong

Landing templates by depth, 30d:

| landing template | sess | pv | pv/sess | % sess |
|---|--:|--:|--:|--:|
| `/` (home) | 2,298 | 7,085 | 3.08 | 33.7% |
| **`/colors-that-go-with/<slug>`** | **983** | **1,046** | **1.06** | **14.4%** |
| `/colors/<slug>` | 802 | 1,802 | 2.25 | 11.8% |
| `/browse` | 736 | 1,522 | 2.07 | 10.8% |
| `/palettes/<slug>` | 495 | 1,188 | 2.40 | 7.3% |
| `/collections/<slug>` | 374 | 1,181 | 3.16 | 5.5% |

The #2 entry surface at **1.06 pv/session** against a 2.34 site mean, plus **1.9 Amazon
clicks/1k pv** against 14.6 site-wide, reads as a total dead end — "lands, sees one page,
converts at nothing." Lifting it to `/colors/<slug>`'s 2.25 would be **+1,170 pv/30d**,
which is 7.3% of site pageviews: precisely the metric the cockpit flags. Very fundable-looking.

### What killed it

**Read the page first.** `/colors-that-go-with/rust/an-outfit/` (top leaf, 17 pv) carries
**110 internal links** — 21 to sibling contexts, 8 to palettes, 5 to tools — **38 `/go/`
affiliate links**, ~1,969 visible words, a sibling-contexts block and a visible FAQ. A page
with 110 outbound links and 38 CTAs does not produce 1.06 pv/session because it is a dead
end.

**Then segment the traffic** (`measured-vs-expected` § a channel can pass while containing a
pure-crawler block — which names this exact template):

| channel into `/colors-that-go-with/` | sess | users | pv | sess/usr | pv/sess |
|---|--:|--:|--:|--:|--:|
| **Direct** | **916** | **916** | **916** | **1.00** | **1.00** ← crawler-shaped |
| AI Assistant | 35 | 32 | 80 | 1.09 | **2.29** |
| Organic Search | 31 | 26 | 48 | 1.19 | **1.55** |
| Unassigned | 2 | 2 | 3 | 1.00 | 1.50 |

**93.1% of that template's sessions are one bot fetching one URL once.** Its ~68 human
sessions read 2.29 pv/session from AI Assistant and 1.55 from Organic — normal for an answer
page. There is nothing to fix, and "adding onward links" would have been aimed at a
population that cannot follow them.

The crawl is bursty, not steady: **4 days (08-22, 08-23, 08-26, 08-27) carry 481 of the 916
sessions — 52.5%.** Baseline is 7–20/day.

### The asymmetry worth remembering

Crawler contamination here inflates **sessions by 13.7%** (885 of 6,471 over the pre-window)
but **pageviews by only ~5.7%**, because each crawler session is exactly one pageview. So on
this site:

- any **per-session or per-user** rate is materially contaminated
- any **per-pageview** rate is barely affected
- and site-level **pv/session is UNDER-stated**: true human ≈ 15,076/5,919 = **2.55**, not 2.34

### Effect on the §E56-adjacent search finding (card `mtppvsfvvdszfx`)

Recomputed on crawler-corrected human sessions, it **survives**:

```
09-04  236 raw − 26 crawler = 210 human -> 14.29 searches/1k  (raw 12.71)
09-05  134 raw −  5 crawler = 129 human -> 15.50 searches/1k  (raw 14.93)
PRE 28d: 6,471 sess − 885 crawler = 5,586 human
```

Correcting moves both post days by ~1.5 points and lifts the pre-window baseline too, so the
gap widens slightly rather than closing. The conclusion is unchanged; the numbers on that card
should be read as raw-session rates.

### Not filed as work

No code change. Recorded so the next lane that reads the cockpit's "pageviews at-risk" flag
and walks into the same 1.06 does not re-derive it — it is the single most available false
finding on this site, sitting on 14.4% of sessions.

## §E58 — the crawler-viewport gate is LIVE and correctly aimed; a threshold it silently biased is corrected (2026-09-06)

Follow-on from §E57. Having established that 13.7% of sessions are crawler-shaped, the
obvious question is whether `0ff5afe` — "exclude crawler-shaped viewports from GA4", shipped
2026-09-05 14:06 — actually does anything. **Nobody had checked.**

### Verified today

**It is deployed.** `__CRAWLER_SHAPED__` present and `ga-disable` ×2 on `/`,
`/colors-that-go-with/rust/an-outfit/` and `/palettes/kurenai-kon/`; control token
`__NOT_A_REAL_FLAG__` = 0. Checking this at all was a direct consequence of §E55 — after
finding that CI silently dropped a deploy this morning, "the commit is on main" is no longer
evidence that the code is live.

**It is aimed at the right population.** The four gated resolutions (`1280x1200`,
`1366x1366`, `1600x1600`, `393x851`) are **21.4% of 30d sessions — 1,467 of 6,860** — and
track the `/colors-that-go-with/` Direct crawler block at **Pearson r = 0.930** across 30
days, with the same top-4 burst days (08-22, 08-23, 08-26, 08-27). The gate covers more than
that one block (1,467 vs 916), which is expected: the same bot hits other page types too.

**It is not yet verified to WORK.** It shipped mid-afternoon on 09-05 and GA4 has no full
post-gate day. 09-05 shows 13 gated sessions against a 30–50/day baseline — consistent with
~10 hours of gating, and consistent with nothing. Gate card `mtpq6rtlgqy34t` scheduled
**2026-09-08 09:00 UTC** (`status: scheduled`, `scheduledFor: 1788858000000` — read back and
confirmed, so it can actually fire) with a four-signal prediction stated in advance.

### 🔴 The part that mattered: it silently biased a threshold filed two hours earlier

From 09-06 the gated sessions leave the GA4 denominator. Any `per 1k sessions` rate therefore
**rises 18–27% mechanically**, with no behavioural change.

Card `mtppvsfvvdszfx` (the search-volume drop, filed this morning) set its bar at *"≥4
consecutive days ≤20 searches/1k = confirmed regression"*. That bar sits **inside the
inflation band** — a still-broken search box could print 19/1k and be closed as variance.

Corrected on that card via `## Revision 2026-09-06`: compute on crawler-corrected human
sessions, revised bar **≤25/1k over 4 consecutive days**, with the denominator-free
alternative (absolute daily search events: 21 → 3 → 2 against an August median of ~16) named
as the safer test.

**Generalisation worth keeping:** a fix that changes a *denominator* invalidates every
threshold expressed as a rate over that denominator — including ones filed hours earlier by
the same session, in good faith, from correct data. When shipping or verifying an analytics
exclusion, grep the board for live cards holding `per 1k` / `per session` thresholds and
re-base them, or the next lane will read a mechanical shift as a real result.
