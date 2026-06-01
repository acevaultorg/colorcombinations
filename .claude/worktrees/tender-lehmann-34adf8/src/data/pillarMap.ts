/**
 * pillarMap.ts — single source of truth for /learn pillar cross-links.
 *
 * Used by /collections/[slug], /palettes/[slug], and any future surface
 * that needs to link a non-/learn page to its matching pillar article.
 *
 * Two structures:
 *   - PILLAR_LINKS: the 5 canonical pillar destinations + hygge variant
 *   - COLLECTION_TO_PILLAR: 18 collection slugs → pillar keys
 */

export interface PillarLink {
  href: string;
  title: string;
  lede: string;
}

export const PILLAR_LINKS = {
  "japandi-color-theory": {
    href: "/learn/japandi-color-theory/",
    title: "Japandi Color Theory: Where Restraint Meets Light",
    lede: "A working guide to where Japanese and Scandinavian color traditions converge — three palettes from this collection are the working examples.",
  },
  "wabi-sabi-color-theory": {
    href: "/learn/wabi-sabi-color-theory/",
    title: "Wabi-Sabi Color Theory: The Beauty of Things That Have Aged",
    lede: "What it actually means for color when a tradition values age over newness — the tea-room palette, three exemplars, and the anti-patterns to avoid.",
  },
  "japanese-reds": {
    href: "/learn/japanese-reds/",
    title: "The Four Reds: Kurenai, Akane, Shu, Entan",
    lede: "Why Japanese tradition distinguishes safflower crimson from madder from vermilion from lead red — and which to reach for when the brief asks for 'a Japanese red.'",
  },
  "heian-court-color-theory": {
    href: "/learn/heian-court-color-theory/",
    title: "Heian Court Color Theory: Kasane, Kinjiki, and the Seasonal Palette",
    lede: "How the Heian imperial court systematised colour into layered-robe combinations (kasane no irome), forbidden pigments (kinjiki), and a 12-month seasonal calendar.",
  },
  "scandinavian-color-theory": {
    href: "/learn/scandinavian-color-theory/",
    title: "Scandinavian Color Theory: A Working Guide",
    lede: "What Scandinavian color is beyond IKEA-white — Nordic modernism, the hygge divergence, and three palettes from this collection that fit the brief.",
  },
  "hygge-divergence": {
    href: "/learn/scandinavian-color-theory/#hygge-divergence",
    title: "Scandinavian Color Theory: A Working Guide",
    lede: "Hygge as the warmer half of the Scandinavian colour brief — what makes it diverge from Nordic modernism, and where in this collection the divergence is at its clearest.",
  },
} satisfies Record<string, PillarLink>;

/** Collection slug → pillar key. Conservative — only when the collection's
 *  register is genuinely covered by the pillar's argument. */
export const COLLECTION_TO_PILLAR: Record<string, keyof typeof PILLAR_LINKS> = {
  // Direct (one-to-one)
  japandi: "japandi-color-theory",
  "wabi-sabi": "wabi-sabi-color-theory",
  red: "japanese-reds",
  heian: "heian-court-color-theory",
  scandinavian: "scandinavian-color-theory",
  hygge: "hygge-divergence",

  // Mapped to japanese-reds (warm-saturated reds register)
  terracotta: "japanese-reds",
  maximalist: "japanese-reds",

  // Mapped to wabi-sabi (low-saturation, materiality, age)
  "earth-tones": "wabi-sabi-color-theory",
  minimalist: "wabi-sabi-color-theory",
  monochromatic: "wabi-sabi-color-theory",
  muted: "wabi-sabi-color-theory",

  // Mapped to scandinavian (Nordic modernism + mid-century)
  modernist: "scandinavian-color-theory",
  "mid-century": "scandinavian-color-theory",

  // Mapped to heian (the 12-month seasonal palette is the Heian system)
  spring: "heian-court-color-theory",
  summer: "heian-court-color-theory",
  autumn: "heian-court-color-theory",
  winter: "heian-court-color-theory",
};

/** Lookup helper: given a collection slug, return its pillar link or null. */
export function pillarForCollection(slug: string | undefined | null): PillarLink | null {
  if (!slug) return null;
  const key = COLLECTION_TO_PILLAR[slug];
  if (!key) return null;
  return PILLAR_LINKS[key];
}
