#!/usr/bin/env node
/**
 * generate-wada-palettes.mjs
 *
 * Reads the community-reconstructed Sanzo Wada dataset
 * (scripts/wada-source/colors.json — sourced from mattdesl/dictionary-of-colour-combinations)
 * and emits src/data/wada-palettes.ts containing all 348 historical combinations
 * as Palette objects in our schema.
 *
 * Data structure of colors.json:
 *   [ { name, hex, rgb, cmyk, lab, swatch, combinations: [combo_id, ...] }, ... ]
 *   159 unique colors, 348 combination IDs (1-348), 2-4 colors per combination.
 *
 * Output: src/data/wada-palettes.ts
 *
 * Usage:   npm run generate:wada     (from repo root)
 *
 * Legal framing: the hex values and individual color names are facts and
 * public-domain cultural commons. The specific combinations as numbered plates
 * are reproduced here as a community reconstruction of Wada's 1933 tradition,
 * following the same approach as sanzo-wada.dmbk.io and
 * mattdesl/dictionary-of-colour-combinations.
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const IN = join(ROOT, "scripts/wada-source/colors.json");
const OUT = join(ROOT, "src/data/wada-palettes.ts");

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/** Derive dominant hue from a hex color via HSL analysis. */
function dominantHueFromHex(hex) {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  const d = max - min;

  // Near-grey / near-neutral
  if (d < 0.1 || l < 0.12 || l > 0.92) return "neutral";

  let h;
  if (max === r) h = ((g - b) / d + (g < b ? 6 : 0)) * 60;
  else if (max === g) h = ((b - r) / d + 2) * 60;
  else h = ((r - g) / d + 4) * 60;

  if (h < 15 || h >= 345) return "red";
  if (h < 35) return "orange";
  if (h < 65) return "yellow";
  if (h < 85) {
    // yellow-green cusp — bias to green unless very warm
    return "green";
  }
  if (h < 170) return "green";
  if (h < 250) return "blue";
  if (h < 290) return "purple";
  if (h < 335) return "pink";
  return "red";
}

/** Slugify a string for use as an ID. */
function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 48);
}

/** Pad combination number to 3 digits. */
function pad(n) {
  return String(n).padStart(3, "0");
}

/** Escape a string for TypeScript source output (single-line). */
function ts(s) {
  return JSON.stringify(String(s));
}

/** Derive a mood hint from the dominant hue + lightness of the palette. */
function moodsFromColors(colors) {
  const hues = new Set(colors.map((c) => dominantHueFromHex(c.hex)));
  const moods = [];
  // Compute average lightness
  let totalL = 0;
  for (const c of colors) {
    const r = parseInt(c.hex.slice(1, 3), 16) / 255;
    const g = parseInt(c.hex.slice(3, 5), 16) / 255;
    const b = parseInt(c.hex.slice(5, 7), 16) / 255;
    totalL += (Math.max(r, g, b) + Math.min(r, g, b)) / 2;
  }
  const avgL = totalL / colors.length;

  if (avgL < 0.35) moods.push("solemn");
  else if (avgL > 0.7) moods.push("serene");
  else moods.push("refined");

  if (hues.has("red") || hues.has("orange")) moods.push("warm");
  else if (hues.has("blue") || hues.has("green")) moods.push("cool");

  if (colors.length === 2) moods.push("austere");
  if (colors.length >= 4) moods.push("bold");

  // Dedupe + cap at 3 to keep the type manageable.
  return [...new Set(moods)].slice(0, 3);
}

// -----------------------------------------------------------------------------
// Main
// -----------------------------------------------------------------------------

async function main() {
  const raw = await readFile(IN, "utf8");
  const colors = JSON.parse(raw);
  if (!Array.isArray(colors) || colors.length === 0) {
    throw new Error("Invalid colors.json — expected non-empty array");
  }
  console.log(`[wada] parsed ${colors.length} unique colors`);

  // Group colors by combination ID. Each color has a `combinations` array of
  // the plate numbers it participates in.
  const combinations = new Map();
  for (const color of colors) {
    const combos = color.combinations ?? [];
    for (const id of combos) {
      if (!combinations.has(id)) combinations.set(id, []);
      combinations.get(id).push(color);
    }
  }
  const ids = [...combinations.keys()].sort((a, b) => a - b);
  console.log(`[wada] found ${ids.length} combinations (range ${ids[0]}..${ids[ids.length - 1]})`);

  // Build Palette objects.
  const palettes = [];
  for (const id of ids) {
    const combo = combinations.get(id);
    // Sort colors deterministically by swatch index so the rendered order
    // matches the book's plate order as closely as possible.
    combo.sort((a, b) => (a.swatch ?? 0) - (b.swatch ?? 0));

    // Title: join first two color names with " & " (or all if combo is 2).
    const names = combo.map((c) => c.name);
    const title =
      combo.length <= 2 ? names.join(" & ") : `${names.slice(0, 2).join(" & ")} +${names.length - 2}`;

    // Slug: wada-NNN-firstname-secondname
    const slugTail = slugify(
      combo
        .slice(0, 2)
        .map((c) => c.name)
        .join("-"),
    );
    const slug = `wada-${pad(id)}${slugTail ? `-${slugTail}` : ""}`;

    const dominantHue = dominantHueFromHex(combo[0].hex);
    const moods = moodsFromColors(combo);

    const summary = `Plate ${id} from Sanzo Wada's 1933 Dictionary of Color Combinations — ${names.join(", ")}.`;
    const description = `Combination ${id} of 348 in Wada's six-volume 1933 work. ${
      names.length === 2 ? "A two-colour pairing" : `A ${names.length}-colour grouping`
    } of ${names.join(", ")}, as documented in the original plates.`;

    const paletteColors = combo.map((c) => ({
      hex: c.hex.toLowerCase(),
      // No traditional Japanese name here — Wada's book uses English trade
      // names drawn from the international printing tradition. The shikisai
      // overlays are reserved for the curated editorial picks.
      nameRomaji: c.name,
    }));

    palettes.push({
      slug,
      title,
      summary,
      description,
      era: "showa",
      moods,
      dominantHue,
      colors: paletteColors,
      order: 1000 + id, // push Wada plates after the 30 curated picks (orders 1-30)
      tags: ["wada", "1933", "dictionary", `plate-${id}`],
    });
  }

  console.log(`[wada] built ${palettes.length} palettes`);

  // Emit TypeScript source.
  const header = `/**
 * wada-palettes.ts — auto-generated from scripts/wada-source/colors.json
 *
 * DO NOT EDIT BY HAND. Regenerate with:   npm run generate:wada
 *
 * Source: mattdesl/dictionary-of-colour-combinations (MIT licensed community
 * reconstruction of Sanzo Wada's 1933 "A Dictionary of Color Combinations").
 *
 * Contains all 348 historical combinations from the original six-volume work,
 * as a community-verified reference to the cultural commons surrounding the
 * book. Individual hex values and color names are facts and public domain;
 * the numbered plates are reproduced here following the same approach as
 * sanzo-wada.dmbk.io and the R \`sanzo\` CRAN package.
 *
 * Generated: ${new Date().toISOString()}
 */

import type { Palette } from "@/types/palette";

export const wadaPalettes: Palette[] = [
`;

  const body = palettes
    .map((p) => {
      const colorLines = p.colors
        .map(
          (c) =>
            `      { hex: ${ts(c.hex)}, nameRomaji: ${ts(c.nameRomaji)} },`,
        )
        .join("\n");
      return `  {
    slug: ${ts(p.slug)},
    title: ${ts(p.title)},
    summary: ${ts(p.summary)},
    description: ${ts(p.description)},
    era: "showa",
    moods: [${p.moods.map(ts).join(", ")}],
    dominantHue: ${ts(p.dominantHue)},
    colors: [
${colorLines}
    ],
    order: ${p.order},
    tags: [${p.tags.map(ts).join(", ")}],
  },`;
    })
    .join("\n");

  const footer = `
];
`;

  await writeFile(OUT, header + body + footer);
  console.log(`[wada] wrote ${OUT}`);
  console.log(`[wada] total palettes: ${palettes.length}`);
  console.log(`[wada] done.`);
}

main().catch((err) => {
  console.error("[wada] failed:", err);
  process.exit(1);
});
