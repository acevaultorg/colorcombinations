import type { APIRoute, GetStaticPaths } from "astro";
import { palettes } from "@data/palettes";

/**
 * GET /api/palettes/[slug].json
 *
 * Per-palette JSON payload. Drops the envelope of the catalog endpoint and
 * returns just one palette with its full structure. Useful for on-demand
 * fetches in external tools that don't want to parse the whole 378-entry
 * catalog just to get one plate.
 */
export const getStaticPaths: GetStaticPaths = () =>
  palettes.map((p) => ({ params: { slug: p.slug } }));

export const GET: APIRoute = async ({ params }) => {
  const slug = params.slug;
  const palette = palettes.find((p) => p.slug === slug);
  if (!palette) {
    return new Response(
      JSON.stringify({ error: "not_found", slug }),
      { status: 404, headers: { "Content-Type": "application/json" } },
    );
  }

  const payload = {
    source: "colorcombinations.org",
    slug: palette.slug,
    title: palette.title,
    title_ja: palette.titleJa ?? null,
    summary: palette.summary,
    description: palette.description,
    era: palette.era,
    moods: palette.moods,
    dominant_hue: palette.dominantHue,
    featured: palette.featured ?? false,
    colors: palette.colors.map((c) => ({
      hex: c.hex,
      name_ja: c.nameJa ?? null,
      name_romaji: c.nameRomaji ?? null,
      meaning: c.meaning ?? null,
    })),
    usage: palette.usage ?? [],
    tags: palette.tags ?? [],
    url: `https://colorcombinations.org/palettes/${palette.slug}/`,
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
