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
 * ⚠️ NEVER GENERATES AN AFFILIATE CLICK, AND NEVER PRESENTS A CREDENTIAL.
 * Every live probe here is tokenless — no cc_g, no ?t=, no Sec-Fetch headers —
 * and uses `redirect: "manual"` so nothing is ever followed. The POSITIVE path
 * (does a real click still reach Amazon with the right tag) is asserted offline
 * in pre(), against the artifact that ships.
 *
 * ~~Minting a fresh token and reading Location without following it reaches
 * Amazon never, so it is safe.~~ SUPERSEDED 2026-09-04. That is mechanically
 * true and it is not sufficient. Since f5a1dce the gate also requires
 * Sec-Fetch-Mode:navigate + Sec-Fetch-Site:same-origin, so a probe that PASSES
 * must forge the complete human-navigation credential set — the one bypass the
 * gate's own source documents — automatically, on every deploy, one deleted
 * `redirect: "manual"` away from spending real clicks on the fleet-shared
 * Associates account. Do not re-add it.
 * Canonical: ~/.claude/rules/affiliate-link-gate.md
 *            § "Verifying the POSITIVE path — settled 2026-09-04".
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
let warns = 0;
const warn = (m) => { warns++; console.log(`  WARN  ${m}`); };

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
  // WHY THIS IS ASSERTED IN THE SOURCE AND NOT AS SERVED BEHAVIOUR.
  // The routing reads `request.headers.get("cf-ipcountry")`, and Cloudflare
  // OVERWRITES that header from the client IP at the edge. So you cannot probe
  // it with `curl -H cf-ipcountry:AT` — the header is replaced and every
  // request answers for wherever you actually are.
  //
  // Measured 2026-09-04 from NL: no-header, AT, DE, US and GB all returned the
  // identical 302 to www.amazon.com?tag=colorcombinations-20. That is CORRECT
  // (cdn-cgi/trace said loc=NL, and NL is deliberately absent from EU_ROUTED
  // because Global Earning covers it), but five identical .com responses read
  // exactly like "EU routing is dead" and would cost someone an emergency.
  //
  // Verifying the EU_ROUTED branch for real needs egress from an EU country
  // that Global Earning does NOT cover (AT/BE/LU/PT/IE/…). Absent that, the
  // source-level assertion below is the strongest honest check available — it
  // is not a weaker substitute for a behaviour test, it is the only one that
  // can actually run here. Do not "upgrade" it to a header probe.
  for (const c of ["AT", "BE", "IE", "PT", "DK", "FI"])
    check(new RegExp(`"${c}"`).test(w), `EU_ROUTED still contains ${c}`);
  // Global-Earning countries must stay OUT: routing them through .de sends them
  // to a German store and credits the wrong tag. See the note in the Function.
  for (const c of ["DE", "NL", "FR", "IT", "ES", "PL", "SE"])
    check(!new RegExp(`"${c}"`).test(w), `${c} correctly ABSENT from EU_ROUTED (Global Earning covers it)`);

  // ── THE POSITIVE PATH — asserted on the artifact, never probed live ────────
  // Added 2026-09-04, replacing the live mint-and-read probe in post(). See the
  // long note there for why that probe cannot exist on a Sec-Fetch gate. This
  // is the doctrine-prescribed alternative (affiliate-link-gate.md § Design B):
  // assert the shipping artifact, then run its own logic as pure computation.
  // dist/_worker.js is a near-verbatim concatenation of the four Functions —
  // make-worker.mjs only renames the exported handlers — so an assertion here
  // is an assertion about the code that actually serves.

  // The destination template. NEITHER the marketplace host NOR the /dp/ path
  // was asserted anywhere before: the live probe was the only cover, and it
  // exercised only the US branch. This covers both.
  check(
    w.includes("https://${geo.host}/dp/${m[1].toUpperCase()}?tag=${geo.tag}"),
    "book destination template intact (https://<host>/dp/<ISBN>?tag=<tag>)",
  );
  check(
    w.includes('{ host: "www.amazon.com", tag: TAG }'),
    "non-EU branch targets www.amazon.com with this site's own tag",
  );
  check(
    w.includes('{ host: "www.amazon.de", tag: EU_TAG }'),
    "EU branch targets www.amazon.de with the OneLink tag",
  );

  // The gate composition (f5a1dce). Losing any part of this re-opens the
  // harvest hole SILENTLY — nothing 404s, nothing looks wrong, and tagged
  // clicks start accruing against the fleet-shared account again.
  check(/const tokenOk = navOk &&/.test(w), "tokenOk still requires navOk AND a token (no token-only path)");
  check(
    /mode === "navigate"/.test(w) && /site === "same-origin"/.test(w),
    "navOk asserts Sec-Fetch navigate + same-origin",
  );
  check(
    (w.match(/Response\.redirect\(`\$\{url\.origin\}\/`, 302\)/g) || []).length >= 2,
    "tokenless fallback still redirects home (no auto-minting interstitial)",
  );
  check(
    !/<!doctype|text\/html/i.test(w),
    "no HTML interstitial in the worker — the self-minting surface stays removed",
  );

  // Pure computation, against the helpers EXTRACTED FROM THE ARTIFACT — not a
  // re-typed copy, which would only ever test the copy. Extraction failing is a
  // FAIL, never a silent skip: a check that quietly does nothing still prints
  // like a pass, which is worse than having no check at all.
  const mIsbn = w.match(/\nfunction isIsbn10\(s\) \{\n[\s\S]*?\n\}/);
  const mTok = w.match(/const tokenFresh = \(s\) => \{[\s\S]*?\n  \};/);
  if (!mIsbn || !mTok) {
    bad(
      `could not extract the gate helpers from ${WORKER} (isIsbn10:${!!mIsbn} tokenFresh:${!!mTok}) — `
      + `the offline logic check CANNOT RUN, so the positive path is UNVERIFIED. Do not treat this as a pass.`,
    );
  } else {
    const isIsbn10 = eval(`(${mIsbn[0].replace(/^\nfunction isIsbn10/, "function")})`);
    const tokenFresh = eval(`(${mTok[0].replace(/^const tokenFresh = /, "").replace(/;$/, "")})`);
    // Both directions. A validator that only ever returns true is not a check.
    check(
      isIsbn10("0300179359") && isIsbn10("043942089X")
        && !isIsbn10("1234567890") && !isIsbn10("B0BJ147GF9") && !isIsbn10("030017935"),
      "isIsbn10 discriminates (real ISBN + X check digit pass; bad checksum, ASIN, short fail)",
    );
    check(
      tokenFresh(Date.now().toString(36))
        && !tokenFresh(Date.now().toString(16))
        && !tokenFresh((Date.now() - 7200000).toString(36))
        && !tokenFresh("ABC!!!") && !tokenFresh("1") && !tokenFresh(""),
      "tokenFresh discriminates (fresh base36 accepted; hex, 2h-stale, junk, empty rejected)",
    );
  }

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

  // ⚠️ REWRITTEN 2026-09-04 (f5a1dce). Until that commit a tokenless GET got a
  // 200 interstitial, so these probes asserted `status === 200`. The
  // interstitial SELF-MINTED a fresh ?t= on page load, which handed a valid
  // credential to any JS-executing crawler that merely followed a /go/ href —
  // the same defect fixed on fitmylens. It is gone by design: a tokenless GET
  // now 302s to our own origin, the "never a dead end" fallback already used
  // for unrecognised /go/ shapes. These assertions were stale, not broken.
  //
  // Refusal is asserted by DESTINATION (affiliate-link-gate.md: "the real pass
  // criterion is no probe reaches an Amazon URL carrying tag="). The `302` half
  // is NOT redundant with that: a 200 here would mean the self-minting
  // interstitial is back, which is the harvest hole itself, and a
  // destination-only check would sail straight past it.
  const HOME = new URL(ORIGIN).origin + "/";
  const refusedHome = (r) => r.status === 302 && r.location === HOME;
  check(
    refusedHome(b),
    `tokenless /go/b → 302 own origin (got ${b.status} ${b.location || "none"}) — a 200 means the auto-minting interstitial returned`,
  );

  // The refusal must carry nothing harvestable. Scan the Location AND the body
  // TOGETHER: post-f5a1dce the body is empty, so the old body-only scan passed
  // vacuously against any response at all and measured nothing.
  const bodyText = b.status === 200 ? await b.body.text() : "";
  check(
    !/amazon\.[a-z]|tag=|colorcombinations-20|atob\(/i.test(`${b.location} ${bodyText}`),
    "refusal exposes zero harvestable strings (no amazon url, no tag, no atob)",
  );

  // Stale token must be refused the same way.
  const stale = await head(`/go/b/${ISBN}?t=1`);
  check(
    refusedHome(stale),
    `stale ?t= refused to own origin (got ${stale.status} ${stale.location || "none"})`,
  );

  // Unrecognised shape must not 404 and must not leak. NOTE, honestly: this no
  // longer exercises the mod-11 checksum — every tokenless request goes home
  // now, so it would pass with isIsbn10 deleted entirely. The checksum is
  // tested for real in pre(), as pure computation. What this still proves is
  // that the route is alive and leaks nothing, which is the Aug 27-28 class.
  const junk = await head("/go/b/1234567890");
  check(
    junk.status !== 404 && !/amazon/i.test(junk.location),
    `junk ISBN shape → not 404, not amazon (got ${junk.status} ${junk.location || "none"})`,
  );

  // ⚠️ THE POSITIVE PATH IS ASSERTED OFFLINE IN pre(). THAT IS DELIBERATE.
  // A probe here used to mint a fresh cc_g and read Location without following
  // it, reasoning that nothing reaches Amazon so no click is fabricated. That
  // reasoning is mechanically CORRECT, and it is not why the probe is gone.
  //
  // It is gone because f5a1dce added navOk(): tokenOk now requires
  // Sec-Fetch-Mode:navigate + Sec-Fetch-Site:same-origin as well as the token.
  // Repairing the probe therefore means sending the COMPLETE forged
  // human-navigation credential set on every deploy — precisely the bypass the
  // gate's own source names as its known weakness ("does NOT stop a standalone
  // HTTP client that deliberately sends fabricated Sec-Fetch header values").
  // A deploy-time fixture impersonating the attacker the gate was built to
  // describe is wrong independently of whether Amazon counts it, and its safety
  // rests entirely on one `redirect: "manual"` that a future edit can delete
  // silently, on a fleet-shared, irreversible account.
  //
  // Coverage went UP, not down: pre() now asserts the destination TEMPLATE,
  // both marketplace hosts and the gate composition against the shipping
  // artifact, and runs isIsbn10 + tokenFresh as pure computation extracted from
  // it. The host and the /dp/ path had never been asserted anywhere — the live
  // probe was the only cover, and it only ever exercised the US branch.
  // Do NOT "restore" this probe. See affiliate-link-gate.md
  // § "Verifying the POSITIVE path — settled 2026-09-04".

  // The other two money paths, dark until 2026-09-02 and easy to forget.
  const p = await head("/go/p/B0BJ147GF9");
  check(p.status !== 404, `/go/p/* is not 404 (got ${p.status})`);
  const prime = await head("/go/prime");
  check(prime.status !== 404, `/go/prime is not 404 (got ${prime.status})`);

  // Email capture — the failure make-worker.mjs exists to prevent.
  const sub = await head("/api/subscribe");
  check(sub.status === 405, `/api/subscribe 405s a bare GET (got ${sub.status}) — function alive, not 404-dead`);

  // A 405 proves the Function is ALIVE. It proves nothing about whether a
  // signup is STORED. subscribe.js returns ok:true when env.SUBSCRIBERS is
  // missing — deliberately, "so the form never *looks* broken while the binding
  // propagates" — so an unbound namespace is invisible from the outside: the
  // visitor is thanked and the address is discarded. The only instrument that
  // can see the binding is the Pages config API.
  //
  // Cannot-answer is a WARN, not a FAIL, and that is a deliberate compromise:
  // CI's CLOUDFLARE_API_TOKEN is Pages:Edit and I could not test its config-read
  // permission from a laptop before shipping this. A false FAIL here blocks
  // every deploy — including the ones that fix the money path. Tighten to bad()
  // once a CI run is observed printing the pass line — NOTE 2026-09-03: that
  // observation needs a GitLab token with `Job: Read`; the fleet token has
  // insufficient_granular_scope, so CI job logs are unreadable and the CI-side
  // verdict is currently UNKNOWN. Pipeline green only proves the step exited 0,
  // which a WARN also does. Do not assume it passed. A MISSING BINDING is a
  // hard FAIL, because that is the defect this exists to catch.
  // Try EVERY candidate, not just the first. Locally CLOUDFLARE_API_TOKEN is
  // DNS-scoped and CF_PAGES_TOKEN is the one that can read Pages; in CI it is
  // the reverse. Picking "the first one set" reported UNVERIFIED while the
  // answer was sitting in the other variable.
  const cfToks = [process.env.CLOUDFLARE_API_TOKEN, process.env.CF_PAGES_TOKEN].filter(Boolean);
  const cfAcc = process.env.CLOUDFLARE_ACCOUNT_ID || "72bfd26c5f3c935393a25e5c0dea6039";
  const cfPrj = process.env.CF_PAGES_PROJECT || "colorcombinations";
  if (!cfToks.length) {
    warn("SUBSCRIBERS KV binding UNVERIFIED (no CF token in env) — this is NOT a pass");
  } else {
    let answered = null, lastErr = "";
    for (const t of cfToks) {
      try {
        const cfr = await fetch(
          `https://api.cloudflare.com/client/v4/accounts/${cfAcc}/pages/projects/${cfPrj}`,
          { headers: { Authorization: `Bearer ${t}` } },
        );
        const cfb = await cfr.json();
        if (cfb.success) { answered = cfb; break; }
        lastErr = JSON.stringify(cfb.errors || []).slice(0, 140);
      } catch (e) {
        lastErr = e.message;
      }
    }
    if (!answered) {
      warn(`SUBSCRIBERS KV binding UNVERIFIED — no CF token could read the project config (${lastErr})`);
    } else {
      const kv =
        (((answered.result || {}).deployment_configs || {}).production || {}).kv_namespaces || {};
      check(
        Object.prototype.hasOwnProperty.call(kv, "SUBSCRIBERS"),
        "SUBSCRIBERS KV bound in production (unbound = /api/subscribe silently discards every signup)",
      );
    }
  }

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
  // `trk.ok &&` is load-bearing. Measured 2026-09-06 with VERIFY_ORIGIN=example.com:
  // 9 of 13 post checks correctly FAILED against a gateless host, but THIS one
  // passed — because trkBody is "" when the fetch 404s, and !regex.test("") is
  // true. A negative assertion about a file that does not exist is vacuous, and
  // it reported "pass" in a run where the tracker was entirely absent. The
  // sibling check above catches the absence, so nothing shipped broken; this
  // just stops the report itself from lying about which checks were reached.
  check(
    trk.ok && !/var isGo\s*=\s*\/\\\/go\\\/b/.test(trkBody),
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
    : `\ndeploy integrity OK (${mode}) — /go/b, /go/p, /go/prime, /api/subscribe and the EU routing all intact.${warns ? `\n${warns} check(s) could not run — see WARN above. Not a clean pass.` : ""}\n`,
);
process.exit(fails ? 1 : 0);
