/**
 * MONETIZATION CONFIG — single source of truth for all revenue-adjacent URLs.
 *
 * Replace the `PLACEHOLDER_*` values after signing up for each platform.
 * Everything is build-time baked, so a redeploy is required after edits.
 *
 * Revenue strategy (ColorCombinations V1):
 *  1. Primary  — Digital bundle on Gumroad (one-time $9)
 *  2. Secondary — Bookshop.org + Amazon Associates editorial affiliate links
 *  3. Tertiary  — Printful/Society6 print-on-demand rail (external for now)
 *  4. Deferred  — Pro tier subscription (V1.1, after first sales validate demand)
 *
 * Why not ads: the site's museum-plate identity explicitly rejects display ads
 * (IDENTITY.md). Per-visitor value of a $9 digital product at 1% conversion is
 * ~16× AdSense at the same traffic. See DECISIONS.md 2026-04-10.
 */

/** Bundle product — the primary revenue surface. */
export const BUNDLE = {
  /** Public-facing product name. */
  name: "The Complete Wada Bundle",

  /** One-liner used on CTAs. */
  tagline: "All 348 historical combinations, five formats, one download.",

  /** Price as a display string (keep intro and full price tidy). */
  price: "$12",

  /** Regular price for anchoring. */
  regularPrice: "$29",

  /** Short "what's inside" bullets (used on /shop and BundleCta). */
  includes: [
    "All 348 historical combinations from Wada's 1933 dictionary",
    "Figma design tokens (W3C-spec JSON, drag into any file)",
    "Tailwind v4 config — drop straight into tailwind.config.js",
    "CSS custom properties — every plate, one stylesheet",
    "SVG plates — museum-style swatch sheets, print-ready at any size",
    "Full JSON — colors, names, eras, moods, dominant hues",
  ],

  /**
   * Public checkout URL. Paste the Gumroad / Lemonsqueezy product URL here
   * once the operator creates the product.
   * Until then, points to a safe `/shop` fallback so no clicks go to 404.
   */
  checkoutUrl: "/shop#bundle-coming-soon" as const,

  /** True when `checkoutUrl` points to a real external payment page. */
  get isLive(): boolean {
    return (
      this.checkoutUrl.startsWith("https://") &&
      !this.checkoutUrl.includes("PLACEHOLDER")
    );
  },
} as const;

/**
 * Bookshop.org affiliate — indie bookstore network, 10% commission,
 * fits the museum-plate brand better than Amazon. Instant signup.
 * https://bookshop.org/pages/affiliate-program
 */
export const BOOKSHOP = {
  /** Your affiliate ID, e.g. "color-combinations" (shown after signup). */
  affiliateId: "PLACEHOLDER_BOOKSHOP_ID",

  /** True when ID has been pasted in. */
  get isLive(): boolean {
    return !this.affiliateId.startsWith("PLACEHOLDER");
  },

  /** Build an affiliate link for a given book ISBN or bookshop.org URL slug. */
  link(path: string): string {
    const clean = path.startsWith("http")
      ? path
      : `https://bookshop.org/${path.replace(/^\//, "")}`;
    if (!this.isLive) return clean;
    const sep = clean.includes("?") ? "&" : "?";
    return `${clean}${sep}aid=${this.affiliateId}`;
  },
} as const;

/**
 * Amazon Associates — fallback affiliate for books not on Bookshop.org.
 * 4% commission on books, 24-hour cookie. Requires 3 sales in 180 days
 * to stay in the program, so only use on pages with meaningful traffic.
 */
export const AMAZON = {
  /** Your associate tag, e.g. "colorcombo-20". */
  tag: "PLACEHOLDER_AMAZON_TAG",

  get isLive(): boolean {
    return !this.tag.startsWith("PLACEHOLDER");
  },

  /** Build an affiliate link from an ASIN or full amazon.com URL. */
  link(asinOrUrl: string): string {
    const isAsin = /^[A-Z0-9]{10}$/.test(asinOrUrl);
    const base = isAsin
      ? `https://www.amazon.com/dp/${asinOrUrl}`
      : asinOrUrl;
    if (!this.isLive) return base;
    const sep = base.includes("?") ? "&" : "?";
    return `${base}${sep}tag=${this.tag}`;
  },
} as const;

/**
 * Print-on-demand store — future rail, activated once first Gumroad sale
 * validates demand. For now a placeholder; the `PrintCta` component degrades
 * to "coming soon" copy when `isLive` is false.
 */
export const PRINTS = {
  /** External storefront URL (Printful, Society6, INPRNT, etc.). */
  storeUrl: "PLACEHOLDER_PRINTS_URL",

  /** Display price range. */
  priceFrom: "$25",

  get isLive(): boolean {
    return this.storeUrl.startsWith("https://");
  },
} as const;

/**
 * Plausible analytics — privacy-first, GDPR-compliant, no cookies.
 * $9/mo for 10k pageviews. When paused, script tag is omitted entirely.
 * https://plausible.io/colorcombinations.org
 */
export const ANALYTICS = {
  /** Set to the exact domain you configured in Plausible, e.g. "colorcombinations.org". */
  plausibleDomain: "PLACEHOLDER_PLAUSIBLE_DOMAIN",

  get isLive(): boolean {
    return !this.plausibleDomain.startsWith("PLACEHOLDER");
  },
} as const;

/**
 * Editorial book list — shown on About page + optionally end of each palette
 * page. Curated, not exhaustive. Every book has been manually vetted as a
 * meaningful companion to the archive. Don't expand past ~6 books — editorial
 * discipline is the brand.
 */
export interface CuratedBook {
  title: string;
  author: string;
  note: string;
  /** Bookshop.org slug or full URL. */
  bookshopPath: string;
  /** Amazon ASIN fallback. */
  amazonAsin?: string;
  /** Pull-quote reason for inclusion — shown inline on About. */
  why: string;
}

export const FURTHER_READING: CuratedBook[] = [
  {
    title: "A Dictionary of Color Combinations",
    author: "Sanzo Wada",
    note: "The 2010 Seigensha republication of the 1933 original.",
    bookshopPath: "/p/books/a-dictionary-of-color-combinations-vol-1-sanzo-wada/19108229",
    amazonAsin: "4861522471",
    why: "The source tradition this archive draws from. Out of print for decades; Seigensha brought it back.",
  },
  {
    title: "Interaction of Color",
    author: "Josef Albers",
    note: "50th Anniversary Edition, Yale University Press.",
    bookshopPath: "/p/books/interaction-of-color-50th-anniversary-edition-josef-albers/8991996",
    amazonAsin: "0300179359",
    why: "The most important book on how colors behave next to each other. Still the default reference in art schools.",
  },
  {
    title: "The Secret Lives of Color",
    author: "Kassia St. Clair",
    note: "Penguin, 2017.",
    bookshopPath: "/p/books/the-secret-lives-of-color-kassia-st-clair/13527731",
    amazonAsin: "0143131141",
    why: "Seventy-five individual colors, each with a short history. Reads like a cabinet of curiosities.",
  },
  {
    title: "Color: A Natural History of the Palette",
    author: "Victoria Finlay",
    note: "Random House, 2004.",
    bookshopPath: "/p/books/color-a-natural-history-of-the-palette-victoria-finlay/8065810",
    amazonAsin: "0812971426",
    why: "Investigative travelogue through dye sources — indigo farms, lapis mines, safflower fields. The journey of kurenai.",
  },
  {
    title: "Chromaphilia",
    author: "Stella Paul",
    note: "Phaidon, 2017.",
    bookshopPath: "/p/books/chromaphilia-the-story-of-color-in-art-stella-paul/6944849",
    amazonAsin: "0714873934",
    why: "240 artworks organized by color. A visual counterpart to Wada's dictionary.",
  },
] as const;
