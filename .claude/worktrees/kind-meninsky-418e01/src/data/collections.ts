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

  // =========================================================================
  // 18. Blue color palettes — high-volume hue family
  // =========================================================================
  {
    slug: "blue",
    title: "Blue Color Palettes",
    tagline: "From sky blue to midnight indigo — the full Japanese blue spectrum.",
    description:
      "Japanese blue runs deeper than any single shade. Sora (sky) is the pale blue of a clear morning. Asagi is the clear, shallow-water turquoise of the Edo era. Hanada is the first wash of indigo on unbleached cloth. Ruri is the blue of lapis lazuli imported on the Silk Road. Kon is the deepest indigo — almost navy — the color that Japanese textile tradition mastered centuries before European indigo imports. These palettes span the full range, from airy and cool to authoritative and deep. Perfect for finance, technology, healthcare, hospitality, and any identity that needs trust without coldness.",
    keywords: [
      "blue color palette",
      "blue color combinations",
      "navy color scheme",
      "sky blue palette",
      "indigo color palette",
    ],
    curatedSlugs: [
      "gunjo-gofun",
      "asagi-shu",
      "hanada-gin",
      "kon-kinari",
      "ao-shiro",
      "ruri-gofun",
      "sora-shu",
    ],
    match: (p) => p.dominantHue === "blue",
    limit: 24,
    accentHex: "#3E6A9F",
  },

  // =========================================================================
  // 19. Purple color palettes — rich, historical, ceremonial
  // =========================================================================
  {
    slug: "purple",
    title: "Purple Color Palettes",
    tagline: "Murasaki, fuji, kikyo — the most prestigious pigments of Japanese court.",
    description:
      "Purple was the rarest and most expensive dye in medieval Japan. Murasaki (violet) was extracted from the gromwell root and restricted to the highest ranks of the imperial court. Fuji (wisteria) is the blue-purple of temple flowers — quiet but unmistakable. Kikyo (bellflower) is the deeper purple of mountain flora. Edo murasaki is the grey-shifted purple of the merchant city, worn under layered kimonos as a subtle declaration of taste. These palettes carry that full history — from the pale lavender suitable for editorial wellness to the deep ceremonial purple of luxury identity work.",
    keywords: [
      "purple color palette",
      "purple color combinations",
      "lavender color scheme",
      "violet palette",
      "mauve color combinations",
    ],
    curatedSlugs: [
      "murasaki-gin",
      "fuji-ai",
      "kikyo-sumi",
      "edo-murasaki-nezumi",
    ],
    match: (p) => p.dominantHue === "purple",
    limit: 24,
    accentHex: "#7B5EA7",
  },

  // =========================================================================
  // 20. Winter color palettes — completes the four seasons
  // =========================================================================
  {
    slug: "winter",
    title: "Winter Color Palettes",
    tagline: "Deep indigo, ink black, frost white — the quietest register of the Japanese year.",
    description:
      "Winter in the Japanese palette is not the white-and-silver of Scandinavian design — it is the layered stillness of ink-on-paper: deep kon indigo, sumi black, cold gofun white, the blue-grey of stone lanterns under frost. Where spring is blush and summer is warmth, winter is restraint taken to its furthest point. These combinations work for premium fashion editorial, high-end architectural identity, technology brands that want authority, and any design that should feel considered and unhurried.",
    keywords: [
      "winter color palette",
      "winter color combinations",
      "dark blue white palette",
      "cool color scheme",
      "winter aesthetic colors",
    ],
    curatedSlugs: [
      "kon-kinari",
      "gunjo-gofun",
      "murasaki-gin",
      "ao-shiro",
      "hanada-gin",
      "moegi-sumi",
    ],
    match: (p) =>
      p.moods.includes("austere") &&
      (p.dominantHue === "blue" || p.dominantHue === "neutral" || p.dominantHue === "purple"),
    limit: 24,
    accentHex: "#2B3D5C",
  },

  // =========================================================================
  // 21. Vintage color palettes — aged, faded, nostalgic
  // =========================================================================
  {
    slug: "vintage",
    title: "Vintage Color Palettes",
    tagline: "The muted beauty of aged lacquer, worn cloth, and faded woodblock prints.",
    description:
      "Vintage in the Japanese color tradition is what time does to pigment: the persimmon-orange of aged kaki lacquerware, the warm brown of kogecha tea cloth washed a hundred times, the ochre of old paper yellowed at the edges. These are not colors that looked old when they were made — they earned their patina. Wada documented them at the moment of their tradition: just before synthetic dyes made the natural ones obsolete. Use them for heritage brands, print-inspired editorial layouts, food and beverage with provenance, and anything that benefits from the credibility that only time can give.",
    keywords: [
      "vintage color palette",
      "retro color combinations",
      "aged color scheme",
      "nostalgic color palette",
      "faded color combinations",
    ],
    curatedSlugs: [
      "kogecha-kinari",
      "tobi-kogane",
      "yamabuki-kuri",
      "kaki-kogecha",
      "usubeni-cha",
      "ukon-ai",
    ],
    match: (p) =>
      (p.moods.includes("earthy") || p.moods.includes("warm")) &&
      (p.dominantHue === "brown" || p.dominantHue === "orange" || p.dominantHue === "yellow"),
    limit: 24,
    accentHex: "#8C5E2A",
  },

  // =========================================================================
  // 22. Japanese color palettes — brand identity, direct SEO
  // =========================================================================
  {
    slug: "japanese",
    title: "Japanese Color Palettes",
    tagline: "Wada's 1933 dictionary — the definitive source for Japanese color tradition.",
    description:
      "The Japanese color tradition is one of the most precisely named and historically layered in the world. The Heian court codified hundreds of <em>kasane no irome</em> — seasonal layered robe combinations. The Edo merchant class developed its own restrained vocabulary of deep indigos, warm browns, and muted golds as a counter-aesthetic to imperial display. Sanzo Wada documented 348 of these combinations in 1933, drawing on that entire tradition. This collection covers the full breadth: court colors from the 8th century through industrial-era textile palettes from the early 20th. Each one is historically grounded, named in both Japanese and English, and immediately usable.",
    keywords: [
      "japanese color palette",
      "japanese color combinations",
      "traditional japanese colors",
      "wabi sabi color palette",
      "japanese aesthetic colors",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "sakura-wakatake",
      "fuji-ai",
      "matcha-kinari",
      "ruri-gofun",
      "moegi-sumi",
      "entan-sumi",
      "kon-kinari",
    ],
    match: (p) => p.moods.includes("refined") && p.era !== undefined,
    limit: 24,
    accentHex: "#B84E1F",
  },

  // =========================================================================
  // 23. Wedding color palettes — high commercial intent
  // =========================================================================
  {
    slug: "wedding",
    title: "Wedding Color Palettes",
    tagline: "Soft, ceremonial, enduring — the Japanese palette for celebration.",
    description:
      "Japanese weddings have historically used a very different color vocabulary from Western bridal: not white-and-cream, but layered complexity — the deep red of shiromuku wedding kimono, the soft blushed pink of uchikake robes, the pale green of spring ceremony, the restrained blue-greys of formal ceremony. The combinations here draw on that tradition but read cleanly in contemporary Western contexts too. Whether you're designing wedding stationery, a celebration brand identity, a bridal boutique, or the visual system for an event space, these palettes carry the gravity of ceremony without the cliché.",
    keywords: [
      "wedding color palette",
      "wedding color scheme",
      "bridal color combinations",
      "elegant color palette",
      "blush and sage palette",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "nadeshiko-mizu",
      "ao-shiro",
      "murasaki-gin",
      "hanada-gin",
      "fuji-ai",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      (p.dominantHue === "pink" || p.dominantHue === "purple" || p.dominantHue === "green"),
    limit: 24,
    accentHex: "#E8C4C4",
  },

  // =========================================================================
  // 24. Logo color palettes — highest commercial intent
  // =========================================================================
  {
    slug: "logo",
    title: "Color Palettes for Logos",
    tagline: "Combinations that hold at favicon scale and expand to full system.",
    description:
      "A logo palette has different requirements than a web palette or a print palette: it must work in one color, two colors, and full color; it must hold at 16px and at billboard scale; it must survive against white, black, and competing backgrounds. The Wada combinations that make the best logo palettes are the ones with extreme contrast — the deep kon indigo against off-white kinari, the saturated kurenai crimson against ink black, the complex three-tone combinations that read as a single recognizable shape at small sizes. Every palette here has been chosen for structural reliability: the kind of combination a logo designer reaches for on the day they need it to work.",
    keywords: [
      "logo color palette",
      "brand color palette for logos",
      "color schemes for logos",
      "logo design colors",
      "brand identity colors",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "entan-sumi",
      "shu-kuro-kin",
      "moegi-sumi",
      "gunjo-gofun",
      "kon-kinari",
      "kogecha-kinari",
    ],
    match: (p) =>
      (p.moods.includes("bold") || p.moods.includes("solemn")) &&
      p.colors.length >= 2,
    limit: 24,
    accentHex: "#1B2A4E",
  },

  // =========================================================================
  // 25. Interior design color palettes — high commercial intent
  // =========================================================================
  {
    slug: "interior",
    title: "Interior Design Color Palettes",
    tagline: "Colors that live well in rooms — drawn from a tradition built for architecture.",
    description:
      "Japanese architecture has always had an intimate relationship with color. The vermilion of shrine torii. The warm grey of natural wood. The warm earth of clay walls. The deep green of moss against stone. Wada's catalog includes dozens of combinations directly descended from these architectural traditions — not as historical curiosities but as working color relationships. The palettes here are the ones that transfer to paint, fabric, tile, and natural material most naturally: the earthy warm neutrals, the cool grey-blues of stone and water, the restrained earth tones of a room designed for longevity rather than trend.",
    keywords: [
      "interior design color palette",
      "home color scheme",
      "room color combinations",
      "interior color palette",
      "home decor color palette",
    ],
    curatedSlugs: [
      "kariyasu-rikyu",
      "seiji-kinari",
      "kogecha-kinari",
      "tobi-kogane",
      "matcha-kinari",
      "ao-shiro",
      "akane-tokiwa",
    ],
    match: (p) =>
      (p.moods.includes("earthy") || p.moods.includes("refined") || p.moods.includes("serene")) &&
      (p.dominantHue === "brown" || p.dominantHue === "green" || p.dominantHue === "neutral" || p.dominantHue === "yellow"),
    limit: 24,
    accentHex: "#7A5C3A",
  },

  // =========================================================================
  // 25. Ocean / Coastal color palettes — high search volume
  // =========================================================================
  {
    slug: "ocean",
    title: "Ocean Color Palettes",
    tagline: "Deep-water blues, seafoam, and the colors the sea turns at dusk.",
    description:
      "The Japanese coast has its own color vocabulary: the deep ruri blue of open water, the hazy asagi of sky meeting sea, the ao that hovers between green and blue and names both at once, the pale foam-white against rocky black. These combinations work for coastal brands, marine organizations, spa and wellness, beach resort identity, surf culture, seafood restaurants, and any project that needs the emotional weight of large water — without the corporate navy cliché.",
    keywords: [
      "ocean color palette",
      "coastal color palette",
      "beach color combinations",
      "nautical color scheme",
      "sea color palette",
    ],
    curatedSlugs: [
      "ao-shiro",
      "ruri-gofun",
      "hanada-gin",
      "nadeshiko-mizu",
      "asagi-shu",
      "gunjo-gofun",
    ],
    match: (p) =>
      p.dominantHue === "blue" &&
      (p.moods.includes("serene") || p.moods.includes("cool")),
    limit: 24,
    accentHex: "#2E6B8F",
  },

  // =========================================================================
  // 26. Fashion / Textile color palettes — high commercial intent
  // =========================================================================
  {
    slug: "fashion",
    title: "Fashion Color Palettes",
    tagline: "Colors that survived centuries of wear — in fabric, dye, and silhouette.",
    description:
      "Japanese textile tradition is one of the oldest and most sophisticated color systems in the world. Every combination in the Wada catalog began life as a textile recipe — dyestuff combinations achievable with plant-based pigments on silk, cotton, and hemp. These aren't digital abstractions. They are combinations that have been worn. The ones here translate most directly to contemporary fashion: editorial lookbooks, clothing brand identity, collection decks, apparel packaging, and the kind of runway reference that a fashion designer's studio would actually pin to the wall.",
    keywords: [
      "fashion color palette",
      "clothing color palette",
      "textile color combinations",
      "runway color palette",
      "apparel color scheme",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "asagi-shu",
      "murasaki-gin",
      "fuji-ai",
      "ukon-ai",
      "daidai-kon",
    ],
    match: (p) =>
      p.moods.includes("refined") &&
      (p.moods.includes("bold") || p.moods.includes("solemn")),
    limit: 24,
    accentHex: "#7A2060",
  },

  // =========================================================================
  // 27. Nature / Botanical color palettes — high search volume
  // =========================================================================
  {
    slug: "nature",
    title: "Nature Color Palettes",
    tagline: "Mosses, matcha, bark, stone — the colors of the Japanese countryside.",
    description:
      "Japanese color tradition is inseparably tied to the natural world. Color names reference specific plants, bark patterns, seasonal phenomena, and geological materials. Moegi is the first green of new growth. Tokiwa is the evergreen of pine that persists through winter. Seiji is the pale grey-green of celadon pottery, derived from the ash that fell on the kiln. These aren't nature-inspired — they are nature, translated into pigment. Use them for botanical brands, environmental organizations, outdoor goods, garden design, landscape architecture, natural cosmetics, and any project that needs the credibility of the natural world rather than its decoration.",
    keywords: [
      "nature color palette",
      "botanical color palette",
      "forest color combination",
      "green nature palette",
      "earthy color scheme",
    ],
    curatedSlugs: [
      "matcha-kinari",
      "akane-tokiwa",
      "moegi-sumi",
      "seiji-kinari",
      "kariyasu-rikyu",
      "enji-matsuba",
    ],
    match: (p) =>
      p.dominantHue === "green" ||
      (p.moods.includes("earthy") && p.dominantHue !== "orange"),
    limit: 24,
    accentHex: "#3A6B3A",
  },

  // =========================================================================
  // 28. Food / Restaurant color palettes — high commercial intent
  // =========================================================================
  {
    slug: "food",
    title: "Food & Restaurant Color Palettes",
    tagline: "Warm, appetizing, grounded — the palette of Japanese dining culture.",
    description:
      "Japanese food culture has one of the most sophisticated visual traditions in the world: the lacquer red of a bento box lid, the earthy warmth of konbu broth, the deep amber of soy-glazed teriyaki, the yellow-gold of dashi noodles in a ceramic bowl, the burnt orange of kaki fruit at a market stall. These are the colors the eye reads as nourishing before the palate is engaged. They work for restaurant identities, food packaging, farmers market branding, cookbook design, café menus, and any project where the brief includes the phrase \"approachable and warm.\"",
    keywords: [
      "food color palette",
      "restaurant color palette",
      "cafe color scheme",
      "warm color combinations",
      "food brand colors",
    ],
    curatedSlugs: [
      "kaki-kogecha",
      "yamabuki-kuri",
      "kogecha-kinari",
      "entan-sumi",
      "ukon-ai",
      "usubeni-cha",
    ],
    match: (p) =>
      (p.dominantHue === "orange" ||
        p.dominantHue === "yellow" ||
        p.dominantHue === "brown") &&
      (p.moods.includes("warm") || p.moods.includes("earthy")),
    limit: 24,
    accentHex: "#C05A2A",
  },

  // =========================================================================
  // 29. Teal / Aqua color palettes — popular hue family
  // =========================================================================
  {
    slug: "teal",
    title: "Teal Color Palettes",
    tagline: "The blue-green that named itself after a bird — and the Japanese colors that own that space.",
    description:
      "Teal sits at one of the most contested points on the color wheel — the gap between blue and green where neither label quite fits. Japanese color tradition is exceptionally precise here. Ao (青) is the classical term that named both blue and green for centuries. Seiji is the pale blue-green of celadon ash glaze. Hanada is a mid-grade indigo that reads teal in natural light. These combinations are the reference for designers who need teal to do serious work: brand identity, product packaging, UI accent systems, hospitality design, and any project where the brief asks for \"fresh\" without the default teal cliché.",
    keywords: [
      "teal color palette",
      "teal color combinations",
      "turquoise color palette",
      "blue-green color scheme",
      "aqua color palette",
    ],
    curatedSlugs: [
      "ao-shiro",
      "seiji-kinari",
      "matcha-kinari",
      "hanada-gin",
      "gunjo-gofun",
      "kariyasu-rikyu",
    ],
    match: (p) =>
      (p.dominantHue === "blue" || p.dominantHue === "green") &&
      p.moods.includes("serene") &&
      p.moods.includes("refined"),
    limit: 24,
    accentHex: "#2A8B8B",
  },

  // =========================================================================
  // 30. Terracotta color palettes — trending earth tone
  // =========================================================================
  {
    slug: "terracotta",
    title: "Terracotta Color Palettes",
    tagline: "Clay, rust, and fired earth — the oldest pigments on the palette.",
    description:
      "Terracotta is the color of fired clay, Roman pottery, and sun-baked roof tiles — and it has never felt more contemporary. Japanese aesthetics understand this intimately. The word 'kaki' (柿) for persimmon-orange and 'bengara' for iron-oxide red both describe variants of what English speakers call terracotta. Wada's 1933 catalog is dense with these combinations: warm reds next to earthy neutrals, orange-tinged browns grounded by ivory and ink. These palettes are the designer's toolkit for interior spaces, ceramics-inspired branding, Mediterranean restaurant identities, organic skincare packaging, and any project where 'terracotta' appears in the brief.",
    keywords: [
      "terracotta color palette",
      "terracotta color combinations",
      "clay color palette",
      "burnt orange color scheme",
      "rust color palette",
    ],
    curatedSlugs: [
      "kaki-kogecha",
      "yamabuki-kuri",
      "tobi-kogane",
      "akane-tokiwa",
      "entan-sumi",
      "daidai-kon",
    ],
    match: (p) =>
      (p.dominantHue === "red" || p.dominantHue === "orange") &&
      p.moods.includes("warm"),
    limit: 24,
    accentHex: "#B5532A",
  },

  // =========================================================================
  // 31. Neutral color palettes — interior design + branding staple
  // =========================================================================
  {
    slug: "neutral",
    title: "Neutral Color Palettes",
    tagline: "Refined restraint — the palettes that let everything else breathe.",
    description:
      "Neutral color palettes are the backbone of interior design, typography systems, and brand identities that are meant to last decades, not seasons. Japanese aesthetic tradition has a word for this discipline: 'shibui' — understated, quietly beautiful, never shouting. Wada's catalog is remarkable for its neutrals: combinations of warm cream, cool grey, aged ivory, and muted stone that have aged without irony since 1933. These palettes are the reference for minimalist interiors, luxury packaging, editorial design, and any identity built to outlast its trend cycle.",
    keywords: [
      "neutral color palette",
      "neutral color scheme",
      "greige color palette",
      "muted color combinations",
      "understated color palette",
    ],
    curatedSlugs: [
      "seiji-kinari",
      "kariyasu-rikyu",
      "kogecha-kinari",
      "kon-kinari",
      "moegi-sumi",
      "hanada-gin",
    ],
    match: (p) =>
      p.moods.includes("austere") &&
      p.moods.includes("refined") &&
      !p.moods.includes("bold") &&
      !p.moods.includes("warm"),
    limit: 24,
    accentHex: "#8C8575",
  },

  // =========================================================================
  // 32. Cafe / Coffee Shop color palettes — high commercial intent
  // =========================================================================
  {
    slug: "cafe",
    title: "Cafe Color Palettes",
    tagline: "Roasted, steeped, and served — color combinations for coffee culture.",
    description:
      "The best cafes have a visual warmth that makes you want to stay. It is not accidental. The palette of coffee culture runs from the deep brown of espresso to the ivory of steamed milk, from the terracotta of Japanese hand-thrown cups to the warm gold of afternoon light through a window. Wada's catalog captures all of this in combinations that predate the third-wave coffee aesthetic by decades. These palettes work for cafe branding, packaging for roasters and specialty food producers, restaurant interior concepts, and any project that should feel like a warm room on a cold morning.",
    keywords: [
      "cafe color palette",
      "coffee shop color scheme",
      "coffee color combinations",
      "warm brown color palette",
      "restaurant color palette",
    ],
    curatedSlugs: [
      "kaki-kogecha",
      "kogecha-kinari",
      "yamabuki-kuri",
      "tobi-kogane",
      "usubeni-cha",
    ],
    match: (p) =>
      p.moods.includes("warm") &&
      (p.dominantHue === "red" || p.dominantHue === "orange" || p.dominantHue === "yellow"),
    limit: 24,
    accentHex: "#5C3217",
  },

  // =========================================================================
  // 33. Grey color palettes — one of the highest-volume neutral searches
  // =========================================================================
  {
    slug: "grey",
    title: "Grey Color Palettes",
    tagline: "Between black and white — where Japanese aesthetics live.",
    description:
      "Grey is the color that Japanese aesthetic tradition has thought longest about. 'Nezumi' (鼠 — mouse grey) is a refined mid-grey used in Edo-era textile dyeing. 'Gin' (銀 — silver) is a lighter metallic grey. 'Ai-nezumi' is the blue-grey of indigo-dipped silk. 'Kokushoku' is near-black. These are not the lazy greys of generic branding — they are nuanced, warm or cool, with clear relationships to the other colors in a palette. Wada's combinations built around grey tones read as sophisticated anchors for modern brand systems, editorial layouts, and any palette that needs restraint without coldness.",
    keywords: [
      "grey color palette",
      "gray color palette",
      "grey color scheme",
      "charcoal color palette",
      "silver grey color combinations",
    ],
    curatedSlugs: [
      "edo-murasaki-nezumi",
      "murasaki-gin",
      "hanada-gin",
      "moegi-sumi",
      "shu-kuro-kin",
    ],
    match: (p) =>
      p.moods.includes("cool") &&
      p.moods.includes("austere") &&
      !p.moods.includes("warm"),
    limit: 24,
    accentHex: "#7A7A7A",
  },

  // =========================================================================
  // 35. Black color palettes — ink, charcoal, high contrast, editorial
  // =========================================================================
  {
    slug: "black",
    title: "Black Color Palettes",
    tagline: "Sumi ink, lacquer, and the weight of restraint.",
    description:
      "Black in the Japanese color tradition is not a single shade — it is a spectrum from the grey-smoke of sumi (墨) ink diluted with water, to the deep pitch of shikkoku (漆黒), the lacquer black prized in Heian court objects. A black palette in Wada's system always carries a companion: a warm ivory to show the ink's depth, a vermilion accent to activate the void, or a silver-grey that makes the darkness feel luminous rather than heavy. These combinations are the backbone of editorial design, luxury brand identities, and any interface where contrast does the communicating.",
    keywords: [
      "black color palette",
      "black color combinations",
      "dark color palette",
      "high contrast color palette",
      "black and white palette",
      "ink color palette",
    ],
    curatedSlugs: [
      "shu-kuro-kin",
      "entan-sumi",
      "moegi-sumi",
      "kikyo-sumi",
      "kurenai-kon",
      "hanada-gin",
    ],
    match: (p) => p.moods.includes("solemn") && p.moods.includes("bold"),
    limit: 24,
    accentHex: "#1A1A1A",
  },

  // =========================================================================
  // 36. Sage green color palettes — muted, botanical, wellness
  // =========================================================================
  {
    slug: "sage",
    title: "Sage Green Color Palettes",
    tagline: "The green of dried herbs, early morning mist, and quiet rooms.",
    description:
      "Sage — that particular grey-green that sits between green tea and stone — became ubiquitous in 2020s interior design for a reason: it reads as calming without being cold, botanical without being loud, and aged without being dull. Wada's vocabulary reaches it through 'moegi' (萌黄 — the budding yellow-green of new growth), 'seiji' (青磁 — celadon glaze green), and 'matcha' (抹茶 — the powdered-tea blue-green). Every palette here pairs the sage anchor with an off-white, a warm clay, or a deep ink so the muted green can breathe.",
    keywords: [
      "sage green color palette",
      "sage color palette",
      "sage green combinations",
      "muted green palette",
      "soft green color palette",
      "botanical color palette",
    ],
    curatedSlugs: [
      "matcha-kinari",
      "seiji-kinari",
      "moegi-sumi",
      "kariyasu-rikyu",
      "kogecha-kinari",
    ],
    match: (p) =>
      p.dominantHue === "green" &&
      (p.moods.includes("serene") || p.moods.includes("austere") || p.moods.includes("earthy")),
    limit: 24,
    accentHex: "#8A9E7E",
  },

  // =========================================================================
  // 37. Navy blue color palettes — classic, maritime, elegant
  // =========================================================================
  {
    slug: "navy",
    title: "Navy Blue Color Palettes",
    tagline: "The deep blue of indigo-dyed cloth and night harbors.",
    description:
      "Navy blue — the blue that anchors uniforms, flags, and fine tailoring — has its Japanese analog in 'kon' (紺), the deep indigo blue developed through multiple dye baths on natural cloth. Wada pairs it with ivory ('kinari'), cream, warm grey, and pale silver to create combinations that feel institutional without coldness, and classic without being stiff. These palettes work at scale — on signage, in web applications, in brand identities that need to convey reliability and depth over decades, not just for a season.",
    keywords: [
      "navy blue color palette",
      "navy color palette",
      "navy color combinations",
      "deep blue palette",
      "indigo color palette",
      "classic blue color scheme",
    ],
    curatedSlugs: [
      "kon-kinari",
      "asagi-shu",
      "hanada-gin",
      "gunjo-gofun",
      "ruri-gofun",
      "kurenai-kon",
    ],
    match: (p) =>
      p.dominantHue === "blue" &&
      (p.moods.includes("solemn") || p.moods.includes("refined") || p.moods.includes("cool")),
    limit: 24,
    accentHex: "#1B2E5E",
  },

  // =========================================================================
  // 38. Retro color palettes — 1930s–1970s palette nostalgia
  // =========================================================================
  {
    slug: "retro",
    title: "Retro Color Palettes",
    tagline: "Wada's 1933 system is, by definition, the original retro palette.",
    description:
      "Sanzo Wada published the Dictionary of Color Combinations in 1933 — the same decade as the Bauhaus, Art Deco's peak, and Japan's taisho-showa design renaissance. The palettes that feel most 'retro' to a contemporary eye are the ones with warm ochres, dusty reds, olive greens, and faded blues that appeared in printed matter, textiles, and packaging of that era. No generation invented these colors; they re-emerge every decade because they are simply beautiful, aged well, and carry the weight of history without needing to reference it. These combinations are the foundation of vintage-brand identities, record-sleeve art, and editorial nostalgia.",
    keywords: [
      "retro color palette",
      "vintage retro colors",
      "1930s color palette",
      "70s color palette",
      "nostalgic color scheme",
      "retro design colors",
    ],
    curatedSlugs: [
      "yamabuki-kuri",
      "kaki-kogecha",
      "tobi-kogane",
      "ukon-ai",
      "kogecha-kinari",
      "daidai-kon",
    ],
    match: (p) =>
      (p.moods.includes("warm") || p.moods.includes("earthy")) &&
      (p.dominantHue === "orange" || p.dominantHue === "yellow" || p.dominantHue === "brown"),
    limit: 24,
    accentHex: "#C4702A",
  },

  // =========================================================================
  // 39. Boho color palettes — earthy, layered, eclectic warmth
  // =========================================================================
  {
    slug: "boho",
    title: "Boho Color Palettes",
    tagline: "Warm terracotta, dusty turquoise, aged ivory, and woven warmth.",
    description:
      "Bohemian color — in its practical, non-clichéd version — is about warmth without matching, richness without saturation, and the comfortable feeling of many textures layered over time. Wada's tradition reaches this territory through the earthy reds of 'kaki' (柿 — persimmon), the dusty greens of 'matcha' and 'moegi', the warm neutral of 'kinari' (生成り — undyed linen), and the rich browns of 'kogecha' (焦茶 — burnt-tea brown). These combinations are the reference for home and lifestyle brands, boutique hospitality, handmade goods, and any brand identity that should feel curated, warm, and deeply human.",
    keywords: [
      "boho color palette",
      "bohemian color palette",
      "boho color combinations",
      "earthy boho colors",
      "eclectic color palette",
      "free spirit color scheme",
    ],
    curatedSlugs: [
      "kaki-kogecha",
      "tobi-kogane",
      "yamabuki-kuri",
      "kogecha-kinari",
      "matcha-kinari",
      "ukon-ai",
    ],
    match: (p) =>
      p.moods.includes("earthy") &&
      (p.moods.includes("warm") || p.moods.includes("playful")) &&
      !p.moods.includes("cool"),
    limit: 24,
    accentHex: "#B5603A",
  },

  // =========================================================================
  // 40. Art deco color palettes — 1920s–30s geometric luxury
  // =========================================================================
  {
    slug: "art-deco",
    title: "Art Deco Color Palettes",
    tagline: "Gold, black, deep blue, and the geometric luxury of the 1920s.",
    description:
      "Art Deco is Sanzo Wada's nearest Western contemporary — the style that defined the visual culture of the 1920s–30s, the same decades Wada was compiling his dictionary in Tokyo. Both systems share the same impulse: reduce color to its formal essence, honor craft and material, and build beauty from geometric restraint. The Art Deco palette — gold, black, ivory, deep blue, lacquer red — translates directly into Wada's vocabulary: 'kin' (金 — metallic gold), 'sumi' (墨 — ink black), 'kon' (紺 — deep indigo), 'kurenai' (紅 — crimson), 'kinari' (生成り — natural ivory). These combinations are the foundation for luxury packaging, hotel identity, jewelry brand systems, and any design project that should feel architecturally precise and materially rich.",
    keywords: [
      "art deco color palette",
      "art deco colors",
      "1920s color palette",
      "deco color scheme",
      "geometric luxury palette",
      "gold black color palette",
    ],
    curatedSlugs: [
      "shu-kuro-kin",
      "kurenai-kon",
      "kon-kinari",
      "hanada-gin",
      "tobi-kogane",
      "yamabuki-kuri",
    ],
    match: (p) =>
      (p.moods.includes("solemn") || p.moods.includes("refined")) &&
      (p.moods.includes("bold") || p.moods.includes("warm")) &&
      (p.dominantHue === "yellow" || p.dominantHue === "blue" || p.dominantHue === "red"),
    limit: 24,
    accentHex: "#C9A227",
  },

  // =========================================================================
  // 34. Tropical color palettes — travel, resort, vibrant greens + blues
  // =========================================================================
  {
    slug: "tropical",
    title: "Tropical Color Palettes",
    tagline: "Vivid greens, ocean blues, and sun-saturated warmth.",
    description:
      "Tropical color palettes capture a specific quality of light: the saturated greens of dense foliage, the layered blues of shallow reefs, the warm terracotta of beach architecture, the burst of a hibiscus flower against dark leaves. Japanese color tradition reaches into this territory with 'tokiwa' (常磐 — the evergreen blue-green), 'matsuba' (松葉 — pine needle deep green), and 'ao' (青 — the classical blue-green that names both sky and forest). These combinations are the reference for resort and hospitality identities, travel brand systems, outdoor and adventure apparel, and any project that should feel alive and sun-struck.",
    keywords: [
      "tropical color palette",
      "tropical color combinations",
      "vibrant color palette",
      "exotic color scheme",
      "resort color palette",
    ],
    curatedSlugs: [
      "ao-shiro",
      "matcha-kinari",
      "akane-tokiwa",
      "ruri-gofun",
      "gunjo-gofun",
      "enji-matsuba",
    ],
    match: (p) =>
      (p.dominantHue === "green" || p.dominantHue === "blue") &&
      (p.moods.includes("bold") || p.moods.includes("serene") || p.moods.includes("playful")),
    limit: 24,
    accentHex: "#1A7A4A",
  },

  // =========================================================================
  // 42. Muted color palettes — soft, understated, sophisticated restraint
  // =========================================================================
  {
    slug: "muted",
    title: "Muted Color Palettes",
    tagline: "Soft, desaturated tones that feel considered rather than cautious.",
    description:
      "Muted color — the kind that doesn't announce itself — is the hardest to execute well and the most rewarding when you get it right. It's the difference between a room that feels quietly expensive and one that feels merely beige. Wada's Japanese palette is saturated with this sensibility: 'nezumi' (鼠 — mouse grey), 'rikyu' (利休 — the grey-green named for the tea master Sen no Rikyū), 'kinari' (生成り — the barely-off-white of undyed linen), 'fuji' (藤 — the washed lavender of wisteria). These are not timid colors. They are confident in their restraint, and they pair with almost everything. Reference material for Scandinavian interior brands, editorial fashion, sustainable packaging, and any project where the work should be noticed before the color is.",
    keywords: [
      "muted color palette",
      "muted color combinations",
      "desaturated color palette",
      "soft color scheme",
      "understated color palette",
      "muted tones design",
    ],
    curatedSlugs: [
      "seiji-kinari",
      "kariyasu-rikyu",
      "nadeshiko-mizu",
      "fuji-ai",
      "murasaki-gin",
      "kogecha-kinari",
    ],
    match: (p) =>
      p.moods.includes("refined") &&
      (p.moods.includes("serene") || p.moods.includes("cool") || p.moods.includes("austere")),
    limit: 24,
    accentHex: "#8B7B8B",
  },

  // =========================================================================
  // 43. Jewel tone color palettes — deep, saturated, precious
  // =========================================================================
  {
    slug: "jewel-tone",
    title: "Jewel Tone Color Palettes",
    tagline: "Emerald, sapphire, amethyst — deep and unapologetically rich.",
    description:
      "Jewel tones are the opposite of muted — full-saturation colors anchored in the depth of gemstones: the sapphire blue of lapis lazuli, the deep green of malachite, the wine-red of garnet, the purple of amethyst. Japanese color tradition cultivated exactly these depths over centuries: 'ruri' (瑠璃 — lapis lazuli blue), 'kon' (紺 — the deep indigo of merchant robes), 'enji' (臙脂 — deep crimson from cochineal), 'murasaki' (紫 — the imperial purple processed from gromwell root). Each pigment was precious, labor-intensive, and status-marking — which is precisely what makes jewel-tone palettes the right choice for luxury retail, fine jewelry brands, premium hospitality, and any project where the material quality of the brand should be felt before a word is read.",
    keywords: [
      "jewel tone color palette",
      "jewel tone colors",
      "rich color palette",
      "deep color combinations",
      "saturated color palette",
      "gemstone color scheme",
    ],
    curatedSlugs: [
      "ruri-gofun",
      "gunjo-gofun",
      "kurenai-kon",
      "kikyo-sumi",
      "fuji-ai",
      "edo-murasaki-nezumi",
    ],
    match: (p) =>
      p.moods.includes("bold") &&
      (p.dominantHue === "blue" || p.dominantHue === "purple" || p.dominantHue === "green" || p.dominantHue === "red"),
    limit: 24,
    accentHex: "#1B3A6B",
  },

  // =========================================================================
  // 44. Moody color palettes — dark, atmospheric, cinematic depth
  // =========================================================================
  {
    slug: "moody",
    title: "Moody Color Palettes",
    tagline: "Dark, atmospheric combinations with cinematic weight.",
    description:
      "Moody color is not simply dark — it's dark with intention. It carries atmosphere, suggests depth, implies narrative. The Japanese aesthetic has a specific word for this quality: 'wabi-sabi', the beauty of impermanence and imperfection, expressed in the charcoal of ink paintings, the deep indigo of storm clouds, the warm near-black of aged lacquer. Wada's dictionary reaches this territory through 'sumi' (墨 — ink black), 'kuro' (黒 — true black), 'koiai' (濃藍 — concentrated indigo), the deep warmth of 'entan' (鉛丹 — vermilion-red with depth). These palettes are reference material for film and television title sequences, premium whiskey brands, high-end restaurant identities, dark-mode interface systems, and any project that should feel like the third act.",
    keywords: [
      "moody color palette",
      "dark color palette",
      "dramatic color combinations",
      "atmospheric color scheme",
      "cinematic color palette",
      "dark aesthetic colors",
    ],
    curatedSlugs: [
      "moegi-sumi",
      "entan-sumi",
      "kikyo-sumi",
      "shu-kuro-kin",
      "kon-kinari",
      "edo-murasaki-nezumi",
    ],
    match: (p) =>
      p.moods.includes("solemn") &&
      (p.moods.includes("bold") || p.moods.includes("austere")),
    limit: 24,
    accentHex: "#1E1E2E",
  },

  // =========================================================================
  // 45. Coastal color palettes — sea, salt air, bleached driftwood
  // =========================================================================
  {
    slug: "coastal",
    title: "Coastal Color Palettes",
    tagline: "Sea blue, bleached linen, and the quiet greys of driftwood.",
    description:
      "Coastal color is a specific register of serenity — the particular quality of light that bounces off water, the way salt air bleaches everything slightly pale, the contrast between deep ocean and sun-washed sand. Japanese color tradition has mapped this territory with precision: 'asagi' (浅葱 — the shallow-water blue that names the coast near Kyoto), 'hanada' (縹 — sky-flower blue, the color of the open horizon), 'gofun' (胡粉 — the chalk white of crushed shells), 'mizuiro' (水色 — water color, the palest possible blue). These palettes are reference material for beach-house interior identities, coastal hospitality brands, marine and watersports companies, sustainable fashion, and any project that should carry the uncrowded feeling of open water.",
    keywords: [
      "coastal color palette",
      "beach color palette",
      "ocean color scheme",
      "coastal interior colors",
      "nautical color palette",
      "seaside color combinations",
    ],
    curatedSlugs: [
      "ao-shiro",
      "gunjo-gofun",
      "ruri-gofun",
      "asagi-shu",
      "nadeshiko-mizu",
      "hanada-gin",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      (p.dominantHue === "blue" || p.dominantHue === "green") &&
      !p.moods.includes("bold"),
    limit: 24,
    accentHex: "#4A90B8",
  },

  // =========================================================================
  // 46. Desert color palettes — warm sand, dusty terracotta, bleached sky
  // =========================================================================
  {
    slug: "desert",
    title: "Desert Color Palettes",
    tagline: "Warm terracotta, dusty sand, and the bleached gold of open sky.",
    description:
      "Desert color is one of the oldest and most searched palettes in design — the warm sand of adobe walls at noon, the rust of iron-rich rock formations, the dusty sage of desert shrubs, the deep shadow-blue of a canyon wall in late afternoon. Japanese color tradition reaches this territory through its long history of working with iron and earth pigments: 'tobi' (鳶 — hawk-brown, a warm red-brown), 'kogecha' (焦茶 — burnt-tea brown), 'kaki' (柿 — persimmon orange), 'yamabuki' (山吹 — mountain-spring gold). These palettes carry the particular warmth of baked earth and dry sunlight — reference material for Southwest interior design, craft spirits and food brands, outdoor and adventure identities, natural cosmetics, and any project rooted in the land.",
    keywords: [
      "desert color palette",
      "desert color scheme",
      "southwest color palette",
      "warm earthy colors",
      "sand color palette",
      "adobe color combinations",
    ],
    curatedSlugs: [
      "kaki-kogecha",
      "tobi-kogane",
      "yamabuki-kuri",
      "kogecha-kinari",
      "daidai-kon",
      "ukon-ai",
    ],
    match: (p) =>
      p.moods.includes("warm") &&
      p.moods.includes("earthy") &&
      (p.dominantHue === "orange" || p.dominantHue === "yellow" || p.dominantHue === "brown"),
    limit: 24,
    accentHex: "#C47A3A",
  },

  // =========================================================================
  // 47. Luxury color palettes — deep, precious, material richness
  // =========================================================================
  {
    slug: "luxury",
    title: "Luxury Color Palettes",
    tagline: "Deep navy, gold, ivory, and the material weight of the precious.",
    description:
      "Luxury color communicates value before function. It works through depth, restraint, and material association — not brightness, not trendiness. The most enduring luxury palettes share a common logic: one very deep anchor (navy, black, forest green, wine), one precious accent (gold, silver, champagne), and one clean neutral (ivory, cream, linen white) that allows the eye to rest. Japanese craft tradition built exactly this system across centuries of lacquer, textile, and metalwork: 'kon' (紺 — the deep indigo of premium merchant robes), 'kin' (金 — gold from gilded lacquerware), 'kinari' (生成り — the natural cream of unprocessed silk), 'gin' (銀 — silver from mirror metal). These palettes are the foundation for luxury retail, fine jewelry, premium spirits, hotel and hospitality identity, and any brand that should feel materially expensive from the first visual contact.",
    keywords: [
      "luxury color palette",
      "luxury brand colors",
      "premium color scheme",
      "elegant color palette",
      "high-end color combinations",
      "gold navy color palette",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "hanada-gin",
      "shu-kuro-kin",
      "kon-kinari",
      "murasaki-gin",
      "tobi-kogane",
    ],
    match: (p) =>
      p.moods.includes("refined") &&
      (p.moods.includes("solemn") || p.moods.includes("bold")) &&
      !p.moods.includes("playful"),
    limit: 24,
    accentHex: "#9A7B2E",
  },

  // =========================================================================
  // 48. Neon color palettes — high-contrast, high-energy, maximum saturation
  // =========================================================================
  {
    slug: "neon",
    title: "Neon Color Palettes",
    tagline: "Maximum saturation — the festival palette at full force.",
    description:
      "Neon as a modern aesthetic didn't exist in 1933, but the impulse behind it — maximum saturation, maximum contrast, maximum energy — absolutely did. The Edo festival tradition ran on vermilion and gold, on deep crimson banners against black lacquer, on the ultra-blue of gunjo lapis next to oyster white. These combinations are the archive's highest-energy palettes: the ones that hold their own on digital screens, in printed wayfinding, in identity systems for entertainment, events, streetwear, and any project where the brief includes the word 'electric.' Not loud for its own sake — precise and deliberate at full power.",
    keywords: [
      "neon color palette",
      "vibrant color combinations",
      "high energy color palette",
      "electric color scheme",
      "bright bold colors",
    ],
    curatedSlugs: [
      "shu-kuro-kin",
      "daidai-kon",
      "akane-tokiwa",
      "gunjo-gofun",
      "ruri-gofun",
      "yamabuki-kuri",
    ],
    match: (p) =>
      p.moods.includes("bold") &&
      p.moods.includes("playful") &&
      (p.dominantHue === "red" || p.dominantHue === "orange" || p.dominantHue === "blue" || p.dominantHue === "yellow"),
    limit: 24,
    accentHex: "#D4360A",
  },

  // =========================================================================
  // 49. Monochromatic color palettes — single-hue tonal harmony
  // =========================================================================
  {
    slug: "monochromatic",
    title: "Monochromatic Color Palettes",
    tagline: "One hue, infinite depth — the harmony of a single color taken to its limits.",
    description:
      "Monochromatic doesn't mean boring — it means that all the work is done by value, saturation, and tonal variation within a single hue family. Japanese color culture mastered this discipline over centuries: the thirty named gradations of indigo from 'hanada' to 'koiai', the progression from pale 'sakura' pink to deep 'enji' crimson, the blue-green continuum from 'seiji' celadon to 'matsuba' pine needle. The combinations here use two to three tones within a narrow hue range — the kind of palette that reads as unified at a glance and reveals its complexity on closer inspection. Ideal for minimalist brand identities, refined packaging, editorial design, and any project where sophistication comes from restraint.",
    keywords: [
      "monochromatic color palette",
      "monochrome color scheme",
      "single color palette",
      "tonal color combinations",
      "one color palette variations",
    ],
    curatedSlugs: [
      "fuji-ai",
      "murasaki-gin",
      "kon-kinari",
      "ao-shiro",
      "hanada-gin",
      "seiji-kinari",
    ],
    match: (p) =>
      p.colors.length === 2 &&
      (p.moods.includes("refined") || p.moods.includes("serene") || p.moods.includes("austere")),
    limit: 24,
    accentHex: "#3E5A8A",
  },

  // =========================================================================
  // 50. Farmhouse color palettes — rustic warmth, natural materials, lived-in comfort
  // =========================================================================
  {
    slug: "farmhouse",
    title: "Farmhouse Color Palettes",
    tagline: "Aged wood, warm linen, and the honest palette of natural materials.",
    description:
      "Farmhouse color is about material honesty: the warm tan of aged linen, the ochre of earth floors, the ivory of washed cotton, the faded brown of worn wood, the quiet warmth of clay. Wada's 1933 catalog — compiled before synthetic pigments took over Japanese craft — is an archive of exactly these natural material tones. 'Kinari' (生成り) is unbleached, barely-off-white linen. 'Kogecha' (焦茶) is the warm brown of burnt-tea dye, aged to a perfect depth. 'Tobi' (鳶) is the red-brown of old lacquerware. These combinations are the honest palette of a life lived among natural things — reference material for farmhouse interior design, artisan food and beverage brands, homewares and textiles, and any identity that should feel both authentic and enduring.",
    keywords: [
      "farmhouse color palette",
      "rustic color scheme",
      "farmhouse color combinations",
      "cottage color palette",
      "natural material colors",
    ],
    curatedSlugs: [
      "kogecha-kinari",
      "tobi-kogane",
      "yamabuki-kuri",
      "usubeni-cha",
      "seiji-kinari",
      "kaki-kogecha",
    ],
    match: (p) =>
      p.moods.includes("earthy") &&
      (p.moods.includes("warm") || p.moods.includes("austere")) &&
      (p.dominantHue === "brown" || p.dominantHue === "yellow" || p.dominantHue === "neutral"),
    limit: 24,
    accentHex: "#A07850",
  },

  // =========================================================================
  // 51. Scandinavian color palettes — clean, cool, considered minimalism
  // =========================================================================
  {
    slug: "scandinavian",
    title: "Scandinavian Color Palettes",
    tagline: "Cool restraint, natural light, and the clarity of considered minimalism.",
    description:
      "Scandinavian design and Japanese design share the same fundamental aesthetic commitment: remove what isn't necessary, and what remains should be beautiful. Both traditions converge on a palette of cool whites, pale naturals, muted blues, and quiet grey-greens — colors that work in low winter light and feel expansive rather than cold. Wada's catalog arrives at exactly this territory through different paths: the chalk-white of 'gofun' (胡粉 — crushed shells), the pale cool of 'hanada' (縹 — a blue halfway between sky and water), the grey-green of 'seiji' (青磁 — celadon ash glaze), the silvery neutral of 'gin' (銀). These palettes are reference material for Scandinavian interior brands, minimalist architecture, premium homewares, and any project that should feel like a well-lit room on a clear winter morning.",
    keywords: [
      "scandinavian color palette",
      "nordic color scheme",
      "hygge color palette",
      "scandi color combinations",
      "nordic design colors",
    ],
    curatedSlugs: [
      "ao-shiro",
      "hanada-gin",
      "seiji-kinari",
      "kon-kinari",
      "murasaki-gin",
      "kariyasu-rikyu",
    ],
    match: (p) =>
      p.moods.includes("cool") &&
      p.moods.includes("austere") &&
      (p.dominantHue === "blue" || p.dominantHue === "neutral" || p.dominantHue === "green"),
    limit: 24,
    accentHex: "#9BB4C8",
  },

  // =========================================================================
  // 52. Mid-century color palettes — 1950s–1960s modernist warmth
  // =========================================================================
  {
    slug: "mid-century",
    title: "Mid-Century Color Palettes",
    tagline: "Mustard, olive, teal, and warm brown — the modernist palette at its peak.",
    description:
      "Mid-century modern color — the palette of 1950s–60s furniture, textile, and graphic design — converges on a specific register of warmth and restraint that was already present in Wada's 1933 Japanese catalog. The warm mustard of 'ukon' (鬱金 — turmeric yellow), the olive-green of 'matcha' (抹茶), the warm brown of 'kuri' (栗 — chestnut), the deep teal of 'ao' (青) — these are the same pigments the Eames era reached for through different cultural traditions. The combinations here work for mid-century interior design, vintage furniture brands, record-label aesthetics, graphic design studios, and any project that should feel like 1962 in the best possible way.",
    keywords: [
      "mid century color palette",
      "mid century modern colors",
      "1950s color palette",
      "retro modern color scheme",
      "mustard olive color palette",
    ],
    curatedSlugs: [
      "ukon-ai",
      "matcha-kinari",
      "yamabuki-kuri",
      "kaki-kogecha",
      "akane-tokiwa",
      "ao-shiro",
    ],
    match: (p) =>
      (p.moods.includes("earthy") || p.moods.includes("warm")) &&
      (p.dominantHue === "yellow" || p.dominantHue === "green" || p.dominantHue === "orange" || p.dominantHue === "brown"),
    limit: 24,
    accentHex: "#C4982A",
  },

  // =========================================================================
  // 53. Dark academia color palettes — scholarly, brooding, romantic depth
  // =========================================================================
  {
    slug: "dark-academia",
    title: "Dark Academia Color Palettes",
    tagline: "Library stacks, aged leather, candlelight, and the romantic weight of deep study.",
    description:
      "Dark academia is the aesthetic of old libraries, burgundy wainscoting, parchment under candlelight, and the deep forest greens of collegiate architecture. It's an aesthetic that Wada's 1933 catalog anticipates in remarkable ways: the deep crimson of 'enji' (臙脂 — cochineal red), the ink-and-pine-needle combination of 'matsuba' (松葉) with 'sumi' (墨), the layered near-navy of 'kon' with aged warm tones, the deep grey-purple of 'edo-murasaki'. These combinations carry that specific quality of intellectual romance — the beauty of things that have accumulated depth over decades. Reference material for editorial publishing, academic branding, heritage fashion, independent bookshops, and any project where the brief could reasonably include the word 'Oxbridge.'",
    keywords: [
      "dark academia color palette",
      "dark academic aesthetic colors",
      "gothic academia color scheme",
      "scholarly color palette",
      "dark moody color combinations",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "enji-matsuba",
      "moegi-sumi",
      "entan-sumi",
      "fuji-ai",
      "edo-murasaki-nezumi",
    ],
    match: (p) =>
      p.moods.includes("solemn") &&
      (p.moods.includes("earthy") || p.moods.includes("refined")) &&
      (p.dominantHue === "red" || p.dominantHue === "green" || p.dominantHue === "blue" || p.dominantHue === "purple"),
    limit: 24,
    accentHex: "#5C3A2E",
  },

  // =========================================================================
  // 54. Cottagecore color palettes — soft botanical warmth and pastoral romance
  // =========================================================================
  {
    slug: "cottagecore",
    title: "Cottagecore Color Palettes",
    tagline: "Soft pinks, sage greens, lavender, and the gentle palette of a pastoral world.",
    description:
      "Cottagecore color is the pastoral romantic: blush roses, sage green herbs drying in a doorway, lavender fields in soft afternoon light, undyed linen, hand-thrown pottery in cream and clay. The Japanese color tradition reaches this territory through combinations of extraordinary gentleness: 'sakura' (桜 — cherry blossom pink) with 'wakatake' (若竹 — young bamboo green), 'nadeshiko' (撫子 — fringed pink) with 'mizu' (水 — water blue), 'fuji' (藤 — wisteria lavender) with 'ai' (藍 — soft indigo). These are the combinations that feel simultaneously hand-made and considered, botanical and timeless. Reference material for artisan food and wellness brands, handmade goods, botanical illustration, garden-inspired packaging, and any project where the brief includes the word 'handcrafted.'",
    keywords: [
      "cottagecore color palette",
      "cottagecore aesthetic colors",
      "pastoral color palette",
      "botanical color scheme",
      "soft floral color combinations",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "nadeshiko-mizu",
      "kariyasu-rikyu",
      "fuji-ai",
      "matcha-kinari",
      "seiji-kinari",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      p.moods.includes("playful") &&
      (p.dominantHue === "pink" || p.dominantHue === "green" || p.dominantHue === "purple"),
    limit: 24,
    accentHex: "#D4A8B8",
  },

  // =========================================================================
  // 55. Japandi color palettes — Japanese + Scandinavian fusion
  // =========================================================================
  {
    slug: "japandi",
    title: "Japandi Color Palettes",
    tagline: "Where Japanese restraint meets Scandinavian clarity — the quietest palette in modern design.",
    description:
      "Japandi is the aesthetic meeting point between two traditions that already agreed: remove what isn't necessary, and honor what remains. The Japanese side brings warm earth tones, the patina of natural materials, and a reverence for imperfection — 'wabi-sabi' in color form. The Scandinavian side brings cool light, white space, and the clarity of considered minimalism. Wada's 1933 catalog sits exactly at this intersection: the chalk white of 'gofun' (胡粉) against the pale ink grey of 'nezumi' (鼠), the soft indigo of 'ai' (藍) beside unbleached linen, the celadon hush of 'seiji' (青磁) warmed by 'kinari' (生成 — undyed silk). These combinations are reference material for Japandi interiors, minimalist product brands, hospitality and wellness design, and any project where the brief is 'calm, considered, built to last.'",
    keywords: [
      "japandi color palette",
      "japandi color scheme",
      "japanese scandinavian colors",
      "wabi sabi color palette",
      "minimalist japandi colors",
    ],
    curatedSlugs: [
      "ao-shiro",
      "hanada-gin",
      "seiji-kinari",
      "kariyasu-rikyu",
      "murasaki-gin",
      "kon-kinari",
    ],
    match: (p) =>
      (p.moods.includes("austere") || p.moods.includes("serene")) &&
      p.moods.includes("refined") &&
      (p.dominantHue === "neutral" || p.dominantHue === "blue" || p.dominantHue === "green"),
    limit: 24,
    accentHex: "#A8B2A6",
  },

  // =========================================================================
  // 56. Kitchen color palettes — warm, welcoming, real-world interior
  // =========================================================================
  {
    slug: "kitchen",
    title: "Kitchen Color Palettes",
    tagline: "Warm cream, sage, terracotta, deep green — the colors that make a kitchen feel lived-in.",
    description:
      "A kitchen is the room that sees the most light, the most wear, and the most hours. The palette has to work at breakfast and at dinner, in summer glare and in winter dusk, next to wood, stone, ceramic, and stainless steel. The Japanese color tradition is unusually well-suited: 'seiji' (青磁 — celadon) is the green of a hand-thrown tea bowl, warm against oak. 'Matcha' (抹茶) is the sage of herbs on a windowsill. 'Kaki' (柿 — persimmon) is the warm earthenware that reads as terracotta. 'Kariyasu' (刈安 — grass yellow) is the undyed cream that softens every other color in the room. These palettes are reference material for kitchen renovations, cabinetry brands, ceramic tile design, cookbook publishing, and any project that should feel like a kitchen at the end of a long, good day.",
    keywords: [
      "kitchen color palette",
      "kitchen color scheme",
      "kitchen colors",
      "kitchen cabinet color palette",
      "sage kitchen colors",
    ],
    curatedSlugs: [
      "seiji-kinari",
      "matcha-kinari",
      "kariyasu-rikyu",
      "kaki-kogecha",
      "ao-shiro",
      "kogecha-kinari",
    ],
    match: (p) =>
      (p.moods.includes("warm") || p.moods.includes("serene")) &&
      (p.dominantHue === "green" ||
        p.dominantHue === "orange" ||
        p.dominantHue === "brown" ||
        p.dominantHue === "neutral"),
    limit: 24,
    accentHex: "#7A9473",
  },

  // =========================================================================
  // 57. Bedroom color palettes — restful, enclosing, soft
  // =========================================================================
  {
    slug: "bedroom",
    title: "Bedroom Color Palettes",
    tagline: "Quiet lavenders, soft pinks, dusky blues — the colors that lower the heart rate.",
    description:
      "A bedroom palette has one job: help the body slow down. That means low contrast, muted saturation, and colors that read warm even at night — the opposite of the bright, alert palette of a workspace. Japanese color tradition is especially fluent here. 'Fuji' (藤 — wisteria) is the specific dusty lavender that reads soft but never saccharine. 'Nadeshiko' (撫子 — fringed pink) is a pink with enough grey in it to feel grown-up. 'Hanada' (縹 — half-indigo) is the blue of paper screens at dusk. 'Murasaki' (紫) warmed with 'gin' (銀 — silver) is the color of cool cotton bedding in lamp light. These palettes are reference material for bedroom renovations, bedding and linen brands, sleep-focused wellness design, interior photography, and any project where the brief is 'restful.'",
    keywords: [
      "bedroom color palette",
      "bedroom color scheme",
      "bedroom colors",
      "calming bedroom colors",
      "master bedroom color palette",
    ],
    curatedSlugs: [
      "fuji-ai",
      "murasaki-gin",
      "nadeshiko-mizu",
      "hanada-gin",
      "sakura-wakatake",
      "kariyasu-rikyu",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      (p.moods.includes("cool") || p.moods.includes("refined")) &&
      (p.dominantHue === "purple" ||
        p.dominantHue === "pink" ||
        p.dominantHue === "blue" ||
        p.dominantHue === "neutral"),
    limit: 24,
    accentHex: "#A89BB8",
  },

  // =========================================================================
  // 58. Y2K color palettes — bright, digital, early-2000s revival
  // =========================================================================
  {
    slug: "y2k",
    title: "Y2K Color Palettes",
    tagline: "Bubblegum pink, cyber lilac, sky blue — the early-2000s revival, historically grounded.",
    description:
      "The Y2K aesthetic that designers have been reaching for since 2022 isn't actually a 2000s thing — it's an emotional shorthand for optimism, playfulness, and a specific register of digital-era color. The surprising thing is that Wada's 1933 catalog already contained those combinations, pulled from flower dyes and glazed ceramics rather than plastic and pixels. 'Nadeshiko' (撫子 — fringed pink) is the exact hot-pink of a 2001 flip phone. 'Sora' (空 — sky) is Windows XP blue filtered through a Kyoto summer. 'Fuji' (藤 — wisteria) is the early-iMac translucent lilac. 'Sakura' (桜) beside bright pop green is the TRL-era color moment pulled back to its flower-pigment source. These palettes are reference material for nostalgia-driven packaging, streetwear capsule collections, beauty and skincare relaunches, playful digital products, and any brand that wants the energy of 2001 without the cringe.",
    keywords: [
      "y2k color palette",
      "y2k aesthetic colors",
      "2000s color palette",
      "early 2000s color scheme",
      "cyber pink color palette",
    ],
    curatedSlugs: [
      "nadeshiko-mizu",
      "sakura-wakatake",
      "fuji-ai",
      "sora-shu",
      "ao-shiro",
      "daidai-kon",
    ],
    match: (p) =>
      p.moods.includes("playful") &&
      (p.moods.includes("bold") || p.moods.includes("serene")) &&
      (p.dominantHue === "pink" ||
        p.dominantHue === "purple" ||
        p.dominantHue === "blue"),
    limit: 24,
    accentHex: "#E27AB4",
  },

  // =========================================================================
  // 59. Forest color palettes — deep green, bark, ink, the understory
  // =========================================================================
  {
    slug: "forest",
    title: "Forest Color Palettes",
    tagline: "Deep moss, pine needle, aged bark — the palette of the understory at dusk.",
    description:
      "A forest palette isn't just green — it's green layered over bark, shadow, and late light. Japanese color tradition catalogued the forest floor in extraordinary detail: 'moegi' (萌黄) is the spring green of new bamboo shoots, 'matsuba' (松葉) is the blue-black green of pine needles, 'tokiwa' (常磐) is the 'evergreen' that gives the name its meaning, 'kogecha' (焦茶 — burnt brown) is the color of wet bark, 'sumi' (墨) is the ink-black of the understory at dusk. Combined, these are some of the most restful palettes in the catalog — saturated without being aggressive, dark without being heavy. Reference material for outdoor brands, botanical illustration, environmental nonprofits, cabin hospitality and lodge design, hiking and travel editorial, and any project that should feel like walking into a Japanese cedar forest in early evening.",
    keywords: [
      "forest color palette",
      "forest green color scheme",
      "woodland color palette",
      "deep green color combinations",
      "dark forest color palette",
    ],
    curatedSlugs: [
      "moegi-sumi",
      "matcha-kinari",
      "akane-tokiwa",
      "kogecha-kinari",
      "entan-sumi",
      "seiji-kinari",
    ],
    match: (p) =>
      (p.moods.includes("earthy") || p.moods.includes("solemn")) &&
      (p.dominantHue === "green" ||
        p.dominantHue === "brown" ||
        (p.dominantHue === "neutral" && p.moods.includes("austere"))),
    limit: 24,
    accentHex: "#2F4A36",
  },

  // =========================================================================
  // 60. Maximalist color palettes — saturated, fearless, fully committed
  // =========================================================================
  {
    slug: "maximalist",
    title: "Maximalist Color Palettes",
    tagline: "Crimson against ultramarine, vermilion on ink — the palette that refuses to apologize.",
    description:
      "Maximalism isn't clutter — it's conviction. A maximalist palette takes the strongest pigments the tradition produced and combines them without softening, the way a Kabuki robe layers 'kurenai' (紅 — crimson) directly onto 'kon' (紺 — deep indigo), or a temple banner puts 'shu' (朱 — vermilion) against 'kuro' (黒 — ink). Wada's catalog is full of these fearless combinations because the underlying pigments — safflower, madder, indigo, cinnabar, turmeric, lacquer — were themselves so saturated that restraint would have been a waste. These palettes are reference material for print and editorial design that needs to survive a crowded newsstand, textile and wallpaper brands willing to carry a room, restaurant and hospitality identities that trade on drama, and any project where the brief is 'more, and better.'",
    keywords: [
      "maximalist color palette",
      "maximalist aesthetic colors",
      "bold color combinations",
      "saturated color palette",
      "dopamine color palette",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "shu-kuro-kin",
      "akane-tokiwa",
      "entan-sumi",
      "ukon-ai",
      "daidai-kon",
    ],
    match: (p) =>
      p.moods.includes("bold") &&
      (p.moods.includes("warm") || p.moods.includes("solemn")) &&
      (p.dominantHue === "red" ||
        p.dominantHue === "orange" ||
        p.dominantHue === "yellow"),
    limit: 24,
    accentHex: "#B21F2D",
  },

  // =========================================================================
  // 61. Modernist color palettes — Bauhaus, De Stijl, machine-age clarity
  // =========================================================================
  {
    slug: "modernist",
    title: "Modernist Color Palettes",
    tagline: "Primary reds, blues, and yellows against ink and white — the Bauhaus impulse, in pigment.",
    description:
      "Modernist color is the palette of Bauhaus textile design, De Stijl painting, Russian constructivist posters, and the early-twentieth-century insistence that a color should justify itself with structural reason. The lineage runs through Wada's 1933 catalog: 'shu' (朱 — vermilion lacquer) doing the work of Mondrian's red, 'kon' (紺 — deep indigo) doing the work of Klee's grounded blue, 'ukon' (鬱金 — turmeric yellow) carrying weight against ink black. These palettes share a commitment to clarity over comfort — they're for editorial design, contemporary architecture, art-school identity, modernist furniture brands, and anywhere a brief asks for 'considered, geometric, primary.'",
    keywords: [
      "modernist color palette",
      "modernist color scheme",
      "bauhaus color palette",
      "de stijl color palette",
      "constructivist color combinations",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "shu-kuro-kin",
      "ao-shiro",
      "ukon-ai",
      "entan-sumi",
      "akane-tokiwa",
    ],
    match: (p) =>
      p.moods.includes("bold") &&
      p.moods.includes("refined") &&
      (p.dominantHue === "red" ||
        p.dominantHue === "blue" ||
        p.dominantHue === "yellow" ||
        p.dominantHue === "neutral"),
    limit: 24,
    accentHex: "#1B2A4E",
  },

  // =========================================================================
  // 62. Hygge color palettes — Danish warmth + soft contentment
  // =========================================================================
  {
    slug: "hygge",
    title: "Hygge Color Palettes",
    tagline: "Candle-lit cream, wool grey, soft moss — the Danish art of cozy in pigment.",
    description:
      "Hygge color isn't just Scandinavian neutral — it's specifically the warm-paper light of a Copenhagen winter afternoon, the wool-grey of a thick blanket, the muted green of a houseplant on a kitchen sill. Wada's catalog, surprisingly, holds these tones as carefully as any modern hygge mood-board: 'kinari' (生成 — undyed silk) is the cream, 'rikyu' (利休 — tea master's restrained grey-green) is the wool, 'matcha' (抹茶) softens to the houseplant green when paired with cream, 'fuji' (藤 — wisteria) gives the windowsill its faintest evening violet. Reference material for slow-living and wellness brands, Scandinavian-leaning interior projects, candle and homewares packaging, lifestyle photography, and any project where the brief is 'warm, restorative, uncomplicated.'",
    keywords: [
      "hygge color palette",
      "hygge aesthetic colors",
      "danish color palette",
      "cozy color scheme",
      "warm minimalist colors",
    ],
    curatedSlugs: [
      "kariyasu-rikyu",
      "matcha-kinari",
      "seiji-kinari",
      "fuji-ai",
      "murasaki-gin",
      "kogecha-kinari",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      (p.moods.includes("warm") || p.moods.includes("earthy")) &&
      (p.dominantHue === "neutral" ||
        p.dominantHue === "green" ||
        p.dominantHue === "brown" ||
        p.dominantHue === "yellow"),
    limit: 24,
    accentHex: "#D4B896",
  },

  // =========================================================================
  // 63. Wabi-sabi color palettes — beauty in age, asymmetry, restraint
  // =========================================================================
  {
    slug: "wabi-sabi",
    title: "Wabi-Sabi Color Palettes",
    tagline: "Aged ceramic, weathered wood, ink stain on paper — the Japanese aesthetic of imperfection.",
    description:
      "Wabi-sabi (侘寂) is the Japanese aesthetic philosophy that finds beauty in age, asymmetry, and the marks of use. In color, it's the patina of a hundred-year-old tea bowl: 'sumi' (墨 — ink black) softened by the iron oxide of an ancient kettle, 'gofun' (胡粉 — chalk white) yellowed by years of use, 'kogecha' (焦茶 — burnt brown) with the warmth of cedar that has darkened in a teahouse. Wada's catalog, drawn from the same cultural well, is full of these understated combinations — none of them forcing themselves on the eye. Reference material for ceramic studios, tea-tradition products, wellness brands, slow-craft makers, gallery identity systems, and any project that should feel like it was made by someone who knew what they were doing.",
    keywords: [
      "wabi-sabi color palette",
      "wabi sabi color scheme",
      "japanese minimalist colors",
      "muted earth color palette",
      "tea ceremony color combinations",
    ],
    curatedSlugs: [
      "kogecha-kinari",
      "tobi-kogane",
      "kariyasu-rikyu",
      "moegi-sumi",
      "matcha-kinari",
      "entan-sumi",
    ],
    match: (p) =>
      (p.moods.includes("austere") || p.moods.includes("earthy")) &&
      p.moods.includes("refined") &&
      (p.dominantHue === "neutral" ||
        p.dominantHue === "brown" ||
        p.dominantHue === "green"),
    limit: 24,
    accentHex: "#7E6B4E",
  },

  // =========================================================================
  // 64. Biophilic color palettes — natural, living, organic
  // =========================================================================
  {
    slug: "biophilic",
    title: "Biophilic Color Palettes",
    tagline: "Living green, soil brown, water blue — color borrowed directly from the natural world.",
    description:
      "Biophilic design — the architectural and design movement that argues humans are calmer, more focused, and healthier when surrounded by living forms — converges on a specific color palette: the saturated green of indoor plants, the warm brown of unfinished wood, the muted blue of clean water, the cream of natural linen. The Japanese color tradition arrived at the same combinations through its own ecology: 'matcha' (抹茶) and 'tokiwa' (常磐 — evergreen) for the plant green, 'cha' (茶) and 'kogecha' (焦茶) for the wood brown, 'mizu' (水 — water blue) and 'asagi' (浅葱 — shallow water) for the natural blue, 'kinari' (生成 — undyed silk) for the linen. These palettes are reference material for biophilic interior design, wellness and meditation brands, plant-based product packaging, sustainability-focused identities, and any project briefed with 'natural, calming, alive.'",
    keywords: [
      "biophilic color palette",
      "biophilic design colors",
      "natural color palette",
      "organic color scheme",
      "earthy living colors",
    ],
    curatedSlugs: [
      "matcha-kinari",
      "moegi-sumi",
      "akane-tokiwa",
      "seiji-kinari",
      "kogecha-kinari",
      "kariyasu-rikyu",
    ],
    match: (p) =>
      p.moods.includes("earthy") &&
      (p.moods.includes("serene") || p.moods.includes("warm")) &&
      (p.dominantHue === "green" ||
        p.dominantHue === "brown" ||
        p.dominantHue === "blue"),
    limit: 24,
    accentHex: "#5A8B5A",
  },

  // =========================================================================
  // 65. Gothic color palettes — cathedral stained glass meets ink-and-stone
  // =========================================================================
  {
    slug: "gothic",
    title: "Gothic Color Palettes",
    tagline: "Stained-glass jewel tones over ink and stone — the gothic palette in pigment.",
    description:
      "Gothic color is the palette of cathedral stained glass laid against the dark stone of the nave: deep crimson, lapis blue, gold leaf, and the sumi-ink black of carved oak. The Japanese tradition reaches the same register through different sources — 'kurenai' (紅 — safflower crimson) doing the work of medieval rose windows, 'gunjo' (群青 — ultramarine) for the lapis, 'ukon' (鬱金 — turmeric) for the gold, 'sumi' (墨) for the deep ink-black ground. These combinations are reference material for editorial design with weight, dark-academia branding, gothic-novel cover identity, occult-leaning lifestyle products, theatrical posters, and any project where the brief asks for 'reverent, dramatic, dark.'",
    keywords: [
      "gothic color palette",
      "gothic aesthetic colors",
      "dark academia gothic",
      "cathedral stained glass colors",
      "dark dramatic color palette",
    ],
    curatedSlugs: [
      "kurenai-kon",
      "gunjo-gofun",
      "shu-kuro-kin",
      "entan-sumi",
      "kikyo-sumi",
      "edo-murasaki-nezumi",
    ],
    match: (p) =>
      p.moods.includes("solemn") &&
      p.moods.includes("bold") &&
      (p.dominantHue === "red" ||
        p.dominantHue === "blue" ||
        p.dominantHue === "purple" ||
        p.dominantHue === "neutral"),
    limit: 24,
    accentHex: "#3A1F2E",
  },

  // =========================================================================
  // 66. Art Nouveau color palettes — sinuous botanical curves in muted bloom
  // =========================================================================
  {
    slug: "art-nouveau",
    title: "Art Nouveau Color Palettes",
    tagline: "Mucha's botanical pastels, Klimt's gold leaf — the curve-forward aesthetic of 1900.",
    description:
      "Art Nouveau color is the palette of Alphonse Mucha's poster women, Hector Guimard's Métro entrances, and the stained glass of Émile Gallé: muted botanical pastels — cream, sage, mauve, dusty rose — punctuated by gold leaf and deep forest green. Wada's 1933 catalog, drawn from the same European-Japonisme exchange, is full of these combinations: 'kariyasu' (刈安 — grass yellow) softened to gold, 'sakura' (桜) and 'fuji' (藤) for the pastel rose and mauve, 'matsuba' (松葉 — pine) for the deep botanical green. Reference material for editorial publishing, perfume and skincare brands, theatre and ballet design, hotel and salon identities, and any project that should feel like Paris in 1900.",
    keywords: [
      "art nouveau color palette",
      "art nouveau aesthetic colors",
      "mucha color palette",
      "edwardian color palette",
      "fin de siècle colors",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "fuji-ai",
      "kariyasu-rikyu",
      "ominaeshi-asagi",
      "matcha-kinari",
      "yamabuki-kuri",
    ],
    match: (p) =>
      p.moods.includes("refined") &&
      (p.moods.includes("playful") || p.moods.includes("serene")) &&
      (p.dominantHue === "pink" ||
        p.dominantHue === "purple" ||
        p.dominantHue === "yellow" ||
        p.dominantHue === "green"),
    limit: 24,
    accentHex: "#A48F65",
  },

  // =========================================================================
  // 67. Victorian color palettes — burgundy, brass, and deep parlor green
  // =========================================================================
  {
    slug: "victorian",
    title: "Victorian Color Palettes",
    tagline: "Heavy burgundy, brass, parlor green — the layered confidence of late-1800s interiors.",
    description:
      "Victorian color is the palette of crowded parlors, William Morris wallpaper, deep mahogany cabinets, and the burgundy velvet of theatre seats: saturated, layered, and confident in a way that modern minimalism rejects. Wada's catalog reaches the same depth through different cultural geometry — 'enji' (臙脂 — cochineal red) for the burgundy, 'matsuba' (松葉 — pine green) for the parlor walls, 'kogecha' (焦茶 — burnt brown) and 'tobi' (鳶 — kite-brown) for the rich woodwork, 'kogane' (黄金 — gold) for the brass fittings. Reference material for heritage hospitality brands, antique-inspired branding, period-drama design, library and bookshop identities, and any project briefed with 'rich, layered, full.'",
    keywords: [
      "victorian color palette",
      "victorian aesthetic colors",
      "victorian interior color scheme",
      "burgundy and gold color palette",
      "morris color palette",
    ],
    curatedSlugs: [
      "enji-matsuba",
      "kogecha-kinari",
      "tobi-kogane",
      "shu-kuro-kin",
      "akane-tokiwa",
      "edo-murasaki-nezumi",
    ],
    match: (p) =>
      p.moods.includes("solemn") &&
      (p.moods.includes("warm") || p.moods.includes("earthy")) &&
      (p.dominantHue === "red" ||
        p.dominantHue === "brown" ||
        p.dominantHue === "green" ||
        p.dominantHue === "purple"),
    limit: 24,
    accentHex: "#6B2F2F",
  },

  // =========================================================================
  // 68. Vaporwave color palettes — synth pink, cyber lavender, glitch teal
  // =========================================================================
  {
    slug: "vaporwave",
    title: "Vaporwave Color Palettes",
    tagline: "Synth pink, cyber lavender, glitch teal — 2010s digital melancholia in pigment.",
    description:
      "Vaporwave color is the digital-melancholia palette that emerged from 2010s internet aesthetics: hot pink and lavender from CRT screens, glitchy teal from 1990s Windows boot screens, sunset gradients from 1980s Pacific posters, and the high-saturation purples of malls remembered through nostalgia. The Japanese color tradition surprisingly aligns: 'nadeshiko' (撫子 — fringed pink) is the synth-pink, 'fuji' (藤 — wisteria) is the cyber-lavender, 'asagi' (浅葱 — pale teal) is the glitch turquoise, 'kikyo' (桔梗 — bellflower purple) is the saturated mall-twilight tone. Reference material for music-cover design, indie-game UI, retro-futurist branding, CRT-aesthetic editorial, and any project drawn from the well of 2010s post-internet visual culture.",
    keywords: [
      "vaporwave color palette",
      "vaporwave aesthetic colors",
      "synthwave color palette",
      "retro futurism color palette",
      "80s aesthetic color palette",
    ],
    curatedSlugs: [
      "nadeshiko-mizu",
      "fuji-ai",
      "kikyo-sumi",
      "asagi-shu",
      "sakura-wakatake",
      "ominaeshi-asagi",
    ],
    match: (p) =>
      p.moods.includes("playful") &&
      p.moods.includes("cool") &&
      (p.dominantHue === "pink" ||
        p.dominantHue === "purple" ||
        p.dominantHue === "blue"),
    limit: 24,
    accentHex: "#D870B0",
  },

  // =========================================================================
  // 69. Coquette color palettes — ribbons, blush, and feminine softness
  // =========================================================================
  {
    slug: "coquette",
    title: "Coquette Color Palettes",
    tagline: "Pale rose, cream, and powder blue — the ribbon-soft palette of the coquette aesthetic.",
    description:
      "Coquette color is the soft-feminine palette that took over fashion and TikTok in the early 2020s: pale rose, blush, cream, powder blue, and the occasional gold leaf for emphasis. Less saturated than 2010s 'girly,' more deliberate than minimalist nude — coquette is romanticism with intent. Wada's 1933 catalog of Japanese refinement is full of the source material: 'sakura' (桜) for the cherry-blossom blush, 'gofun' (胡粉 — chalk white) for the cream, 'mizu' (水 — water blue) for the powder blue, 'fuji' (藤 — wisteria) for the soft lilac, 'usubeni' (薄紅 — pale crimson) for the romantic accent. Reference material for fashion and beauty brands, bridal stationery, perfume packaging, lifestyle photography, ballet and cabaret design, and any project that should feel 'romantic, deliberate, soft-but-considered.'",
    keywords: [
      "coquette color palette",
      "coquette aesthetic colors",
      "blush pink color palette",
      "balletcore color palette",
      "soft feminine color palette",
    ],
    curatedSlugs: [
      "sakura-wakatake",
      "nadeshiko-mizu",
      "usubeni-cha",
      "fuji-ai",
      "kariyasu-rikyu",
      "ruri-gofun",
    ],
    match: (p) =>
      p.moods.includes("serene") &&
      p.moods.includes("playful") &&
      (p.dominantHue === "pink" ||
        p.dominantHue === "purple" ||
        p.dominantHue === "neutral"),
    limit: 24,
    accentHex: "#F2C5D5",
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
