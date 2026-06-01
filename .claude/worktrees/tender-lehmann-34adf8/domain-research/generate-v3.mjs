#!/usr/bin/env node
// Domain generator V3 — international expansion.
// Adds: Chinese, Korean, Latin/Greek, French, Italian heritage/art words.
// Target: push candidate pool past 300k and surface European/East Asian alternatives.

import { writeFileSync, readFileSync, existsSync } from 'node:fs';

// =====================================================================
// NEW WORD BANKS (V3 additions)
// =====================================================================

// --- Chinese heritage / color ---------------------------------
// Using Pinyin (romanized Mandarin) — legible to Western readers.
const CN_ROOTS = [
  // Color / hue
  'se',        // 色 color
  'hong',      // 红 red
  'qing',      // 青 green-blue (ancient, includes both)
  'huang',     // 黄 yellow
  'bai',       // 白 white
  'hei',       // 黑 black
  'zi',        // 紫 purple
  'fen',       // 粉 pink
  'jin',       // 金 gold
  'yin',       // 银 silver
  'lan',       // 蓝 blue
  'lv',        // 绿 green (skip — awkward romanization)
  'cheng',     // 橙 orange
  'hui',       // 灰 grey

  // Traditional heritage colors
  'zhu',       // 朱 vermillion
  'gan',       // 绀 dark blue
  'bi',        // 碧 jade green
  'xuan',      // 玄 dark/black
  'zhe',       // 赭 ochre
  'fei',       // 绯 crimson
  'jiang',     // 绛 dark red
  'dai',       // 黛 charcoal / eyebrow black
  'su',        // 素 plain/white
  'cang',      // 苍 deep grey-green
  'cui',       // 翠 kingfisher green

  // Dynasty names (historical anchoring)
  'tang',      // Tang dynasty (art peak)
  'song',      // Song dynasty
  'ming',      // Ming dynasty
  'qin',       // Qin (first emperor)
  'han',       // Han dynasty
  'zhou',      // Zhou dynasty
  'xia',       // Xia dynasty

  // Cultural concepts
  'tao', 'dao',       // Way/path
  'chi', 'qi',        // Life force / energy
  'yin', 'yang',
  'feng',             // wind / phoenix
  'long',             // dragon
  'lian',             // lotus
  'mei',              // plum blossom
  'ju',               // chrysanthemum (Chinese)
  'zhu',              // bamboo (Chinese)
  'lan',              // orchid
  'jing',             // 景 scenery / 静 stillness / 京 capital

  // Art / calligraphy
  'shu',       // 书 book / writing / calligraphy
  'hua',       // 画 painting
  'mo',        // 墨 ink
  'zhi',       // 纸 paper
  'yan',       // 砚 inkstone
  'bi',        // 笔 brush
  'juan',      // 卷 scroll / volume
  'pu',        // 谱 catalog / manual / score
  'lu',        // 录 record
  'dian',      // 典 classic / canon
  'jing',      // 经 scripture / classic
  'zhi',       // 志 record/annals
  'ji',        // 集 collection
];

// --- Korean heritage ------------------------------------------
const KR_ROOTS = [
  // Colors (obangsaek — 5 cardinal colors)
  'baek',      // white
  'hwang',     // yellow
  'cheong',    // blue
  'jeok',      // red
  'heuk',      // black

  // Cultural / craft
  'hanji',     // traditional Korean paper
  'hanbok',    // traditional Korean dress
  'bojagi',    // wrapping cloth (patchwork color art)
  'dancheong', // traditional architectural painting
  'minhwa',    // folk painting
  'obangsaek', // 5 cardinal colors

  // Places / eras
  'joseon',    // Joseon dynasty (1392-1897, major art era)
  'goryeo',    // Goryeo (918-1392, celadon pottery)
  'silla',     // Silla (57 BC-935 AD)
  'seoul',
  'busan',

  // Concepts
  'han',       // concept of deep sorrow / heritage (careful — many meanings)
  'jeong',     // deep affection
  'mu',        // 무 void / nothing

  // Craft
  'ong',       // 옹 pottery
  'chaek',     // 책 book
  'saek',      // 색 color
];

// --- Latin / classical European --------------------------------
const LA_ROOTS = [
  // Color terms
  'color',     // already have
  'pigmentum', 'pigmenta',
  'tinctura',  // dye
  'tincture',  // english adapted
  'chroma',    // already have
  'fucus',     // purple dye / rouge
  'fuco',
  'rubrum',    // red
  'rubro',
  'aureum',    // gold
  'aureus',
  'argentum',  // silver
  'purpura',   // purple
  'caeruleus', // sky blue
  'viride',    // green
  'nigrum',    // black
  'album',     // white
  'flavus',    // yellow
  'roseus',    // rose

  // Art / manuscript
  'lux',       // light
  'lumen',     // light
  'opus',      // work / opus
  'codex',     // already have
  'folium',    // leaf / page
  'liber',     // book
  'libri',
  'ars',       // art
  'arte',
  'pictor',    // painter
  'pictura',   // picture
  'imago',     // image
  'rubrica',   // rubric
  'gloss',     // gloss
  'glossa',
  'lexicon',   // already have
  'vellum',    // already have
  'membrana',  // parchment
  'scriba',    // scribe
  'scriptum',  // writing
  'manus',     // hand
  'scriptor',  // writer
  'illumin',   // illumin
  'illuminat', // illuminate

  // Concepts
  'aeternum',  // eternal
  'aeterna',
  'memoria',
  'classica',  // classical
  'traditio',  // tradition
  'opuscul',   // small work
];

// --- Greek roots -----------------------------------------------
const GR_ROOTS = [
  'chroma', 'chromos', 'chromas', 'chromai',
  'chromatikos', 'chromatic',
  'chros',     // skin / color
  'biblio',    // book
  'biblion',
  'scriptorium',
  'lexis',     // word
  'logos',     // word / reason
  'graphe',    // writing / painting
  'phos',      // light
  'photo',     // light
  'helio',     // sun
  'mythos',
  'polis',     // city
  'kosmos',    // order / universe
  'kalos',     // beautiful
  'kallos',    // beauty
  'techne',    // craft / art
  'poiesis',   // creation
  'eidos',     // form
  'aisthesis', // perception / aesthetic
];

// --- French (art / craft / luxury) ------------------------------
const FR_ROOTS = [
  'couleur',
  'nuance',
  'teinte',
  'teint',
  'pastel',
  'gouache',
  'aquarelle',
  'velin',     // vellum (French spelling)
  'parchemin',
  'maroquin',  // moroccan leather (bookbinding)
  'atelier',   // already have
  'maison',    // house / luxury brand word
  'salon',
  'palette',   // already have
  'artiste',
  'peintre',   // painter
  'peinture',  // painting
  'dessin',    // drawing
  'beaux',     // beautiful
  'objets',    // objects
  'grandeur',
  'classique',
  'boudoir',
  'chateau',
];

// --- Italian (art history anchor) -------------------------------
const IT_ROOTS = [
  'colore',
  'tinta',
  'tinte',
  'sfumato',   // smoky transition (Leonardo)
  'sfumatura',
  'velatura',  // glazing
  'chiaroscuro',
  'pigmento',
  'bottega',   // workshop
  'maestro',
  'trattato',  // treatise
  'libro',     // book
  'libri',
  'codice',    // codex
  'palazzo',
  'museo',     // museum
  'galleria',  // gallery
  'scuola',    // school
  'accademia',
  'arte',
  'belle',     // beautiful
  'prima',     // first
  'nuovo',     // new
  'antico',    // ancient
  'classico',  // classical
  'rinascimento', // renaissance (too long)
  'quattrocento', // 15th century (too long)
];

// =====================================================================
// V2 WORD BANKS (keep — will generate fresh combinations with V3 banks)
// =====================================================================

const CORE_ROOTS = [
  'color', 'colour', 'hue', 'hues', 'chroma', 'palette',
  'shade', 'shades', 'tone', 'tones', 'tint', 'tints',
  'pigment', 'spectrum', 'prism', 'swatch', 'rainbow', 'iris',
  'glaze', 'mix', 'blend',
];

const REFERENCE_ROOTS = [
  'dictionary', 'lexicon', 'atlas', 'catalog', 'catalogue',
  'index', 'archive', 'library', 'codex', 'codices',
  'compendium', 'almanac', 'register', 'manual', 'handbook',
  'guide', 'folio', 'volume', 'quarto', 'tome', 'treatise',
  'monograph', 'anthology', 'compilation', 'scroll', 'scrolls',
  'manuscript', 'parchment', 'vellum', 'chronicle', 'chronicles',
  'glossary', 'vocabulary', 'taxonomy', 'nomenclature', 'primer',
  'repository', 'cabinet', 'trove', 'vault', 'chamber',
];

const HERITAGE_ROOTS = [
  'heritage', 'classical', 'antique', 'ancient', 'vintage',
  'tradition', 'museum', 'curated', 'legacy', 'canon', 'venerable',
];

const DESIGN_ROOTS = [
  'design', 'studio', 'lab', 'works', 'house', 'atelier',
  'gallery', 'museum',
];

// TLDs — expanded further
const TLDS = [
  '.com', '.co', '.io', '.art', '.studio', '.design',
  '.ink', '.gallery', '.app', '.dev', '.xyz', '.net',
  '.me', '.club', '.store', '.shop', '.works', '.guide',
  '.press', '.space', '.page', '.place', '.house', '.life',
  '.rocks', '.zone',
];

// =====================================================================
// SCORING (V3 — adds cultural heritage boosts)
// =====================================================================

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

  // Length
  if (stemLen === 3) s += 5;
  else if (stemLen === 4) s += 20;
  else if (stemLen <= 6) s += 18;
  else if (stemLen <= 8) s += 12;
  else if (stemLen <= 10) s += 5;
  else if (stemLen <= 13) s -= 5;
  else if (stemLen <= 16) s -= 15;
  else s -= 40;

  // TLD
  const tldScore = {
    '.com': 28, '.co': 14, '.io': 12, '.art': 16,
    '.studio': 11, '.design': 10, '.ink': 14, '.gallery': 6,
    '.guide': 4, '.works': 5, '.app': 6, '.dev': 4,
    '.xyz': -3, '.net': -2, '.me': 3, '.club': -4,
    '.store': 0, '.shop': 2, '.press': 2, '.space': -5,
    '.page': -2, '.place': -6, '.house': 2, '.life': -4,
    '.rocks': -8, '.zone': -8,
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
  const heritage = /(dictionary|lexicon|atlas|codex|archive|folio|tome|treatise|monograph|chronicle|anthology|compendium|scroll|manuscript|vellum|parchment|glossary|taxonomy|primer|repository|cabinet|trove|vault|chamber|curated|museum|quarto|almanac|index|register|manifest|handbook|guide|liber|libri|codice|libro|trattato|codex|pigmentum|biblio|scriptorium|gloss|glossa|rubrica|illumin)/;
  if (heritage.test(stem)) s += 20;

  // Color bonus
  const colorish = /(color|colour|hue|chroma|palette|shade|tone|tint|pigment|spectrum|prism|swatch|rainbow|iris|glaze|colore|couleur|nuance|teinte|pastel|gouache|aquarelle|tincture|tinctura|fucus|rubrum|aureum|argentum|purpura|caeruleus|viride|nigrum|album|flavus|roseus)/;
  if (colorish.test(stem)) s += 14;

  // Japanese element bonus
  const jp = /(iro|iroha|wada|sanzo|nihon|nippon|edo|kyoto|nara|sumi|washi|wabi|sabi|zen|sakura|haru|natsu|aki|fuyu|yama|kawa|umi|sora|mori|kumo|tsuki|hoshi|ume|momo|fuji|kiku|matsu|take|botan|kaede|yuri|ukiyo|kokoro|kimono|koto|yume|hana)/;
  if (jp.test(stem)) s += 16;

  // Chinese element bonus (new!)
  const cn = /(tang|song|ming|han|zhou|qing|qin|xia|hong|huang|cheng|zhu|fen|jing|mei|lian|lan|cui|cang|xuan|mo|bi|shu|hua|dian|juan|jing|chi|qi|tao|dao|feng|long|lu|pu|zhi)/;
  if (cn.test(stem) && !jp.test(stem)) s += 14;

  // Korean element bonus (new)
  const kr = /(joseon|goryeo|silla|hanji|hanbok|bojagi|dancheong|minhwa|obangsaek|baek|hwang|cheong|jeok|heuk|chaek|saek)/;
  if (kr.test(stem)) s += 14;

  // Latin element bonus (new)
  const la = /(pigmentum|tinctura|codex|lexicon|folium|liber|ars|pictor|rubrica|gloss|glossa|vellum|membrana|scriba|scriptum|aeternum|memoria|classica|lux|lumen|opus|caeruleus|purpura|imago|illumin)/;
  if (la.test(stem)) s += 15;

  // Greek element bonus (new)
  const gr = /(chroma|chromatic|biblio|scriptorium|lexis|logos|graphe|phos|photo|helio|kosmos|kalos|kallos|techne|eidos|aisthesis|poiesis)/;
  if (gr.test(stem)) s += 14;

  // French bonus (new)
  const fr = /(couleur|nuance|teinte|pastel|gouache|aquarelle|velin|parchemin|atelier|maison|salon|peintre|peinture|dessin|beaux|classique|boudoir|chateau)/;
  if (fr.test(stem)) s += 13;

  // Italian bonus (new)
  const it = /(colore|tinta|sfumato|sfumatura|velatura|chiaroscuro|pigmento|bottega|maestro|trattato|libro|codice|palazzo|museo|galleria|scuola|accademia|arte|antico|classico)/;
  if (it.test(stem)) s += 13;

  // Length penalty hard cutoff
  if (stemLen > 18) s -= 25;
  if (/^(the|my|a|get|use|try|all|find|love)/.test(stem) && stemLen > 13) s -= 8;

  return s;
}

// =====================================================================
// GENERATION
// =====================================================================

const candidates = new Set();

// --- Singles ---
const ALL_SINGLES = [
  ...CORE_ROOTS, ...REFERENCE_ROOTS, ...HERITAGE_ROOTS, ...DESIGN_ROOTS,
  ...CN_ROOTS, ...KR_ROOTS, ...LA_ROOTS, ...GR_ROOTS,
  ...FR_ROOTS, ...IT_ROOTS,
];
for (const w of ALL_SINGLES) {
  for (const tld of TLDS) {
    candidates.add(w + tld);
  }
}

// --- CN + reference ---
for (const a of CN_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 10)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- CN + core ---
for (const a of CN_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 10)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- KR + reference ---
for (const a of KR_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- KR + core ---
for (const a of KR_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 8)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- LA + reference ---
for (const a of LA_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- LA + core ---
for (const a of LA_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- GR + reference ---
for (const a of GR_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- GR + core ---
for (const a of GR_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- FR + reference ---
for (const a of FR_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- FR + core ---
for (const a of FR_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- IT + reference ---
for (const a of IT_ROOTS) {
  for (const b of REFERENCE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- IT + core ---
for (const a of IT_ROOTS) {
  for (const b of CORE_ROOTS) {
    for (const tld of TLDS.slice(0, 6)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- Cross-cultural: CN + JP-style suffix ---
const JP_SUFFIXES_FOR_CN = ['atlas', 'codex', 'tome', 'trove', 'vault', 'index', 'folio'];
for (const a of CN_ROOTS) {
  for (const b of JP_SUFFIXES_FOR_CN) {
    for (const tld of TLDS.slice(0, 5)) {
      candidates.add(a + b + tld);
    }
  }
}

// --- Cross: IT/LA/GR + heritage English refs ---
const BIG_HERITAGE = ['atlas', 'codex', 'tome', 'trove', 'vault', 'folio', 'index', 'archive', 'lexicon', 'manual'];
for (const list of [LA_ROOTS, GR_ROOTS, IT_ROOTS]) {
  for (const a of list) {
    for (const b of BIG_HERITAGE) {
      for (const tld of TLDS.slice(0, 5)) {
        candidates.add(a + b + tld);
      }
    }
  }
}

// --- French luxury × color ---
const FR_COLOR_SUFFIX = ['rouge', 'bleu', 'vert', 'noir', 'blanc', 'jaune'];
for (const a of FR_ROOTS) {
  for (const b of FR_COLOR_SUFFIX) {
    for (const tld of TLDS.slice(0, 5)) {
      candidates.add(a + b + tld);
    }
  }
}

// =====================================================================
// SCORE + EXCLUDE
// =====================================================================

// Load previous exclusion list (top300 V1 + top500 V2)
let excludeSet = new Set();
for (const f of ['./domain-research/top300.txt', './domain-research/top500-v2.txt']) {
  try {
    if (existsSync(f)) {
      readFileSync(f, 'utf8').split('\n').filter(Boolean).forEach(d => excludeSet.add(d.trim()));
    }
  } catch (e) { /* ignore */ }
}

console.log(`Excluding ${excludeSet.size} domains from V1 and V2`);

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
console.log(`After filter: ${scored.length}`);
console.log(`Top: ${scored[0]?.score}, median: ${scored[Math.floor(scored.length / 2)]?.score}`);

writeFileSync(
  './domain-research/all-candidates-v3.txt',
  scored.map(s => `${String(s.score).padStart(4)} ${s.domain}`).join('\n'),
);

const top500 = scored.slice(0, 500).map(s => s.domain);
writeFileSync('./domain-research/top500-v3.txt', top500.join('\n'));

writeFileSync(
  './domain-research/top500-v3-scored.txt',
  scored.slice(0, 500).map((s, i) => `${String(i + 1).padStart(3)}. [${s.score}] ${s.domain}`).join('\n'),
);

console.log('Wrote top500-v3.txt + top500-v3-scored.txt');
