#!/usr/bin/env node
// dist/amili-index.json for the Ask Amili bar: [{title, url, text, terms}] — one entry per answer
// page, text = the page's OWN meta description (no new claims). Sections are the pages a question
// can land on; the 658 /embed/ widgets and 378 numbered /palettes/ plates are left out to keep the
// file well under the embed's ~300 KB budget. Fails the build if the file is empty or too large.
import { readdir, readFile, writeFile, stat } from 'node:fs/promises';
import path from 'node:path';
const DIST = path.resolve('dist');
const SECTIONS = ['colors-that-go-with', 'colors', 'collections', 'paintings', 'tools', 'learn', 'books', 'trends'];
const dec = (s) => String(s).replace(/&amp;/g, '&').replace(/&#39;|&#x27;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(+n)).replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)));
const out = [];
async function* walk(d) { for (const e of await readdir(d, { withFileTypes: true })) { const p = path.join(d, e.name); if (e.isDirectory()) yield* walk(p); else if (e.name === 'index.html') yield p; } }
for (const sec of SECTIONS) {
  const dir = path.join(DIST, sec);
  try { await stat(dir); } catch { continue; }
  for await (const f of walk(dir)) {
    const h = await readFile(f, 'utf8');
    if (/<meta[^>]+name=["']robots["'][^>]+noindex/i.test(h)) continue;
    const title = dec(((h.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || [])[1] || '').replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
    const desc = dec((h.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']*)["']/i) || [])[1] || '').trim();
    if (!title || !desc) continue;
    const url = '/' + path.relative(DIST, path.dirname(f)).split(path.sep).join('/') + '/';
    const slugWords = url.split('/').filter(Boolean).slice(1).join(' ').replace(/-/g, ' ');
    const terms = [...new Set([slugWords, sec.replace(/-/g, ' ')])];
    out.push({ title: title.slice(0, 120), url, text: desc.length > 140 ? desc.slice(0, 137).replace(/\s+\S*$/, '') + '…' : desc, terms });
  }
}
const Q = { navy: 'What colors go with navy?', 'sage-green': 'What colors go with sage green?', burgundy: 'What colors go with burgundy?' };
for (const e of out) { const m = e.url.match(/^\/colors-that-go-with\/([^/]+)\/$/); if (m && Q[m[1]]) e.q = Q[m[1]]; }
const json = JSON.stringify(out);
if (!out.length) { console.error('build-amili-index: 0 entries — refusing'); process.exit(1); }
if (json.length > 300 * 1024) { console.error(`build-amili-index: ${(json.length / 1024).toFixed(0)} KB > 300 KB budget — refusing`); process.exit(1); }
await writeFile(path.join(DIST, 'amili-index.json'), json);
console.log(`build-amili-index: ${out.length} entries, ${(json.length / 1024).toFixed(0)} KB, ${out.filter((e) => e.q).length} starter questions`);
