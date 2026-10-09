/* 2026-09-28 (card muksgphls3y3tw) — p= FALLBACK. The ?c= class rides only on links built by
   AMAZON.link(); /go/prime (PRIME_BOUNTY.url) has no ?c=, so its 1,448 links (one per page) sent
   the beacon with no p=. Money-path hrefs stay byte-identical: when the href carries no valid c,
   p falls back to the fleet convention — first path segment, "home" for /, "other" if it fails
   the same format test. Enforced at deploy by scripts/amazon-tracking-guard.mjs. */
/* 2026-09-27: carry the three hub shelf labels into the existing page-class
   dimension. Keep historical f=book/tool/prime/sticky unchanged. These are raw
   per-class clicks; the fleet stores bot classification separately, not jointly.
   ~~Whitelisted /^hub-(tools|paintings|learn)$/.~~ (SUPERSEDED 2026-09-28 — that
   enumeration carried p= on 24 of this site's 43,527 affiliate links, 0.055%,
   because the three hub index pages hold 8 links each while the real surfaces are
   c=colors-that-go-with (24,948 links / 756 pages), c=color (6,732), c=art-supplies
   (3,612), c=palette-destination (2,268) — 43 distinct classes in dist/, measured
   2026-09-28 over 2,189 built HTML files. So `page_class` in GA4 and `p=` on the
   first-party beacon were both dark for 99.945% of clicks, which is the same
   "no per-page split" the fleet feed still flags for this site. Replaced with a
   FORMAT test, which is this file's own hard-won doctrine three paragraphs down:
   enumeration of /go/ shapes failed three times here (2026-08-11, 2026-08-26,
   2026-09-02) before isGo became structural, and the note ends "do not go back to
   enumerating". A format test covers all 43 classes today and any class shipped
   later with no edit here, while still refusing anything malformed — uppercase, a
   dot, a slash, whitespace, an empty value, or over 40 chars. Cardinality stays
   bounded by the template set, and the value is still encodeURIComponent'd.) */
/* Amazon/Audible affiliate-click measurement — global capture-phase delegated listener.
   Fleet dual-sink standard (retrofit 2026-07-19): on any Amazon/Audible link click fires
   Clarity amazon_click + GA4 amazon_click (the fleet metrics dashboard reads GA4) + the
   fleet first-party beacon navigator.sendBeacon('fleet /c?s=colorcombinations.org&f=<shelf>') — the
   canonical un-suppressed daily Amazon-click counter the metrics layer reads for
   conversions_30d (Amazon's own report hides low-volume tags; this is the live truth) —
   (Plausible removed 2026-07-30; subscription lapsed 2026-06-28). Also counts middle-click
   (auxclick button 1, which navigates). Compliance-safe: listens only; never alters any
   href/rel/tag/disclosure.

   2026-08-11 — EU geo-routing shipped, and it MOVED the thing this file matches on.
   Book links no longer carry an amazon.com href; they now point at our own
   /go/b/{isbn10} redirect (functions/go/b/[[isbn]].js) so EU visitors can be sent to
   amazon.de. The old href test was /amazon\.|amzn\.to|amzn\.eu/, which a same-origin
   /go/b/ URL does not match — leaving it alone would have silently stopped counting
   clicks on 11 of this site's 17 affiliate targets, including every one of its top
   converters. That is the exact failure mode that already cost this site a month of
   measurement (see public/_headers: the connect-src omission that made a 14.5%
   converter read as 0.1%). So /go/b/ is matched explicitly below, and the ISBN is
   extracted from it as the asin so GA4 event shape is unchanged.

   2026-08-14 — GESTURE TOKEN. This file now also MINTS the credential the /go/ gate
   requires: a short-lived first-party cc_g cookie, written synchronously in this
   capture-phase handler before the navigation starts (SameSite=Lax so it rides along
   on top-level navigations including middle-click new tabs). functions/go/b/[[isbn]].js
   302s to Amazon only when that cookie — or a fresh ?t= the interstitial self-mints —
   is present. It replaces a Referer check, which was the wrong credential: the
   click-harvester is JS-blind but SPOOFS Referer headers, so it walked straight through
   the old gate and generated tagged clicks against the FLEET-SHARED Associates account.
   A JS-blind crawler cannot mint this. Ported from readstacks (commit 73196a4).
   If this file ever stops loading, /go/ links degrade to the interstitial hop — they
   still work, they just cost one extra round-trip. Do not "optimise" the cookie away.

   2026-08-15 — &ascsubtag= per-page-class measurement shipped (src/config/monetization.ts
   AMAZON.link()). For /go/b/{isbn} links the page class rides as ?c=<slug> so the isGo
   test below can no longer anchor on the ISBN being the END of the string — it now
   allows an optional ?query or #hash after it. Getting this wrong silently drops every
   click on every ISBN-routed link back to 0, which is worse than shipping no subtag at
   all (the click still happened; only the count would go dark). If you touch isGo again,
   test it against a real /go/b/{isbn}?c=palette href before shipping.
   2026-08-16 — the beacon now sends &f=<shelf>. It always COMPUTED `shelf`
   (tool|book) and forwarded it to Clarity and GA4, but dropped it from the
   first-party beacon, so all ~177 Amazon clicks/30d arrived at the fleet
   endpoint unattributed. This site is the fleet's #2 earner by click volume,
   so "which surface earns" was unanswerable on the second-largest sample we
   have. One param closes that. Falls back to 'untagged' (fleet convention)
   rather than omitting the key, so the field is always present and countable.

   2026-09-02 — THE SAME BUG, SECOND TIME, 15 DAYS LATER. The 2026-08-11 note
   above says it plainly: geo-routing "MOVED the thing this file matches on".
   On 2026-08-26 the NON-BOOK ASINs moved the same way — every ART_SUPPLIES
   link stopped being an amazon.com href and became /go/p/{asin} (see
   AMAZON.link() in src/config/monetization.ts). This file was not updated, so
   the guard below dropped every one of them before any sink fired: no Clarity
   event, no GA4 event, no first-party beacon. Dark for 7 days across every
   template that renders PaintThisPalette (palettes/[slug], colors/[slug],
   collections/[slug], colors-that-go-with/*, paintings/[slug], index, browse,
   shop, gift-guide, learn/why-painting-colours-shift) — 4 links on a single
   palette page, verified live 2026-09-02.

   2026-09-05 — SYNTHETIC-CLICK GAP CLOSED. This file's mint (`document.cookie=
   'cc_g='+...`) and analytics (Clarity/GA4/beacon) both lived inside the same
   `t(e)` capture-phase click handler, with no check that `e` was a REAL user
   gesture. A `.click()` or `dispatchEvent(new MouseEvent('click'))` call —
   trivial from any script running in a full browser context (a headless
   crawler, a browser extension, injected page JS) — fires this handler
   exactly like a human click: mints a fresh cc_g cookie, then a normal
   `location.href=` navigation to /go/b/{isbn} sends genuine Sec-Fetch-Mode:
   navigate + Sec-Fetch-Site:same-origin headers (real browser navigation,
   not fakeable the way a bare HTTP client's headers are) — passing BOTH
   halves of the gate with zero human involved. Same failure class already
   closed on dormbyschool (eef1392d) and documented on readstacks/fitmylens:
   `isTrusted` is a browser-enforced, read-only property — `true` only for
   events the browser itself dispatched from real input, `false` for any
   script-dispatched event, and JS cannot forge it. One check at the top of
   `t(e)` closes both halves at once (the mint AND the fabricated analytics
   event) since they share the same handler here.

   What it cost: `amazon_clicks_by_position_30d` read {book:107, tool:2}, which
   reads exactly like "the art-supply shelf does not convert" and is instead
   "the art-supply shelf is not counted". That is the more expensive kind of
   wrong — it argues for REMOVING the one surface built to raise basket size
   ($21 avg item is this site's binding constraint, not CTA rate: 425 clicks →
   42 orders → 9.88% is already the fleet's best conversion).

   Fix is /go/[bp]/ rather than /go/b/. Kept narrow deliberately: the only
   other route is /go/prime, which has no 10-char segment, so a wider
   /go/[a-z]+/ would buy nothing and risk matching a future non-affiliate
   route.

   ...and then the THIRD instance turned up in the same pass: PRIME_BOUNTY.url
   is "/go/prime", which has no 10-char segment, so an enumerated /go/[bp]/
   pattern drops it too. `amazon_bounty_clicks_30d: 0` is therefore also
   "not counted", not "not clicked".

   So this is no longer patched by enumeration. `isGo` is now the STRUCTURAL
   test — same-origin AND pathname starts with /go/ — which is by construction
   the affiliate-gate prefix on this site (functions/go/b, /go/p, /go/prime are
   its only inhabitants; see rules/affiliate-link-gate.md). It is the exact same
   boolean the gesture cookie already needed, so the two are now computed ONCE
   and cannot drift apart again. A fourth /go/ product shape counts on the day
   it ships, with no edit here.

   The trade this makes, stated plainly: a future NON-affiliate /go/ route would
   be counted as an Amazon click. That failure is loud (clicks appear on a
   surface that has none) and there is no such route. The failure it replaces is
   silent, has now happened twice, and the second time produced a metric that
   argued for deleting a working surface. Prefer the loud one. If you ever add a
   non-affiliate /go/ route, exclude it here explicitly — do not go back to
   enumerating the affiliate ones. */
(function(){var B='https://fleet.promptprio.com/c?s=colorcombinations.org';function t(e){try{if(!e.isTrusted)return;var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.href||'';var isGo=false;try{isGo=a.host===location.host&&!!a.pathname&&a.pathname.indexOf('/go/')===0;if(isGo){document.cookie='cc_g='+Date.now().toString(36)+'; Path=/; Max-Age=600; SameSite=Lax; Secure';}}catch(g){}if(!isGo&&!/amazon\.|amzn\.to|amzn\.eu/i.test(h))return;var m=null;try{m=new URL(h,location.href).pathname.match(/\/(?:dp|gp\/product|gp\/aw\/d|go\/[bp])\/([A-Z0-9]{10})(?=\/|$)/i);}catch(ignore){}var asin=m?m[1].toUpperCase():'';var pageClass='';try{var c=new URL(h,location.href).searchParams.get('c');if(/^[a-z0-9][a-z0-9-]{0,39}$/.test(c||''))pageClass=c;}catch(ignore){}if(!pageClass){var sg=(location.pathname.split('/')[1]||'home').toLowerCase();pageClass=/^[a-z0-9][a-z0-9-]{0,39}$/.test(sg)?sg:'other';}var dest=/amzn\.to|audible/i.test(h)?'audible':'amazon';var shelf=a.dataset.from==='prime-bounty'?'prime':(a.dataset.from==='sticky-bar'?'sticky':(a.dataset.tool?'tool':(a.dataset.book?'book':'')));if(window.clarity){window.clarity('event','amazon_click');if(shelf){window.clarity('event','amazon_click_'+shelf);window.clarity('set','amazon_shelf',shelf);}}if(window.gtag)window.gtag('event','amazon_click',{page:location.pathname,asin:asin,dest:dest,shelf:shelf,page_class:pageClass});if(navigator.sendBeacon)navigator.sendBeacon(B+'&f='+encodeURIComponent(shelf||'untagged')+(pageClass?'&p='+encodeURIComponent(pageClass):'')+(asin?'&i='+encodeURIComponent(asin):'')+(window.__FLEET_AGENT__?'&a=1':''));}catch(x){}}document.addEventListener('click',t,true);document.addEventListener('auxclick',function(e){if(e.button===1)t(e);},true);})();
