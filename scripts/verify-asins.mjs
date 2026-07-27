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
 * WHAT IT DOES: reads every `amazonAsin: "..."` out of src/config/monetization.ts
 * (read-only — this script never edits it), batches them through the Creators
 * API getItems (10 per call, the API max), and reports per ASIN:
 *   OK         → resolves, with its live title so a human can eyeball the match
 *   not-in-api → absent from the API but the product page is NOT 404: it sells
 *                fine and is simply not exposed via the API. NO ACTION.
 *   DEAD       → absent AND the product page 404s. Earns $0; needs replacing.
 * Exit code 1 only on a 404-confirmed DEAD, so it can gate a deploy.
 *
 * ⚠️ TWO-STAGE ON PURPOSE (learned the hard way 2026-07-28): API absence is a
 * SIGNAL, never a verdict. getItems returns `ItemNotAccessible` for many
 * perfectly live products. Reporting on API absence alone produced a false
 * "dead link" call on B0BJ13LVD4 (actually HTTP 200) that had to be retracted,
 * and a nonsense 44%-dead reading on a 1,690-ISBN catalogue. Always confirm
 * with a real HTTP request before calling anything dead.
 *
 * COMPLIANCE: read-only verification. Requests title + detailPageURL only —
 * deliberately NOT price/offers, since price may never be displayed on-site.
 * partnerTag is the site's own colorcombinations-20.
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
      resources: ["itemInfo.title"],
    }),
  }).then((x) => x.json()).catch(() => null);
  // live response key is `itemsResult`, NOT the documented `itemResults` — accept both
  const items = (r && (r.itemsResult || r.itemResults || {}).items) || [];
  const out = {};
  for (const it of items) {
    if (it?.asin) out[it.asin] = it?.itemInfo?.title?.displayValue || "(untitled)";
  }
  return out;
}

// Read-only extraction — this script never writes to monetization.ts.
const src = fs.readFileSync(CONFIG, "utf8");
const asins = [...new Set([...src.matchAll(/amazonAsin:\s*"([A-Z0-9]{10})"/g)].map((m) => m[1]))];
if (asins.length === 0) {
  console.log("verify-asins: no ASINs found in src/config/monetization.ts");
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
  if (a in resolved) { rows.push({ asin: a, state: "live", title: resolved[a] }); continue; }
  const dead = await httpConfirmDead(a);
  rows.push({ asin: a, state: dead ? "dead" : "not-in-api", title: null });
  await sleep(400);
}
const missing = rows.filter((r) => r.state === "dead");
const notInApi = rows.filter((r) => r.state === "not-in-api");

if (JSON_OUT) {
  console.log(JSON.stringify({ checked: rows.length, dead: missing.length, notInApi: notInApi.length, rows }, null, 2));
} else {
  for (const r of rows) {
    if (r.state === "live") console.log(`  OK         ${r.asin}  ${r.title}`);
    else if (r.state === "dead") console.log(`  DEAD       ${r.asin}  ← HTTP 404 confirmed, earns $0`);
    else console.log(`  not-in-api ${r.asin}  (sells fine; just not exposed via the API — no action)`);
  }
  console.log(`\n${rows.length} checked · ${rows.filter((r) => r.state === "live").length} live · ${notInApi.length} not-in-api · ${missing.length} DEAD (404-confirmed)`);
}
process.exit(missing.length ? 1 : 0);
