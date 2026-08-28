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

  const dest = "Amazon";

  // --- gesture-token gate (mirror of functions/go/b/[[isbn]].js) ------------
  // A referer check is the WRONG credential: the harvester spoofs Referer but
  // is JS-blind. This requires a fresh base36 timestamp only page JS can mint
  // (public/amazon-track.js writes the cc_g cookie on a real click).
  const tokenFresh = (s) => {
    if (!s || !/^[0-9a-z]{6,12}$/.test(s)) return false;
    const ts = parseInt(s, 36);
    return Number.isFinite(ts) && Math.abs(Date.now() - ts) < 600000;
  };
  const tokenOk = (() => {
    const m = (request.headers.get("cookie") || "").match(
      /(?:^|;\s*)cc_g=([^;\s]+)/,
    );
    if (m && tokenFresh(m[1])) return true;
    return tokenFresh(url.searchParams.get("t"));
  })();

  // The interstitial embeds NO target URL in any encoding — there is nothing
  // to harvest from it. It re-requests THIS path with a freshly minted ?t=.
  const go = (target, dest = "Amazon") =>
    tokenOk
      ? new Response(null, {
          status: 302,
          headers: {
            location: target,
            "cache-control": "private, no-store",
            "x-robots-tag": "noindex, nofollow",
          },
        })
      : new Response(
          `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>One moment…</title></head><body style="font-family:system-ui;padding:2rem"><p>Taking you to ${dest}…</p><noscript><p>JavaScript is off — <a href="/">return to Color Combinations</a>.</p></noscript><script>var u=new URL(location.href);if(u.searchParams.has("t")){location.replace("/")}else{u.searchParams.set("t",Date.now().toString(36));location.replace(u.pathname+u.search)}</script></body></html>`,
          {
            status: 200,
            headers: {
              "content-type": "text/html; charset=utf-8",
              "cache-control": "no-store",
              "x-robots-tag": "noindex, nofollow",
            },
          },
        );

  if (/^\/go\/prime\/?$/.test(url.pathname)) {
    return go("https://www.amazon.com/amazonprime?&linkCode=ll2&tag=colorcombinations-20&linkId=ce478672978b2ae0d059c64c9d3641f5&language=en_US&ref_=as_li_ss_tl", dest);
  }

  // Unknown shape → home. Never a 404 dead-end on a money path.
  return Response.redirect(`${url.origin}/`, 302);
};
