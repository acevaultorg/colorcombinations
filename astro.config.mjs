import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import { writeFileSync, readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { AD_PROVIDER, ADSENSE_ADS_TXT_LINE } from "./src/config/adProvider.mjs";

// Ad-network swap, applied to the built output (see src/config/adProvider.mjs).
// AdSense mode: write dist/ads.txt (a static asset shadows the _redirects rule on
// Cloudflare Pages) AND remove the Mediavine /ads.txt redirect line, so a stray
// redirect can never come back if ads.txt is later deleted. Journey mode: no-op.
const adsTxtSwap = {
  name: "ads-txt-swap",
  hooks: {
    "astro:build:done": ({ dir }) => {
      if (AD_PROVIDER !== "adsense") return;
      const out = fileURLToPath(dir);
      writeFileSync(`${out}ads.txt`, `# colorcombinations.org — Google AdSense (Caslon Media)\n${ADSENSE_ADS_TXT_LINE}\n`);
      const red = `${out}_redirects`;
      if (existsSync(red)) {
        const kept = readFileSync(red, "utf8").split("\n").filter((l) => !/^\/ads\.txt\s/.test(l));
        writeFileSync(red, kept.join("\n"));
      }
    },
  },
};

// https://astro.build/config
export default defineConfig({
  site: "https://colorcombinations.org",
  integrations: [
    adsTxtSwap,
    mdx(),
    sitemap({
      // /embed/* routes are noindex iframe widgets, not discovery surfaces.
      // Exclude from sitemap to avoid GSC "Excluded by noindex" noise.
      filter: (page) => !page.includes("/embed/") && !page.endsWith("/pro/") && !page.endsWith("/saved/"), // /pro/ is noindex until Palette Pro launches (2026-10-03)
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  build: {
    inlineStylesheets: "auto",
  },
  trailingSlash: "always",
});
