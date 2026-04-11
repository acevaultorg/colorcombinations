/**
 * Per-palette OG image endpoint — /og/[slug].svg
 *
 * Generates a 1200x630 SVG at build time (one per palette), used by Twitter,
 * LinkedIn, Facebook, Discord, Slack, etc. as the Open Graph preview image
 * when any palette page is shared.
 *
 * Why SVG not PNG: modern platforms (Twitter, LinkedIn, Discord, Slack,
 * Mastodon, Bluesky) all render SVG OG images now. Facebook is the main
 * holdout — for FB-specific traffic, add a PNG fallback later via Sharp.
 *
 * Output: crisp type-over-swatches design matching the museum-plate brand.
 */

import type { APIRoute } from "astro";
import { allPalettes, paletteBySlug } from "@/data/palettes";

export function getStaticPaths() {
  return allPalettes().map((p) => ({ params: { slug: p.slug } }));
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
  const palette = paletteBySlug(slug);
  if (!palette) {
    return new Response("Not found", { status: 404 });
  }

  const W = 1200;
  const H = 630;

  // Layout constants
  const SWATCH_H = 320;
  const SWATCH_Y = H - SWATCH_H;
  const MARGIN_X = 80;
  const HEAD_Y = 150;
  const LEDE_Y = 220;
  const SITE_Y = 48;
  const swatchW = (W - MARGIN_X * 2) / palette.colors.length;

  // Title clamp — SVG doesn't do text-wrap, so we manually clamp
  const title =
    palette.title.length > 38
      ? palette.title.slice(0, 36) + "…"
      : palette.title;
  const subtitle = palette.titleJa ?? palette.summary.slice(0, 70);

  // Build swatches with labels on dark/light automatic contrast
  const swatchBlocks = palette.colors
    .map((c, i) => {
      const x = MARGIN_X + swatchW * i;
      const text = textColorOn(c.hex);
      const labelText = c.nameRomaji ?? c.hex;
      const hexText = c.hex.toUpperCase();
      return `
    <rect x="${x}" y="${SWATCH_Y}" width="${swatchW}" height="${SWATCH_H}" fill="${c.hex}" />
    <text x="${x + 28}" y="${SWATCH_Y + 50}" font-family="EB Garamond, Garamond, serif" font-size="24" font-style="italic" fill="${text}" opacity="0.92">${esc(labelText)}</text>
    <text x="${x + 28}" y="${SWATCH_Y + 78}" font-family="JetBrains Mono, Menlo, monospace" font-size="14" fill="${text}" opacity="0.75">${hexText}</text>`;
    })
    .join("");

  // Top strip — site mark (museum plate feel)
  const siteMark = `
    <g transform="translate(${MARGIN_X}, ${SITE_Y})">
      <rect x="0" y="-14" width="14" height="14" fill="#9A2A2A" />
      <rect x="16" y="-14" width="14" height="14" fill="#1B2A4E" />
      <rect x="32" y="-14" width="14" height="14" fill="#F4EEE0" stroke="#d9d6ce" stroke-width="0.5" />
      <text x="58" y="0" font-family="EB Garamond, Garamond, serif" font-size="18" fill="#141414">The Dictionary of Color Combinations</text>
    </g>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FAF7EF" />
  ${siteMark}
  <text x="${MARGIN_X}" y="${HEAD_Y}" font-family="EB Garamond, Garamond, serif" font-size="72" font-weight="500" fill="#141414">${esc(title)}</text>
  <text x="${MARGIN_X}" y="${LEDE_Y}" font-family="EB Garamond, Garamond, serif" font-size="26" font-style="italic" fill="#6b6b6b">${esc(subtitle)}</text>
  <line x1="${MARGIN_X}" y1="${SWATCH_Y - 20}" x2="${W - MARGIN_X}" y2="${SWATCH_Y - 20}" stroke="#d9d6ce" stroke-width="1" />
  ${swatchBlocks}
  <text x="${W - MARGIN_X}" y="${SWATCH_Y - 32}" text-anchor="end" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.08em" text-transform="uppercase">colorcombinations.org</text>
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
