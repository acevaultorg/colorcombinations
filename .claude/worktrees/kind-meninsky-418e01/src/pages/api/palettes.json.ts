import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";

/**
 * /api/palettes.json — programmatic index of all palettes.
 *
 * Lightweight list of every palette in the archive (slug + title + minimal
 * metadata + per-record API URL). For LLM citation pipelines, syndication
 * tools, headless CMS consumers, and bulk discovery without scraping HTML
 * pagination. Per-record details live at /api/palettes/[slug].json.
 *
 * Schema: `colorcombinations-palette-index/v1`. CC-BY-4.0. CORS-enabled.
 */

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";
  const palettes = allPalettes();

  const body = {
    schema: "colorcombinations-palette-index/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    counts: {
      total: palettes.length,
      wada: palettes.filter((p) => p.slug.startsWith("wada-")).length,
      editorial: palettes.filter((p) => !p.slug.startsWith("wada-")).length,
    },
    palettes: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      titleJa: p.titleJa,
      summary: p.summary,
      dominantHue: p.dominantHue,
      moods: p.moods,
      era: p.era,
      colorCount: p.colors.length,
      colors: p.colors.map((c) => c.hex),
      url: `${siteUrl}palettes/${p.slug}/`,
      api: `${siteUrl}api/palettes/${p.slug}.json`,
    })),
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "Sanzo Wada (1933) — Seigensha Art Publishing 2010 reprint + 30 editorial palettes",
    feed: `${siteUrl}feed.xml`,
    indexHtml: `${siteUrl}browse/`,
    csv: `${siteUrl}data/palettes.csv`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
