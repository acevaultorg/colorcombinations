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
them. ⇒ **Genuinely demandless.** That is the finding, and per `realized-demand-discipline` a
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
