#!/usr/bin/env node
/**
 * IndexNow ping — submit CHANGED URLs to Bing/Yandex/IndexNow after a deploy.
 * Run: node scripts/indexnow-ping.mjs
 * Called from the deploy pipeline (package.json "deploy" script).
 *
 * Spec: https://www.indexnow.org/documentation
 *
 * ── CHANGED-ONLY SUBMISSION (2026-08-28) ─────────────────────────────────────
 * This script previously submitted EVERY sitemap URL on EVERY deploy — 1,469 of
 * them. Bing's own guidance calls that batch abuse, and it wastes the one channel
 * that actually sends this site traffic: colorcombinations is BING-NATIVE
 * (472 Bing clicks vs 6 Google over the last 30 days), and ChatGPT grounds its
 * citations on the Bing index.
 *
 * colorcombinations was missing from the 13-site fleet change-detection rollout
 * (2026-08-25) and has the largest sitemap of any site that was missed.
 *
 * Copy-forked from read-family/readstacks-com/scripts/indexnow.mjs — the canonical
 * fleet implementation — per `rules/cross-project-learning.md` (share the SOURCE,
 * copy-fork the OUTPUT; no shared lib, each site deploys independently).
 *
 * SELECTION, in order of trust:
 *   1. `.changed-urls.json`, if a build step produced one AND it is at least as new
 *      as the sitemap (freshness guard: a stale producer file would silently
 *      SUPPRESS urls that really did change — strictly worse than over-submitting).
 *   2. Otherwise compute it here from content hashes of the built HTML. This site
 *      ships no producer, so path 2 is the live one. A fix that only read
 *      `.changed-urls.json` would have been a silent no-op.
 *
 * FAIL-SAFE DIRECTIONS, chosen deliberately and in opposite directions:
 *   • Unreadable file  ⇒ treated as CHANGED (submit). We could not verify, so we
 *     must not suppress. A broken path mapping over-submits loudly instead of
 *     going quietly dead — which is exactly how the readinglist port stayed
 *     silently dead for two days.
 *   • Failed ping      ⇒ manifest NOT written. Marking urls submitted when no
 *     engine accepted would suppress them forever.
 *   • New page (absent from manifest) ⇒ always submitted, so bulk adds — the case
 *     that actually earns citations — keep working in full.
 *
 * A full submit and a correct submit produce near-identical logs, so reading the
 * diff proves nothing. Verify BEHAVIOURALLY:
 *     INDEXNOW_SEED=1    node scripts/indexnow-ping.mjs   # baseline, sends nothing
 *     INDEXNOW_DRY_RUN=1 node scripts/indexnow-ping.mjs   # must now report 0 changed
 */

import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const HOST = "colorcombinations.org";
// Hardcoded and LIVE-VERIFIED at https://colorcombinations.org/<key>.txt.
// Never rotate casually: Bing CACHES a failed first validation (poisoned-key trap),
// so a new key that isn't serving yet costs more than it buys.
const KEY = "22e964fe93eb40edbc2dd78e733714d7";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;

// Bing accepts immediately once the key file is live; api.indexnow.org imposes a
// site-verification step that can 403 for hours after a first key deployment.
// Ping Bing first, fan out to the rest; per-endpoint failure is non-fatal.
const ENDPOINTS = [
  "https://www.bing.com/indexnow",
  "https://yandex.com/indexnow",
  "https://api.indexnow.org/indexnow",
];

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = resolve(__dirname, "../dist");
const MANIFEST = resolve(__dirname, "../.indexnow-manifest.json");
const CHANGED_FILE = resolve(__dirname, "../.changed-urls.json");
const SITEMAP = resolve(DIST, "sitemap-0.xml"); // Astro: sitemap-index.xml points here

const DRY_RUN = process.env.INDEXNOW_DRY_RUN === "1";
const SEED = process.env.INDEXNOW_SEED === "1";

// Content URLs the sitemap genuinely does NOT carry. They still go through change
// detection like everything else — being "priority" is a reason to notice them, not
// a licence to claim they changed when they didn't.
//
// This list was 9 entries and is now 1. Measured 2026-08-28 against the built
// sitemap and the live site:
//   • `/`, `/browse/`, `/tools/`, `/collections/`, `/colors/` — already in the
//     sitemap. Listing them again was pure duplication.
//   • `/about` and `/shop` (no trailing slash) — NOT canonical: both return
//     **308 → the trailing-slash form**, which is what the sitemap contains. We
//     were announcing two redirect URLs alongside the two real ones, i.e. telling
//     IndexNow that one page was two. Caught by a positive control that expected
//     1 changed URL and got 2 (`/about` and `/about/` resolve to one file).
//   • `/sitemap-index.xml` — a sitemap is not a landing page. It belongs in Bing
//     Webmaster Tools and is already declared in robots.txt; IndexNow is for
//     content URLs whose content changed.
const PRIORITY_URLS = [`https://${HOST}/feed.xml`];

function extractUrlsFromSitemap(xmlPath) {
  if (!existsSync(xmlPath)) return [];
  const xml = readFileSync(xmlPath, "utf-8");
  return [...xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]);
}

function urlToFile(u) {
  try {
    let p = new URL(u).pathname;
    // A path whose last segment already has an extension IS the file —
    // /feed.xml must not become /feed.xml/index.html, or it is permanently
    // unresolvable and therefore re-submitted on every single deploy.
    const last = p.split("/").filter(Boolean).pop() || "";
    if (p.endsWith("/")) p += "index.html";
    else if (!last.includes(".")) p += "/index.html";
    return resolve(DIST, p.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}

// Hash <main> only, never the whole document. Every page inlines the shared
// stylesheet and analytics snippet, so whole-document hashing makes ONE css edit
// mark all 1,469 pages changed and fire a full-sitemap submission — precisely the
// abuse this script exists to stop. Non-HTML (feed.xml, sitemap-index.xml) has no
// <main> and correctly falls back to the whole file.
function hashOf(file) {
  try {
    const raw = readFileSync(file, "utf-8");
    const m = raw.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
    return createHash("sha1").update(m ? m[1] : raw).digest("hex").slice(0, 16);
  } catch {
    return null;
  }
}

function loadManifest() {
  try {
    return JSON.parse(readFileSync(MANIFEST, "utf-8"));
  } catch {
    return {};
  }
}

// Only trust a producer's output when it is at least as new as the sitemap this
// build just wrote; otherwise fall through to hashing, which fails OPEN.
function changedUrlsIsFresh() {
  try {
    if (!existsSync(SITEMAP)) return true; // nothing to compare against
    return statSync(CHANGED_FILE).mtimeMs >= statSync(SITEMAP).mtimeMs;
  } catch {
    return false; // can't prove fresh ⇒ don't trust it
  }
}

function selectUrls(all) {
  if (existsSync(CHANGED_FILE) && changedUrlsIsFresh()) {
    try {
      const j = JSON.parse(readFileSync(CHANGED_FILE, "utf-8"));
      const list = Array.isArray(j) ? j : j.urlList || j.urls || [];
      if (Array.isArray(list)) {
        return {
          urls: list.filter((u) => all.includes(u)),
          how: ".changed-urls.json",
          next: null,
        };
      }
    } catch {
      /* fall through to hashing */
    }
  }

  const prev = loadManifest();
  const next = {};
  const changed = [];
  let unreadable = 0;

  for (const u of all) {
    const f = urlToFile(u);
    const h = f ? hashOf(f) : null;
    if (!h) {
      unreadable++;
      changed.push(u); // could not verify ⇒ submit (fail safe, and loudly)
      continue;
    }
    next[u] = h;
    if (prev[u] !== h) changed.push(u);
  }

  return {
    urls: changed,
    how: `content-hash (${Object.keys(prev).length} known${unreadable ? `, ${unreadable} unreadable` : ""})`,
    next,
  };
}

async function pingIndexNow(urls) {
  const payload = JSON.stringify({ host: HOST, key: KEY, keyLocation: KEY_LOCATION, urlList: urls });
  const results = [];
  for (const endpoint of ENDPOINTS) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      results.push({ endpoint, status: res.status, ok: res.ok, body: (await res.text()).slice(0, 200) });
    } catch (e) {
      results.push({ endpoint, status: 0, ok: false, body: `network error: ${e.message}` });
    }
  }
  return results;
}

// ── main ────────────────────────────────────────────────────────────────────
console.log(`=== IndexNow — ${HOST} ===\n`);

if (!existsSync(resolve(DIST, `${KEY}.txt`))) {
  // Submitting while the key file is absent from the build risks a CACHED
  // validation failure — worse than skipping this deploy.
  console.error(`✘ dist/${KEY}.txt missing — run the build first. Skipping ping.`);
  process.exit(1);
}

const all = [...new Set([...PRIORITY_URLS, ...extractUrlsFromSitemap(SITEMAP)])];
if (all.length === 0) {
  console.error(`✘ No URLs found in ${SITEMAP}.`);
  process.exit(1);
}

const sel = selectUrls(all);
console.log(`Sitemap+priority: ${all.length} URLs · changed: ${sel.urls.length} · via ${sel.how}`);

// SEED writes the baseline manifest WITHOUT submitting. Needed because DRY_RUN
// alone cannot prove the "0 on an unchanged rebuild" property: it exits before the
// manifest is written, so a dry run always sees an empty manifest and correctly
// reports every URL as changed. Without SEED the 0-case is only observable by
// spending real submissions.
if (SEED) {
  writeFileSync(MANIFEST, JSON.stringify(sel.next ?? {}), "utf-8");
  console.log(`\nSEED — wrote manifest with ${Object.keys(sel.next ?? {}).length} entries. Nothing submitted.`);
  process.exit(0);
}

if (DRY_RUN) {
  console.log(`\nDRY RUN — would submit ${sel.urls.length} URL(s). Nothing sent, manifest untouched.`);
  for (const u of sel.urls.slice(0, 10)) console.log(`    ${u}`);
  if (sel.urls.length > 10) console.log(`    … and ${sel.urls.length - 10} more`);
  process.exit(0);
}

if (sel.urls.length === 0) {
  console.log("\nNo content changed this deploy — skipping IndexNow ping.");
  process.exit(0);
}

console.log(`\nPinging ${ENDPOINTS.length} endpoints with ${sel.urls.length} URLs each…\n`);
const results = await pingIndexNow(sel.urls);

let anyAccepted = false;
for (const r of results) {
  const host = new URL(r.endpoint).hostname;
  if (r.ok) {
    console.log(`  ✓ ${host}: HTTP ${r.status} accepted`);
    anyAccepted = true;
  } else if (r.status === 403) {
    console.log(`  ⏳ ${host}: HTTP 403 verification-pending`);
  } else {
    console.log(`  ✘ ${host}: HTTP ${r.status}${r.body ? " — " + r.body.replace(/\n/g, " ") : ""}`);
  }
}

console.log("");
if (anyAccepted) {
  if (sel.next) {
    writeFileSync(MANIFEST, JSON.stringify(sel.next), "utf-8");
    console.log(`Manifest updated (${Object.keys(sel.next).length} URLs) — only changed URLs submit next deploy.`);
  }
  console.log("IndexNow complete — at least one engine accepted.");
} else {
  console.log("IndexNow complete — no engine accepted. Manifest NOT written (so nothing is wrongly suppressed).");
  process.exit(1);
}
