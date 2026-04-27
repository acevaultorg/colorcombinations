import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";
import { allColors } from "@/data/colors";
import { collections } from "@/data/collections";

/**
 * /api/index.json — top-level discoverability map.
 *
 * Single endpoint that enumerates every machine-readable surface on the
 * site: index endpoints (palettes/colors/collections/learn) + per-record
 * URL templates + CSV downloads + feed + OG matrix templates.
 *
 * For new LLM/syndication consumers — fetch /api/index.json once, learn
 * the entire API surface without scraping HTML.
 *
 * Schema: `colorcombinations-api-index/v1`. CC-BY-4.0. CORS-enabled.
 */

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";

  const body = {
    schema: "colorcombinations-api-index/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    summary: {
      palettes: allPalettes().length,
      colors: allColors().length,
      collections: collections.length,
      learnArticles: 6,
    },
    indexes: {
      palettes: `${siteUrl}api/palettes.json`,
      colors: `${siteUrl}api/colors.json`,
      collections: `${siteUrl}api/collections.json`,
      learn: `${siteUrl}api/learn.json`,
      random: `${siteUrl}api/random.json`,
    },
    perRecordTemplates: {
      palette: `${siteUrl}api/palettes/{slug}.json`,
      color: `${siteUrl}api/colors/{slug}.json`,
      collection: `${siteUrl}api/collections/{slug}.json`,
      hue: `${siteUrl}api/hue/{hue}.json`,
    },
    bulkDownloads: {
      palettes_csv: `${siteUrl}data/palettes.csv`,
      colors_csv: `${siteUrl}data/colors.csv`,
      collections_csv: `${siteUrl}data/collections.csv`,
      data_hub: `${siteUrl}data/`,
    },
    discoveryDocs: {
      sitemap: `${siteUrl}sitemap-index.xml`,
      llmsTxt: `${siteUrl}llms.txt`,
      robotsTxt: `${siteUrl}robots.txt`,
      feed: `${siteUrl}feed.xml`,
    },
    openGraphTemplates: {
      palette: `${siteUrl}og/{slug}.svg`,
      color: `${siteUrl}og/colors/{slug}.svg`,
      collection: `${siteUrl}og/collections/{slug}.svg`,
      hue: `${siteUrl}og/hue/{hue}.svg`,
      learn: `${siteUrl}og/learn/{slug}.svg`,
    },
    embedTemplates: {
      palette: `${siteUrl}embed/{slug}/`,
      color: `${siteUrl}embed/colors/{slug}/`,
      collection: `${siteUrl}embed/collection/{slug}/`,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "Sanzo Wada (1933) — Dictionary of Color Combinations + 30 editorial palettes",
    contactEmail: "contact@colorcombinations.org",
    schemas: {
      "colorcombinations-palette-index/v1": "List of all palettes",
      "colorcombinations-color-index/v1": "List of all named colors",
      "colorcombinations-collection-index/v1": "List of all collections",
      "colorcombinations-learn-index/v1": "List of all /learn editorial articles",
      "colorcombinations-palette/v1": "Per-palette detail",
      "colorcombinations-color/v1": "Per-color detail",
      "colorcombinations-collection/v1": "Per-collection detail",
      "colorcombinations-random/v1": "Random-discovery sample across all 3 datasets (reshuffles each build; HTML companion at /random/)",
      "colorcombinations-hue/v1": "Per-hue-family aggregate: every color in the hue + dominant-hue palettes + matching collections (HTML companion at /colors/hue/[hue]/)",
    },
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
