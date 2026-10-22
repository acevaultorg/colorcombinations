// SITE KIT BLOCK (colorcombinations, 2026-10-22). Not vendored: this file is the canonical copy until the fleet kit
// adopts it. Pairs with kit/product.mjs (live Amazon image + price from /amz/items) and needs no script of its own.
//
// Amili Kit: price CTA — the Amazon button label that follows the live price.
// Owner rule: with a live price the button says "View on Amazon"; without one, "See price on Amazon". kit/product.mjs
// fills a price slot only from a live API answer younger than 23 h and hides it otherwise, so the label is decided in
// CSS from that slot: no extra request, no flash of a wrong label when the API is down (the default is the no-price one).
//
// Use:
//   import { ctaLabel, priceSlot, PRICE_CTA_CSS } from "kit/price-cta.mjs";
//   <div data-ak-cta>                                  <- one wrapper per product (the scope of the swap)
//     <a href=... class="btn">{ctaLabel()} ↗</a>       <- set:html; any element may hold the label
//     {priceSlot(asin)}                                 <- set:html; or a kit/product.mjs renderProductMedia() block
//   </div>
//   <style>{PRICE_CTA_CSS}</style> once per page (set:html), and /kit-product.js loaded (it fills the slot).
// The swap reacts to either price source inside the wrapper: a priceSlot() / [data-ak-pm-price-for] element that the
// product script filled, or a renderProductMedia() block whose price line it un-hid.
// priceSlot(asin, { lead }) — lead: visible words before the price (default "Amazon price:"), our own wording.

const ASIN_RE = /^[A-Z0-9]{10}$/;
const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const LABEL_NO_PRICE = 'See price on Amazon';
export const LABEL_PRICE = 'View on Amazon';

export function ctaLabel() {
  return `<span class="ak-cta-s">${LABEL_NO_PRICE}</span><span class="ak-cta-v">${LABEL_PRICE}</span>`;
}

export function priceSlot(asin, opts = {}) {
  const a = String(asin || '').toUpperCase();
  if (!ASIN_RE.test(a)) throw new Error(`Amili Kit price-cta: a 10-character ASIN is required (got "${asin}")`);
  const lead = opts.lead === undefined ? 'Amazon price:' : opts.lead;
  // Empty, never `hidden` or display:none in the markup: the product script loads a slot only when it nears the
  // viewport, and an element with no box never does. It hides the slot itself when there is no live price.
  return `<span class="ak-cta-price"${lead ? ` data-lead="${esc(lead)}"` : ''} data-ak-pm-price-for="${a}"></span>`;
}

const HAS_PRICE = '[data-ak-cta]:has([data-ak-pm-price-for]:not([hidden]):not(:empty)),[data-ak-cta]:has(.ak-pm-buy:not([hidden]))';
export const PRICE_CTA_CSS = `.ak-cta-v{display:none}
:is(${HAS_PRICE}) .ak-cta-v{display:inline}
:is(${HAS_PRICE}) .ak-cta-s{display:none}
.ak-cta-price{display:block;min-height:1px;font-weight:600}
.ak-cta-price[hidden]{display:none}
.ak-cta-price[data-lead]:not(:empty)::before{content:attr(data-lead) " ";font-weight:400;opacity:.8}
.ak-cta-price small{font-size:.8em;font-weight:400;opacity:.75;white-space:nowrap}`;

export default { name: 'price-cta', title: 'Price CTA (button label that follows the live price)', label: ctaLabel, slot: priceSlot, css: PRICE_CTA_CSS };
