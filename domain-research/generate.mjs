#!/usr/bin/env node
// Domain name generator for color-combinations project.
// Generates ~50k combinatorial candidates, scores them, emits top 300.
//
// Scoring factors:
//   - Length (shorter is better, with sweet spot 5-11 chars before TLD)
//   - Pronounceability (vowel/consonant balance)
//   - TLD preference (.com > .co > .io > .art > .studio > rest)
//   - Brandability (dictionary words with color/design relevance)
//   - Memorability (alliteration, repetition, rhythm)
//   - No awkward prefixes/suffixes
//
// Output: top300.txt (sorted by score, descending)

import { writeFileSync } from 'node:fs';

// --- WORD BANKS ----------------------------------------------------------

// Core roots — color, palette, design concepts
const CORE_ROOTS = [
  'color', 'colour', 'hue', 'hues', 'chroma', 'palette', 'palettes',
  'shade', 'shades', 'tone', 'tones', 'tint', 'tints', 'pigment', 'pigments',
  'spectrum', 'spectra', 'prism', 'prisms', 'swatch', 'swatches',
  'combo', 'combos', 'combine', 'blend', 'blends', 'mix', 'mixer',
  'pair', 'pairs', 'paired', 'match', 'matched', 'harmony', 'harmonies',
  'scheme', 'schemes', 'theme', 'themes', 'mood', 'moods',
];

// Dictionary / archive / reference concepts (the WEDGE — heritage framing)
const REFERENCE_ROOTS = [
  'dictionary', 'lexicon', 'atlas', 'catalog', 'catalogue', 'index',
  'archive', 'library', 'codex', 'compendium', 'almanac', 'annals',
  'register', 'manual', 'handbook', 'guide', 'manifest', 'repertoire',
  'gazette', 'encyclopedia', 'thesaurus', 'book', 'folio', 'volume',
];

// Heritage / historical / refined connotation
const HERITAGE_ROOTS = [
  'heritage', 'classical', 'antique', 'ancient', 'historic', 'vintage',
  'tradition', 'archive', 'museum', 'curated', 'curator', 'legacy',
  'folio', 'quarto', 'tome', 'treatise',
];

// Japanese / Wada-adjacent roots (public-domain cultural terms)
const JP_ROOTS = [
  'iro',      // color
  'iroha',    // traditional alphabet / primer
  'wada',     // Sanzo Wada's family name — safe as common cultural reference
  'sanzo',    // Wada's given name — proceed with care, we're not claiming affiliation
  'nippon',   // Japan
  'nihon',    // Japan
  'kyoto',    // Kyoto
  'edo',      // Edo period
  'zen',
  'sakura',   // cherry blossom
  'hanami',   // flower viewing
  'shibumi',  // quiet refinement
  'wabi',     // quiet simplicity
  'sabi',     // beauty of age
  'wabisabi',
  'sumi',     // ink
  'washi',    // japanese paper
  'kimono',
  'origami',
  'bonsai',
  'tatami',
  'chiyo',
  'koto',
  'tsuki',    // moon
  'kaze',     // wind
  'kumo',     // cloud
  'mori',     // forest
  'yume',     // dream
];

// Design / studio / craft
const DESIGN_ROOTS = [
  'design', 'designer', 'studio', 'lab', 'works', 'workshop', 'house',
  'atelier', 'craft', 'maker', 'makers', 'type', 'form', 'pattern',
  'print', 'paper', 'ink', 'brush', 'pen', 'canvas',
];

// Short brandable stems (invented / suggestive)
const BRAND_STEMS = [
  'chromi', 'huely', 'palett', 'tonica', 'colora', 'colori', 'kromar',
  'pigmen', 'chroma', 'colora', 'huely', 'polette', 'paletto', 'palet',
  'kolor', 'koloro', 'chrome', 'hue',
];

// Prefixes (decorative, usually reduce brand strength but can work)
const PREFIXES = [
  '', 'the', 'my', 'get', 'use', 'find', 'try', 'love', 'all', 'meta', 'open',
];

// Suffixes (modifier words)
const SUFFIXES = [
  '', 'app', 'io', 'hub', 'club', 'co', 'ly', 'box', 'kit', 'ify', 'ist',
  'lab', 'world', 'zone', 'base', 'spot', 'pro', 'plus', 'daily',
];

// Top TLDs to try
const TLDS = [
  '.com', '.co', '.io', '.art', '.studio', '.design', '.xyz',
  '.app', '.dev', '.net', '.me', '.club', '.site', '.online',
  '.store', '.shop',
];

// --- HELPERS -------------------------------------------------------------

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
function vowelRatio(word) {
  const letters = word.replace(/[^a-z]/g, '');
  if (!letters.length) return 0;
  let v = 0;
  for (const c of letters) if (VOWELS.has(c)) v++;
  return v / letters.length;
}

function hasRepeatingConsonants(word) {
  // three+ consonants in a row is hard to pronounce
  return /[bcdfghjklmnpqrstvwxz]{3,}/.test(word);
}

function hasDoubleLetters(word) {
  return /(.)\1/.test(word);
}

function isAllConsonants(word) {
  return !/[aeiouy]/.test(word);
}

function startsAwkward(word) {
  // avoid obviously bad beginnings
  return /^(the|my|get|use|try|love|all|meta|open)/.test(word) && word.length > 14;
}

// --- SCORING -------------------------------------------------------------

function score(stem, tld) {
  let s = 100;
  const full = (stem + tld).toLowerCase();
  const stemLen = stem.length;

  // LENGTH: sweet spot is 5-11 chars stem
  if (stemLen < 4) s -= 30;
  else if (stemLen === 4) s += 8;
  else if (stemLen <= 7) s += 15;
  else if (stemLen <= 10) s += 8;
  else if (stemLen <= 13) s -= 5;
  else if (stemLen <= 16) s -= 15;
  else s -= 40;

  // TLD preference
  const tldScore = {
    '.com': 25,
    '.co': 12,
    '.io': 10,
    '.art': 14,
    '.studio': 10,
    '.design': 8,
    '.app': 6,
    '.dev': 4,
    '.xyz': -3,
    '.net': -2,
    '.me': 3,
    '.club': -4,
    '.site': -10,
    '.online': -12,
    '.store': 0,
    '.shop': 2,
  };
  s += tldScore[tld] ?? 0;

  // Pronounceability
  const vr = vowelRatio(stem);
  if (vr < 0.2) s -= 25;
  else if (vr > 0.65) s -= 10;
  else if (vr >= 0.3 && vr <= 0.55) s += 8;

  if (hasRepeatingConsonants(stem)) s -= 15;
  if (isAllConsonants(stem)) s -= 50;

  // Hard-to-type penalty
  if (/[^a-z]/.test(stem)) s -= 30;

  // Heritage/dictionary concept bonus (signals the wedge)
  const heritage = /(dictionary|lexicon|atlas|codex|archive|folio|tome|heritage|tradition|vintage|classical|ancient|historic|museum|quarto|almanac|index|compendium|manual|guide)/;
  if (heritage.test(stem)) s += 18;

  // Color concept bonus
  const colorish = /(color|colour|hue|chroma|palette|shade|tone|tint|pigment|spectrum|prism|swatch)/;
  if (colorish.test(stem)) s += 12;

  // Japanese element bonus (wedge)
  const jp = /(iro|wada|sanzo|nihon|nippon|edo|kyoto|sumi|washi|wabi|sabi|zen|sakura)/;
  if (jp.test(stem)) s += 14;

  // Double word combo bonus if it reads well
  if (stemLen >= 8 && stemLen <= 13 && vr >= 0.3 && vr <= 0.55) s += 5;

  // Common bad patterns
  if (stemLen > 16) s -= 20;
  if (startsAwkward(stem)) s -= 10;

  return s;
}

// --- GENERATION ----------------------------------------------------------

const candidates = new Set();

// Pattern 1: single word + TLD (core, reference, heritage, jp, design, brand)
for (const word of [...CORE_ROOTS, ...REFERENCE_ROOTS, ...HERITAGE_ROOTS, ...JP_ROOTS, ...DESIGN_ROOTS, ...BRAND_STEMS]) {
  for (const tld of TLDS) {
    candidates.add(word + tld);
  }
}

// Pattern 2: core + reference (e.g. colordictionary, palettelexicon)
for (const a of CORE_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 3: jp + core (e.g. iropalette, wadacolors)
for (const a of JP_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 4: jp + reference (e.g. irodictionary, wadacodex)
for (const a of JP_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 5: heritage + core (e.g. classicalcolor, vintagehues)
for (const a of HERITAGE_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 6: core + design (e.g. palettestudio, huelab)
for (const a of CORE_ROOTS) {
  for (const b of DESIGN_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 7: core + suffix (e.g. hueapp, paletteio, chromahub)
for (const a of CORE_ROOTS) {
  for (const suf of SUFFIXES.filter(s => s)) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + suf + tld);
    }
  }
}

// Pattern 8: brand stems + suffix (e.g. chromifyapp, koloristudio)
for (const a of BRAND_STEMS) {
  for (const suf of SUFFIXES.filter(s => s)) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + suf + tld);
    }
  }
}

// Pattern 9: prefix + core (e.g. thecolor, mypalette)
for (const pre of PREFIXES.filter(p => p)) {
  for (const a of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 4)) {
      candidates.add(pre + a + tld);
    }
  }
}

// Pattern 10: prefix + core + reference (e.g. thecolordictionary)
for (const pre of ['the']) {
  for (const a of CORE_ROOTS) {
    for (const b of REFERENCE_ROOTS) {
      for (const tld of TLDS.slice(0, 3)) {
        candidates.add(pre + a + b + tld);
      }
    }
  }
}

// Pattern 11: jp + design (e.g. zenstudio, wadacraft)
for (const a of JP_ROOTS) {
  for (const b of DESIGN_ROOTS) {
    for (const tld of TLDS.slice(0, 5)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- SCORE AND RANK ------------------------------------------------------

const scored = [];
for (const domain of candidates) {
  const lastDot = domain.lastIndexOf('.');
  const stem = domain.substring(0, lastDot);
  const tld = domain.substring(lastDot);
  if (stem.length < 3 || stem.length > 22) continue;
  if (/[^a-z]/.test(stem)) continue;

  const sc = score(stem, tld);
  scored.push({ domain, score: sc, stem, tld });
}

scored.sort((a, b) => b.score - a.score);

console.log(`Generated ${candidates.size} candidates`);
console.log(`Scored ${scored.length} valid candidates`);
console.log(`Top score: ${scored[0]?.score}, median: ${scored[Math.floor(scored.length / 2)]?.score}, low: ${scored[scored.length - 1]?.score}`);

// Write all to file
writeFileSync(
  './domain-research/all-candidates.txt',
  scored.map(s => `${String(s.score).padStart(4)} ${s.domain}`).join('\n'),
);

// Write top 300 to separate file (just domains, for availability checking)
const top300 = scored.slice(0, 300).map(s => s.domain);
writeFileSync('./domain-research/top300.txt', top300.join('\n'));

// Also write top 300 with scores for reference
writeFileSync(
  './domain-research/top300-scored.txt',
  scored.slice(0, 300).map((s, i) => `${String(i + 1).padStart(3)}. [${s.score}] ${s.domain}`).join('\n'),
);

console.log(`Wrote top 300 to domain-research/top300.txt`);
console.log(`Wrote all candidates to domain-research/all-candidates.txt`);
