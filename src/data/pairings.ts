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
  // ---- 2026 colours of the year -------------------------------------------
  // The 14 authorities' own 2026 picks, lifted from src/pages/trends/color-trends-2026.astro.
  // WHY: /trends/color-trends-2026/ is the single most-cited page in the fleet (6,064
  // citations). It named all 14 colours while linking every one of them OFF-SITE to
  // pantone.com / benjaminmoore.com / behr.com and ten more, and /colors/cloud-dancer/
  // returned 404 — so every reader it attracted was handed to a competitor. These entries
  // give each colour a real destination through the pairing machinery that already exists,
  // answering the question the trends page provokes: "fine, what goes WITH it?"
  // Names, official codes and hexes are the authorities' own — see that page's Sources.
  { slug: "cloud-dancer", name: "Cloud Dancer", hex: "#F0EEE9", descriptor: "serene white — Pantone's 2026 colour of the year, PANTONE 11-4201" },
  { slug: "transformative-teal", name: "Transformative Teal", hex: "#1C7E84", descriptor: "blue-green teal — WGSN + Coloro's 2026 colour of the year, Coloro 100-31-15 (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "silhouette", name: "Silhouette", hex: "#57504C", descriptor: "burnt-umber charcoal — Benjamin Moore's 2026 colour of the year, AF-655" },
  { slug: "universal-khaki", name: "Universal Khaki", hex: "#CBBBA1", descriptor: "warm tan neutral — Sherwin-Williams's 2026 colour of the year, SW 6150 (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "hidden-gem", name: "Hidden Gem", hex: "#5E7A72", descriptor: "smokey jade — Behr's 2026 colour of the year, N430-6A (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "warm-eucalyptus", name: "Warm Eucalyptus", hex: "#98A189", descriptor: "gray-green — Valspar's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "warm-mahogany", name: "Warm Mahogany", hex: "#7B473C", descriptor: "red-brown — Glidden's 2026 colour of the year, PPG1060-7 (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "midnight-garden", name: "Midnight Garden", hex: "#39463C", descriptor: "deep green — Dunn-Edwards's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "melodious-ivory", name: "Melodious Ivory", hex: "#EEE6D2", descriptor: "warm cream — Dutch Boy's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "divine-damson", name: "Divine Damson", hex: "#4C2E48", descriptor: "deep purple — Graham & Brown's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "epernay", name: "Epernay", hex: "#D6B96C", descriptor: "soft ochre — C2 Paint's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "special-walnut", name: "Special Walnut", hex: "#6B4A30", descriptor: "walnut wood — Minwax's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "coffee-bean", name: "Coffee Bean", hex: "#4A3B30", descriptor: "dark brown — Krylon's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },
  { slug: "satin-lagoon", name: "Satin Lagoon", hex: "#2E7C84", descriptor: "teal — Rust-Oleum's 2026 colour of the year (swatch is an honest sRGB approximation — the official code is authoritative)" },

  { slug: "sage-green", name: "Sage Green", hex: "#9CAF88", descriptor: "a soft, grey-tinged green" },
  { slug: "navy", name: "Navy", hex: "#1F2A44", descriptor: "a deep, near-black blue" },
  { slug: "terracotta", name: "Terracotta", hex: "#C66B3D", descriptor: "a warm clay orange-red" },
  { slug: "mustard", name: "Mustard", hex: "#C9A227", descriptor: "a deep golden yellow" },
  { slug: "blush", name: "Blush", hex: "#DEB3AB", descriptor: "a soft, dusty pink" },
  { slug: "charcoal-grey", name: "Charcoal Grey", hex: "#36454F", descriptor: "a dark blue-grey" },
  { slug: "olive-green", name: "Olive Green", hex: "#708238", descriptor: "a muted yellow-green" },
  { slug: "burgundy", name: "Burgundy", hex: "#7B1E2B", descriptor: "a deep wine red" },
  { slug: "teal", name: "Teal", hex: "#008080", descriptor: "a balanced blue-green" },
  { slug: "coral", name: "Coral", hex: "#FF7F50", descriptor: "a warm pink-orange" },
  { slug: "emerald-green", name: "Emerald Green", hex: "#009B77", descriptor: "a rich, jewel-toned green" },
  { slug: "forest-green", name: "Forest Green", hex: "#228B22", descriptor: "a deep, shadowy green" },
  { slug: "dusty-rose", name: "Dusty Rose", hex: "#C08081", descriptor: "a muted, greyed pink" },
  { slug: "beige", name: "Beige", hex: "#E1D4BB", descriptor: "a warm, sandy neutral" },
  { slug: "cream", name: "Cream", hex: "#F3EAD3", descriptor: "a soft, warm off-white" },
  { slug: "mauve", name: "Mauve", hex: "#B784A7", descriptor: "a dusty purple-pink" },
  { slug: "taupe", name: "Taupe", hex: "#B0A08E", descriptor: "a warm grey-brown" },
  { slug: "peach", name: "Peach", hex: "#FFCBA4", descriptor: "a soft, warm peach" },
  { slug: "gray", name: "Gray", hex: "#808080", descriptor: "a neutral mid-grey" },
  { slug: "brown", name: "Brown", hex: "#7B5233", descriptor: "a warm mid-brown" },
  { slug: "blue", name: "Blue", hex: "#3E6FA3", descriptor: "a classic mid-blue" },
  { slug: "green", name: "Green", hex: "#4A7C59", descriptor: "a balanced mid-green" },
  { slug: "pink", name: "Pink", hex: "#F7A8B8", descriptor: "a clear, soft pink" },
  { slug: "yellow", name: "Yellow", hex: "#F2C94C", descriptor: "a warm, sunny yellow" },
  { slug: "orange", name: "Orange", hex: "#E8833A", descriptor: "a warm, vivid orange" },
  { slug: "purple", name: "Purple", hex: "#7D5BA6", descriptor: "a balanced purple" },
  { slug: "red", name: "Red", hex: "#C0392B", descriptor: "a clear, warm red" },
  { slug: "turquoise", name: "Turquoise", hex: "#40C4B7", descriptor: "a bright blue-green" },
  { slug: "white", name: "White", hex: "#F4F2ED", descriptor: "a soft, warm white" },
  { slug: "black", name: "Black", hex: "#1C1C1C", descriptor: "a near-black neutral" },
  { slug: "tan", name: "Tan", hex: "#D2B48C", descriptor: "a warm, sandy tan" },
  { slug: "gold", name: "Gold", hex: "#D4AF37", descriptor: "a rich metallic gold" },
  { slug: "lavender", name: "Lavender", hex: "#9683B5", descriptor: "a soft, light violet" },
  { slug: "mint", name: "Mint", hex: "#A2D9C0", descriptor: "a pale, cool mint green" },
  { slug: "maroon", name: "Maroon", hex: "#800000", descriptor: "a dark, brownish red" },
  { slug: "magenta", name: "Magenta", hex: "#B5197C", descriptor: "a vivid pink-purple" },
  { slug: "sky-blue", name: "Sky Blue", hex: "#87CEEB", descriptor: "a light, airy blue" },
  { slug: "khaki", name: "Khaki", hex: "#B3A171", descriptor: "a muted tan-olive" },
  { slug: "plum", name: "Plum", hex: "#8E4585", descriptor: "a deep purple-red" },
  { slug: "rust", name: "Rust", hex: "#B7410E", descriptor: "a burnt orange-brown" },
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
  {
    slug: "bathroom",
    label: "a bathroom",
    lens: "Bathrooms reward clean, spa-like pairings — cool, light partners that read fresh against tile and hold up under bright task lighting.",
    favorMoods: ["serene", "cool", "refined"],
    tone: "light",
    tip: "In a bathroom, pair it with",
  },
  {
    slug: "nursery",
    label: "a nursery",
    lens: "A nursery wants soft, low-contrast partners — gentle colors that soothe rather than stimulate, and grow with the room past the first year.",
    favorMoods: ["serene", "warm", "refined"],
    tone: "light",
    tip: "In a nursery, soften it with",
  },
  {
    slug: "front-door",
    label: "a front door",
    lens: "A front door is the one place to be bold — a saturated, confident partner that pops against the siding and reads as a deliberate welcome.",
    favorMoods: ["bold", "warm", "earthy"],
    tone: "bold",
    tip: "On a front door, contrast it with",
  },
  {
    slug: "accent-wall",
    label: "an accent wall",
    lens: "An accent wall is where you go stronger than the rest of the room — one decisive partner carries it, so favour depth over a full spread.",
    favorMoods: ["bold", "refined", "warm"],
    tone: "bold",
    tip: "On an accent wall, pair it with",
  },
  {
    slug: "curtains",
    label: "curtains",
    lens: "Curtains frame a room and filter its light, so the partners that work read cleanly against both the wall behind them and the daylight through them.",
    favorMoods: ["refined", "serene", "warm"],
    tone: "any",
    tip: "For curtains, choose",
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
