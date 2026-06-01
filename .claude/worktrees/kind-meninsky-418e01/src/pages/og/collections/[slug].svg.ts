/**
 * Per-collection OG image endpoint — /og/collections/[slug].svg
 *
 * Generates a 1200x630 SVG at build time (one per collection), used by
 * Twitter, LinkedIn, Facebook, Discord, Slack etc. as the Open Graph
 * preview image when any collection page is shared. Shows the collection
 * title + tagline + a preview grid of 4 palettes from the set.
 *
 * Mirrors the palette OG pattern (src/pages/og/[slug].svg.ts) — same
 * museum-plate brand, same SVG-not-PNG rationale.
 */

import type { APIRoute } from "astro";
import {
  collections,
  collectionBySlug,
  paletteSetForCollection,
} from "@/data/collections";

export function getStaticPaths() {
  return collections.map((c) => ({ params: { slug: c.slug } }));
}

/** XML-safe string escape for use in SVG text nodes. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Relative luminance for choosing dark/light text on a swatch. */
function textColorOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum =
    0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
  return lum > 0.55 ? "#141414" : "#ffffff";
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const collection = collectionBySlug(slug);
  if (!collection) {
    return new Response("Not found", { status: 404 });
  }

  const palettes = paletteSetForCollection(collection).slice(0, 4);

  const W = 1200;
  const H = 630;

  // Layout
  const MARGIN_X = 80;
  const SITE_Y = 48;
  const EYEBROW_Y = 130;
  const HEAD_Y = 200;
  const TAG_Y = 270;
  const DIVIDER_Y = 310;
  const GRID_Y = 340;
  const GRID_H = H - GRID_Y - 40; // 250
  const ROW_GAP = 8;
  const ROW_H = (GRID_H - ROW_GAP * (palettes.length - 1)) / palettes.length;
  const TITLE_COL_W = 300;

  // Title clamp — SVG doesn't wrap
  const title =
    collection.title.length > 32
      ? collection.title.slice(0, 30) + "…"
      : collection.title;
  const tagline =
    collection.tagline.length > 100
      ? collection.tagline.slice(0, 98) + "…"
      : collection.tagline;

  // Top strip — site mark (museum plate feel, same as palette OG)
  const siteMark = `
    <g transform="translate(${MARGIN_X}, ${SITE_Y})">
      <rect x="0" y="-14" width="14" height="14" fill="#9A2A2A" />
      <rect x="16" y="-14" width="14" height="14" fill="#1B2A4E" />
      <rect x="32" y="-14" width="14" height="14" fill="#F4EEE0" stroke="#d9d6ce" stroke-width="0.5" />
      <text x="58" y="0" font-family="EB Garamond, Garamond, serif" font-size="18" fill="#141414">The Dictionary of Color Combinations</text>
    </g>`;

  // Palette rows — title left, swatches filling the rest
  const rows = palettes
    .map((p, i) => {
      const y = GRID_Y + (ROW_H + ROW_GAP) * i;
      const paletteTitle =
        p.title.length > 26 ? p.title.slice(0, 24) + "…" : p.title;

      const swatchAreaX = MARGIN_X + TITLE_COL_W;
      const swatchAreaW = W - MARGIN_X * 2 - TITLE_COL_W;
      const swatchW = swatchAreaW / p.colors.length;

      const swatches = p.colors
        .map((c, ci) => {
          const x = swatchAreaX + swatchW * ci;
          const text = textColorOn(c.hex);
          const hexText = c.hex.toUpperCase();
          return `
      <rect x="${x}" y="${y}" width="${swatchW}" height="${ROW_H}" fill="${c.hex}" />
      <text x="${x + 12}" y="${y + ROW_H - 14}" font-family="JetBrains Mono, Menlo, monospace" font-size="11" fill="${text}" opacity="0.72">${hexText}</text>`;
        })
        .join("");

      return `
    <text x="${MARGIN_X}" y="${y + ROW_H / 2 + 6}" font-family="EB Garamond, Garamond, serif" font-size="22" fill="#141414">${esc(paletteTitle)}</text>
    ${swatches}
    <rect x="${swatchAreaX}" y="${y}" width="${swatchAreaW}" height="${ROW_H}" fill="none" stroke="#d9d6ce" stroke-width="0.5" />`;
    })
    .join("");

  // Right-side "N palettes" badge near the top of the grid
  const totalPalettes = paletteSetForCollection(collection).length;
  const countBadge = `
    <text x="${W - MARGIN_X}" y="${DIVIDER_Y - 10}" text-anchor="end" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.08em">${totalPalettes} PALETTES</text>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FAF7EF" />
  ${siteMark}
  <text x="${MARGIN_X}" y="${EYEBROW_Y}" font-family="Inter, sans-serif" font-size="14" fill="#9A2A2A" letter-spacing="0.14em">COLLECTION</text>
  <text x="${MARGIN_X}" y="${HEAD_Y}" font-family="EB Garamond, Garamond, serif" font-size="68" font-weight="500" fill="#141414">${esc(title)}</text>
  <text x="${MARGIN_X}" y="${TAG_Y}" font-family="EB Garamond, Garamond, serif" font-size="24" font-style="italic" fill="#6b6b6b">${esc(tagline)}</text>
  <line x1="${MARGIN_X}" y1="${DIVIDER_Y}" x2="${W - MARGIN_X}" y2="${DIVIDER_Y}" stroke="#d9d6ce" stroke-width="1" />
  ${countBadge}
  ${rows}
  <text x="${W - MARGIN_X}" y="${H - 18}" text-anchor="end" font-family="Inter, sans-serif" font-size="12" fill="#8a8a8a" letter-spacing="0.08em">colorcombinations.org</text>
</svg>
`;

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
