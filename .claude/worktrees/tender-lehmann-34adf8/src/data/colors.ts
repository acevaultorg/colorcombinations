/**
 * colors.ts — Aggregates every unique named color across the entire archive.
 *
 * Each color is a unique (nameRomaji, hex) pair with reverse-lookup to every
 * palette that contains it. This powers the /colors/ index and /colors/[slug]
 * detail pages — 159+ individual SEO landing pages for long-tail searches like
 * "Hermosa Pink hex" or "cerulian blue color palette".
 */

import type { HexColor, Palette, PaletteColor, DominantHue } from "@/types/palette";
import { allPalettes } from "./palettes";

export interface ColorEntry {
  /** URL-safe slug, e.g. "hermosa-pink" */
  slug: string;
  /** Display name, e.g. "Hermosa Pink" */
  name: string;
  /** Japanese name if available from curated palettes */
  nameJa?: string;
  /** Meaning / description if available */
  meaning?: string;
  /** Primary hex value */
  hex: HexColor;
  /** Dominant hue category for filtering */
  hue: DominantHue;
  /** Number of palettes that use this color */
  paletteCount: number;
  /** Slugs of all palettes containing this color */
  paletteSlugs: string[];
}

/** Slugify a color name: "Hermosa Pink" → "hermosa-pink" */
function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/** Classify a hex color into a dominant hue bucket */
function classifyHue(hex: HexColor): DominantHue {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const delta = max - min;
  const lightness = (max + min) / 2;
  const saturation = delta === 0 ? 0 : delta / (1 - Math.abs(2 * lightness / 255 - 1));

  // Neutrals: very low saturation or very dark/light
  if (saturation < 25 || (max < 40 && min < 40) || (min > 220 && delta < 20)) {
    return "neutral";
  }

  // Compute hue angle
  let hue = 0;
  if (delta > 0) {
    if (max === r) hue = 60 * (((g - b) / delta) % 6);
    else if (max === g) hue = 60 * ((b - r) / delta + 2);
    else hue = 60 * ((r - g) / delta + 4);
  }
  if (hue < 0) hue += 360;

  // Browns: low-saturation warm tones
  if (hue >= 15 && hue < 45 && lightness < 160 && saturation < 120) return "brown";

  // Pinks: high red with significant blue, lighter
  if ((hue >= 330 || hue < 10) && lightness > 140 && b > g) return "pink";

  if (hue < 15 || hue >= 345) return "red";
  if (hue < 40) return "orange";
  if (hue < 70) return "yellow";
  if (hue < 165) return "green";
  if (hue < 260) return "blue";
  if (hue < 345) return "purple";

  return "neutral";
}

// Build the index once at module load (runs at build time in Astro SSG).
const _colorMap = new Map<string, ColorEntry>();
const _palettes = allPalettes();

for (const palette of _palettes) {
  for (const color of palette.colors) {
    const name = color.nameRomaji ?? color.hex;
    const key = slugify(name);

    if (_colorMap.has(key)) {
      const existing = _colorMap.get(key)!;
      if (!existing.paletteSlugs.includes(palette.slug)) {
        existing.paletteSlugs.push(palette.slug);
        existing.paletteCount = existing.paletteSlugs.length;
      }
      // Enrich: prefer curated names with Japanese
      if (color.nameJa && !existing.nameJa) existing.nameJa = color.nameJa;
      if (color.meaning && !existing.meaning) existing.meaning = color.meaning;
    } else {
      _colorMap.set(key, {
        slug: key,
        name,
        nameJa: color.nameJa,
        meaning: color.meaning,
        hex: color.hex,
        hue: classifyHue(color.hex),
        paletteCount: 1,
        paletteSlugs: [palette.slug],
      });
    }
  }
}

/** All unique colors, sorted by palette count descending then name ascending */
const _allColors = Array.from(_colorMap.values()).sort(
  (a, b) => b.paletteCount - a.paletteCount || a.name.localeCompare(b.name),
);

export function allColors(): ColorEntry[] {
  return _allColors;
}

export function colorBySlug(slug: string): ColorEntry | undefined {
  return _colorMap.get(slug);
}

/** Get full palette objects for a color entry */
export function palettesForColor(entry: ColorEntry): Palette[] {
  return entry.paletteSlugs
    .map((s) => _palettes.find((p) => p.slug === s))
    .filter((p): p is Palette => p !== undefined);
}

/** Group colors by hue for the index page */
export function colorsByHue(): Map<DominantHue, ColorEntry[]> {
  const groups = new Map<DominantHue, ColorEntry[]>();
  for (const color of _allColors) {
    const list = groups.get(color.hue) ?? [];
    list.push(color);
    groups.set(color.hue, list);
  }
  return groups;
}
