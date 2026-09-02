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
(function(){var B='https://fleet.promptprio.com/c?s=colorcombinations.org';function t(e){try{var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.href||'';var isGo=false;try{isGo=a.host===location.host&&!!a.pathname&&a.pathname.indexOf('/go/')===0;if(isGo){document.cookie='cc_g='+Date.now().toString(36)+'; Path=/; Max-Age=600; SameSite=Lax; Secure';}}catch(g){}if(!isGo&&!/amazon\.|amzn\.to|amzn\.eu/i.test(h))return;var m=h.match(/\/(?:dp|gp\/product|gp\/aw\/d|go\/[bp])\/([A-Z0-9]{10})/i);var asin=m?m[1].toUpperCase():'';var dest=/amzn\.to|audible/i.test(h)?'audible':'amazon';var shelf=a.dataset.from==='prime-bounty'?'prime':(a.dataset.tool?'tool':(a.dataset.book?'book':''));if(window.clarity){window.clarity('event','amazon_click');if(shelf){window.clarity('event','amazon_click_'+shelf);window.clarity('set','amazon_shelf',shelf);}}if(window.gtag)window.gtag('event','amazon_click',{page:location.pathname,asin:asin,dest:dest,shelf:shelf});if(navigator.sendBeacon)navigator.sendBeacon(B+'&f='+encodeURIComponent(shelf||'untagged')+(window.__FLEET_AGENT__?'&a=1':''));}catch(x){}}document.addEventListener('click',t,true);document.addEventListener('auxclick',function(e){if(e.button===1)t(e);},true);})();
