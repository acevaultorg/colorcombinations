/**
 * Per-colour OG image endpoint for the pairing hubs — /og/colors-that-go-with/[slug].png
 *
 * 1200×630 SVG, one per common colour in the pairing engine (54, not the 702
 * [color]/[context] leaves — see the card that requested this: indexing/imaging
 * all 702 near-identical leaves crowds out the archive; one image per colour
 * mirrors the design already chosen for the search index in the same build).
 *
 * Mirrors the /colors/[slug] OG pattern exactly (same layout, same typography,
 * same site-mark placement) so this page type reads as part of the same site,
 * not a bolted-on feature. The right column shows the 3 computed HSL-derived
 * partner swatches instead of a single palette count, since that IS this page
 * type's distinguishing content (see [color]/index.astro).
 */

import type { APIRoute } from "astro";
import { svgToPngResponse } from "@/lib/og-png";
import { commonColors, commonColorBySlug, contexts, palettesFor, partnerColors, MIN_PALETTES } from "@data/pairings";
import type { HexColor } from "@/types/palette";

export function getStaticPaths() {
  return commonColors
    .filter((c) => contexts.some((ctx) => palettesFor(c.hex, ctx).length >= MIN_PALETTES))
    .map((c) => ({ params: { slug: c.slug } }));
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function hexToRgb(hex: string): { r: number; g: number; b: number } {
  return {
    r: parseInt(hex.slice(1, 3), 16),
    g: parseInt(hex.slice(3, 5), 16),
    b: parseInt(hex.slice(5, 7), 16),
  };
}

function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function textOnSwatch(hex: string): string {
  return relativeLuminance(hex) > 0.55 ? "#141414" : "#ffffff";
}

const settingsCount = (hex: HexColor): number =>
  contexts.filter((ctx) => palettesFor(hex, ctx).length >= MIN_PALETTES).length;

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const color = commonColorBySlug(slug);
  if (!color) {
    return new Response("Not found", { status: 404 });
  }

  const W = 1200;
  const H = 630;
  const SWATCH_W = 540;
  const swatchTextColor = textOnSwatch(color.hex);
  const rgb = hexToRgb(color.hex);
  const partners = partnerColors(color.hex).slice(0, 3);
  const settings = settingsCount(color.hex);

  const name = color.name.length > 22 ? color.name.slice(0, 20) + "…" : color.name;
  const descriptor = color.descriptor.length > 60 ? color.descriptor.slice(0, 58) + "…" : color.descriptor;

  const siteMark = `
    <g transform="translate(${SWATCH_W + 60}, 64)">
      <rect x="0" y="-14" width="14" height="14" fill="#9A2A2A" />
      <rect x="16" y="-14" width="14" height="14" fill="#1B2A4E" />
      <rect x="32" y="-14" width="14" height="14" fill="#F4EEE0" stroke="#d9d6ce" stroke-width="0.5" />
      <text x="58" y="0" font-family="EB Garamond, Garamond, Georgia, serif" font-size="18" fill="#141414">The Dictionary of Color Combinations</text>
    </g>`;

  const rightX = SWATCH_W + 60;
  const eyebrowY = 130;
  const nameY = 200;
  const descriptorY = 250;
  const dividerY = descriptorY + 30;

  // Small swatch chips for the 3 computed partners, laid out as a row of
  // labelled squares — the same "here is the actual answer" idiom as the
  // palette-page OG card's big swatch, scaled to fit three colours.
  const chipSize = 46;
  const chipGap = 14;
  const chipsY = dividerY + 110;
  const chips = partners
    .map(
      (p, i) => `
    <g transform="translate(${rightX + i * (chipSize + chipGap + 130)}, ${chipsY})">
      <rect width="${chipSize}" height="${chipSize}" rx="6" fill="${p.hex}" stroke="#d9d6ce" stroke-width="1" />
      <text x="${chipSize + 12}" y="${chipSize / 2 - 4}" font-family="Inter, sans-serif" font-size="13" fill="#141414">${esc(p.role.replace(" accent", "").replace(" (warmer)", "").replace(" (cooler)", ""))}</text>
      <text x="${chipSize + 12}" y="${chipSize / 2 + 14}" font-family="JetBrains Mono, Menlo, monospace" font-size="12" fill="#6b6b6b">${p.hex.toUpperCase()}</text>
    </g>`
    )
    .join("");

  const right = `
    <text x="${rightX}" y="${eyebrowY}" font-family="Inter, sans-serif" font-size="14" fill="#9A2A2A" letter-spacing="0.14em">COLORS THAT GO WITH</text>
    <text x="${rightX}" y="${nameY}" font-family="EB Garamond, Garamond, Georgia, serif" font-size="68" font-weight="500" fill="#141414">${esc(name)}</text>
    <text x="${rightX}" y="${descriptorY}" font-family="EB Garamond, Garamond, Georgia, serif" font-size="22" font-style="italic" fill="#6b6b6b">${esc(descriptor)}</text>
    <line x1="${rightX}" y1="${dividerY}" x2="${W - 80}" y2="${dividerY}" stroke="#d9d6ce" stroke-width="1" />
    <text x="${rightX}" y="${dividerY + 40}" font-family="JetBrains Mono, Menlo, monospace" font-size="22" fill="#141414">${color.hex.toUpperCase()}</text>
    <text x="${rightX}" y="${dividerY + 68}" font-family="JetBrains Mono, Menlo, monospace" font-size="14" fill="#6b6b6b">RGB ${rgb.r}, ${rgb.g}, ${rgb.b}</text>
    <text x="${rightX}" y="${dividerY + 96}" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.06em">COMPUTED PARTNERS</text>
    ${chips}
    <text x="${rightX}" y="${H - 60}" font-family="Inter, sans-serif" font-size="14" fill="#6b6b6b" letter-spacing="0.04em">${settings} setting${settings === 1 ? "" : "s"} — walls, weddings, clothes &amp; more</text>
    <text x="${W - 80}" y="${H - 60}" text-anchor="end" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.08em" text-transform="uppercase">colorcombinations.org</text>`;

  const swatch = `
    <rect x="0" y="0" width="${SWATCH_W}" height="${H}" fill="${color.hex}" />
    <text x="40" y="${H - 40}" font-family="JetBrains Mono, Menlo, monospace" font-size="18" fill="${swatchTextColor}" opacity="0.85" letter-spacing="0.04em">${color.hex.toUpperCase()}</text>`;

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FAF7EF" />
  ${swatch}
  ${siteMark}
  ${right}
</svg>
`;

  return svgToPngResponse(svg);
};
