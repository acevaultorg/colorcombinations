# QA_LOG.md — colorcombinations.org

Money-Page QA cycles. Append-only. Every number carries its instrument + date
(rules/measured-vs-expected.md).

---

## Cycle 1 — 2026-09-02 (Air lane) — task mtjrrssjcmo3v5

Method: live curl probes + real browser interaction at desktop, and a genuine
375px render. NOTE: the window would not resize below 1189px and the site sends
`x-frame-options: DENY` + `frame-ancestors 'none'` (correct posture), so mobile
was measured by mirroring the page to a local origin with a `<base>` tag and
framing THAT at 375px — `matchMedia('(max-width:640px)')` confirmed active
(viewport 371). Post-fix re-measure used the Astro dev server directly.

### 🔴/🟡 FOUND + FIXED THIS CYCLE (both shipped in one build — builds cost ~41 min)

**P1-a · Buy CTA below the tap floor on the money path.**
`.further-reading__link` overrides global `.btn` padding (0.75rem → 0.4rem), so
"View on Amazon ↗" rendered **36px** at 375px — 8px under the 44px floor — on
/trends/color-trends-2026/, the site's single most-cited page (6,064 citations).
Fix: `min-height:44px` inside `@media (max-width:640px)` (mobile-scoped so the
desktop compact look is untouched).
Verified post-fix: buy button heights `[44]`, **0 of 6 under 44**.

**P1-b · FTC disclosure ~2,000px below the first affiliate link.**
Measured on /trends/: 18 affiliate CTAs spanning y=7,691→9,507, with the sole
in-content disclosure at **y=9,664** — i.e. *below every CTA*;
`disclosureAboveFirstCTA: false`. A mobile reader passes ~2.4 screens of buy
buttons before seeing any disclosure.
⚠️ Controlled against /palettes/kurenai-kon/ — the page whose FTC gap was
deliberately fixed in `3c6708c`. That page ALSO renders its disclosure below the
CTAs (first CTA y=3,106, first disclosure y=3,794). **So "below" is the site's
accepted pattern, not a regression** — the real defect is DISTANCE: ≤690px on
the fixed control vs **1,973px** on /trends/, because /trends/ renders 6 books
(18 CTAs) under one trailing disclosure.
Fix: `FurtherReading.astro` now emits a lead disclosure ABOVE the list when
`books.length >= 5 && variant !== "sidebar"`; the trailing one is kept; both now
read from one `DISCLOSURE_TEXT` const. Short/sidebar lists unchanged.
Verified post-fix: lead y=7,670, first CTA y=7,765 → **95px gap** (was 1,973px).

### ✅ VERIFIED HEALTHY (no action)

| check | result |
|---|---|
| `/browse` filter pills | 378 → "2 colors" → **120 visible = 120 claimed**, 1ms |
| `/browse` search | "crimson" → 2 results; nonsense → 0 + empty state "No palettes match these filters. Clear filters" (not a dead end) |
| `/browse` reset | restores 378, clears the query |
| search instrumentation | `SearchNoResults` + Search events present; Clarity + gtag live |
| horizontal overflow @371px | **none** on /trends/ or /palettes/ |
| CLS | **observed 0**. (Images carry no width/height attrs, but a fixed CSS height reserves the box — a "6 unsized images" finding would have been FALSE; refuted by measurement.) |
| affiliate `rel` | **8/8** links `sponsored nofollow noopener` |
| price display | **0** price strings (Amazon ToS) |
| tag leak in live HTML | **0** `tag=colorcombinations-20` (control: 6 'colorcombinations' matches — grep works) |
| `/go/` gate (SAFE probe: no Sec-Fetch, no token, forged token) | `/go/b/…`, `/go/p/…`, `/go/prime` all 200 interstitial; forged `t=ZZZZZZ` refused; **nothing reached amazon with `tag=`**. No click manufactured. |
| 404 | real 404 (control: a page we DO build → 200) |
| sitemap | `/sitemap.xml` 301 → `/sitemap-index.xml`, which robots.txt declares |

### 🟢 P2 — filed, not fixed (proportionality)

- **Inline product/book TITLE links 18–37px** on /palettes/ (no class, plain `<a>`).
  Each has a sibling 44px button AND an 84px cover image to the same href, so the
  money path has adequate targets. Forcing 44px on inline title text would inflate
  the compact sidebar for little gain.
- **`form-action ... https://forms.example.com` in the production CSP** — a
  placeholder domain left in a live security header.

### Not re-proposed
Scroll-reach / CTA-position analysis — already done, per the task.

## 2026-09-10 — Money-Page QA cycle 2 (task mtva5678zbtbc0, step 1/5 SCAN)

Scanner: `tooling/55-fleet-dashboard/scripts/money-page-scan.mjs` (7/7 positive controls pass). Sample = up to 12 URLs per class (home/hubs/entity/sub/tools) from the live sitemap, plus a 404 probe. Money path = the site's own `/go/` shape replayed from live HTML with a bare curl, no `-L`, no tokens, no nav headers (302→own origin or 200 interstitial = PASS; 302→amazon with `tag=` or 404 = FAIL). Full log: device 1 scratchpad `mps-full.log` / `mps-rerun.json`.

**colorcombinations.org — money-path PASS (302→own origin) · 0 defects on 50 pages (34 flags, all `<img>` without width+height).**

| check | result |
|---|---|
| sitemap URLs / sampled | 1528 / 50 |
| HTTP 200 + title + h1 on every sampled page | PASS |
| secret / token leak in visible text | none |
| `/go/` CTAs carry rel=sponsored nofollow noopener | PASS |
| FTC disclosure phrase adjacent to CTAs | PASS |
| price-like strings near CTAs | none |
| raw tagged Amazon anchor / tag leak in HTML | none |
| canonical + JSON-LD present | PASS |
| 3 internal links per page resolve | PASS |
| pages without any CTA | 13/49 (tools/palette pages) |
| `<img>` without explicit width+height | 34/50 pages flagged — NOT a defect: field CLS is 0 on this site (CrUX); flag kept as informational |

### Findings
- None. No P-rated finding on this cycle.

### BROWSE — phone-first (cycle 2, step 2/5, 2026-09-10)

Harness: Playwright iPhone 15 (WebKit 26.5) + Pixel 7 (Chromium 151) via `~/.claude/bin/ace-mobile-qa` + scripted flows (device 1 scratchpad `mqa-generic.json`, `flows-earners.json`, screenshots in `~/.claude/tools/pw/out/`). Generic pass = home + 3 hubs + entity + sub + tools page per site, both devices: status, horizontal overflow, JS errors, tap targets <40px. Never tapped a `/go/` link.

| check | result |
|---|---|
| generic 7 pages × 2 devices | all 200, no overflow, no JS errors (1 × 404 resource on /books/) |
| header search "blue" | fill OK; dropdown obscured on first EEA visit by the consent wall |
| consent wall (Mediavine TCF CMP, NL geo) | first layer shows only "Accepteer alles" + "Instellingen"; no first-layer reject-all. Observed once (screenshot flow-cc-search-after-search-iPhone15.png); NOT reproducible on demand in headless — CMP appearance is non-deterministic |
| nav tap targets | Browse 53x32, Colors 47x32 (<44px fleet standard) |

**Findings (browse):**
- **P2 (legal/UX, EEA — where the DE/GB revenue is)** — consent wall has no first-layer reject option (accept-all + settings only). Check the Mediavine CMP configuration for a "Reject all" button on layer 1 (NL AP / EDPB guidance: refusing must be as easy as accepting). Card filed.
- **P3** — nav links 32px tall; apply the fleet-mobile-standard `nav a{min-height:44px}` block.

### VERIFY — skeptic pass (cycle 2, step 3/5, 2026-09-10)

- Consent wall without first-layer reject: **UNVERIFIED, restated P3**. Source shows the gate is Mediavine's consentmanager.net CMP (first-party banner is a notice with one "Got it" button, gates nothing). 3 more fresh WebKit sessions: dialog absent 3/3 (1 of 4 overall). Needs a real EEA device/browser read before any dashboard change. Card mtvma5gjw7jdki retitled.

### BANK (cycle 2, step 5/5, 2026-09-10)
Cycle 2 closed: 0 P0/P1 on this site; open items above carry their P-rating and the metric to watch. Fleet rollup line appended to card mtjt4qjomup9pn (📊 MONEY-PAGE QA — fleet rollup). Next cycle: re-run `tooling/55-fleet-dashboard/scripts/money-page-scan.mjs <domain>` and diff against the cycle-2 table above before browsing.

### SCAN (cycle 3, step 1/5, 2026-09-19, manual curl)

| check | result |
|---|---|
| home | HTTP 200, 0 tag leak |
| /go/b/4861522471?c=book bare-curl gate probe | HTTP 302, redirect=https://colorcombinations.org/ (healthy) |
| money page /trends/color-trends-2026/ | HTTP 200, 0 undefined/NaN/[object |

**Findings:** None on this sample.

### SCAN correction (cycle 3, step 1/5, 2026-09-19) — canonical money-page-scan.mjs ran and found a real issue my manual sample missed

Ran `node scripts/money-page-scan.mjs colorcombinations.org` (fleet-dashboard canonical scanner). Sampled 50 URLs from the 1,528-URL sitemap.

| check | result |
|---|---|
| money-path gate | PASS (302 -> own origin) |
| pages with issues | **34 of 49 sampled** |
| pages without any CTA | 13/49 |

**Finding: widespread `<img>` tags missing width+height attributes** across home, hubs (/about/, /collections/, /colors/, /gift-guide/, /glossary/, /material-design/, /shop/), entity pages (/collections/sage/, /colors-that-go-with/transformative-teal/, /colors/english-red/, /colors/murasaki/, /colors/suna-iro/, /paintings/two-sisters-on-the-terrace/, 5x /palettes/wada-*), all 12 sampled /colors-that-go-with/<color>/<use-case>/ sub-pages, and 3 /tools/ + /compare/ pages. Ratios range 1/2 to 11/12 per page.

This is a CLS/CWV risk per fleet-images-standard.md (sized images are a standing requirement). Not evaluated here whether it's a template-wide defect or per-page; needs a build.mjs / template read to confirm scope before fixing (per fix-the-generator-not-generated-output doctrine -- if it's template-wide, one fix in the image-render helper fixes all instances rather than page-by-page).

**Positive control:** the money-path gate and CTA presence checks on the SAME pages passed cleanly, confirming this scanner correctly discriminates pass/fail rather than flagging everything.

### VERIFY (cycle 3, step 3/5, 2026-09-19) — skeptic re-check of the SCAN image-sizing finding

Independent method: read the source (not re-run the scanner). Confirmed root cause and severity honestly restated.

**CONFIRMED, root cause found, correctly scoped:** `src/components/FurtherReading.astro` renders `<img src={coverUrl} ... loading="lazy" decoding="async" data-cover-img onerror=... onload=...>` with NO width/height attributes, and this ONE shared component is imported by **40 of ~45 page templates** (home, all /learn/, /colors/, /colors-that-go-with/, /collections/, /compare/, /trends/, /shop/, /glossary/, /material-design/, /accessibility/, /palettes/, /books/, /paintings/) -- matching the scanner's flagged page list exactly. This is a single-root-cause template defect, not 34 independent page bugs.

**Control confirming the fix is straightforward:** two OTHER image call sites in this codebase (`paintings/index.astro:85`, `paintings/[slug].astro:127`, `books/index.astro:92`, `books/[slug].astro:146`) DO set width (some with a `?? 900` fallback), proving the pattern for a correct fix already exists in-repo -- this is not a missing capability, just one component that was never updated.

**Severity restated honestly:** this is NOT a P0/P1. It does not touch the money path, CTA compliance, or affiliate gate (all separately verified PASS in the SCAN step). It is a CWV/CLS risk (fleet-images-standard.md) affecting book-cover thumbnails specifically -- correctly P2. Not filing as urgent; flagging as a scoped, cheap, one-component fix for a future BUILD leg (add explicit width/height or aspect-ratio CSS to FurtherReading.astro's <img>, verify against the paintings/books pattern already in the codebase).
