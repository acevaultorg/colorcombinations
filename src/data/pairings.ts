/**
 * pairings.ts — "colors that go with [color]" intersection engine.
 *
 * Closes the demand gap: the Sanzo Wada archive is keyed on Japanese color
 * names (matsuba, kurenai) with ~zero English search demand. Real searches use
 * COMMON color language ("colors that go with sage green walls"). This module
 * maps common colors → reference hex, finds the archive palettes that genuinely
 * pair with that hue (perceptual redmean distance), and biases the selection by
 * USE CONTEXT (walls / wedding / clothes / …) so each [color]×[context] page is
 * genuinely different — not a templated duplicate.
 *
 * Every value derives from the hex or the archive. Nothing is invented.
 */

import type { HexColor, Palette, Mood } from "@/types/palette";
import { palettes } from "./palettes";

// ---------------------------------------------------------------------------
// Common-color → reference hex map (the build prerequisite).
// Seeded with the highest-demand colors from Google Autosuggest. Reference hex
// is the consensus "common" value for the named color, not a Wada plate.
// ---------------------------------------------------------------------------
export interface CommonColor {
  slug: string;
  name: string; // "Sage Green"
  hex: HexColor;
  /** short descriptor used in copy */
  descriptor: string;
}

export const commonColors: CommonColor[] = [
  { slug: "sage-green", name: "Sage Green", hex: "#9CAF88", descriptor: "a soft, grey-tinged green" },
  { slug: "navy", name: "Navy", hex: "#1F2A44", descriptor: "a deep, near-black blue" },
  { slug: "terracotta", name: "Terracotta", hex: "#C66B3D", descriptor: "a warm clay orange-red" },
  { slug: "mustard", name: "Mustard", hex: "#C9A227", descriptor: "a deep golden yellow" },
  { slug: "blush", name: "Blush", hex: "#DEB3AB", descriptor: "a soft, dusty pink" },
  { slug: "charcoal-grey", name: "Charcoal Grey", hex: "#36454F", descriptor: "a dark blue-grey" },
  { slug: "olive-green", name: "Olive Green", hex: "#708238", descriptor: "a muted yellow-green" },
  { slug: "burgundy", name: "Burgundy", hex: "#7B1E2B", descriptor: "a deep wine red" },
];

export const commonColorBySlug = (slug: string): CommonColor | undefined =>
  commonColors.find((c) => c.slug === slug);

// ---------------------------------------------------------------------------
// Use contexts. Each carries a distinct lens that changes BOTH the copy and the
// palette selection (mood bias + lightness preference), so every context page
// delivers real information-gain rather than a swapped headline.
// ---------------------------------------------------------------------------
export interface PairingContext {
  slug: string;
  /** noun used in the H1: "colors that go with sage green {label}" */
  label: string;
  /** intent framing sentence */
  lens: string;
  /** moods to favour when ranking palettes for this context */
  favorMoods: Mood[];
  /** preferred partner lightness: "light" (livable), "any", or "bold" */
  tone: "light" | "any" | "bold";
  /** context-specific usage tip prefix */
  tip: string;
}

export const contexts: PairingContext[] = [
  {
    slug: "walls",
    label: "walls",
    lens: "Wall color has to live with a room all day, so the partners that work are the ones with enough contrast to frame furniture without fighting the light.",
    favorMoods: ["serene", "refined", "cool"],
    tone: "light",
    tip: "On walls, use",
  },
  {
    slug: "wedding",
    label: "a wedding",
    lens: "Wedding palettes lean soft and refined — partner colors that photograph well in daylight and hold together across florals, linens, and stationery.",
    favorMoods: ["refined", "serene", "warm"],
    tone: "light",
    tip: "For a wedding, pair it with",
  },
  {
    slug: "bedroom",
    label: "a bedroom",
    lens: "Bedrooms reward calm, low-contrast pairings — partner colors that settle the eye rather than energize it.",
    favorMoods: ["serene", "warm", "refined"],
    tone: "light",
    tip: "In a bedroom, layer it with",
  },
  {
    slug: "living-room",
    label: "a living room",
    lens: "A living room can take a stronger pairing — one grounding partner plus a warm accent keeps a shared space inviting without going flat.",
    favorMoods: ["warm", "earthy", "refined"],
    tone: "any",
    tip: "In a living room, ground it with",
  },
  {
    slug: "kitchen",
    label: "a kitchen",
    lens: "Kitchens pair best with warm, durable partners — colors that read clean against cabinetry and counters in hard task lighting.",
    favorMoods: ["earthy", "warm", "refined"],
    tone: "any",
    tip: "In a kitchen, contrast it with",
  },
  {
    slug: "clothes",
    label: "clothes",
    lens: "Worn together, the pairing has to flatter skin and hold up in mixed light — confident partners read as intentional, not accidental.",
    favorMoods: ["refined", "bold", "earthy"],
    tone: "any",
    tip: "To wear with it, reach for",
  },
  {
    slug: "an-outfit",
    label: "an outfit",
    lens: "An outfit wants one or two decisive partners — a neutral anchor and a single accent beats a full rainbow.",
    favorMoods: ["bold", "refined", "warm"],
    tone: "bold",
    tip: "Build the outfit around",
  },
  {
    slug: "cabinets",
    label: "cabinets",
    lens: "Cabinet color is a long commitment — the partners that age well are warm neutrals and one quiet accent for hardware or tile.",
    favorMoods: ["earthy", "refined", "warm"],
    tone: "light",
    tip: "With cabinets, match it to",
  },
];

export const contextBySlug = (slug: string): PairingContext | undefined =>
  contexts.find((c) => c.slug === slug);

// ---------------------------------------------------------------------------
// Color math — perceptual distance (redmean) + HSL, dependency-free.
// ---------------------------------------------------------------------------
function rgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}

/** Redmean perceptual distance — close approximation of CIE without the cost. */
export function redmean(a: string, b: string): number {
  const [r1, g1, b1] = rgb(a);
  const [r2, g2, b2] = rgb(b);
  const rbar = (r1 + r2) / 2;
  const dr = r1 - r2, dg = g1 - g2, db = b1 - b2;
  return Math.sqrt((2 + rbar / 256) * dr * dr + 4 * dg * dg + (2 + (255 - rbar) / 256) * db * db);
}

function hsl(hex: string): { h: number; s: number; l: number } {
  let [r, g, b] = rgb(hex).map((v) => v / 255);
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  const l = (max + min) / 2;
  let h = 0, s = 0;
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1));
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return { h, s, l };
}

function hslToHex(h: number, s: number, l: number): HexColor {
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let [r, g, b] = [0, 0, 0];
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  const to = (v: number) => Math.round((v + m) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}` as HexColor;
}

/**
 * Computed partner colors via color theory — the direct "what goes with"
 * answer. Complementary + two analogous + a warm/cool neutral, all derived
 * from the source hue. Returned as named-ish role + hex.
 */
export function partnerColors(hex: string): { role: string; hex: HexColor }[] {
  const { h, s, l } = hsl(hex);
  const sat = Math.max(0.18, Math.min(0.55, s));
  return [
    { role: "Complementary accent", hex: hslToHex((h + 180) % 360, sat, Math.min(0.55, l + 0.05)) },
    { role: "Analogous (warmer)", hex: hslToHex((h + 35) % 360, sat, l) },
    { role: "Analogous (cooler)", hex: hslToHex((h + 325) % 360, sat, l) },
    { role: "Warm neutral", hex: hslToHex(35, 0.16, 0.86) },
    { role: "Grounding dark", hex: hslToHex(h, 0.22, 0.18) },
  ];
}

// ---------------------------------------------------------------------------
// Match: find archive palettes that genuinely contain the target color, then
// bias by context. Returns the matched swatch + the partner swatches from the
// same plate, so each card answers "what does sage green pair with here".
// ---------------------------------------------------------------------------
const MATCH_THRESHOLD = 95; // redmean units — empirically "the same family"
export const MIN_PALETTES = 4; // quality guard: skip pages below this

export interface PairingMatch {
  palette: Palette;
  matchHex: HexColor;
  matchDist: number;
  partners: HexColor[]; // the other colors on the plate
  score: number;
}

export function palettesFor(hex: HexColor, ctx: PairingContext): PairingMatch[] {
  const matches: PairingMatch[] = [];
  for (const p of palettes) {
    let best = Infinity;
    let bestHex: HexColor = p.colors[0].hex;
    for (const c of p.colors) {
      const d = redmean(hex, c.hex);
      if (d < best) { best = d; bestHex = c.hex; }
    }
    if (best > MATCH_THRESHOLD) continue;
    const partners = p.colors.map((c) => c.hex).filter((h) => h !== bestHex);
    if (partners.length < 2) continue;
    // Context bias: reward matching moods + preferred tone of the partners.
    let score = -best; // closer match = higher
    score += p.moods.filter((m) => ctx.favorMoods.includes(m)).length * 40;
    const avgL = partners.reduce((s, h) => s + hsl(h).l, 0) / partners.length;
    if (ctx.tone === "light") score += avgL > 0.6 ? 30 : avgL > 0.45 ? 12 : 0;
    else if (ctx.tone === "bold") score += avgL < 0.5 ? 24 : 0;
    matches.push({ palette: p, matchHex: bestHex, matchDist: Math.round(best), partners, score });
  }
  return matches.sort((a, b) => b.score - a.score);
}

/** Build the static path matrix, pruning thin pages (the quality guard). */
export function pairingPaths(): { color: string; context: string }[] {
  const out: { color: string; context: string }[] = [];
  for (const color of commonColors) {
    for (const ctx of contexts) {
      const n = palettesFor(color.hex, ctx).length;
      if (n >= MIN_PALETTES) out.push({ color: color.slug, context: ctx.slug });
    }
  }
  return out;
}
