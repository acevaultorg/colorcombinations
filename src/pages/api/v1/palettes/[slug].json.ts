import type { APIRoute } from "astro";
import { allPalettes, paletteBySlug } from "@data/palettes";

/**
 * GET /api/v1/palettes/[slug].json — single palette, full record.
 * Free tier. No auth. Prerendered at build time.
 *
 * CORS open. 4xx returned as JSON for machine-readable handling.
 */
export async function getStaticPaths() {
  return allPalettes().map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const palette = paletteBySlug(params.slug ?? "");
  if (!palette) {
    return new Response(
      JSON.stringify({ error: "not_found", slug: params.slug }),
      {
        status: 404,
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "Access-Control-Allow-Origin": "*",
        },
      },
    );
  }

  const body = {
    meta: {
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      license: "Hex + Japanese names: public domain. Editorial prose: CC0 1.0.",
      docs: "https://colorcombinations.org/api-docs/",
    },
    data: {
      slug: palette.slug,
      title: palette.title,
      titleJa: palette.titleJa ?? null,
      summary: palette.summary,
      description: palette.description,
      era: palette.era,
      dominantHue: palette.dominantHue,
      moods: palette.moods,
      tags: palette.tags ?? [],
      usage: palette.usage ?? [],
      colors: palette.colors.map((c) => ({
        hex: c.hex,
        nameJa: c.nameJa ?? null,
        nameRomaji: c.nameRomaji ?? null,
        meaning: c.meaning ?? null,
      })),
      url: `https://colorcombinations.org/palettes/${palette.slug}/`,
      embedUrl: `https://colorcombinations.org/embed/${palette.slug}/`,
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "X-API-Version": "v1",
    },
  });
};
