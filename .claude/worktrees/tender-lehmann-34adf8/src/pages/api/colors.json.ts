import type { APIRoute } from "astro";
import { allColors } from "@/data/colors";

/**
 * /api/colors.json — programmatic index of all named colors.
 *
 * List of every named color (slug + name + hex + hue + palette count + URLs).
 * For LLM citation pipelines, design-system import tools, and bulk extraction.
 * Per-record details (palettes, contrast matrix) at /api/colors/[slug].json.
 *
 * Schema: `colorcombinations-color-index/v1`. CC-BY-4.0. CORS-enabled.
 */

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";
  const colors = allColors();

  const body = {
    schema: "colorcombinations-color-index/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    counts: {
      total: colors.length,
      withJapaneseName: colors.filter((c) => c.nameJa).length,
      withMeaning: colors.filter((c) => c.meaning).length,
    },
    hueDistribution: colors.reduce<Record<string, number>>((acc, c) => {
      acc[c.hue] = (acc[c.hue] || 0) + 1;
      return acc;
    }, {}),
    colors: colors.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameJa: c.nameJa,
      meaning: c.meaning,
      hex: c.hex,
      hue: c.hue,
      paletteCount: c.paletteCount,
      url: `${siteUrl}colors/${c.slug}/`,
      api: `${siteUrl}api/colors/${c.slug}.json`,
    })),
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "Sanzo Wada (1933) — derived from 348 Wada plates + 30 editorial palettes",
    feed: `${siteUrl}feed.xml`,
    indexHtml: `${siteUrl}colors/`,
    csv: `${siteUrl}data/colors.csv`,
    glossary: `${siteUrl}learn/japanese-color-glossary/`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
