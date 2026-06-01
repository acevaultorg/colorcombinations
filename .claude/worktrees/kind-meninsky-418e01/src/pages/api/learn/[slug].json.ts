import type { APIRoute } from "astro";

/**
 * Per-pillar JSON API — /api/learn/[slug].json
 *
 * Machine-readable counterpart to /learn/[slug]/ HTML pages. Returns
 * full article metadata + a structured outline of section headings +
 * key cited Japanese terms (with pronunciation + meaning) so LLM
 * citation pipelines have addressable, machine-extractable depth
 * without HTML scraping.
 *
 * Schema: `colorcombinations-learn/v1`. CC-BY-4.0. CORS-enabled.
 *
 * Archetype: dataset_json_api × +70. Pairs with /learn/[slug]/ HTML to
 * complete the LLM-readable surface for editorial pillars + glossary.
 */

interface Pillar {
  slug: string;
  type: "pillar" | "reference";
  readingOrder: number | null;
  title: string;
  description: string;
  eyebrow: string;
  readingTime: string;
  tags: ReadonlyArray<string>;
  wordCount: number;
  datePublished: string;
  /** Top-level section headings in the article (h2). For TOC + LLM extraction. */
  outline: ReadonlyArray<string>;
  /** Cited terms with pronunciation + meaning — high-citation extractable structure. */
  citedTerms: ReadonlyArray<{ term: string; pronunciation?: string; meaning: string }>;
  /** Cross-links to related pillars + glossary (slug references). */
  relatedSlugs: ReadonlyArray<string>;
}

const PILLARS: ReadonlyArray<Pillar> = [
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
    datePublished: "2026-04-25T00:00:00Z",
    outline: [
      "What kasane no irome actually meant",
      "The forbidden colors (kinjiki)",
      "The 12-month seasonal calendar",
      "Reading Wada plates with Heian eyes",
    ],
    citedTerms: [
      { term: "kasane no irome", pronunciation: "ka-sa-ne no i-ro-me", meaning: "Layered colour combination shown through stacked silk robes." },
      { term: "kinjiki", pronunciation: "kin-ji-ki", meaning: "Forbidden colours reserved for the imperial family by sumptuary law." },
      { term: "murasaki", pronunciation: "mu-ra-sa-ki", meaning: "Purple from the gromwell plant; highest-status Heian colour." },
      { term: "kurenai", pronunciation: "ku-re-na-i", meaning: "Safflower red used for imperial robes and bridal kimono." },
    ],
    relatedSlugs: ["japanese-reds", "japanese-color-glossary"],
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
    datePublished: "2026-04-25T00:00:00Z",
    outline: [
      "Kurenai — safflower crimson",
      "Akane — madder root",
      "Shu — cinnabar lacquer",
      "Entan — lead orange-red",
      "Working framework: which red, when",
    ],
    citedTerms: [
      { term: "kurenai", pronunciation: "ku-re-na-i", meaning: "Safflower-red pigment used for ceremonial silk." },
      { term: "akane", pronunciation: "a-ka-ne", meaning: "Madder-root red — earthier, deeper than kurenai." },
      { term: "shu", pronunciation: "shu", meaning: "Cinnabar (mercury sulfide) lacquer red used on shrine gates." },
      { term: "entan", pronunciation: "en-tan", meaning: "Lead-tetroxide orange-red used on temple architecture and armour." },
    ],
    relatedSlugs: ["heian-court-color-theory", "japanese-color-glossary"],
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
    datePublished: "2026-04-25T00:00:00Z",
    outline: [
      "What wabi-sabi actually values",
      "The tea-room palette",
      "Three Wada exemplars",
      "Anti-patterns",
    ],
    citedTerms: [
      { term: "wabi-sabi", pronunciation: "wa-bi sa-bi", meaning: "Aesthetic finding beauty in age, imperfection, and weathering." },
      { term: "kintsugi", pronunciation: "kin-tsu-gi", meaning: "Repair of broken ceramics with gold lacquer; embraces visible damage." },
      { term: "tonocha", pronunciation: "to-no-cha", meaning: "Courtier's-tea brown — a layered, settled neutral." },
      { term: "kogecha", pronunciation: "ko-ge-cha", meaning: "Scorched-tea brown — darker, more reduced still." },
    ],
    relatedSlugs: ["japandi-color-theory", "heian-court-color-theory"],
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
    datePublished: "2026-04-25T00:00:00Z",
    outline: [
      "What Japandi actually is",
      "Three Wada palettes that fit",
      "Three anti-patterns",
      "The three-axis test",
    ],
    citedTerms: [
      { term: "Japandi", meaning: "Modern interior fusion of Japanese restraint and Scandinavian light." },
      { term: "ma", pronunciation: "ma", meaning: "Negative space — silence between elements; structural in Japanese aesthetics." },
      { term: "hygge", pronunciation: "hue-gah", meaning: "Danish concept of contented warmth and considered comfort." },
    ],
    relatedSlugs: ["wabi-sabi-color-theory", "scandinavian-color-theory"],
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
    datePublished: "2026-04-25T00:00:00Z",
    outline: [
      "Beyond IKEA-white: what Scandinavian colour really is",
      "The hygge divergence",
      "Three Nordic-reading Wada palettes",
      "The all-grey trap",
    ],
    citedTerms: [
      { term: "hygge", pronunciation: "hue-gah", meaning: "Danish: contented warmth + considered comfort." },
      { term: "lagom", pronunciation: "lah-gom", meaning: "Swedish: 'just enough' — not too much, not too little." },
    ],
    relatedSlugs: ["japandi-color-theory", "wabi-sabi-color-theory"],
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
    datePublished: "2026-04-26T00:00:00Z",
    outline: [
      "Reds",
      "Purples + blues",
      "Greens",
      "Yellows + browns",
      "Neutrals",
    ],
    citedTerms: [
      { term: "kurenai", meaning: "Safflower red." },
      { term: "akane", meaning: "Madder red." },
      { term: "murasaki", meaning: "Gromwell purple." },
      { term: "ai", pronunciation: "ai", meaning: "Indigo." },
      { term: "asagi", meaning: "Pale indigo / sky-tinged." },
      { term: "ruri", meaning: "Lapis lazuli." },
      { term: "kon", meaning: "Deep navy indigo." },
      { term: "yamabuki", meaning: "Mountain-rose yellow." },
      { term: "tokiwa", meaning: "Evergreen." },
      { term: "kuro", meaning: "Black (general)." },
      { term: "sumi", meaning: "Sumi-ink black." },
      { term: "gofun", meaning: "Oyster-shell white." },
    ],
    relatedSlugs: [
      "heian-court-color-theory",
      "japanese-reds",
      "wabi-sabi-color-theory",
      "japandi-color-theory",
      "scandinavian-color-theory",
    ],
  },
];

export function getStaticPaths() {
  // getStaticPaths runs in isolated scope per Astro docs.
  const slugs = [
    "heian-court-color-theory",
    "japanese-reds",
    "wabi-sabi-color-theory",
    "japandi-color-theory",
    "scandinavian-color-theory",
    "japanese-color-glossary",
  ];
  return slugs.map((slug) => ({ params: { slug } }));
}

export const GET: APIRoute = ({ params, site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";
  const slug = params.slug ?? "";
  const article = PILLARS.find((p) => p.slug === slug);
  if (!article) {
    return new Response(
      JSON.stringify({ error: "Pillar not found", slug }, null, 2),
      { status: 404, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  }

  const body = {
    schema: "colorcombinations-learn/v1",
    generated: new Date().toISOString(),
    publisher: {
      name: "The Dictionary of Color Combinations",
      url: siteUrl,
      "@id": `${siteUrl}#organization`,
    },
    article: {
      ...article,
      url: `${siteUrl}learn/${article.slug}/`,
      api: `${siteUrl}api/learn/${article.slug}.json`,
      openGraph: `${siteUrl}og/learn/${article.slug}.svg`,
      relatedUrls: article.relatedSlugs.map((rs) => ({
        slug: rs,
        url: `${siteUrl}learn/${rs}/`,
        api: `${siteUrl}api/learn/${rs}.json`,
      })),
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    source: "colorcombinations.org editorial",
    indexUrl: `${siteUrl}api/learn.json`,
  };

  return new Response(JSON.stringify(body, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
