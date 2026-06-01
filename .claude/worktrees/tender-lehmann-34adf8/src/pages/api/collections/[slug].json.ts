/**
 * Per-collection JSON API — /api/collections/[slug].json
 *
 * Machine-readable counterpart to /collections/[slug]/ HTML pages. Lists the
 * full resolved palette set (curated + matched) with deep links back to
 * per-palette JSON endpoints so an LLM agent or third-party client can
 * traverse the graph without scraping HTML.
 *
 * Per rules/bot-harvest.md Part 4 Pattern 3 + Aleyda Solis #4 Extractable.
 * Archetype: dataset_json_api × +70.
 */

import type { APIRoute } from "astro";
import {
  collections,
  collectionBySlug,
  paletteSetForCollection,
} from "@/data/collections";

export function getStaticPaths() {
  return collections.map((c) => ({ params: { slug: c.slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const collection = collectionBySlug(slug);
  if (!collection) {
    return new Response(
      JSON.stringify({ error: "Collection not found", slug }, null, 2),
      {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  const siteUrl = "https://colorcombinations.org";
  const palettes = paletteSetForCollection(collection);

  const body = {
    schema: "colorcombinations-collection/v1",
    slug: collection.slug,
    title: collection.title,
    tagline: collection.tagline,
    description: collection.description,
    keywords: collection.keywords,
    accentHex: collection.accentHex,
    paletteCount: palettes.length,
    palettes: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      titleJa: p.titleJa ?? null,
      dominantHue: p.dominantHue,
      moods: p.moods,
      colors: p.colors.map((c) => c.hex),
      url: `${siteUrl}/palettes/${p.slug}/`,
      api: `${siteUrl}/api/palettes/${p.slug}.json`,
    })),
    urls: {
      canonical: `${siteUrl}/collections/${collection.slug}/`,
      embed: `${siteUrl}/embed/collection/${collection.slug}/`,
      openGraph: `${siteUrl}/og/collections/${collection.slug}.svg`,
      api: `${siteUrl}/api/collections/${collection.slug}.json`,
    },
    license: "CC-BY-4.0 (attribution: colorcombinations.org)",
    source: "Sanzo Wada, A Dictionary of Color Combinations (1933 · six volumes)",
  };

  return new Response(JSON.stringify(body, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
