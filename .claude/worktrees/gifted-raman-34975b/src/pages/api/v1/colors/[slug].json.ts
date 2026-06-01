import type { APIRoute } from "astro";
import { allColors, colorBySlug, palettesForColor } from "@data/colors";

/** GET /api/v1/colors/[slug].json — single color with its palette backlinks. */
export async function getStaticPaths() {
  return allColors().map((c) => ({ params: { slug: c.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const color = colorBySlug(params.slug ?? "");
  if (!color) {
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

  const palettes = palettesForColor(color);
  const body = {
    meta: {
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      license: "Hex + Japanese name: public domain.",
      docs: "https://colorcombinations.org/api-docs/",
    },
    data: {
      slug: color.slug,
      name: color.name,
      nameJa: color.nameJa ?? null,
      meaning: color.meaning ?? null,
      hex: color.hex,
      hue: color.hue,
      paletteCount: color.paletteCount,
      url: `https://colorcombinations.org/colors/${color.slug}/`,
      palettes: palettes.map((p) => ({
        slug: p.slug,
        title: p.title,
        titleJa: p.titleJa ?? null,
        hex: p.colors.map((c) => c.hex),
        url: `https://colorcombinations.org/palettes/${p.slug}/`,
        apiUrl: `https://colorcombinations.org/api/v1/palettes/${p.slug}.json`,
      })),
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
