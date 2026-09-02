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
