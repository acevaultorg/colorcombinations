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

/**
 * TRENDS_FALLBACK — the editorial cross-link used by /collections/[slug] when a
 * collection has no matching /learn pillar (51 of 69 as of 2026-09-06).
 *
 * WHY THIS EXISTS. /trends/color-trends-2026/ is the site's highest-value page —
 * 6,777 Bing impressions, 35.7% of all site impression volume — and it received
 * internal links from exactly 2 of ~1,470 pages while linking OUT to 51. It was
 * an authority donor, not a recipient.
 *
 * The diagnosis this tests (measured 2026-09-06, impressions + position only —
 * this site's /bing-detail CTR failed the click-selection guard, so no CTR was
 * used): on the 2026 cluster we rank an impression-weighted 2.36 on
 * conversational phrasings (20 rows, 118 impr) and 5.89 on the head keywords
 * that carry 85% of the volume (5 rows, 2,080 impr). Content quality is
 * therefore not the constraint — it wins where competition is thin. Authority
 * is: 2 internal inbound links, and Bing reports 9 external inbound links
 * site-wide (readinglist.school reads 983 on the same call).
 *
 * DELIBERATELY *NOT* wired into pillarForCollection(): that helper is also
 * imported by /palettes/[slug] (378 pages). Changing it there would make this a
 * 429-page bulk change instead of a 51-page test, and bulk changes on this site
 * were refuted 14 times in one session. Collections only.
 *
 * SUCCESS METRIC = position on `color of the year 2026` moving toward 3,
 * read from GetRankAndTrafficStats (unselected). NOT CTR. Baseline 2026-09-06:
 * page position 4.9, head-term 5.5, 6,777 impressions. Read after 3-4 weeks;
 * a 1-week read is noise. If 51 pages move nothing, internal linking is dead as
 * a lever here and the constraint is external authority (operator-gated).
 */
export const TRENDS_FALLBACK: PillarLink = {
  href: "/trends/color-trends-2026/",
  title: "Color of the Year 2026: Every Official Pick",
  lede: "Pantone, Benjamin Moore, Behr, Sherwin-Williams and the rest — every official 2026 Color of the Year, and the palette each one sits in.",
};

/** Lookup helper: given a collection slug, return its pillar link or null. */
export function pillarForCollection(slug: string | undefined | null): PillarLink | null {
  if (!slug) return null;
  const key = COLLECTION_TO_PILLAR[slug];
  if (!key) return null;
  return PILLAR_LINKS[key];
}
