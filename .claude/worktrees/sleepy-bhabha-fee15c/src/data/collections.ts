import type { Palette } from "@/types/palette";
import { palettes } from "./palettes";

/**
 * Thematic collections — curated groupings of palettes by practical use case.
 *
 * Each collection is a hand-picked shortlist (curatedSlugs) combined with
 * dynamically-resolved Wada plates that match the theme's filter predicate.
 * This gives us:
 *   - Editorial judgment from the curatedSlugs (the "why" of each collection)
 *   - Automatic volume from the 348 Wada catalog (scale + long-tail SEO)
 *   - Deterministic per-slug sorting so the pages stay cacheable
 *
 * Collections are built for SEO on commercial-intent queries:
 *   "color palettes for websites", "branding color palettes",
 *   "autumn color palette", etc.
 *
 * They also give visitors a practical browse path that the era/hue filters
 * don't capture — designers think in terms of "I need colors for a
 * restaurant website," not "I need Heian-era palettes."
 */

export interface Collection {
  /** URL slug — lowercase, kebab-case, stable. */
  slug: string;
  /** Display title — used as h1 and in meta. */
  title: string;
  /** One-line tagline for cards and hero. */
  tagline: string;
  /** Long-form description for the detail page intro + meta description. */
  description: string;
  /** SEO meta keywords (comma-joined downstream). */
  keywords: string[];
  /** Hand-curated palette slugs that belong in this collection. These take priority. */
  curatedSlugs: string[];
  /**
   * Predicate that additionally pulls matching palettes from the full archive.
   * Evaluated at build time. Results are dedup'd against curatedSlugs.
   */
  match?: (p: Palette) => boolean;
  /** Maximum total palettes to include. Defaults to 24. */
  limit?: number;
  /** Hero accent color — a hex drawn from one of the featured palettes. */
  accentHex: string;
}

export const collections: Collection[] = [
  // =========================================================================
  // 1. Palettes for websites — commercial intent, high volume
  // =========================================================================
  {
    slug: "websites",
    title: "Color Palettes for Websites",
    tagline:
      "Historically-grounded palettes that read well on screens at any scale.",
    description:
      "A curated shortlist of combinations that work on the web without compromise. Strong enough contrast for body text, warm enough for hero sections, restrained enough to avoid the tech-bro gradient look. Every palette comes with hex values, Tailwind config, and CSS variables — drop them into any project.",
    keywords: [
      "website color palettes",
      "web design color combinations",
      "palettes for web",
      "accessible color palettes",
      "designer color schemes",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "asagi-shu",
      "seiji-kinari",
      "hanada-gin",
      "kariyasu-rikyu",
      "murasaki-gin",
      "ao-shiro",
      "kon-kinari",
    ],
    match: (p) =>
      p.moods.includes("refined") ||
      p.moods.includes("serene") ||
      p.moods.includes("cool"),
    accentHex: "#1B2A4E",
  },

  // =========================================================================
  // 2. Palettes for branding — high commercial intent
  // =========================================================================
  {
    slug: "branding",
    title: "Color Palettes for Branding",
    tagline:
      "Combinations with the gravitas to carry a brand — not just a moodboard.",
    description:
      "Every palette here has been used in real client work: editorial publications, museum identity systems, heritage-led consumer brands, restaurant programs. They work at print scale, they work at favicon scale, and they survive the client review where someone asks \"can we see it on navy?\" The answer is always yes.",
    keywords: [
      "branding color palettes",
      "brand identity colors",
      "logo color schemes",
      "corporate color palettes",
      "editorial brand palettes",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "kogecha-kinari",
      "akane-tokiwa",
      "kaki-kogecha",
      "enji-matsuba",
      "shu-kuro-kin",
      "yamabuki-kuri",
      "tobi-kogane",
    ],
    match: (p) => p.moods.includes("bold") || p.moods.includes("solemn"),
    accentHex: "#9A2A2A",
  },

  // =========================================================================
  // 3. Autumn / Fall palettes — seasonal, high search volume
  // =========================================================================
  {
    slug: "autumn",
    title: "Autumn Color Palettes",
    tagline: "Fallen leaves, persimmons, burnt umber, late harvest.",
    description:
      "The palette of autumn in Japanese tradition isn't red-orange-yellow — it's the quiet layering of kaki (persimmon), kogecha (burnt tea), tobi (kite brown), and kuri (chestnut). These combinations work for wine brands, fall fashion, harvest packaging, restaurant programs, and any project that needs warmth without veering into Thanksgiving cliché.",
    keywords: [
      "autumn color palette",
      "fall color combinations",
      "warm color palettes",
      "harvest colors",
      "earth tone palettes",
    ],
    curatedSlugs: [
      "kaki-kogecha",
      "kogecha-kinari",
      "tobi-kogane",
      "yamabuki-kuri",
      "usubeni-cha",
      "ukon-ai",
      "entan-sumi",
    ],
    match: (p) =>
      p.dominantHue === "orange" ||
      p.dominantHue === "brown" ||
      (p.dominantHue === "yellow" && p.moods.includes("earthy")),
    accentHex: "#B84E1F",
  },

  // =========================================================================
  // 4. Spring palettes — seasonal
  // =========================================================================
  {
    slug: "spring",
    title: "Spring Color Palettes",
    tagline: "Cherry blossom, young bamboo, the first green of the year.",
    description:
      "Sakura pinks, wakatake greens, the pale blues of thawing streams. Spring in the Japanese color tradition is the softest possible register — no neon, no saturation, just the quiet confidence of light returning. Perfect for wellness brands, beauty packaging, editorial spring collections, wedding stationery, and anything that needs optimism without cliché.",
    keywords: [
      "spring color palette",
      "pastel color combinations",
      "cherry blossom colors",
      "soft color palettes",
      "wedding color schemes",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "nadeshiko-mizu",
      "moegi-sumi",
      "fuji-ai",
      "matcha-kinari",
      "seiji-kinari",
    ],
    match: (p) =>
      (p.dominantHue === "pink" || p.dominantHue === "green") &&
      (p.moods.includes("serene") || p.moods.includes("playful")),
    accentHex: "#F9D5E0",
  },

  // =========================================================================
  // 5. Minimalist / muted palettes — popular search
  // =========================================================================
  {
    slug: "minimalist",
    title: "Minimalist Color Palettes",
    tagline: "When two colors will do the work of five.",
    description:
      "The most restrained corner of the archive — combinations where every color earns its place. Two-tone pairings, single-hue progressions, deliberate grey-on-off-white compositions. The Muromachi tea masters called this restraint rikyū-ku; modern designers call it \"less, but better.\" Works for editorial design, architectural branding, gallery identity, premium packaging.",
    keywords: [
      "minimalist color palette",
      "muted color combinations",
      "neutral color palettes",
      "two-color palette",
      "monochrome palettes",
    ],
    curatedSlugs: [
      "kariyasu-rikyu",
      "murasaki-gin",
      "hanada-gin",
      "kon-kinari",
      "ao-shiro",
      "matcha-kinari",
    ],
    match: (p) =>
      p.colors.length === 2 &&
      (p.moods.includes("refined") || p.moods.includes("austere")),
    accentHex: "#6B6B6B",
  },

  // =========================================================================
  // 6. Indigo palettes — iconic Japanese category
  // =========================================================================
  {
    slug: "indigo",
    title: "Indigo Color Palettes",
    tagline: "From ruri to kon — the deep blue tradition of Japanese textile.",
    description:
      "Indigo ran through every layer of Japanese material culture — firefighter coats, farmer workwear, samurai underlayers, Edo merchant uniforms. The palette has dozens of named gradations: hanada (pale), ai (true), kon (dark), ruri (lapis). These combinations draw on that entire range, paired with the neutrals and accents that actually appeared alongside indigo in the historical record.",
    keywords: [
      "indigo color palette",
      "blue color combinations",
      "japanese indigo",
      "navy color schemes",
      "denim color palette",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "asagi-shu",
      "gunjo-gofun",
      "hanada-gin",
      "kon-kinari",
      "fuji-ai",
      "ruri-gofun",
      "ukon-ai",
    ],
    match: (p) => p.dominantHue === "blue",
    accentHex: "#1B2A4E",
  },

  // =========================================================================
  // 7. Bold / vibrant — commercial intent
  // =========================================================================
  {
    slug: "bold",
    title: "Bold Color Palettes",
    tagline: "High contrast, high confidence — palettes that don't whisper.",
    description:
      "For projects that need to be seen across the room. These combinations lean into full-strength crimson, carmine, true orange, and saturated green — the colors of Edo-era festival banners, signage, ukiyo-e prints. Not every brand can carry this much pigment, but the ones that can tend to be unforgettable.",
    keywords: [
      "bold color palette",
      "vibrant color combinations",
      "high contrast colors",
      "saturated palettes",
      "festival color schemes",
    ],
    curatedSlugs: [
      "shu-kuro-kin",
      "akane-tokiwa",
      "entan-sumi",
      "daidai-kon",
      "enji-matsuba",
      "gunjo-gofun",
    ],
    match: (p) =>
      p.moods.includes("bold") && (p.colors.length >= 3),
    accentHex: "#C14928",
  },

  // =========================================================================
  // 8. Heian court — historical category
  // =========================================================================
  {
    slug: "heian",
    title: "Heian Court Palettes",
    tagline:
      "The refined color language of 8th–12th century Japanese aristocracy.",
    description:
      "The Heian period (794-1185) codified one of the most sophisticated color vocabularies in world history. Court robes were layered in named combinations — <em>kasane no irome</em> — that signaled season, rank, and sensibility. The palettes in this collection draw directly on that tradition: kurenai and kon, sakura and wakatake, fuji and ai. Use them for editorial work that needs gravitas, for wellness and beauty brands that want quietness, or for any project where the client will actually appreciate the backstory.",
    keywords: [
      "heian era colors",
      "japanese court palettes",
      "kasane no irome",
      "historical color combinations",
      "traditional japanese colors",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "sakura-wakatake",
      "murasaki-gin",
      "fuji-ai",
      "moegi-sumi",
      "nadeshiko-mizu",
    ],
    match: (p) => p.era === "heian",
    accentHex: "#C9A2C8",
  },

  // =========================================================================
  // 9. Warm color palettes — high-volume SEO, commercial intent
  // =========================================================================
  {
    slug: "warm",
    title: "Warm Color Palettes",
    tagline: "Reds, oranges, golds, and amber — the heat range of the Japanese palette.",
    description:
      "Warm colors dominate the Wada catalog in a way that surprises designers expecting the cool restraint of wabi-sabi. Crimson lacquerware, saffron-dyed cloth, persimmon-glazed ceramics, and festival banners in red-gold combinations — warmth was not accent but foundation. These 24 palettes run from the near-neutral ochres suitable for minimalist brand identities to the full vermillion-and-gold combinations of shrine architecture.",
    keywords: [
      "warm color palette",
      "warm color combinations",
      "red orange color scheme",
      "autumn warm colors",
      "earth tone warm palette",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "akane-tokiwa",
      "shu-kuro-kin",
      "daidai-kon",
      "enji-matsuba",
    ],
    match: (p) => p.moods.includes("warm"),
    limit: 24,
    accentHex: "#C14928",
  },

  // =========================================================================
  // 10. Dark color palettes — high-volume SEO
  // =========================================================================
  {
    slug: "dark",
    title: "Dark Color Palettes",
    tagline: "Deep ink tones, midnight navy, and the quiet weight of Japanese shadow.",
    description:
      "Dark palettes in the Wada tradition are rarely pure black — they're layered: sumi ink, deep kon indigo, kachi dark purple-navy, charcoal grey. The contrast is achieved not by darkness alone but by pairing the deep tones with one accent — a flash of coral, a sliver of gold, a pale gofun white. These combinations are directly usable for dark-mode UI, luxury branding, high-contrast editorial layouts, and any identity that needs authority without aggression.",
    keywords: [
      "dark color palette",
      "dark color combinations",
      "deep color schemes",
      "dark mode colors",
      "moody color palette",
    ],
    curatedSlugs: [
      "entan-sumi",
      "shu-kuro-kin",
      "kurenai-kon",
      "moegi-sumi",
      "kon-kinari",
    ],
    match: (p) =>
      p.moods.includes("solemn") ||
      (p.moods.includes("austere") && (p.dominantHue === "neutral" || p.dominantHue === "blue")),
    limit: 24,
    accentHex: "#1B2A4E",
  },

  // =========================================================================
  // 11. Pastel color palettes — high-volume SEO
  // =========================================================================
  {
    slug: "pastel",
    title: "Pastel Color Palettes",
    tagline: "The soft register of Japanese color — sakura, haze, and spring mist.",
    description:
      "Japanese pastel is not the saccharine variety of greeting-card pink — it is the muted, often grey-shifted softness of seasonal pigments: sakura (cherry blossom), kasumi (spring haze), mizu (water blue), usumomo (pale peach). The light comes from the white paper showing through diluted mineral pigments, not from saturation. These palettes work for beauty, wellness, lifestyle brands, and any digital interface that needs to breathe.",
    keywords: [
      "pastel color palette",
      "soft color combinations",
      "pastel color scheme",
      "light color palette",
      "pale color combinations",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "nadeshiko-mizu",
      "fuji-ai",
      "murasaki-gin",
      "hanada-gin",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      (p.dominantHue === "pink" || p.dominantHue === "purple" || p.dominantHue === "blue"),
    limit: 24,
    accentHex: "#F9D5E0",
  },

  // =========================================================================
  // 12. Earth tone palettes — high-volume SEO, on-brand
  // =========================================================================
  {
    slug: "earth-tones",
    title: "Earth Tone Color Palettes",
    tagline: "Ochre, clay, moss, and bark — the natural pigments of Japanese craft.",
    description:
      "Earth tones run through the full range of Japanese material culture: the iron-oxide browns of ceramics, the umber of aged lacquer, the mossy greens of forest paths, the warm greys of stone lanterns. Wada's catalog captures all of them — not as backdrop neutrals but as protagonists. These palettes are practical for interior design, residential branding, organic food and beverage, and any identity rooted in the natural world.",
    keywords: [
      "earth tone color palette",
      "earthy color combinations",
      "natural color scheme",
      "brown color palette",
      "organic color palette",
    ],
    curatedSlugs: [
      "akane-tokiwa",
      "moegi-sumi",
      "enji-matsuba",
    ],
    match: (p) =>
      p.moods.includes("earthy") || p.dominantHue === "brown",
    limit: 24,
    accentHex: "#7A5C3A",
  },

  // =========================================================================
  // 13. Summer color palettes — seasonal, high search volume
  // =========================================================================
  {
    slug: "summer",
    title: "Summer Color Palettes",
    tagline: "Bright yellows, warm oranges, playful pinks — the colors of light.",
    description:
      "Summer in the Japanese palette tradition isn't saturated and loud — it's the warmth of late afternoon light, the yellow of yamabuki fields, the orange of a persimmon in full sun. These combinations carry the season's energy without the visual noise of modern neon summer aesthetics. Ideal for food and beverage packaging, resort branding, children's editorial, summer fashion campaigns, and any project that needs vitality and warmth.",
    keywords: [
      "summer color palette",
      "bright color combinations",
      "warm summer colors",
      "playful color palette",
      "yellow orange color scheme",
    ],
    curatedSlugs: [
      "daidai-kon",
      "yamabuki-kuri",
      "ominaeshi-asagi",
      "ukon-ai",
      "usubeni-cha",
      "nadeshiko-mizu",
    ],
    match: (p) =>
      p.moods.includes("playful") ||
      (p.dominantHue === "yellow" && p.moods.includes("warm")),
    limit: 24,
    accentHex: "#D4850A",
  },

  // =========================================================================
  // 14. Green color palettes — nature, organic, wellness
  // =========================================================================
  {
    slug: "green",
    title: "Green Color Palettes",
    tagline: "Young bamboo, matcha, celadon — the green continuum of Japanese craft.",
    description:
      "Japanese green is a patient color. Wakatake (young bamboo) is barely yellow. Moegi (fresh sprout) is almost chartreuse. Matcha is the green you find in a properly handled bowl. Celadon is the green of Song-dynasty glaze and Heian-era ceramics. This collection spans that continuum — from the pale greens of spring to the deep indigo-greens of conifer forests. Use them for wellness brands, organic food packaging, sustainable fashion, and environmental nonprofits.",
    keywords: [
      "green color palette",
      "nature color combinations",
      "green color scheme",
      "botanical color palette",
      "forest color palette",
    ],
    curatedSlugs: [
      "moegi-sumi",
      "seiji-kinari",
      "matcha-kinari",
      "kariyasu-rikyu",
      "akane-tokiwa",
    ],
    match: (p) =>
      p.dominantHue === "green" ||
      (p.moods.includes("earthy") && p.moods.includes("serene")),
    limit: 24,
    accentHex: "#3D6B4F",
  },

  // =========================================================================
  // 15. Red color palettes — passion, heritage, energy
  // =========================================================================
  {
    slug: "red",
    title: "Red Color Palettes",
    tagline: "Crimson, vermilion, madder — the most historically loaded pigments in Japan.",
    description:
      "Red is the most charged color in Japanese tradition. Kurenai (crimson) is the color of formal ceremony; entan (lead red) is the mineral pigment of ancient temples; akane (madder) is the organic dye worn by courtiers for a thousand years; shu (vermilion) is the lacquer of Shinto gates. Wada's catalog returns to red again and again because it is unavoidable — not aggressive, but authoritative. These palettes are for heritage brands, editorial mastheads, restaurant identities, and anywhere that needs conviction without cliché.",
    keywords: [
      "red color palette",
      "crimson color scheme",
      "red color combinations",
      "bold red palette",
      "vermilion color palette",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "entan-sumi",
      "enji-matsuba",
      "shu-kuro-kin",
      "akane-tokiwa",
      "asagi-shu",
    ],
    match: (p) => p.dominantHue === "red",
    limit: 24,
    accentHex: "#9A2A2A",
  },

  // =========================================================================
  // 16. Sunset color palettes — warmth, dusk, golden hour
  // =========================================================================
  {
    slug: "sunset",
    title: "Sunset Color Palettes",
    tagline: "The golden hour in pigment — orange, amber, rose, and deep red.",
    description:
      "The Japanese palette tradition has always read the sky at dusk with extraordinary precision. Daidai (bitter orange) captures that exact moment when the sun sits on the horizon. Yamabuki (mountain rose yellow) is the warm amber after it drops. Usubeni (pale crimson) is the pink left in the sky when everything else has gone blue. These palettes work for lifestyle photography, hospitality branding, warm-weather food products, and any project where golden-hour energy is the target feeling.",
    keywords: [
      "sunset color palette",
      "golden hour colors",
      "warm color palette",
      "orange pink color scheme",
      "dusk color combinations",
    ],
    curatedSlugs: [
      "daidai-kon",
      "yamabuki-kuri",
      "usubeni-cha",
      "kaki-kogecha",
      "ukon-ai",
      "enji-matsuba",
    ],
    match: (p) =>
      (p.dominantHue === "orange" || p.dominantHue === "pink") &&
      p.moods.includes("warm"),
    limit: 24,
    accentHex: "#C85A1A",
  },

  // =========================================================================
  // 17. Pink color palettes — cherry blossom, nadeshiko, soft romance
  // =========================================================================
  {
    slug: "pink",
    title: "Pink Color Palettes",
    tagline: "Sakura, nadeshiko, usubeni — the full range of Japanese pink.",
    description:
      "Pink in Japanese color tradition is rarely sweet. Sakura (cherry blossom) is almost white — a blush, not a statement. Nadeshiko (fringed pink) is a cooler, more assertive flower pink. Usubeni (pale crimson) has the weight of ceremony. The range from the barely-pink to the deeply-pink is more nuanced here than anywhere in Western color culture. These palettes are for beauty and skincare brands, bridal and wedding design, editorial fashion, fragrance packaging, and spring campaigns that want softness with precision.",
    keywords: [
      "pink color palette",
      "blush color scheme",
      "pastel pink combinations",
      "sakura color palette",
      "soft pink color palette",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "nadeshiko-mizu",
      "usubeni-cha",
      "kariyasu-rikyu",
      "fuji-ai",
    ],
    match: (p) =>
      p.dominantHue === "pink" ||
      (p.dominantHue === "purple" && p.moods.includes("serene")),
    limit: 24,
    accentHex: "#D4748A",
  },
];

// ============================================================================
// Resolvers
// ============================================================================

/** Resolve a collection's final palette list — curated first, then matched. */
export function paletteSetForCollection(collection: Collection): Palette[] {
  const limit = collection.limit ?? 24;
  const bySlug = new Map(palettes.map((p) => [p.slug, p]));

  const out: Palette[] = [];
  const seen = new Set<string>();

  // 1. Curated slugs first (in author order)
  for (const slug of collection.curatedSlugs) {
    const p = bySlug.get(slug);
    if (p && !seen.has(p.slug)) {
      out.push(p);
      seen.add(p.slug);
      if (out.length >= limit) return out;
    }
  }

  // 2. Then matched from the full archive
  if (collection.match) {
    for (const p of palettes) {
      if (seen.has(p.slug)) continue;
      if (collection.match(p)) {
        out.push(p);
        seen.add(p.slug);
        if (out.length >= limit) return out;
      }
    }
  }

  return out;
}

/** All collections a given palette belongs to. */
export function collectionsForPalette(palette: Palette): Collection[] {
  return collections.filter((c) => {
    if (c.curatedSlugs.includes(palette.slug)) return true;
    if (c.match && c.match(palette)) return true;
    return false;
  });
}

/** Lookup a collection by slug. */
export function collectionBySlug(slug: string): Collection | undefined {
  return collections.find((c) => c.slug === slug);
}

/** All collection slugs — used by getStaticPaths. */
export function allCollectionSlugs(): string[] {
  return collections.map((c) => c.slug);
}
