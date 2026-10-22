// Amili Kit block: cover fallback — a book cover that never shows as a broken box.
// Site-local block (colorcombinations), built on kit/product.mjs.
//
// Why: the shelf takes its covers from Open Library by ISBN. For some editions Open Library has none (in the data
// today: Pantone: The Twentieth Century in Color, Werner's Nomenclature of Colours), so the visitor saw initials in a
// grey tile, an empty space on the book's own page, and a broken-image box in the phone sticky bar. The book's own
// Amazon listing does have a photo, and the kit product script can show it live (Creators API via the site's
// /amz/items; never stored, never baked into the HTML: Amazon's licence forbids keeping product images past 24 h).
//
// Order of preference, all decided in the browser:
//   1. the cover the page already names (self-hosted or Open Library), as before;
//   2. if that fails (error, or Open Library's 1x1 "no cover" answer), the live Amazon photo for the same ASIN:
//      the <img> becomes a kit image (data-ak-pm-img) and the kit script fills it;
//   3. if Amazon has no photo either, the image is hidden and whatever the page shows behind it (the initials tile)
//      stays, exactly as before.
//
// Use (Astro):
//   import { coverFallback, COVER_FALLBACK_CSS } from "../../kit/cover-fallback.mjs";
//   <img src={coverUrl} alt=... {...coverFallback(book.amazonAsin, { missingClass: "is-missing" })} />
//   <Fragment set:html={`<style>${COVER_FALLBACK_CSS}</style>`} />
//   <script is:inline src="/kit-product.js" defer></script>   (the kit product script; guarded, repeats are harmless)
//
// opts.missingClass: the class the page already uses to hide a cover that failed (default "ak-cover-none").
// The page's own onerror/onload handlers are replaced by the ones returned here; do not set both.

import { TRANSPARENT } from './product.mjs';

const ASIN_RE = /^[A-Z0-9]{10}$/;

export function coverFallback(asin, opts = {}) {
  const a = String(asin || '').toUpperCase();
  const missing = String(opts.missingClass || 'ak-cover-none').replace(/[^a-z0-9_-]/gi, '');
  if (!ASIN_RE.test(a)) {
    // No ASIN: no live photo to fall back to; keep the plain "hide on failure" behaviour.
    return {
      onerror: `this.classList.add('${missing}')`,
      onload: `if(this.naturalWidth<10)this.classList.add('${missing}')`,
    };
  }
  const toKit = `if(!this.hasAttribute('data-ak-pm-img')){this.setAttribute('data-ak-pm-img',this.getAttribute('data-ak-cover'));this.removeAttribute('srcset');this.referrerPolicy='no-referrer';this.style.objectFit='contain';this.src='${TRANSPARENT}';if(window.akProductScan)window.akProductScan()}else this.classList.add('${missing}')`;
  return {
    'data-ak-cover': a,
    onerror: toKit,
    onload: `if(this.naturalWidth<10){if(!this.hasAttribute('data-ak-pm-img')){${toKit}}}else this.classList.remove('${missing}')`,
  };
}

// The live photo keeps its whole shape inside the cover box (Amazon photos are not always 2:3): set inline on the
// swap, so a page's own object-fit:cover cannot crop it. A kit image the API could not fill is made invisible, so the
// page's own fallback behind it (the initials tile) shows; ak-cover-none is the default missing class.
export const COVER_FALLBACK_CSS = `img[data-ak-cover].ak-pm-gone{visibility:hidden}
img[data-ak-cover].ak-cover-none{display:none}`;

export default { name: 'cover-fallback', title: 'Book cover with live Amazon photo fallback', render: coverFallback, css: COVER_FALLBACK_CSS };
