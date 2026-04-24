import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";

// https://astro.build/config
export default defineConfig({
  site: "https://colorcombinations.org",
  integrations: [
    mdx(),
    sitemap({
      // /embed/* routes are noindex iframe widgets, not discovery surfaces.
      // Exclude from sitemap to avoid GSC "Excluded by noindex" noise.
      filter: (page) => !page.includes("/embed/"),
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
