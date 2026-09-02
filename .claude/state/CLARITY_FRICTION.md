# CLARITY_FRICTION.md — colorcombinations.org

**Measured 2026-09-02** · Clarity Data-Export API, `project-live-insights?numOfDays=3` · **3-day window**.
Source: fleet worker `/clarity-pages?site=colorcombinations.org` (all 9 metrics joined in ONE call — the friction
metrics ride along with Traffic in the same response, so this costs no extra quota against the
10-calls/project/day cap).

- URLs returned: **333** · total sessions (3d): **1249**
- URLs clearing the 5-session floor: **36**

## Top friction URLs (ranked by friction% x traffic)

`est` = estimated frustrated sessions = sessions x (dead+rage+quickback+errorclick)%.
It is an UPPER BOUND — one session can trip two frictions and be counted twice.

| # | URL | sess | dead% | rage% | quickback% | err% | scroll% | active s | est | likely cause |
|--:|---|--:|--:|--:|--:|--:|--:|--:|--:|---|
| 1 | `/browse/` | 230 | 3.0 | 0.0 | 5.7 | 0.0 | 27.3 | 58 | 20.0 | quickback — page did not match the click intent |
| 2 | `/` | 150 | 2.7 | 0.0 | 9.3 | 0.0 | 27.0 | 26 | 18.0 | quickback — page did not match the click intent |
| 3 | `/colors/` | 74 | 1.4 | 0.0 | 17.6 | 0.0 | 36.5 | 20 | 14.0 | quickback — page did not match the click intent |
| 4 | `/?utm_source=chatgpt.com` | 80 | 0.0 | 0.0 | 13.8 | 0.0 | 28.9 | 30 | 11.0 | quickback — page did not match the click intent |
| 5 | `/collections/` | 49 | 0.0 | 0.0 | 20.4 | 0.0 | 32.6 | 43 | 10.0 | quickback — page did not match the click intent |
| 6 | `/paintings/` | 9 | 0.0 | 0.0 | 44.4 | 0.0 | 50.0 | 38 | 4.0 | quickback — page did not match the click intent |
| 7 | `/collections/japanese/` | 26 | 0.0 | 0.0 | 15.4 | 0.0 | 52.6 | 57 | 4.0 | quickback — page did not match the click intent |
| 8 | `/palettes/kariyasu-rikyu/` | 12 | 16.7 | 0.0 | 0.0 | 0.0 | 14.1 | 18 | 2.0 | dead-click — something looks clickable and is not |
| 9 | `/trends/color-trends-2026/` | 20 | 5.0 | 0.0 | 5.0 | 0.0 | 34.8 | 20 | 2.0 | quickback — page did not match the click intent |
| 10 | `/palettes/kaki-kogecha/` | 12 | 8.3 | 0.0 | 8.3 | 0.0 | 12.6 | 308 | 2.0 | quickback — page did not match the click intent |

## Top-3 cause classes

- **`/browse/`** (230 sess) — quickback — page did not match the click intent
- **`/`** (150 sess) — quickback — page did not match the click intent
- **`/colors/`** (74 sess) — quickback — page did not match the click intent

## Caveats that bind any action taken from this file

- 3-day window. A page at 5-10 sessions has a +/-1-session swing of 10-20 percentage points.
- Clarity samples; it is not a census. Treat ordering as signal, exact percentages as approximate.
- Rage-click reads 0.0 across the whole fleet in this window. That is plausible for static
  content sites, but treat a 0 as 'not observed in 3 days', never as 'cannot happen'.

---

## DIAGNOSIS — ranked friction list (2026-09-02, Clarity Friction Pilot c1)

Channel breakdown pulled the same day via `dimension=URL&dimension2=Source` (one call, cross-tabbed):

```
source                  sess    qb%   scroll%   active_s
colorcombinations.org    766   11.0     31.3       44      (internal navigation)
(none) / direct          252    6.7     23.2       36
chatgpt.com              110   11.8     29.3       25   <-- #1 external referrer
bing                      42   11.9     38.8       42
duckduckgo.com            41    2.4     33.0       35
www.ecosia.org            24    8.3     23.2       34
yahoo                      7   14.3     53.1       50
yandex                     4   25.0     39.4       14
```

### 1 · 🟡 AI-referred visitors are the #1 external channel — ~~AND the least engaged~~ **(engagement claim CORRECTED 2026-09-02, see below)**

- **Page:** `/` and `/browse/` (where chatgpt.com traffic lands; `/?utm_source=chatgpt.com` alone is 80 sessions).
- **Evidence:** Clarity 2026-09-02, 3d. chatgpt.com = **110 sessions**, more than Bing (42) and roughly equal to *every other search engine combined* (118). Its **25s active time is the lowest of any channel** — 43% below internal navigation (44s) and Bing (42s), at a similar 29.3% scroll.
- **Read:** these visitors arrive with an answer already in hand from the assistant, glance, and go. That is the citation→click gap `ai-citation-channel.md` names as the fleet's biggest unexploited lever, visible here in on-site behaviour for the first time.
- **Fix:** give an AI-referred visitor something the assistant's answer cannot contain — the interactive palette/browse surface, adjacent combinations, the copy-hex affordance — above the first screen on the landing page. Do **not** start by rewriting copy.
- **Metric it should move:** `active_s` for source=chatgpt.com (25s → 40s+), then affiliate-click rate on that segment.
- **Effort:** M. Needs the heatmap first to see where those 110 sessions actually click.

> **⚠️ CORRECTION 2026-09-02 — the "least engaged" half of this item does not hold.**
> The 25s-vs-44s figure is real but it is one metric (active seconds) on a 3-day Clarity window.
> On 30-day GA4 (`ga4-sources.csv`, the same channel), AI-referred sessions here read **2.98
> pageviews/session against organic's 2.95 — parity**, and fleet-wide there is no pattern at all:
> 3 sites where AI engages MORE (readstacks 2.13×, holdlens 1.33×, conversionbench 1.25×), 2 where
> it engages less, 4 at parity. **There is no "AI visitors bounce" law**, and this item should not be
> read as one.
>
> What survives, and is bigger than the original claim: this site takes **903 of the fleet's 1,360
> AI-referred sessions — 66% of all of it**, at normal engagement. It is not a leak to plug; it is
> the fleet's one working citation→visit channel, and nobody has characterised why it works.
> See card `mtje4qlqwqbj76`.
>
> The two readings are compatible (same pages, less time each), but the strong framing was not
> earned. Fix at the source rather than acting on the stale version.

### 2 · 🟡 The top entry page shows a quarter of itself

- **Page:** `/browse/` — 230 sessions, the site's busiest, **27.3% scroll** at 58s active. Homepage `/` 27.0% at 26s.
- **Evidence:** Clarity 2026-09-02, 3d.
- **Read:** 58s of engagement at 27% scroll means people are using the top of the page, not abandoning. But anything below ~30% of page height is not seen by the median visitor.
- **Fix:** audit what sits below that line on `/browse/`; if a monetized or routing element is there, raise it. Verify at mobile-375 first.
- **Metric:** scroll-to-CTA; affiliate-click rate on `/browse/`.
- **Effort:** S.

### 3 · ~~🟢 `/colors/` and `/collections/` quickback above their own baseline~~ **REFUTED 2026-09-02 — these are WORKING indexes, do not "fix" them**

I flagged 17.6% and 20.4% quickback against a site baseline nearer 6–11%. That reading was wrong,
and the same control that overturned it on readinglist overturns it here.

**Quickback cannot tell "sampling an index" apart from "leaving".** Pageviews-per-session for
sessions that LANDED on the page can: you cannot accumulate 4 pageviews by landing and bouncing.
GA4 holds it, over 30 days, at zero Clarity quota.

`/ga4-probe`, property 294106772, `dims=landingPagePlusQueryString`, `mets=sessions,screenPageViews`, 30d:

```
page             sessions    pv    pv/session    rank of 77 pages >=8 sess
/colors/              119    520      4.37            3rd
/collections/          60    262      4.37            4th
/                    2346   7102      3.03           11th
/browse/              669   1318      1.97           25th
median of the 77 ..............  1.45
```

`/colors/` and `/collections/` are the **3rd and 4th most-sampled landing pages on the site** — 3×
the median. Visitors land, open a palette, come back, open another. That is the index doing its job;
Clarity scores it as friction only because it cannot see that the next action is another row on the
same list. Same signature computer 2 measured on readinglist `/banned-books` (7.00 pv/session).

**Positive control passes** — the method produces low numbers too: `/colors/shu/` and
`/learn/heian-court-color-theory/` both read 1.00 at the bottom of the same ranking. So the flagged
pages topping it is real, not uniform inflation.

**Tenant caveat checked and closed:** the probe warns the property may hold several hostnames. It
holds 3; colorcombinations.org is 6,766 of 6,772 sessions (**99.9%**). The rows are this host.

**Note `/browse/` reads 1.97 — mid, 25th of 77.** It does *not* carry the sampling signature, so its
27.3% scroll depth remains a live question (item 2 above stands). Low scroll and low sampling on the
site's busiest page are a different shape from the two index pages here.

### ❓ Google is absent from the referrer list — do not act on this yet

No `google` row appears at all, while duckduckgo (41) and ecosia (24) do. That is either a Clarity attribution artifact (Google traffic may be landing in the 252 `(none)` rows) or a genuine ranking gap. **I have not established which**, and the two have opposite implications. Resolve against Search Console before anyone treats it as a finding.
