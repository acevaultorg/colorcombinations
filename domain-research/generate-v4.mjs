#!/usr/bin/env node
// Domain generator V4 — REVENUE-FIRST scoring.
// Goal: fastest revenue growth + highest ceiling.
// No heritage bias. No aesthetic bias. Pure EMD + traffic-ceiling optimization.
//
// Scoring rewards:
//   - Keyword density for HIGH-VOLUME commercial color search terms
//   - .com > .org > .net > .io > rest (type-in trust hierarchy)
//   - Short stems (memorability for type-in traffic)
//   - Commercial intent signals (hub, lab, kit, tool, guide)
//   - Pronounceability (will people say it out loud?)
//
// Excludes domains already checked in V1/V2/V3.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// =====================================================================
// WORD BANKS — REVENUE-FIRST
// =====================================================================

// --- HIGH-VOLUME COMMERCIAL COLOR KEYWORDS (monthly search vol approx) ---
// These are the KEYWORDS that drive SEO. Every one should appear in domains
// we generate because they are the traffic funnels.
const KW_HEAD = [
  'color',          // 450k+  (generic)
  'colors',         // 300k+
  'colour',         // 150k UK/IN
  'colours',        // 90k
  'palette',        // 450k+  ⭐ huge
  'palettes',       // 120k
  'hue',            // 90k
  'hues',           // 60k
  'shade',          // 250k+
  'shades',         // 180k
  'tone',           // 130k
  'tones',          // 90k
  'tint',           // 70k
  'tints',          // 25k
  'hex',            // 200k+  ⭐
  'rgb',            // 300k+  ⭐ (but often too technical)
  'pantone',        // 400k+  ⭐ trademarked, skip
  'swatch',         // 50k
  'swatches',       // 30k
  'pigment',        // 60k
];

const KW_INTENT = [
  'combination',    // 110k ⭐
  'combinations',   // 70k
  'combo',          // 60k
  'combos',         // 40k
  'scheme',         // 135k ⭐
  'schemes',        // 90k
  'match',          // 40k
  'matcher',        // 20k
  'matching',       // 30k
  'picker',         // 300k ⭐ (color picker is huge)
  'generator',      // 90k ⭐
  'wheel',          // 200k ⭐
  'mix',            // 40k
  'mixer',          // 25k
  'blend',          // 30k
  'blender',        // 25k
  'pair',           // 15k
  'pairing',        // 15k
  'pairs',          // 15k
  'code',           // 60k
  'codes',          // 40k
  'chart',          // 40k
  'guide',          // 50k
  'name',           // 50k
  'names',          // 50k
  'theory',         // 100k ⭐
  'finder',         // 30k
  'kit',            // 30k
  'tool',           // 40k
  'tools',          // 30k
];

// --- PRODUCT MODIFIERS (create short brandable + keyword combos) ---
const MOD = [
  'hub',            // colorhub
  'lab',            // colorlab
  'labs',
  'studio',
  'works',
  'house',
  'base',
  'box',
  'kit',
  'club',
  'spot',
  'zone',
  'io',
  'app',
  'pro',
  'plus',
  'hq',
  'pal',
];

// --- COMMON NUMERIC/DESIGN PREFIXES (for broader SEO coverage) ---
const DESIGN_PREFIX = [
  'web',
  'ui',
  'ux',
  'brand',
  'brandable',
  'design',
  'graphic',
  'paint',
  'print',
  'css',
  'tailwind',
];

// --- TLDs — revenue-first trust hierarchy ---
// .com >> .org > .net > .io > .co > rest
const TLDS = [
  '.com',     // 40 — type-in king
  '.org',     // 25 — trust signal
  '.net',     // 15 — legacy
  '.io',      // 18 — tech audience premium
  '.co',      // 15 — .com alternative
  '.app',     // 10 — Google ecosystem
  '.tools',   // 5
  '.design',  // 8
  '.studio',  // 8
  '.xyz',     // -2
  '.art',     // 8
  '.me',      // 3
  '.site',    // -10
  '.online',  // -12
  '.club',    // -4
  '.store',   // 0
  '.shop',    // 2
  '.page',    // -2
  '.space',   // -5
  '.guide',   // 4
  '.works',   // 5
];

// =====================================================================
// SCORING — REVENUE-FIRST
// =====================================================================

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
function vowelRatio(w) {
  const L = w.replace(/[^a-z]/g, '');
  if (!L.length) return 0;
  let v = 0;
  for (const c of L) if (VOWELS.has(c)) v++;
  return v / L.length;
}
function hasRepeatingConsonants(w) {
  return /[bcdfghjklmnpqrstvwxz]{3,}/.test(w);
}

// High-volume keyword regex — each match = strong traffic potential
// Weight = log of estimated monthly search volume
const KW_WEIGHTS = [
  { re: /palette/,        w: 32 },   // ⭐ 450k
  { re: /color(?!s)/,     w: 30 },   // ⭐ 450k (color singular)
  { re: /colors/,         w: 28 },   // 300k
  { re: /colour/,         w: 18 },   // 150k UK
  { re: /hex/,            w: 22 },   // 200k
  { re: /shade/,          w: 20 },   // 250k
  { re: /shades/,         w: 18 },
  { re: /combination/,    w: 24 },   // ⭐ 110k
  { re: /combinations/,   w: 22 },
  { re: /combo/,          w: 18 },
  { re: /scheme/,         w: 24 },   // ⭐ 135k
  { re: /schemes/,        w: 22 },
  { re: /picker/,         w: 26 },   // ⭐ 300k (color picker)
  { re: /generator/,      w: 22 },   // ⭐ 90k
  { re: /wheel/,          w: 24 },   // ⭐ 200k
  { re: /theory/,         w: 22 },   // ⭐ 100k
  { re: /hue(?!s)/,       w: 14 },   // 90k
  { re: /hues/,           w: 12 },
  { re: /tone(?!s)/,      w: 12 },   // 130k
  { re: /tones/,          w: 10 },
  { re: /tint/,           w: 10 },
  { re: /match/,          w: 12 },
  { re: /pair/,           w: 10 },
  { re: /blend/,          w: 10 },
  { re: /mix/,            w: 10 },
  { re: /guide/,          w: 8 },
  { re: /kit/,            w: 6 },
  { re: /tool/,           w: 8 },
  { re: /code/,           w: 8 },
  { re: /swatch/,         w: 8 },
  { re: /pigment/,        w: 6 },
  { re: /design/,         w: 10 },
];

// TLD trust hierarchy
const TLD_SCORES = {
  '.com':    40,
  '.org':    25,
  '.net':    15,
  '.io':     18,
  '.co':     15,
  '.app':    10,
  '.tools':  5,
  '.design': 8,
  '.studio': 8,
  '.xyz':    -2,
};

// Commercial product signals (not keyword-heavy but product-readable)
const INTENT_SIGNALS = /(hub|lab|labs|studio|works|kit|tool|tools|app|pro|hq)/;

function score(stem, tld) {
  let s = 60;  // base
  const len = stem.length;

  // ---------- LENGTH (memorability) ----------
  if (len <= 4) s += 25;            // 1-4 chars: ultra-memorable
  else if (len <= 6) s += 22;       // 5-6: ideal
  else if (len <= 9) s += 18;       // 7-9: still type-in friendly
  else if (len <= 12) s += 10;      // 10-12: ok (colorpalette etc)
  else if (len <= 16) s += 0;       // 13-16: borderline
  else if (len <= 20) s -= 10;      // long
  else s -= 30;                     // too long

  // ---------- TLD TRUST (critical for revenue) ----------
  s += TLD_SCORES[tld] ?? -5;

  // ---------- KEYWORD DENSITY (the main lever) ----------
  // Sum all keyword weights that appear
  let kwScore = 0;
  let kwCount = 0;
  for (const { re, w } of KW_WEIGHTS) {
    if (re.test(stem)) {
      kwScore += w;
      kwCount++;
    }
  }
  // Cap keyword contribution to avoid 4-keyword stuffing
  s += Math.min(kwScore, 60);
  // But bonus for having at least 1 keyword
  if (kwCount >= 1) s += 8;
  if (kwCount >= 2) s += 4;  // double keyword (colorpalette, colorscheme) = gold

  // ---------- PRONOUNCEABILITY ----------
  const vr = vowelRatio(stem);
  if (vr < 0.2) s -= 20;
  else if (vr > 0.7) s -= 5;
  else if (vr >= 0.3 && vr <= 0.55) s += 5;

  if (hasRepeatingConsonants(stem)) s -= 12;

  // ---------- COMMERCIAL INTENT ----------
  if (INTENT_SIGNALS.test(stem)) s += 5;

  // ---------- PENALTIES ----------
  // Starts with awkward prefix (for long compounds)
  if (/^(the|my|a|get|use|try)/.test(stem) && len > 12) s -= 5;
  // All-consonant stems
  if (!/[aeiouy]/.test(stem)) s -= 50;
  // Hyphens hurt type-in and CTR ~15-20%
  if (/-/.test(stem)) s -= 20;

  return s;
}

// =====================================================================
// GENERATION
// =====================================================================

const candidates = new Set();

// Pattern 1: single commercial keyword + TLD
for (const k of [...KW_HEAD, ...KW_INTENT]) {
  for (const t of TLDS) candidates.add(k + t);
}

// Pattern 2: color + intent keyword (colorpalette, colorcombination, etc)
// These are the HIGHEST-SIGNAL EMDs
for (const head of ['color', 'colors', 'colour', 'colours']) {
  for (const intent of KW_INTENT) {
    for (const t of TLDS) candidates.add(head + intent + t);
  }
}

// Pattern 3: hue/shade/tone/tint + intent
for (const head of ['hue', 'hues', 'shade', 'shades', 'tone', 'tones', 'tint', 'tints']) {
  for (const intent of KW_INTENT) {
    for (const t of TLDS) candidates.add(head + intent + t);
  }
}

// Pattern 4: palette + intent / intent + palette
for (const intent of KW_INTENT) {
  for (const t of TLDS) {
    candidates.add('palette' + intent + t);
    candidates.add(intent + 'palette' + t);
  }
}

// Pattern 5: color + modifier (colorhub, colorlab, colorkit, etc)
for (const head of ['color', 'colour', 'hue', 'shade', 'tone', 'tint', 'palette', 'hex', 'pigment', 'swatch']) {
  for (const m of MOD) {
    for (const t of TLDS) candidates.add(head + m + t);
  }
}

// Pattern 6: modifier + color (hubcolor, labcolor, etc — usually weaker)
for (const m of MOD) {
  for (const head of ['color', 'colour', 'hue', 'palette', 'shade']) {
    for (const t of TLDS.slice(0, 5)) candidates.add(m + head + t);
  }
}

// Pattern 7: design prefix + head keyword
for (const pre of DESIGN_PREFIX) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'shade', 'scheme']) {
    for (const t of TLDS.slice(0, 6)) candidates.add(pre + head + t);
  }
}

// Pattern 8: 2-word high-value compounds (color + intent)
const TOP_INTENT = ['palette', 'combination', 'combinations', 'scheme', 'schemes', 'picker', 'generator', 'wheel', 'theory', 'guide', 'kit'];
for (const intent of TOP_INTENT) {
  for (const suf of ['', 'hub', 'lab', 'labs', 'pro', 'app', 'io', 'studio']) {
    for (const t of TLDS.slice(0, 6)) {
      candidates.add('color' + intent + suf + t);
      candidates.add(intent + 'color' + suf + t);
    }
  }
}

// Pattern 9: hex-prefixed (hex has huge search volume)
for (const suf of ['color', 'colors', 'palette', 'palettes', 'code', 'codes', 'picker', 'generator', 'tool', 'kit', 'hub', 'lab']) {
  for (const t of TLDS) candidates.add('hex' + suf + t);
}

// Pattern 10: palette-prefixed
for (const suf of ['hub', 'lab', 'labs', 'kit', 'tool', 'tools', 'pro', 'app', 'io', 'studio', 'club', 'pal', 'hq']) {
  for (const t of TLDS) candidates.add('palette' + suf + t);
}

// Pattern 11: 3-letter color-adjacent short brandable (huge memorability)
const SHORT_BRAND = [
  'hue', 'tye', 'dye', 'ink', 'chr', 'col', 'pal', 'tnt', 'tnts',
  'hx', 'tn', 'rgb', 'cmyk',
];
for (const s of SHORT_BRAND) {
  for (const t of TLDS.slice(0, 5)) candidates.add(s + t);
}

// Pattern 12: 2-word generic (everycolor, allcolors, etc)
const GENERIC_PREFIX = ['every', 'all', 'just', 'pure', 'real', 'one'];
for (const p of GENERIC_PREFIX) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'shade']) {
    for (const t of TLDS.slice(0, 4)) candidates.add(p + head + t);
  }
}

// Pattern 13: plural-intent + head (combinations of color, etc is skipped as awkward; focus on single-word compounds)
// Pattern 14: color + [common word] — high memorability
const COMMON_SUFFIX = ['make', 'makes', 'maker', 'makers', 'find', 'finder', 'finds', 'go', 'now', 'get', 'use', 'play', 'time', 'map', 'maps', 'ish'];
for (const suf of COMMON_SUFFIX) {
  for (const head of ['color', 'palette', 'hue', 'shade']) {
    for (const t of TLDS.slice(0, 5)) candidates.add(head + suf + t);
  }
}

// Pattern 15: brandable EMD-adjacent (invented stems that still signal color)
const BRAND_STEMS = [
  'chromix', 'chromio', 'chromy', 'kromr', 'kromi', 'colora', 'colori',
  'huely', 'huelab', 'hueio', 'hueup', 'huemix',
  'palettor', 'palettz', 'palettly', 'palettia', 'palettio',
  'tinty', 'tintly', 'tintio',
  'colorly', 'colorby', 'colorup', 'colormix', 'colorio', 'colorly',
  'hexly', 'hexio', 'hexup', 'hexy',
  'swatchy', 'swatchio',
  'tonely', 'tonio',
  'paintly', 'paintio',
];
for (const b of BRAND_STEMS) {
  for (const t of TLDS.slice(0, 6)) candidates.add(b + t);
}

// =====================================================================
// EXPANSION PATTERNS (to push past 50k candidates)
// =====================================================================

// Pattern 16: action verb + color noun (pickcolor, makepalette, findshades)
const ACTIONS = ['pick', 'find', 'make', 'get', 'use', 'see', 'know', 'learn', 'match', 'mix', 'meet', 'grab', 'build', 'create', 'discover', 'explore', 'browse', 'try', 'test'];
for (const a of ACTIONS) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'hues', 'shade', 'shades', 'tone', 'tones', 'tint', 'hex', 'scheme', 'combo', 'combos']) {
    for (const t of TLDS.slice(0, 6)) candidates.add(a + head + t);
  }
}

// Pattern 17: color + noun reversal (mycolor, thepalette, yourhues)
const POSSESSIVE = ['my', 'the', 'your', 'our', 'his', 'her', 'its', 'this', 'that', 'any', 'each', 'every'];
for (const p of POSSESSIVE) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'hues', 'shade', 'shades', 'scheme', 'combo', 'combos', 'hex', 'tint', 'tone']) {
    for (const t of TLDS.slice(0, 5)) candidates.add(p + head + t);
  }
}

// Pattern 18: plural-intent (tons of searches for "best palettes" etc)
const SUPERLATIVES = ['best', 'top', 'good', 'great', 'pro', 'easy', 'quick', 'smart', 'fresh', 'new', 'modern', 'classic', 'perfect', 'simple', 'clean'];
for (const sup of SUPERLATIVES) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'shade', 'scheme', 'combo', 'hex']) {
    for (const t of TLDS.slice(0, 5)) candidates.add(sup + head + t);
  }
}

// Pattern 19: triple-word combos (color + intent + modifier)
const TRIPLE_MOD = ['hub', 'lab', 'kit', 'pro', 'io', 'app', 'club', 'hq', 'zone'];
for (const head of ['color', 'palette', 'hue', 'shade', 'hex']) {
  for (const intent of ['pick', 'match', 'mix', 'combo', 'scheme', 'code', 'name', 'tool', 'guide', 'kit', 'finder', 'maker', 'gen']) {
    for (const mod of TRIPLE_MOD) {
      for (const t of TLDS.slice(0, 4)) candidates.add(head + intent + mod + t);
    }
  }
}

// Pattern 20: high-volume keyword stand-alones on MORE TLDs
const EXTRA_TLDS = ['.art', '.ink', '.gallery', '.works', '.guide', '.me', '.club', '.store', '.shop', '.press', '.space', '.page', '.site', '.online', '.live', '.today', '.world', '.blog'];
for (const k of [...KW_HEAD, ...KW_INTENT, ...MOD]) {
  for (const t of EXTRA_TLDS) candidates.add(k + t);
}

// Pattern 21: color + color (2 color word combos — memorable compound)
const COLOR_WORDS = ['color', 'colors', 'hue', 'hues', 'shade', 'shades', 'tone', 'tones', 'tint', 'tints', 'palette', 'palettes', 'hex', 'pigment', 'swatch'];
for (const a of COLOR_WORDS) {
  for (const b of COLOR_WORDS) {
    if (a !== b) {
      for (const t of TLDS.slice(0, 4)) candidates.add(a + b + t);
    }
  }
}

// Pattern 22: modifier + intent (hubpalette, labpalette, kitpalette)
for (const m of MOD) {
  for (const intent of KW_INTENT) {
    for (const t of TLDS.slice(0, 4)) candidates.add(m + intent + t);
  }
}

// Pattern 23: numbered / letter-stamped (color1, color365, colorAZ)
const NUMBERS = ['365', '24', '360', '101', '411', '911'];
for (const n of NUMBERS) {
  for (const head of ['color', 'colors', 'palette', 'hue', 'shade', 'hex']) {
    for (const t of TLDS.slice(0, 4)) candidates.add(head + n + t);
  }
}

// Pattern 24: color + year-agnostic brandable suffix
const BRAND_SUFFIX = ['box', 'bay', 'den', 'ify', 'ist', 'opolis', 'verse', 'city', 'land', 'nest', 'loop', 'flow', 'flux', 'wave', 'wire', 'tree', 'grove', 'ring', 'line'];
for (const s of BRAND_SUFFIX) {
  for (const head of ['color', 'palette', 'hue', 'shade', 'hex', 'tone']) {
    for (const t of TLDS.slice(0, 4)) candidates.add(head + s + t);
  }
}

// Pattern 25: design context + keyword (webdesign.palette, ui.palette...)
const DESIGN_CTX = ['web', 'ui', 'app', 'brand', 'logo', 'site', 'page', 'print', 'paint', 'graphic', 'digital', 'visual', 'creative'];
for (const ctx of DESIGN_CTX) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'shade', 'tone', 'tint', 'hex', 'scheme', 'combo']) {
    for (const t of TLDS.slice(0, 4)) candidates.add(ctx + head + t);
  }
}

// Pattern 26: short brandable 2-3 letter roots + common endings
const SHORT_ROOTS = ['chr', 'col', 'hue', 'pal', 'tnt', 'hex', 'rgb', 'pig', 'shd', 'tne'];
const SHORT_ENDS = ['by', 'io', 'ly', 'fy', 'mi', 'na', 'ra', 'ri', 'vo', 'zi', 'co', 'do', 'er', 'or', 'ox', 'ax', 'ex', 'ix', 'ux'];
for (const r of SHORT_ROOTS) {
  for (const e of SHORT_ENDS) {
    for (const t of TLDS.slice(0, 4)) candidates.add(r + e + t);
  }
}

// Pattern 27: rgb/hex/hsl technical prefixes + common words
const TECH_PREFIX = ['rgb', 'hex', 'hsl', 'cmyk'];
for (const tp of TECH_PREFIX) {
  for (const suf of ['palette', 'palettes', 'colors', 'scheme', 'schemes', 'picker', 'generator', 'wheel', 'theory', 'kit', 'tool', 'tools', 'hub', 'lab', 'labs', 'pro', 'app', 'io']) {
    for (const t of TLDS.slice(0, 5)) candidates.add(tp + suf + t);
  }
}

// Pattern 28: palette + plural-noun (palettefacts, palettedaily, etc)
const DAILY_SUFFIX = ['daily', 'weekly', 'fresh', 'hourly', 'today', 'now', 'live', 'facts', 'guide', 'guru', 'nerd', 'geek', 'maven', 'expert', 'wiz'];
for (const d of DAILY_SUFFIX) {
  for (const head of ['color', 'palette', 'hue', 'shade', 'hex']) {
    for (const t of TLDS.slice(0, 4)) candidates.add(head + d + t);
  }
}

// Pattern 29: 2-char prefix + head keyword (e.g. picolor, upcolor)
const TWO_CHAR_PRE = ['bi', 'co', 'do', 'ex', 'go', 'hi', 'in', 'no', 'on', 'pi', 'qu', 're', 'so', 'to', 'up', 'ox'];
for (const p of TWO_CHAR_PRE) {
  for (const head of ['color', 'palette', 'hue', 'shade', 'hex', 'tone']) {
    for (const t of TLDS.slice(0, 4)) candidates.add(p + head + t);
  }
}

// Pattern 30: triple compound — color + verb + noun
for (const head of ['color', 'palette', 'hue', 'hex']) {
  for (const verb of ['find', 'pick', 'match', 'mix', 'get', 'see']) {
    for (const noun of ['hub', 'lab', 'kit', 'tool', 'app', 'io']) {
      for (const t of TLDS.slice(0, 3)) candidates.add(head + verb + noun + t);
    }
  }
}

// Pattern 31: exhaustive color + intent (all intents × all TLDs)
for (const head of ['color', 'colour', 'hue', 'shade', 'tone', 'tint', 'palette']) {
  for (const intent of KW_INTENT) {
    for (const t of TLDS) {
      candidates.add(head + intent + t);
    }
  }
}

// Pattern 32: exhaustive intent + head (matchcolor, pickerpalette, etc)
for (const intent of KW_INTENT) {
  for (const head of ['color', 'colour', 'hue', 'shade', 'tone', 'tint', 'palette']) {
    for (const t of TLDS) {
      candidates.add(intent + head + t);
    }
  }
}

// Pattern 33: full modifier combo (all modifiers × all heads × all TLDs)
for (const m of MOD) {
  for (const head of ['color', 'colour', 'hue', 'hues', 'shade', 'shades', 'tone', 'tones', 'tint', 'tints', 'palette', 'palettes', 'hex', 'pigment', 'swatch']) {
    for (const t of TLDS) {
      candidates.add(head + m + t);
    }
  }
}

// Pattern 34: color + adjective brandables
const ADJECTIVES = ['fresh', 'bold', 'bright', 'vivid', 'soft', 'warm', 'cool', 'rich', 'deep', 'pure', 'clean', 'smart', 'fine', 'sharp', 'sweet', 'smooth', 'royal', 'elite', 'prime', 'true'];
for (const adj of ADJECTIVES) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'hues', 'shade', 'shades', 'tone', 'tint']) {
    for (const t of TLDS.slice(0, 6)) candidates.add(adj + head + t);
    for (const t of TLDS.slice(0, 6)) candidates.add(head + adj + t);
  }
}

// Pattern 35: plural + commercial modifier
for (const head of ['colors', 'palettes', 'hues', 'shades', 'tones', 'tints', 'pigments', 'swatches']) {
  for (const m of MOD) {
    for (const t of TLDS) {
      candidates.add(head + m + t);
    }
  }
}

// Pattern 36: get/use/try + color (imperative brandable)
for (const imp of ['get', 'use', 'try', 'go', 'see', 'meet', 'visit', 'call', 'do', 'have']) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'hues', 'shade', 'shades', 'tone', 'tones', 'tint', 'hex', 'scheme', 'combo', 'combos', 'pigment', 'swatch']) {
    for (const t of TLDS) candidates.add(imp + head + t);
  }
}

// Pattern 37: color + -ify/-ize/-able brandable endings
const BRAND_ENDINGS = ['ify', 'ize', 'able', 'fully', 'ably', 'ish', 'esque', 'like', 'some', 'ward', 'wise', 'ward', 'ly'];
for (const e of BRAND_ENDINGS) {
  for (const head of ['color', 'palette', 'hue', 'shade', 'tone', 'tint', 'hex']) {
    for (const t of TLDS.slice(0, 6)) candidates.add(head + e + t);
  }
}

// Pattern 38: 2-word descriptive pair (best brand + color)
const BRAND_PAIRS = ['rainbow', 'spectrum', 'canvas', 'paint', 'brush', 'pigment', 'dye', 'ink', 'glass', 'stone', 'gem', 'jewel'];
for (const bp of BRAND_PAIRS) {
  for (const head of ['color', 'colors', 'palette', 'hues', 'shades', 'tones', 'tints', 'hex']) {
    for (const t of TLDS.slice(0, 6)) candidates.add(bp + head + t);
    for (const t of TLDS.slice(0, 6)) candidates.add(head + bp + t);
  }
}

// Pattern 39: 4+ word brandable compounds (palette + studio + hub)
for (const head of ['color', 'palette', 'hue', 'hex']) {
  for (const m1 of ['lab', 'hub', 'kit', 'pro', 'app', 'io', 'club']) {
    for (const m2 of ['pro', 'app', 'io', 'plus', 'hq', 'club']) {
      if (m1 !== m2) {
        for (const t of TLDS.slice(0, 4)) candidates.add(head + m1 + m2 + t);
      }
    }
  }
}

// Pattern 40: ultra-high-value direct intent (colorpicker, palettepicker...)
const ULTRA_INTENT = ['picker', 'finder', 'maker', 'generator', 'creator', 'builder', 'matcher', 'mixer', 'chooser', 'decoder', 'coder'];
for (const ui of ULTRA_INTENT) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'hues', 'shade', 'shades', 'hex', 'scheme', 'combo', 'theme', 'tone', 'tint', 'pigment']) {
    for (const t of TLDS) candidates.add(head + ui + t);
  }
}

// Pattern 41: numeric modifiers on common heads
const NUM_MODIFIERS = ['2', '3', 'two', 'three', 'one', 'zero'];
for (const n of NUM_MODIFIERS) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'shade', 'tone', 'hex', 'scheme', 'combo']) {
    for (const t of TLDS.slice(0, 5)) candidates.add(head + n + t);
    for (const t of TLDS.slice(0, 5)) candidates.add(n + head + t);
  }
}

// Pattern 42: reversed brand + intent (hubcolor, labhue, kitpalette)
for (const m of MOD) {
  for (const head of ['color', 'colors', 'palette', 'palettes', 'hue', 'hues', 'shade', 'shades', 'tone', 'tones', 'tint', 'tints', 'hex', 'pigment', 'swatch']) {
    for (const t of TLDS) candidates.add(m + head + t);
  }
}

// =====================================================================
// SCORE + RANK + EXCLUDE PREVIOUS ROUNDS
// =====================================================================

const excludeSet = new Set();
for (const f of [
  './domain-research/top300.txt',
  './domain-research/top500-v2.txt',
  './domain-research/top500-v3.txt',
]) {
  try {
    if (existsSync(f)) {
      readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(d => excludeSet.add(d.trim()));
    }
  } catch (e) { /* ignore */ }
}
console.log(`Excluding ${excludeSet.size} already-checked domains from prior rounds`);

const scored = [];
for (const domain of candidates) {
  const lastDot = domain.lastIndexOf('.');
  const stem = domain.substring(0, lastDot);
  const tld = domain.substring(lastDot);
  if (stem.length < 2 || stem.length > 24) continue;
  if (/[^a-z]/.test(stem)) continue;
  if (excludeSet.has(domain)) continue;

  const sc = score(stem, tld);
  scored.push({ domain, score: sc, stem, tld });
}

scored.sort((a, b) => b.score - a.score);

console.log(`Generated ${candidates.size} candidates total`);
console.log(`After filter: ${scored.length}`);
console.log(`Top score: ${scored[0]?.score}, median: ${scored[Math.floor(scored.length / 2)]?.score}`);

writeFileSync(
  './domain-research/all-candidates-v4.txt',
  scored.map(s => `${String(s.score).padStart(4)} ${s.domain}`).join('\n'),
);

const top500 = scored.slice(0, 500).map(s => s.domain);
writeFileSync('./domain-research/top500-v4.txt', top500.join('\n'));

writeFileSync(
  './domain-research/top500-v4-scored.txt',
  scored.slice(0, 500).map((s, i) => `${String(i + 1).padStart(3)}. [${s.score}] ${s.domain}`).join('\n'),
);

console.log('Wrote top500-v4.txt + top500-v4-scored.txt');
