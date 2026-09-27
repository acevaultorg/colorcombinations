#!/usr/bin/env node
/**
 * test-page-class.mjs — the beacon's page-class predicate must admit every class
 * the built site actually emits, and refuse anything malformed.
 *
 * WHY THIS EXISTS. On 2026-09-27 the `p=` dimension shipped gated on an enumeration,
 * /^hub-(tools|paintings|learn)$/. Measured the next day over dist/: that carried p= on
 * 24 of 43,527 affiliate links (0.055%) — the three hub index pages hold 8 links each,
 * while the real surfaces are c=colors-that-go-with (24,948), c=color (6,732),
 * c=art-supplies (3,612). GA4 `page_class` and the first-party beacon were both dark for
 * 99.945% of clicks. That is the SAME failure this file's isGo test hit three times
 * (2026-08-11, 2026-08-26, 2026-09-02) before it became structural.
 *
 * So the predicate is no longer a list, and this test is what keeps it honest: it reads
 * the regex OUT OF the shipped file (never a copy typed here — a copy tests itself), and
 * censuses dist/ for the classes that really exist. A class added to a template later is
 * covered on the day it ships; if someone narrows the predicate again, this goes red.
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const SRC = "public/amazon-track.js";
const fails = [];
const ok = (c, m) => { if (!c) fails.push(m); };

// 1. Extract the predicate FROM THE ARTIFACT.
const src = readFileSync(SRC, "utf8");
const m = src.match(/if\((\/\^[^/]+\/)\.test\(c\|\|''\)\)pageClass=c;/);
if (!m) {
  console.error(`[X] could not find the page-class predicate in ${SRC} — the shape changed. Update this test deliberately, do not delete it.`);
  process.exit(1);
}
const RX = new RegExp(m[1].slice(1, -1));
console.log(`[+] predicate read from ${SRC}: ${m[1]}`);

// 2. Census the real classes out of the built site.
const OUT = existsSync("dist") ? "dist" : null;
if (!OUT) { console.error("[X] no dist/ — build first, or this test proves nothing."); process.exit(1); }
const seen = new Map();
let files = 0;
(function walk(d) {
  for (const e of readdirSync(d)) {
    const p = join(d, e);
    if (statSync(p).isDirectory()) walk(p);
    else if (e.endsWith(".html")) {
      files++;
      const s = readFileSync(p, "utf8");
      for (const mm of s.matchAll(/href="\/go\/[bp]\/[A-Z0-9]{10}\?c=([^"&]+)/g))
        seen.set(mm[1], (seen.get(mm[1]) || 0) + 1);
    }
  }
})(OUT);
ok(files > 100, `only ${files} html files in dist/ — census is not representative`);
ok(seen.size > 10, `only ${seen.size} distinct c= classes found — the census regex is probably broken`);

const total = [...seen.values()].reduce((a, b) => a + b, 0);
const admitted = [...seen].filter(([c]) => RX.test(c));
const covered = admitted.reduce((a, [, n]) => a + n, 0);
console.log(`[+] census: ${files} html files · ${seen.size} classes · ${total} /go/ links`);
console.log(`[+] admitted: ${admitted.length}/${seen.size} classes · ${covered}/${total} links (${(100 * covered / total).toFixed(3)}%)`);

// 3. POSITIVE: every class the site really emits must be admitted.
for (const [c, n] of [...seen].sort((a, b) => b[1] - a[1]))
  ok(RX.test(c), `class "${c}" (${n} links) is emitted by the build but the predicate DROPS it — those clicks arrive unattributed`);

// 4. NEGATIVE: malformed values must be refused, or the dimension is unbounded/injectable.
for (const bad of ["", "Hub-Tools", "hub tools", "hub/tools", "../../etc/passwd", "a".repeat(41),
                   "hub.tools", "hub_tools", "-leading-dash", "hub%20tools", "hub?x=1", "hub&f=2"])
  ok(!RX.test(bad), `malformed value ${JSON.stringify(bad)} is ADMITTED — the predicate is too loose`);

// 5. The dimension is only useful if it actually distinguishes surfaces.
ok(admitted.length >= 10, `predicate admits only ${admitted.length} classes — too narrow to answer "which surface earns"`);
ok(covered / total > 0.99, `predicate covers only ${(100 * covered / total).toFixed(2)}% of links — most clicks would stay dark`);

if (fails.length) {
  console.error(`\n[X] PAGE CLASS: ${fails.length} failure(s)`);
  for (const f of fails) console.error(`    - ${f}`);
  process.exit(1);
}
console.log(`[✓] page class: ${admitted.length} classes admitted, ${(100 * covered / total).toFixed(3)}% of links covered, all malformed values refused.`);
