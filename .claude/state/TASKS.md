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
