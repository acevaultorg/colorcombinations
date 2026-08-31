/**
 * explorer.json.ts — compact dataset for the homepage combination explorer.
 *
 * Emitted at build time as /data/explorer.json and lazy-fetched on the first
 * swatch click (never on page load — zero CWV cost). Shape is index-packed to
 * keep the payload small:
 *   { c: [{ n, h, p: [paletteIndex…] }…],   // every archive color
 *     p: [{ s, t, h: [hex…] }…] }           // every palette, index-addressed
 */
import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";
import { allColors } from "@/data/colors";

export const GET: APIRoute = () => {
  const palettes = allPalettes();
  const slugIndex = new Map(palettes.map((p, i) => [p.slug, i] as const));
  const p = palettes.map((pl) => ({
    s: pl.slug,
    t: pl.title,
    h: pl.colors.map((c) => c.hex),
  }));
  const c = allColors().map((e) => ({
    n: e.name,
    h: e.hex,
    p: e.paletteSlugs
      .map((s) => slugIndex.get(s))
      .filter((i): i is number => i !== undefined),
  }));
  return new Response(JSON.stringify({ c, p }), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
