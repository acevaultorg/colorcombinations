import type { APIRoute } from "astro";

/**
 * /api/learn.json — programmatic index of /learn editorial articles.
 *
 * Mirror of /learn/ index page in machine-readable form. Lists all
 * pillar articles + reference glossary with metadata (title, slug,
 * canonical URL, OG card URL, reading time, tags, suggested order
 * position). For LLM citation pipelines, content syndication tools,
 * and Wikipedia-citable bulk extraction.
 *
 * Schema: `colorcombinations-learn-index/v1` — bumped on breaking changes.
 * License: CC-BY-4.0. Source: colorcombinations.org editorial.
 */

interface LearnArticle {
  /** URL-safe slug of the article */
  slug: string;
  /** Article type — pillar (one of the 5 canonical) or reference */
  type: "pillar" | "reference";
  /** Position in the canonical reading order (1-5 for pillars; null for reference) */
  readingOrder: number | null;
  /** Display title */
  title: string;
  /** One-line description / blurb */
  description: string;
  /** Eyebrow / category tag */
  eyebrow: string;
  /** Approximate reading time */
  readingTime: string;
  /** Topic tags */
  tags: ReadonlyArray<string>;
  /** Word count (approximate) */
  wordCount: number;
  /** Canonical absolute URL */
  url: string;
  /** Per-article OG card URL (if available) */
  openGraph: string;
  /** ISO 8601 first-published timestamp */
  datePublished: string;
}

const ARTICLES: ReadonlyArray<LearnArticle> = [
  {
    slug: "heian-court-color-theory",
    type: "pillar",
    readingOrder: 1,
    title: "Heian Court Color Theory: Kasane, Kinjiki, and the Seasonal Palette",
    description:
      "How the Heian imperial court (794-1185) systematised colour into layered-robe combinations (kasane no irome), forbidden pigments (kinjiki), and a 12-month seasonal calendar.",
    eyebrow: "The historical foundation",
    readingTime: "5 min",
    tags: ["Heian", "Imperial", "Kasane"],
    wordCount: 720,
    url: "https://colorcombinations.org/learn/heian-court-color-theory/",
    openGraph: "https://colorcombinations.org/og/learn/heian-court-color-theory.svg",
    datePublished: "2026-04-25T00:00:00Z",
  },
  {
    slug: "japanese-reds",
    type: "pillar",
    readingOrder: 2,
    title: "The Four Reds: Kurenai, Akane, Shu, Entan",
    description:
      "Why Japanese tradition distinguishes safflower crimson from madder from vermilion from lead red — and which to reach for when the brief asks for 'a Japanese red.'",
    eyebrow: "The named pigments",
    readingTime: "5 min",
    tags: ["Reds", "Pigments", "Heian"],
    wordCount: 740,
    url: "https://colorcombinations.org/learn/japanese-reds/",
    openGraph: "https://colorcombinations.org/og/learn/japanese-reds.svg",
    datePublished: "2026-04-25T00:00:00Z",
  },
  {
    slug: "wabi-sabi-color-theory",
    type: "pillar",
    readingOrder: 3,
    title: "Wabi-Sabi Color Theory: The Beauty of Things That Have Aged",
    description:
      "What it actually means for color when a tradition values age over newness, asymmetry over balance, and imperfection over polish. Tea-room palette, three exemplars, anti-patterns.",
    eyebrow: "The source philosophy",
    readingTime: "5 min",
    tags: ["Wabi-Sabi", "Tea Ceremony", "Japanese"],
    wordCount: 720,
    url: "https://colorcombinations.org/learn/wabi-sabi-color-theory/",
    openGraph: "https://colorcombinations.org/og/learn/wabi-sabi-color-theory.svg",
    datePublished: "2026-04-25T00:00:00Z",
  },
  {
    slug: "japandi-color-theory",
    type: "pillar",
    readingOrder: 4,
    title: "Japandi Color Theory: Where Restraint Meets Light",
    description:
      "How Japanese and Scandinavian color traditions converge — and which palettes from the Wada dictionary actually fit the Japandi brief. Three palettes, three anti-patterns, the three-axis test.",
    eyebrow: "The modern fusion",
    readingTime: "5 min",
    tags: ["Japandi", "Wabi-Sabi", "Scandinavian"],
    wordCount: 720,
    url: "https://colorcombinations.org/learn/japandi-color-theory/",
    openGraph: "https://colorcombinations.org/og/learn/japandi-color-theory.svg",
    datePublished: "2026-04-25T00:00:00Z",
  },
  {
    slug: "scandinavian-color-theory",
    type: "pillar",
    readingOrder: 5,
    title: "Scandinavian Color Theory: A Working Guide",
    description:
      "What Scandinavian color tradition actually is — beyond IKEA-white — plus the hygge divergence, three palettes from the dictionary that fit, and the all-grey trap to avoid.",
    eyebrow: "The Western half of the fusion",
    readingTime: "5 min",
    tags: ["Scandinavian", "Hygge", "Nordic"],
    wordCount: 760,
    url: "https://colorcombinations.org/learn/scandinavian-color-theory/",
    openGraph: "https://colorcombinations.org/og/learn/scandinavian-color-theory.svg",
    datePublished: "2026-04-25T00:00:00Z",
  },
  {
    slug: "japanese-color-glossary",
    type: "reference",
    readingOrder: null,
    title: "Japanese Color Glossary: 20 Traditional Named Colors",
    description:
      "Twenty canonical traditional Japanese colour names — kurenai, akane, shu, entan, murasaki, ai, asagi, ruri, tokiwa, kon, kuro, yamabuki, tobi, kogecha, sumi, gofun, seiji, hanada, kaki, kinari — with pigment origin and modern usage. Anchored for deep-link citation.",
    eyebrow: "Reference · Glossary",
    readingTime: "12 min",
    tags: ["Glossary", "Reference", "Named colors"],
    wordCount: 2400,
    url: "https://colorcombinations.org/learn/japanese-color-glossary/",
    openGraph: "https://colorcombinations.org/og/learn/japanese-color-glossary.svg",
    datePublished: "2026-04-26T00:00:00Z",
  },
];

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";

  const body = {
    schema: "colorcombinations-learn-index/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    suggestedReadingOrder: [
      "heian-court-color-theory",
      "japanese-reds",
      "wabi-sabi-color-theory",
      "japandi-color-theory",
      "scandinavian-color-theory",
    ],
    counts: {
      total: ARTICLES.length,
      pillars: ARTICLES.filter((a) => a.type === "pillar").length,
      references: ARTICLES.filter((a) => a.type === "reference").length,
    },
    articles: ARTICLES,
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "colorcombinations.org editorial",
    feed: `${siteUrl}feed.xml`,
    indexHtml: `${siteUrl}learn/`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
