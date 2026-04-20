import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";
import { collections, paletteSetForCollection } from "@data/collections";

/**
 * GET /api/v1/commercial-snapshot.json — full-archive snapshot for the
 * Commercial License tier.
 *
 * Fetched internally by the CF Pages Function at /functions/api/v1/bulk.ts
 * after it verifies a Gumroad license key. Emitted `noindex`; not linked
 * publicly. Commercial customers hit /api/v1/bulk (authenticated) — the
 * Function proxies this file to them on verify success.
 *
 * Not cryptographically gated by itself; the Commercial License is a
 * legal / redistribution-rights agreement + convenience endpoint, not DRM.
 * The per-palette public endpoints remain free for everyone.
 *
 * ~350 KB uncompressed, ~60 KB gzipped.
 */
export const GET: APIRoute = async () => {
  const palettes = allPalettes();
  const body = {
    meta: {
      version: "v1",
      generated: new Date().toISOString().slice(0, 10),
      totalPalettes: palettes.length,
      totalCollections: collections.length,
      license: "Commercial-License subscribers only. https://colorcombinations.org/api-docs/#commercial",
    },
    palettes: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      titleJa: p.titleJa ?? null,
      summary: p.summary,
      description: p.description,
      era: p.era,
      dominantHue: p.dominantHue,
      moods: p.moods,
      tags: p.tags ?? [],
      usage: p.usage ?? [],
      colors: p.colors.map((c) => ({
        hex: c.hex,
        nameJa: c.nameJa ?? null,
        nameRomaji: c.nameRomaji ?? null,
        meaning: c.meaning ?? null,
      })),
      url: `https://colorcombinations.org/palettes/${p.slug}/`,
    })),
    collections: collections.map((c) => ({
      slug: c.slug,
      title: c.title,
      description: c.description.replace(/<[^>]+>/g, ""),
      accentHex: c.accentHex,
      paletteSlugs: paletteSetForCollection(c).map((p) => p.slug),
    })),
  };

  return new Response(JSON.stringify(body), {
    status: 200,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      // Intentionally no Access-Control-Allow-Origin — clients should go
      // through the authenticated /api/v1/bulk endpoint, not here.
      "X-Robots-Tag": "noindex, nofollow",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
};
