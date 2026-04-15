import type { APIRoute } from "astro";
import { getCollection } from "astro:content";

/**
 * RSS 2.0 feed for the Journal (long-form blog posts). Separate from
 * `/feed.xml` which covers curated palette entries. Auto-discovery link
 * added in BaseLayout via <link rel="alternate" type="application/rss+xml">.
 */
export const GET: APIRoute = async ({ site }) => {
  const siteUrl = site?.toString() ?? "https://colorcombinations.org/";
  const normalizedSite = siteUrl.endsWith("/") ? siteUrl : `${siteUrl}/`;

  const posts = (await getCollection("blog", ({ data }) => !data.draft)).sort(
    (a, b) => new Date(b.data.pubDate).getTime() - new Date(a.data.pubDate).getTime(),
  );

  const items = posts
    .map((post) => {
      const url = `${normalizedSite}blog/${post.slug}/`;
      const pubDate = new Date(post.data.pubDate).toUTCString();
      const keywords = post.data.keywords.join(", ");
      return `    <item>
      <title><![CDATA[${post.data.title}]]></title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${pubDate}</pubDate>
      <description><![CDATA[${post.data.description}]]></description>
      <category><![CDATA[${keywords}]]></category>
    </item>`;
    })
    .join("\n");

  const lastBuild = new Date().toUTCString();

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>The Dictionary of Color Combinations — Journal</title>
    <link>${normalizedSite}blog/</link>
    <atom:link href="${normalizedSite}blog/rss.xml" rel="self" type="application/rss+xml" />
    <description>Editorial long-form on color, curation, and how to use the 348-plate Wada archive in real design work.</description>
    <language>en-us</language>
    <lastBuildDate>${lastBuild}</lastBuildDate>
    <generator>Astro — colorcombinations.org</generator>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    status: 200,
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
