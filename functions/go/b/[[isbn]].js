// Cloudflare Pages Function — GET /go/b/{isbn10}
//
// First-party affiliate redirect for BOOKS, with EU geo-routing.
// Copy-forked from the proven readstacks pattern (public/_worker.js
// "GEO ROUTING (2026-08-10)"), adapted to this project's Pages Functions
// layout (colorcombinations runs functions/, NOT advanced-mode _worker.js —
// adding a _worker.js here would disable functions/api/subscribe.js).
//
// WHY GEO ROUTING: amazon.com does NOT geo-redirect (verified live from
// Amsterdam 2026-07-16). A EUR 13.03 book carries ~EUR 10.36 in import
// charges for an EU buyer — an ~80% surcharge — which is why EU clicks
// on .com almost never convert. This site is 22-30% European (GA4 30d
// bot-stripped 25.2%, CF RUM 22.2%, Clarity 3d 51.6%), the only materially
// European site in the fleet: 73% of all fleet EU traffic lands here.
//
// SCOPE — deliberately narrow, do NOT widen without evidence:
//   • ONLY ISBN-10 book links reach this route. For BOOKS the ISBN-10 *is*
//     the ASIN on every Amazon marketplace, so /dp/{isbn} resolves to the
//     same title on .de. That is the property that makes this safe, and it
//     is enforced below by a mod-11 checksum, not just a length check.
//   • Plain B-prefix ASINs are NOT routed here and stay on .com — they are
//     Amazon-internal identifiers with no cross-marketplace guarantee. That
//     covers the 5 ART_SUPPLIES items (paints, paper, pens, Pantone guide)
//     and the Seigensha Wada two-volume set B094NTK2RB, which is a book but
//     is listed under a plain ASIN, so it is NOT portable to .de.
//   • There are no Audible/bounty or non-Amazon affiliate URLs on this site
//     (verified 2026-08-11: zero amzn.to / amzn.eu / audible / MTRIAL hits
//     across src, public and dist). Nothing byte-sacred is touched here.
//
// HOW THE ROUTING WORKS: we do NOT hardcode a marketplace per country. EU
// visitors get ONE amazon.de link tagged caslonmedia-21, and Amazon's
// OneLink — configured on that store with "Similar match" across 14
// marketplaces — forwards each visitor to their own store with the correct
// local tag (NL → paulodevries-21, US → global074-20, DE → caslonmedia-21).
// Countries with no linked store stay on amazon.de, still far better than
// .com since intra-EU orders carry no import charges. Adding a marketplace
// later = link its store in PartnerNet; NO code change here.

// This site's own Associates tag — used for every non-EU visitor.
const TAG = "colorcombinations-20";

// The store OneLink runs on. EU visitors are handed this, then forwarded.
const EU_TAG = "caslonmedia-21";

// EU/EEA only. Deliberately NOT GB/US/CA/CH — sending a UK or US visitor to
// amazon.de would be worse, not better. (GB is 4.4% of this site's traffic
// and has its own marketplace; routing it to .de would add import friction.)
const EU_ROUTED = new Set([
  "DE", "AT", "NL", "BE", "LU", "FR", "IT", "ES", "PT", "IE",
  "PL", "CZ", "SK", "SI", "HU", "RO", "BG", "HR", "GR",
  "DK", "SE", "FI", "EE", "LV", "LT", "CY", "MT",
]);

/**
 * True only for a real ISBN-10: 9 digits + a check digit (0-9 or X) that
 * satisfies the mod-11 weighted sum. This is the guarantee of cross-market
 * portability — a 10-char string that merely *looks* numeric is not enough.
 */
function isIsbn10(s) {
  if (!/^[0-9]{9}[0-9Xx]$/.test(s)) return false;
  let sum = 0;
  for (let i = 0; i < 10; i++) {
    const c = s[i];
    sum += (10 - i) * (c === "X" || c === "x" ? 10 : Number(c));
  }
  return sum % 11 === 0;
}

export const onRequestGet = ({ request }) => {
  const url = new URL(request.url);

  // REFERER GATE — copied verbatim in behaviour from readstacks. A bot or
  // harvester hitting /go/* directly (no referer) gets a noindex interstitial
  // instead of a 302, so it never generates a tagged click against the
  // FLEET-SHARED Associates account. Real referer-stripped humans still land
  // on Amazon via location.replace.
  const refOk = (() => {
    const ref = request.headers.get("referer") || "";
    if (!ref) return false;
    try {
      const h = new URL(ref).hostname;
      return (
        h === "colorcombinations.org" ||
        h === "www.colorcombinations.org" ||
        h === url.hostname // covers *.pages.dev previews
      );
    } catch {
      return false;
    }
  })();

  const go = (target, dest = "Amazon") =>
    refOk
      ? new Response(null, {
          status: 302,
          headers: {
            location: target,
            // Never cache a geo decision — a cached EU redirect served to a
            // US visitor (or the reverse) would send them to the wrong store.
            "cache-control": "private, no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        })
      : new Response(
          `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>One moment…</title></head><body style="font-family:system-ui;padding:2rem"><p>Taking you to ${dest}…</p><noscript><p>JavaScript is off — <a href="/">return to Color Combinations</a>.</p></noscript><script>location.replace(atob("${btoa(target)}"))</script></body></html>`,
          {
            status: 200,
            headers: {
              "content-type": "text/html; charset=utf-8",
              "cache-control": "no-store",
              "x-robots-tag": "noindex, nofollow",
            },
          },
        );

  // Parse from the pathname rather than params so a trailing slash, or any
  // stray extra segment, is handled identically.
  const m = url.pathname.match(/^\/go\/b\/([0-9Xx]{10})\/?$/);
  if (m && isIsbn10(m[1])) {
    const country = request.headers.get("cf-ipcountry") || "";
    const geo = EU_ROUTED.has(country)
      ? { host: "www.amazon.de", tag: EU_TAG }
      : { host: "www.amazon.com", tag: TAG };
    return go(`https://${geo.host}/dp/${m[1].toUpperCase()}?tag=${geo.tag}`);
  }

  // Unknown or non-ISBN shape → home. Never a 404 dead-end on a money path,
  // and never an untagged/guessed Amazon URL.
  return Response.redirect(`${url.origin}/`, 302);
};
