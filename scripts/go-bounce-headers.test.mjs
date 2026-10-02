// Amazon Creator University: special links must be non-indexed and non-cacheable. Every /go/ response, including the
// tokenless bounce-home branch (which never reaches Amazon), carries x-robots-tag noindex + cache-control no-store.
// Run: node --test scripts/go-bounce-headers.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
const mods = [
  ['/go/b/0300179359', '../functions/go/b/[[isbn]].js'],
  ['/go/p/B0BJ12GV85', '../functions/go/p/[[asin]].js'],
  ['/go/prime', '../functions/go/prime.js'],
];
for (const [path, file] of mods) {
  test(`${path}: tokenless bounce is headered`, async () => {
    const { onRequestGet } = await import(file);
    const res = await onRequestGet({ request: new Request(`https://colorcombinations.org${path}`), env: {}, waitUntil() {} });
    assert.equal(res.status, 302);
    assert.equal(res.headers.get('location'), 'https://colorcombinations.org/');
    assert.match(res.headers.get('x-robots-tag') || '', /noindex/);
    assert.match(res.headers.get('cache-control') || '', /no-store/);
  });
  test(`${path}: unknown shape bounce is headered`, async () => {
    const { onRequestGet } = await import(file);
    const res = await onRequestGet({ request: new Request('https://colorcombinations.org' + path.replace(/\/[^/]+$/, '/zzz-not-valid')), env: {}, waitUntil() {} });
    assert.equal(res.status, 302);
    assert.match(res.headers.get('x-robots-tag') || '', /noindex/);
    assert.match(res.headers.get('cache-control') || '', /no-store/);
  });
}
