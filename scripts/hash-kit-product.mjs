#!/usr/bin/env node
/**
 * hash-kit-product.mjs — point every page at a HASHED copy of the Kit product script.
 *
 * WHY (2026-10-24, reported by the cabinpets lane, re-measured live): three components
 * (AmazonPick, FurtherReading, PaintThisPalette) load `/kit-product.js` by its stable name,
 * and the zone's 4 h browser TTL (`cache-control: public, max-age=14400` on the live file)
 * overrides _headers. So after a deploy a returning visitor can run the OLD price/photo
 * script against NEW HTML for up to 4 h. That is how a shelf change like the 10-22 price
 * removal (0cd58a3) can keep showing prices to some readers after it ships.
 *
 * Same fix the Kit uses for kit-search since 1.8.4 (kit/search-inject.mjs): write
 * `kit-product.<sha10>.js` next to the stable file and rewrite the references in the
 * built HTML. Done here, after `astro build`, instead of in the three components, so the
 * name follows the file's contents automatically and a future component cannot drift.
 * The stable /kit-product.js stays, for pages already cached with the old reference.
 * No _headers entry: a content-hashed name is safe under any TTL. (Do not route this
 * through kit's stableHeaders(): its /kit-[a-z.-]+ regex has no digits, so a second call
 * drops the hashed kit-search entry from the block.)
 *
 * Usage: node scripts/hash-kit-product.mjs [dist]
 */
import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const out = path.resolve(process.argv[2] || "dist");
const stable = path.join(out, "kit-product.js");
const REF = 'src="/kit-product.js"';

function* htmlFiles(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) yield* htmlFiles(p);
    else if (e.name.endsWith(".html")) yield p;
  }
}

const files = [...htmlFiles(out)].filter((f) => fs.readFileSync(f, "utf8").includes(REF));
if (!files.length) {
  console.log("hash-kit-product: no page references /kit-product.js — nothing to do");
  process.exit(0);
}
if (!fs.existsSync(stable)) {
  console.error(`hash-kit-product: ${files.length} pages reference /kit-product.js but ${stable} is missing`);
  process.exit(1);
}

const js = fs.readFileSync(stable);
const v = crypto.createHash("sha256").update(js).digest("hex").slice(0, 10);
const name = `kit-product.${v}.js`;
fs.writeFileSync(path.join(out, name), js);

let refs = 0;
for (const f of files) {
  const h = fs.readFileSync(f, "utf8");
  const n = h.split(REF).length - 1;
  refs += n;
  fs.writeFileSync(f, h.split(REF).join(`src="/${name}"`));
}
console.log(`hash-kit-product: /${name} · ${refs} references on ${files.length} pages rewritten`);
