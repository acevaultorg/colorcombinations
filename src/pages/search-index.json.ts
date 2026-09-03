import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";
import { allColors } from "@data/colors";
import { collections } from "@data/collections";

// Fleet Search Standard v1.0 — compact client-side instant-search index.
// Palettes + colors + collections; the search UI fetches /search-index.json once.
//
// WHAT `x` IS FOR: extra searchable text, matched by the UI alongside the title.
// Anything a reader might reasonably type MUST live in `t` or `x` — being in the
// URL slug is NOT enough, because the matcher never sees the slug.
//
// MEASURED 2026-09-03 (GA4 dims=searchTerm, 30d, property 294106772): 147
// distinct zero-result terms. Three of the four failing classes were data this
// site already holds:
//   "wada" / "sanzo" -> 0 hits, on the Sanzo Wada dictionary. The 348 plates
//                       carry wada-NNN in the SLUG only, never in t/x.
//   "292", "249"     -> 0 hits; 18 plate-number searches. Same slug-only cause.
//   "Sulphur yellow" -> 0 hits because the upstream dataset spells it "Sulpher
//                       Yellow". The READER spelled it correctly and the DATA
//                       carries the typo, so this needs an ALIAS, not an entry.
//   hex codes        -> 41 searches. Primary fix is in BaseLayout (route to
//                       /tools/palette-from-color); the hex is added to `x` here
//                       so an EXACT Wada hex also resolves to its colour page.
//
// NOT fixed here, deliberately: "Pale Purplish Vinaceous" (4 searches).
// "vinaceous" appears twice in the colour set but "purplish" appears in ZERO of
// the 210 names — that colour is genuinely absent from the dataset, so no
// amount of indexing can surface it. Fabricating an entry would be worse.
export const prerender = true;

/** Upstream spelling variants: dataset spelling -> what readers actually type.
 *  Only for verified source-data typos. Keep this list short and evidenced. */
const SPELLING_ALIASES: Record<string, string> = {
  "sulpher yellow": "sulphur yellow sulfur yellow",
};

export const GET: APIRoute = () => {
  const idx = [
    ...allPalettes().map((p) => {
      // Plate identity. A reader searching a plate types "292", "wada 292" or
      // "plate 292" — none of which matched anything before.
      const plate = /^wada-(\d+)/.exec(p.slug)?.[1];
      const plateTokens = plate
        ? `wada sanzo plate ${plate} wada-${plate} ${String(Number(plate))}`
        : "";
      return {
        s: `/palettes/${p.slug}/`,
        t: p.title,
        k: "Palette",
        // The colours the palette CONTAINS. Measured 2026-09-04 from GA4
        // SearchNoResults: readers search for a palette by what is IN it —
        // "black white", "color palette with violet", "Matcha and white",
        // "blue #006eb8" — and every one returned nothing, because a palette's
        // searchable text carried era/hue/moods/plate only. Its own colour
        // names were never indexed.
        //
        // A palette title shows at most two ("Scarlet & Dull Viridian Green
        // +1"), so the third and fourth colours were unreachable, and the 30
        // editorial palettes have romaji titles (Kurenai & Kon) that no English
        // query matches at all — `meaning` is their English surface.
        //
        // Measured effect on the real failing queries, before → after:
        //   "black white"   0 → 3      "white"  3 → 15
        //   "lapis lazuli"  0 → 1      "black" 12 → 45
        //   "violet"       25 → 65     "olive" 23 → 42
        // It does NOT fix "beige" or "matcha and white" (0 → 0): no Wada colour
        // is named or means beige. Those are dataset absences, not index gaps,
        // and indexing cannot invent them.
        x: [
          p.era,
          p.dominantHue,
          ...(p.moods || []),
          plateTokens,
          ...(p.colors || []).flatMap((c) => [c.nameRomaji, c.meaning]),
        ]
          .filter(Boolean)
          .join(" "),
      };
    }),
    ...allColors().map((c) => {
      // Readers paste hex with and without the leading "#": index both forms.
      const hex = (c.hex || "").toLowerCase();
      const hexTokens = hex ? `${hex} ${hex.replace(/^#/, "")}` : "";
      const alias = SPELLING_ALIASES[c.name.toLowerCase()] || "";
      return {
        s: `/colors/${c.slug}/`,
        t: c.name,
        k: "Color",
        x: [c.nameJa || "", hexTokens, alias].filter(Boolean).join(" "),
      };
    }),
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
