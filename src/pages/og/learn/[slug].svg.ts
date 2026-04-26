/**
 * Per-pillar OG image endpoint — /og/learn/[slug].svg
 *
 * Generates an article-shaped 1200x630 SVG per /learn pillar. Used by
 * Twitter, LinkedIn, Facebook, Discord, Slack, Pinterest as the Open
 * Graph preview when a pillar URL is shared.
 *
 * Different from /og/collections/[slug].svg: pillar OG says
 * "Working guide" + article title + brief blurb + tradition-accent
 * swatch strip. No palette grid.
 */

import type { APIRoute } from "astro";

interface PillarSpec {
  slug: string;
  title: string;
  subtitle: string;
  blurb: string;
  /** Tradition-accent palette: 4 swatches that read as the article's tradition. */
  swatches: [string, string, string, string];
}

const PILLARS: ReadonlyArray<PillarSpec> = [
  {
    slug: "heian-court-color-theory",
    title: "Heian Court Color Theory",
    subtitle: "Kasane, kinjiki, the seasonal palette",
    blurb:
      "How the Heian imperial court systematised colour into layered-robe combinations, forbidden pigments, and a 12-month seasonal calendar.",
    swatches: ["#9A2A2A", "#1B2A4E", "#5C2D5C", "#D4AF37"],
  },
  {
    slug: "japanese-reds",
    title: "The Four Reds",
    subtitle: "Kurenai, Akane, Shu, Entan",
    blurb:
      "Why Japanese tradition distinguishes safflower crimson from madder from vermilion from lead red.",
    swatches: ["#9A2A2A", "#C04B3A", "#D9523B", "#7C2A1F"],
  },
  {
    slug: "wabi-sabi-color-theory",
    title: "Wabi-Sabi Color Theory",
    subtitle: "The beauty of things that have aged",
    blurb:
      "What it means for color when a tradition values age over newness, asymmetry over balance, imperfection over polish.",
    swatches: ["#7E6B4E", "#3F3A2D", "#1B1814", "#F1ECDF"],
  },
  {
    slug: "japandi-color-theory",
    title: "Japandi Color Theory",
    subtitle: "Where restraint meets light",
    blurb:
      "How Japanese and Scandinavian traditions converge — and which palettes from the Wada dictionary actually fit the brief.",
    swatches: ["#A8B2A6", "#E8E2D2", "#5C4F3E", "#3F4F5E"],
  },
  {
    slug: "scandinavian-color-theory",
    title: "Scandinavian Color Theory",
    subtitle: "Beyond IKEA-white",
    blurb:
      "What Scandinavian color tradition actually is — Nordic modernism, the hygge divergence, and three palettes from the dictionary that fit.",
    swatches: ["#F4EEE0", "#A8B5C2", "#3F5874", "#C2774E"],
  },
  {
    slug: "japanese-color-glossary",
    title: "Japanese Color Glossary",
    subtitle: "20 traditional named colours, anchored",
    blurb:
      "Kurenai, akane, ai, murasaki, seiji, gofun, tobi, sumi, yamabuki, kon and more — pigment origin, cultural register, and modern usage.",
    swatches: ["#9A2A2A", "#1B2A4E", "#5C2D5C", "#A8B2A6"],
  },
];

export function getStaticPaths() {
  return PILLARS.map((p) => ({ params: { slug: p.slug } }));
}

/** XML-safe string escape for use in SVG text nodes. */
function esc(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/** Word-wrap text into lines bounded by approximate character width. */
function wrapLines(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let current = "";
  for (const w of words) {
    if ((current + (current ? " " : "") + w).length > maxChars) {
      if (current) lines.push(current);
      current = w;
    } else {
      current = current ? `${current} ${w}` : w;
    }
  }
  if (current) lines.push(current);
  return lines;
}

export const GET: APIRoute = ({ params }) => {
  const slug = params.slug ?? "";
  const pillar = PILLARS.find((p) => p.slug === slug);
  if (!pillar) {
    return new Response("Not found", { status: 404 });
  }

  const W = 1200;
  const H = 630;
  const MARGIN_X = 80;

  // Wrap blurb at ~52 chars
  const blurbLines = wrapLines(pillar.blurb, 52).slice(0, 3);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="#FAF7EF"/>

  <!-- Brand mark + wordmark -->
  <g transform="translate(${MARGIN_X}, 64)">
    <rect x="0" y="-14" width="14" height="14" fill="#9A2A2A"/>
    <rect x="16" y="-14" width="14" height="14" fill="#1B2A4E"/>
    <rect x="32" y="-14" width="14" height="14" fill="#F4EEE0" stroke="#d9d6ce" stroke-width="0.5"/>
    <text x="58" y="0" font-family="EB Garamond, Garamond, serif" font-size="18" fill="#141414">The Dictionary of Color Combinations</text>
  </g>

  <!-- Eyebrow -->
  <text x="${MARGIN_X}" y="160" font-family="Inter, sans-serif" font-size="14" fill="#9A2A2A" letter-spacing="0.14em">WORKING GUIDE  ·  COLOR THEORY</text>

  <!-- Title -->
  <text x="${MARGIN_X}" y="248" font-family="EB Garamond, Garamond, serif" font-size="76" font-weight="500" fill="#141414">${esc(pillar.title)}</text>

  <!-- Subtitle -->
  <text x="${MARGIN_X}" y="300" font-family="EB Garamond, Garamond, serif" font-size="32" font-style="italic" fill="#5a5a5a">${esc(pillar.subtitle)}</text>

  <!-- Blurb (up to 3 lines) -->
  ${blurbLines
    .map(
      (line, i) =>
        `<text x="${MARGIN_X}" y="${380 + i * 36}" font-family="EB Garamond, Garamond, serif" font-size="24" fill="#3a3a3a">${esc(line)}</text>`
    )
    .join("\n  ")}

  <!-- Tradition swatch strip (bottom-aligned) -->
  <g transform="translate(${MARGIN_X}, 510)">
    ${pillar.swatches
      .map(
        (hex, i) =>
          `<rect x="${i * 130}" y="0" width="120" height="60" fill="${hex}" rx="2"/>`
      )
      .join("\n    ")}
  </g>

  <!-- URL footer -->
  <text x="${W - MARGIN_X}" y="595" text-anchor="end" font-family="Inter, sans-serif" font-size="12" fill="#8a8a8a" letter-spacing="0.08em">colorcombinations.org/learn/${esc(pillar.slug)}</text>
</svg>`;

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      // Stable per-pillar — long cache OK; bumped when SSG rebuilds
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
};
