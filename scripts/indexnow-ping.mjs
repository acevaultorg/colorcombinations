#!/usr/bin/env node
/**
 * IndexNow ping — submit all site URLs to Bing/Yandex/IndexNow on every deploy.
 * Run: node scripts/indexnow-ping.mjs
 * Called from the deploy pipeline (package.json "deploy" script).
 *
 * Spec: https://www.indexnow.org/documentation
 * AcePilot archetype: indexnow_autoping_every_deploy × +40
 */

const HOST = "colorcombinations.org";
const KEY = "22e964fe93eb40edbc2dd78e733714d7";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";

// Build the URL list from the sitemap or enumerate known routes.
// We use a static list of high-priority URL patterns; the sitemap covers the rest.
// Full sitemap submission covers all 600+ pages — split into batches of 10k max.
const PRIORITY_URLS = [
  `https://${HOST}/`,
  `https://${HOST}/browse/`,
  `https://${HOST}/about`,
  `https://${HOST}/shop`,
  `https://${HOST}/tools/`,
  `https://${HOST}/collections/`,
  `https://${HOST}/colors/`,
  `https://${HOST}/feed.xml`,
  `https://${HOST}/sitemap-index.xml`,
];

// Read the dist sitemap to get all URLs (run after `astro build`).
import { readFileSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");

function extractUrlsFromSitemap(xmlPath) {
  if (!existsSync(xmlPath)) return [];
  const xml = readFileSync(xmlPath, "utf-8");
  const matches = xml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g);
  return [...matches].map((m) => m[1]);
}

// Collect URLs from all sitemap files in dist/
let allUrls = [...PRIORITY_URLS];

if (existsSync(distDir)) {
  // sitemap-index.xml references individual sitemaps
  const sitemapIndex = resolve(distDir, "sitemap-index.xml");
  if (existsSync(sitemapIndex)) {
    const indexXml = readFileSync(sitemapIndex, "utf-8");
    const sitemapRefs = [...indexXml.matchAll(/<loc>(https?:\/\/[^<]+)<\/loc>/g)].map((m) => m[1]);

    for (const ref of sitemapRefs) {
      // Convert URL to local path
      const localPath = resolve(distDir, ref.replace(`https://${HOST}/`, ""));
      const urls = extractUrlsFromSitemap(localPath);
      allUrls.push(...urls);
    }
  }
}

// Deduplicate
allUrls = [...new Set(allUrls)];

console.log(`[IndexNow] Submitting ${allUrls.length} URLs to ${INDEXNOW_ENDPOINT}`);

// IndexNow API accepts up to 10,000 URLs per request
const BATCH_SIZE = 10000;
const batches = [];
for (let i = 0; i < allUrls.length; i += BATCH_SIZE) {
  batches.push(allUrls.slice(i, i + BATCH_SIZE));
}

let totalSuccess = 0;
let totalFail = 0;

for (let i = 0; i < batches.length; i++) {
  const batch = batches[i];
  const body = JSON.stringify({
    host: HOST,
    key: KEY,
    keyLocation: KEY_LOCATION,
    urlList: batch,
  });

  try {
    const res = await fetch(INDEXNOW_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body,
    });

    if (res.ok || res.status === 200 || res.status === 202) {
      console.log(`[IndexNow] Batch ${i + 1}/${batches.length}: ✓ ${res.status} (${batch.length} URLs)`);
      totalSuccess += batch.length;
    } else {
      const text = await res.text().catch(() => "");
      console.warn(`[IndexNow] Batch ${i + 1}/${batches.length}: ✗ ${res.status} — ${text}`);
      totalFail += batch.length;
    }
  } catch (err) {
    console.warn(`[IndexNow] Batch ${i + 1}/${batches.length}: ✗ network error — ${err.message}`);
    totalFail += batch.length;
  }
}

console.log(`[IndexNow] Done. ${totalSuccess} submitted, ${totalFail} failed.`);
if (totalFail > 0) {
  // Non-fatal: deploy succeeds even if IndexNow is unreachable
  console.warn("[IndexNow] Some URLs failed — will retry on next deploy.");
}
