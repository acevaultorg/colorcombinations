import type { APIRoute } from "astro";
import { colorsByHue } from "@/data/colors";
import { allPalettes } from "@/data/palettes";
import { collections } from "@/data/collections";
import type { DominantHue } from "@/types/palette";

/**
 * Per-hue JSON API — /api/hue/[hue].json
 *
 * Machine-readable counterpart to /colors/hue/[hue]/ HTML hub pages.
 * One endpoint per hue family (red/orange/yellow/brown/pink/green/
 * blue/purple/neutral). Returns:
 *   - every named color in the hue family (with hex, paletteCount, urls)
 *   - every Wada palette dominant in that hue (with colors[], urls)
 *   - matching curated collections (slug, title, accentHex, urls)
 *   - cross-links to other 8 hue families
 *
 * Schema: `colorcombinations-hue/v1`. CC-BY-4.0. CORS-enabled.
 *
 * Archetype: dataset_json_api × +70. Pairs with HTML hub pages shipped in
 * PR #86 to complete the LLM-readable surface for hue-family discovery.
 */

const HUES: DominantHue[] = [
  "red", "orange", "yellow", "brown", "pink",
  "green", "blue", "purple", "neutral",
];

const HUE_LEDE: Record<DominantHue, string> = {
  red: "Crimson, vermillion, madder — the most historically loaded reds in Japanese tradition.",
  orange: "Persimmon, tangerine, amber — Japanese orange between red ceremony and yellow sunlight.",
  yellow: "Yamabuki, ukon, kariyasu — luminous yellows from mustard to pale gold.",
  brown: "Tobi, kogecha, kuri — rich earth-tones from kite-brown to burnt cedar.",
  pink: "Sakura, nadeshiko, usubeni — the full nuanced range of Japanese pink.",
  green: "Moegi, matsuba, tokiwa — botanical greens from young bamboo to evergreen.",
  blue: "Sora, asagi, hanada, ruri, kon — the full Japanese blue spectrum.",
  purple: "Murasaki, kikyo, fuji — purples from imperial robe to wisteria petal.",
  neutral: "Gofun, kinari, nezumi, sumi, gin — the chalk-to-ink spectrum of Japanese neutrals.",
};

export function getStaticPaths() {
  // getStaticPaths runs in isolated scope per Astro docs.
  const hues = ["red", "orange", "yellow", "brown", "pink", "green", "blue", "purple", "neutral"];
  return hues.map((hue) => ({ params: { hue } }));
}

export const GET: APIRoute = ({ params, site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";
  const hue = (params.hue ?? "") as DominantHue;
  if (!HUES.includes(hue)) {
    return new Response(
      JSON.stringify({ error: "Hue family not found", hue: params.hue ?? null, validHues: HUES }, null, 2),
      { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  const huesMap = colorsByHue();
  const colors = huesMap.get(hue) ?? [];
  const palettes = allPalettes().filter((p) => p.dominantHue === hue);
  const matchingCollections = collections.filter((c) =>
    c.slug === hue || (c.keywords ?? []).some((k) => k.toLowerCase().includes(hue))
  );

  const body = {
    schema: "colorcombinations-hue/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    hue,
    lede: HUE_LEDE[hue],
    counts: {
      colors: colors.length,
      palettes: palettes.length,
      collections: matchingCollections.length,
    },
    urls: {
      canonical: `${siteUrl}colors/hue/${hue}/`,
      api: `${siteUrl}api/hue/${hue}.json`,
      openGraph: `${siteUrl}og/hue/${hue}.svg`,
    },
    colors: colors.map((c) => ({
      slug: c.slug,
      name: c.name,
      nameJa: c.nameJa,
      hex: c.hex,
      paletteCount: c.paletteCount,
      url: `${siteUrl}colors/${c.slug}/`,
      api: `${siteUrl}api/colors/${c.slug}.json`,
    })),
    palettes: palettes.map((p) => ({
      slug: p.slug,
      title: p.title,
      titleJa: p.titleJa,
      colors: p.colors.map((col) => col.hex),
      url: `${siteUrl}palettes/${p.slug}/`,
      api: `${siteUrl}api/palettes/${p.slug}.json`,
    })),
    collections: matchingCollections.map((c) => ({
      slug: c.slug,
      title: c.title,
      tagline: c.tagline,
      accentHex: c.accentHex,
      url: `${siteUrl}collections/${c.slug}/`,
      api: `${siteUrl}api/collections/${c.slug}.json`,
    })),
    otherHues: HUES.filter((h) => h !== hue).map((h) => ({
      hue: h,
      url: `${siteUrl}colors/hue/${h}/`,
      api: `${siteUrl}api/hue/${h}.json`,
    })),
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "Sanzo Wada (1933) — Dictionary of Color Combinations",
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
