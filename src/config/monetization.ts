/**
 * MONETIZATION CONFIG — single source of truth for all revenue-adjacent URLs.
 *
 * Replace the `PLACEHOLDER_*` values after signing up for each platform.
 * Everything is build-time baked, so a redeploy is required after edits.
 *
 * V1.1 revenue strategy (ColorCombinations):
 *
 *  1. PRIMARY REALISTIC RAIL — Affiliate. Book covers + in-context embeds
 *     on palette pages + design-tool affiliate (higher commission than books).
 *     Bookshop.org wins on 30-day cookie vs Amazon's 24h.
 *  2. SECONDARY — "Support the archive" tip jar via Gumroad. Pay-what-you-want,
 *     $3 minimum, suggests $5. Reframed from "product" to "thank-you with a
 *     bundle attached" — stops overselling the free data on the site.
 *  3. TERTIARY — Prints/POD stubbed until demand signal arrives via waitlist.
 *  4. V1.5+ (traffic-gated) — Carbon Ads (one tasteful slot, design-audience
 *     focused) once pageviews exceed 20,000/month. Not active at launch.
 *
 * Explicit non-goals:
 *  - No display ads (AdSense/Mediavine) at any traffic level — museum identity
 *    forbids multi-slot ad networks. Carbon Ads is the only exception.
 *  - No dark patterns, no fake urgency, no inflated price anchors.
 *
 * See DECISIONS.md 2026-04-10 ("Monetization V1.1 reality check") for the
 * reasoning behind every line in this file.
 */

// ============================================================================
// BUNDLE — reframed as "support the archive" tip jar, not a product
// ============================================================================

/** Support bundle — honest framing, pay-what-you-want. */
export const BUNDLE = {
  /** Public-facing name. */
  name: "Support the archive",

  /** One-liner used on CTAs. */
  tagline: "The full catalog, on your disk, as a thank-you.",

  /**
   * Suggested price as a display string. We don't anchor against a "regular"
   * price because the same data is on GitHub — an anchor is not credible.
   */
  price: "$5",

  /** Minimum accepted price — Gumroad PWYW with a floor. */
  minPrice: "$3",

  /** Short "what's inside" bullets (used on /shop and BundleCta). */
  includes: [
    "All 378 palettes (348 Wada + 30 editorial) in five formats",
    "Figma design tokens (W3C-spec JSON, drag into any file)",
    "Tailwind v4 + v3 configs — drop into any project",
    "CSS custom properties — every plate, one stylesheet",
    "378 museum SVG plates — print-ready at any size",
    "Full JSON — colors, names, eras, moods, dominant hues",
  ],

  /**
   * Public checkout URL. Paste the Gumroad / Lemonsqueezy product URL here
   * once the operator creates the product. Until then, points to a safe
   * `/shop` fallback so no clicks go to 404.
   *
   * Recommended Gumroad config: PWYW, minimum $3, suggested $5, name "Support
   * the archive — The Complete Wada Bundle."
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

// ============================================================================
// BOOKSHOP.ORG — primary affiliate (10% commission, 30-day cookie)
// ============================================================================

/**
 * Bookshop.org affiliate — indie bookstore network, 10% commission,
 * 30-day cookie window (vs Amazon's 24h), fits the museum-plate brand better
 * than Amazon. Instant signup at:
 *   https://bookshop.org/pages/affiliate-program
 */
export const BOOKSHOP = {
  /** Your affiliate ID, e.g. "color-combinations" (shown after signup). */
  affiliateId: "PLACEHOLDER_BOOKSHOP_ID",

  /** True when ID has been pasted in. */
  get isLive(): boolean {
    return !this.affiliateId.startsWith("PLACEHOLDER");
  },

  /** Build an affiliate link for a given book path or URL. */
  link(path: string): string {
    const clean = path.startsWith("http")
      ? path
      : `https://bookshop.org/${path.replace(/^\//, "")}`;
    if (!this.isLive) return clean;
    const sep = clean.includes("?") ? "&" : "?";
    return `${clean}${sep}aid=${this.affiliateId}`;
  },
} as const;

// ============================================================================
// AMAZON ASSOCIATES — fallback affiliate (4% commission, 24h cookie)
// ============================================================================

/**
 * Amazon Associates — fallback affiliate for books not on Bookshop.org.
 * 4% commission on books, 24-hour cookie. Requires 3 sales in 180 days
 * to stay in the program. Only use when Bookshop is missing a title.
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

// ============================================================================
// PRINTS — deferred, activated after first sales validate demand
// ============================================================================

/**
 * Print-on-demand store — future rail. Activated once first Gumroad sales
 * validate demand signal. For now a waitlist placeholder.
 * Options: Society6 (easiest), Printful (best margins), INPRNT (art-focused).
 */
export const PRINTS = {
  storeUrl: "PLACEHOLDER_PRINTS_URL",
  priceFrom: "$25",

  get isLive(): boolean {
    return this.storeUrl.startsWith("https://");
  },
} as const;

// ============================================================================
// ANALYTICS — Plausible (privacy-first, no cookie banner needed)
// ============================================================================

/**
 * Plausible — privacy-first, GDPR-compliant, no cookies.
 * $9/mo for 10k pageviews. When paused, script tag is omitted entirely.
 * https://plausible.io/colorcombinations.org
 */
export const ANALYTICS = {
  plausibleDomain: "PLACEHOLDER_PLAUSIBLE_DOMAIN",

  get isLive(): boolean {
    return !this.plausibleDomain.startsWith("PLACEHOLDER");
  },
} as const;

// ============================================================================
// CARBON ADS — traffic-gated V1.5 rail, not active at launch
// ============================================================================

/**
 * Carbon Ads — one tasteful ad slot, designer-audience, no tracking, no video.
 * Used by Smashing Magazine, CodePen, JetBrains docs, DigitalOcean docs.
 *
 * Traffic gate: Carbon requires ~20,000 monthly visits to approve new sites.
 * Do NOT activate until the archive crosses that threshold — applying too
 * early gets a rejection that's hard to re-appeal.
 *
 * When approved, paste the placement key (looks like `CE7I5K3U`) into
 * `placement` and the CarbonAd component in BaseLayout starts rendering.
 *
 * Apply at: https://www.carbonads.net/advertise/publishers
 */
export const CARBON_ADS = {
  placement: "PLACEHOLDER_CARBON_PLACEMENT",
  /** Which zone to show (sidebar, inline, header). */
  zone: "sidebar" as "sidebar" | "inline" | "header",

  get isLive(): boolean {
    return !this.placement.startsWith("PLACEHOLDER");
  },
} as const;

// ============================================================================
// FURTHER READING — curated books with Open Library cover images
// ============================================================================

export interface CuratedBook {
  title: string;
  author: string;
  note: string;
  /** Bookshop.org slug or full URL. */
  bookshopPath: string;
  /** Amazon ASIN fallback (also used for Open Library cover lookup). */
  amazonAsin?: string;
  /**
   * ISBN-10 or ISBN-13 for cover image lookup. If omitted, falls back to
   * amazonAsin. If both missing, no cover renders and we show a serif
   * fallback tile.
   */
  isbn?: string;
  /** Pull-quote reason for inclusion — shown inline on listings. */
  why: string;
}

export const FURTHER_READING: CuratedBook[] = [
  {
    title: "A Dictionary of Color Combinations",
    author: "Sanzo Wada",
    note: "The 2010 Seigensha republication of the 1933 original.",
    bookshopPath:
      "/p/books/a-dictionary-of-color-combinations-vol-1-sanzo-wada/19108229",
    amazonAsin: "4861522471",
    isbn: "4861522471",
    why: "The source tradition this archive draws from. Out of print for decades; Seigensha brought it back.",
  },
  {
    title: "Interaction of Color",
    author: "Josef Albers",
    note: "50th Anniversary Edition, Yale University Press.",
    bookshopPath:
      "/p/books/interaction-of-color-50th-anniversary-edition-josef-albers/8991996",
    amazonAsin: "0300179359",
    isbn: "0300179359",
    why: "The most important book on how colors behave next to each other. Still the default reference in art schools.",
  },
  {
    title: "The Secret Lives of Color",
    author: "Kassia St. Clair",
    note: "Penguin, 2017.",
    bookshopPath:
      "/p/books/the-secret-lives-of-color-kassia-st-clair/13527731",
    amazonAsin: "0143131141",
    isbn: "0143131141",
    why: "Seventy-five individual colors, each with a short history. Reads like a cabinet of curiosities.",
  },
  {
    title: "Color: A Natural History of the Palette",
    author: "Victoria Finlay",
    note: "Random House, 2004.",
    bookshopPath:
      "/p/books/color-a-natural-history-of-the-palette-victoria-finlay/8065810",
    amazonAsin: "0812971426",
    isbn: "0812971426",
    why: "Investigative travelogue through dye sources — indigo farms, lapis mines, safflower fields. The journey of kurenai.",
  },
  {
    title: "Chromaphilia",
    author: "Stella Paul",
    note: "Phaidon, 2017.",
    bookshopPath:
      "/p/books/chromaphilia-the-story-of-color-in-art-stella-paul/6944849",
    amazonAsin: "0714873934",
    isbn: "0714873934",
    why: "240 artworks organized by color. A visual counterpart to Wada's dictionary.",
  },
] as const;

/**
 * Build an Open Library cover URL from an ISBN. Open Library's covers API
 * is free, CDN-backed, and graceful on misses (returns a transparent 1x1
 * PNG instead of 404, which our CSS treats as invisible).
 *
 * Sizes: S (small, ~150px), M (medium, ~400px), L (large, ~800px).
 */
export function bookCover(book: CuratedBook, size: "S" | "M" | "L" = "M"): string {
  const id = book.isbn ?? book.amazonAsin ?? "";
  if (!id) return "";
  return `https://covers.openlibrary.org/b/isbn/${id}-${size}.jpg`;
}

// ============================================================================
// DESIGN TOOLS — higher-commission affiliate inventory beyond books
// ============================================================================

/**
 * Design-tool affiliate links. Books cap out at ~$1 commission per sale;
 * design tools can pay $5-$80 per signup/conversion. This expands the
 * affiliate ceiling significantly without cluttering the museum brand.
 *
 * All links open external. Any tool that doesn't have an affiliate program
 * lives here with `affiliate: false` and we link direct — still useful as
 * editorial recommendations, just no commission.
 */
export interface DesignTool {
  name: string;
  category: "design" | "prototype" | "color" | "type" | "plugin" | "course";
  description: string;
  /** One-line value prop. */
  why: string;
  /** Destination URL — replace with affiliate link when active. */
  url: string;
  /** When true, append FTC disclosure. */
  affiliate: boolean;
  /** Commission structure for display (internal note). */
  commission?: string;
}

export const DESIGN_TOOLS: DesignTool[] = [
  {
    name: "Figma",
    category: "design",
    description: "The default design tool. Free tier is generous.",
    why: "The tokens bundle includes a drag-in Figma file.",
    url: "https://www.figma.com",
    affiliate: false,
  },
  {
    name: "Framer",
    category: "prototype",
    description: "Design tool + no-code site builder. Publishes straight to the web.",
    why: "If you want the palettes as a live brand system with a working site, Framer gets there without leaving the canvas.",
    url: "https://www.framer.com/?via=PLACEHOLDER",
    affiliate: true,
    commission: "~$25 recurring",
  },
  {
    name: "Coolors",
    category: "color",
    description: "Palette generator with contrast checker and exports.",
    why: "Complements this archive — use Coolors for iteration, use the archive for provenance.",
    url: "https://coolors.co",
    affiliate: false,
  },
];

/** True when DESIGN_TOOLS contains at least one real affiliate link. */
export function hasDesignToolAffiliate(): boolean {
  return DESIGN_TOOLS.some(
    (t) => t.affiliate && !t.url.includes("PLACEHOLDER"),
  );
}
