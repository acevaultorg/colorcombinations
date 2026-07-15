/**
 * /data/sanzo-wada-color-analysis.csv — the computed data study as tabular data.
 *
 * Long-format: one row per (category, item, count, share_pct) so the whole
 * analysis (dominant-hue distribution, most-used colors, combination-size
 * split, mood frequency) travels as a single citable CSV. Every number is
 * recomputed at build time from src/data/wada-palettes.ts (all 348 plates of
 * the MIT-licensed reconstruction of Sanzo Wada's 1933 Dictionary of Color
 * Combinations) — zero fabrication. Companion to the human study page at
 * /data/sanzo-wada-color-analysis/. CC-BY-4.0 (attribution to
 * colorcombinations.org).
 */

import type { APIRoute } from "astro";
import { wadaPalettes } from "@/data/wada-palettes";

/** RFC 4180–compliant CSV cell escape. */
function cell(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export const GET: APIRoute = () => {
  const total = wadaPalettes.length;
  const hue = new Map<string, number>();
  const mood = new Map<string, number>();
  const size = new Map<number, number>();
  const color = new Map<string, number>();

  for (const p of wadaPalettes) {
    if (p.dominantHue) hue.set(p.dominantHue, (hue.get(p.dominantHue) ?? 0) + 1);
    for (const m of p.moods ?? []) mood.set(m, (mood.get(m) ?? 0) + 1);
    const n = p.colors.length;
    size.set(n, (size.get(n) ?? 0) + 1);
    for (const c of p.colors) {
      const name = c.nameRomaji;
      if (name) color.set(name, (color.get(name) ?? 0) + 1);
    }
  }

  const pct = (n: number) => ((n / total) * 100).toFixed(1);
  const desc = (m: Map<string | number, number>) =>
    [...m.entries()].sort((a, b) => b[1] - a[1]);

  const rows: string[] = ["category,item,count,share_pct"];
  const push = (cat: string, item: string | number, count: number) =>
    rows.push([cell(cat), cell(item), cell(count), cell(pct(count))].join(","));

  for (const [h, c] of desc(hue)) push("dominant_hue", h, c);
  for (const [n, c] of desc(size))
    push("combination_size", `${n}-color`, c);
  for (const [name, c] of desc(color)) push("most_used_color", name, c);
  for (const [m, c] of desc(mood)) push("mood", m, c);

  const csv = rows.join("\r\n") + "\r\n";

  return new Response(csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition":
        'inline; filename="sanzo-wada-color-analysis.csv"',
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
};
