# First €100 — the 2-hour operator playbook

Everything on colorcombinations.org is code-complete. This document is
the dense, sequential checklist from "site is live" to "first €100 hits
your Gumroad balance." Total operator time: ~2 hours.

Follow the order. Each step unblocks the next.

---

## Step 0 — Confirm the live site before you touch anything (2 min)

Open these three URLs in a fresh browser window. Each must return 200
with no console errors:

- https://colorcombinations.org/
- https://colorcombinations.org/shop/
- https://colorcombinations.org/blog/how-to-use-sanzo-wada-in-modern-design/

If any of them is broken, stop and flag it — a launch onto a broken site
is a one-time failure.

---

## Step 1 — Create the Gumroad product (15 min) — unblocks all bundle revenue

**Why first:** without a real product URL, zero traffic converts into money.

**Account:** paulomdevries@gmail.com (cluster analytics-account rule).

1. Go to https://gumroad.com/signup, sign up with `paulomdevries@gmail.com`.
2. Confirm email, complete payout setup (bank or PayPal).
3. **+ New product → Digital product**.
4. Upload `bundle-source/wada-bundle-v1.zip` from the repo (~50 KB).
5. Paste the product copy from
   [`launch/gumroad-product-description.md`](./launch/gumroad-product-description.md).
   Every field is filled in there — name, permalink, price, summary,
   description, thank-you message, tags.
6. Publish.
7. Copy the live product URL (format: `https://YOURNAME.gumroad.com/l/wada-bundle`).
8. In the repo, open `src/config/monetization.ts`, find `BUNDLE.checkoutUrl`:
   ```ts
   checkoutUrl: "/shop#bundle-coming-soon" as const,
   ```
   Replace with:
   ```ts
   checkoutUrl: "https://YOURNAME.gumroad.com/l/wada-bundle" as const,
   ```
9. Redeploy:
   ```sh
   npm run build
   wrangler pages deploy dist --project-name=colorcombinations --branch=main
   ```
10. Open https://colorcombinations.org/shop, click **Support the archive**,
    confirm it navigates to the real Gumroad page.

---

## Step 2 — Bookshop.org affiliate (5 min) — secondary revenue, instant approval

1. Go to https://bookshop.org/pages/affiliate-program, sign up with
   `paulomdevries@gmail.com`.
2. On approval (usually instant), copy your affiliate ID from the
   affiliate dashboard.
3. In `src/config/monetization.ts`, find `BOOKSHOP.affiliateId`:
   ```ts
   affiliateId: "PLACEHOLDER_BOOKSHOP_ID",
   ```
   Replace with your ID.
4. Redeploy (same command as above).

Bookshop pays a generous affiliate commission with a long cookie window
(check bookshop.org/pages/affiliate-program for current terms). Every
FurtherReading widget on the site now earns — `/about`, `/shop`, and
every one of the 378 palette pages (deterministic book rotation).

---

## Step 3 — Analytics (20 min) — three free rails, all under paulomdevries@gmail.com

**Cluster rule:** NEVER use the Mediahuis account for any analytics.

### 3a. Plausible (if you're paying) OR skip

Paid, cookieless, GDPR-safe. Pricing tiers change — check
plausible.io/#pricing. If you're bootstrapping, skip this step and rely
on GA + Clarity, which are free. Revisit Plausible once revenue exists.

If you're keeping Plausible:
1. Sign up at https://plausible.io with `paulomdevries@gmail.com`.
2. Add site: `colorcombinations.org`.
3. Paste `colorcombinations.org` into `ANALYTICS.plausibleDomain` in
   `src/config/monetization.ts`.

### 3b. Google Analytics 4 (free) — required

1. Go to https://analytics.google.com, sign in as `paulomdevries@gmail.com`.
2. **Admin → Create property** → name: "ColorCombinations",
   timezone: Europe/Amsterdam, currency: EUR.
3. Create a **Web** data stream for `colorcombinations.org`.
4. Copy the **Measurement ID** (`G-XXXXXXXXXX`).
5. Paste it into `ANALYTICS.gaMeasurementId` in `src/config/monetization.ts`.

### 3c. Microsoft Clarity (free) — required

1. Go to https://clarity.microsoft.com, sign in as `paulomdevries@gmail.com`
   (use the Sign in with Google option).
2. **+ New project** → name: "ColorCombinations",
   URL: `colorcombinations.org`.
3. Copy the **Project ID** (short alphanumeric string, e.g. `abc123xyz0`).
4. Paste it into `ANALYTICS.clarityProjectId` in `src/config/monetization.ts`.

### 3d. Google Search Console — free, essential for SEO

1. Go to https://search.google.com/search-console, sign in as
   `paulomdevries@gmail.com`.
2. **Add property → Domain**: `colorcombinations.org`.
3. Verify via TXT DNS record (Cloudflare DNS → Add record → TXT).
4. Once verified: **Sitemaps → Add new sitemap** → paste
   `https://colorcombinations.org/sitemap-index.xml`.
   (Important: the full URL, not a relative path — cluster rule.)

### 3e. Redeploy + verify

```sh
npm run build
wrangler pages deploy dist --project-name=colorcombinations --branch=main
```

Visit https://colorcombinations.org in an incognito window. You should
see the cookie-consent banner at the bottom (because GA and Clarity are
cookie-based rails). Click **Accept**. Confirm in GA4 Realtime and
Clarity Live that you see yourself as a live visitor within 30 seconds.

---

## Step 4 — Launch the HN post (10 min, plus replies over the day)

**Best time:** Tuesday, Wednesday, or Thursday, 8–10am Pacific. Avoid
Monday and Friday. Avoid weekends.

1. Open [`launch/hacker-news.md`](./launch/hacker-news.md).
2. Go to https://news.ycombinator.com/submit.
3. Paste the title and URL from the file.
4. Submit.
5. Within 60 seconds, post the first-comment text from the file as your
   own reply to your own submission.
6. Check the post every 30 minutes for the next 4 hours. Reply to every
   substantive comment — the file has pre-written answers to the most
   common questions.

**Expected outcome:** if it ranks top-20 on HN for at least 2 hours, you
get 10–50k visitors in 24 hours. At a conservative 0.3% bundle conversion
× $5 average = $30–$75 USD just from HN. That's the single most probable
path to crossing €100.

---

## Step 5 — Social thread (15 min, same day as HN)

1. Open [`launch/social-thread.md`](./launch/social-thread.md).
2. Screenshot or download the OG images for the palettes referenced in
   posts 5 and 6 (`wada-001` and `kurenai-kon`).
3. Post to Bluesky first (strongest design community in 2026). Post 1
   with image, reply with posts 2–10.
4. Wait 30–60 min, repost to Mastodon, then Threads, then optionally X.
5. Include the HN link in one reply once the HN thread has traction.

X (formerly Twitter) is optional — organic reach there without paid
boost is poor. Only post if you have an existing X audience.

---

## Step 6 — Reddit posts (10 min each, spaced 3 days apart)

1. **Tuesday (or HN-launch day):** post
   [`launch/reddit-r-web_design.md`](./launch/reddit-r-web_design.md).
2. **Friday:** post
   [`launch/reddit-r-graphic_design.md`](./launch/reddit-r-graphic_design.md).
3. **The following Tuesday:** post
   [`launch/reddit-r-design.md`](./launch/reddit-r-design.md).

Do NOT post to all three subs on the same day — Reddit's spam filter
de-ranks all three submissions if it detects identical or near-identical
cross-posts.

Reply to the first 5 comments on each thread within an hour.

---

## Step 7 — Cold email 3 design newsletters (15 min, same week)

1. Open [`launch/cold-email-design-blogs.md`](./launch/cold-email-design-blogs.md).
2. Pick 3 outlets from the table. **Recommended first 3:**
   - Sidebar.io (daily design links; easiest win)
   - CSS Weekly (weekly newsletter; engaged audience)
   - Pixels of the Week (design-specific; high hit rate)
3. Paste the short-form template; personalize the first line per outlet.
4. Track responses in a spreadsheet. Never follow up more than once.

---

## Step 8 — Product Hunt (1 hour, the following week)

See [`launch/producthunt.md`](./launch/producthunt.md). Do NOT launch on
PH the same week as HN — traffic spikes fragment instead of compound.
Launch PH exactly at 12:01 AM Pacific on a Tuesday or Wednesday.

---

## What "done" looks like

- [ ] Gumroad product is live and linked from `/shop`
- [ ] Bookshop affiliate ID is in the deployed config
- [ ] GA4 + Clarity are firing in the live site (verified in realtime)
- [ ] GSC has the sitemap submitted and at least one page indexed
- [ ] Cookie-consent banner appears on first visit and disappears after click
- [ ] HN post submitted
- [ ] Social thread posted on Bluesky / Mastodon / Threads with images
- [ ] At least one Reddit post submitted
- [ ] First three cold emails sent

By the time all of the above is true, the site is a live revenue
machine, not a portfolio piece. The only remaining variable is traffic
volume, and the launch assets above are the highest-leverage work to
compound traffic into the first €100.

---

## When you hit €100

Update this file with a line:

> **First €100: [date] — [source breakdown]**

Then ask AcePilot `/acepilot god` with the focus
`"plan the first €1000 given what worked for the first €100"` and the
next leg begins with real data instead of hypotheses.
