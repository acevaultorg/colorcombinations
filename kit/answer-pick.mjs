// Amili Kit block: answer pick — the page's own answer to "which one should I buy?", with one button per answer,
// on the first screen. Site-local block (colorcombinations).
//
// Why: a comparison page that says "buy A if X, B if Y" in its first lines, but only offers the buttons after the
// whole article (on /compare/wada-vol-1-vs-vol-2/ about 4,500px further down at 375px), makes the reader who has
// already decided scroll past everything to act. Measured on this site 2026-10-22 (commit 0cd58a3): the same Amazon
// button got 16 clicks in 4 days on the first phone screen of /browse/, against 1 eight screens down on the home page.
//
// What it renders: a short list of choices. Each choice is "who it is for" (the page's own words), the product's
// title and edition note (from the site's data, never new claims), and one 44px button. A one-line affiliate
// disclosure sits right under the buttons. No prices are written here: the label is "See price on Amazon".
//
// Use (Astro):
//   import { renderAnswerPick, ANSWER_PICK_CSS } from "../../kit/answer-pick.mjs";
//   <Fragment set:html={renderAnswerPick({ label: "Pick a volume", choices: [
//     { when: "New to Wada", title: book.title, note: book.note, href: AMAZON.link(book.amazonAsin, "compare"), book: book.title },
//   ] })} />
//   <Fragment set:html={`<style>${ANSWER_PICK_CSS}</style>`} />
//
// choices[].href must be one of the site's /go/ routes (built by AMAZON.link); anything else is refused, so the
// affiliate gate, tag handling and click tracking stay exactly as they are elsewhere on the site.
// choices[].surface (optional) is written as data-surface, to tell the block's clicks apart from the page's shelf.

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const DISCLOSURE = 'Affiliate links. As an Amazon Associate we earn from qualifying purchases; your price is the same.';

// Small arrow in currentColor (opens in a new tab).
const ARROW = '<svg class="ak-ap-ic" viewBox="0 0 16 16" width="14" height="14" aria-hidden="true" focusable="false"><path d="M5 11 11 5M6 5h5v5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderAnswerPick(opts = {}) {
  const choices = Array.isArray(opts.choices) ? opts.choices : [];
  if (!choices.length) throw new Error('Amili Kit answer-pick: at least one choice is required');
  const items = choices.map((c) => {
    if (!/^\/go\/[a-z]\/[A-Z0-9]{10}(\?[a-z0-9=&_-]*)?$/i.test(String(c.href || ''))) {
      throw new Error(`Amili Kit answer-pick: href must be a /go/ route (got "${c.href}")`);
    }
    return `<li class="ak-ap-item">`
      + `<p class="ak-ap-when">${esc(c.when)}</p>`
      + `<p class="ak-ap-title">${esc(c.title)}</p>`
      + (c.note ? `<p class="ak-ap-note">${esc(c.note)}</p>` : '')
      + `<a class="ak-ap-btn" href="${esc(c.href)}" rel="sponsored nofollow noopener" target="_blank" data-event="amazon_click" data-book="${esc(c.book || c.title)}"`
      + (c.surface ? ` data-surface="${esc(c.surface)}"` : '')
      + ` aria-label="${esc(c.title)}: see price on Amazon (opens in a new tab)">See price on Amazon ${ARROW}</a>`
      + `</li>`;
  }).join('');
  return `<div class="ak-ap"${opts.label ? ` role="group" aria-label="${esc(opts.label)}"` : ''}>`
    + `<ul class="ak-ap-list" role="list">${items}</ul>`
    + `<p class="ak-ap-disc">${esc(opts.disclosure || DISCLOSURE)}</p>`
    + `</div>`;
}

export const ANSWER_PICK_CSS = `.ak-ap{margin:1.5rem 0 0;max-width:46rem}
.ak-ap-list{list-style:none;margin:0;padding:0;display:grid;gap:.75rem;grid-template-columns:1fr}
@media (min-width:640px){.ak-ap-list{grid-template-columns:repeat(2,minmax(0,1fr))}}
.ak-ap-item{display:flex;flex-direction:column;gap:.25rem;padding:1rem 1.1rem;border:1px solid color-mix(in srgb,currentColor 16%,transparent);border-radius:12px;background:color-mix(in srgb,currentColor 3%,transparent)}
.ak-ap-when{margin:0;font-size:.75rem;letter-spacing:.08em;text-transform:uppercase;opacity:.7}
.ak-ap-title{margin:0;font-weight:600;line-height:1.3}
.ak-ap-note{margin:0;font-size:.875rem;line-height:1.45;opacity:.8}
.ak-ap-btn{margin-top:auto;align-self:stretch;display:inline-flex;align-items:center;justify-content:center;gap:.4rem;min-height:44px;padding:.6rem 1rem;border:1px solid currentColor;border-radius:999px;color:inherit;font-weight:600;font-size:.9375rem;line-height:1.2;text-decoration:none;text-align:center;box-sizing:border-box}
.ak-ap-item p:last-of-type{margin-bottom:.5rem}
.ak-ap-btn:hover{background:color-mix(in srgb,currentColor 8%,transparent)}
.ak-ap-btn:focus-visible{outline:2px solid currentColor;outline-offset:2px}
.ak-ap-ic{flex:0 0 auto}
.ak-ap-disc{margin:.6rem 0 0;font-size:.8rem;opacity:.75}`;

export default { name: 'answer-pick', title: 'Answer pick (decision + button on the first screen)', render: renderAnswerPick, css: ANSWER_PICK_CSS };
