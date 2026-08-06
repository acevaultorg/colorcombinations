import type { Palette } from "@/types/palette";
import type { PaintingPalette } from "@/types/painting";

/**
 * Adapt a PaintingPalette into the `Palette` shape.
 *
 * ExportPalette and ContrastMatrix are good, tested components that already
 * handle CSS/Tailwind/ASE output and the full WCAG pair matrix. They take a
 * `Palette`. Rather than fork them — which would mean maintaining two copies
 * of the contrast maths — paintings are adapted at the call site.
 *
 * The Japanese-specific fields are filled with the least-wrong values
 * available: `era` is required by the type but meaningless for a Bruegel, so
 * it is set to the catalogue's default and never rendered on painting pages.
 */
export function paintingAsPalette(p: PaintingPalette): Palette {
  return {
    slug: `paintings/${p.slug}`,
    title: `${p.title} — ${p.artist}`,
    summary: p.summary,
    description: p.story[0] ?? p.summary,
    // Not surfaced on painting pages; present only to satisfy the shared type.
    era: "edo",
    moods: [],
    dominantHue: "neutral",
    colors: p.colors.map((c) => ({ hex: c.hex as `#${string}` })),
    tags: ["painting", p.artist.toLowerCase()],
  };
}

/** Thumbnail URL for a Commons file, sized. Commons serves these directly. */
export function commonsThumb(commonsFile: string, width = 800): string {
  const name = commonsFile.replace(/^File:/, "").replace(/ /g, "_");
  return `https://commons.wikimedia.org/w/thumb.php?f=${encodeURIComponent(name)}&w=${width}`;
}

/** Percentage of the sampled surface, for display. */
export function sharePct(share: number): string {
  const pct = share * 100;
  return pct < 1 ? "<1%" : `${Math.round(pct)}%`;
}
