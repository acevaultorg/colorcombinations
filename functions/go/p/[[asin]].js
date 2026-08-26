// Cloudflare Pages Function — GET /go/p/{ASIN}
//
// First-party affiliate redirect for PRODUCTS (non-book ASINs). Sibling of
// functions/go/b/[[isbn]].js — same gesture-token gate, deliberately WITHOUT
// the geo-routing, for the reason that file already documents: a B-prefix ASIN
// is an Amazon-internal identifier with no guarantee the same product exists
// on amazon.de, so routing it risks a dead or wrong-product landing. Amazon's
// Global Earning (2026-08-10) geo-redirects amazon.com itself and the US -20
// tag survives, so .com is both the safe and the correct destination here.
//
// ⚠️ KEEP THE TOKEN GATE IN SYNC WITH functions/go/b/[[isbn]].js. That file is
// the source of truth for the gate; this one only changes the destination.
//
// WHY THIS EXISTS (measured 2026-08-26)
// The art-supplies links were the half of this site's affiliate surface the
// 2026-08-14 gate never covered. AMAZON.link() gated ISBN-10 only; every
// B-prefix ASIN shipped as a raw, fully-tagged amazon.com href in the HTML:
//   1,025 harvestable tagged links across 406 built pages.
//
// The evidence that they were being harvested, not clicked:
//   • Amazon reported 306 clicks on colorcombinations-20 in 30d.
//   • The first-party beacon captured 24 — book 22, tool 2 — an 8% capture
//     ratio, in the low band the fleet treats as the harvest signature.
//   • The art-supplies anchors DO carry data-tool, so public/amazon-track.js
//     buckets them as `tool`. Two human clicks in 30 days against 1,025
//     exposed links is not a measurement gap; it is the links being fetched
//     by something that never runs JS.
//   • That is the same JS-blind, referer-spoofing harvester the book gate was
//     built for in commit 73196a4 — it simply had a second door open.
//
// Those clicks land on the FLEET-SHARED Associates account. Invalid activity
// there is an account-level risk, and termination is -100% of every earning
// fleet site, not a percentage of this one's $16/mo.
export const onRequestGet = ({ request }) => {
  const url = new URL(request.url);

  const TAG = "colorcombinations-20";

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

  // Parse from the pathname so a trailing slash or stray segment behaves the
  // same. ASIN charset is Amazon's: 10 chars, uppercase alnum.
  const m = url.pathname.match(/^\/go\/p\/([A-Za-z0-9]{10})\/?$/);
  if (m) {
    let dest = `https://www.amazon.com/dp/${m[1].toUpperCase()}?tag=${TAG}`;
    // Page-class subtag, same whitelist discipline as the book gate: short
    // slug only, no PII, no free text survives into the redirect target.
    const c = url.searchParams.get("c");
    if (c && /^[a-z0-9-]{1,32}$/.test(c)) dest += `&ascsubtag=${c}`;
    return go(dest);
  }

  // Unknown shape → home. Never a 404 dead-end on a money path, and never an
  // untagged or guessed Amazon URL.
  return Response.redirect(`${url.origin}/`, 302);
};
