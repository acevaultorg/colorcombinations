/*! Amili Kit product media. https://amili.ai/kit */
(function(){"use strict";if(window.__akPm)return;window.__akPm=1;function akProduct(api, maxAge) {
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
        if (it && it.price) { e.textContent = it.price + ' '; var s = document.createElement('small'); s.className = 'ak-pm-asof'; s.title = "Product prices and availability are accurate as of the date/time indicated and are subject to change. Any price and availability information displayed on Amazon.com at the time of purchase will apply to the purchase of this product."; s.textContent = '(as of ' + fmt(j.asOf) + ')'; e.appendChild(s); e.hidden = false; }
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
function go(){akProduct("/amz/items",82800000)}window.akProductScan=go;if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",go);else go();})();
