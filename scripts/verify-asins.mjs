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
 *   OK      → resolves, with its live title so a human can eyeball the match
 *   MISSING → the API returned no item for it: dead/invalid/region-locked
 * Exit code 1 if any ASIN is MISSING, so it can gate a deploy.
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

const rows = asins.map((a) => ({ asin: a, ok: a in resolved, title: resolved[a] || null }));
const missing = rows.filter((r) => !r.ok);

if (JSON_OUT) {
  console.log(JSON.stringify({ checked: rows.length, missing: missing.length, rows }, null, 2));
} else {
  for (const r of rows) {
    console.log(r.ok ? `  OK      ${r.asin}  ${r.title}` : `  MISSING ${r.asin}  ← dead/invalid, earns $0`);
  }
  console.log(`\n${rows.length} checked · ${rows.length - missing.length} live · ${missing.length} MISSING`);
}
process.exit(missing.length ? 1 : 0);
