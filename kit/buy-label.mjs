// Amili Kit block: buy label — the Amazon button says "View on Amazon" when a live price is on screen next to it,
// and "See price on Amazon" when there is none. Site-local block (colorcombinations), built on kit/product.mjs.
//
// Why: the product script (kit/product.mjs) fills a live price into [data-ak-pm-price-for] slots and
// [data-ak-pm-price] boxes only when the Creators API answers within 23 h. A button that keeps saying
// "See price on Amazon" while the price already sits beside it asks the visitor to go and find something they can
// already see. The label has to follow the price, not the build.
//
// How (no JavaScript of its own; CSS :has() on the kit's own price slots):
//   - the button text is buyLabel(): two spans, the "see price" one shown by default.
//   - the element that holds both the button and its price slot carries data-ak-bl (BUY_LABEL_SCOPE).
//   - once the kit script fills a price (slot not empty, not hidden), the "view" span shows instead.
//   - no price, no JavaScript, or a browser without :has() -> "See price on Amazon" (the safe default).
//
// Use (Astro):
//   import { buyLabel, BUY_LABEL_CSS, BUY_LABEL_SCOPE } from "../../kit/buy-label.mjs";
//   <div {...BUY_LABEL_SCOPE}>
//     <a class="btn" href=...><Fragment set:html={buyLabel()} /> ↗</a>
//     <span data-ak-pm-price-for={asin}></span>
//   </div>
//   <Fragment set:html={`<style>${BUY_LABEL_CSS}</style>`} />   (once per page is enough; repeats are harmless)
//
// Rules this block keeps: it never writes a price itself and never hardcodes one; the visible words are only the two
// labels below.

export const SEE_PRICE = 'See price on Amazon';
export const VIEW = 'View on Amazon';

export const BUY_LABEL_SCOPE = { 'data-ak-bl': '' };

export function buyLabel() {
  return `<span class="ak-bl-s">${SEE_PRICE}</span><span class="ak-bl-v">${VIEW}</span>`;
}

const PRICED = '[data-ak-bl]:has([data-ak-pm-price-for]:not([hidden]):not(:empty),[data-ak-pm-price]:not(:empty))';
export const BUY_LABEL_CSS = `.ak-bl-v{display:none}
${PRICED} .ak-bl-v{display:inline}
${PRICED} .ak-bl-s{display:none}`;

export default { name: 'buy-label', title: 'Buy label (follows the live price)', render: buyLabel, css: BUY_LABEL_CSS };
