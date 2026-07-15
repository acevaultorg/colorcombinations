/**
 * Pinterest RSS feed — /pinterest-feed.xml  (the auto-pin engine)
 *
 * Point Tailwind (Pinterest's official scheduling partner) or any RSS-to-Pin
 * tool at this URL and it auto-schedules one pin per <item> on a cadence — the
 * semi-automated path (no manual-posting-forever). One item per palette:
 * the vertical pin image (/pin/[slug].png) via <enclosure> + media:content
 * (both read by common schedulers), a keyword-first title, a hashtagged
 * description, and the deep link to the palette page.
 *
 * Static build (Astro output). Regenerates on every build.
 */

import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";

const SITE = "https://colorcombinations.org";

const xesc = (s: string): string =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");

export const GET: APIRoute = () => {
  const items = allPalettes()
    .map((p) => {
      const link = `${SITE}/palettes/${p.slug}/`;
      const img = `${SITE}/pin/${p.slug}.png`;
      const hexes = p.colors.map((c) => c.hex.toUpperCase()).join(" ");
      const title = `${p.title} — ${p.colors.length}-color palette (hex codes)`;
      const desc =
        `${p.summary} Hex codes: ${hexes}. Free to copy & use. ` +
        `#colorpalette #colorcombination #colorinspiration #hexcodes #colorscheme #${p.era} #${p.dominantHue}`;
      return `    <item>
      <title>${xesc(title)}</title>
      <link>${xesc(link)}</link>
      <guid isPermaLink="false">pin-${p.slug}</guid>
      <description>${xesc(desc)}</description>
      <enclosure url="${xesc(img)}" type="image/png" />
      <media:content url="${xesc(img)}" medium="image" type="image/png" width="1000" height="1500" />
      <media:description>${xesc(desc)}</media:description>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:media="http://search.yahoo.com/mrss/">
  <channel>
    <title>ColorCombinations — Pinterest feed</title>
    <link>${SITE}</link>
    <description>Historical color palettes with hex &amp; RGB codes, from Sanzo Wada's Dictionary of Color Combinations. Free to copy &amp; use.</description>
    <language>en-us</language>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
