#!/usr/bin/env node
/**
 * Generates src/data/content-dates.json — the honest "when did this content
 * last change" map used for schema.org dateModified.
 *
 * WHY THIS EXISTS. Templates used `const BUILD_DATE = new Date().toISOString()`
 * for dateModified, so every page claimed it had been modified TODAY on every
 * deploy, for a Sanzo Wada dataset fixed in 1933. schema.org defines
 * dateModified as "the date on which the CreativeWork was most recently
 * modified" — the work was not modified, so the claim was false. See
 * .claude/state/TASKS.md E70/E71 and TaskPeace mtpuh2vxd18d63.
 *
 * WHY PRECOMPUTED RATHER THAN `git log` AT BUILD TIME. Running git during the
 * Astro build would need full history, and this repo's CI does not set
 * GIT_DEPTH, so it can run on a shallow clone where `git log -1 -- <file>`
 * returns EMPTY. The natural fallback there is a clock — silently reinstating
 * the exact anti-pattern, in CI only, where nobody looks. Setting GIT_DEPTH: 0
 * would fix that by making every future build fetch full history, forever, to
 * solve a problem that is already solved by committing the answer.
 *
 * WHEN TO RE-RUN: `npm run dates`, after a commit that changes real CONTENT
 * (prose in a page, or a src/data/*.ts file). Do NOT re-run purely because a
 * template was refactored — the date returned is the max over the template
 * AND its data, so a no-op refactor would otherwise advertise a fresh
 * "modified today" that no reader would recognise as a change. Skipping a
 * regeneration leaves the date slightly STALE, which is the conservative
 * failure direction; the old build-clock behaviour failed the other way,
 * claiming freshness daily that never existed.
 *
 * The failure mode is deliberately asymmetric: if this file is not regenerated
 * after a data change, the date is slightly OLD. That is conservative and
 * honest. A build clock is never honest.
 *
 * Run: node scripts/gen-content-dates.mjs   (then commit the JSON)
 */
import { execFileSync } from "node:child_process";
import { writeFileSync, existsSync, readFileSync } from "node:fs";

/** Every source file whose git date can stand in for "content last changed". */
const TRACKED = [
  "src/data/palettes.ts",
  "src/data/colors.ts",
  "src/data/collections.ts",
  "src/data/paintings.ts",
  "src/data/pairings.ts",
  "src/data/wada-palettes.ts",
  "src/data/colorStories.ts",
  "src/pages/palettes/[slug].astro",
  "src/pages/colors/[slug].astro",
  "src/pages/colors/hue/[hue].astro",
  "src/pages/collections/[slug].astro",
  "src/pages/glossary/index.astro",
  "src/pages/about.astro",
  "src/pages/methodology.astro",
  "src/pages/learn/accessible-palettes/index.astro",
  "src/pages/learn/color-data-analysis/index.astro",
  "src/pages/learn/heian-court-color-theory/index.astro",
  "src/pages/learn/japandi-color-theory/index.astro",
  "src/pages/learn/japanese-color-glossary/index.astro",
  "src/pages/learn/japanese-reds/index.astro",
  "src/pages/learn/japanese-blues/index.astro",
  "src/pages/learn/japanese-greens/index.astro",
  "src/pages/learn/japanese-purples/index.astro",
  "src/pages/learn/scandinavian-color-theory/index.astro",
  "src/pages/learn/wabi-sabi-color-theory/index.astro",
  "src/pages/learn/wada-color-psychology/index.astro",
  "src/pages/learn/wada-palettes-by-mood/index.astro",
  "src/pages/learn/wada-palettes-web-design/index.astro",
  "src/pages/learn/sanzo-wada/index.astro",
  "src/pages/data/sanzo-wada-color-analysis.astro",
  "src/pages/data/sanzo-wada-wcag-contrast.astro",
  "src/pages/learn/why-painting-colours-shift/index.astro",
  "src/pages/colors/[hue]/index.astro",
  "src/pages/colors-that-go-with/[color]/[context].astro",
  "src/pages/tools/color-converter/[pair].astro",
  "src/pages/paintings/[slug].astro",
];

// ADDITIVE BY DEFAULT — an existing date is NEVER silently moved.
//
// A prose warning is not a guard, and this one failed in practice: 20 minutes
// after the header note below was written, a run to add 7 new paths also
// re-dated all 18 existing templates to the refactor commit that had just
// introduced contentDate(). That would have reverted a live-verified fix
// (methodology 2026-07-30 -> today) without touching a single line of content.
//
// So refreshing an existing key is now an explicit act:
//   npm run dates                  -> add new paths only, keep known dates
//   npm run dates -- --refresh <p> -> re-date exactly <p> (repeatable)
//   npm run dates -- --refresh-all -> re-date everything (rarely correct)
// Default failure mode is a STALE date, which is conservative. The build clock
// this script replaced failed the other way, claiming freshness daily.
const argv = process.argv.slice(2);
const refreshAll = argv.includes("--refresh-all");
const refreshOne = new Set(
  argv.flatMap((a, i) => (a === "--refresh" && argv[i + 1] ? [argv[i + 1]] : [])),
);
let prev = {};
try {
  prev = JSON.parse(readFileSync("src/data/content-dates.json", "utf8"));
} catch { /* first run */ }

const out = {};
const missing = [];
const kept = [];
for (const p of TRACKED) {
  if (!existsSync(p)) { missing.push(`${p} (not on disk)`); continue; }
  if (prev[p] && !refreshAll && !refreshOne.has(p)) {
    out[p] = prev[p]; kept.push(p); continue;
  }
  const iso = execFileSync("git", ["log", "-1", "--format=%cI", "--", p], {
    encoding: "utf8",
  }).trim();
  // A tracked file with no commit date means a shallow clone or an untracked
  // path. Refuse rather than emit a guess — that refusal is the whole point.
  if (!iso) { missing.push(`${p} (no git date — shallow clone?)`); continue; }
  out[p] = iso;
}

if (missing.length) {
  console.error("REFUSING to write content-dates.json — no honest date for:");
  for (const m of missing) console.error("  - " + m);
  console.error("Run with full history (git fetch --unshallow) or fix the path list.");
  process.exit(1);
}

writeFileSync("src/data/content-dates.json", JSON.stringify(out, null, 2) + "\n");
if (kept.length) console.log(`kept ${kept.length} existing date(s) — pass --refresh <path> to re-date one`);
console.log(`wrote src/data/content-dates.json — ${Object.keys(out).length} entries`);
