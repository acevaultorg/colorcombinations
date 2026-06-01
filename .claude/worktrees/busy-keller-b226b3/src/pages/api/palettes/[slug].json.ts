/**
 * Per-palette JSON API — /api/palettes/[slug].json
 *
 * Machine-readable counterpart to /palettes/[slug]/ HTML pages. Built once
 * at deploy time, cached at the edge. Feeds:
 *   1. LLM crawlers (GPTBot/ClaudeBot/PerplexityBot) — extractable structured
 *      data for citations; cheaper to parse than HTML.
 *   2. Third-party apps that want to pull a palette by slug without scraping.
 *   3. Our own future Figma/Raycast plugin and embeddable widget fetches.
 *
 * Per rules/bot-harvest.md Part 4 Pattern 3 + Aleyda Solis 10-characteristic
 * checklist (#4 Extractable). Archetype: dataset_json_api × +70.
 */

import type { APIRoute } from "astro";
import { allPalettes, paletteBySlug } from "@/data/palettes";

export function getStaticPaths() {
  return allPalettes().map((p) => ({ params: { slug: p.slug } }));
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const palette = paletteBySlug(slug);
  if (!palette) {
    return new Response(
      JSON.stringify({ error: "Palette not found", slug }, null, 2),
      {
        status: 404,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  }

  const siteUrl = "https://colorcombinations.org";

  // Public-friendly shape: stable, documented, versioned.
  // Breaking changes bump `schema` → consumers can version against it.
  const body = {
    schema: "colorcombinations-palette/v1",
    slug: palette.slug,
    title: palette.title,
    titleJa: palette.titleJa ?? null,
    summary: palette.summary,
    dominantHue: palette.dominantHue,
    moods: palette.moods,
    era: palette.era ?? null,
    tags: palette.tags ?? [],
    colors: palette.colors.map((c) => ({
      hex: c.hex,
      nameRomaji: c.nameRomaji ?? null,
      nameJa: c.nameJa ?? null,
      meaning: c.meaning ?? null,
    })),
    urls: {
      canonical: `${siteUrl}/palettes/${palette.slug}/`,
      embed: `${siteUrl}/embed/${palette.slug}/`,
      openGraph: `${siteUrl}/og/${palette.slug}.svg`,
      api: `${siteUrl}/api/palettes/${palette.slug}.json`,
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
