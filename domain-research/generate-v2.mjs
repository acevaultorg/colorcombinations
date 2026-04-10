#!/usr/bin/env node
// Domain name generator V2 — massively expanded word banks.
// Targets 100k+ combinatorial candidates. Biases toward short brandable stems.
//
// Writes:
//   all-candidates-v2.txt  — full scored pool
//   top500-v2.txt          — top 500 unique candidates NOT already in top300.txt
//   top500-v2-scored.txt   — same with scores and indices

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// ============================================================
// EXPANDED WORD BANKS
// ============================================================

// --- Core color concepts -------------------------------------
const CORE_ROOTS = [
  'color', 'colour', 'hue', 'hues', 'chroma', 'chromas',
  'palette', 'palettes', 'shade', 'shades', 'tone', 'tones',
  'tint', 'tints', 'pigment', 'pigments', 'spectrum', 'spectra',
  'prism', 'prisms', 'swatch', 'swatches', 'rainbow', 'iris',
  'glaze', 'gouache', 'tinge', 'cast', 'wash',
  'mix', 'blend', 'blends', 'pair', 'pairs', 'match', 'harmony',
  'scheme', 'theme', 'themes', 'mood', 'moods',
];

// --- Reference / dictionary / archive concepts (wedge) -------
const REFERENCE_ROOTS = [
  'dictionary', 'lexicon', 'atlas', 'catalog', 'catalogue',
  'index', 'archive', 'library', 'codex', 'codices',
  'compendium', 'almanac', 'annals', 'register', 'manual',
  'handbook', 'guide', 'manifest', 'repertoire', 'gazette',
  'encyclopedia', 'thesaurus', 'book', 'folio', 'volume',
  'quarto', 'octavo', 'tome', 'treatise', 'monograph',
  'anthology', 'omnibus', 'compilation', 'scroll', 'scrolls',
  'manuscript', 'parchment', 'vellum', 'chronicle', 'chronicles',
  'glossary', 'vocabulary', 'taxonomy', 'nomenclature',
  'primer', 'reference', 'source', 'record', 'records',
  'trove', 'vault', 'repository', 'cabinet', 'chamber',
];

// --- Heritage / refinement -----------------------------------
const HERITAGE_ROOTS = [
  'heritage', 'classical', 'antique', 'ancient', 'historic',
  'historical', 'vintage', 'tradition', 'traditional', 'museum',
  'curated', 'curator', 'curatorial', 'legacy', 'canon',
  'canonical', 'timeless', 'eternal', 'venerable', 'venerated',
];

// --- Japanese roots (safe cultural references) ---------------
const JP_ROOTS = [
  // Color / visual
  'iro',       // color
  'iroha',     // traditional syllabary / primer
  'irodori',   // coloring
  'aya',       // twill / design
  'aya',       // color/patterns
  'sumi',      // ink
  'sumie',     // ink painting
  'kami',      // paper / spirit
  'washi',     // Japanese paper
  'kinpaku',   // gold leaf
  'kin',       // gold
  'gin',       // silver

  // Wada-family references (generic, not direct book copy)
  'wada',
  'sanzo',

  // Place + era
  'nihon', 'nippon', 'kyoto', 'edo', 'tokyo', 'nara',
  'kamakura', 'heian', 'meiji', 'taisho', 'showa',

  // Seasons
  'haru',      // spring
  'natsu',     // summer
  'aki',       // autumn
  'fuyu',      // winter
  'hanami',    // flower viewing
  'momiji',    // autumn leaves
  'tsukimi',   // moon viewing
  'yukimi',    // snow viewing

  // Nature
  'yama',      // mountain
  'kawa',      // river
  'umi',       // sea
  'sora',      // sky
  'hana',      // flower
  'mori',      // forest
  'kaze',      // wind
  'kumo',      // cloud
  'tsuki',     // moon
  'hoshi',     // star
  'taiyo',     // sun
  'ame',       // rain
  'yuki',      // snow

  // Flowers / plants (these ARE common color references in JP tradition)
  'sakura',    // cherry blossom
  'ume',       // plum
  'momo',      // peach
  'fuji',      // wisteria
  'kiku',      // chrysanthemum
  'matsu',     // pine
  'take',      // bamboo
  'botan',     // peony
  'tsubaki',   // camellia
  'kaede',     // maple
  'yuri',      // lily
  'nadeshiko', // pink
  'ayame',     // iris
  'kikyo',     // bellflower
  'sumire',    // violet

  // Aesthetic concepts
  'wabi', 'sabi', 'wabisabi', 'shibui',
  'zen', 'chado', 'sado',
  'mono', 'monoware', 'monogatari',
  'yuugen', 'miyabi', 'iki',
  'kokoro', 'kodawari', 'wa',
  'kintsugi', 'kansou',

  // Art forms
  'ukiyo', 'ukiyoe', 'origami', 'bonsai', 'ikebana', 'gyotaku',
  'shodo', 'raku', 'kata', 'chiyo', 'chiyogami',

  // Misc
  'koto', 'yume', 'tatami', 'kimono', 'tabi', 'obi',
];

// --- Design / craft ------------------------------------------
const DESIGN_ROOTS = [
  'design', 'studio', 'lab', 'works', 'workshop', 'house',
  'atelier', 'craft', 'maker', 'makers', 'type', 'form',
  'pattern', 'print', 'paper', 'ink', 'brush', 'pen',
  'canvas', 'easel', 'gallery', 'exhibit', 'museum',
];

// --- Short brandable stems (invented, suggestive) ------------
const BRAND_STEMS = [
  // Color-adjacent invented
  'chromi', 'chromo', 'chromix', 'kroma', 'kromar', 'krome',
  'huely', 'hueli', 'huemo', 'hueba', 'huevo',
  'palett', 'palettx', 'paletto', 'paleta',
  'tonica', 'toneo', 'tonia', 'tono',
  'colora', 'colori', 'coloro', 'colorly',
  'pigmen', 'pigma', 'pigmenta',
  'tintar', 'tinta', 'tinty', 'tintly',
  'shadea', 'shadee', 'shadya',
  'kolor', 'koloro', 'kolori', 'koloria',
  'hewe', 'hewo',

  // Japanese-inspired coinages
  'irova', 'iroki', 'iromi', 'iroya', 'irono',
  'wadaya', 'wadami', 'wadaki',
  'sumika', 'sumire', 'sumion',

  // Invented art/design
  'artika', 'artium', 'arthue', 'artone',
  'atelia', 'ateliar', 'atelir',
  'pally', 'paly', 'paloria', 'paloni',
  'tomox', 'tomik', 'tomir',
];

// --- Short single-word brandable (4-6 chars) -----------------
const SHORT_ROOTS = [
  'iro', 'hue', 'wada', 'zen', 'ink', 'dye', 'gem',
  'koi', 'sumi', 'umi', 'sora', 'yume', 'hana', 'kiku',
  'matsu', 'take', 'fuji', 'kaze', 'mori', 'sumi',
  'jade', 'onyx', 'opal', 'pearl', 'amber', 'topaz',
  'saffron', 'crimson', 'ochre', 'indigo', 'ultramarine',
  'terra', 'aqua', 'mare', 'aura',
];

// --- Prefixes ------------------------------------------------
const PREFIXES = [
  '', 'the', 'my', 'a', 'get', 'use', 'find', 'try', 'love',
  'all', 'meta', 'open', 'new', 'pure', 'real', 'true',
];

// --- Suffixes ------------------------------------------------
const SUFFIXES = [
  '', 'app', 'io', 'hub', 'club', 'co', 'ly', 'box', 'kit',
  'ify', 'ist', 'lab', 'world', 'zone', 'base', 'spot', 'pro',
  'plus', 'daily', 'works', 'craft', 'house', 'studio',
];

// --- TLDs ----------------------------------------------------
// (expanded with more design-adjacent options)
const TLDS = [
  '.com', '.co', '.io', '.art', '.studio', '.design', '.ink',
  '.gallery', '.xyz', '.app', '.dev', '.net', '.me', '.club',
  '.site', '.online', '.store', '.shop', '.works', '.guide',
  '.press', '.blog', '.museum',  // .museum is restricted but we'll score and filter
  '.space',
];

// ============================================================
// SCORING
// ============================================================

const VOWELS = new Set(['a', 'e', 'i', 'o', 'u', 'y']);
function vowelRatio(word) {
  const letters = word.replace(/[^a-z]/g, '');
  if (!letters.length) return 0;
  let v = 0;
  for (const c of letters) if (VOWELS.has(c)) v++;
  return v / letters.length;
}
function hasRepeatingConsonants(word) {
  return /[bcdfghjklmnpqrstvwxz]{3,}/.test(word);
}
function isAllConsonants(word) {
  return !/[aeiouy]/.test(word);
}

function score(stem, tld) {
  let s = 100;
  const stemLen = stem.length;

  // LENGTH — more aggressive bonus for short brandable
  if (stemLen === 3) s += 5;     // 3-char stems get small bonus (not -30 now)
  else if (stemLen === 4) s += 20; // big bonus for 4-char
  else if (stemLen <= 6) s += 18;
  else if (stemLen <= 8) s += 12;
  else if (stemLen <= 10) s += 5;
  else if (stemLen <= 13) s -= 5;
  else if (stemLen <= 16) s -= 15;
  else s -= 40;

  // TLD
  const tldScore = {
    '.com': 28,
    '.co': 14,
    '.io': 12,
    '.art': 16,
    '.studio': 11,
    '.design': 10,
    '.ink': 14,
    '.gallery': 6,
    '.guide': 4,
    '.works': 5,
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
    '.press': 2,
    '.blog': 0,
    '.space': -5,
    '.museum': -50, // restricted, skip
  };
  s += tldScore[tld] ?? 0;

  // Pronounceability
  const vr = vowelRatio(stem);
  if (vr < 0.2) s -= 25;
  else if (vr > 0.7) s -= 8;
  else if (vr >= 0.3 && vr <= 0.55) s += 10;

  if (hasRepeatingConsonants(stem)) s -= 15;
  if (isAllConsonants(stem)) s -= 60;

  // Heritage wedge bonus
  const heritage = /(dictionary|lexicon|atlas|codex|archive|folio|tome|treatise|monograph|chronicle|anthology|omnibus|compendium|scroll|manuscript|vellum|parchment|glossary|taxonomy|primer|repository|cabinet|trove|vault|curated|museum|quarto|almanac|index|register|manifest|handbook|guide)/;
  if (heritage.test(stem)) s += 20;

  // Color bonus
  const colorish = /(color|colour|hue|chroma|palette|shade|tone|tint|pigment|spectrum|prism|swatch|rainbow|iris|glaze)/;
  if (colorish.test(stem)) s += 14;

  // Japanese element bonus
  const jp = /(iro|iroha|irodori|wada|sanzo|nihon|nippon|edo|kyoto|tokyo|nara|sumi|sumie|washi|wabi|sabi|shibui|zen|sakura|haru|natsu|aki|fuyu|yama|kawa|umi|sora|mori|kumo|tsuki|hoshi|taiyo|ume|momo|fuji|kiku|matsu|take|botan|kaede|yuri|ukiyo|origami|bonsai|kintsugi|kokoro|kimono|koto|yume|hana)/;
  if (jp.test(stem)) s += 16;

  // Nature/flower bonus (soft)
  const nature = /(hana|sakura|ume|momo|fuji|kiku|matsu|take|botan|tsubaki|kaede|yuri|yama|kawa|umi|sora|mori|kaze|kumo|tsuki|hoshi|yuki|ame|amber|jade|pearl|onyx|opal|topaz)/;
  if (nature.test(stem)) s += 5;

  // Common bad patterns
  if (stem.length > 18) s -= 25;

  // Prefix penalties (most prefix+word combos are weak brands)
  if (/^(the|my|a|get|use|try|all|find|love)/.test(stem) && stem.length > 13) s -= 8;

  return s;
}

// ============================================================
// GENERATION
// ============================================================

const candidates = new Set();

// Pattern 1: single stem from each bank + TLD
for (const word of [
  ...CORE_ROOTS, ...REFERENCE_ROOTS, ...HERITAGE_ROOTS,
  ...JP_ROOTS, ...DESIGN_ROOTS, ...BRAND_STEMS, ...SHORT_ROOTS,
]) {
  for (const tld of TLDS) {
    candidates.add(word + tld);
  }
}

// Pattern 2: core + reference
for (const a of CORE_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 10)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 3: jp + core
for (const a of JP_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 10)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 4: jp + reference
for (const a of JP_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 10)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 5: heritage + core
for (const a of HERITAGE_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 6: heritage + reference
for (const a of HERITAGE_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 7: core + design
for (const a of CORE_ROOTS) {
  for (const b of DESIGN_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 8: jp + design
for (const a of JP_ROOTS) {
  for (const b of DESIGN_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 9: core + suffix
for (const a of CORE_ROOTS) {
  for (const suf of SUFFIXES.filter(s => s)) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + suf + tld);
    }
  }
}

// Pattern 10: brand + suffix
for (const a of BRAND_STEMS) {
  for (const suf of SUFFIXES.filter(s => s)) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + suf + tld);
    }
  }
}

// Pattern 11: prefix + core
for (const pre of PREFIXES.filter(p => p)) {
  for (const a of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 5)) {
      candidates.add(pre + a + tld);
    }
  }
}

// Pattern 12: prefix + jp
for (const pre of PREFIXES.filter(p => p)) {
  for (const a of JP_ROOTS.slice(0, 30)) {
    for (const tld of TLDS.slice(0, 5)) {
      candidates.add(pre + a + tld);
    }
  }
}

// Pattern 13: prefix + core + reference
for (const pre of ['the', 'a']) {
  for (const a of CORE_ROOTS) {
    for (const b of REFERENCE_ROOTS) {
      for (const tld of TLDS.slice(0, 3)) {
        candidates.add(pre + a + b + tld);
      }
    }
  }
}

// Pattern 14: jp + jp (double Japanese — evocative compound names)
for (const a of JP_ROOTS.slice(0, 30)) {
  for (const b of JP_ROOTS.slice(0, 30)) {
    if (a !== b) {
      for (const tld of TLDS.slice(0, 5)) {
        candidates.add(a + b + tld);
      }
    }
  }
}

// Pattern 15: short root + suffix (very short brandable)
for (const a of SHORT_ROOTS) {
  for (const suf of SUFFIXES.filter(s => s)) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + suf + tld);
    }
  }
}

// Pattern 16: jp flower + core (seasonal color palette angle)
const FLOWERS = ['sakura', 'ume', 'momo', 'fuji', 'kiku', 'matsu', 'take', 'botan', 'tsubaki', 'kaede', 'yuri', 'ayame', 'kikyo'];
for (const a of FLOWERS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 17: season + core
const SEASONS = ['haru', 'natsu', 'aki', 'fuyu', 'hanami', 'momiji', 'tsukimi'];
for (const a of SEASONS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// Pattern 18: season + reference
for (const a of SEASONS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 5)) {
      candidates.add(a + b + tld);
    }
  }
}

// ============================================================
// SCORE + RANK + EXCLUDE PREVIOUS
// ============================================================

// Read previous top300 and available lists to exclude
let excludeSet = new Set();
try {
  if (existsSync('./domain-research/top300.txt')) {
    const prev = readFileSync('./domain-research/top300.txt', 'utf8');
    prev.split('\n').filter(Boolean).forEach(d => excludeSet.add(d.trim()));
  }
} catch (e) { /* ignore */ }

console.log(`Excluding ${excludeSet.size} domains from previous run`);

const scored = [];
for (const domain of candidates) {
  const lastDot = domain.lastIndexOf('.');
  const stem = domain.substring(0, lastDot);
  const tld = domain.substring(lastDot);
  if (stem.length < 3 || stem.length > 22) continue;
  if (/[^a-z]/.test(stem)) continue;
  if (excludeSet.has(domain)) continue;

  const sc = score(stem, tld);
  scored.push({ domain, score: sc, stem, tld });
}

scored.sort((a, b) => b.score - a.score);

console.log(`Generated ${candidates.size} candidates total`);
console.log(`After filtering: ${scored.length}`);
console.log(`Top: ${scored[0]?.score}, median: ${scored[Math.floor(scored.length / 2)]?.score}, low: ${scored[scored.length - 1]?.score}`);

writeFileSync(
  './domain-research/all-candidates-v2.txt',
  scored.map(s => `${String(s.score).padStart(4)} ${s.domain}`).join('\n'),
);

const top500 = scored.slice(0, 500).map(s => s.domain);
writeFileSync('./domain-research/top500-v2.txt', top500.join('\n'));

writeFileSync(
  './domain-research/top500-v2-scored.txt',
  scored.slice(0, 500).map((s, i) => `${String(i + 1).padStart(3)}. [${s.score}] ${s.domain}`).join('\n'),
);

console.log('Wrote top500-v2.txt and top500-v2-scored.txt');
