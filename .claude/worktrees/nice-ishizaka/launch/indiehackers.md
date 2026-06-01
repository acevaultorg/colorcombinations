# Indie Hackers launch post — ready to paste

**Platform:** https://www.indiehackers.com/
**Where:** post to the **"Show IH"** group, or the **"Milestones"** group
if you want to frame it as "just shipped v1".
**Audience:** bootstrappers, maker community, solo/small-team founders.
Very different tone from HN or LinkedIn — more vulnerable, more
transparent about process and revenue.
**Format:** Indie Hackers posts are markdown-rendered. Images are
uploadable.

IH readers respect transparency. Don't hide the $0-revenue reality —
lean into it. Bootstrapped projects pre-revenue is the norm here.

---

## Title

> Launched a static archive of Sanzo Wada's 1933 color dictionary — 614 pages, $0 revenue so far, trying to learn what works

## Body

> **Project:** [colorcombinations.org](https://colorcombinations.org)
>
> **What it is:** a rebuild of Sanzo Wada's 1933 *Dictionary of Color
> Combinations* as a free static website. 348 historical plates + 30
> editorial deep-dives + 211-entry color dictionary + per-palette
> exports to Tailwind / CSS / JSON.
>
> **Stack:** Astro 5, Tailwind v4, TypeScript strict, Cloudflare Pages.
> 614 static pages, zero runtime JS, ~2.6s build, ~23MB dist.
>
> **Revenue so far:** $0.
>
> **Monetization plan (hybrid):**
>
> 1. **Affiliate** — Bookshop.org affiliate links on book recommendations
>    (rotates across all 378 palette pages with deterministic per-slug
>    offsets so every page shows a different book).
> 2. **Pay-what-you-want bundle** — Gumroad, $3 floor, $5 suggested.
>    Packages all 378 palettes as Figma tokens + Tailwind configs +
>    CSS vars + SVG plates. Framed as a tip jar for the archive, not
>    a product. The data is free on the site; the bundle is just the
>    "zip on your disk" workflow.
> 3. **Carbon Ads** — once traffic crosses ~20k pv/mo and Carbon will
>    approve the site. Not active at launch.
> 4. **Print-on-demand posters** — waitlist-gated until first bundle
>    sales validate demand for the physical product.
>
> **Explicit non-goals:** no display ads at any traffic level. No dark
> patterns. No "unlock pro" gating on the palette data itself.
>
> **What I know works (already shipped):**
>
> - SEO infrastructure: 614 indexable pages, sitemap, per-palette
>   JSON-LD, static OG images per plate.
> - Content infrastructure: MDX blog collection, 3 pillar articles
>   already live as HN / Reddit launch ammo.
> - Monetization plumbing: all rails dormant behind `isLive` getters
>   so placeholders never ship real hooks to production.
>
> **What I don't know yet (the reason I'm posting):**
>
> - Will the HN launch land? I'm launching Tuesday.
> - Will the Bookshop affiliate cookie actually convert at anything
>   close to typical rates on a site with this thin a traffic profile?
> - Is $3-$5 PWYW the right framing for a "support the archive"
>   bundle, or should I test a fixed $7 price point instead?
> - How many of the 8 curated collections (Websites, Branding,
>   Minimalist, Autumn, Spring, Indigo, Bold, Heian) actually drive
>   meaningful search traffic?
>
> **Asks:**
>
> 1. If you've launched a free content archive with an optional paid
>    bundle, I'd love to hear what converted and what didn't.
> 2. If you have specific opinions on PWYW vs fixed pricing for a
>    low-ticket digital product that *complements* free data, drop
>    them. I'm genuinely unsure.
> 3. If the archive is useful to you, bookmark it and the next
>    project you start pick a palette from it. That's the best
>    feedback loop.
>
> I'll report back here in 30 days with actual numbers — whatever they
> are.

---

## Follow-up plan for this post

1. **Reply to every substantive comment within an hour.** IH rewards
   engagement; the whole community is built on founders replying to
   each other.
2. **Link back in 30 days with real numbers.** A follow-up post with
   "here's what actually happened" outperforms the launch post on
   every IH metric I've seen.
3. **Do NOT cross-post identical text to other IH groups.** Post once,
   let it settle. If you want visibility elsewhere on IH, write a
   different angle in a different group.

## Anticipated commenter types + pre-written responses

### "How do you make money from $0-revenue pre-launch?" (skeptic)

> Don't. The plan is: ship the archive free → compound traffic through
> SEO + HN + Reddit + this post → the affiliate + bundle rails turn on
> once real visitors are hitting the site. First-€100 is the first
> milestone I'm chasing. After that, iteration on real data.

### "Why not just charge for it?" (pricing-focused)

> The underlying dataset (mattdesl/dictionary-of-colour-combinations)
> is MIT-licensed and free. Charging for something that's on GitHub for
> free is not a credible product. The editorial layer, exports, and
> curation are what I hold — and they compound better with free
> distribution than with a paywall. The bundle is the "I want the
> convenience" tip jar on top.

### "What's the total time invested?" (maker-curious)

> ~3–4 weeks of evenings and weekends. Most of the weight is in the
> editorial and design — the Astro build and the Cloudflare deploy
> are a day each. Real cost is curatorial attention, not code.

### "What would you do differently?" (hindsight)

> Wire analytics on day one, not day ten. I'm retroactively adding GA
> + Clarity now because I realized I had no baseline before the launch
> post. Lesson: measurement is cheap; missing measurement is
> expensive.
