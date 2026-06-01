import type { APIRoute } from "astro";
import {
  collections,
  collectionBySlug,
  paletteSetForCollection,
} from "@data/collections";

/** GET /api/v1/collections/[slug].json — full collection + all palette slugs. */
export async function getStaticPaths() {
  return collections.map((c) => ({ params: { slug: c.slug } }));
}

export const GET: APIRoute = async ({ params }) => {
  const collection = collectionBySlug(params.slug ?? "");
  if (!collection) {
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

  const palettes = paletteSetForCollection(collection);
  const body = {
    meta: {
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      docs: "https://colorcombinations.org/api-docs/",
    },
    data: {
      slug: collection.slug,
      title: collection.title,
      description: collection.description.replace(/<[^>]+>/g, ""),
      accentHex: collection.accentHex,
      url: `https://colorcombinations.org/collections/${collection.slug}/`,
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
