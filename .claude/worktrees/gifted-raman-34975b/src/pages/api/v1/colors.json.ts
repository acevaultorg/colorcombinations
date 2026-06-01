import type { APIRoute } from "astro";
import { allColors } from "@data/colors";

/**
 * GET /api/v1/colors.json — index of all named colors (159+ unique).
 * Free tier. CORS open. Cached at CF edge.
 */
export const GET: APIRoute = async () => {
  const colors = allColors();
  const body = {
    meta: {
      total: colors.length,
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      docs: "https://colorcombinations.org/api-docs/",
    },
    data: colors.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameJa: c.nameJa ?? null,
      hex: c.hex,
      hue: c.hue,
      paletteCount: c.paletteCount,
      url: `https://colorcombinations.org/colors/${c.slug}/`,
      apiUrl: `https://colorcombinations.org/api/v1/colors/${c.slug}.json`,
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
