import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";
import { allColors } from "@/data/colors";
import { collections } from "@/data/collections";

/**
 * /sitemap-ai.xml — secondary sitemap for LLM/AI crawlers.
 *
 * Companion to the regular /sitemap-index.xml. The regular sitemap is
 * exhaustive + crawl-prioritised for traditional search; this one is
 * curation-prioritised for LLM citation pipelines (GPTBot, ClaudeBot,
 * PerplexityBot, Googlebot-Extended, Applebot-Extended, CCBot,
 * Amazonbot, Bytespider, Meta-ExternalAgent) so they focus crawl budget
 * on the highest-citation-value URLs first.
 *
 * Per `rules/bot-harvest.md` Lever 5 (Day-1 bot-readiness checklist).
 *
 * Each URL also advertises its JSON twin via `xhtml:link rel=alternate
 * type=application/json` so machine consumers can fetch the structured
 * shape without a second request.
 *
 * Priority hierarchy:
 *   1.0 — /learn long-form pillars + glossary (highest citation density)
 *   1.0 — homepage
 *   0.9 — /palettes per-record (378 unique-data plates)
 *   0.9 — /colors per-record (210 named colors with WCAG contrast)
 *   0.8 — /collections per-record (69 thematic synthesis)
 *   0.7 — /about, /methodology, /data hub
 *   0.7 — /palettes index, /colors index, /collections index, /learn index
 *   0.6 — /random, /tools, /tools/* utilities
 *   0.5 — /shop (commercial; lower citation value)
 */

interface AiUrl {
  loc: string;
  priority: string;        // "0.0" — "1.0"
  changefreq: "monthly" | "weekly" | "yearly";
  jsonAlt?: string;        // optional /api/... twin
}

const SITE = "https://colorcombinations.org";
const escapeXml = (s: string): string =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;")
   .replace(/"/g, "&quot;")
   .replace(/'/g, "&apos;");

export const GET: APIRoute = () => {
  const urls: AiUrl[] = [];

  // Tier 1.0 — homepage + editorial pillars
  urls.push({ loc: `${SITE}/`, priority: "1.0", changefreq: "weekly" });
  const pillarSlugs = [
    "heian-court-color-theory",
    "japandi-color-theory",
    "japanese-reds",
    "wabi-sabi-color-theory",
    "scandinavian-color-theory",
    "japanese-color-glossary",
  ];
  for (const slug of pillarSlugs) {
    urls.push({ loc: `${SITE}/learn/${slug}/`, priority: "1.0", changefreq: "monthly" });
  }

  // Tier 0.9 — per-palette + per-color (highest unique-data density)
  for (const p of allPalettes()) {
    urls.push({
      loc: `${SITE}/palettes/${p.slug}/`,
      priority: "0.9",
      changefreq: "monthly",
      jsonAlt: `${SITE}/api/palettes/${p.slug}.json`,
    });
  }
  for (const c of allColors()) {
    urls.push({
      loc: `${SITE}/colors/${c.slug}/`,
      priority: "0.9",
      changefreq: "monthly",
      jsonAlt: `${SITE}/api/colors/${c.slug}.json`,
    });
  }

  // Tier 0.8 — per-collection (thematic synthesis)
  for (const c of collections) {
    urls.push({
      loc: `${SITE}/collections/${c.slug}/`,
      priority: "0.8",
      changefreq: "monthly",
      jsonAlt: `${SITE}/api/collections/${c.slug}.json`,
    });
  }

  // Tier 0.8 — per-hue-family hub pages (9 routes; deep aggregation of
  // all colors + palettes + collections within a hue family)
  const HUE_SLUGS = ["red", "orange", "yellow", "brown", "pink", "green", "blue", "purple", "neutral"];
  for (const h of HUE_SLUGS) {
    urls.push({ loc: `${SITE}/colors/hue/${h}/`, priority: "0.8", changefreq: "monthly" });
  }

  // Tier 0.7 — high-trust E-E-A-T + index hubs
  urls.push({ loc: `${SITE}/about/`, priority: "0.7", changefreq: "monthly" });
  urls.push({ loc: `${SITE}/methodology/`, priority: "0.7", changefreq: "monthly" });
  urls.push({
    loc: `${SITE}/data/`, priority: "0.7", changefreq: "monthly",
    jsonAlt: `${SITE}/api/index.json`,
  });
  urls.push({ loc: `${SITE}/learn/`, priority: "0.7", changefreq: "monthly", jsonAlt: `${SITE}/api/learn.json` });
  urls.push({ loc: `${SITE}/palettes/`, priority: "0.7", changefreq: "monthly", jsonAlt: `${SITE}/api/palettes.json` });
  urls.push({ loc: `${SITE}/colors/`, priority: "0.7", changefreq: "monthly", jsonAlt: `${SITE}/api/colors.json` });
  urls.push({ loc: `${SITE}/collections/`, priority: "0.7", changefreq: "monthly", jsonAlt: `${SITE}/api/collections.json` });
  urls.push({ loc: `${SITE}/browse/`, priority: "0.7", changefreq: "weekly" });

  // Tier 0.6 — discovery + utilities
  urls.push({ loc: `${SITE}/random/`, priority: "0.6", changefreq: "weekly", jsonAlt: `${SITE}/api/random.json` });
  urls.push({ loc: `${SITE}/tools/`, priority: "0.6", changefreq: "monthly" });
  urls.push({ loc: `${SITE}/tools/contrast-checker/`, priority: "0.6", changefreq: "monthly" });
  urls.push({ loc: `${SITE}/tools/palette-from-color/`, priority: "0.6", changefreq: "monthly" });

  // Tier 0.5 — commercial
  urls.push({ loc: `${SITE}/shop/`, priority: "0.5", changefreq: "monthly" });

  // No /privacy, /terms, /contact, /404, /og/*, /embed/*, /api/*.
  // Privacy + terms are not citation targets; OG/embed/api are
  // structural/asset URLs already linked via xhtml:alternate hints
  // above on their content-page parent.

  const lines: string[] = [];
  lines.push('<?xml version="1.0" encoding="UTF-8"?>');
  lines.push(
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  );
  for (const u of urls) {
    lines.push("  <url>");
    lines.push(`    <loc>${escapeXml(u.loc)}</loc>`);
    lines.push(`    <changefreq>${u.changefreq}</changefreq>`);
    lines.push(`    <priority>${u.priority}</priority>`);
    if (u.jsonAlt) {
      lines.push(
        `    <xhtml:link rel="alternate" type="application/json" href="${escapeXml(u.jsonAlt)}"/>`
      );
    }
    lines.push("  </url>");
  }
  lines.push("</urlset>");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
};
