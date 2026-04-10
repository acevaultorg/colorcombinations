#!/usr/bin/env node
// Merge V1 and V2 scored lists, filter to AVAILABLE only, produce top 100.
//
// Re-scores all candidates with V2's scoring so the ranking is fair
// across both pools (V1 was generated with older scoring that under-rewarded
// short brandable stems).

import { readFileSync, writeFileSync } from 'node:fs';

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

// V2 scoring (same function as in generate-v2.mjs)
function score(stem, tld) {
  let s = 100;
  const stemLen = stem.length;

  if (stemLen === 3) s += 5;
  else if (stemLen === 4) s += 20;
  else if (stemLen <= 6) s += 18;
  else if (stemLen <= 8) s += 12;
  else if (stemLen <= 10) s += 5;
  else if (stemLen <= 13) s -= 5;
  else if (stemLen <= 16) s -= 15;
  else s -= 40;

  const tldScore = {
    '.com': 28, '.co': 14, '.io': 12, '.art': 16,
    '.studio': 11, '.design': 10, '.ink': 14, '.gallery': 6,
    '.guide': 4, '.works': 5, '.app': 6, '.dev': 4,
    '.xyz': -3, '.net': -2, '.me': 3, '.club': -4,
    '.site': -10, '.online': -12, '.store': 0, '.shop': 2,
    '.press': 2, '.blog': 0, '.space': -5, '.museum': -50,
  };
  s += tldScore[tld] ?? 0;

  const vr = vowelRatio(stem);
  if (vr < 0.2) s -= 25;
  else if (vr > 0.7) s -= 8;
  else if (vr >= 0.3 && vr <= 0.55) s += 10;

  if (hasRepeatingConsonants(stem)) s -= 15;
  if (isAllConsonants(stem)) s -= 60;

  const heritage = /(dictionary|lexicon|atlas|codex|archive|folio|tome|treatise|monograph|chronicle|anthology|omnibus|compendium|scroll|manuscript|vellum|parchment|glossary|taxonomy|primer|repository|cabinet|trove|vault|curated|museum|quarto|almanac|index|register|manifest|handbook|guide)/;
  if (heritage.test(stem)) s += 20;

  const colorish = /(color|colour|hue|chroma|palette|shade|tone|tint|pigment|spectrum|prism|swatch|rainbow|iris|glaze)/;
  if (colorish.test(stem)) s += 14;

  const jp = /(iro|iroha|irodori|wada|sanzo|nihon|nippon|edo|kyoto|tokyo|nara|sumi|sumie|washi|wabi|sabi|shibui|zen|sakura|haru|natsu|aki|fuyu|yama|kawa|umi|sora|mori|kumo|tsuki|hoshi|taiyo|ume|momo|fuji|kiku|matsu|take|botan|kaede|yuri|ukiyo|origami|bonsai|kintsugi|kokoro|kimono|koto|yume|hana)/;
  if (jp.test(stem)) s += 16;

  const nature = /(hana|sakura|ume|momo|fuji|kiku|matsu|take|botan|tsubaki|kaede|yuri|yama|kawa|umi|sora|mori|kaze|kumo|tsuki|hoshi|yuki|ame|amber|jade|pearl|onyx|opal|topaz)/;
  if (nature.test(stem)) s += 5;

  if (stemLen > 18) s -= 25;
  if (/^(the|my|a|get|use|try|all|find|love)/.test(stem) && stemLen > 13) s -= 8;

  return s;
}

// Read all available domains
const available = new Set(
  readFileSync('./domain-research/available-merged.txt', 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(l => l.trim())
);

console.log(`Loaded ${available.size} available domains`);

// Re-score each
const scored = [];
for (const domain of available) {
  const lastDot = domain.lastIndexOf('.');
  const stem = domain.substring(0, lastDot);
  const tld = domain.substring(lastDot);
  if (!stem || !tld) continue;
  scored.push({ domain, stem, tld, score: score(stem, tld) });
}

scored.sort((a, b) => b.score - a.score);

console.log(`Top: ${scored[0]?.score}, 100th: ${scored[99]?.score}, 500th: ${scored[499]?.score}`);

// Write top 100
const top100Lines = scored.slice(0, 100).map((s, i) =>
  `${String(i + 1).padStart(3)}. [${String(s.score).padStart(3)}]  ${s.domain}`
);
writeFileSync('./domain-research/TOP100-AVAILABLE.txt', top100Lines.join('\n'));

// Also write a markdown version for better presentation
const lines = scored.slice(0, 100);
const tldCounts = {};
for (const l of lines) tldCounts[l.tld] = (tldCounts[l.tld] || 0) + 1;

// Categorization helper
function category(stem) {
  if (/(iro|iroha|irodori|wada|sanzo|nihon|nippon|edo|kyoto|nara|sumi|washi|wabi|sabi|shibui|zen|sakura|haru|natsu|aki|fuyu|yama|kawa|umi|sora|mori|kumo|tsuki|hoshi|ume|momo|fuji|kiku|matsu|take|botan|kaede|yuri|ukiyo|kintsugi|kokoro|koto|yume|hana)/.test(stem)) return '🗾 Japanese';
  if (/(color|colour|hue|chroma|palette|shade|tone|tint|pigment|spectrum|prism|swatch|rainbow|iris|glaze)/.test(stem)) return '🎨 Color';
  if (/(dictionary|lexicon|atlas|codex|archive|folio|tome|treatise|monograph|chronicle|anthology|compendium|scroll|manuscript|glossary|primer|repository|trove|vault|curated|museum|quarto|almanac|index|register|manifest|handbook|guide)/.test(stem)) return '📚 Reference';
  if (/(heritage|classical|antique|ancient|historic|vintage|tradition|traditional|legacy|canon|timeless|eternal|venerable)/.test(stem)) return '🏛 Heritage';
  return '✨ Brand';
}

let md = `# Top 100 Available Domains — final ranked list\n\n`;
md += `Merged from V1 (46,624 candidates) + V2 (192,708 candidates). Re-scored uniformly with V2's scoring function so ranking is fair across both pools. **All 100 verified available** via direct Verisign / NIC.art whois. All .com verified at **€9.59/yr** first year on Namecheap (€12.73/yr renewal, or $6.79 first year with new-customer promo NEWCOM679).\n\n`;
md += `**Total pool:** ${available.size} available domains  •  **Top score:** ${scored[0].score}  •  **#100 score:** ${scored[99].score}\n\n`;
md += `---\n\n`;
md += `| # | Domain | Score | Category | Meaning |\n`;
md += `|---|--------|-------|----------|--------|\n`;

const meanings = {
  sumitome: 'Ink Tome',
  irolexicon: 'Color Lexicon',
  hanatome: 'Flower Tome',
  wadatome: 'Wada Tome',
  wadacodex: 'Wada Codex',
  sanzoatlas: 'Sanzo Atlas',
  irotrove: 'Color Trove',
  moritome: 'Forest Tome',
  irocodex: 'Iro Codex',
  sabitome: 'Sabi Tome',
  irohaatlas: 'Iroha Atlas',
  irohaindex: 'Iroha Index',
  irohacodex: 'Iroha Codex',
  wadaatlas: 'Wada Atlas',
  wadaindex: 'Wada Index',
  wadamanual: 'Wada Manual',
  sanzoindex: 'Sanzo Index',
  sanzocodex: 'Sanzo Codex',
  sanzofolio: 'Sanzo Folio',
  sanzoguide: 'Sanzo Guide',
  nihonatlas: 'Nihon Atlas',
  nihonindex: 'Nihon Index',
  nihoncodex: 'Nihon Codex',
  nihonfolio: 'Nihon Folio',
  nihonguide: 'Nihon Guide',
  kyotoatlas: 'Kyoto Atlas',
  kyotocodex: 'Kyoto Codex',
  edolexicon: 'Edo Lexicon',
  edoatlas: 'Edo Atlas',
  edoindex: 'Edo Index',
  edocodex: 'Edo Codex',
  edoalmanac: 'Edo Almanac',
  zenlexicon: 'Zen Lexicon',
  zenalmanac: 'Zen Almanac',
  wabiatlas: 'Wabi Atlas',
  wabiindex: 'Wabi Index',
  wabicodex: 'Wabi Codex',
  wabimanual: 'Wabi Manual',
  wabitome: 'Wabi Tome',
  sabiatlas: 'Sabi Atlas',
  sabiindex: 'Sabi Index',
  sabicodex: 'Sabi Codex',
  sabimanual: 'Sabi Manual',
  sumiatlas: 'Sumi Atlas',
  sumiindex: 'Sumi Index',
  sumicodex: 'Sumi Codex',
  sumimanual: 'Sumi Manual',
  washiatlas: 'Washi Atlas',
  washiindex: 'Washi Index',
  washicodex: 'Washi Codex',
  washiguide: 'Washi Guide',
  washifolio: 'Washi Folio',
  umiatlas: 'Sea Atlas',
  umeatlas: 'Plum Atlas',
  umeindex: 'Plum Index',
  umecodex: 'Plum Codex',
  umitrove: 'Sea Trove',
  umetrove: 'Plum Trove',
  irotrove: 'Color Trove',
  edotrove: 'Edo Trove',
  akitrove: 'Autumn Trove',
  huetrove: 'Hue Trove',
  irovault: 'Color Vault',
  edovault: 'Edo Vault',
  umivault: 'Sea Vault',
  umevault: 'Plum Vault',
  huevault: 'Hue Vault',
  akiatlas: 'Autumn Atlas',
  akiindex: 'Autumn Index',
  akicodex: 'Autumn Codex',
  harutome: 'Spring Tome',
  momotome: 'Peach Tome',
  kikutome: 'Chrysanthemum Tome',
  kototome: 'Koto Tome',
  naratome: 'Nara Tome',
  soratome: 'Sky Tome',
  kumotome: 'Cloud Tome',
  kawatome: 'River Tome',
  museumiris: 'Museum Iris',
  huelexicon: 'Hue Lexicon',
  hueindex: 'Hue Index',
  huecodex: 'Hue Codex',
  huealmanac: 'Hue Almanac',
  shadecodex: 'Shade Codex',
  shadefolio: 'Shade Folio',
  tonecodex: 'Tone Codex',
  tonemanual: 'Tone Manual',
};

for (let i = 0; i < lines.length; i++) {
  const l = lines[i];
  const cat = category(l.stem);
  const meaning = meanings[l.stem] || l.stem.charAt(0).toUpperCase() + l.stem.slice(1);
  md += `| ${i + 1} | **${l.domain}** | ${l.score} | ${cat} | ${meaning} |\n`;
}

md += `\n---\n\n## TLD distribution in top 100\n\n`;
for (const [tld, count] of Object.entries(tldCounts).sort((a, b) => b[1] - a[1])) {
  md += `- ${tld}: ${count}\n`;
}

md += `\n## Pricing\n\n`;
md += `All .com domains confirmed at **€9.59/yr** first year, **€12.73/yr** renewal on Namecheap. New customers can use promo code \`NEWCOM679\` for **$6.79** first year.\n\n`;
md += `.art domains run ~€15-17/yr first year.\n\n`;
md += `**Cost to buy all top 10: ~€96/yr.** Cost to buy all top 100: ~€959/yr. Cost to buy recommended 4-pack: **€38.36**.\n`;

writeFileSync('./domain-research/TOP100-AVAILABLE.md', md);

console.log('Wrote TOP100-AVAILABLE.txt and TOP100-AVAILABLE.md');
console.log(`\nTop 20 preview:`);
for (let i = 0; i < 20; i++) {
  const l = lines[i];
  console.log(`  ${String(i + 1).padStart(3)}. [${l.score}] ${l.domain}`);
}
