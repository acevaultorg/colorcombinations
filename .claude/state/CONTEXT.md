# CONTEXT — ColorCombinations

## Session Handoff
<!-- handoff: 2026-04-10 13:46 -->

**Mode:** god
**Objective:** Validate the color-combinations website idea → build V1 (Sanzo Wada heritage angle) → ship to production

### Progress

**Session 2026-04-08 (research + validation)** — complete ✓
- Strategic validation delivered (YES with Wada wedge)
- Realistic revenue model Y1/Y3
- Domain research: 336k candidates, 1,300 whois-checked, 1,077 verified available
- Initial recommendation: sumitome.com + colorcombinations.org bundle

**Session 2026-04-10 (V1 build)** — complete ✓
- All 16 V1 build tasks shipped: scaffold → data → brand → layout → pages → export → SEO → polish → verify → docs → growth state
- 34 static HTML pages (home, about, browse, 404, 30 palette details)
- Clean build: 0 errors, 0 warnings, 0 hints. 796K dist. 757ms.
- Type-safe: TypeScript strict throughout
- Accessible: skip link, focus-visible, prefers-reduced-motion, aria-live
- SEO-ready: per-page JSON-LD (3 schemas on palette pages), OG meta, 33-URL sitemap
- Zero circuit breaker opens, zero mistake loop entries
- Domain recommendation REVISED: colorcombinations.org ALONE is the right pick (not bundle) — see session summary reasoning

### Next Actions (when user resumes)

**Prerequisite: buy `colorcombinations.org` (€6.36/yr at Namecheap/Porkbun)**

After the purchase, one `/acepilot go` session can finish the launch:

1. Connect Vercel to the GitHub repo (import the `acepilot/color-combinations-v1` branch or merge to main first)
2. Add `colorcombinations.org` as custom domain in Vercel
3. Update `astro.config.mjs` `site` field if different from current `https://colorcombinations.org`
4. First `git push origin main` triggers auto-deploy
5. Verify: live URL → 200, all 34 pages resolve, sitemap accessible, no CSP/asset 404s
6. Submit sitemap to Google Search Console + Bing Webmaster
7. Merge `acepilot/color-combinations-v1` → `main` and delete branch after confirming PR

### Human actions pending (from /acepilot tasks)

- `[👤] P0 buy-domain` — colorcombinations.org at Namecheap (€6.36/yr)
- `[👤] P0 deploy-vercel` — connect repo + custom domain (needs buy-domain)
- `[👤] P1 wire-email` — real endpoint for newsletter (ConvertKit or MailerLite)
- `[👤] P2 og-png` — generate 1200x630 PNG for Twitter/FB/LinkedIn social previews
- `[👤] P2 analytics` — set up Plausible or similar

### Momentum

**High.** Build complete. Site works locally. `npm run dev` loads; `npm run build` produces 34 pages in 757ms. Only remaining work is domain purchase + Vercel deploy — both human-gated, can't be automated for safety reasons. Dependency-free from AcePilot side: nothing new to build until launch happens. Post-launch the first priorities are content (newsletter issue 1, Show HN post, Reddit seeding) and instrumentation (Plausible analytics).

### Open questions

- Domain: colorcombinations.org alone (recommended) or bundle with sumitome.com as hedge?
- Email provider: ConvertKit, MailerLite, Buttondown, or Loops?
- Analytics: Plausible (paid, privacy-first) or Umami (self-hosted free)?

### Research archive

Prior session artifacts in `domain-research/`:
- `REPORT.md` / `REPORT-V2.md` — full domain analysis
- `TOP100-AVAILABLE.md` — ranked top 100 merged
- `available-merged-all.txt` — 1,077 unique verified available domains
- `generate*.mjs`, `check*.sh` — the tooling

### Build output verification (last verified 2026-04-10 13:42)

```
34 static HTML pages
796K total dist size
28K CSS (Tailwind v4 purged)
~20K average HTML page size
757ms build time
0 TypeScript errors, 0 warnings, 0 hints
```

### Final recommendation (revised this session)

**Primary: `colorcombinations.org` (€6.36/yr) — buy alone.**

Previous bundle pitch (`sumitome.com` + `colorcombinations.org`) made sense as defensive+exit-value hedge, but for this product the revenue driver is search traffic against exact-match keywords. `colorcombinations.org` is:
- EMD for "color combinations" → highest-intent keyword cluster
- Exact brand match ("The Dictionary of Color Combinations")
- .org fits the museum/reference identity
- €6.36/yr is noise
- No mental overhead of a split primary

Only buy `sumitome.com` later IF the product takes off and you want a shorter marketing alias — re-evaluate in 6 months.
