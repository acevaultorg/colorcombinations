#!/usr/bin/env node
/**
 * verify-beacon-coverage — does the click beacon actually COUNT every affiliate
 * link this site emits?
 *
 * WHY THIS EXISTS. Twice now, a change to where affiliate links POINT has
 * silently stopped the beacon from counting them, because the beacon matched on
 * href shape and nobody updated the pattern:
 *
 *   2026-08-11  books  → /go/b/{isbn}   (caught, patched)
 *   2026-08-26  supplies → /go/p/{asin} (NOT caught — dark 7 days; the resulting
 *                metric, {book:107, tool:2}, read as "the art-supply shelf does
 *                not convert" when it meant "is not counted", and that argues
 *                for deleting the one surface built to raise basket size)
 *   2026-08-27  prime  → /go/prime      (never counted at all)
 *
 * A header comment did not stop instance 2 or 3 — the file already carried a
 * paragraph warning about exactly this. So this is a check, not a note.
 *
 * WHAT IT CHECKS
 *  1. STATIC BATTERY — runs the real public/amazon-track.js against known
 *     must-count and must-not-count hrefs, including the gesture cookie (if the
 *     cookie stops minting, every /go/ link degrades to an interstitial hop).
 *  2. BUILD-DERIVED — extracts every distinct affiliate href SHAPE from dist/
 *     and asserts the beacon counts each one. This is the half that cannot go
 *     stale: a fourth link shape fails here on the day it ships, without anyone
 *     remembering to add it to a list.
 *
 * Exit 1 on any failure. Wired into `npm run predeploy`.
 * Skips (exit 0) with a loud note when dist/ is absent, so it is still useful
 * outside a build.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import vm from "node:vm";

const TRACKER = "public/amazon-track.js";
const ORIGIN = "https://colorcombinations.org";
let failures = 0;
const fail = (m) => { failures++; console.error(`  FAIL  ${m}`); };
const pass = (m) => console.log(`  pass  ${m}`);

// ── load the REAL shipped tracker into a sandbox ────────────────────────────
function loadTracker() {
  const src = readFileSync(TRACKER, "utf8");
  const beacons = [];
  let handler = null;
  const ctx = {
    location: { host: "colorcombinations.org", pathname: "/palettes/x/" },
    document: { cookie: "", addEventListener: (t, f) => { if (t === "click") handler = f; } },
    navigator: { sendBeacon: (u) => { beacons.push(u); return true; } },
    window: {},
  };
  ctx.globalThis = ctx;
  vm.createContext(ctx);
  vm.runInContext(src, ctx);
  if (!handler) { console.error("FATAL: tracker registered no click handler"); process.exit(1); }
  // click() returns the shelf label the beacon reported, or null if not counted
  const click = (href, dataset = {}, isTrusted = true) => {
    beacons.length = 0;
    const u = new URL(href, ORIGIN);
    // The production tracker intentionally rejects synthetic events with
    // `isTrusted !== true`. This VM battery models a real browser click, so
    // provide that browser-owned signal explicitly; otherwise the guard tests
    // only its own incomplete fixture and false-reds every money path.
    handler({
      isTrusted,
      target: { closest: () => ({ href: u.href, host: u.host, pathname: u.pathname, dataset }) },
    });
    const b = beacons[0];
    click.lastBeacon = b || null;
    return b ? decodeURIComponent((b.match(/[&?]f=([^&]*)/) || [, ""])[1]) : null;
  };
  return { click, ctx };
}

const { click, ctx } = loadTracker();

// ── 1. static battery ───────────────────────────────────────────────────────
console.log("\nbeacon coverage — static battery");
const battery = [
  ["book",  "/go/b/4861522471?c=book",                          { book: "x" },       "4861522471"],
  ["book",  "/go/b/4861522471",                                 { book: "x" },       "4861522471"],
  ["tool",  "/go/p/B0BJ147GF9?c=art-supplies",                   { tool: "x" },       "B0BJ147GF9"],
  ["tool",  "/go/p/B0973JVF85",                                  { tool: "x" },       "B0973JVF85"],
  ["prime", "/go/prime",                                         { from: "prime-bounty" }, null],
  ["book",  `https://www.amazon.com/dp/B0B87XPWB2?tag=x`,        { book: "x" },       "B0B87XPWB2"],
  ["tool",  "https://amzn.to/short-link",                        { tool: "x" },       null],
  ["tool",  "/go/p/not-an-asin",                                 { tool: "x" },       null],
  [null,    "/palettes/kurenai-kon/",                            {},                  null],
  [null,    "/colors/corinthian-pink/",                          {},                  null],
  [null,    "https://en.wikipedia.org/wiki/Sanzo_Wada",          {},                  null],
];
for (const [want, href, data, wantItem] of battery) {
  const got = click(href, data);
  const ok = want === null ? got === null : got === want;
  const label = `${href.slice(0, 46).padEnd(46)} → ${String(got).padEnd(8)} (want ${want})`;
  ok ? pass(label) : fail(label);
  const beacon = click.lastBeacon ? new URL(click.lastBeacon) : null;
  const items = beacon ? beacon.searchParams.getAll("i") : [];
  const itemOk = wantItem === null
    ? items.length === 0
    : items.length === 1 && items[0] === wantItem;
  itemOk
    ? pass(`  item i=${items[0] || "(omitted)"}`)
    : fail(`  item i=${items.join(",") || "(omitted)"} (want ${wantItem || "omitted"})`);
}

// gesture cookie: a regression here breaks the /go/ gate, not just measurement
click("/go/b/4861522471", { book: "x" });
ctx.document.cookie.startsWith("cc_g=")
  ? pass("gesture cookie cc_g minted on /go/ click")
  : fail("gesture cookie NOT minted — every /go/ link degrades to the interstitial hop");

// The security half of the contract: programmatic clicks must neither count
// nor mint the short-lived /go/ credential.
ctx.document.cookie = "";
const synthetic = click("/go/b/4861522471", { book: "x" }, false);
synthetic === null && ctx.document.cookie === ""
  ? pass("synthetic click rejected (no beacon and no gesture cookie)")
  : fail("synthetic click was trusted — crawler traffic can contaminate Amazon attribution");

// ── 2. build-derived: every shape in dist/ must be counted ──────────────────
console.log("\nbeacon coverage — shapes found in dist/");
if (!existsSync("dist")) {
  console.log("  SKIP  dist/ absent — run after `astro build` for the half that cannot go stale");
} else {
  const html = [];
  (function walk(d) {
    for (const e of readdirSync(d)) {
      const p = join(d, e);
      const st = statSync(p);
      if (st.isDirectory()) walk(p);
      else if (e.endsWith(".html")) html.push(p);
    }
  })("dist");

  // sample rather than read 1,400 files: enough to hit every template family
  const sample = html.length > 400
    ? html.filter((_, i) => i % Math.ceil(html.length / 400) === 0)
    : html;

  const shapes = new Map(); // shape -> {href, dataset, count}
  const AFFIL = /href="((?:\/go\/[^"]*)|(?:https?:\/\/(?:[a-z0-9.-]*\.)?(?:amazon\.[a-z.]+|amzn\.to|amzn\.eu)\/[^"]*))"/gi;
  for (const f of sample) {
    const body = readFileSync(f, "utf8");
    for (const m of body.matchAll(AFFIL)) {
      const href = m[1];
      // normalise to a SHAPE: /go/p/B0X../ -> /go/p/{id}
      const shape = href
        .replace(/\/go\/([bp])\/[A-Z0-9]{10}/i, "/go/$1/{id}")
        .replace(/\/(dp|gp\/product)\/[A-Z0-9]{10}/i, "/$1/{id}")
        .replace(/\?.*$/, "?…");
      // recover the data-* attr that decides the shelf label, from the same tag
      const tag = body.slice(Math.max(0, m.index - 400), m.index + 400);
      const dataset = {};
      if (/data-book=/.test(tag)) dataset.book = "x";
      if (/data-tool=/.test(tag)) dataset.tool = "x";
      const from = tag.match(/data-from="([^"]+)"/);
      if (from) dataset.from = from[1];
      const prev = shapes.get(shape);
      if (prev) prev.count++;
      else shapes.set(shape, { href, dataset, count: 1 });
    }
  }

  if (shapes.size === 0) {
    fail("no affiliate hrefs found in dist/ at all — either the build is broken or this scanner is");
  } else {
    for (const [shape, { href, dataset, count }] of [...shapes].sort()) {
      const got = click(href, dataset);
      const label = `${shape.padEnd(42)} ×${String(count).padEnd(5)} → f=${got}`;
      if (got === null) fail(`${label}  ← UNCOUNTED. Every click on this shape is invisible to Clarity, GA4 and the fleet beacon.`);
      else if (got === "untagged") fail(`${label}  ← counted but UNATTRIBUTED (no data-book/data-tool/data-from on the link).`);
      else pass(label);
    }
  }
}

console.log(
  failures
    ? `\n${failures} failure(s) — a money-path click is going uncounted. Fix public/amazon-track.js before deploying.\n`
    : `\nbeacon coverage OK — every affiliate link shape emitted is counted and attributed.\n`
);
process.exit(failures ? 1 : 0);
