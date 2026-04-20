import type { APIRoute } from "astro";
import { collections, paletteSetForCollection } from "@data/collections";

/** GET /api/v1/collections — list all thematic collections. */
export const GET: APIRoute = async () => {
  const body = {
    meta: {
      total: collections.length,
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      docs: "https://colorcombinations.org/api-docs/",
    },
    data: collections.map((c) => {
      const palettes = paletteSetForCollection(c);
      return {
        slug: c.slug,
        title: c.title,
        description: c.description.replace(/<[^>]+>/g, ""),
        paletteCount: palettes.length,
        accentHex: c.accentHex,
        url: `https://colorcombinations.org/collections/${c.slug}/`,
        apiUrl: `https://colorcombinations.org/api/v1/collections/${c.slug}.json`,
      };
    }),
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
