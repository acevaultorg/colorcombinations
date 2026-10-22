// SITE KIT BLOCK (colorcombinations, 2026-10-22). Not vendored: this file is the canonical copy until the fleet kit
// adopts it. Builds on kit/price-cta.mjs (button label + live price slot) and kit/product.mjs (/kit-product.js fills it).
//
// Amili Kit: verdict picks — the answer to "which one should I buy?" as two or three side-by-side choices, each with
// who it is for, one line of why, an Amazon button and the live price, placed right under the short answer of a
// comparison page so the reader can act on the verdict without scrolling to the end of the page.
//
// Use (Astro): <Fragment set:html={renderVerdictPicks({ items, disclosure, btnClass })} />
//              <Fragment set:html={`<style>${VERDICT_PICKS_CSS}${PRICE_CTA_CSS}</style>`} /> once per page
//              <script is:inline src="/kit-product.js" defer></script>
// items: [{ eyebrow, title, text, href, asin, attrs: { "data-book": ..., ... }, more: { href, label } }]
//   href   the site's own tagged affiliate link (AMAZON.link / /go/ route), used as is; never built here.
//   asin   fills the live price slot (optional: no asin -> no price, label stays "See price on Amazon").
//   attrs  extra data-* attributes for the button (analytics), copied verbatim.
//   more   optional on-site link ("More about this book"), 44px tap target.
// disclosure: the affiliate disclosure shown directly under the picks (required when any href is an affiliate link).
// btnClass: the site's own button classes, so the button looks like every other button on the site.
// All visible words come from the caller. No prices, ratings or specs are written here.

import { ctaLabel, priceSlot } from './price-cta.mjs';

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const ARROW = '<svg class="ak-vp-ico" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderVerdictPicks(opts = {}) {
  const items = opts.items || [];
  if (items.length < 2 || items.length > 3) throw new Error('Amili Kit verdict-picks: 2 or 3 items');
  const btnClass = opts.btnClass ? ` ${esc(opts.btnClass)}` : '';
  const cards = items.map((it) => {
    if (!it.href || !it.title) throw new Error('Amili Kit verdict-picks: every item needs href and title');
    const attrs = Object.entries(it.attrs || {}).map(([k, v]) => {
      if (!/^data-[a-z0-9-]+$/.test(k)) throw new Error(`Amili Kit verdict-picks: only data-* attrs (got ${k})`);
      return ` ${k}="${esc(v)}"`;
    }).join('');
    return `<li class="ak-vp-item" data-ak-cta>`
      + (it.eyebrow ? `<p class="ak-vp-eyebrow">${esc(it.eyebrow)}</p>` : '')
      + `<p class="ak-vp-title">${esc(it.title)}</p>`
      + (it.text ? `<p class="ak-vp-text">${esc(it.text)}</p>` : '')
      + `<a class="ak-vp-btn${btnClass}" href="${esc(it.href)}" target="_blank" rel="sponsored nofollow noopener"${attrs}>`
      + `${ctaLabel()}<span class="ak-vp-sr">: ${esc(it.title)}</span> ${ARROW}</a>`
      + (it.asin ? priceSlot(it.asin) : '')
      + (it.more && it.more.href ? `<a class="ak-vp-more" href="${esc(it.more.href)}">${esc(it.more.label || 'More about this one')}</a>` : '')
      + `</li>`;
  }).join('');
  return `<div class="ak-vp"><ul class="ak-vp-list" role="list">${cards}</ul>`
    + (opts.disclosure ? `<p class="ak-vp-disc">${esc(opts.disclosure)}</p>` : '')
    + `</div>`;
}

export const VERDICT_PICKS_CSS = `.ak-vp{margin:1.75rem 0 0}
.ak-vp-list{list-style:none;margin:0;padding:0;display:grid;gap:12px;grid-template-columns:1fr}
@media (min-width:560px){.ak-vp-list{grid-template-columns:repeat(auto-fit,minmax(220px,1fr))}}
.ak-vp-item{display:flex;flex-direction:column;gap:6px;margin:0;padding:16px;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:12px;min-width:0}
.ak-vp-item p{margin:0}
.ak-vp-eyebrow{font-size:.75rem;letter-spacing:.06em;text-transform:uppercase;opacity:.72}
.ak-vp-title{font-weight:700;font-size:1.05rem;line-height:1.3}
.ak-vp-text{font-size:.9375rem;line-height:1.5;opacity:.85;margin-bottom:6px!important}
.ak-vp-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;min-height:44px;width:100%;margin-top:auto;box-sizing:border-box;text-align:center}
.ak-vp-ico{flex:0 0 auto}
.ak-vp-more{display:inline-flex;align-items:center;min-height:44px;font-size:.9375rem;text-decoration:underline;text-underline-offset:3px;color:inherit;align-self:flex-start}
.ak-vp-sr{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
.ak-vp-disc{margin:10px 0 0;font-size:.8125rem;line-height:1.5;opacity:.72}`;

export default { name: 'verdict-picks', title: 'Verdict picks (which one to buy, with button and live price)', render: renderVerdictPicks, css: VERDICT_PICKS_CSS };
