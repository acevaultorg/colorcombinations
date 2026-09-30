import type { APIRoute } from "astro";
import { allPalettes, editorialPalettes, wadaCatalog } from "@data/palettes";
import { allColors } from "@data/colors";
import { collections } from "@data/collections";
import { commonColors, contexts, palettesFor, pairingPaths, MIN_PALETTES } from "@data/pairings";
import { allPaintings } from "@data/paintings";
import { PAIRS } from "@data/converterPairs";
import { FURTHER_READING } from "@/config/monetization";

/**
 * /llms.txt — built from the site's own data on every build (2026-09-30).
 *
 * Replaces the hand-written public/llms.txt, last touched 2026-04-26, which had
 * drifted from the site: it described 5 /learn articles (there are 15), 60
 * collections in one place and 69 in another, and never mentioned
 * /colors-that-go-with/ — the largest page family on the site (756 pages) and
 * the one that answers the question AI assistants are asked most ("what colors
 * go with sage green?"). Every count below is computed, every title is read
 * from the page source, so the file cannot drift again. Nothing is invented.
 *
 * Built by `astro build` itself, so the GitLab CI path (`npx astro build`, no
 * post-build scripts) ships it too.
 */

const SITE = "https://colorcombinations.org";

// Title + description as each page declares them. Only plain string literals
// are read; a page whose title is computed falls back to its slug.
const sources = import.meta.glob(
  [
    "./learn/*/index.astro",
    "./compare/*.astro",
    "./tools/*/index.astro",
    "./trends/*.astro",
    "./data/*.astro",
    "./color-psychology.astro",
    "./material-design/index.astro",
    "./accessibility/*/index.astro",
  ],
  { query: "?raw", import: "default", eager: true },
) as Record<string, string>;

function literal(src: string, name: string): string | null {
  const value = `(?:\\n\\s*)?(?:"([^"\\n]+)"|'([^'\\n]+)')`;
  // `const title = "…"` in the frontmatter, or `title="…"` on the page's own
  // <BaseLayout> tag — never a prop on a component further down the page.
  const fromConst = src.match(new RegExp(`const ${name}\\s*=\\s*${value}`));
  const layoutTag = src.match(/<BaseLayout\b[^>]*>/)?.[0] ?? "";
  const fromLayout = layoutTag.match(new RegExp(`\\b${name}=${value}`));
  const m = fromConst ?? fromLayout;
  return m ? (m[1] ?? m[2]).trim() : null;
}

function pageUrl(file: string): string {
  return (
    "/" +
    file
      .replace(/^\.\//, "")
      .replace(/\/index\.astro$/, "/")
      .replace(/\.astro$/, "/")
  );
}

function slugLabel(url: string): string {
  const last = url.split("/").filter(Boolean).pop() ?? url;
  return last
    .split("-")
    .map((w) => (w === "wcag" ? "WCAG" : w.charAt(0).toUpperCase() + w.slice(1)))
    .join(" ");
}

// Pages whose <title> is computed at build time (so there is no literal to read).
// Wording is taken from each page's own title and description.
const COMPUTED_TITLES: Record<string, string> = {
  "/trends/color-trends-2026/":
    "The 2026 Colors of the Year side by side — Pantone Cloud Dancer, Benjamin Moore Silhouette, Behr Hidden Gem, Sherwin-Williams Universal Khaki and more",
  "/data/sanzo-wada-wcag-contrast/":
    "Data study: how many of Sanzo Wada's 1933 color pairs pass WCAG AA contrast, with tables and a CSV",
};

function section(prefix: string): string[] {
  return Object.entries(sources)
    .map(([file, src]) => ({ url: pageUrl(file), src }))
    .filter(({ url }) => url.startsWith(prefix) && url !== prefix)
    .sort((a, b) => a.url.localeCompare(b.url))
    .map(({ url, src }) => {
      const title = literal(src, "title") ?? COMPUTED_TITLES[url] ?? slugLabel(url);
      const description = literal(src, "description");
      return `- ${SITE}${url} — ${title}${description ? `. ${description}` : ""}`;
    });
}

export const GET: APIRoute = () => {
  const palettes = allPalettes();
  const wada = wadaCatalog().length;
  const editorial = editorialPalettes().length;
  const colors = allColors();
  const paintings = allPaintings();
  const leafPairings = pairingPaths().length;
  const hubs = commonColors.filter((c) =>
    contexts.some((ctx) => palettesFor(c.hex, ctx).length >= MIN_PALETTES),
  );
  const usedContexts = contexts.filter((ctx) =>
    commonColors.some((c) => palettesFor(c.hex, ctx).length >= MIN_PALETTES),
  );
  const hues = ["red", "orange", "yellow", "brown", "pink", "green", "blue", "purple", "neutral"];

  const lines: string[] = [
    "# The Dictionary of Color Combinations",
    "",
    `> Free, searchable archive of color combinations: all ${wada} combinations from Sanzo Wada's 1933 Japanese color dictionary plus ${editorial} editorial palettes (${palettes.length} in total), ${colors.length} named colors, ${hubs.length} "colors that go with" pairing guides, and free in-browser color tools. Every color has its hex code; pages are static HTML and need no JavaScript to read.`,
    "",
    "## Common questions this site answers",
    "",
    `- "What colors go with X?" — ${SITE}/colors-that-go-with/ has a guide for each of ${hubs.length} everyday colors (sage green, navy, terracotta, beige, burgundy and more, plus the 2026 Colors of the Year), and ${leafPairings} setting-specific pages such as walls, bedrooms, weddings and outfits. URL pattern: /colors-that-go-with/{color}/ and /colors-that-go-with/{color}/{setting}/.`,
    `- "Show me [red / blue / green…] color combinations" — ${SITE}/colors/{hue}/ for ${hues.join(", ")}.`,
    `- "What is the hex code for a Japanese color name?" — ${SITE}/colors/{name}/ for each of ${colors.length} named colors (e.g. /colors/shu/, /colors/ai/), each listing every palette that uses it.`,
    `- "Give me a [japandi / cottagecore / coastal…] color palette" — ${SITE}/collections/{theme}/, ${collections.length} themed collections.`,
    `- "What was Sanzo Wada's Dictionary of Color Combinations?" — ${SITE}/about/ and ${SITE}/methodology/.`,
    "",
    "## Pairing guides (colors that go with…)",
    "",
    ...hubs.map((c) => `- ${SITE}/colors-that-go-with/${c.slug}/ — Colors that go with ${c.name} (${c.hex})`),
    "",
    `Settings covered: ${usedContexts.map((ctx) => ctx.label.replace(/^an? /, "")).join(", ")}.`,
    "",
    "## Palettes, colors and collections",
    "",
    `- ${SITE}/browse/ — all ${palettes.length} palettes, filterable by hue, era, mood and number of colors.`,
    `- ${SITE}/palettes/{slug}/ — one page per palette: swatches, hex and RGB values, contrast checks, Japanese color names.`,
    `- ${SITE}/colors/ — ${colors.length} named colors grouped by hue family.`,
    `- ${SITE}/collections/ — ${collections.length} collections:`,
    ...collections.map((c) => `  - ${SITE}/collections/${c.slug}/ — ${c.title}: ${c.tagline}`),
    `- ${SITE}/paintings/ — palettes sampled from ${paintings.length} public-domain paintings.`,
    `- ${SITE}/glossary/ — plain definitions of the color and design terms used across the site.`,
    `- ${SITE}/random/ — a random palette from the archive.`,
    `- ${SITE}/de/farben-kombinieren/ — German-language pairing guide (Welche Farben passen zusammen?).`,
    `- ${SITE}/feed.xml — RSS feed.`,
    "",
    "## Articles",
    "",
    ...section("/learn/"),
    ...section("/trends/"),
    ...section("/compare/"),
    ...section("/color-psychology/"),
    ...section("/material-design/"),
    ...section("/accessibility/"),
    ...section("/data/"),
    "",
    "## Free tools",
    "",
    ...section("/tools/"),
    `- ${SITE}/tools/color-converter/{pair}/ — ${PAIRS.length} single-conversion pages (e.g. hex-to-rgb, rgb-to-cmyk).`,
    "",
    "## Books",
    "",
    `- ${SITE}/books/ — ${FURTHER_READING.length} books on color, including the Seigensha reprint of Wada's dictionary. Book links are Amazon affiliate links.`,
    "",
    "## Machine-readable data",
    "",
    `- ${SITE}/api/index.json — map of every JSON endpoint.`,
    `- ${SITE}/api/palettes.json, /api/colors.json, /api/collections.json — full indexes; per-record JSON at /api/palettes/{slug}.json, /api/colors/{slug}.json, /api/collections/{slug}.json, /api/hue/{hue}.json.`,
    `- ${SITE}/data/palettes.csv, /data/colors.csv, /data/collections.csv — bulk CSV downloads.`,
    `- ${SITE}/sitemap-index.xml — full sitemap.`,
    "",
    "## Source and license",
    "",
    "- Primary source: Sanzo Wada, A Dictionary of Color Combinations (1933). Modern reprint: Seigensha Art Publishing.",
    "- The Wada combinations are derived from the mattdesl/dictionary-of-colour-combinations dataset (MIT license).",
    `- The ${editorial} editorial palettes are original compositions in the same tradition.`,
    "- Site content (palette titles, hex codes, curation): CC BY 4.0, attribution colorcombinations.org.",
    "",
    "## Contact",
    "",
    "hello@caslonmedia.com",
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
