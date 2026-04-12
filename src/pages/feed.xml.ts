import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";

/**
 * RSS 2.0 feed — surfaces the 30 editorial (curated) palettes as feed items.
 * Feed readers, Feedly, Inoreader, and newsletter auto-syndication tools can
 * pick this up for content distribution.
 */
export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org";

  // Use curated/featured palettes for feed content — these have the richest descriptions.
  const palettes = allPalettes()
    .filter((p) => !p.slug.startsWith("wada-"))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const items = palettes.map((p, i) => {
    const url = `${siteUrl}palettes/${p.slug}/`;
    // Deterministic pub dates: spread across weeks starting from site launch
    const pubDate = new Date(2026, 3, 10); // April 10, 2026 (launch day)
    pubDate.setDate(pubDate.getDate() + i * 2); // 1 palette every 2 days

    const colorList = p.colors
      .map((c) => `${c.nameRomaji ?? c.hex} (${c.hex})`)
      .join(", ");

    const swatchHtml = p.colors
      .map(
        (c) =>
          `<span style="display:inline-block;width:24px;height:24px;background:${c.hex};border:1px solid #ccc;border-radius:2px;margin-right:4px"></span>`,
      )
      .join("");

    return `    <item>
      <title><![CDATA[${p.title}${p.titleJa ? ` (${p.titleJa})` : ""}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate.toUTCString()}</pubDate>
      <description><![CDATA[${p.summary} Colors: ${colorList}.]]></description>
      <content:encoded><![CDATA[<p>${p.description}</p><p>${swatchHtml}</p><p><strong>Colors:</strong> ${colorList}</p><p><a href="${url}">View palette &rarr;</a></p>]]></content:encoded>
      <category>${p.era} era</category>
      <category>${p.dominantHue}</category>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:atom="http://www.w3.org/2005/Atom"
  xmlns:content="http://purl.org/rss/1.0/modules/content/"
>
  <channel>
    <title>The Dictionary of Color Combinations</title>
    <link>${siteUrl}</link>
    <description>Historically-grounded color palettes from Sanzo Wada's 1933 Dictionary of Color Combinations. Curated editorial picks with hex values, usage notes, and export formats for designers.</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${siteUrl}feed.xml" rel="self" type="application/rss+xml" />
    <image>
      <url>${siteUrl}favicon.svg</url>
      <title>The Dictionary of Color Combinations</title>
      <link>${siteUrl}</link>
    </image>
${items.join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
