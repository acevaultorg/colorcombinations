/**
 * AD PROVIDER SWITCH — which display-ad network this build serves.
 *
 * Paulo, 2026-10-22 (card mvjdwp3co4xd6b): "Colorcombinations.org moet overgaan op adsense."
 *
 * "journey"  = Mediavine Journey (live since 2026-09-04). Journey script in <head>,
 *              /ads.txt 301s to the Mediavine-hosted list (public/_redirects).
 * "adsense"  = Google AdSense auto ads, publisher ca-pub-7449214764048186
 *              (the same account that serves holdlens / readinglist / readstacks).
 *              Build writes dist/ads.txt with the Google line and drops the
 *              Mediavine /ads.txt redirect from dist/_redirects (astro.config.mjs hook),
 *              so the ads.txt swap is atomic with the script swap (one deploy).
 *
 * ~~KEEP "journey" UNTIL THE SITE SHOWS "Ready" IN ADSENSE > SITES.~~ (SUPERSEDED
 * 2026-10-22 ~13:20Z by Paulo, thought mvjkhxe2tyim3e: "colorcombinations, stop met
 * mediavine en zorg dat de site 100% ready en perfect is voor adsense". He accepts the
 * gap: Journey earned ~EUR 3/week, and an unapproved site serves no AdSense ads until
 * Google approves it. Flipped to "adsense" the same day, card mvjkjummztkexr.)
 * Never run both networks: Journey's agreement grants ad exclusivity on the property.
 *
 * ADSENSE_VERIFY_META adds only <meta name="google-adsense-account">, which lets
 * AdSense verify site ownership. It serves no ads and loads no script, so it can
 * be live while Journey runs. This is how the site gets reviewed without dropping
 * Journey income during the review.
 *
 * Plain .mjs so astro.config.mjs (Node, not Vite) can import it too.
 */
/** @type {"journey" | "adsense"} */
export const AD_PROVIDER = "adsense"; // "journey" | "adsense"
export const ADSENSE_CLIENT = "ca-pub-7449214764048186";
export const ADSENSE_VERIFY_META = true;
export const ADSENSE_ADS_TXT_LINE = "google.com, pub-7449214764048186, DIRECT, f08c47fec0942fa0";
