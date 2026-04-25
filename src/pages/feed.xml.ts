import type { APIRoute } from "astro";
import { allPalettes } from "@data/palettes";

/**
 * RSS 2.0 feed — surfaces editorial /learn pillars (newest first) AND the
 * 30 editorial palettes as feed items. Feed readers, Feedly, Inoreader, and
 * newsletter auto-syndication tools can pick this up for content distribution.
 */

// /learn/ pillar articles. Newest first. When a new article ships, prepend
// here and the RSS feed picks it up at next deploy without further wiring.
const LEARN_ARTICLES: ReadonlyArray<{
  slug: string;
  title: string;
  pubDate: Date;
  description: string;
  body: string;
  categories: string[];
}> = [
  {
    slug: "japanese-reds",
    title: "The Four Reds: Kurenai, Akane, Shu, Entan",
    pubDate: new Date(Date.UTC(2026, 3, 25, 10, 0, 0)),
    description:
      "Why Japanese tradition distinguishes safflower crimson from madder from vermilion from lead red — and which to reach for when the brief asks for 'a Japanese red.'",
    body: "<p>The Japanese tradition codified four primary reds, each from a different pigment source, each carrying centuries of specific cultural use. This article walks through kurenai (safflower crimson), akane (madder), shu (vermilion), and entan (lead red) with a working palette per red and a 4-question framework for picking the right one.</p>",
    categories: ["Reds", "Pigments", "Heian"],
  },
  {
    slug: "wabi-sabi-color-theory",
    title: "Wabi-Sabi Color Theory: The Beauty of Things That Have Aged",
    pubDate: new Date(Date.UTC(2026, 3, 25, 9, 0, 0)),
    description:
      "What it actually means for color when a tradition values age over newness, asymmetry over balance, and imperfection over polish.",
    body: "<p>Wabi-sabi as a working color philosophy: the tea-room palette codified in the 16th century, three exemplary palettes from the 1933 archive, three anti-patterns to avoid, and a brand-fit caveat at the close.</p>",
    categories: ["Wabi-Sabi", "Tea Ceremony", "Japanese"],
  },
  {
    slug: "japandi-color-theory",
    title: "Japandi Color Theory: Where Restraint Meets Light",
    pubDate: new Date(Date.UTC(2026, 3, 25, 8, 0, 0)),
    description:
      "How Japanese and Scandinavian color traditions converge — and which palettes from the Wada dictionary actually fit the Japandi brief.",
    body: "<p>Three working palettes from the archive that hit the Japandi brief, three common mistakes that break it, and a 3-axis test for evaluating any palette for Japandi-fit.</p>",
    categories: ["Japandi", "Wabi-Sabi", "Scandinavian"],
  },
];

export const GET: APIRoute = ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org";

  // Pillar articles first (newest editorial work)
  const learnItems = LEARN_ARTICLES.map((a) => {
    const url = `${siteUrl}learn/${a.slug}/`;
    return `    <item>
      <title><![CDATA[${a.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${a.pubDate.toUTCString()}</pubDate>
      <description><![CDATA[${a.description}]]></description>
      <content:encoded><![CDATA[${a.body}<p><a href="${url}">Read the full article →</a></p>]]></content:encoded>
${a.categories.map((c) => `      <category>${c}</category>`).join("\n")}
    </item>`;
  });

  // Use curated/featured palettes for feed content — these have the richest descriptions.
  const palettes = allPalettes()
    .filter((p) => !p.slug.startsWith("wada-"))
    .sort((a, b) => (a.order ?? 999) - (b.order ?? 999));

  const paletteItems = palettes.map((p, i) => {
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
${[...learnItems, ...paletteItems].join("\n")}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
