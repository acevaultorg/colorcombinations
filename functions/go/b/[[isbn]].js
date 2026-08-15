// Cloudflare Pages Function — GET /go/b/{isbn10}
//
// First-party affiliate redirect for BOOKS, with EU geo-routing.
// Copy-forked from the proven readstacks pattern (public/_worker.js
// "GEO ROUTING (2026-08-10)"), adapted to this project's Pages Functions
// layout (colorcombinations runs functions/, NOT advanced-mode _worker.js —
// adding a _worker.js here would disable functions/api/subscribe.js).
//
// WHY GEO ROUTING: this site is 22-30% European (GA4 30d bot-stripped 25.2%,
// CF RUM 22.2%, Clarity 3d 51.6%), the only materially European site in the
// fleet: 73% of all fleet EU traffic lands here. So local-store routing matters
// more here than anywhere else — but only where Amazon does not already do it.
//
// ⚠️ CORRECTED 2026-08-11 — the premise this file shipped on is FALSE as of
// Amazon's GLOBAL EARNING launch (2026-08-10). It claimed "amazon.com does NOT
// geo-redirect (verified live from Amsterdam 2026-07-16)". It DOES now.
// Live-verified from Amsterdam 2026-08-11: amazon.com/dp/{isbn}?tag=<site>-20
// 302s to www.amazon.nl/dp/{isbn}?...&tag=<site>-20&ar_mt=EXACT_MATCH — the US
// -20 tag SURVIVES, the page prices in EUR with local delivery, and the ~80%
// import surcharge is gone. OneLink was likewise NOT retired; it was replaced
// by Global Earning ("existing setup will continue to work... no action needed").
//
// CONSEQUENCE — routing a Global-Earning country through .de is now WORSE:
//   • It sends FR/IT/ES/NL/PL/SE visitors to a GERMAN-language store when
//     Amazon would have sent them to their OWN local store.
//   • It DESTROYS per-site attribution: an EU sale credits caslonmedia-21 /
//     paulodevries-21 instead of colorcombinations-20. Per-tag $/click is the
//     fleet's #1 EV instrument; this blinds it for exactly the traffic this
//     site exists to monetize.
//   • It re-introduces the per-locale "3 qualifying sales / 180 days or the
//     account is CLOSED" risk the -20 Global Earning path does not carry.
// EU_ROUTED below is therefore narrowed to ONLY the EU/EEA countries Global
// Earning does NOT cover. Do not re-add DE/NL/FR/IT/ES/PL/SE.
// Canonical: memory reference_amazon_global_earning_2026_08.
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

// EU/EEA countries GLOBAL EARNING DOES NOT COVER — the only ones still worth
// routing ourselves. Global Earning natively covers US · CA · GB · DE · FR · IT ·
// ES · NL · PL · SE, so those are deliberately ABSENT: the plain .com link with
// this site's own -20 tag serves them better (own local store + attribution
// kept). GB/US/CA/CH were already excluded and stay excluded.
const EU_ROUTED = new Set([
  "AT", "BE", "LU", "PT", "IE",
  "CZ", "SK", "SI", "HU", "RO", "BG", "HR", "GR",
  "DK", "FI", "EE", "LV", "LT", "CY", "MT",
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

  // GESTURE-TOKEN GATE (2026-08-14) — replaces the 2026-08-11 referer gate,
  // which FAILED measurably on readstacks (commit 73196a4): Amazon's
  // Tracking-ID report showed 186 clicks / 0 orders in Aug 1-13 (~14.3/day vs
  // an 11.8/day pre-gate baseline) while CF logs still showed ~64 tagged
  // 302s/day on /go/*. The harvester is JS-blind — the /c beacon never fires
  // for it — but it SPOOFS Referer headers, so a referer check is exactly the
  // wrong credential. Verified on THIS site 2026-08-14 before the fix:
  //   curl -H 'Referer: https://colorcombinations.org/' /go/b/0300179359
  //   → 302 https://www.amazon.com/dp/0300179359?tag=colorcombinations-20
  // i.e. one spoofed header bought a fully-tagged click against the
  // FLEET-SHARED Associates account.
  //
  // This gate instead requires a FRESH base36 timestamp only page JS can mint:
  //   • Real on-page clicks: public/amazon-track.js writes a cc_g cookie in its
  //     capture-phase click handler (SameSite=Lax rides the navigation,
  //     including middle-click new tabs) → instant 302, fast path preserved.
  //   • Referer-less humans (pasted links): the interstitial below self-mints a
  //     fresh ?t= and re-navigates — one invisible hop, then 302.
  //   • JS-blind crawlers (spoofed UA + spoofed Referer): no cookie, no ?t=,
  //     and the interstitial no longer embeds the target URL in ANY encoding.
  //     The previous interstitial shipped atob("<base64 tagged amazon URL>") —
  //     harvestable by anyone who can call atob. There is now nothing to
  //     harvest and no tagged click occurs.
  // Freshness window 10 min; base36 keeps the token compact + unremarkable.
  // Trade-off accepted: JS-off humans lose the redirect (noscript message,
  // link home). They previously passed via referer — the exact spoofed path —
  // and are a rounding error of real traffic.
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

  // `dest` only names the destination in the interstitial copy — the gate
  // itself is identical for every affiliate network.
  // The interstitial carries NO target URL: it re-requests THIS /go/ path with
  // a freshly minted ?t=. The ?t= lives in the query string, so the pathname
  // match below is unaffected. If a ?t= was already present and still rejected
  // (stale clock, replayed URL), it goes home — no reload loop.
  const go = (target, dest = "Amazon") =>
    tokenOk
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

  // Parse from the pathname rather than params so a trailing slash, or any
  // stray extra segment, is handled identically.
  const m = url.pathname.match(/^\/go\/b\/([0-9Xx]{10})\/?$/);
  if (m && isIsbn10(m[1])) {
    const country = request.headers.get("cf-ipcountry") || "";
    const geo = EU_ROUTED.has(country)
      ? { host: "www.amazon.de", tag: EU_TAG }
      : { host: "www.amazon.com", tag: TAG };
    let dest = `https://${geo.host}/dp/${m[1].toUpperCase()}?tag=${geo.tag}`;
    // Per-page-class Amazon subtag (2026-08-15) — the caller passes it as
    // ?c=<slug> (see AMAZON.link() in src/config/monetization.ts) because the
    // real &tag= is decided HERE, server-side, per marketplace; the caller
    // can't know it yet. Re-emitted as Amazon's own &ascsubtag= param on
    // whichever marketplace this resolves to, so per-page click data
    // (Plausible/GA4/beacon) can later be joined against Amazon's own order
    // report by page class, not just by site. Whitelisted to a short slug —
    // no PII, no free text, nothing else survives into the redirect target.
    const c = url.searchParams.get("c");
    if (c && /^[a-z0-9-]{1,32}$/.test(c)) {
      dest += `&ascsubtag=${c}`;
    }
    return go(dest);
  }

  // Unknown or non-ISBN shape → home. Never a 404 dead-end on a money path,
  // and never an untagged/guessed Amazon URL.
  return Response.redirect(`${url.origin}/`, 302);
};
