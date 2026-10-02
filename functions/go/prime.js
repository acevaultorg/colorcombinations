// Cloudflare Pages Function — GET /go/prime
//
// Amazon Prime free-trial BOUNTY, gated. The Prime CTA was added to the palette,
// colour and painting templates with the RAW SiteStripe URL in src/config/monetization.ts,
// which put tag=colorcombinations-20 into 610 pages of built HTML. On a site whose whole
// buy path is gated, that is the one link a scraper can harvest — and an invalid-activity
// hit lands on the SHARED Associates account every earning fleet site depends on.
// Caught before deploy: live carried 0 of them outside /shop/.
//
// The target is held VERBATIM. It is SiteStripe-generated (linkCode=ll2) and therefore
// bounty-eligible; rebuilding it from parts risks losing that eligibility, so it is never
// reassembled — only ever emitted exactly as issued.
//
// The gate below is EXTRACTED VERBATIM from functions/go/p/[[asin]].js at build-authoring
// time rather than paraphrased, because this repo's own make-worker.mjs warns that two
// hand-kept copies of the same gate diverge and only one of them actually serves.
export const onRequestGet = ({ request }) => {
  const url = new URL(request.url);


  // --- gesture-token gate (mirror of functions/go/b/[[isbn]].js) ------------
  // A referer check is the WRONG credential: the harvester spoofs Referer but
  // is JS-blind. This requires a fresh base36 timestamp only page JS can mint
  // (public/amazon-track.js writes the cc_g cookie on a real click).
  const tokenFresh = (s) => {
    if (!s || !/^[0-9a-z]{6,12}$/.test(s)) return false;
    const ts = parseInt(s, 36);
    return Number.isFinite(ts) && Math.abs(Date.now() - ts) < 600000;
  };
  const navOk = (() => {
    const mode = request.headers.get("sec-fetch-mode");
    const site = request.headers.get("sec-fetch-site");
    return mode === "navigate" && (site === "same-origin" || site === "same-site");
  })();
  const tokenOk = navOk && (() => {
    const m = (request.headers.get("cookie") || "").match(
      /(?:^|;\s*)cc_g=([^;\s]+)/,
    );
    if (m && tokenFresh(m[1])) return true;
    return tokenFresh(url.searchParams.get("t"));
  })();

  // No auto-mint on GET; only navOk()+cc_g/t reaches Amazon (see
  // functions/go/b/[[isbn]].js, the source of truth for this gate, for the
  // 2026-09-04 rationale).
  const go = (target) =>
    tokenOk
      ? new Response(null, {
          status: 302,
          headers: {
            location: target,
            "cache-control": "private, no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        })
      : new Response(null, { status: 302, headers: { location: `${url.origin}/`, "cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow" } });

  if (/^\/go\/prime\/?$/.test(url.pathname)) {
    return go("https://www.amazon.com/amazonprime?&linkCode=ll2&tag=colorcombinations-20&linkId=ce478672978b2ae0d059c64c9d3641f5&language=en_US&ref_=as_li_ss_tl");
  }

  // Unknown shape → home. Never a 404 dead-end on a money path.
  return new Response(null, { status: 302, headers: { location: `${url.origin}/`, "cache-control": "private, no-store", "x-robots-tag": "noindex, nofollow" } });
};
