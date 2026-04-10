/**
 * Color utility functions — WCAG contrast + hex manipulation.
 * Pure functions, no dependencies.
 */

import type { HexColor, Palette } from "@/types/palette";

/** Parse "#RRGGBB" to {r,g,b} in 0-255 space */
export function hexToRgb(hex: HexColor): { r: number; g: number; b: number } {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

/** Relative luminance for WCAG contrast */
function relativeLuminance(hex: HexColor): number {
  const { r, g, b } = hexToRgb(hex);
  const toLinear = (c: number): number => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * toLinear(r) + 0.7152 * toLinear(g) + 0.0722 * toLinear(b);
}

/** Return whether the given hex should use dark or light text on top */
export function bestTextColorOn(bg: HexColor): "dark" | "light" {
  const lum = relativeLuminance(bg);
  return lum > 0.5 ? "dark" : "light";
}

/** Contrast ratio between two hex colors (WCAG) */
export function contrastRatio(a: HexColor, b: HexColor): number {
  const lumA = relativeLuminance(a);
  const lumB = relativeLuminance(b);
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Convert a palette to a simple hex list, useful for exports */
export function paletteToHexList(palette: Palette): string[] {
  return palette.colors.map((c) => c.hex);
}

/** Generate a tiny SVG data URI with the palette's color stripes — used as OG fallback */
export function paletteToSvgDataUri(palette: Palette, width = 1200, height = 630): string {
  const stripeWidth = width / palette.colors.length;
  const stripes = palette.colors
    .map(
      (c, i) =>
        `<rect x="${i * stripeWidth}" y="0" width="${stripeWidth}" height="${height}" fill="${c.hex}" />`,
    )
    .join("");
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}">${stripes}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
