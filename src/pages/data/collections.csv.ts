/**
 * /data/collections.csv — All 60 thematic collections as a single CSV.
 *
 * Columns: slug, title, tagline, accent_hex, palette_count, keywords,
 * canonical_url, api_url, og_url. CC-BY-4.0.
 */

import type { APIRoute } from "astro";
import {
  collections,
  paletteSetForCollection,
} from "@/data/collections";

function cell(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const GET: APIRoute = () => {
  const headers = [
    "slug",
    "title",
    "tagline",
    "accent_hex",
    "palette_count",
    "keywords",
    "canonical_url",
    "api_url",
    "og_url",
    "embed_url",
  ];

  const rows: string[] = [headers.join(",")];

  for (const c of collections) {
    const palettes = paletteSetForCollection(c);
    rows.push(
      [
        cell(c.slug),
        cell(c.title),
        cell(c.tagline),
        cell(c.accentHex),
        cell(palettes.length),
        cell((c.keywords ?? []).join("|")),
        cell(`https://colorcombinations.org/collections/${c.slug}/`),
        cell(`https://colorcombinations.org/api/collections/${c.slug}.json`),
        cell(`https://colorcombinations.org/og/collections/${c.slug}.svg`),
        cell(`https://colorcombinations.org/embed/collection/${c.slug}/`),
      ].join(",")
    );
  }

  const csv = rows.join("\r\n") + "\r\n";

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="colorcombinations-collections.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
