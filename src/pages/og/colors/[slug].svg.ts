/**
 * Per-color OG image endpoint — /og/colors/[slug].svg
 *
 * 1200×630 SVG, one per named color in the dictionary. Used as og:image
 * when /colors/[slug]/ URLs are shared on Twitter, LinkedIn, Slack,
 * Discord, Notion, Mastodon, Bluesky.
 *
 * Mirrors palette + collection OG patterns. Big swatch on left,
 * editorial typography on right (name, Japanese name, meaning, hex+RGB,
 * WCAG contrast badges, palette count).
 */

import type { APIRoute } from "astro";
import { allColors, colorBySlug, palettesForColor } from "@/data/colors";

export function getStaticPaths() {
  return allColors().map((c) => ({ params: { slug: c.slug } }));
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

function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [L1, L2] = la > lb ? [la, lb] : [lb, la];
  return (L1 + 0.05) / (L2 + 0.05);
}

/** Pick best text color for use directly on the swatch. */
function textOnSwatch(hex: string): string {
  return relativeLuminance(hex) > 0.55 ? "#141414" : "#ffffff";
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const color = colorBySlug(slug);
  if (!color) {
    return new Response("Not found", { status: 404 });
  }

  const W = 1200;
  const H = 630;
  const SWATCH_W = 540;
  const swatchTextColor = textOnSwatch(color.hex);
  const rgb = hexToRgb(color.hex);
  const palettes = palettesForColor(color);

  const contrastWhite = contrastRatio(color.hex, "#ffffff");
  const contrastBlack = contrastRatio(color.hex, "#000000");
  const round = (n: number): string => (Math.round(n * 100) / 100).toFixed(2);
  const wcagBadge = (label: string, ratio: number): string => {
    const aa = ratio >= 4.5;
    const aaa = ratio >= 7;
    const tag = aaa ? "AAA" : aa ? "AA" : ratio >= 3 ? "AA Large" : "Fail";
    return `${label} ${round(ratio)} (${tag})`;
  };

  // Crop / clamp display strings
  const name = color.name.length > 22 ? color.name.slice(0, 20) + "…" : color.name;
  const meaning = color.meaning
    ? color.meaning.length > 60
      ? color.meaning.slice(0, 58) + "…"
      : color.meaning
    : "";

  // Site mark — placed on the right (cream) side because the left side is
  // the variable-color swatch (could be red, dark, etc., obscuring the mark).
  const siteMark = `
    <g transform="translate(${SWATCH_W + 60}, 64)">
      <rect x="0" y="-14" width="14" height="14" fill="#9A2A2A" />
      <rect x="16" y="-14" width="14" height="14" fill="#1B2A4E" />
      <rect x="32" y="-14" width="14" height="14" fill="#F4EEE0" stroke="#d9d6ce" stroke-width="0.5" />
      <text x="58" y="0" font-family="EB Garamond, Garamond, serif" font-size="18" fill="#141414">The Dictionary of Color Combinations</text>
    </g>`;

  // Right column — name + Japanese + meaning + hex/RGB + contrast + count
  const rightX = SWATCH_W + 60;
  const eyebrowY = 130;
  const nameY = 200;
  const nameJaY = color.nameJa ? 240 : 0;
  const meaningY = color.nameJa ? 290 : 250;
  const dividerY = meaning ? meaningY + 30 : meaningY;

  const right = `
    <text x="${rightX}" y="${eyebrowY}" font-family="Inter, sans-serif" font-size="14" fill="#9A2A2A" letter-spacing="0.14em">COLOR</text>
    <text x="${rightX}" y="${nameY}" font-family="EB Garamond, Garamond, serif" font-size="68" font-weight="500" fill="#141414">${esc(name)}</text>
    ${color.nameJa ? `<text x="${rightX}" y="${nameJaY}" font-family="EB Garamond, Garamond, serif" font-size="32" font-style="italic" fill="#6b6b6b">${esc(color.nameJa)}</text>` : ""}
    ${meaning ? `<text x="${rightX}" y="${meaningY}" font-family="EB Garamond, Garamond, serif" font-size="24" font-style="italic" fill="#6b6b6b">${esc(meaning)}</text>` : ""}
    <line x1="${rightX}" y1="${dividerY}" x2="${W - 80}" y2="${dividerY}" stroke="#d9d6ce" stroke-width="1" />
    <text x="${rightX}" y="${dividerY + 50}" font-family="JetBrains Mono, Menlo, monospace" font-size="22" fill="#141414">${color.hex.toUpperCase()}</text>
    <text x="${rightX}" y="${dividerY + 80}" font-family="JetBrains Mono, Menlo, monospace" font-size="14" fill="#6b6b6b">RGB ${rgb.r}, ${rgb.g}, ${rgb.b}</text>
    <text x="${rightX}" y="${dividerY + 130}" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.06em">WCAG CONTRAST</text>
    <text x="${rightX}" y="${dividerY + 156}" font-family="Inter, sans-serif" font-size="14" fill="#444">${esc(wcagBadge("on white", contrastWhite))}</text>
    <text x="${rightX}" y="${dividerY + 178}" font-family="Inter, sans-serif" font-size="14" fill="#444">${esc(wcagBadge("on black", contrastBlack))}</text>
    <text x="${rightX}" y="${H - 60}" font-family="Inter, sans-serif" font-size="14" fill="#6b6b6b" letter-spacing="0.04em">In ${palettes.length} palette${palettes.length === 1 ? "" : "s"}</text>
    <text x="${W - 80}" y="${H - 60}" text-anchor="end" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.08em" text-transform="uppercase">colorcombinations.org</text>`;

  // Swatch panel — full-bleed left column with hex label inside
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

  return new Response(svg, {
    status: 200,
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
