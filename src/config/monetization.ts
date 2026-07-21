/**
 * MONETIZATION CONFIG — single source of truth for all revenue-adjacent URLs.
 *
 * Replace the `PLACEHOLDER_*` values after signing up for each platform.
 * Everything is build-time baked, so a redeploy is required after edits.
 *
 * V1.2 revenue strategy (ColorCombinations) — 2026-05-21:
 *
 *  1. PRIMARY — Amazon Associates (tag colorcombinations-20). Book covers +
 *     in-context embeds on palette pages + design-tool affiliate (higher
 *     commission than books). Operator directive 2026-05-21: Bookshop.org
 *     retired; Amazon is the sole storefront.
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
 * reasoning behind every line in this file. 2026-05-21 entry documents
 * the Bookshop retirement.
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
// AMAZON ASSOCIATES — sole book affiliate (4% commission, 24h cookie)
// ============================================================================

/**
 * Amazon Associates — sole book affiliate as of 2026-05-21.
 * 4% commission on books, 24-hour cookie. Requires 3 sales in 180 days
 * to stay in the program. Bookshop.org retired per operator directive.
 */
export const AMAZON = {
  /** Your associate tag — created 2026-05-12 via Amazon Associates console. */
  tag: "colorcombinations-20",

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
  plausibleDomain: "colorcombinations.org",

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
  /** Amazon ASIN — required. Used to build affiliate URL via AMAZON.link()
   *  and also as a fallback identifier for Open Library cover lookup. */
  amazonAsin: string;
  /**
   * ISBN-10 or ISBN-13 for cover image lookup. If omitted, falls back to
   * amazonAsin. If both missing, we try `olCoverId` next.
   */
  isbn?: string;
  /**
   * Open Library cover ID (e.g. from `openlibrary.org/search.json`'s
   * `cover_i` field). Used when an ISBN isn't indexed in the covers API.
   * Format: numeric ID. URL pattern:
   *   https://covers.openlibrary.org/b/id/{id}-{size}.jpg
   */
  olCoverId?: number;
  /**
   * Explicit cover URL override. Takes precedence over all other lookups.
   * Use this when Open Library has no cover for the ISBN (common for
   * Japanese publisher ISBNs) or when we want reliable local hosting
   * instead of depending on a third-party CDN.
   *
   * Absolute URLs pass through verbatim. Leading-slash paths resolve to
   * `/public/...` at build time.
   */
  coverUrl?: string;
  /** Pull-quote reason for inclusion — shown inline on listings. */
  why: string;
}

export const FURTHER_READING: CuratedBook[] = [
  {
    title: "A Dictionary of Color Combinations",
    author: "Sanzo Wada",
    note: "The 2010 Seigensha republication of the 1933 original. Japanese import.",
    amazonAsin: "4861522471",
    isbn: "4861522471",
    coverUrl: "/book-covers/wada-vol-1.jpg",
    why: "The source tradition this archive draws from. Out of print for decades; Seigensha brought it back.",
  },
  {
    title: "A Dictionary of Color Combinations Vol. 2",
    author: "Sanzo Wada",
    note: "Seigensha, 2020. Japanese import.",
    amazonAsin: "4861527724",
    isbn: "4861527724",
    coverUrl: "/book-covers/wada-vol-2.jpg",
    why: "Wada's 1935–1938 follow-ups: 72 plates on the Japanese seasons and 165 drawn from early-century fashion, interior, and graphic design. Not in Vol. 1. Not in this archive. The book itself is a design object — Japanese binding, matte pages, zero captions.",
  },
  {
    title: "Interaction of Color",
    author: "Josef Albers",
    note: "50th Anniversary Edition, Yale University Press.",
    amazonAsin: "0300179359",
    isbn: "0300179359",
    olCoverId: 13011097,
    why: "The most important book on how colors behave next to each other. Still the default reference in art schools.",
  },
  {
    title: "The Secret Lives of Color",
    author: "Kassia St. Clair",
    note: "Penguin, 2017.",
    amazonAsin: "0143131141",
    isbn: "0143131141",
    olCoverId: 9431201,
    why: "Seventy-five individual colors, each with a short history. Reads like a cabinet of curiosities.",
  },
  {
    title: "Color: A Natural History of the Palette",
    author: "Victoria Finlay",
    note: "Random House, 2004.",
    amazonAsin: "0812971426",
    isbn: "0812971426",
    olCoverId: 210215,
    why: "Investigative travelogue through dye sources — indigo farms, lapis mines, safflower fields. The journey of kurenai.",
  },
  {
    title: "Chromaphilia",
    author: "Stella Paul",
    note: "Phaidon, 2017.",
    amazonAsin: "0714873896",
    isbn: "0714873896",
    olCoverId: 12410845,
    why: "240 artworks organized by color. A visual counterpart to Wada's dictionary.",
  },
  {
    title: "The Designer's Dictionary of Color",
    author: "Sean Adams",
    note: "Abrams, 2017.",
    amazonAsin: "141972391X",
    isbn: "141972391X",
    olCoverId: 12434476,
    why: "A practical, example-filled guide to thirty key colors and the way they behave together. Working-designer companion to Wada's historical archive.",
  },
  {
    title: "Pantone: The Twentieth Century in Color",
    author: "Leatrice Eiseman & Keith Recker",
    note: "Chronicle Books, 2011.",
    amazonAsin: "0811877566",
    isbn: "0811877566",
    // Open Library has no cover for this title; renders the "PT" fallback tile.
    why: "A decade-by-decade visual history of color in design, advertising, and culture from 1900 to 2000. The modern complement to Wada's pre-war record.",
  },
  {
    title: "Color Index XL",
    author: "Jim Krause",
    note: "Watson-Guptill, 2017.",
    amazonAsin: "0399579788",
    isbn: "0399579788",
    olCoverId: 10359072,
    why: "1,100+ ready-to-apply palettes with CMYK + RGB formulas. The shelf-reference designers reach for on deadline.",
  },
  {
    title: "On Color",
    author: "David Scott Kastan with Stephen Farthing",
    note: "Yale University Press, 2018.",
    amazonAsin: "0300171870",
    isbn: "0300171870",
    olCoverId: 14576277,
    why: "Ten essays — one per color — pairing cultural history with how each pigment came to mean what it does. Sits next to Finlay on a serious shelf.",
  },
  {
    title: "The Anatomy of Color",
    author: "Patrick Baty",
    note: "Thames & Hudson, 2017.",
    amazonAsin: "0500519331",
    isbn: "0500519331",
    olCoverId: 13325619,
    why: "The story of paint and pigment in interiors from 1650 to 1960 — 600 historical swatches with provenance. The architectural-history companion to Wada's plates.",
  },
] as const;

/**
 * Resolve a cover image URL for a book.
 *
 * Priority (highest first):
 *   1. `coverUrl`    — explicit override, absolute or site-relative.
 *                      Use for reliable hosting when OL lacks the ISBN.
 *   2. `olCoverId`   — direct Open Library internal ID. More reliable
 *                      than ISBN lookups; use `openlibrary.org/search.json`
 *                      to find the `cover_i` field.
 *   3. ISBN / ASIN   — Open Library ISBN endpoint. Can return 404 when
 *                      the ISBN isn't indexed (common for Japanese
 *                      publisher ISBNs). The `default=false` query tells
 *                      OL to 404 instead of returning a 1x1 PNG, so the
 *                      `onerror` handler in FurtherReading fires and the
 *                      fallback tile renders.
 *
 * Sizes: S (small, ~150px), M (medium, ~400px), L (large, ~800px).
 * The `size` param only applies to Open Library sources; `coverUrl` is
 * treated as size-agnostic (host the size you want).
 */
export function bookCover(book: CuratedBook, size: "S" | "M" | "L" = "M"): string {
  if (book.coverUrl) return book.coverUrl;
  if (typeof book.olCoverId === "number") {
    return `https://covers.openlibrary.org/b/id/${book.olCoverId}-${size}.jpg?default=false`;
  }
  const id = book.isbn ?? book.amazonAsin ?? "";
  if (!id) return "";
  return `https://covers.openlibrary.org/b/isbn/${id}-${size}.jpg?default=false`;
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
    name: "Adobe Creative Cloud",
    category: "design",
    description: "Industry-standard design suite: Photoshop, Illustrator, InDesign, XD.",
    why: "Every Wada palette exports cleanly into Adobe color-book format. If you bill clients, Adobe is the default deliverable they expect.",
    url: "https://prf.hn/click/camref:PLACEHOLDER_IMPACT_ADOBE",
    affiliate: true,
    commission: "$30-100 per conversion (Impact.com)",
  },
  {
    name: "Figma",
    category: "design",
    description: "The default design tool. Free tier is generous.",
    why: "The tokens bundle includes a drag-in Figma file. Free tier handles most solo work.",
    url: "https://www.figma.com",
    affiliate: false,
  },
  {
    name: "Canva",
    category: "design",
    description: "Drag-and-drop design for non-designers — social, presentations, brand kits.",
    why: "Pair a Wada palette with a Canva brand kit and your client's marketing has a coherent visual identity in 20 minutes.",
    url: "https://www.canva.com/?ref=PLACEHOLDER_CANVA_REFERRAL",
    affiliate: true,
    commission: "$36 per pro signup",
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
    name: "Tailwind UI",
    category: "design",
    description: "Premium component library by the Tailwind team. Production-ready blocks.",
    why: "Drop a Wada palette into Tailwind UI's components and ship a brand-coherent site in a day. The CSS-vars export from this archive plugs straight into Tailwind config.",
    url: "https://tailwindui.com/?ref=PLACEHOLDER_TAILWIND_REFERRAL",
    affiliate: true,
    commission: "30% recurring",
  },
  {
    name: "Coolors",
    category: "color",
    description: "Palette generator with contrast checker and exports.",
    why: "Complements this archive — use Coolors for iteration, use the archive for provenance.",
    url: "https://coolors.co",
    affiliate: false,
  },
  {
    name: "Khroma",
    category: "color",
    description: "AI-trained on your color preferences — generates palettes you would have picked.",
    why: "Pair Khroma's per-user generation with the Wada archive's historical depth for a complete colour-picking workflow.",
    url: "https://khroma.co",
    affiliate: false,
  },
];

/** True when DESIGN_TOOLS contains at least one real affiliate link. */
export function hasDesignToolAffiliate(): boolean {
  return DESIGN_TOOLS.some(
    (t) => t.affiliate && !t.url.includes("PLACEHOLDER"),
  );
}

// ============================================================================
// LEARN RESOURCES — design course affiliates (v19.37 Tier-S retrofit)
// ============================================================================

/**
 * LearnResource — design-course affiliates. Per I-38 (no-Amazon-default),
 * routed via Impact.com (Skillshare, Coursera) and direct referrals
 * (Domestika). Higher commission ceiling than books since each enrolment
 * pays $5-30 vs ~$1 for a book.
 *
 * Designers using a colour archive are buying ongoing skill development.
 * Audience-fit is genuinely high — these are listed because they are
 * useful, not just because they pay.
 */
export interface LearnResource {
  name: string;
  /** Course/platform tagline. */
  tagline: string;
  /** One-line audience fit — why a Wada-archive visitor cares. */
  why: string;
  /** Destination URL — placeholder until affiliate ID is pasted. */
  url: string;
  /** When true, append FTC disclosure. */
  affiliate: boolean;
  /** Commission structure (internal note for forecasting). */
  commission?: string;
  /** Topic tags for filtering / SEO. */
  tags: ReadonlyArray<string>;
}

export const LEARN_RESOURCES: LearnResource[] = [
  {
    name: "Skillshare — Brand Identity Design",
    tagline: "Practical brand-identity courses from working designers.",
    why: "Pair a Wada palette with Skillshare's brand-identity tracks and you've got a complete client deliverable from canvas to brand book.",
    url: "https://skl.sh/PLACEHOLDER_SKILLSHARE_IMPACT",
    affiliate: true,
    commission: "$7 per signup (Impact.com)",
    tags: ["brand identity", "design fundamentals", "course"],
  },
  {
    name: "Domestika — Color Theory Courses",
    tagline: "Spanish-origin design platform with deep colour-theory catalogue.",
    why: "Domestika's colour-theory courses go deeper than Skillshare's — closer to academic rigor without the academic price.",
    url: "https://www.domestika.org/?ref=PLACEHOLDER_DOMESTIKA_REFERRAL",
    affiliate: true,
    commission: "20-30% per course",
    tags: ["color theory", "course", "fine art"],
  },
  {
    name: "Coursera — Google UX Design Certificate",
    tagline: "Google's official UX Design Certificate — career credential level.",
    why: "If you're a designer pivoting toward UX, the Google certificate carries actual hiring weight. Colour theory is one of its modules.",
    url: "https://imp.i384100.net/PLACEHOLDER_COURSERA_IMPACT",
    affiliate: true,
    commission: "$15-45 per certificate enrolment (Impact.com)",
    tags: ["UX design", "certificate", "career"],
  },
];

/** True when LEARN_RESOURCES has at least one live affiliate link. */
export function hasLearnAffiliate(): boolean {
  return LEARN_RESOURCES.some(
    (r) => r.affiliate && !r.url.includes("PLACEHOLDER"),
  );
}

// ============================================================================
// PRINT-ON-DEMAND — POD provider affiliates (v19.37 Tier-S retrofit)
// ============================================================================

/**
 * POD provider — Printful + Printify. Color-matched merch is a real
 * adjacency for designers using a colour archive (apparel, posters,
 * stationery in a brand palette). Both pay per-sale commission via
 * referral programs. No Amazon Associates per I-38.
 */
export interface PodProvider {
  name: string;
  tagline: string;
  why: string;
  url: string;
  affiliate: boolean;
  commission?: string;
}

export const POD_PROVIDERS: PodProvider[] = [
  {
    name: "Printful",
    tagline: "Print-on-demand with no minimums. Apparel, accessories, home.",
    why: "Take a Wada palette into Printful's design tool and produce brand-matched apparel/posters/stationery in a single afternoon. No inventory.",
    url: "https://www.printful.com/a/PLACEHOLDER_PRINTFUL_REFERRAL",
    affiliate: true,
    commission: "10% of customer orders for 9 months",
  },
  {
    name: "Printify",
    tagline: "POD network with a wider catalogue + lower base prices.",
    why: "Cheaper base costs than Printful — better margin if you're selling to clients. Same colour-matching workflow.",
    url: "https://printify.com/?ref=PLACEHOLDER_PRINTIFY_REFERRAL",
    affiliate: true,
    commission: "5% of customer orders, lifetime",
  },
];

/** True when POD_PROVIDERS has at least one live affiliate link. */
export function hasPodAffiliate(): boolean {
  return POD_PROVIDERS.some(
    (p) => p.affiliate && !p.url.includes("PLACEHOLDER"),
  );
}

// ============================================================================
// ART SUPPLIES — intent-matched physical shelf (added 2026-07-21)
// ============================================================================

/**
 * Why this exists: the Amazon Associates dashboard read for tag
 * `colorcombinations-20` showed ~87 clicks → 0 orders, with ~50 of those
 * clicks landing on the Sanzo Wada volumes. Those are $40-60 Japanese
 * imports whose entire catalogue this site gives away free — a visitor
 * clicks out of curiosity and leaves. The CTA is not the problem; the
 * product/intent match is.
 *
 * A visitor reading a traditional Japanese colour plate is far more often
 * an artist or designer about to MAKE something than a collector about to
 * buy an out-of-print import. This shelf carries the materials a colour
 * study actually gets made with, plus the one reference that matters when
 * a palette goes to print.
 *
 * Discipline:
 *  - Every ASIN below was verified live on amazon.com (exact product title
 *    read from the product page, stock state checked) on 2026-07-21. No
 *    guessed ASINs — a wrong ASIN sends a reader to the wrong product.
 *  - Low-stock items ("only N left") are deliberately excluded: they go
 *    dead and turn the shelf into broken promises.
 *  - No prices are rendered anywhere (Amazon Associates operating
 *    agreement), no scarcity language, no "click to support us".
 *  - Claims stay aesthetic/material and checkable. We do NOT claim any
 *    paint matches a Wada plate exactly — it doesn't.
 */
export interface ArtSupply {
  /** Short display name — not the full Amazon title (which is keyword soup). */
  name: string;
  /** Maker, shown as the byline. */
  brand: string;
  /** Verified Amazon ASIN (checked live 2026-07-21). */
  amazonAsin: string;
  /** Exact product title as read from the Amazon product page — provenance. */
  verifiedTitle: string;
  /** One honest sentence on why it belongs next to a colour plate. */
  why: string;
  /** Grouping used for the section split. */
  group: "paint" | "print";
}

export const ART_SUPPLIES: ArtSupply[] = [
  {
    name: "Gansai Tambi 24 — Art Nouveau",
    brand: "Kuretake",
    amazonAsin: "B0B87XPWB2",
    verifiedTitle:
      "Kuretake GANSAI TAMBI Watercolor Paint Set 24 Colors II - Art Nouveau",
    why: "Gansai are traditional Japanese watercolour pans — dense, matte and easy to mix, the closest everyday medium to the flat printed colour Wada's plates were made in. This is the Art Nouveau-themed 'II' edition, a different 24 to the standard set.",
    group: "paint",
  },
  {
    name: "Gansai Tambi 36",
    brand: "Kuretake",
    amazonAsin: "B001MPA6W4",
    verifiedTitle:
      "Kuretake GANSAI TAMBI Watercolor Paint Set 36 Colors",
    why: "The larger pan set. More range means mixing toward a specific plate rather than approximating it from six colours.",
    group: "paint",
  },
  {
    name: "300 Series watercolour pad, 140 lb cold press",
    brand: "Strathmore",
    amazonAsin: "B000KNLQIM",
    verifiedTitle:
      "Strathmore 300 Series Tape Bound Watercolor Pad, 140 lb. Cold Press, 11 X 15 inches, White, 12 Sheets (360-111)",
    why: "140 lb cold press is the weight that takes a wet wash without buckling — the paper most colour studies end up on.",
    group: "paint",
  },
  {
    name: "Fude Touch brush sign pen",
    brand: "Pentel",
    amazonAsin: "B07HKZYBVM",
    verifiedTitle:
      "Pentel Fude Touch Sign Pen, Black, Felt Pen Like Brush Stroke (SES15C-A) 3 Pieces",
    why: "A felt brush tip for the labelling and linework around a swatch study — the annotation half of a colour notebook.",
    group: "paint",
  },
  {
    name: "Formula Guide — coated & uncoated",
    brand: "Pantone",
    amazonAsin: "B0BJ13LVD4",
    verifiedTitle:
      "Pantone Formula Guide – Coated & Uncoated | Professional PMS Color Matching System for Print, Packaging & Graphic Design | GP1601B",
    why: "When a palette leaves the screen, this is the shared vocabulary between you and the press. Coated and uncoated because the same ink is not the same colour on both.",
    group: "print",
  },
];
