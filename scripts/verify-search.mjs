#!/usr/bin/env node
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// Exercise the actual inline search functions against the generated index.
// An optional index path permits an evidence read before a full site build.
const idx = JSON.parse(readFileSync(process.argv[2] || 'dist/search-index.json', 'utf8'));
const layout = readFileSync('src/layouts/BaseLayout.astro', 'utf8');
const start = layout.indexOf('      function norm(');
const end = layout.indexOf('      /* Loose fallback', start);
assert(start >= 0 && end > start, 'Search function boundaries must exist');
const context = vm.createContext({ idx });
vm.runInContext(layout.slice(start, end), context);
const results = (fn, query) => JSON.parse(vm.runInContext(
  `JSON.stringify(${fn}(${JSON.stringify(query)}).map(e => e.s))`, context));

for (const query of ['lightbrown drab & peach red', 'light brown drab and peach red']) {
  assert.equal(results('strict', query).length, 0, 'Reproduce old miss');
  assert.deepEqual(results('srch', query), ['/palettes/wada-285-light-brown-drab-burnt-sienna/']);
}
assert.deepEqual(results('srch', 'black and white'), results('strict', 'black white'));
assert(results('srch', 'black and white').length > 0);
for (const query of ['black white red', 'ochre and gold', 'lilac, yellow and teal', '東京', 'zzzxxy and qqqzzz']) {
  assert.equal(results('srch', query).length, 0, `${query}: do not invent an exact combination`);
}

// Existing successful titles, aliases, words and prefixes retain their exact
// ranking, rather than checking only the new examples.
const queries = new Set(['wada 292', 'contrast checker', 'sulphur yellow', 'blue', 'and']);
for (const entry of idx) {
  queries.add(entry.t);
  queries.add(entry.t.slice(0, 2));
  queries.add(entry.t.slice(0, 4));
  for (const word of `${entry.t} ${entry.x || ''}`.split(/\s+/)) if (word.length > 1) queries.add(word);
}
let checked = 0;
for (const query of queries) {
  const original = results('strict', query);
  if (!original.length) continue;
  assert.deepEqual(results('srch', query), original, `Existing search changed: ${query}`);
  checked++;
}
console.log(`Search PASS: 3 recovered queries, 5 genuine-miss controls, ${checked} successful-query rankings unchanged; index ${idx.length} rows.`);
