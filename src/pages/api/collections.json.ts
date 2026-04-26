import type { APIRoute } from "astro";
import { collections, paletteSetForCollection } from "@/data/collections";

/**
 * /api/collections.json — programmatic index of all collections.
 *
 * List of every collection (slug + title + tagline + accent + palette count
 * + URLs). For LLM citation pipelines, design-system browsing tools, and
 * bulk discovery. Per-collection palette lists at /api/collections/[slug].json.
 *
 * Schema: `colorcombinations-collection-index/v1`. CC-BY-4.0. CORS-enabled.
 */

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";

  const body = {
    schema: "colorcombinations-collection-index/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    counts: {
      total: collections.length,
    },
    collections: collections.map((c) => {
      const set = paletteSetForCollection(c);
      return {
        slug: c.slug,
        title: c.title,
        tagline: c.tagline,
        keywords: c.keywords,
        accentHex: c.accentHex,
        paletteCount: set.length,
        url: `${siteUrl}collections/${c.slug}/`,
        api: `${siteUrl}api/collections/${c.slug}.json`,
        og: `${siteUrl}og/collections/${c.slug}.svg`,
      };
    }),
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "Sanzo Wada (1933) — curated thematic groupings",
    feed: `${siteUrl}feed.xml`,
    indexHtml: `${siteUrl}collections/`,
    csv: `${siteUrl}data/collections.csv`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
