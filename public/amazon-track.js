/* Amazon/Audible affiliate-click measurement — global capture-phase delegated listener.
   Fleet dual-sink standard (retrofit 2026-07-19): on any Amazon/Audible link click fires
   Clarity amazon_click + GA4 amazon_click (the fleet metrics dashboard reads GA4) + the
   fleet first-party beacon navigator.sendBeacon('fleet /c?s=colorcombinations.org') — the
   canonical un-suppressed daily Amazon-click counter the metrics layer reads for
   conversions_30d (Amazon's own report hides low-volume tags; this is the live truth) —
   (Plausible removed 2026-07-30; subscription lapsed 2026-06-28). Also counts middle-click
   (auxclick button 1, which navigates). Compliance-safe: listens only; never alters any
   href/rel/tag/disclosure. */
(function(){var B='https://fleet.promptprio.com/c?s=colorcombinations.org';function t(e){try{var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.href||'';if(!/amazon\.|amzn\.to|amzn\.eu/i.test(h))return;var m=h.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/);var asin=m?m[1]:'';var dest=/amzn\.to|audible/i.test(h)?'audible':'amazon';var shelf=a.dataset.tool?'tool':(a.dataset.book?'book':'');if(window.clarity){window.clarity('event','amazon_click');if(shelf){window.clarity('event','amazon_click_'+shelf);window.clarity('set','amazon_shelf',shelf);}}if(window.gtag)window.gtag('event','amazon_click',{page:location.pathname,asin:asin,dest:dest,shelf:shelf});if(navigator.sendBeacon)navigator.sendBeacon(B);}catch(x){}}document.addEventListener('click',t,true);document.addEventListener('auxclick',function(e){if(e.button===1)t(e);},true);})();
