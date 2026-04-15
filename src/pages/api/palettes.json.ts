import type { APIRoute } from "astro";
import { palettes } from "@data/palettes";

/**
 * GET /api/palettes.json
 *
 * Returns the full palette catalog (378 entries) as a single JSON document.
 * Intended for developers who want to consume the archive programmatically —
 * e.g. build their own palette picker, a design-tokens file, a Figma plugin,
 * or a site that remixes Wada's plates with different taxonomy.
 *
 * License: hex values are facts (not copyrightable) and traditional Japanese
 * color names are cultural commons. The editorial descriptions authored for
 * this archive are the only contribution I hold; feel free to link back to
 * colorcombinations.org if you use this endpoint.
 *
 * Cache policy: the underlying data only changes at build time, so the
 * endpoint emits an immutable response. Edge cache for a year.
 */
export const GET: APIRoute = async () => {
  const payload = {
    $schema: "https://colorcombinations.org/api/palettes.schema.json",
    source: "colorcombinations.org",
    license: {
      hex_values: "public-domain (facts)",
      japanese_names: "cultural-commons",
      editorial_descriptions: "© The Dictionary of Color Combinations — linkback requested",
      underlying_dataset: "MIT (mattdesl/dictionary-of-colour-combinations)",
    },
    generated_at_iso: new Date().toISOString(),
    count: palettes.length,
    palettes: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      title_ja: p.titleJa ?? null,
      summary: p.summary,
      era: p.era,
      moods: p.moods,
      dominant_hue: p.dominantHue,
      featured: p.featured ?? false,
      colors: p.colors.map((c) => ({
        hex: c.hex,
        name_ja: c.nameJa ?? null,
        name_romaji: c.nameRomaji ?? null,
        meaning: c.meaning ?? null,
      })),
      tags: p.tags ?? [],
      url: `https://colorcombinations.org/palettes/${p.slug}/`,
    })),
  };

  return new Response(JSON.stringify(payload, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "X-Archive-Version": "v1",
    },
  });
};
