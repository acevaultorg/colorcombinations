/* Amazon/Audible affiliate-click measurement — global capture-phase delegated listener.
   Fires Clarity amazon_click + Plausible AmazonClick on every Amazon/Audible link click.
   Compliance-safe: listens only; never alters any href/rel/tag/disclosure. */
(function(){function t(e){try{var a=e.target&&e.target.closest&&e.target.closest('a[href]');if(!a)return;var h=a.href||'';if(!/amazon\.|amzn\.to|amzn\.eu/i.test(h))return;var m=h.match(/\/(?:dp|gp\/product|gp\/aw\/d)\/([A-Z0-9]{10})/);var asin=m?m[1]:'';var dest=/amzn\.to|audible/i.test(h)?'audible':'amazon';if(window.clarity)window.clarity('event','amazon_click');if(window.plausible)window.plausible('AmazonClick',{props:{page:location.pathname,asin:asin,dest:dest}});}catch(x){}}document.addEventListener('click',t,true);})();
