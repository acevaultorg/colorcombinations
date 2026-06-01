import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";

/**
 * GET /api/v1/palettes — index of all 378 palettes (slim metadata).
 *
 * Free tier. No auth. Generated at build time as a static JSON file.
 * Rate-limiting (if any) applied at the Cloudflare Pages zone level.
 *
 * CORS open — LLM agents, Figma plugins, SaaS integrations welcome.
 */
export const GET: APIRoute = async () => {
  const palettes = allPalettes();
  const body = {
    meta: {
      total: palettes.length,
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      license: "Hex values + Japanese color names: public domain. Editorial palettes: CC0 1.0.",
      docs: "https://colorcombinations.org/api-docs/",
      commercial: "https://colorcombinations.org/api-docs/#commercial",
    },
    data: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      titleJa: p.titleJa ?? null,
      era: p.era,
      dominantHue: p.dominantHue,
      colorCount: p.colors.length,
      hex: p.colors.map((c) => c.hex),
      url: `https://colorcombinations.org/palettes/${p.slug}/`,
      apiUrl: `https://colorcombinations.org/api/v1/palettes/${p.slug}.json`,
    })),
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
