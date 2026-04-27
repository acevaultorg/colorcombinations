import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";
import { allColors } from "@/data/colors";
import { collections } from "@/data/collections";

/**
 * /api/random.json — random-discovery endpoint for LLM + programmatic clients.
 *
 * Static-export caveat: this file is generated once per build, so the
 * "selection" sample is fixed for that deploy. The `slugs` arrays are the
 * full archive — consumers that want true client-side randomness pick
 * from those. The HTML companion at `/random/` does live JS-random
 * redirect for human visitors.
 *
 * Why ship this: dataset_json_api × +70 archetype. Three first-class
 * datasets (palettes / colors / collections) exposed in one zero-friction
 * endpoint. Pairs with `/random/` HTML so LLM citations have both an HTML
 * permalink AND a structured-data twin.
 *
 * Schema: `colorcombinations-random/v1`. CC-BY-4.0. CORS-enabled.
 */

/** Deterministic Fisher–Yates using a tiny PRNG seeded from the build time
 *  so successive deploys give a different sample without depending on the
 *  Math.random call sequence. Reproducible per-build, varied across builds.
 */
function shuffle<T>(input: readonly T[], seed: number): T[] {
  const out = input.slice();
  let s = seed >>> 0 || 1;
  for (let i = out.length - 1; i > 0; i--) {
    // xorshift32
    s ^= s << 13; s >>>= 0;
    s ^= s >>> 17;
    s ^= s << 5; s >>>= 0;
    const j = s % (i + 1);
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

const SAMPLE_SIZE = 20;

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";
  const generatedISO = new Date().toISOString();
  const seed = Date.now() & 0x7fffffff;

  const palettes = allPalettes();
  const colors = allColors();
  const allCollections = collections;

  const paletteSample = shuffle(palettes, seed).slice(0, SAMPLE_SIZE);
  const colorSample = shuffle(colors, seed ^ 0x9e3779b1).slice(0, SAMPLE_SIZE);
  const collectionSample = shuffle(allCollections, seed ^ 0x6a09e667).slice(0, SAMPLE_SIZE);

  const body = {
    schema: "colorcombinations-random/v1",
    generated: generatedISO,
    note:
      "This endpoint reshuffles every build. Each build serves a fixed sample for caching. " +
      "For true client-side randomness pick from the `slugs.*` arrays below or hit /api/palettes.json / " +
      "/api/colors.json / /api/collections.json directly. For an HTML random-redirect for human visitors, " +
      "use /random/.",
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    htmlCompanion: `${siteUrl}random/`,
    counts: {
      palettes: palettes.length,
      colors: colors.length,
      collections: allCollections.length,
    },
    sampleSize: SAMPLE_SIZE,
    selection: {
      palettes: paletteSample.map((p) => ({
        slug: p.slug,
        title: p.title,
        titleJa: p.titleJa,
        colors: p.colors.map((c) => c.hex),
        url: `${siteUrl}palettes/${p.slug}/`,
        api: `${siteUrl}api/palettes/${p.slug}.json`,
      })),
      colors: colorSample.map((c) => ({
        slug: c.slug,
        name: c.name,
        nameJa: c.nameJa,
        hex: c.hex,
        hue: c.hue,
        url: `${siteUrl}colors/${c.slug}/`,
        api: `${siteUrl}api/colors/${c.slug}.json`,
      })),
      collections: collectionSample.map((c) => ({
        slug: c.slug,
        title: c.title,
        tagline: c.tagline,
        accentHex: c.accentHex,
        url: `${siteUrl}collections/${c.slug}/`,
        api: `${siteUrl}api/collections/${c.slug}.json`,
      })),
    },
    slugs: {
      palettes: palettes.map((p) => p.slug),
      colors: colors.map((c) => c.slug),
      collections: allCollections.map((c) => c.slug),
    },
    indexes: {
      palettes: `${siteUrl}api/palettes.json`,
      colors: `${siteUrl}api/colors.json`,
      collections: `${siteUrl}api/collections.json`,
      top: `${siteUrl}api/index.json`,
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
