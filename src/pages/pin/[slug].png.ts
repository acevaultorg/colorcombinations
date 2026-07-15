/**
 * Vertical Pinterest pin image — /pin/[slug].png  (1000×1500 PNG)
 *
 * Palette color pins are THE #1 Pinterest-native content type (how colorhunt /
 * coolors reached millions/mo). One 2:3 vertical pin per palette: the full-width
 * swatch stack IS the pin, with the palette name + each color's name + hex.
 * The /pinterest-feed.xml RSS surface points a scheduler (Tailwind / Pinterest
 * bulk-upload) at these. Ranks in days vs Google's authority clock.
 *
 * PNG (not SVG) because Pinterest rejects SVG pins — built once at build time
 * with @resvg/resvg-js (system fonts) so there's no runtime rasterizer. The
 * `.png.ts` route name gives the file a real .png extension so CF Pages serves
 * image/png without a _headers hack.
 *
 * Design forks src/pages/og/[slug].svg.ts (same museum-plate brand).
 */

import type { APIRoute } from "astro";
import { Resvg } from "@resvg/resvg-js";
import { allPalettes, paletteBySlug } from "@/data/palettes";

export function getStaticPaths() {
  return allPalettes().map((p) => ({ params: { slug: p.slug } }));
}

/** XML-safe escape for SVG text nodes. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Auto dark/light text for legibility on a swatch (WCAG relative luminance). */
function textColorOn(hex: string): string {
  const r = parseInt(hex.slice(1, 3), 16) / 255;
  const g = parseInt(hex.slice(3, 5), 16) / 255;
  const b = parseInt(hex.slice(5, 7), 16) / 255;
  const lin = (c: number): number =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  const lum = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return lum > 0.55 ? "#1a1a1a" : "#ffffff";
}

export const GET: APIRoute = ({ params }) => {
  const palette = paletteBySlug(params.slug ?? "");
  if (!palette) return new Response("Not found", { status: 404 });

  const W = 1000;
  const H = 1500;
  const HEADER_H = 300;
  const FOOTER_H = 96;
  const STACK_H = H - HEADER_H - FOOTER_H;
  const n = palette.colors.length;
  const bandH = STACK_H / n;

  const title =
    palette.title.length > 30 ? palette.title.slice(0, 28) + "…" : palette.title;

  const swatches = palette.colors
    .map((c, i) => {
      const y = HEADER_H + bandH * i;
      const t = textColorOn(c.hex);
      const name = c.nameRomaji ?? "";
      const hex = c.hex.toUpperCase();
      return `<rect x="0" y="${y}" width="${W}" height="${bandH + 1}" fill="${c.hex}"/>
${name ? `<text x="56" y="${y + bandH / 2 - 4}" font-family="Georgia, serif" font-size="40" font-style="italic" fill="${t}" opacity="0.95">${esc(name)}</text>` : ""}
<text x="56" y="${y + bandH / 2 + (name ? 40 : 14)}" font-family="Menlo, monospace" font-size="30" letter-spacing="2" fill="${t}" opacity="0.82">${hex}</text>`;
    })
    .join("\n");

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
<rect width="${W}" height="${H}" fill="#F4EEE0"/>
<g transform="translate(56,64)">
<rect x="0" y="-20" width="20" height="20" fill="#9A2A2A"/>
<rect x="24" y="-20" width="20" height="20" fill="#1B2A4E"/>
<rect x="48" y="-20" width="20" height="20" fill="#C9A23F"/>
<text x="82" y="-3" font-family="Georgia, serif" font-size="26" letter-spacing="2" fill="#4a453d">COLORCOMBINATIONS.ORG</text>
</g>
<text x="56" y="176" font-family="Georgia, serif" font-size="72" font-weight="700" fill="#1a1712">${esc(title)}</text>
${palette.titleJa ? `<text x="56" y="230" font-family="Georgia, serif" font-size="40" font-style="italic" fill="#9A2A2A">${esc(palette.titleJa)}</text>` : ""}
<text x="56" y="272" font-family="Georgia, serif" font-size="27" fill="#6b6459">${n}-color palette · hex &amp; RGB codes</text>
${swatches}
<rect x="0" y="${H - FOOTER_H}" width="${W}" height="${FOOTER_H}" fill="#1a1712"/>
<text x="56" y="${H - FOOTER_H / 2 + 10}" font-family="Georgia, serif" font-size="30" fill="#F4EEE0">Free color codes · copy &amp; use</text>
<text x="${W - 56}" y="${H - FOOTER_H / 2 + 10}" text-anchor="end" font-family="Georgia, serif" font-size="30" font-style="italic" fill="#C9A23F">colorcombinations.org</text>
</svg>`;

  const png = new Resvg(svg, {
    font: { loadSystemFonts: true, defaultFontFamily: "Georgia" },
    fitTo: { mode: "width", value: W },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
