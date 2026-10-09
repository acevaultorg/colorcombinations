// VENDORED Amili Kit (product.mjs sha256 68a351c8cb1b) from readstacks-com/tooling/fleet-kit/product/product.mjs — do not edit here; re-vendor.
// Amili Kit: product media — the live Amazon product photo + price for ANY Amazon block on a fleet site.
// Paulo 2026-10-02 (mur0b05pz2lphm "add product images, amili kit, api"; card muqqujsj68xdpx: Amazon IP License (h)
// forbids storing product images or their URLs past 24 h, so a URL baked into built HTML is a violation by construction).
// CANONICAL: VAULT-Fleet/tooling/fleet-kit/product/product.mjs. Sites vendor a copy with sync.sh (kit/product.mjs).
//
// Two ways in, one browser script (PRODUCT_JS) that fills both from the site's own /amz/items (the shared Worker
// amili-amazon-ad: Creators API, 1 h edge cache, ASINs allow-listed per site):
//   1. renderProductMedia({ asin, name }) -> kit markup for a new block: a fixed-size image box + a price line.
//   2. rewriteBakedImages(html) -> the site's OWN <img src="https://m.media-amazon.com/..."> become
//      <img data-ak-pm-img="ASIN" src="<1x1 transparent>"> (width/height/class kept, so nothing moves), when the ASIN can be
//      read from the enclosing link (/dp/ASIN, ?a=ASIN, data-asin). An image whose ASIN cannot be resolved is REMOVED
//      (never kept baked, never replaced by a fake icon) and counted, so the site lane can wire it.
// Rules the code enforces (tested): no star ratings, review counts or Prime anywhere; a price only from a live API answer
// younger than 23 h, always with its "Price as of <time>" stamp and Amazon's disclaimer; no image -> the box stays empty
// and is hidden (never a placeholder icon); images load with referrerpolicy=no-referrer and loading=lazy.
// window.akProductScan() fills blocks a site adds to the page later (a fit matcher that renders rows on a choice); blocks already handled are skipped.
// Requests are deterministic per page: the page's distinct ASINs in document order, chunks of 10 (the API maximum),
// each chunk sorted, fetched only when one of its blocks comes within 600 px of the viewport. Same page -> same URLs ->
// the Worker's edge cache answers, so a page view is not an API call.

export const MAX_AGE_MS = 23 * 3600 * 1000;
export const DISCLAIMER = 'Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon.com at the time of purchase will apply to the purchase of this product.';
export const TRANSPARENT = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const ASIN_RE = /^[A-Z0-9]{10}$/;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

// opts: { asin (required), name (alt text, our own words), size: 120 (px box), price: true }
export function renderProductMedia(opts = {}) {
  const asin = String(opts.asin || '').toUpperCase();
  if (!ASIN_RE.test(asin)) throw new Error(`Amili Kit product: a 10-character ASIN is required (got "${opts.asin}")`);
  const size = Math.max(40, Math.min(400, +opts.size || 120));
  return `<span class="ak-pm" data-ak-pm="${asin}" style="--ak-pm-s:${size}px">`
    + `<span class="ak-pm-img" data-ak-pm-box role="img" aria-label="${esc(opts.name || 'Product photo')}"></span>`
    + (opts.price === false ? '' : `<span class="ak-pm-buy" hidden><span class="ak-pm-price" data-ak-pm-price></span><span class="ak-pm-asof" data-ak-pm-asof title="${esc(DISCLAIMER)}"></span></span>`)
    + `</span>`;
}

export const PRODUCT_CSS = `.ak-pm{display:inline-flex;flex-direction:column;align-items:center;gap:4px;vertical-align:top}
.ak-pm-img{display:block;width:var(--ak-pm-s,120px);height:var(--ak-pm-s,120px);overflow:hidden}
.ak-pm-img img{width:100%;height:100%;object-fit:contain;display:block}
.ak-pm.ak-pm-noimg .ak-pm-img{display:none}
.ak-pm-buy{display:flex;flex-direction:column;align-items:center;line-height:1.2}
.ak-pm-buy[hidden]{display:none}
.ak-pm-price{font-weight:700;font-size:1.05em}
.ak-pm-asof{font-size:11px;opacity:.7}
img[data-ak-pm-img]{object-fit:contain}
img[data-ak-pm-img].ak-pm-gone{visibility:hidden}
[data-ak-pm-price-for][hidden]{display:none}`;

// ---- build side: rewrite baked Amazon image URLs ----------------------------------------------------------------
const IMG_RE = /<img\b[^>]*?\bsrc\s*=\s*(["'])(https?:)?\/\/(?:m\.media-amazon\.com|images-na\.ssl-images-amazon\.com|images-amazon\.com|ecx\.images-amazon\.com)\/[^"']*\1[^>]*>/gi;
export function asinNear(html, at) {
  // The enclosing link: the last <a ...> opened before `at` with no </a> between it and `at`.
  const before = html.slice(Math.max(0, at - 4000), at);
  const open = before.lastIndexOf('<a ');
  const close = before.lastIndexOf('</a>');
  const cand = [];
  if (open > close) cand.push(before.slice(open, before.indexOf('>', open) + 1));
  // data-asin on a nearby ancestor (block wrapper), within the same 4000 chars, nearest first
  const m = [...before.matchAll(/data-asin="([A-Z0-9]{10})"/g)].pop();
  for (const a of cand) {
    const h = (/href\s*=\s*"([^"]*)"/.exec(a) || [])[1] || '';
    const x = /\/dp\/([A-Z0-9]{10})/.exec(h) || /\/go\/p\/([A-Z0-9]{10})\b/.exec(h) || /[?&](?:a|asin)=([A-Z0-9]{10})\b/.exec(h) || /data-asin="([A-Z0-9]{10})"/.exec(a);
    if (x) return x[1];
  }
  return m ? m[1] : null;
}
export function rewriteBakedImages(html) {
  let rewritten = 0, removed = 0; const asins = new Set();
  const out = html.replace(IMG_RE, (tag, q, proto, off) => {
    // inside <script>/<noscript>/JSON? leave scripts alone: only real tags in markup are matched (IMG_RE needs "<img")
    // An ASIN written on the <img> itself (data-asin) wins: cards whose link goes to the site's own page carry no ASIN in the href.
    const a = (/\bdata-asin="([A-Z0-9]{10})"/.exec(tag) || [])[1] || asinNear(html, off);
    if (!a) { removed++; return ''; }
    rewritten++; asins.add(a);
    let t = tag.replace(/\bsrc\s*=\s*(["'])[^"']*\1/i, `src="${TRANSPARENT}" data-ak-pm-img="${a}"`).replace(/\s(srcset|data-src|data-srcset)\s*=\s*(["'])[^"']*\2/gi, '');
    if (!/\bloading\s*=/.test(t)) t = t.replace(/<img\b/i, '<img loading="lazy"');
    if (!/\breferrerpolicy\s*=/i.test(t)) t = t.replace(/<img\b/i, '<img referrerpolicy="no-referrer"');
    return t;
  });
  return { html: out, rewritten, removed, asins: [...asins] };
}

// ---- browser side ---------------------------------------------------------------------------------------------------
// Self-contained (no closures, no backticks): shipped verbatim inside PRODUCT_JS.
function akProduct(api, maxAge) {
  var els = [].slice.call(document.querySelectorAll('[data-ak-pm],img[data-ak-pm-img],[data-ak-pm-price-for]')).filter(function (e) { return !e.__ak; });
  els.forEach(function (e) { e.__ak = 1; });
  if (!els.length) return;
  var order = [], seen = {};
  els.forEach(function (e) { var a = e.getAttribute('data-ak-pm') || e.getAttribute('data-ak-pm-img') || e.getAttribute('data-ak-pm-price-for'); e.__a = a; if (a && !seen[a]) { seen[a] = 1; order.push(a); } });
  var chunks = [], byA = {};
  for (var i = 0; i < order.length; i += 10) { var c = { ids: order.slice(i, i + 10).sort(), els: [], done: 0 }; chunks.push(c); c.ids.forEach(function (a) { byA[a] = c; }); }
  els.forEach(function (e) { byA[e.__a].els.push(e); });
  function fmt(iso) { var d = new Date(iso); return d.toLocaleString([], { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }); }
  function apply(c, j) {
    var ok = j && j.ok && j.asOf && Date.now() - Date.parse(j.asOf) <= maxAge, items = (ok && j.items) || {};
    c.els.forEach(function (e) {
      var it = items[e.__a];
      if (e.tagName === 'IMG') {
        if (it && it.img) { e.referrerPolicy = 'no-referrer'; e.src = it.img.url; if (!e.alt && it.title) e.alt = it.title; }
        else e.classList.add('ak-pm-gone');
        return;
      }
      if (e.hasAttribute('data-ak-pm-price-for')) {
        if (it && it.price) { e.textContent = it.price + ' '; var s = document.createElement('small'); s.className = 'ak-pm-asof'; s.title = 'DISCLAIMER'; s.textContent = '(as of ' + fmt(j.asOf) + ')'; e.appendChild(s); e.hidden = false; }
        else e.hidden = true;
        return;
      }
      var box = e.querySelector('[data-ak-pm-box]'), buy = e.querySelector('.ak-pm-buy');
      if (it && it.img && box) { var im = new Image(); im.alt = ''; im.decoding = 'async'; im.referrerPolicy = 'no-referrer'; im.width = it.img.w; im.height = it.img.h; im.src = it.img.url; box.textContent = ''; box.appendChild(im); }
      else e.classList.add('ak-pm-noimg');
      if (buy && it && it.price) { e.querySelector('[data-ak-pm-price]').textContent = it.price; var as = e.querySelector('[data-ak-pm-asof]'); as.textContent = 'Price as of ' + fmt(j.asOf); buy.hidden = false; }
    });
  }
  function load(c) {
    if (c.done) return; c.done = 1;
    fetch(api + '?a=' + c.ids.join(','), { credentials: 'omit' }).then(function (r) { return r.json(); }).then(function (j) { apply(c, j); }, function () { apply(c, null); });
  }
  if (!('IntersectionObserver' in window)) { chunks.forEach(load); return; }
  var io = new IntersectionObserver(function (es) { es.forEach(function (x) { if (x.isIntersecting) { io.unobserve(x.target); load(byA[x.target.__a]); } }); }, { rootMargin: '600px 0px' });
  els.forEach(function (e) { io.observe(e); });
}

export function productScript(api = '/amz/items') {
  if (!/^\/[a-z0-9/_-]+$/i.test(api)) throw new Error('Amili Kit product: api must be a same-site path');
  return '/*! Amili Kit product media. https://amili.ai/kit */\n(function(){"use strict";if(window.__akPm)return;window.__akPm=1;'
    + akProduct.toString().replace("'DISCLAIMER'", JSON.stringify(DISCLAIMER))
    + `\nfunction go(){akProduct(${JSON.stringify(api)},${MAX_AGE_MS})}window.akProductScan=go;if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();`;
}
export const PRODUCT_JS = productScript();

export default { name: 'product', title: 'Product media (live Amazon image + price)', render: renderProductMedia, css: PRODUCT_CSS, js: PRODUCT_JS };
