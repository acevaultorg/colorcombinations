/**
 * /data/colors.csv — All 210+ named colors as a single CSV.
 *
 * Columns: slug, name, name_ja, meaning, hex, rgb_r, rgb_g, rgb_b, hue,
 * palette_count, canonical_url, api_url. CC-BY-4.0.
 */

import type { APIRoute } from "astro";
import { allColors } from "@/data/colors";

function cell(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export const GET: APIRoute = () => {
  const colors = allColors();

  const headers = [
    "slug",
    "name",
    "name_ja",
    "meaning",
    "hex",
    "rgb_r",
    "rgb_g",
    "rgb_b",
    "hue",
    "palette_count",
    "canonical_url",
    "api_url",
  ];

  const rows: string[] = [headers.join(",")];

  for (const c of colors) {
    const r = parseInt(c.hex.slice(1, 3), 16);
    const g = parseInt(c.hex.slice(3, 5), 16);
    const b = parseInt(c.hex.slice(5, 7), 16);
    rows.push(
      [
        cell(c.slug),
        cell(c.name),
        cell(c.nameJa),
        cell(c.meaning),
        cell(c.hex),
        cell(r),
        cell(g),
        cell(b),
        cell(c.hue),
        cell(c.paletteCount),
        cell(`https://colorcombinations.org/colors/${c.slug}/`),
        cell(`https://colorcombinations.org/api/colors/${c.slug}.json`),
      ].join(",")
    );
  }

  const csv = rows.join("\r\n") + "\r\n";

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'inline; filename="colorcombinations-colors.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
