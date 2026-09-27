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
    slug: "japanese-blues",
    type: "reference",
    readingOrder: null,
    title: "Japanese Blues: Ai, Kon, Hanada, Asagi, Ruri, Gunjō",
    description:
      "Why Japanese has a name for each step of the indigo vat (ai, kon, hanada, asagi) and two more for blues that come from stone (ruri and gunjō). The dyes, what each blue signals, and a working palette per blue.",
    eyebrow: "The named colours",
    readingTime: "5 min",
    tags: ["Blues", "Indigo", "Pigments"],
    wordCount: 877,
    datePublished: "2026-09-28T00:00:00Z",
    outline: ["The indigo ladder", "Ai — indigo itself", "Kon — the deepest indigo", "Hanada — the middle blue", "Asagi — the palest indigo", "The stone blues: ruri and gunjō", "The palest: mizu-iro and sora", "How to pick the right blue for a brief"],
    citedTerms: [
      { term: "ai", pronunciation: "a-i", meaning: "Indigo, from the leaves of Polygonum tinctorium; the everyday blue of Edo Japan." },
      { term: "kon", pronunciation: "kon", meaning: "The darkest indigo, dipped until nearly black." },
      { term: "hanada", pronunciation: "ha-na-da", meaning: "Mid-depth indigo blue, graded deep/middle/pale in the Engishiki." },
      { term: "asagi", pronunciation: "a-sa-gi", meaning: "'Pale leek green': the palest indigo, a light blue-green." },
      { term: "ruri", pronunciation: "ru-ri", meaning: "Lapis-lazuli blue, named after the stone." },
      { term: "gunjō", pronunciation: "gun-jō", meaning: "Ground azurite, the mineral blue of Japanese painting." },
    ],
    relatedSlugs: ["japanese-reds", "japanese-greens", "japanese-purples", "japanese-color-glossary"],
  },
  {
    slug: "japanese-greens",
    type: "reference",
    readingOrder: null,
    title: "Japanese Greens: Tokiwa, Matsuba, Moegi, Wakatake, Matcha, Seiji",
    description:
      "How Japanese names green by what it grows on: evergreen pine (tokiwa, matsuba), new shoots and young bamboo (moegi, wakatake), tea (matcha) and glaze (seiji). What each green signals, and a working palette per green.",
    eyebrow: "The named colours",
    readingTime: "4 min",
    tags: ["Greens", "Pigments", "Japanese"],
    wordCount: 563,
    datePublished: "2026-09-28T00:00:00Z",
    outline: ["The evergreens: tokiwa and matsuba", "New growth: moegi and wakatake", "Tea and glaze: matcha and seiji", "A note on painted green", "How to pick the right green for a brief"],
    citedTerms: [
      { term: "tokiwa", pronunciation: "to-ki-wa", meaning: "'Eternal rock': deep evergreen, a green of permanence." },
      { term: "matsuba", pronunciation: "ma-tsu-ba", meaning: "Pine-needle green, darker and greyer." },
      { term: "moegi", pronunciation: "mo-e-gi", meaning: "Yellow-green of a new shoot; a young person's colour." },
      { term: "wakatake", pronunciation: "wa-ka-ta-ke", meaning: "Young-bamboo green, softer and bluer than moegi." },
      { term: "matcha", pronunciation: "ma-t-cha", meaning: "Powdered-tea green, muted yellow-green." },
      { term: "seiji", pronunciation: "se-i-ji", meaning: "Celadon: the grey-green of iron-bearing ceramic glaze." },
    ],
    relatedSlugs: ["japanese-reds", "japanese-blues", "japanese-purples", "japanese-color-glossary"],
  },
  {
    slug: "japanese-purples",
    type: "reference",
    readingOrder: null,
    title: "Japanese Purples: Murasaki, Edo-murasaki, Kikyō, Fuji",
    description:
      "Why purple was the top court rank in Japan, how Edo's bluish purple differs from classical murasaki, and the two flower purples, kikyō and fuji. What each signals, and a working palette per purple.",
    eyebrow: "The named colours",
    readingTime: "4 min",
    tags: ["Purples", "Heian", "Imperial"],
    wordCount: 464,
    datePublished: "2026-09-28T00:00:00Z",
    outline: ["Murasaki — the court purple", "Edo-murasaki — the city purple", "Kikyō — bellflower", "Fuji — wisteria", "How to pick the right purple for a brief"],
    citedTerms: [
      { term: "murasaki", pronunciation: "mu-ra-sa-ki", meaning: "Gromwell-root purple; the top court rank colour from 603." },
      { term: "edo-murasaki", pronunciation: "e-do mu-ra-sa-ki", meaning: "The bluer purple fashionable in Edo, against Kyoto's redder purple." },
      { term: "kikyō", pronunciation: "ki-kyō", meaning: "Bellflower blue-violet, one of the seven flowers of autumn." },
      { term: "fuji", pronunciation: "fu-ji", meaning: "Wisteria lilac; the flower behind the Fujiwara name." },
    ],
    relatedSlugs: ["japanese-reds", "japanese-blues", "japanese-greens", "japanese-color-glossary"],
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
  {
    slug: "color-data-analysis",
    type: "reference",
    readingOrder: null,
    title: "What 348 Palettes Reveal: A Data Analysis of Sanzo Wada's Dictionary",
    description:
      "A build-time statistical analysis of all 348 historical combinations: most-used colors, dominant-hue distribution, combination size, and a WCAG contrast survey.",
    eyebrow: "Original research · Data",
    readingTime: "6 min",
    tags: ["Data", "Original research", "Accessibility"],
    wordCount: 960,
    datePublished: "2026-06-01T00:00:00Z",
    outline: [
      "How many colors are in a Wada combination?",
      "The most-used colors in the dictionary",
      "Which hues dominate?",
      "Are Wada's palettes legible enough for text?",
      "Method",
    ],
    citedTerms: [
      { term: "WCAG AA", meaning: "4.5:1 minimum contrast ratio for body text." },
      { term: "dominant hue", meaning: "The hue family a combination reads as overall." },
    ],
    relatedSlugs: ["accessible-palettes", "wada-palettes-web-design", "japanese-color-glossary"],
  },
  {
    slug: "accessible-palettes",
    type: "reference",
    readingOrder: null,
    title: "Accessible Japanese Palettes: Which Wada Combinations Work for Text",
    description:
      "The curated list of the historical Wada combinations (of 348) that hold a WCAG-AA contrast pair strong enough for body text, sorted by contrast, with the exact pair to use.",
    eyebrow: "Original research · Accessibility",
    readingTime: "5 min",
    tags: ["Accessibility", "WCAG", "Original research"],
    wordCount: 2450,
    datePublished: "2026-06-01T00:00:00Z",
    outline: [
      "The text-safe Wada combinations",
      "How to use a Wada palette for text safely",
      "Method",
    ],
    citedTerms: [
      { term: "WCAG AA", meaning: "4.5:1 minimum contrast for body text." },
      { term: "WCAG AAA", meaning: "7:1 contrast; passes for any text size." },
      { term: "contrast ratio", meaning: "Relative luminance ratio between two colors, 1:1 to 21:1." },
    ],
    relatedSlugs: ["color-data-analysis", "wada-palettes-web-design"],
  },
  {
    slug: "wada-palettes-web-design",
    type: "pillar",
    readingOrder: null,
    title: "How to Use Sanzo Wada Palettes in Web Design",
    description:
      "A working method for using a 1933 historical color combination in a real interface: pick for the medium, assign color roles, pass contrast, and ship it as CSS tokens.",
    eyebrow: "Working guide · Web design",
    readingTime: "6 min",
    tags: ["Web design", "Working guide", "CSS"],
    wordCount: 1020,
    datePublished: "2026-06-01T00:00:00Z",
    outline: [
      "Pick for the medium, not just the mood",
      "Assign color roles",
      "Respect contrast — verify, don't assume",
      "A worked example",
      "Ship it as tokens",
      "When not to use a Wada palette",
    ],
    citedTerms: [
      { term: "CSS custom properties", meaning: "Reusable variables (--name) holding design tokens." },
      { term: "color role", meaning: "Background, text, or accent assignment for a palette member." },
    ],
    relatedSlugs: ["accessible-palettes", "color-data-analysis"],
  },
  {
    slug: "wada-palettes-by-mood",
    type: "pillar",
    readingOrder: null,
    title: "Wada Palettes by Mood and Season: Grouping the 348 Plates",
    description:
      "All 348 historical combinations grouped by computed mood (dark, pale, warm, cool, two-color, four-color) and by a practical seasonal reading, with example plates per group — measured from the archive itself.",
    eyebrow: "Original research · Data",
    readingTime: "6 min",
    tags: ["Data", "Original research", "Mood", "Seasons"],
    wordCount: 900,
    datePublished: "2026-07-23T00:00:00Z",
    outline: [
      "How the 348 plates split by mood",
      "A seasonal reading of the dictionary",
      "Choosing by mood instead of by browsing",
      "Method",
    ],
    citedTerms: [
      { term: "solemn", meaning: "Computed mood: plate average lightness below 35% — the dark register." },
      { term: "serene", meaning: "Computed mood: plate average lightness above 70% — the pale register." },
      { term: "kasane no irome", pronunciation: "ka-sa-ne no i-ro-me", meaning: "Heian layered-robe seasonal colour combinations — the tradition behind seasonal palette reading." },
    ],
    relatedSlugs: ["color-data-analysis", "wada-color-psychology", "heian-court-color-theory"],
  },
  {
    slug: "wada-color-psychology",
    type: "pillar",
    readingOrder: null,
    title: "Color Psychology in Wada's System: What 348 Plates Are Built to Feel Like",
    description:
      "The 1933 dictionary read through color psychology, with the structure measured: how often warm is set against cool inside one plate, why the archive lives in the mid-tones, and what the two-color discipline does perceptually.",
    eyebrow: "Original research · Color theory",
    readingTime: "6 min",
    tags: ["Color theory", "Original research", "Psychology"],
    wordCount: 950,
    datePublished: "2026-07-23T00:00:00Z",
    outline: [
      "Wada's signature move: warm against cool",
      "The mid-tone register",
      "What two colors do that four cannot",
      "Using this in practice",
      "Method",
    ],
    citedTerms: [
      { term: "warm-cool contrast", meaning: "Pairing an advancing warm hue with a receding cool hue — creates depth in a two-color plate." },
      { term: "value register", meaning: "The lightness band a palette occupies; mid-value palettes are the least assertive." },
    ],
    relatedSlugs: ["wada-palettes-by-mood", "color-data-analysis", "wada-palettes-web-design"],
  },
];

export function getStaticPaths() {
  // getStaticPaths runs in isolated scope per Astro docs.
  const slugs = [
    "heian-court-color-theory",
    "japanese-reds",
    "japanese-blues",
    "japanese-greens",
    "japanese-purples",
    "wabi-sabi-color-theory",
    "japandi-color-theory",
    "scandinavian-color-theory",
    "japanese-color-glossary",
    "color-data-analysis",
    "accessible-palettes",
    "wada-palettes-web-design",
    "wada-palettes-by-mood",
    "wada-color-psychology",
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
