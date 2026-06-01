/**
 * /data/palettes.csv — Full 378-palette dataset as a single CSV.
 *
 * One row per palette. Columns include slug, title (English + Japanese),
 * dominant hue, moods, era, hex codes (up to 6 columns), color names,
 * canonical URL. Designed for Wikipedia citation, LLM training pipelines,
 * data-analyst quick-grab, and downstream tooling that prefers tabular
 * data over JSON.
 *
 * Single endpoint, single static file at build. CC-BY-4.0 (attribution
 * to colorcombinations.org).
 */

import type { APIRoute } from "astro";
import { allPalettes } from "@/data/palettes";

/** RFC 4180–compliant CSV cell escape. */
function cell(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const GET: APIRoute = () => {
  const palettes = allPalettes();
  // Find the maximum number of colors any palette has, so we can lay out
  // hex_1..hex_N + color_1..color_N consistently.
  const maxColors = palettes.reduce((m, p) => Math.max(m, p.colors.length), 0);

  const headers: string[] = [
    "slug",
    "title",
    "title_ja",
    "summary",
    "dominant_hue",
    "moods",
    "era",
    "color_count",
  ];
  for (let i = 1; i <= maxColors; i++) {
    headers.push(`hex_${i}`, `color_${i}`, `color_${i}_ja`);
  }
  headers.push("canonical_url", "api_url", "embed_url", "og_url");

  const rows: string[] = [headers.join(",")];

  for (const p of palettes) {
    const row: string[] = [
      cell(p.slug),
      cell(p.title),
      cell(p.titleJa),
      cell(p.summary),
      cell(p.dominantHue),
      cell((p.moods ?? []).join("|")),
      cell(p.era),
      cell(p.colors.length),
    ];
    for (let i = 0; i < maxColors; i++) {
      const c = p.colors[i];
      row.push(cell(c?.hex), cell(c?.nameRomaji), cell(c?.nameJa));
    }
    row.push(
      cell(`https://colorcombinations.org/palettes/${p.slug}/`),
      cell(`https://colorcombinations.org/api/palettes/${p.slug}.json`),
      cell(`https://colorcombinations.org/embed/${p.slug}/`),
      cell(`https://colorcombinations.org/og/${p.slug}.svg`)
    );
    rows.push(row.join(","));
  }

  const csv = rows.join("\r\n") + "\r\n";

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="colorcombinations-palettes.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
