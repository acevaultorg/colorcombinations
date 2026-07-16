/**
 * /data/sanzo-wada-wcag-contrast.csv — the Wada × WCAG join study as tabular
 * data. Long-format: one row per (category, item, value, detail) so the whole
 * analysis (pass-level distribution, size split, pairwise rates, extremes)
 * travels as a single citable CSV. Every number is recomputed at build time
 * from src/data/wada-palettes.ts + the WCAG 2.x relative-luminance formula —
 * zero fabrication. Companion to the human study page at
 * /data/sanzo-wada-wcag-contrast/. CC-BY-4.0 (attribution to
 * colorcombinations.org). A Figures Bureau study.
 */

import type { APIRoute } from "astro";
import { wadaPalettes } from "@/data/wada-palettes";

/** RFC 4180–compliant CSV cell escape. */
function cell(v: string | number | undefined | null): string {
  if (v === undefined || v === null) return "";
  const s = String(v);
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function lum(hex: string): number {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((c) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrast(a: string, b: string): number {
  const la = lum(a);
  const lb = lum(b);
  const [l1, l2] = la >= lb ? [la, lb] : [lb, la];
  return (l1 + 0.05) / (l2 + 0.05);
}

export const GET: APIRoute = () => {
  const total = wadaPalettes.length;

  const plates = wadaPalettes.map((p) => {
    let best = 0;
    let pairs = 0;
    let aaPairs = 0;
    for (let i = 0; i < p.colors.length; i++) {
      for (let j = i + 1; j < p.colors.length; j++) {
        const r = contrast(p.colors[i].hex, p.colors[j].hex);
        pairs++;
        if (r >= 4.5) aaPairs++;
        if (r > best) best = r;
      }
    }
    return { slug: p.slug, title: p.title, n: p.colors.length, best, pairs, aaPairs };
  });

  const pct = (n: number, d: number = total) => Math.round((n / d) * 100);
  const r2 = (n: number) => Math.round(n * 100) / 100;

  const passAAA = plates.filter((p) => p.best >= 7).length;
  const passAA = plates.filter((p) => p.best >= 4.5).length;
  const passAALarge = plates.filter((p) => p.best >= 3).length;
  const totalPairs = plates.reduce((s, p) => s + p.pairs, 0);
  const totalAAPairs = plates.reduce((s, p) => s + p.aaPairs, 0);
  const sorted = [...plates].sort((a, b) => b.best - a.best);

  const rows: string[][] = [["category", "item", "value", "detail"]];
  const push = (c: string, i: string, v: string | number, d: string = "") =>
    rows.push([c, i, String(v), d]);

  push("meta", "combinations_total", total, "all plates in the 1933 dictionary (community reconstruction)");
  push("meta", "standard", "WCAG 2.x", "relative-luminance contrast, W3C");
  push("headline", "plates_with_AA_pairing", passAA, `${pct(passAA)}% — best pairing >= 4.5:1 (normal text)`);
  push("headline", "plates_with_AAA_pairing", passAAA, `${pct(passAAA)}% — best pairing >= 7:1`);
  push("headline", "plates_AA_large_only", passAALarge - passAA, `${pct(passAALarge - passAA)}% — best pairing 3:1-4.5:1`);
  push("headline", "plates_failing_all_text_levels", total - passAALarge, `${pct(total - passAALarge)}% — best pairing < 3:1`);
  push("pairs", "color_pairs_total", totalPairs, "all in-plate pairs across the book");
  push("pairs", "color_pairs_passing_AA", totalAAPairs, `${pct(totalAAPairs, totalPairs)}% of all pairs`);

  for (const n of [2, 3, 4]) {
    const subset = plates.filter((p) => p.n === n);
    const aa = subset.filter((p) => p.best >= 4.5).length;
    push("by_size", `${n}-color_plates_AA`, aa, `of ${subset.length} (${pct(aa, subset.length || 1)}%)`);
  }

  for (const p of sorted.slice(0, 5)) {
    push("highest_contrast", p.slug, r2(p.best), p.title);
  }
  for (const p of sorted.slice(-5).reverse()) {
    push("lowest_contrast", p.slug, r2(p.best), p.title);
  }

  const csv = rows.map((r) => r.map(cell).join(",")).join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=86400",
    },
  });
};
