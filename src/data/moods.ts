import type { Mood } from "@/types/palette";

export interface MoodEntry {
  slug: Mood;
  name: string;
  tagline: string;
  description: string;
  keywords: string[];
}

/**
 * Nine moods used to tag palettes. Descriptions are editorial — framed
 * around how a designer would reach for a palette of this mood in real
 * project work.
 */
export const moods: MoodEntry[] = [
  {
    slug: "serene",
    name: "Serene",
    tagline: "Quiet palettes that recede. Good for long-form reading.",
    description:
      "Serene palettes pair a cool or neutral base with low-saturation accents. They are the visual equivalent of an uncrowded room. Reach for these when the content is the thing — editorial, essays, longform, meditation apps — and you need the design to not shout over the words.",
    keywords: [
      "serene color palette",
      "calm color scheme",
      "quiet design palette",
      "editorial palette japanese",
    ],
  },
  {
    slug: "bold",
    name: "Bold",
    tagline: "High-contrast pairings. For posters, headers, and calls to action.",
    description:
      "Bold palettes put saturated colors in direct contrast — kurenai on kon, shu on asagi, yamabuki on sumi. They are the palettes that carry the most visual weight per square inch. Use when you need the design to be remembered at a glance: posters, album covers, section hero headers, billboard-scale work.",
    keywords: [
      "bold color palette",
      "high contrast palette",
      "poster palette japanese",
      "striking color combinations",
    ],
  },
  {
    slug: "earthy",
    name: "Earthy",
    tagline: "Brown-based palettes. Ceramic, linen, wood.",
    description:
      "Earthy palettes anchor on cha browns, kaki persimmon, kuri chestnut, and warm neutrals. They borrow from tea ceremony aesthetics and Muromachi-era material culture — unglazed ceramic, raw linen, unfinished wood. Use for natural-product brands, craft storefronts, and anywhere the design should feel handmade rather than machined.",
    keywords: [
      "earthy color palette",
      "natural color scheme",
      "brown palette japanese",
      "ceramic tone palette",
    ],
  },
  {
    slug: "refined",
    name: "Refined",
    tagline: "Heian-era court palettes. Precision over power.",
    description:
      "Refined palettes lean on Heian-period court colors — kurenai and kon, with careful ratios and precise pairings. They are the historical originals of what design today would call 'luxury' or 'editorial' palettes, minus the marketing word. Use for products, services, or brands that need to communicate attention to detail without shouting about it.",
    keywords: [
      "refined color palette",
      "elegant color scheme",
      "japanese court palette",
      "luxury palette minimal",
    ],
  },
  {
    slug: "austere",
    name: "Austere",
    tagline: "Minimal tonal range. Restraint as aesthetic.",
    description:
      "Austere palettes use two or three colors within a tight tonal band. Mostly neutrals with a single accent. Kamakura-period warrior aesthetic, carried into modernist design vocabularies. Use for architecture portfolios, museum sites, academic publications — anywhere excess looks like a mistake.",
    keywords: [
      "austere color palette",
      "minimalist palette japanese",
      "restrained color scheme",
      "architectural palette",
    ],
  },
  {
    slug: "warm",
    name: "Warm",
    tagline: "Red-yellow dominant. Seasonal anchor: autumn.",
    description:
      "Warm palettes shift the whole palette toward the red-yellow side of the temperature wheel — even the greens (olive not moss) and the greys (taupe not slate). Most autumn palettes live here. Use for seasonal campaigns, food and hospitality brands, fall-winter editorials.",
    keywords: [
      "warm color palette",
      "autumn palette japanese",
      "warm tone color scheme",
      "red yellow palette",
    ],
  },
  {
    slug: "cool",
    name: "Cool",
    tagline: "Blue-green dominant. Seasonal anchor: summer.",
    description:
      "Cool palettes run on asagi pale blue-green, kon indigo, gunjō ultramarine, with white or chalk neutral. Summer editorials, tech products, skincare, anything that needs to read as clean or clinical without being cold. The Japanese tradition gives you a richer cool-palette vocabulary than the Western cool-neutral default.",
    keywords: [
      "cool color palette",
      "blue green palette",
      "summer palette japanese",
      "indigo palette web",
    ],
  },
  {
    slug: "playful",
    name: "Playful",
    tagline: "Higher saturation, unexpected pairings. For lighter content.",
    description:
      "Playful palettes break the paired-restraint rule of most Wada plates. They use three or four mid-to-high-saturation colors with deliberate oddness in the pairing — sakura pink + yamabuki yellow + moegi green, for instance. Use for children's content, festive marketing, anything that should feel energetic without tipping into chaotic.",
    keywords: [
      "playful color palette",
      "fun color scheme",
      "festive palette japanese",
      "colorful design palette",
    ],
  },
  {
    slug: "solemn",
    name: "Solemn",
    tagline: "Deep tones, high weight. For gravity without drama.",
    description:
      "Solemn palettes hit the same visual register as a Kamakura-era armor display: deep saturated single colors against dark or neutral grounds. Use for memorial design, formal editorial, obituaries, annual reports, anything that carries weight. The archive's solemn plates are where historical Japanese aesthetics overlap most cleanly with European formal typography.",
    keywords: [
      "solemn color palette",
      "formal color scheme",
      "deep palette japanese",
      "dark editorial palette",
    ],
  },
];

export function moodBySlug(slug: string): MoodEntry | undefined {
  return moods.find((m) => m.slug === slug);
}
