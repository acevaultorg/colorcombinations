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
 *  - ~~No display ads (AdSense/Mediavine) at any traffic level — museum identity
 *    forbids multi-slot ad networks. Carbon Ads is the only exception.~~
 *    **CONTESTED 2026-09-04 — DO NOT ACT ON EITHER READING WITHOUT THE OPERATOR.**
 *    colorcombinations.org was submitted to Mediavine Journey at the operator's
 *    explicit request ("can you do it? take over computer") and was APPROVED the
 *    same day. So the operator has knowingly reopened this, and the line above is
 *    no longer a standing prohibition you can rely on.
 *
 *    But it is not simply void either. The April reasoning (DECISIONS.md
 *    2026-04-10) was BRAND, not math: "Mediavine/Raptive make the most money at
 *    scale but destroy the museum identity (4-8 slots, video autoplay, sticky
 *    banners)". Applying to a programme is not the same decision as agreeing to
 *    serve 4-8 slots on every page, and there is no evidence the April tradeoff
 *    was re-examined before applying.
 *
 *    Unverified: Journey's actual ad density. The 4-8 figure describes FULL
 *    Mediavine; Mediavine publishes no public density spec for the Journey tier
 *    (checked 2026-09-04 — no dedicated Journey page exists on their site).
 *
 *    ~~NO AD CODE IS INSTALLED (verified live: 0 mediavine references, control
 *    gtag=12). Do not install it.~~ **FALSE — corrected 2026-09-04. It was the
 *    GREP that was wrong, not the site.** The Journey tag ships from
 *    scripts.scriptwrapper.com, a URL containing none of the strings
 *    "mediavine", "grow.me" or "journeymv". Grepping the vendor NAME returns
 *    zero while the vendor SCRIPT is on every page. The gtag=12 control proved
 *    the fetch worked; it could not prove the search TERM was right — a control
 *    validates the instrument, never your query terms. TWO independent sessions
 *    reached this same wrong conclusion. Verify with a marker that actually
 *    ships: `scriptwrapper` or the site id `0e3765cf`, and confirm the tag
 *    returns ~171KB (a 0c… id variant returns HTTP 200 with a ZERO-BYTE body,
 *    so a status code cannot tell the two apart).
 *
 *    MEASURED STATE 2026-09-04: ad code IS installed (8e738e3) and IS serving
 *    on /, /browse and /trends/color-trends-2026/ (scriptwrapper=1, siteid=1,
 *    control G-QT7PC59PV6=3 on each). ads.txt is Mediavine-managed. Site is
 *    approved and launched on Journey.
 *
 *    STILL UNRESOLVED, STILL THE OPERATOR'S: whether the museum identity
 *    tolerates Journey's ad density. Approval and installation did not settle
 *    that question — they only changed the default. Do not "clean up" this
 *    contradiction by deleting either side.
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
    "378 SVG plates (348 Wada + 30 editorial) — print-ready at any size",
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

  /**
   * Appends Amazon's official custom-tracking param (&ascsubtag=<pageclass>)
   * so the per-page click data we already have (Plausible/GA4/beacon) can be
   * joined against Amazon's own order-report data per PAGE CLASS, not just
   * per SITE — the fleet's biggest measurement gap (per-page revenue is
   * currently modelled from per-site $/click, not measured). Value is a
   * short slug (book, compare, palette, art-supplies, ...), no PII, no free
   * text — safe to expose in a URL.
   *
   * Idempotent + no-op when `pageClass` is omitted, matching the discipline
   * copy-forked from readinglist-school's components/BuyLinks.tsx: a URL
   * carrying two ascsubtag params is worse than one carrying none (Amazon
   * takes a single value; which of two survives is not ours to choose).
   */
  withSubtag(url: string, pageClass?: string): string {
    if (!pageClass) return url;
    if (/[?&]ascsubtag=/.test(url)) return url;
    const sep = url.includes("?") ? "&" : "?";
    return `${url}${sep}ascsubtag=${encodeURIComponent(pageClass)}`;
  },

  /**
   * True only for a real ISBN-10: 9 digits + a check digit (0-9 or X) that
   * satisfies the mod-11 weighted sum. Used to decide which links may be
   * geo-routed — see `link()`.
   */
  isIsbn10(s: string): boolean {
    if (!/^[0-9]{9}[0-9X]$/.test(s)) return false;
    let sum = 0;
    for (let i = 0; i < 10; i++) {
      const c = s[i]!;
      sum += (10 - i) * (c === "X" ? 10 : Number(c));
    }
    return sum % 11 === 0;
  },

  /**
   * Build an affiliate link from an ASIN or full amazon.com URL.
   *
   * BOOKS (ISBN-10) route through our own /go/b/{isbn} redirect so that EU
   * visitors can be sent to their local Amazon — see functions/go/b/[[isbn]].js.
   * This matters here more than anywhere else in the fleet: ~22-30% of this
   * site's humans are in the EU, and amazon.com does not geo-redirect, so a
   * EUR 13 book arrives with ~80% import charges and the click dies.
   *
   * NON-BOOK ASINs (B-prefix: the ART_SUPPLIES items and the Seigensha Wada
   * set B094NTK2RB) now route through /go/p/{asin} — see functions/go/p/[[asin]].js.
   * They are still NOT geo-routed, for the original reason: a B-prefix ASIN is
   * an Amazon-internal identifier with no guarantee the same product exists on
   * amazon.de, so .com stays the destination. What changed (2026-08-26) is only
   * that the tag is no longer emitted into the HTML.
   *
   * WHY: gating ISBNs alone left the other half of the surface open — 1,025
   * fully-tagged amazon.com hrefs across 406 built pages. That is a real
   * harvest surface whether or not it is currently exploited, and the gate
   * mechanism is already proven here (books gated since 2026-08-14).
   *
   * ⚠️ CORRECTED SAME DAY: this change was first justified by "306 Amazon
   * clicks vs 24 beaconed = 8% capture, therefore harvested". That inference
   * is WRONG. Amazon reported 35 ORDERS on those same 306 clicks, and every
   * order needs a click — so there were more real human clicks than the beacon
   * saw. The beacon undercounts; the ratio measures its coverage, not bot
   * share. Bots do not order at 11.4%.
   *
   * RULE: never diagnose harvesting from a capture ratio alone. Check ORDERS
   * first — orders exceeding beaconed clicks proves the instrument is broken,
   * not the traffic. Harvesting is indicated only when orders are ~0 AND
   * capture is low. Do not cite this change as precedent for gating another
   * earning site on a ratio.
   *
   *   • Full URLs still pass through verbatim, so any hand-built SiteStripe or
   *     bounty URL added later is never rewritten by this function. A
   *     hand-rebuilt bounty URL pays $0, so this function must never touch one.
   *
   * The ISBN-10 checksum — not a length check — is what gates the geo path,
   * because it is exactly the property that makes /dp/{id} resolve to the
   * same title on every marketplace.
   *
   * @param pageClass optional &ascsubtag= page-class slug (see withSubtag).
   *   For the geo-routed /go/b/{isbn} path the tag itself is decided
   *   server-side and never touches this URL — so pageClass instead rides as
   *   `?c=<pageClass>`, a query param functions/go/b/[[isbn]].js reads and
   *   re-appends as &ascsubtag= on whichever marketplace it resolves to.
   *   Same idempotent, no-PII, short-slug discipline either way.
   */
  link(asinOrUrl: string, pageClass?: string): string {
    const isAsin = /^[A-Z0-9]{10}$/.test(asinOrUrl);
    if (isAsin && this.isIsbn10(asinOrUrl) && this.isLive) {
      // First-party, geo-routed. The tag is applied server-side so it can
      // differ per marketplace; it is deliberately absent from the HTML.
      const goUrl = `/go/b/${asinOrUrl}`;
      return pageClass ? `${goUrl}?c=${encodeURIComponent(pageClass)}` : goUrl;
    }
    if (isAsin && this.isLive) {
      // Non-book ASIN → first-party product redirect. Not geo-routed (see the
      // note above); the point is only that the tag leaves the HTML.
      const goUrl = `/go/p/${asinOrUrl}`;
      return pageClass ? `${goUrl}?c=${encodeURIComponent(pageClass)}` : goUrl;
    }
    const base = isAsin
      ? `https://www.amazon.com/dp/${asinOrUrl}`
      : asinOrUrl;
    if (!this.isLive) return base;
    const sep = base.includes("?") ? "&" : "?";
    return this.withSubtag(`${base}${sep}tag=${this.tag}`, pageClass);
  },
} as const;

// ============================================================================
// PRIME BOUNTY — flat-fee lane, independent of order value (added 2026-08-28)
// ============================================================================

/**
 * Why this exists: this site's commission problem is NOT conversion. The
 * Amazon read shows 306 clicks → 35 ORDERS (11.4%), which is a healthy
 * audience that acts. It earns ~$16/mo anyway because those 35 orders
 * average ~$0.46 of commission each — the items are cheap and books pay
 * 4.5%. Order VALUE is the ceiling here, not traffic and not the CTA.
 *
 * A bounty sidesteps that ceiling entirely: it pays a FLAT fee per free-trial
 * sign-up, earned off clicks the site already gets, and is unaffected by what
 * (or whether) the reader subsequently buys. It stacks with the commission
 * shelf, it never replaces it.
 *
 * The pitch is honest and tied to this page's own moment: someone who has
 * just taken the hex codes and is ordering paint or paper genuinely benefits
 * from fast free delivery and free returns, because a colour that arrives
 * wrong is the failure mode of that purchase.
 *
 * HARD RULES (see ~/.claude memory `reference_prime_bounty_lane_rollout`):
 *  - This URL is SiteStripe-generated and must stay BYTE-EXACT. The `linkId`
 *    is issued server-side and cannot be invented — a hand-rebuilt bounty URL
 *    pays $0. Never edit the linkId, never swap another site's tag into it.
 *  - Do NOT route it through `/go/`. Unlike the ASIN links above, the bounty
 *    keeps its raw href; `rel="sponsored nofollow"` is the control that
 *    matters and a first-party hop buys nothing here.
 *  - No price, no scarcity language, disclosure adjacent to the link.
 *  - Bounties are NOT tag-attributable — every one reports under `Others` in
 *    the Associates dashboard. The per-site tag is correct hygiene, not a
 *    measurement channel. Do not expect this to show up under
 *    colorcombinations-20.
 */
export const PRIME_BOUNTY = {
  /** SiteStripe full link, generated 2026-08-27 for tag colorcombinations-20. */
  url: "/go/prime",

  /** Honest, page-matched pitch. No price, no urgency, no "support us". */
  pitch:
    "Ordering paint or paper for this palette? Amazon Prime's free 30-day trial includes fast free delivery and free returns — useful when a colour has to be right and a week's wait is how you find out it isn't.",

  /** Link text. */
  cta: "Start the free 30-day trial",

  /** FTC disclosure, rendered adjacent to the link in every variant. */
  disclosure:
    "Affiliate link — we may earn a commission on qualifying sign-ups, at no extra cost to you. Current terms are on Amazon's page.",
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
  /**
   * URL slug for the book's own page at `/books/[slug]`. Stable — treat as
   * a permalink; changing one breaks an indexed URL. Derived by hand rather
   * than slugified from the title so punctuation choices stay deliberate.
   */
  slug: string;
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
    slug: "a-dictionary-of-color-combinations",
    title: "A Dictionary of Color Combinations",
    author: "Sanzo Wada",
    note: "The 2010 Seigensha republication of the 1933 original. Japanese import.",
    amazonAsin: "4861522471",
    isbn: "4861522471",
    coverUrl: "/book-covers/wada-vol-1.jpg",
    // Vol 1 took 119 Amazon clicks and returned 0 orders in 30d, while Vol 2 took
    // 34 and returned 4 (11.8%). The cause isn't the copy or the listing — it's
    // that every combination in Vol 1 is already browsable free on this site, with
    // hex values (see /compare/wada-vol-1-vs-vol-2). Asking someone to buy the data
    // we give away is a click they were never going to convert on.
    //
    // So this now says so plainly and points at the two reasons someone genuinely
    // does buy it: the printed object, and a citable copy of the 1933 classic.
    // Fewer clicks here is the intended outcome — the ones left are qualified, and
    // readers who want plates they can't get free are routed to Vol 2.
    why: "Every combination in it is already browsable free here, hex values and all. Buy this one for the object rather than the data — Seigensha's matte plates and Japanese binding, or a citable copy of the 1933 original. If you want plates this archive doesn't have, Vol. 2 is the one.",
  },
  {
    slug: "a-dictionary-of-color-combinations-vol-2",
    title: "A Dictionary of Color Combinations Vol. 2",
    author: "Sanzo Wada",
    note: "Seigensha, 2020. Japanese import.",
    amazonAsin: "4861527724",
    isbn: "4861527724",
    coverUrl: "/book-covers/wada-vol-2.jpg",
    why: "Wada's 1935–1938 follow-ups: 72 plates on the Japanese seasons and 165 drawn from early-century fashion, interior, and graphic design. Not in Vol. 1. Not in this archive. The book itself is a design object — Japanese binding, matte pages, zero captions.",
  },
  {
    slug: "interaction-of-color",
    title: "Interaction of Color",
    author: "Josef Albers",
    note: "50th Anniversary Edition, Yale University Press.",
    amazonAsin: "0300179359",
    isbn: "0300179359",
    olCoverId: 13011097,
    why: "The most important book on how colors behave next to each other. Still the default reference in art schools.",
  },
  {
    slug: "the-secret-lives-of-color",
    title: "The Secret Lives of Color",
    author: "Kassia St. Clair",
    note: "Penguin, 2017.",
    amazonAsin: "0143131141",
    isbn: "0143131141",
    olCoverId: 9431201,
    why: "Seventy-five individual colors, each with a short history. Reads like a cabinet of curiosities.",
  },
  {
    slug: "color-a-natural-history-of-the-palette",
    title: "Color: A Natural History of the Palette",
    author: "Victoria Finlay",
    note: "Random House, 2004.",
    amazonAsin: "0812971426",
    isbn: "0812971426",
    olCoverId: 210215,
    why: "Investigative travelogue through dye sources — indigo farms, lapis mines, safflower fields. The journey of kurenai.",
  },
  {
    slug: "chromaphilia",
    title: "Chromaphilia",
    author: "Stella Paul",
    note: "Phaidon, 2017.",
    amazonAsin: "0714873896",
    isbn: "0714873896",
    olCoverId: 12410845,
    why: "240 artworks organized by color. A visual counterpart to Wada's dictionary.",
  },
  {
    slug: "the-designers-dictionary-of-color",
    title: "The Designer's Dictionary of Color",
    author: "Sean Adams",
    note: "Abrams, 2017.",
    amazonAsin: "141972391X",
    isbn: "141972391X",
    olCoverId: 12434476,
    why: "A practical, example-filled guide to thirty key colors and the way they behave together. Working-designer companion to Wada's historical archive.",
  },
  {
    slug: "pantone-the-twentieth-century-in-color",
    title: "Pantone: The Twentieth Century in Color",
    author: "Leatrice Eiseman & Keith Recker",
    note: "Chronicle Books, 2011.",
    amazonAsin: "0811877566",
    isbn: "0811877566",
    // Open Library has no cover for this title; renders the "PT" fallback tile.
    why: "A decade-by-decade visual history of color in design, advertising, and culture from 1900 to 2000. The modern complement to Wada's pre-war record.",
  },
  {
    slug: "color-index-xl",
    title: "Color Index XL",
    author: "Jim Krause",
    note: "Watson-Guptill, 2017.",
    amazonAsin: "0399579788",
    isbn: "0399579788",
    olCoverId: 10359072,
    why: "1,100+ ready-to-apply palettes with CMYK + RGB formulas. The shelf-reference designers reach for on deadline.",
  },
  {
    slug: "on-color",
    title: "On Color",
    author: "David Scott Kastan with Stephen Farthing",
    note: "Yale University Press, 2018.",
    amazonAsin: "0300171870",
    isbn: "0300171870",
    olCoverId: 14576277,
    why: "Ten essays — one per color — pairing cultural history with how each pigment came to mean what it does. A good companion to Victoria Finlay's Color, also on this shelf.",
  },
  {
    slug: "the-anatomy-of-color",
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

/** Look up one shelf book by its `/books/[slug]` permalink. */
export function bookBySlug(slug: string): CuratedBook | undefined {
  return FURTHER_READING.find((b) => b.slug === slug);
}

/**
 * The other books on the shelf, for the "also on the shelf" rail at the foot
 * of a book page. Rotates from the current book's position so each page shows
 * a different trio — no randomness, so the HTML stays stable per URL.
 */
export function relatedBooks(slug: string, count = 3): CuratedBook[] {
  const i = FURTHER_READING.findIndex((b) => b.slug === slug);
  if (i === -1) return FURTHER_READING.slice(0, count);
  const rotated = [
    ...FURTHER_READING.slice(i + 1),
    ...FURTHER_READING.slice(0, i),
  ];
  return rotated.slice(0, count);
}

// ============================================================================
// COLOR REFERENCE LIBRARY — standalone higher-price curated shelf
// (added 2026-08-15, for /shop/color-reference-library)
// ============================================================================

/**
 * Why this page exists, distinct from /shop: /shop converts at 73.3%
 * (75 users → 55 Amazon clicks, 30d) — the highest-converting surface on the
 * site — but it is a single page carrying the site's entire book rail while
 * 2,862 humans/mo sit on /browse and /colors, converting at 0.6-0.9%. Those
 * readers are mid-task (reading a palette, scanning a hue), not in a buying
 * mindset; /shop's visitors already arrived wanting to browse the shelf.
 * This page gives /browse and /colors a second, deliberate entry point into
 * that same buying mindset, built around named reference works a colour
 * researcher would actually go looking for by title — "Sanzo Wada colour
 * dictionary", "Munsell colour system", "Pantone colour reference" — rather
 * than the general museum-gift-shop framing of /shop.
 *
 * Every "why" line below is written fresh for this page's framing (not
 * copy-pasted from FURTHER_READING) even where the book is the same one
 * that also appears on /shop — four of six here are Wada Vol 1/2, Albers,
 * and the Pantone Chronicle Books title, all already verified there. The
 * other two (Gurney, Syme) are new additions, each ISBN checksum-verified
 * and cross-checked against a live Open Library bibliographic record before
 * being added (see verification notes inline). Zero-fabrication per
 * fleet standard — no guessed ISBNs, no invented editions.
 *
 * Deliberately excluded: the Amazon-native Pantone Formula Guide (ASIN
 * B0BJ13LVD4, already on the /shop art-supplies rail) — a $200+ professional
 * ink-chip fan guide, not a "reference book" a browsing reader buys on
 * impulse, and its price sits far outside this shelf's band.
 */
export const COLOR_REFERENCE_LIBRARY: CuratedBook[] = [
  {
    slug: "a-dictionary-of-color-combinations",
    title: "A Dictionary of Color Combinations",
    author: "Sanzo Wada",
    note: "Seigensha, 2010 reprint of the 1933 original. Japanese import.",
    amazonAsin: "4861522471",
    isbn: "4861522471",
    coverUrl: "/book-covers/wada-vol-1.jpg",
    why: "The book this entire archive is a digitisation of — 348 combinations, organised by tone rather than hue, the way a working colourist actually sorts them. Every plate is free to browse here; this is the printed original, matte Seigensha binding and all.",
  },
  {
    slug: "a-dictionary-of-color-combinations-vol-2",
    title: "A Dictionary of Color Combinations Vol. 2",
    author: "Sanzo Wada",
    note: "Seigensha, 2020. Japanese import.",
    amazonAsin: "4861527724",
    isbn: "4861527724",
    coverUrl: "/book-covers/wada-vol-2.jpg",
    why: "Wada's 1935-1938 follow-up sets — 237 further plates across seasonal, fashion, interior and graphic-design colourways — none of them digitised in this archive, so this volume is the only place to see them.",
  },
  {
    slug: "interaction-of-color",
    title: "Interaction of Color",
    author: "Josef Albers",
    note: "50th Anniversary Edition, Yale University Press.",
    amazonAsin: "0300179359",
    isbn: "0300179359",
    olCoverId: 13011097,
    why: "Wada catalogues what combinations look like; Albers explains why they behave the way they do — the same colour reading as three different values depending on what sits next to it. The exercises are still how art schools teach relational colour.",
  },
  {
    slug: "color-and-light-gurney",
    title: "Color and Light: A Guide for the Realist Painter",
    author: "James Gurney",
    note: "Andrews McMeel, 2010.",
    amazonAsin: "0740797719",
    isbn: "0740797719",
    // Verified 2026-08-15: ISBN-10 0740797719 checksum-valid; Open Library
    // record confirms title/author/2010 date (OL work matches Amazon
    // listing at /Color-Light-Realist-Painter-Gurney/dp/0740797719); genuine
    // cover indexed at covers.openlibrary.org. Content match confirmed via
    // publisher/retailer copy: the book teaches value/hue/chroma observation
    // built directly on Munsell's hue-value-chroma notation.
    why: "Not written by Munsell, and honestly billed as such: this is the working painter's field guide to his hue/value/chroma notation — the version of the Munsell system actually used at an easel rather than in a lab, from an artist who paints for a living.",
  },
  {
    slug: "pantone-the-twentieth-century-in-color",
    title: "Pantone: The Twentieth Century in Color",
    author: "Leatrice Eiseman & Keith Recker",
    note: "Chronicle Books, 2011.",
    amazonAsin: "0811877566",
    isbn: "0811877566",
    // Open Library has no indexed cover for this ISBN; renders the "PT"
    // fallback tile, same as its existing /shop listing.
    why: "The Pantone Color Institute's own decade-by-decade account of how colour moved through design, advertising and product from 1900 to 2000 — a reference for tracing a palette back to the decade it belongs to.",
  },
  {
    slug: "werners-nomenclature-of-colours",
    title: "Werner's Nomenclature of Colours",
    author: "Patrick Syme (after Abraham Gottlob Werner)",
    note: "Smithsonian Books, 2018 facsimile of the 1821 edition.",
    amazonAsin: "1588346218",
    isbn: "1588346218",
    // Verified 2026-08-15: ISBN-10 1588346218 checksum-valid; Open Library
    // record (key OL26951463M) confirms "Werner's nomenclature of colours",
    // author Patrick Syme, publish_date 2018, matching the Smithsonian
    // Books facsimile edition sold on Amazon. No indexed OL cover; renders
    // the fallback tile.
    why: "The dictionary that came a century before Wada's — Syme matched 110 named colours to birds, minerals and plants so naturalists in the field could describe what they saw precisely. Darwin carried a copy on the Beagle. The same instinct as this whole archive, just 1821's version of it.",
  },
] as const;

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
  /**
   * Real, working vendor URL to use INSTEAD of `url` while `url` is still a
   * PLACEHOLDER (unactivated affiliate ID). Required whenever `url` contains
   * "PLACEHOLDER" — a placeholder click-tracking URL is not a live link,
   * it 400s/403s (verified 2026-09-06: prf.hn/click/camref:PLACEHOLDER_IMPACT_ADOBE
   * returns HTTP 400). Rendering a broken link to real visitors is worse than
   * rendering a real, non-monetized one until the ID is activated.
   */
  fallbackUrl?: string;
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
    fallbackUrl: "https://www.adobe.com/creativecloud.html",
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
    fallbackUrl: "https://www.canva.com",
  },
  {
    name: "Framer",
    category: "prototype",
    description: "Design tool + no-code site builder. Publishes straight to the web.",
    why: "If you want the palettes as a live brand system with a working site, Framer gets there without leaving the canvas.",
    url: "https://www.framer.com/?via=PLACEHOLDER",
    affiliate: true,
    commission: "~$25 recurring",
    fallbackUrl: "https://www.framer.com",
  },
  {
    name: "Tailwind UI",
    category: "design",
    description: "Premium component library by the Tailwind team. Production-ready blocks.",
    why: "Drop a Wada palette into Tailwind UI's components and ship a brand-coherent site in a day. The CSS-vars export from this archive plugs straight into Tailwind config.",
    url: "https://tailwindui.com/?ref=PLACEHOLDER_TAILWIND_REFERRAL",
    affiliate: true,
    commission: "30% recurring",
    fallbackUrl: "https://tailwindui.com",
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
  /**
   * Real, working vendor URL to use INSTEAD of `url` while `url` is still a
   * PLACEHOLDER (unactivated affiliate ID). Same reasoning as
   * DesignTool.fallbackUrl (monetization.ts, verified 2026-09-06): a
   * placeholder click-tracking URL 400s/403s, it does not "still work."
   * Not yet consumed live (LearnResources.astro isn't rendered by any
   * page today), populated pre-emptively so building `/courses/` later
   * doesn't reintroduce the same broken-link class.
   */
  fallbackUrl?: string;
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
    fallbackUrl: "https://www.skillshare.com",
  },
  {
    name: "Domestika — Color Theory Courses",
    tagline: "Spanish-origin design platform with deep colour-theory catalogue.",
    why: "Domestika's colour-theory courses go deeper than Skillshare's — closer to academic rigor without the academic price.",
    url: "https://www.domestika.org/?ref=PLACEHOLDER_DOMESTIKA_REFERRAL",
    affiliate: true,
    commission: "20-30% per course",
    tags: ["color theory", "course", "fine art"],
    fallbackUrl: "https://www.domestika.org",
  },
  {
    name: "Coursera — Google UX Design Certificate",
    tagline: "Google's official UX Design Certificate — career credential level.",
    why: "If you're a designer pivoting toward UX, the Google certificate carries actual hiring weight. Colour theory is one of its modules.",
    url: "https://imp.i384100.net/PLACEHOLDER_COURSERA_IMPACT",
    affiliate: true,
    commission: "$15-45 per certificate enrolment (Impact.com)",
    tags: ["UX design", "certificate", "career"],
    fallbackUrl: "https://www.coursera.org",
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
  /** Real fallback while `url` is a PLACEHOLDER — see LearnResource.fallbackUrl. */
  fallbackUrl?: string;
}

export const POD_PROVIDERS: PodProvider[] = [
  {
    name: "Printful",
    tagline: "Print-on-demand with no minimums. Apparel, accessories, home.",
    why: "Take a Wada palette into Printful's design tool and produce brand-matched apparel/posters/stationery in a single afternoon. No inventory.",
    url: "https://www.printful.com/a/PLACEHOLDER_PRINTFUL_REFERRAL",
    affiliate: true,
    commission: "10% of customer orders for 9 months",
    fallbackUrl: "https://www.printful.com",
  },
  {
    name: "Printify",
    tagline: "POD network with a wider catalogue + lower base prices.",
    why: "Cheaper base costs than Printful — better margin if you're selling to clients. Same colour-matching workflow.",
    url: "https://printify.com/?ref=PLACEHOLDER_PRINTIFY_REFERRAL",
    affiliate: true,
    commission: "5% of customer orders, lifetime",
    fallbackUrl: "https://printify.com",
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
  group: "paint" | "print" | "calibrate";
  /**
   * Physical form, drives the generated CSS/SVG glyph. NOT a product photo:
   * Amazon images may only be used via PA-API/SiteStripe (shared Associates
   * account — one breach hits every fleet site), so the visual is a
   * type-glyph that says "this is a fan deck / a puck / a pan set", labelled
   * by the verified title underneath. Accurate by construction, zero requests.
   */
  form: "fan" | "puck" | "target" | "pans" | "pad" | "pen";
}

export const ART_SUPPLIES: ArtSupply[] = [
  // ── Colour management ─────────────────────────────────────────────────────
  // Basket-size note (2026-08-28): measured across the fleet's six earning
  // sites, commission RATE spans 1.34x (2.97-3.99%) while ITEM PRICE spans
  // 29x ($10.94 - $322). Earnings track the price of the thing in the cart,
  // not the rate and not the CTA. This site had the fleet's second-largest
  // clean human pool (4,162/30d) on a $21 average item — the lowest yield per
  // visitor in the fleet. These items are the genuine high-basket end of the
  // SAME intent: a reader holding hex codes who needs them to survive the trip
  // to print or to another screen. All ASINs read live off the /dp/ page
  // 2026-08-28 (exact title + in-stock state below); low-stock items excluded
  // on purpose — datacolor SpyderCheckr showed "only 14 left" and was dropped.
  {
    name: "Color Bridge Guide Set — coated & uncoated",
    brand: "Pantone",
    amazonAsin: "B0BJ147GF9",
    verifiedTitle:
      "Pantone GP6102B Color Bridge Guide Set Coated & Uncoated, Multi-Colour",
    why: "This site hands you hex codes. Color Bridge is the deck that shows what an RGB or HTML value becomes as CMYK ink, and which Pantone spot sits nearest it — the translation step between a screen palette and a printed one. Coated and uncoated because the same ink is not the same colour on both stocks.",
    group: "print",
    form: "fan",
  },
  {
    name: "Color Bridge Guide — coated",
    brand: "Pantone",
    amazonAsin: "B0BJ12GV85",
    verifiedTitle:
      "Pantone Color Bridge Guide Coated | Pantone to CMYK, RGB & HTML Color Matching Fan Deck for Graphic Design, Branding & Print | GG6103B",
    why: "The coated half on its own — Pantone to CMYK, RGB and HTML in a single fan. The smaller entry point if your work only ever goes onto coated stock.",
    group: "print",
    form: "fan",
  },
  {
    name: "ColorChecker Studio spectrophotometer",
    brand: "Calibrite",
    amazonAsin: "B0973JVF85",
    verifiedTitle:
      "Calibrite ColorChecker Studio Spectrophotometer for Complete Color Management for Display, Projector, Printer and Scanner Profiling",
    why: "A spectrophotometer profiles the whole chain — display, printer, projector, scanner — so the colour you picked is the colour that comes out the other end. The full-fidelity option for work that ends up printed.",
    group: "calibrate",
    form: "puck",
  },
  {
    name: "Display Plus HL colorimeter kit",
    brand: "Calibrite",
    amazonAsin: "B0DPN7L6L5",
    verifiedTitle:
      "Calibrite Video Photo Kit with Display Plus HL Colorimeter and ColorChecker Passport Video 2, 10,000 Nit Monitor Calibration, Camera Color Matching",
    why: "A colorimeter calibrates the monitor itself. Worth saying plainly: an uncalibrated screen is the most common reason a palette that looked right on your desk looks wrong everywhere else.",
    group: "calibrate",
    form: "puck",
  },
  {
    name: "ColorChecker Passport Photo 2",
    brand: "Calibrite",
    amazonAsin: "B0973HSH3V",
    verifiedTitle:
      "Calibrite ColorChecker Passport Photo 2 Portable Color Calibration Kit for Photo and Video, 4 Target Set for White Balance, Exposure and Creative Look",
    why: "A pocket target for fixing white balance and exposure at the moment of capture — the step before any colour correction, if your palette starts from a photograph rather than a screen.",
    group: "calibrate",
    form: "target",
  },

  // ── Making ────────────────────────────────────────────────────────────────
  {
    name: "Gansai Tambi 24 — Art Nouveau",
    brand: "Kuretake",
    amazonAsin: "B0B87XPWB2",
    verifiedTitle:
      "Kuretake GANSAI TAMBI Watercolor Paint Set 24 Colors II - Art Nouveau",
    why: "Gansai are traditional Japanese watercolour pans — dense, matte and easy to mix, the closest everyday medium to the flat printed colour Wada's plates were made in. This is the Art Nouveau-themed 'II' edition, a different 24 to the standard set.",
    group: "paint",
    form: "pans",
  },
  {
    name: "Gansai Tambi 36",
    brand: "Kuretake",
    amazonAsin: "B001MPA6W4",
    verifiedTitle:
      "Kuretake GANSAI TAMBI Watercolor Paint Set 36 Colors",
    why: "The larger pan set. More range means mixing toward a specific plate rather than approximating it from six colours.",
    group: "paint",
    form: "pans",
  },
  {
    name: "300 Series watercolour pad, 140 lb cold press",
    brand: "Strathmore",
    amazonAsin: "B000KNLQIM",
    verifiedTitle:
      "Strathmore 300 Series Tape Bound Watercolor Pad, 140 lb. Cold Press, 11 X 15 inches, White, 12 Sheets (360-111)",
    why: "140 lb cold press is the weight that takes a wet wash without buckling — the paper most colour studies end up on.",
    group: "paint",
    form: "pad",
  },
  {
    name: "Fude Touch brush sign pen",
    brand: "Pentel",
    amazonAsin: "B07HKZYBVM",
    verifiedTitle:
      "Pentel Fude Touch Sign Pen, Black, Felt Pen Like Brush Stroke (SES15C-A) 3 Pieces",
    why: "A felt brush tip for the labelling and linework around a swatch study — the annotation half of a colour notebook.",
    group: "paint",
    form: "pen",
  },
  {
    name: "Formula Guide — coated & uncoated",
    brand: "Pantone",
    amazonAsin: "B0BJ13LVD4",
    verifiedTitle:
      "Pantone Formula Guide – Coated & Uncoated | Professional PMS Color Matching System for Print, Packaging & Graphic Design | GP1601B",
    why: "When a palette leaves the screen, this is the shared vocabulary between you and the press. Coated and uncoated because the same ink is not the same colour on both.",
    group: "print",
    form: "fan",
  },
];
