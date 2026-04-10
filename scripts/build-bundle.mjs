#!/usr/bin/env node
/**
 * build-bundle.mjs — generate the digital product bundle sold on Gumroad.
 *
 * Input:  src/data/palettes.ts
 * Output: bundle-source/wada-bundle-v1/  (individual files)
 *         bundle-source/wada-bundle-v1.zip (final product upload)
 *
 * The zip is the file the operator uploads to Gumroad as a $9 product.
 * Regenerate any time the palette data changes:
 *   npm run bundle
 *
 * This script is pure Node, no dependencies. It only uses `node:fs`, `node:path`,
 * `node:url`, and shells out to the system `zip` command for the final archive.
 */

import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, resolve } from "node:path";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = resolve(__dirname, "..");
const BUNDLE_NAME = "wada-bundle-v1";
const OUT_DIR = join(ROOT, "bundle-source", BUNDLE_NAME);

// -----------------------------------------------------------------------------
// 1. Read and parse palettes.ts (tiny bespoke parser — no TS import needed)
// -----------------------------------------------------------------------------

async function loadPalettes() {
  const src = await readFile(
    join(ROOT, "src/data/palettes.ts"),
    "utf8",
  );

  // The file exports `export const palettes: Palette[] = [ ... ]`. Extract the
  // array literal and eval it as JSON-ish. We use a tolerant approach:
  //  - Strip the TypeScript type annotation
  //  - Wrap the array in parentheses
  //  - Use `new Function` to evaluate (Node's JSON.parse is too strict for JS)
  const match = src.match(
    /export const palettes:\s*Palette\[\]\s*=\s*(\[[\s\S]*?\n\]);/,
  );
  if (!match) {
    throw new Error("Could not find palettes array in src/data/palettes.ts");
  }
  const arrayLiteral = match[1];
  // eslint-disable-next-line no-new-func
  const palettes = new Function(`return (${arrayLiteral});`)();
  if (!Array.isArray(palettes)) {
    throw new Error("Parsed palettes is not an array");
  }
  return palettes;
}

// -----------------------------------------------------------------------------
// 2. Format generators
// -----------------------------------------------------------------------------

/** kebab-case a romaji name for use as a token key. */
const toKey = (name) =>
  (name ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** W3C Design Tokens Community Group format — drag into Figma Tokens plugin. */
function figmaTokens(palettes) {
  const tokens = {};
  for (const p of palettes) {
    const slot = {
      $description: `${p.title}${p.titleJa ? ` (${p.titleJa})` : ""} — ${p.summary}`,
    };
    p.colors.forEach((c, i) => {
      const key = toKey(c.nameRomaji) || `color-${i + 1}`;
      slot[key] = {
        $type: "color",
        $value: c.hex,
        $description: [c.nameJa, c.nameRomaji, c.meaning]
          .filter(Boolean)
          .join(" — "),
      };
    });
    tokens[p.slug] = slot;
  }
  return JSON.stringify({ wada: tokens }, null, 2);
}

/** Tailwind v4 `@theme` block (drop into global.css or tailwind.config.js). */
function tailwindTheme(palettes) {
  const lines = [];
  lines.push("/* The Wada Palette Bundle — Tailwind v4 @theme */");
  lines.push("@theme {");
  for (const p of palettes) {
    lines.push(`  /* ${p.title}${p.titleJa ? ` — ${p.titleJa}` : ""} */`);
    p.colors.forEach((c, i) => {
      const key = toKey(c.nameRomaji) || `${p.slug}-${i + 1}`;
      lines.push(`  --color-${p.slug}-${key}: ${c.hex};`);
    });
    lines.push("");
  }
  lines.push("}");
  return lines.join("\n");
}

/** Classic Tailwind config.js for v3 users — still the most common. */
function tailwindConfig(palettes) {
  const colors = {};
  for (const p of palettes) {
    const obj = {};
    p.colors.forEach((c, i) => {
      const key = toKey(c.nameRomaji) || String(i + 1);
      obj[key] = c.hex;
    });
    colors[p.slug] = obj;
  }
  return [
    "// The Wada Palette Bundle — Tailwind v3 config",
    "// Paste into your tailwind.config.js `theme.extend.colors`",
    "module.exports = {",
    "  theme: {",
    "    extend: {",
    "      colors: " + JSON.stringify(colors, null, 8).split("\n").join("\n      "),
    "    },",
    "  },",
    "};",
    "",
  ].join("\n");
}

/** All palettes as CSS custom properties under `:root`. */
function cssVariables(palettes) {
  const lines = [];
  lines.push("/* The Wada Palette Bundle — CSS custom properties */");
  lines.push(":root {");
  for (const p of palettes) {
    lines.push(`  /* ${p.title} */`);
    p.colors.forEach((c, i) => {
      const key = toKey(c.nameRomaji) || `${p.slug}-${i + 1}`;
      lines.push(`  --${p.slug}-${key}: ${c.hex};`);
    });
  }
  lines.push("}");
  return lines.join("\n");
}

/** SVG "museum plate" — one palette per file, printable at any size. */
function svgPlate(palette) {
  const W = 1200;
  const H = 800;
  const MARGIN = 80;
  const SWATCH_Y = 220;
  const SWATCH_H = 380;
  const SWATCH_W = (W - MARGIN * 2) / palette.colors.length;

  const swatches = palette.colors
    .map((c, i) => {
      const x = MARGIN + SWATCH_W * i;
      const labelY = SWATCH_Y + SWATCH_H + 50;
      const nameY = SWATCH_Y + SWATCH_H + 80;
      const hexY = SWATCH_Y + SWATCH_H + 105;
      return `
    <rect x="${x}" y="${SWATCH_Y}" width="${SWATCH_W}" height="${SWATCH_H}" fill="${c.hex}" />
    <text x="${x + SWATCH_W / 2}" y="${labelY}" text-anchor="middle" font-family="EB Garamond, Garamond, serif" font-size="20" fill="#1A1A1A">${escapeXml(c.nameJa ?? "")}</text>
    <text x="${x + SWATCH_W / 2}" y="${nameY}" text-anchor="middle" font-family="EB Garamond, Garamond, serif" font-size="14" font-style="italic" fill="#4A4A4A">${escapeXml(c.nameRomaji ?? "")}</text>
    <text x="${x + SWATCH_W / 2}" y="${hexY}" text-anchor="middle" font-family="JetBrains Mono, Menlo, monospace" font-size="11" fill="#888888">${c.hex}</text>`;
    })
    .join("");

  const titleJa = palette.titleJa ? escapeXml(palette.titleJa) : "";
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FBF8F1" />
  <text x="${MARGIN}" y="110" font-family="EB Garamond, Garamond, serif" font-size="48" fill="#1A1A1A">${escapeXml(palette.title)}</text>
  <text x="${MARGIN}" y="150" font-family="EB Garamond, Garamond, serif" font-size="24" font-style="italic" fill="#666666">${titleJa}</text>
  <text x="${MARGIN}" y="180" font-family="Inter, sans-serif" font-size="14" fill="#888888">${escapeXml(palette.era.toUpperCase())} · ${escapeXml(palette.moods.join(" · "))}</text>
  ${swatches}
  <text x="${MARGIN}" y="${H - 40}" font-family="Inter, sans-serif" font-size="11" fill="#aaaaaa">colorcombinations.org · Inspired by Sanzo Wada, 1933</text>
</svg>
`;
}

function escapeXml(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Full JSON of every palette, readable by any tool. */
function fullJson(palettes) {
  return JSON.stringify(
    {
      $schema: "https://colorcombinations.org/schema/bundle.v1.json",
      name: "The Wada Palette Bundle",
      version: "1.0.0",
      source: "https://colorcombinations.org",
      license:
        "The hex values and traditional Japanese color names are part of the public-domain cultural commons. The editorial selection, curatorial choices, and bundled formats are © colorcombinations.org. You may use all files for personal and commercial projects. You may not redistribute the bundle itself.",
      generated: new Date().toISOString(),
      palettes,
    },
    null,
    2,
  );
}

/** Human-readable cheat sheet. */
function readme(palettes) {
  const count = palettes.length;
  const lines = [];
  lines.push("# The Wada Palette Bundle");
  lines.push("");
  lines.push(
    `${count} historically-grounded Japanese color combinations, in five formats, one download.`,
  );
  lines.push("");
  lines.push("## What's inside");
  lines.push("");
  lines.push(
    "- `figma-tokens.json` — W3C Design Tokens format. Drag into the Figma Tokens plugin (or Tokens Studio) and the whole archive loads as a collection.",
  );
  lines.push(
    "- `tailwind-v4.css` — Tailwind v4 `@theme` block. Append to your `global.css` and every palette becomes `bg-[--color-kurenai-kon-kurenai]` et al.",
  );
  lines.push(
    "- `tailwind-v3.config.js` — classic Tailwind v3 config. Copy into your `tailwind.config.js` `theme.extend.colors`.",
  );
  lines.push(
    "- `variables.css` — plain CSS custom properties. Works in any framework, any language.",
  );
  lines.push(
    "- `svg-plates/` — one museum-style SVG per palette. Print at any size, use as a layer reference, or drop into a presentation.",
  );
  lines.push(
    "- `palettes.json` — the full data: hex, kanji, romaji, meaning, era, moods, usage notes, tags.",
  );
  lines.push("");
  lines.push("## Quick start");
  lines.push("");
  lines.push("### Tailwind v4");
  lines.push("```css");
  lines.push('@import "tailwindcss";');
  lines.push('@import "./tailwind-v4.css"; /* from this bundle */');
  lines.push("```");
  lines.push("");
  lines.push("### Tailwind v3");
  lines.push("```js");
  lines.push('// tailwind.config.js');
  lines.push('const wada = require("./tailwind-v3.config.js");');
  lines.push("module.exports = {");
  lines.push("  theme: { extend: wada.theme.extend },");
  lines.push("};");
  lines.push("```");
  lines.push("");
  lines.push("### Plain CSS");
  lines.push("```html");
  lines.push('<link rel="stylesheet" href="./variables.css" />');
  lines.push("```");
  lines.push("```css");
  lines.push(".hero { background: var(--kurenai-kon-kurenai); }");
  lines.push("```");
  lines.push("");
  lines.push("## Palettes in this bundle");
  lines.push("");
  for (const p of palettes) {
    const ja = p.titleJa ? ` (${p.titleJa})` : "";
    lines.push(`- **${p.title}**${ja} — ${p.era}, ${p.moods.join(" · ")}`);
  }
  lines.push("");
  lines.push("## License");
  lines.push("");
  lines.push(
    "Hex values and traditional Japanese color names are in the public-domain cultural commons. The editorial selection and bundled formats are © colorcombinations.org. Use everything in this bundle for personal and commercial projects; you may not redistribute the bundle itself as a download.",
  );
  lines.push("");
  lines.push(
    "If your team uses this bundle in a paid product, consider sending a note to `hello@colorcombinations.org` — I'd love to see it.",
  );
  lines.push("");
  lines.push(`_Generated ${new Date().toISOString().slice(0, 10)} — colorcombinations.org_`);
  return lines.join("\n");
}

// -----------------------------------------------------------------------------
// 3. Main
// -----------------------------------------------------------------------------

async function main() {
  console.log(`[bundle] loading palettes from src/data/palettes.ts…`);
  const palettes = await loadPalettes();
  console.log(`[bundle] parsed ${palettes.length} palettes`);

  // Clean + recreate output
  if (existsSync(OUT_DIR)) {
    await rm(OUT_DIR, { recursive: true, force: true });
  }
  await mkdir(OUT_DIR, { recursive: true });
  await mkdir(join(OUT_DIR, "svg-plates"), { recursive: true });

  // Write format files
  await writeFile(join(OUT_DIR, "figma-tokens.json"), figmaTokens(palettes));
  await writeFile(join(OUT_DIR, "tailwind-v4.css"), tailwindTheme(palettes));
  await writeFile(
    join(OUT_DIR, "tailwind-v3.config.js"),
    tailwindConfig(palettes),
  );
  await writeFile(join(OUT_DIR, "variables.css"), cssVariables(palettes));
  await writeFile(join(OUT_DIR, "palettes.json"), fullJson(palettes));
  await writeFile(join(OUT_DIR, "README.md"), readme(palettes));

  // SVG plates — one per palette
  for (const p of palettes) {
    await writeFile(
      join(OUT_DIR, "svg-plates", `${p.slug}.svg`),
      svgPlate(p),
    );
  }

  console.log(`[bundle] wrote ${palettes.length * 1 + 6} files to ${OUT_DIR}`);

  // Zip it
  const zipPath = join(ROOT, "bundle-source", `${BUNDLE_NAME}.zip`);
  if (existsSync(zipPath)) {
    await rm(zipPath);
  }

  try {
    execSync(`zip -r -q ${BUNDLE_NAME}.zip ${BUNDLE_NAME}`, {
      cwd: join(ROOT, "bundle-source"),
    });
    console.log(`[bundle] created zip: ${zipPath}`);
  } catch (err) {
    console.warn(
      `[bundle] ⚠ zip command failed; leaving unpacked directory at ${OUT_DIR}`,
    );
    console.warn(
      "         install 'zip' or zip the directory manually before uploading to Gumroad.",
    );
    if (err instanceof Error) console.warn(`         ${err.message}`);
  }

  console.log("[bundle] done.");
}

main().catch((err) => {
  console.error("[bundle] failed:", err);
  process.exit(1);
});
