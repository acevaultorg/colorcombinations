/**
 * Per-color JSON API — /api/colors/[slug].json
 *
 * Machine-readable counterpart to /colors/[slug]/ HTML pages. Shows the
 * color's hex, RGB, hue family, optional Japanese name + meaning, plus
 * every palette that contains the color (deep-linked to /api/palettes/…).
 *
 * Completes the /api/* surface alongside /api/palettes/ and
 * /api/collections/. Per rules/bot-harvest.md Part 4 Pattern 3 +
 * Aleyda Solis #4 Extractable. Archetype: dataset_json_api × +70.
 */

import type { APIRoute } from "astro";
import {
  allColors,
  colorBySlug,
  palettesForColor,
} from "@/data/colors";

export function getStaticPaths() {
  return allColors().map((c) => ({ params: { slug: c.slug } }));
}

/** Hex → RGB helper for structured output. */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
}

/** Relative luminance (sRGB) for WCAG contrast. */
function relativeLuminance(hex: string): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number): number => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** WCAG contrast ratio between two hex colors. */
function contrastRatio(a: string, b: string): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [L1, L2] = la > lb ? [la, lb] : [lb, la];
  return (L1 + 0.05) / (L2 + 0.05);
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const color = colorBySlug(slug);
  if (!color) {
    return new Response(
      JSON.stringify({ error: "Color not found", slug }, null, 2),
      {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  const siteUrl = "https://colorcombinations.org";
  const palettes = palettesForColor(color);
  const rgb = hexToRgb(color.hex);

  // WCAG contrast against the two most common text backgrounds
  const contrastOnWhite = contrastRatio(color.hex, "#ffffff");
  const contrastOnBlack = contrastRatio(color.hex, "#000000");
  const round = (n: number): number => Math.round(n * 100) / 100;

  const body = {
    schema: "colorcombinations-color/v1",
    slug: color.slug,
    name: color.name,
    nameJa: color.nameJa ?? null,
    meaning: color.meaning ?? null,
    hex: color.hex,
    rgb,
    hue: color.hue,
    paletteCount: color.paletteCount,
    contrast: {
      white: {
        ratio: round(contrastOnWhite),
        aa: contrastOnWhite >= 4.5,
        aaa: contrastOnWhite >= 7,
        aaLarge: contrastOnWhite >= 3,
      },
      black: {
        ratio: round(contrastOnBlack),
        aa: contrastOnBlack >= 4.5,
        aaa: contrastOnBlack >= 7,
        aaLarge: contrastOnBlack >= 3,
      },
    },
    palettes: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      url: `${siteUrl}/palettes/${p.slug}/`,
      api: `${siteUrl}/api/palettes/${p.slug}.json`,
    })),
    urls: {
      canonical: `${siteUrl}/colors/${color.slug}/`,
      api: `${siteUrl}/api/colors/${color.slug}.json`,
    },
    license: "CC-BY-4.0 (attribution: colorcombinations.org)",
    source: "Sanzo Wada, A Dictionary of Color Combinations (1933 · six volumes)",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
