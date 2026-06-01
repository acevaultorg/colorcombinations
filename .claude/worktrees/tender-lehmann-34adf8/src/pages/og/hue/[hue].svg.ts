/**
 * /og/hue/[hue].svg — 9 OG images for /colors/[hue]/ landing pages.
 *
 * Each pulls the top swatches in that hue family from the live color
 * dictionary, so the OG always reflects the current archive shape.
 * Mirrors the museum-plate brand of the other OG endpoints.
 */

import type { APIRoute } from "astro";
import { colorsByHue } from "@/data/colors";
import type { DominantHue } from "@/types/palette";

const HUE_ORDER: DominantHue[] = [
  "red", "orange", "yellow", "brown", "pink",
  "green", "blue", "purple", "neutral",
];

const HUE_HEADLINES: Record<DominantHue, { headline: string; lede: string; accentHex: string }> = {
  red: {
    headline: "Red Color Combinations",
    lede: "Crimson, vermillion, madder — the most historically loaded reds in Japanese tradition.",
    accentHex: "#9A2A2A",
  },
  orange: {
    headline: "Orange Color Combinations",
    lede: "Persimmon, tangerine, amber — Japanese orange between red ceremony and yellow sunlight.",
    accentHex: "#C45C2A",
  },
  yellow: {
    headline: "Yellow Color Combinations",
    lede: "Yamabuki, ukon, kariyasu — luminous yellows from mustard to pale gold.",
    accentHex: "#D4A017",
  },
  brown: {
    headline: "Brown Color Combinations",
    lede: "Tobi, kogecha, kuri — rich earth-tones from kite-brown to burnt cedar.",
    accentHex: "#7B4A2A",
  },
  pink: {
    headline: "Pink Color Combinations",
    lede: "Sakura, nadeshiko, usubeni — the full nuanced range of Japanese pink.",
    accentHex: "#E8A0A0",
  },
  green: {
    headline: "Green Color Combinations",
    lede: "Moegi, matsuba, tokiwa — botanical greens from young bamboo to evergreen.",
    accentHex: "#3A6B45",
  },
  blue: {
    headline: "Blue Color Combinations",
    lede: "Sora, asagi, hanada, ruri, kon — the full Japanese blue spectrum.",
    accentHex: "#1A3C6B",
  },
  purple: {
    headline: "Purple Color Combinations",
    lede: "Murasaki, kikyo, fuji — purples from imperial robe to wisteria petal.",
    accentHex: "#5A2A7A",
  },
  neutral: {
    headline: "Neutral Color Combinations",
    lede: "Gofun, kinari, nezumi, sumi, gin — the chalk-to-ink spectrum of Japanese neutrals.",
    accentHex: "#8A8A8A",
  },
};

export function getStaticPaths() {
  return HUE_ORDER.map((hue) => ({ params: { hue } }));
}

function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function relativeLuminance(hex: string): number {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const toLinear = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

function textOnSwatch(hex: string): string {
  return relativeLuminance(hex) > 0.55 ? "#141414" : "#ffffff";
}

export const GET: APIRoute = ({ params }) => {
  const hue = params.hue as DominantHue;
  const meta = HUE_HEADLINES[hue];
  if (!meta) return new Response("Not found", { status: 404 });

  // Pull up to 9 colors in this hue family, sorted by palette frequency.
  const colorsInHue = colorsByHue().get(hue) ?? [];
  const top = colorsInHue
    .slice()
    .sort((a, b) => b.paletteCount - a.paletteCount)
    .slice(0, 9);
  const totalInHue = colorsInHue.length;

  const W = 1200;
  const H = 630;
  const MARGIN_X = 80;

  const siteMark = `
    <g transform="translate(${MARGIN_X}, 64)">
      <rect x="0" y="-14" width="14" height="14" fill="#9A2A2A"/>
      <rect x="16" y="-14" width="14" height="14" fill="#1B2A4E"/>
      <rect x="32" y="-14" width="14" height="14" fill="#F4EEE0" stroke="#d9d6ce" stroke-width="0.5"/>
      <text x="58" y="0" font-family="EB Garamond, Garamond, serif" font-size="18" fill="#141414">The Dictionary of Color Combinations</text>
    </g>`;

  // Title block
  const titleBlock = `
    <text x="${MARGIN_X}" y="135" font-family="Inter, sans-serif" font-size="14" fill="${meta.accentHex}" letter-spacing="0.14em">${esc(hue.toUpperCase())} HUE FAMILY</text>
    <text x="${MARGIN_X}" y="220" font-family="EB Garamond, Garamond, serif" font-size="68" font-weight="500" fill="#141414">${esc(meta.headline)}</text>
    <text x="${MARGIN_X}" y="270" font-family="EB Garamond, Garamond, serif" font-size="22" font-style="italic" fill="#6b6b6b">${esc(meta.lede)}</text>`;

  const dividerY = 320;

  // Up to 9 swatch tiles in a single row
  const tileCount = top.length;
  const tileW = (W - MARGIN_X * 2) / tileCount;
  const tileH = 220;
  const tileY = 360;
  const tiles = top
    .map((c, i) => {
      const x = MARGIN_X + tileW * i;
      const tone = textOnSwatch(c.hex);
      const labelName = c.nameJa
        ? `${c.nameJa} ${c.name}`
        : c.name;
      const clipped = labelName.length > 12 ? labelName.slice(0, 11) + "…" : labelName;
      return `
    <rect x="${x}" y="${tileY}" width="${tileW}" height="${tileH}" fill="${c.hex}"/>
    <text x="${x + 12}" y="${tileY + tileH - 30}" font-family="EB Garamond, Garamond, serif" font-size="13" font-style="italic" fill="${tone}" opacity="0.9">${esc(clipped)}</text>
    <text x="${x + 12}" y="${tileY + tileH - 12}" font-family="JetBrains Mono, Menlo, monospace" font-size="10" fill="${tone}" opacity="0.78">${c.hex.toUpperCase()}</text>`;
    })
    .join("");

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FAF7EF"/>
  ${siteMark}
  ${titleBlock}
  <line x1="${MARGIN_X}" y1="${dividerY}" x2="${W - MARGIN_X}" y2="${dividerY}" stroke="#d9d6ce" stroke-width="1"/>
  <text x="${W - MARGIN_X}" y="${dividerY - 15}" text-anchor="end" font-family="Inter, sans-serif" font-size="13" fill="#8a8a8a" letter-spacing="0.08em">${totalInHue} NAMED COLORS</text>
  ${tiles}
  <text x="${W - MARGIN_X}" y="${H - 22}" text-anchor="end" font-family="Inter, sans-serif" font-size="12" fill="#8a8a8a" letter-spacing="0.08em">colorcombinations.org/colors/${hue}</text>
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
