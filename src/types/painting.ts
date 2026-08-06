/**
 * Colour palettes sampled from public-domain paintings.
 *
 * Separate from `Palette` on purpose. That type is built around Sanzo Wada's
 * catalogue and carries Japanese era tags and shikisai names, none of which
 * apply to a Bruegel. Forcing Western paintings into it would mean either
 * widening `Era` into something meaningless or leaving fields permanently
 * empty, so paintings get their own shape.
 */

export type SwatchRole = "ground" | "accent";

export interface PaintingSwatch {
  /** Hex value — a colour that genuinely occurs on the canvas (see methodology). */
  hex: string;
  /** Share of the sampled surface this cluster covers, 0–1. */
  share: number;
  /**
   * `ground` = one of the three largest areas by coverage.
   * `accent` = selected for chromatic intensity, and may cover very little.
   */
  role: SwatchRole;
  /** CIELAB chroma. Higher is more saturated. */
  chroma: number;
  /** CIELAB lightness, 0–100. */
  lightness: number;
}

export interface PaintingPigment {
  /** Common name, with chemistry where it is informative. */
  name: string;
  /** What it was used for in this specific painting. */
  note: string;
}

export interface PaintingSource {
  label: string;
  href: string;
}

export interface PaintingImage {
  commonsFile: string;
  commonsPage: string;
  /** Licence string as reported by Commons. Public domain only. */
  license: string;
}

export interface PaintingPalette {
  slug: string;
  title: string;
  artist: string;
  /** Display year, e.g. "1889" or "c. 1665". */
  year: string;
  museum: string;
  summary: string;
  /** Paragraphs. */
  story: string[];
  /** Populated only where published conservation research supports it. */
  pigments: PaintingPigment[];
  /**
   * How far today's surface has drifted from what the artist laid down.
   * `null` where no published research establishes it — absence of evidence
   * is recorded as absence, never as "unchanged".
   */
  shift: string | null;
  sources: PaintingSource[];
  colors: PaintingSwatch[];
  image: PaintingImage;
}
