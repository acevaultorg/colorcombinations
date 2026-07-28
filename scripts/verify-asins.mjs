#!/usr/bin/env node
/**
 * verify-asins.mjs — check every Amazon ASIN this site links to still resolves
 * to a live, buyable product, using the Amazon Creators API.
 *
 * WHY: a dead or repointed ASIN is silent revenue loss twice over — the click
 * earns $0 AND the buyer lands on a "currently unavailable" / 404 page, which
 * is worse than never linking at all. Books go out of print, editions get
 * replaced, and paint/tool listings churn constantly. Until now these were
 * verified BY HAND one at a time (see commit 3915a38, "verified live on
 * Amazon (B094NTK2RB)"), which doesn't scale past a handful and never
 * re-checks the ones already shipped.
 *
 * WHAT IT DOES: scans src/ for every ASIN the site actually links (config entries,
 * `*_ASIN = "..."` consts and hardcoded /dp/ links)
 * (read-only — this script never edits it), batches them through the Creators
 * API getItems (10 per call, the API max), and reports per ASIN:
 *   OK          → resolves AND is buyable now, with its live title to eyeball
 *   NOT-BUYABLE → resolves, but the buy-box offer can't be bought today
 *                 (backorder / no New offer / no buy-box winner). WARNING only.
 *   not-in-api  → absent from the API but the product page is NOT 404: it sells
 *                 fine and is simply not exposed via the API. NO ACTION.
 *   DEAD        → absent AND the product page 404s. Earns $0; needs replacing.
 * Exit code 1 only on a 404-confirmed DEAD, so it can gate a deploy.
 *
 * WHY NOT-BUYABLE EXISTS (added 2026-07-28): "does this ASIN exist?" and "can
 * someone actually buy it?" are different questions, and only the first was being
 * asked. B094NTK2RB — the Wada two-volume set, shipped in 3915a38 as the primary
 * "you want both" CTA at ~3x commission — resolves fine, so it passed as healthy
 * while its buy-box New offer sat at AVAILABLE_DATE (backorder). A CTA pointing at
 * something unshippable behaves exactly like Wada Vol 1 did: 119 clicks, 0 orders.
 * This is a WARNING, not a build failure — backordered stock usually returns, and
 * failing a deploy over it would be worse than the problem.
 *
 * ⚠️ TWO-STAGE ON PURPOSE (learned the hard way 2026-07-28): API absence is a
 * SIGNAL, never a verdict. getItems returns `ItemNotAccessible` for many
 * perfectly live products. Reporting on API absence alone produced a false
 * "dead link" call on B0BJ13LVD4 (actually HTTP 200) that had to be retracted,
 * and a nonsense 44%-dead reading on a 1,690-ISBN catalogue. Always confirm
 * with a real HTTP request before calling anything dead.
 *
 * COMPLIANCE: read-only verification. Requests title, plus offer AVAILABILITY /
 * CONDITION / buy-box flag — deliberately NOT price. Verified 2026-07-28 that the
 * response carries no `price` key at all when it isn't requested, so the "never
 * display price" rule is preserved by construction: the number is never fetched,
 * never stored, never printed. partnerTag is the site's own colorcombinations-20.
 *
 * USAGE:  node scripts/verify-asins.mjs          (exits 0/1)
 *         node scripts/verify-asins.mjs --json   (machine-readable report)
 * Exits 0 without CREATORS_API_* credentials so it can never break a build.
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONFIG = path.join(ROOT, "src/config/monetization.ts");
const TAG = "colorcombinations-20";
const JSON_OUT = process.argv.includes("--json");

const ID = process.env.CREATORS_API_CREDENTIAL_ID;
const SECRET = process.env.CREATORS_API_SECRET;
if (!ID || !SECRET) {
  console.log("verify-asins: no CREATORS_API_* env — skipping (build unaffected)");
  process.exit(0);
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function token() {
  const r = await fetch("https://api.amazon.com/auth/o2/token", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grant_type: "client_credentials",
      client_id: ID,
      client_secret: SECRET,
      scope: "creatorsapi::default",
    }),
  }).then((x) => x.json()).catch(() => null);
  if (!r?.access_token) {
    console.log("verify-asins: token failed — skipping (build unaffected)");
    process.exit(0);
  }
  return r.access_token;
}

/**
 * Confirm an ASIN really is gone. API absence is only a SIGNAL, never a verdict:
 * getItems returns `ItemNotAccessible` for plenty of products that sell fine but
 * simply aren't exposed through the API (verified 2026-07-28 — B0BJ13LVD4 was
 * reported dead on API absence alone and actually returns HTTP 200). Only a real
 * 404 on the product page counts as dead.
 */
async function httpConfirmDead(asin) {
  try {
    const r = await fetch(`https://www.amazon.com/dp/${asin}`, {
      headers: { "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36" },
      redirect: "follow",
    });
    return r.status === 404;
  } catch {
    return false; // network trouble is not evidence of death
  }
}

async function getItems(tok, asins) {
  const r = await fetch("https://creatorsapi.amazon/catalog/v1/getItems", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${tok}`,
      "Content-Type": "application/json",
      "x-marketplace": "www.amazon.com",
    },
    body: JSON.stringify({
      itemIds: asins,
      itemIdType: "ASIN",
      marketplace: "www.amazon.com",
      partnerTag: TAG,
      // No price resource — see COMPLIANCE above. Availability + condition +
      // buy-box flag are what "can this be bought today?" actually needs.
      resources: [
        "itemInfo.title",
        "offersV2.listings.availability",
        "offersV2.listings.condition",
        "offersV2.listings.isBuyBoxWinner",
      ],
    }),
  }).then((x) => x.json()).catch(() => null);
  // live response key is `itemsResult`, NOT the documented `itemResults` — accept both
  const items = (r && (r.itemsResult || r.itemResults || {}).items) || [];
  const out = {};
  for (const it of items) {
    if (!it?.asin) continue;
    out[it.asin] = {
      title: it?.itemInfo?.title?.displayValue || "(untitled)",
      buy: buyability(it?.offersV2?.listings),
    };
  }
  return out;
}

/**
 * Can a visitor actually buy this today?
 *
 * The buy box is what the CTA lands on, so it is the only offer that matters —
 * a healthy Used offer behind a backordered New one still means the click hits
 * "temporarily out of stock". IN_STOCK_SCARCE ("only N left") counts as buyable:
 * it ships now, and scarcity is not our problem to solve.
 *
 * Unknown/absent offer data returns buyable — same discipline as httpConfirmDead
 * below: missing evidence is not evidence of a problem. This check should never
 * invent a fault it cannot prove.
 */
function buyability(listings) {
  if (!Array.isArray(listings) || listings.length === 0) {
    return { ok: true, note: "no offer data" }; // absence ≠ fault
  }
  const bb = listings.find((l) => l?.isBuyBoxWinner) || listings[0];
  const cond = bb?.condition?.value;
  const avail = bb?.availability?.type;
  if (!avail) return { ok: true, note: "no availability data" };
  if (avail === "IN_STOCK" || avail === "IN_STOCK_SCARCE") return { ok: true, note: avail };
  return { ok: false, note: `buy box is ${cond || "?"} / ${avail}` };
}

/**
 * Read-only extraction across the whole source tree — this script never writes.
 *
 * Scanning only monetization.ts missed the case this check was built for:
 * `src/pages/compare/wada-vol-1-vs-vol-2.astro` declares
 * `const WADA_SET_ASIN = "B094NTK2RB"` — the two-volume set promoted to a primary
 * CTA in 3915a38 — which sat at AVAILABLE_DATE while the check reported all-clear.
 * A verifier that can't see a shipped link is worse than none: it certifies.
 *
 * Three patterns, matching the conventions actually in the tree. Deliberately NOT
 * a bare /[A-Z0-9]{10}/ sweep — that matches hashes, class names and IDs, and a
 * verifier that cries wolf gets ignored (see the 44%-dead incident in the header).
 */
const ASIN_PATTERNS = [
  /amazonAsin:\s*"([A-Z0-9]{10})"/g,           // monetization.ts config entries
  /[A-Z_]*ASIN[A-Z_]*\s*=\s*"([A-Z0-9]{10})"/g, // const WADA_SET_ASIN = "..."
  /\/dp\/([A-Z0-9]{10})/g,                      // hardcoded /dp/ links
];

function collectAsins(dir, found = new Map()) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
      collectAsins(full, found);
    } else if (/\.(ts|tsx|astro|mjs|js|json)$/.test(entry.name)) {
      const text = fs.readFileSync(full, "utf8");
      for (const re of ASIN_PATTERNS) {
        for (const m of text.matchAll(re)) {
          if (!found.has(m[1])) found.set(m[1], path.relative(ROOT, full));
        }
      }
    }
  }
  return found;
}

const found = collectAsins(path.join(ROOT, "src"));
const WHERE = Object.fromEntries(found);
const asins = [...found.keys()];
if (asins.length === 0) {
  console.log("verify-asins: no ASINs found under src/");
  process.exit(0);
}

const tok = await token();
const resolved = {};
for (let i = 0; i < asins.length; i += 10) {
  Object.assign(resolved, await getItems(tok, asins.slice(i, i + 10)));
  if (i + 10 < asins.length) await sleep(1100);
}

// Two-stage: API absence flags a candidate; an HTTP 404 confirms it. Anything
// absent-but-not-404 is reported as NOT-IN-API, which is informational only.
const rows = [];
for (const a of asins) {
  if (a in resolved) {
    const { title, buy } = resolved[a];
    rows.push({
      asin: a,
      state: buy.ok ? "live" : "not-buyable",
      title,
      why: buy.note,
      file: WHERE[a],
    });
    continue;
  }
  const dead = await httpConfirmDead(a);
  rows.push({ asin: a, state: dead ? "dead" : "not-in-api", title: null, why: null, file: WHERE[a] });
  await sleep(400);
}
const missing = rows.filter((r) => r.state === "dead");
const notInApi = rows.filter((r) => r.state === "not-in-api");
const notBuyable = rows.filter((r) => r.state === "not-buyable");

if (JSON_OUT) {
  console.log(JSON.stringify({
    checked: rows.length,
    dead: missing.length,
    notBuyable: notBuyable.length,
    notInApi: notInApi.length,
    rows,
  }, null, 2));
} else {
  for (const r of rows) {
    if (r.state === "live") console.log(`  OK          ${r.asin}  ${r.title}`);
    else if (r.state === "not-buyable") console.log(`  NOT-BUYABLE ${r.asin}  ← ${r.why} · ${r.title}\n                          ${WHERE[r.asin]}`);
    else if (r.state === "dead") console.log(`  DEAD        ${r.asin}  ← HTTP 404 confirmed, earns $0\n                          ${WHERE[r.asin]}`);
    else console.log(`  not-in-api  ${r.asin}  (sells fine; just not exposed via the API — no action)`);
  }
  console.log(`\n${rows.length} checked · ${rows.filter((r) => r.state === "live").length} live · ${notBuyable.length} not-buyable · ${notInApi.length} not-in-api · ${missing.length} DEAD (404-confirmed)`);
  if (notBuyable.length) {
    console.log(`\n⚠ ${notBuyable.length} link(s) resolve but cannot be bought today. Not a build failure —`);
    console.log(`  backordered stock usually returns. But a CTA pointing at an unshippable`);
    console.log(`  listing converts like Wada Vol 1 did (119 clicks, 0 orders), so demote it`);
    console.log(`  from any primary CTA until it is back IN_STOCK.`);
  }
}
// Exit 1 ONLY on 404-confirmed dead. not-buyable is deliberately non-fatal:
// stock comes back, and blocking a deploy over it would cost more than it saves.
process.exit(missing.length ? 1 : 0);
