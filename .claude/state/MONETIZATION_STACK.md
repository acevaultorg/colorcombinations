# MONETIZATION_STACK.md — colorcombinations.org

**Schema:** v19.5 (2026-04-21 canonical 9-layer revenue stack)
**Canonical reference:** `~/.claude/rules/revenue-maximizer.md`
**Seeded:** 2026-04-24 by `/acepilot auto` per cluster strategy
**Append-on-change only** (except Current Stack status cell updates).

## Current Stack

| Layer | Name | Status | Activated | Projected $/mo | Actual $/mo | Notes |
|---|---|---|---|---:|---:|---|
| 1 | AdSense | unknown_audit_needed | — | $100-300 | - | Operator must audit: approval status, RPM tier, ads.txt. RPM tier: Design $8-15. |
| 2 | Cloudflare Pay-Per-Crawl | blocked_needs_cf_pro | — | $30-120 | - | **PAYMENT GATE Week 1 Mon** — CF Pro upgrade €20/mo required, then toggle PPC per zone. Operator action. |
| 3 | llms.txt + schema + AI allowlist | active | — | — (indirect) | — | Check if v19.4 autowired. Seed if missing per `rules/bot-harvest.md`. |
| 4 | Perplexity Publishers Program | pending_contact | — | $10-30 | - | Week 1 Tue: email `publishers@perplexity.ai` per `~/.claude/acepilot-19.7/templates/perplexity-publishers-email.md`. |
| 5 | Ezoic Access Now | not_started | — | $50-150 | - | Post-AdSense parallel. +30-60% RPM uplift. Week 1 Tue operator signup. |
| 6 | Affiliate (Impact.com, NOT Amazon per I-38) | not_started | — | $50-200 | - | Week 1 Tue: Impact.com signup + design/color-tool relevant program applications. |
| 7 | Mediavine Journey | active | 2026-09-04 | $12-19 RPM × sessions | $0.30 MTD Sep 1-8 | Approved and live. Preserve Amazon-intent exclusions and freeze provider settings through 2026-09-25; see correction below. |
| 8 | TollBit | pending_application | — | $0.005/scrape × bot volume | - | Week 1 Tue: Tier-1 application. Requires CF Snippet deploy for onboarding verification. |
| 9 | ProRata.ai Gist Answers | deferred_month_6 | — | $10 CPM floor | - | Defer per `rules/revenue-maximizer.md` Part 3 (Month 6+). |

## Y1 revenue projection (operator-sourced 2026-04-24)

**Midpoint Y1: €11k** (low €6.6k / high €16.5k)
- Month 1: €300 · Month 3: €1.2k · Month 6: €1.8k · Month 7-12 avg: €1.5k/mo
- Primary driver: AdSense + Ezoic on Design vertical RPM once traffic scales. Mediavine promotion unlocks 2-5× RPM at 1k sessions crossing.

## Layer Activations (append-only)

| timestamp | layer | event | details |
|---|---|---|---|
| 2026-04-24 | — | stub_seeded | MONETIZATION_STACK.md seeded by /acepilot auto per cluster strategy 2026-04-24 |

## Swap History (atomic, I-37 enforced)

| timestamp | removed_layers | added_layer | reason |
|---|---|---|---|
| — | — | — | No swaps yet. First swap triggers at 1k sessions/mo → Mediavine Journey promotion per I-37. |

## Pending Operator Clarity Cards

See `TASKS.md ## Monday Revenue Activation` for full Clarity Cards per I-27.

## Kill criteria (per cluster strategy 2026-04-24)

- Mediavine rejects AND AdSense RPM <€2 by Month 3 → revert CF Pro to Free, halt monetization investment, defer Y2.

## Corrections

(timestamp-anchored per I-39 append-only pattern)

None yet.

### Layer 3 Activation — 2026-04-24 16:25 UTC
Robots.txt AI crawler allowlist deployed LIVE per v19.4 bot-harvest. 10 crawlers explicitly allowed (GPTBot, ClaudeBot, Claude-Web, PerplexityBot, Googlebot-Extended, Applebot-Extended, CCBot, Amazonbot, Bytespider, Meta-ExternalAgent). Verified via curl. Workaround path used (see rules/vercel-acevaultorg-deploy-workaround.md).

### /gift-guide ship — 2026-08-27 (this file is stale above this line — the site's real revenue model as of mid-2026 is Amazon Associates, not the April AdSense/Ezoic plan described above; not corrected here, out of scope for this entry)
Shipped `/gift-guide` (BountyPilot lever 5, task mry1jdydl0xfb9), gated behind
task mrudi4pywoizow's shelf verdict which resolved 2026-08-24 positive: 306
Amazon-counted clicks -> 35 orders -> $16.18 commissions/30d, confirming this
site IS a converting Amazon asset, not the "clicks but zero orders" dead-end
scenario. Page bundles the 3 proven-cluster ASINs (Wada Vol 1 4861522471,
Wada Vol 2 4861527724, Interaction of Color 0300179359 — ~140/170 site-wide
affiliate clicks per the compare page's own header) with the ART_SUPPLIES
studio shelf, trust-first buying-guide shape, zero prices, rel=sponsored on
every link, FTC disclosure inherited from FurtherReading + PaintThisPalette.
No new revenue layer — this is an offer-quality/conversion-surface ship on
the existing Amazon Associates layer, not a new monetization layer.
Commit c39682b, deploy https://86a22f18.colorcombinations.pages.dev, live
https://colorcombinations.org/gift-guide/. Both /go/b/ and /go/p/ link
shapes verified live via byte-compare + pure-computation tokenFresh check
(no real click manufactured on the shared Associates account).

### Mediavine Journey activation and Amazon-intent protection — 2026-09-10

Supersedes the stale `pending_application` status above. The signed-in portal
confirms Journey is active (approved 2026-09-04); reported revenue was $0.30
for 2026-09-01 through 2026-09-08, with 2026-09-09 still processing when
checked. Decision: keep provider settings unchanged through the 2026-09-25
learning window: PageSpeed on, density 62.5 (Optimal), Slidebar on,
Event-Driven off, Universal Player Plus off.

The provider wrapper remains sitewide on editorial pages. Whole-page ads are
blocked in rendered HTML on `/books*`, `/shop*`, `/gift-guide*`, `/about`,
`/compare/wada-vol-1-vs-vol-2`, legal/contact/404/utility pages, and future
BaseLayout `noIndex` pages using the portal-generated
`#ad-management-config-settings[data-blocklist-all="1"]` marker. This is a
conversion-protection guardrail: `/shop*`, `/gift-guide*`, and `/books*`
accounted for 92 of 265 measured AmazonClick events (34.7%) on only about 2.26%
of pageviews. The build and CI scan rendered output so future route changes
cannot silently remove the exclusions. Standalone noindex embed documents do
not load the Journey wrapper and therefore do not need the provider marker.
