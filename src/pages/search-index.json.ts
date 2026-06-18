import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";
import { allColors } from "@data/colors";
import { collections } from "@data/collections";

// Fleet Search Standard v1.0 — compact client-side instant-search index.
// Palettes + colors + collections; the search UI fetches /search-index.json once.
export const prerender = true;

export const GET: APIRoute = () => {
  const idx = [
    ...allPalettes().map((p) => ({
      s: `/palettes/${p.slug}/`,
      t: p.title,
      k: "Palette",
      x: [p.era, p.dominantHue, ...(p.moods || [])].filter(Boolean).join(" "),
    })),
    ...allColors().map((c) => ({
      s: `/colors/${c.slug}/`,
      t: c.name,
      k: "Color",
      x: c.nameJa || "",
    })),
    ...collections.map((c) => ({
      s: `/collections/${c.slug}/`,
      t: c.title,
      k: "Collection",
      x: "",
    })),
  ];
  return new Response(JSON.stringify(idx), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
  });
};
