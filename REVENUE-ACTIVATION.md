# Revenue Activation — ColorCombinations

Everything on the site is live, shipped, and production-safe. The monetization stack is wired but **gated behind placeholder URLs** so no clicks go to 404 until you've created the accounts. This doc walks you through activating each revenue stream, in priority order.

**Estimated time end-to-end: 45 minutes.** First 15 minutes unlock your primary revenue rail (the bundle).

---

## The plan in one paragraph

You'll sign up for Gumroad (sells the bundle), Bookshop.org (affiliate books), and Plausible (analytics). You'll paste three URLs into `src/config/monetization.ts`. You'll redeploy. After that, every visitor to the site is a potential customer for a $12 bundle, a potential affiliate-click, and a tracked session in a privacy-first dashboard.

---

## Step 1 — Gumroad (primary revenue rail)

**Time:** 15 min. **Cost:** $0 until a sale, then 10% of each sale.

### Why Gumroad

- No store setup. No checkout code. Upload a zip, set a price, get a URL.
- Stripe + PayPal built in. No tax form until you hit $600/year (US).
- Buyers get an email with the download link automatically. No manual fulfillment.
- Alternatives: Lemonsqueezy (similar, EU-based, MoR for VAT), Polar.sh (newer).
  Gumroad is fastest; any of the three works with the same paste-one-URL flow.

### Steps

1. Go to https://gumroad.com/signup — create a seller account with the same email you plan to use for support.
2. Confirm the email, complete the basic profile (display name, country, payout method).
3. Click **+ New product** → **Digital product**.
4. Upload the file at `bundle-source/wada-bundle-v1.zip` (it's about 50 KB and contains 384 files: format files + 378 SVG plates + README).
5. Set the fields:
   - **Name:** `The Complete Wada Bundle`
   - **Price:** `$12` (you can also offer "pay what you want" with a $12 minimum — conversion data is mixed on this, start with fixed $12)
   - **Description:** copy from below ↓
   - **Permalink:** `wada-bundle` (the URL will be `https://gumroad.com/l/wada-bundle`)
6. Click **Publish**.
7. Copy the product URL (from the product page, not the settings — it should look like `https://YOURNAME.gumroad.com/l/wada-bundle`).
8. Open `src/config/monetization.ts`, find the `BUNDLE` block, replace:
   ```ts
   checkoutUrl: "/shop#bundle-coming-soon" as const,
   ```
   with:
   ```ts
   checkoutUrl: "https://YOURNAME.gumroad.com/l/wada-bundle" as const,
   ```
9. From the repo root:
   ```sh
   npm run build && npx wrangler pages deploy dist --project-name=colorcombinations --branch=main
   ```
10. Visit https://colorcombinations.org/shop/ — the "Get the bundle $12" button now opens the Gumroad checkout in a new tab. Verify by hovering.

### Description to paste into Gumroad

```
The complete catalog of Sanzo Wada's 1933 "A Dictionary of Color Combinations" — all 348 historical plates, plus 30 editorial deep-dives rooted in traditional Japanese shikisai — in one download, five formats.

What's inside:
• 378 palettes total (348 Wada + 30 curated)
• Figma design tokens (W3C-spec JSON, drag into any file)
• Tailwind v4 @theme block + Tailwind v3 config
• CSS custom properties — every plate, one stylesheet
• SVG museum plates — print-ready at any size
• Full JSON — colors, names, eras, moods, dominant hues

The archive at colorcombinations.org will always stay free. This bundle is for designers who want the whole catalog in one place, on disk, under version control, without rate limits or logins. It's also how the site stays online without display ads.

One-time purchase. No subscription. Updates are free — if the catalog grows (more editorial plates, better shikisai cross-references), you get the new version automatically on Gumroad.

Source data for the 348 historical plates: mattdesl/dictionary-of-colour-combinations (MIT), itself derived from the community reconstruction efforts around Wada's 1933 original. Individual hex values and color names are public-domain cultural commons.

Thank you for supporting the archive.
```

### How to regenerate the zip after adding more palettes

```sh
npm run bundle        # rewrites bundle-source/wada-bundle-v1.zip
# Upload new zip via Gumroad product settings → Content
```

---

## Step 2 — Bookshop.org affiliate (secondary revenue rail)

**Time:** 10 min. **Cost:** $0. **Commission:** 10% of each sale, 24h cookie.

### Why Bookshop.org

- 10% commission vs Amazon's 4% on books.
- Supports independent bookstores (25% of profits to indie shops).
- Brand fit: matches the museum/editorial voice way better than Amazon.
- Fallback to Amazon Associates (step 2b) for books Bookshop doesn't carry.

### Steps

1. Go to https://bookshop.org/pages/affiliate-program
2. Click **Sign up** → create an affiliate account (they'll ask for your site URL — use `https://colorcombinations.org`).
3. After signup, go to your dashboard → **Affiliate settings** → copy your affiliate ID (it's a short slug like `colorcombinations` or `dictionary-of-colour`).
4. Open `src/config/monetization.ts`, find the `BOOKSHOP` block, replace:
   ```ts
   affiliateId: "PLACEHOLDER_BOOKSHOP_ID",
   ```
   with your actual ID:
   ```ts
   affiliateId: "your-affiliate-id",
   ```
5. Rebuild and redeploy (same command as step 1 above).
6. Visit https://colorcombinations.org/about/ — scroll to "Further reading." The Bookshop.org buttons now include your affiliate tag (hover any button, see the `?aid=` parameter in the URL).

### Verifying the affiliate links work

Open DevTools → Network tab → click one of the Bookshop.org buttons on /about. The outgoing URL should look like:
```
https://bookshop.org/p/books/a-dictionary-of-color-combinations-vol-1-sanzo-wada/19108229?aid=YOUR_ID
```

---

## Step 2b — Amazon Associates (fallback affiliate)

**Time:** 5 min setup, approval can take 24h. **Cost:** $0. **Commission:** 4% on books.

### Why

- Backup for books Bookshop doesn't stock.
- Wider catalog (some design books aren't indexed at Bookshop).
- **Caveat:** Amazon requires 3 sales in 180 days to keep the account active. Skip this step if you're not sure you'll hit that.

### Steps

1. Go to https://affiliate-program.amazon.com → sign in with your existing Amazon account.
2. Walk through the onboarding wizard — they'll ask for your site, your traffic sources, your monetization model. Be honest: "content site for designers, books are editorial recommendations."
3. Get your associate tag (looks like `yourname-20`).
4. Open `src/config/monetization.ts`, `AMAZON` block, replace:
   ```ts
   tag: "PLACEHOLDER_AMAZON_TAG",
   ```
   with:
   ```ts
   tag: "yourname-20",
   ```
5. Rebuild and redeploy.

---

## Step 3 — Plausible analytics (measurement)

**Time:** 5 min. **Cost:** $9/month (or free if you self-host [Umami](https://umami.is) — set `plausibleDomain` to your Umami domain instead, the script tag will still work with minor tweaks).

### Why Plausible

- GDPR-compliant by default, no cookie banner needed (matches the privacy-first brand).
- Light script (~1 KB vs Google Analytics 45 KB).
- The site already has `data-event` attributes wired on every monetization surface — Plausible picks them up automatically via the `tagged-events` script you're about to enable.

### Steps

1. Go to https://plausible.io/register → create an account (14-day free trial, then $9/mo for up to 10k pageviews/month).
2. After signup, click **+ Add a site**. Use the domain `colorcombinations.org` exactly (no https://, no www).
3. Plausible generates a snippet — you **don't need to paste it**. The BaseLayout already has it, gated on the config.
4. Open `src/config/monetization.ts`, `ANALYTICS` block, replace:
   ```ts
   plausibleDomain: "PLACEHOLDER_PLAUSIBLE_DOMAIN",
   ```
   with:
   ```ts
   plausibleDomain: "colorcombinations.org",
   ```
5. Rebuild and redeploy.
6. Open your Plausible dashboard — within 2 minutes of you visiting https://colorcombinations.org, the dashboard should show the first pageview.

### Events you get automatically

The site is already instrumented. As soon as Plausible is live, these events start flowing:

- **`bundle_cta_click`** — on BundleCta `<a>` and the wrapper section
- **`bundle_interest_click`** — same, but when bundle is still in placeholder mode
- **`bookshop_click`** — every FurtherReading Bookshop button
- **`amazon_click`** — every FurtherReading Amazon button
- **`export_click`** — every ExportPalette button (with a `format` prop: hex/tailwind/css/json)
- **`prints_cta_click`** — future (once Printful is wired)
- **`prints_waitlist_click`** — current (joins newsletter instead)
- **Outbound links** — tracked automatically via the `outbound-links` script variant

In Plausible → **Goals**, add each of the above as a custom goal to see conversion rates in the dashboard.

### Target funnel (first 90 days)

| Metric | Target | Rationale |
|---|---|---|
| Pageviews/mo | 500 → 5,000 | Slow SEO ramp from 348 new long-tail pages |
| Bundle CTA click rate | 3% on /shop, 1.5% on /palettes/* | /shop is high-intent; palette pages are exploration |
| Bundle click → purchase | 5% (Gumroad industry avg) | Gumroad's own stats for $5-$25 digital products |
| Bookshop click rate | 0.8% on /about | Low-intent but non-zero — editorial context |
| Export click rate | 15% on /palettes/* | Export is the primary free value — funnel top |
| Email signup rate | 3% of visitors | Baseline |

With 5,000 MV/mo at the targets above: $75-$100/mo from bundles + $10-$30/mo from Bookshop affiliate = ~$100/mo at the low end of V1. Scales linearly with SEO traffic.

---

## Step 4 — Post-activation: promote the launch

The site is ready. The monetization is live. Now it needs traffic. From `GROWTH.md` V1 launch sequence:

1. **Show HN** — title suggestion: `Show HN: All 348 combinations from Sanzo Wada's 1933 color dictionary, free`. Post after Plausible is live so you can see the traffic spike.
2. **r/web_design + r/graphic_design + r/Design** — 1 per week (not all at once — mod rules). Title: `[Resource] I shipped the full Sanzo Wada 1933 color dictionary — 348 plates + exports`.
3. **Twitter + Mastodon launch thread** — palette-of-the-day loop for 14 days. Screenshot a plate, post the hex values, link the detail page.
4. **Newsletter** — soft launch via personal contacts. Promise: 1 plate per week, 1 story.
5. **Google Search Console + Bing Webmaster Tools** — submit `https://colorcombinations.org/sitemap-index.xml`.
6. **Pinterest** — each palette is a perfect pin. V1.1 will generate per-palette OG PNGs for this.

---

## Support, returns, licensing

- Bundle support email: `hello@colorcombinations.org` (already in footer)
- Gumroad handles refunds for you (within 30 days, no questions asked is standard)
- Bundle license: personal + commercial use OK, redistribution of the bundle itself NOT OK (documented in the bundle's README.md and palettes.json)

---

## If something is broken

- **Site is down:** check Cloudflare Pages dashboard → Deployments tab for the latest build status.
- **Build fails:** `npm run build` locally first, read the error. Usually it's a TS error in a recent edit.
- **Bundle didn't regenerate:** `npm run bundle` — it overwrites the zip.
- **Wada dataset needs updating:** `npm run generate:wada` regenerates `src/data/wada-palettes.ts` from `scripts/wada-source/colors.json`.
- **Analytics not firing:** check the Plausible domain in `monetization.ts` matches exactly. Script is omitted entirely when placeholder is detected.

---

**End of activation guide.** Questions → `hello@colorcombinations.org`, or open an issue in the `acevaultorg/colorcombinations` repo.
