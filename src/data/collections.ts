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
