import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";
import { allColors } from "@data/colors";
import { collections } from "@data/collections";
import { commonColors, contexts, palettesFor, MIN_PALETTES } from "@data/pairings";
import { PILLAR_LINKS } from "@data/pillarMap";
import { PAIRS, FORMATS } from "@data/converterPairs";
import { allPaintings } from "@data/paintings";

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

/** Everyday names for a pairing hub's colour that its own name does not contain.
 *  Measured 2026-09-28 from GA4 SearchNoResults (08-29..09-27, after the hubs were
 *  indexed on 09-06): "Clay color", "Oxblood", "Moss green", "Soft grey", "Marron",
 *  "Burnt umber", "Paynes grey", "Redwood", "Lime", "Bronze" all returned nothing
 *  while the nearest hub existed. Only close, recognisable neighbours: the result
 *  row still shows the hub's own colour name, so nobody is told moss IS olive. */
const PAIRING_SYNONYMS: Record<string, string> = {
  terracotta: "clay",
  burgundy: "oxblood wine bordeaux",
  "olive-green": "moss",
  gray: "grey gris soft grey light grey",
  "charcoal-grey": "paynes payne slate",
  brown: "marron burnt umber chocolate",
  rust: "redwood copper",
  green: "lime chartreuse",
  gold: "bronze",
};

/** Standalone editorial + tool pages that have no data module of their own.
 *  Long, specific titles only -- see the crowding note in the index below. */
const STANDALONE = [
  { s: "/tools/contrast-checker/", t: "WCAG Contrast Checker", k: "Tool", x: "contrast ratio accessibility aa aaa wcag check" },
  { s: "/tools/color-blindness-simulator/", t: "Color Blindness Simulator — test a palette for CVD", k: "Tool", x: "colorblind deuteranopia protanopia tritanopia simulate" },
  { s: "/tools/palette-from-image/", t: "Color Palette from Image — extract colors in your browser", k: "Tool", x: "extract picture photo upload dominant colours" },
  { s: "/tools/palette-from-color/", t: "Palette Finder — start from one color", k: "Tool", x: "closest wada palettes from a hex single colour" },
  { s: "/tools/gradient-generator/", t: "CSS Gradient Generator — linear & radial", k: "Tool", x: "css gradient linear radial copy code" },
  { s: "/tools/color-converter/", t: "Color Converter — HEX, RGB, HSL, HSV, CMYK, OKLCH", k: "Tool", x: "convert colour code formats" },
  { s: "/trends/color-trends-2026/", t: "Color of the Year 2026 — every pick, compared", k: "Trend", x: "colour of the year 2026 pantone dulux benjamin moore trend" },
  { s: "/trends/color-trends-2027/", t: "The 2027 Colors of the Year — every pick announced so far", k: "Trend", x: "colour of the year 2027 trend forecast" },
  { s: "/glossary/", t: "Color & Design Glossary: 22 terms every palette page uses", k: "Guide", x: "triadic complementary analogous saturation hue chroma definitions" },
  { s: "/color-psychology/", t: "Color Psychology: an honest designer's guide", k: "Guide", x: "meaning emotion feeling colours psychology" },
  { s: "/material-design/", t: "Material Design Color: M2 vs M3, and how to seed a theme", k: "Guide", x: "material you android theme seed tonal palette" },
  { s: "/accessibility/color-blind-tools/", t: "Color-Blind Simulator Tools, Compared", k: "Guide", x: "sim daltonism color oracle nocoffee chromatic vision compare" },
];

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
        // It does NOT fix "matcha and white" (0 → 0): no Wada colour is named or
        // means matcha. That is a genuine dataset absence.
        //
        // CORRECTED 2026-09-06: this comment originally also listed "beige" as
        // a dataset absence ("no Wada colour is named or means beige"). That
        // was true of the WADA PALETTE dataset and was over-generalised to
        // "the site" — the /colors-that-go-with/ pairing engine (@data/pairings,
        // 54 common colours incl. Beige, Burgundy, Emerald Green) has since
        // made it false for those three colours. Fixed by indexing the pairing
        // hubs below (one row per colour, not per leaf — see the block after
        // `collections`), so "beige" now resolves to /colors-that-go-with/beige/.
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
    // "colors that go with X" hubs — indexed as a colour-adjacent entry, one row
    // per colour (NOT per leaf: indexing all 702 [color]/[context] leaves would
    // put 13 near-identical "X — bedroom / X — bathroom / ..." rows ahead of the
    // Wada archive colours for a bare colour-name search, which is the crowding
    // regression this design was picked specifically to avoid).
    ...commonColors
      .filter((c) => contexts.some((ctx) => palettesFor(c.hex, ctx).length >= MIN_PALETTES))
      .map((c) => ({
        s: `/colors-that-go-with/${c.slug}/`,
        t: `Colors that go with ${c.name}`,
        k: "Pairing guide",
        x: [c.name.toLowerCase(), PAIRING_SYNONYMS[c.slug] || "", "pairing", "goes with", "match"].filter(Boolean).join(" "),
      })),
    // ------------------------------------------------------------------
    // Editorial + tool surfaces. Added 2026-09-06 (§E43) after measuring that
    // the index covered ONLY Palette/Color/Collection/Pairing-guide (711 rows)
    // while ~100 real content pages were unreachable from the site's own
    // search -- including /trends/color-trends-2026/, the site's single
    // highest-impression page in Bing. Measured miss: "year" x2 -> 0 results;
    // "contrast checker" -> 0 results; "monet" -> 0 results.
    //
    // 🔴 SECTION INDEX PAGES AND BOILERPLATE ARE DELIBERATELY EXCLUDED, and
    // this is the whole design constraint -- not caution. Ranking scores a
    // title-prefix hit 100 and tie-breaks on SHORTEST TITLE, so a 7-character
    // "Contact" outranks "Coral Red" for the query "co". Simulated against the
    // 226 real successful search terms of the last 30d, adding all 115
    // unindexed pages REGRESSED 10 of them (11 events): "co"/"con" ->
    // /contact/, "pr" -> /privacy/, "Ter" -> /terms/, "bu n" -> /shop/.
    // Dropping the short-titled index/legal pages cut that to 3 events, all of
    // them garbled mid-typing states ("pr i n", "pr i nt", "un"), against 12
    // events gained. Net +9 events/30d, measured, not assumed.
    //
    // So: never add /tools/, /learn/, /books/, /about/, /contact/, /privacy/,
    // /terms/, /shop/, /browse/, /data/ or any other one-word index title here.
    // Deep pages carry long specific titles and do not crowd.
    //
    // Data-driven wherever a module exists (PILLAR_LINKS, PAIRS, allPaintings)
    // so this does not rot as pages are added; only the handful of standalone
    // editorial/tool pages are listed explicitly.
    ...Object.values(PILLAR_LINKS)
      .map((l) => ({ ...l, href: l.href.split("#")[0] }))
      .filter((l, i, a) => a.findIndex((z) => z.href === l.href) === i)
      .map((l) => ({ s: l.href, t: l.title, k: "Guide", x: l.lede })),
    ...PAIRS.map((pr) => ({
      s: `/tools/color-converter/${pr.slug}/`,
      t: `${FORMATS[pr.from].label} to ${FORMATS[pr.to].label} converter`,
      k: "Tool",
      x: `${FORMATS[pr.from].long} ${FORMATS[pr.to].long} convert color code`,
    })),
    ...allPaintings().map((pt) => ({
      s: `/paintings/${pt.slug}/`,
      t: `${pt.title} — palette`,
      k: "Painting",
      x: `${pt.artist} ${pt.year} painting colors`,
    })),
    ...STANDALONE,
  ];
  return new Response(JSON.stringify(idx), {
    headers: { "Content-Type": "application/json", "Cache-Control": "public, max-age=3600" },
  });
};
