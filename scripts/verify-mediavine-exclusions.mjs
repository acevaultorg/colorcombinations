/**
 * Fail-closed audit for ColorCombinations' Journey full-page exclusions.
 *
 * The Journey wrapper is sitewide. Removing `.mv-content` only suppresses
 * in-content insertion; it does not suppress adhesion, interstitial, sidebar,
 * or video units. The signed-in provider portal generated this exact marker:
 *   <div id="ad-management-config-settings" data-blocklist-all="1"></div>
 *
 * Scan the rendered artifact, not just source props, so a custom layout or a
 * future route cannot make a policy-looking source change that ships no marker.
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, resolve, sep } from "node:path";

const dist = resolve("dist");
const markerId = 'id="ad-management-config-settings"';
const markerAll = 'data-blocklist-all="1"';
const markerTag = /<div\b(?=[^>]*\bid=["']ad-management-config-settings["'])(?=[^>]*\bdata-blocklist-all=["']1["'])[^>]*>/gi;
const wrapper = "scripts.scriptwrapper.com/tags/0e3765cf-7571-4481-9b28-bc96fd84b4e4.js";

const exact = new Set([
  "/404",
  "/about",
  "/contact",
  "/copyright",
  "/privacy",
  "/random",
  "/terms",
  "/gift-guide",
  "/compare/wada-vol-1-vs-vol-2",
]);
const prefixes = ["/books", "/shop"];

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}

function routeFor(file) {
  const rel = relative(dist, file).split(sep).join("/");
  if (rel === "index.html") return "/";
  if (rel === "404.html") return "/404";
  if (rel.endsWith("/index.html")) return `/${rel.slice(0, -"/index.html".length)}`;
  return `/${rel.replace(/\.html$/, "")}`;
}

function routeIsBlocked(route, html) {
  if (exact.has(route)) return true;
  if (prefixes.some((prefix) => route === prefix || route.startsWith(`${prefix}/`))) return true;
  // BaseLayout deliberately treats every noindex route as a full-page ad
  // exclusion. Standalone embed documents are also noindex, but do not load
  // the Journey wrapper (or BaseLayout) at all; requiring a provider marker in
  // those documents would be meaningless and produced hundreds of false
  // failures. Keep the check fail-closed wherever Journey is actually loaded.
  const isNoindex = (html.match(/<meta\b[^>]*>/gi) || []).some(
    (tag) => /\bname=["']robots["']/i.test(tag) && /\bcontent=["'][^"']*noindex/i.test(tag),
  );
  return isNoindex && html.includes(wrapper);
}

const htmlFiles = walk(dist).filter((file) => file.endsWith(".html"));
if (htmlFiles.length < 1500) {
  console.error(`mediavine exclusion guard: only ${htmlFiles.length} HTML files; build is incomplete`);
  process.exit(1);
}

const failures = [];
let blocked = 0;
let wrapperControls = 0;
let bookPages = 0;

for (const file of htmlFiles) {
  const route = routeFor(file);
  const html = readFileSync(file, "utf8");
  const mustBlock = routeIsBlocked(route, html);
  const idCount = html.split(markerId).length - 1;
  const allCount = html.split(markerAll).length - 1;
  const tagCount = (html.match(markerTag) || []).length;

  if (route === "/books" || route.startsWith("/books/")) bookPages++;

  if (mustBlock) {
    blocked++;
    if (idCount !== 1 || allCount !== 1 || tagCount !== 1) {
      failures.push(
        `${route}: expected one complete full-page marker, got id=${idCount}, all=${allCount}, paired=${tagCount}`,
      );
    }
  } else if (idCount !== 0 || allCount !== 0 || tagCount !== 0) {
    failures.push(`${route}: unexpected full-page marker`);
  }

  if (!mustBlock && html.includes(wrapper)) wrapperControls++;
}

if (bookPages < 10) failures.push(`positive control: only ${bookPages} rendered /books pages`);
if (wrapperControls < 1000) {
  failures.push(`positive control: only ${wrapperControls} unblocked pages retain the Journey wrapper`);
}

if (failures.length) {
  console.error("mediavine exclusion guard FAILED\n" + failures.join("\n"));
  process.exit(1);
}

console.log(
  `mediavine exclusion guard OK: ${blocked} full-page exclusions, ${bookPages} books pages, ` +
    `${wrapperControls} unblocked wrapper controls across ${htmlFiles.length} HTML files`,
);
