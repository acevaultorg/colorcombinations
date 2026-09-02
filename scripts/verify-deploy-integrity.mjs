#!/usr/bin/env node
/**
 * verify-deploy-integrity — the money path must survive every deploy.
 *
 * WHY THIS EXISTS. On 2026-08-27/28 `/go/*` returned 404 in production while the
 * site itself served 200, so every Amazon buy link was dead and nothing noticed.
 * Measured cost: ~10 clicks/day across two windows, on a site that earns
 * $0.06/click. The mechanism is documented in scripts/make-worker.mjs — dist/ is
 * ~92MB, so every deploy takes the chunked direct-upload path, which ships
 * STATIC ASSETS ONLY and cannot compile a Pages Function.
 *
 * make-worker.mjs fixed the CAUSE by merging the four handlers into
 * dist/_worker.js. This checks the RESULT, which is a different thing: a build
 * that skipped make-worker, a dist/ carried over from before it existed, a
 * hand-edit that broke the routing table, or an upload that silently dropped the
 * one file that matters would all still ship a site whose buy links are dead and
 * whose HTML looks perfect.
 *
 * Two phases, because they catch different failures:
 *
 *   --pre   Inspect dist/ BEFORE the upload. Cheapest possible failure: the
 *           deploy aborts and production is never touched.
 *   --post  Probe PRODUCTION after the upload. Catches the case where the
 *           artifact was right and the deploy still went wrong.
 *
 * ⚠️ NEVER GENERATES AN AFFILIATE CLICK. The 302 probes read the Location header
 * with `redirect: "manual"` and never request Amazon. Minting a fresh token and
 * FOLLOWING it would be a real click on the fleet-shared Associates account —
 * that is the thing this file exists to protect, not to spend.
 *
 * ⚠️ EU ROUTING IS CODE-READ, NOT PROBED. Cloudflare overwrites cf-ipcountry, so
 * curl cannot spoof a country and a live probe of the EU path is impossible.
 * This site earns EUR 17.78 (DE) + GBP 4.15 (GB) per 30d, so the EU constants
 * are asserted on the artifact instead. An honest code-read beats a probe that
 * cannot run.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { execFileSync } from "node:child_process";

const ORIGIN = process.env.VERIFY_ORIGIN || "https://colorcombinations.org";
const WORKER = "dist/_worker.js";
const mode = process.argv.includes("--post") ? "post" : "pre";

let fails = 0;
const ok = (m) => console.log(`  pass  ${m}`);
const bad = (m) => { fails++; console.error(`  FAIL  ${m}`); };
const check = (cond, m) => (cond ? ok(m) : bad(m));

// ─────────────────────────────────────────────────────────────────────────────
// PHASE A — the artifact, before it is uploaded
// ─────────────────────────────────────────────────────────────────────────────
async function pre() {
  console.log(`\ndeploy integrity — dist/ (pre-upload)`);

  if (!existsSync(WORKER)) {
    bad(`${WORKER} MISSING. The chunked uploader ships static assets only, so `
      + `deploying now would 404 every /go/* buy link and kill /api/subscribe. `
      + `Run \`node scripts/make-worker.mjs\` (it is part of \`npm run build\`).`);
    return;
  }
  const w = readFileSync(WORKER, "utf8");
  check(w.length > 5000, `${WORKER} present and non-trivial (${w.length} bytes)`);

  // A syntax error here is a total site outage, not a degraded buy path.
  try {
    execFileSync(process.execPath, ["--check", WORKER], { stdio: "pipe" });
    ok("_worker.js parses (node --check)");
  } catch (e) {
    bad(`_worker.js is a SYNTAX ERROR — this would take the whole site down: ${String(e.stderr || e).slice(0, 200)}`);
  }

  // Routing table. Each of these is a live money path or the email capture.
  for (const [needle, what] of [
    ['p.startsWith("/go/b/")', "/go/b/* books route present"],
    ['p.startsWith("/go/p/")', "/go/p/* products route present"],
    ['p === "/go/prime"', "/go/prime bounty route present"],
    ['p === "/api/subscribe"', "/api/subscribe route present (email capture)"],
    ["env.ASSETS.fetch(request)", "static-asset fallthrough present (absent = whole site 404s)"],
  ]) check(w.includes(needle), what);

  // The gesture gate. Losing it does not 404 anything — it silently re-opens the
  // harvest hole that was generating tagged clicks against the shared account.
  check(w.includes("cc_g=") && w.includes("tokenFresh"), "gesture-token gate present (cc_g + tokenFresh)");

  // Tags + EU routing. This site is the fleet's only material non-US earner.
  check(w.includes("colorcombinations-20"), "own Associates tag present (US/global path)");
  check(w.includes("caslonmedia-21"), "EU OneLink tag present — non-US earnings depend on it");
  for (const c of ["AT", "BE", "IE", "PT", "DK", "FI"])
    check(new RegExp(`"${c}"`).test(w), `EU_ROUTED still contains ${c}`);
  // Global-Earning countries must stay OUT: routing them through .de sends them
  // to a German store and credits the wrong tag. See the note in the Function.
  for (const c of ["DE", "NL", "FR", "IT", "ES", "PL", "SE"])
    check(!new RegExp(`"${c}"`).test(w), `${c} correctly ABSENT from EU_ROUTED (Global Earning covers it)`);

  // Page-drop guard. `wrangler pages deploy`/chunked upload replaces the whole
  // directory, so shipping a short build deletes live pages.
  const html = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      statSync(p).isDirectory() ? walk(p) : e.endsWith(".html") && html.push(p);
    }
  })("dist");
  const sm = existsSync("dist/sitemap-0.xml")
    ? (readFileSync("dist/sitemap-0.xml", "utf8").match(/<loc>/g) || []).length
    : 0;
  console.log(`  info  dist: ${html.length} html files, sitemap-0.xml: ${sm} urls`);
  check(html.length > 1500, `built page count sane (${html.length} > 1500) — a short build would DELETE live pages`);
  check(sm > 1200, `sitemap url count sane (${sm} > 1200)`);
}

// ─────────────────────────────────────────────────────────────────────────────
// PHASE B — production, after the upload
// ─────────────────────────────────────────────────────────────────────────────
const head = async (path, headers = {}) => {
  const r = await fetch(`${ORIGIN}${path}`, { redirect: "manual", headers });
  return { status: r.status, location: r.headers.get("location") || "", body: r };
};

async function post() {
  console.log(`\ndeploy integrity — ${ORIGIN} (post-deploy)`);

  // The site itself. If _worker.js shipped without the ASSETS fallthrough this
  // is what breaks, and it is the loudest possible failure.
  const home = await head("/");
  check(home.status === 200, `homepage 200 (got ${home.status}) — worker did not eat the site`);

  // A real ISBN off the live catalogue. 404 here is the Aug 27-28 outage.
  const ISBN = "0300179359"; // Interaction of Color — 43 clicks/30d
  const b = await head(`/go/b/${ISBN}`);
  check(b.status !== 404, `/go/b/${ISBN} is not 404 (got ${b.status}) — THE Aug 27-28 failure`);
  check(b.status === 200, `/go/b/${ISBN} serves the interstitial to a tokenless request (got ${b.status})`);

  // Tokenless must never hand out a tagged URL, and the interstitial must carry
  // nothing harvestable.
  const bodyText = b.status === 200 ? await b.body.text() : "";
  check(
    !/amazon\.[a-z]|tag=|colorcombinations-20|atob\(/i.test(bodyText),
    "interstitial contains zero harvestable strings (no amazon url, no tag, no atob)",
  );

  // Gated 302, read WITHOUT following — no request reaches Amazon, no click.
  const t = Date.now().toString(36);
  const gated = await head(`/go/b/${ISBN}`, { cookie: `cc_g=${t}` });
  check(gated.status === 302, `fresh cookie → 302 (got ${gated.status})`);
  check(
    gated.location === `https://www.amazon.com/dp/${ISBN}?tag=colorcombinations-20`,
    `302 target carries the right tag (got: ${gated.location || "none"})`,
  );

  // Stale token must NOT redirect — this is the harvester gate doing its job.
  const stale = await head(`/go/b/${ISBN}?t=1`);
  check(stale.status === 200, `stale ?t= refused, no 302 (got ${stale.status})`);

  // Checksum-invalid ISBN goes home, never to a guessed Amazon URL.
  const junk = await head("/go/b/1234567890", { cookie: `cc_g=${t}` });
  check(
    junk.status === 302 && !/amazon/i.test(junk.location),
    `checksum-invalid ISBN → home not amazon (got ${junk.status} ${junk.location})`,
  );

  // The other two money paths, dark until 2026-09-02 and easy to forget.
  const p = await head("/go/p/B0BJ147GF9");
  check(p.status !== 404, `/go/p/* is not 404 (got ${p.status})`);
  const prime = await head("/go/prime");
  check(prime.status !== 404, `/go/prime is not 404 (got ${prime.status})`);

  // Email capture — the failure make-worker.mjs exists to prevent.
  const sub = await head("/api/subscribe");
  check(sub.status === 405, `/api/subscribe 405s a bare GET (got ${sub.status}) — function alive, not 404-dead`);

  // The tracker must be served AND still mint the cookie the gate requires.
  const trk = await fetch(`${ORIGIN}/amazon-track.js`);
  const trkBody = trk.ok ? await trk.text() : "";
  check(trk.ok && trkBody.includes("cc_g="), "amazon-track.js served and mints cc_g");
  // ⚠️ This check was WRONG on first write and passed against a tracker it should
  // have failed. The needle was `indexOf('/go/')===0`, which the OLD enumerated
  // version ALSO contained — it used the same test to mint the cookie. A control
  // that both the good and the bad artifact satisfy is not a control. The
  // discriminating property is the isGo DEFINITION: the enumerated version reads
  // `var isGo=/\/go\/b\/...`, the structural one reads `var isGo=false` and then
  // assigns from a host+pathname test. Assert on that, and assert the old regex
  // is gone — otherwise /go/p/* and /go/prime clicks go uncounted in silence.
  check(
    /var isGo\s*=\s*false/.test(trkBody) && /isGo\s*=\s*a\.host\s*===\s*location\.host/.test(trkBody),
    "tracker uses the STRUCTURAL /go/ match (counts /go/p and /go/prime, not just /go/b)",
  );
  check(
    !/var isGo\s*=\s*\/\\\/go\\\/b/.test(trkBody),
    "tracker no longer uses the enumerated /go/b-only regex",
  );
}

// Post-deploy runs seconds after the upload, and CF Pages needs a moment to
// propagate. One failed curl is not an outage (fleet doctrine: retry twice with
// a pause before declaring one) — a false "money path down" alarm is expensive
// in both directions, it wakes an emergency response AND sends someone hunting a
// bug that does not exist. Pre-upload is a pure file read, so it never retries.
if (mode === "post") {
  const ATTEMPTS = 3;
  for (let i = 1; i <= ATTEMPTS; i++) {
    fails = 0;
    await post();
    if (!fails) break;
    if (i < ATTEMPTS) {
      console.log(`\n  ${fails} failure(s) on attempt ${i}/${ATTEMPTS} — waiting 15s for propagation, then retrying.\n`);
      await new Promise((r) => setTimeout(r, 15000));
    }
  }
} else {
  await pre();
}

console.log(
  fails
    ? `\n${fails} failure(s) — the money path is at risk. ${mode === "pre" ? "Deploy ABORTED before touching production." : "PRODUCTION IS SERVING THIS. Investigate now."}\n`
    : `\ndeploy integrity OK (${mode}) — /go/b, /go/p, /go/prime, /api/subscribe and the EU routing all intact.\n`,
);
process.exit(fails ? 1 : 0);
