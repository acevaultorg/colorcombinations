/**
 * Real archive palettes for a set of trend colours, for the kit next-step block on /trends/ pages.
 *
 * Each trend hex is matched to its nearest named colour in this archive (CIELAB, CIE76, the same
 * method the Pantone page uses), then palettes are picked greedily: each pick is the palette that
 * contains the most matched colours not yet covered by an earlier pick, so three picks show three
 * different trend colours where the archive allows. Deterministic: ties break on palette order,
 * then slug. Nothing is invented: names and colours come from src/data.
 */
import { allColors, type ColorEntry } from "@data/colors";
import { allPalettes } from "@data/palettes";
import type { Palette } from "@/types/palette";

const lab = (hex: string): [number, number, number] => {
  const c = hex.replace("#", "");
  const lin = (v: number) => { v /= 255; return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4; };
  const [r, g, b] = [0, 2, 4].map((i) => lin(parseInt(c.slice(i, i + 2), 16)));
  const x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
  const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
  const z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;
  const f = (t: number) => (t > 0.008856 ? Math.cbrt(t) : 7.787 * t + 16 / 116);
  return [116 * f(y) - 16, 500 * (f(x) - f(y)), 200 * (f(y) - f(z))];
};
const dist = (a: string, b: string) => { const p = lab(a), q = lab(b); return Math.hypot(p[0] - q[0], p[1] - q[1], p[2] - q[2]); };

// Archive names carry a few data artifacts ("Eugenia Red | A", "Calamine BLue"); show them clean.
export const cleanColorName = (n: string) =>
  n.replace(/\s*\|\s*[A-Z]$/, "").replace(/\b([A-Z])([A-Z])([a-z]+)/g, (_m, a, b, c) => a + b.toLowerCase() + c);

export function nearestArchiveColor(hex: string): ColorEntry {
  let best = allColors()[0], bd = Infinity;
  for (const e of allColors()) { const d = dist(hex, e.hex); if (d < bd) { bd = d; best = e; } }
  return best;
}

export interface TrendPalette { palette: Palette; shared: string[] }

export function palettesForTrendHexes(hexes: string[], limit = 3): TrendPalette[] {
  const matched = new Map<string, ColorEntry>();
  for (const h of hexes) { const m = nearestArchiveColor(h); matched.set(m.slug, m); }
  const bySlug = new Map<string, string[]>(); // palette slug -> matched colour slugs it contains
  for (const m of matched.values()) for (const ps of m.paletteSlugs) bySlug.set(ps, [...(bySlug.get(ps) ?? []), m.slug]);

  const pool = allPalettes().filter((p) => bySlug.has(p.slug)); // allPalettes() is already in order
  const covered = new Set<string>();
  const out: TrendPalette[] = [];
  while (out.length < limit) {
    let best: Palette | undefined, bestNew = 0, bestAll = 0;
    for (const p of pool) {
      if (out.some((o) => o.palette.slug === p.slug)) continue;
      const cs = bySlug.get(p.slug)!;
      const fresh = cs.filter((c) => !covered.has(c)).length;
      if (fresh > bestNew || (fresh === bestNew && cs.length > bestAll)) { best = p; bestNew = fresh; bestAll = cs.length; }
    }
    if (!best) break;
    const cs = bySlug.get(best.slug)!;
    cs.forEach((c) => covered.add(c));
    out.push({ palette: best, shared: cs.map((c) => cleanColorName(matched.get(c)!.name)) });
  }
  return out;
}

/** "With Fawn" / "With Fawn and Ecru" / "With Fawn, Ecru and Olive Green" */
export const withNames = (names: string[]) =>
  names.length <= 1 ? `With ${names[0] ?? ""}` : `With ${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
