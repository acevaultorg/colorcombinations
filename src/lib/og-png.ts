/**
 * Rasterise an OG card SVG to PNG at build time.
 *
 * WHY PNG: Facebook, X, LinkedIn, Slack, Discord, WhatsApp and Pinterest all
 * refuse an SVG `og:image` — they render a blank card. On a site whose whole
 * product is visual, that meant no shareable preview on any page. The same rule
 * is already documented in src/pages/pin/[slug].png.ts ("Pinterest rejects SVG
 * pins"); the pin route was fixed, the OG routes were not.
 *
 * Rasterising happens once during the static build (Astro `output: static`), so
 * there is no runtime rasterizer and no cold-start cost. The `.png.ts` route
 * name is what gives the emitted file a real .png extension, so Cloudflare Pages
 * serves image/png without a _headers rule.
 *
 * Fonts come from the system set, matching the pin route — the OG cards use
 * Georgia, which resvg resolves locally.
 */

import { Resvg } from "@resvg/resvg-js";

/** Open Graph's standard card width. Height follows the SVG's own aspect ratio. */
const OG_WIDTH = 1200;

/**
 * Average glyph advance as a fraction of font-size for the Georgia-class serif
 * these cards render in. Mixed-case English sits near 0.5; 0.52 leaves headroom
 * for wide-glyph titles rather than clipping them.
 *
 * WHY THIS EXISTS: the cards used to truncate on CHARACTER COUNT (e.g. "title
 * longer than 38 chars"), a limit calibrated against EB Garamond — a narrow
 * face. Nothing enforced it visually while the cards were SVG, because no
 * social surface rendered them. Once they rasterise in a wider serif, a
 * character budget stops corresponding to a pixel budget and long titles run
 * straight off the 1200px canvas. Fit to WIDTH, not to character count.
 */
const SERIF_CHAR_W = 0.52;

/** Truncate `s` so it fits `availPx` at `fontSize`, appending an ellipsis. */
export function fitText(
  s: string,
  fontSize: number,
  availPx: number,
  charW: number = SERIF_CHAR_W,
): string {
  const max = Math.max(4, Math.floor(availPx / (fontSize * charW)));
  return s.length > max ? s.slice(0, max - 1).trimEnd() + "…" : s;
}

export function svgToPngResponse(svg: string, width: number = OG_WIDTH): Response {
  const png = new Resvg(svg, {
    font: { loadSystemFonts: true, defaultFontFamily: "Georgia" },
    fitTo: { mode: "width", value: width },
  })
    .render()
    .asPng();

  return new Response(new Uint8Array(png), {
    status: 200,
    headers: {
      "Content-Type": "image/png",
      // Content is deterministic per slug and only changes on rebuild.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
