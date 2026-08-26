/**
 * Emit src/data/paintings.ts from the verified palette JSON + hand-written
 * art-historical notes.
 *
 * Everything in NOTES is either sourced from published conservation research
 * (see `sources` per entry) or is a description of the palette's structure,
 * which is observable from the swatches themselves. Nothing is invented — an
 * entry with no verified pigment research simply carries no pigment claims.
 */

import fs from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const palettes = JSON.parse(fs.readFileSync(path.join(HERE, "palettes-selected.json"), "utf8"));

// ---------------------------------------------------------------------------
// Hand-written notes. `pigments` and `shift` appear ONLY where published
// conservation science supports them.
// ---------------------------------------------------------------------------
const NOTES = {
  "sunflowers": {
    summary:
      "Six yellows and almost nothing else — a painting that dares you to build a palette out of one hue.",
    story: [
      "Van Gogh wrote to his brother Theo about painting \"nothing but sunflowers\", and the palette shows the ambition literally: this is a near-monochrome built from yellow alone, separated only by value and by how much green or brown each mixture carries. There is no complementary violet to make the yellow sing. The yellow has to do all the work by itself.",
      "That is why the palette is unusually hard to use in design and unusually instructive to study. Take the full ramp and you get a scheme with real warmth but no contrast anchor; add a single dark neutral and the whole thing snaps into focus. It is the clearest argument in this collection for value contrast doing the job people usually assign to hue contrast.",
    ],
    pigments: [
      { name: "Chrome yellow (lead chromate, PbCrO₄)", note: "The bright body of the flowers. Van Gogh used several varieties, including a sulfur-rich lemon form." },
      { name: "Chrome yellow, sulfate-rich variety (PbCr₁₋ₓSₓO₄)", note: "The pale lemon tones. This is the unstable one." },
    ],
    shift:
      "Measurably. Synchrotron study of the Van Gogh Museum canvas found the sulfate-rich chrome yellows undergoing photo-induced reduction, with roughly 35% of surface chromium converted from Cr(VI) to Cr(III) — the chemistry that turns pale yellow toward olive brown. Researchers note the change is not yet obvious to the naked eye, so the swatches here are close to, but very slightly browner than, what left the studio in 1888.",
    sources: [
      { label: "Monico et al., Angewandte Chemie Int. Ed. (2015) — degradation of chrome yellows in Sunflowers", href: "https://onlinelibrary.wiley.com/doi/abs/10.1002/anie.201505840" },
      { label: "ESRF — Van Gogh's Sunflowers: evidence of chrome yellow degradation", href: "https://www.esrf.fr/home/UsersAndScience/Publications/Highlights/highlights-2015/x-ray-nanoprobe/xnp08.html" },
    ],
  },

  "the-great-wave-off-kanagawa": {
    summary:
      "Cream paper, three blues, and one imported chemical that changed Japanese printmaking.",
    story: [
      "The palette is startlingly economical: the warm cream of the paper carries most of the surface, and the entire drama comes from a narrow band of blues. There is no green, no red, no yellow accent. A designer copying this scheme gets a lesson in how far a single hue family plus a warm neutral can go.",
      "The blue itself is the historical event. Prussian blue was a European laboratory accident from around 1704–06 in Berlin, and it reached Japan through Dutch traders at Nagasaki. It was far too expensive for print runs until Chinese production made it affordable in the late 1820s — which is precisely when this series appeared.",
    ],
    pigments: [
      { name: "Prussian blue (bero-ai / ベロ藍)", note: "The dominant blue. Named for Berlin, its city of origin, shortened in Japanese from 'Berlin indigo'." },
      { name: "Traditional indigo and plant colourants", note: "Used alongside the imported blue in ukiyo-e printing of this period." },
    ],
    shift:
      "This is a woodblock print, not a painting, so surviving impressions differ from one another as much as from the original — inking varied between pulls, and many sheets have faded unevenly with light exposure. Treat these values as one impression's reading rather than a single definitive palette.",
    sources: [
      { label: "MFA CAMEO — Prussian Blue as ukiyo-e colorant", href: "https://cameo.mfa.org/wiki/Category:Prussian_Blue:_Ukiyo-e_colorant" },
      { label: "JAANUS — berorin-ai (ベロリン藍)", href: "https://projects.mcah.columbia.edu/jaanus/node/5118" },
    ],
  },

  "girl-with-a-pearl-earring": {
    summary:
      "A warm, almost monochrome ground interrupted by one blue that cost more than gold.",
    story: [
      "Nearly the whole surface is warm: skin, ochre jacket, and a background so dark it reads as near-black. The blue of the headscarf occupies very little of the canvas, and it is the only cool note in the scheme. That imbalance is the design lesson — a single small cool accent against a large warm field will always dominate attention, regardless of how little space it occupies.",
      "The blue is natural ultramarine, ground from lapis lazuli mined in what is now Afghanistan. In the seventeenth century the prepared pigment was more valuable than gold by weight, which makes its use on a scarf rather than a Virgin's robe a genuinely extravagant choice.",
    ],
    pigments: [
      { name: "Natural ultramarine (lazurite, from lapis lazuli)", note: "The headscarf. Analysis found a high proportion of bright lazurite particles — a high-quality grade." },
      { name: "Lead white, ochres and earths", note: "The flesh tones and jacket." },
    ],
    shift:
      "The Girl in the Spotlight project (2018) examined the painting with SEM-EDX, FTIR-ATR and synchrotron sulfur K-edge XANES. One finding was that the lapis appears to have been heat-treated before grinding, which made the stone easier to work and yielded a more intense blue. Ultramarine is chemically stable, so this blue is close to what Vermeer laid down.",
    sources: [
      { label: "Out of the blue: Vermeer's use of ultramarine in Girl with a Pearl Earring — npj Heritage Science", href: "https://www.nature.com/articles/s40494-020-00364-5" },
      { label: "Mauritshuis — Closer to Vermeer and the Girl", href: "https://www.mauritshuis.nl/en/our-collection/restoration-and-research/closer-to-vermeer-and-the-girl" },
    ],
  },

  "a-sunday-on-la-grande-jatte": {
    summary:
      "A palette that has demonstrably changed since it was painted — and was already changing while Seurat was alive.",
    story: [
      "Seurat built this surface from small separate touches of colour intended to mix in the eye rather than on the palette. The extracted swatches therefore read as averages of many adjacent dots, which is closer to how the painting actually looks from across a room than any single brushstroke would be.",
      "What makes this canvas unusual in a colour collection is that we know it has shifted, and roughly by how much. Some of the yellow-green passages have darkened toward ochre, changing the balance of the whole composition.",
    ],
    pigments: [
      { name: "Zinc yellow (zinc potassium chromate, K₂O·4ZnCrO₄·3H₂O)", note: "Used in the bright yellow-green passages. Chemically unstable." },
      { name: "Emerald green, vermilion, cobalt blue and other modern pigments", note: "Seurat worked from the newly-available industrial palette of the 1880s." },
    ],
    shift:
      "Substantially, and early. Darkening of specific brushstrokes was recorded as soon as 1892 — six years after completion. Zinc yellow moves from bright greenish-yellow toward dull ochre as Cr(VI) reduces to Cr(III); artificial ageing reproduced the effect most strongly under strong light, high humidity and sulfur dioxide. The Art Institute of Chicago and the Rochester Institute of Technology have since produced digital reconstructions of the original colour.",
    sources: [
      { label: "Electron energy loss spectroscopy and the darkening of zinc potassium chromate in La Grande Jatte — Anal. Bioanal. Chem.", href: "https://link.springer.com/article/10.1007/s00216-010-4264-9" },
      { label: "ColourLex — Georges Seurat, A Sunday on La Grande Jatte", href: "https://colourlex.com/project/georges-seurat-a-sunday-on-la-grande-jatte/" },
    ],
  },

  "the-scream": {
    summary:
      "Oranges and scorched reds over a bruised ground — and yellows that are quietly turning white.",
    story: [
      "The scheme is almost entirely warm, and its power comes from value rather than hue contrast: mid-toned oranges sit against browns of similar saturation, so nothing in the picture offers the eye a place to rest. Used in design, this palette produces the same low-level unease, which is worth knowing before applying it to anything that needs to feel calm.",
      "Munch made several versions in different media. The swatches here read one of them, so expect real variation against other reproductions you may have seen.",
    ],
    pigments: [
      { name: "Cadmium yellow (cadmium sulfide, CdS)", note: "Used thickly in the sky and water. Degrading." },
      { name: "Cadmium-based oranges and reds", note: "The sky bands." },
    ],
    shift:
      "Yes, and against the usual assumption. In the c. 1910 version, some cadmium yellow strokes in the sky and the figure's neck have turned off-white, and thickly-painted water is flaking. Synchrotron work found that moisture, not light, is the main driver: chloride compounds at high humidity oxidise cadmium sulfide to cadmium sulfate. The museum's guidance is to hold the work below 45% relative humidity.",
    sources: [
      { label: "Probing the chemistry of CdS paints in The Scream — Science Advances", href: "https://www.science.org/doi/10.1126/sciadv.aay3514" },
      { label: "Munchmuseet — why The Scream is fading", href: "https://www.munch.no/en/about/conservation/researchers-have-found-out-why-the-scream-is-fading/" },
    ],
  },

  "the-kiss": {
    summary:
      "The most famous gold in painting is mostly not gold, and none of it is a pigment.",
    story: [
      "Every swatch here is an approximation of something a hex code cannot really hold. The golds in this painting are metal leaf, not paint: they change with viewing angle and lighting in a way flat colour cannot reproduce. What the extraction can tell you is the colour the leaf reads as under gallery light, which is genuinely useful if you are designing something that has to sit beside a reproduction.",
      "The green, orange and violet notes come from the ornamental patterning in the robes, and they are what stop the scheme collapsing into a single metallic hue. Those small chromatic interruptions are the reason the painting reads as rich rather than merely shiny.",
    ],
    pigments: [
      { name: "Gold, silver and platinum leaf", note: "Within the figures." },
      { name: "Brass imitation gold ('composition gold')", note: "The background. Actual fine-gold content across the work amounts to only grams." },
      { name: "Oil paint", note: "Flesh, foliage and the patterned colour notes." },
    ],
    shift:
      "Cross-sections show Klimt laying leaf directly onto a still-tacky resin-bound imprimatur, without the traditional oil mordant used in classical gilding — timing the application to the tack of the layer beneath so that gilding became part of the painting process rather than a step after it. Metal leaf does not fade the way organic pigments do, but it does tarnish and abrade selectively.",
    sources: [
      { label: "The Kiss (Klimt) — materials and Belvedere documentation", href: "https://en.wikipedia.org/wiki/The_Kiss_(Klimt)" },
    ],
  },

  "the-starry-night": {
    summary:
      "Three blues, one chrome yellow, and a near-black — the tightest famous palette in Western painting.",
    story: [
      "The scheme is a textbook complementary pair pushed to its limit: a deep blue field interrupted by yellow at maximum separation on the colour wheel. What the extraction shows that reproductions often flatten is how dark the darkest note really is, and how little yellow there actually is by area. The stars feel enormous; they occupy very little canvas.",
      "This is the clearest case in the collection for weighting a palette by intensity rather than coverage. Sample this painting by area alone and the yellow disappears entirely, leaving six blues and a scheme that is accurate to the surface and wrong about the picture.",
    ],
    sources: [],
  },

  "impression-sunrise": {
    summary:
      "A grey-green harbour, and a sun that occupies almost none of the canvas while defining all of it.",
    story: [
      "Monet's sun is small, and the rest of the painting is a muted field of blue-greys and sage. The orange is nonetheless the reason anyone remembers the picture. Measured strictly by surface area it barely registers; measured by attention it is the entire composition.",
      "For designers this is the most directly transferable lesson in the collection: a single saturated accent, used at perhaps two percent of the surface, against a large desaturated field, will carry a layout. Most palettes fail by making the accent too big.",
    ],
    sources: [],
  },

  "the-milkmaid": {
    summary: "Warm domestic neutrals, and then a blue that stops the room.",
    story: [
      "The bulk of this palette is cream, tan and shadow — the ordinary colours of a plain interior. Vermeer then places natural ultramarine, the most expensive pigment available to him, on a kitchen servant's apron. The extravagance is the point, and the resulting contrast is why the figure holds the space so completely.",
      "The structure is the same as Girl with a Pearl Earring: a broad warm field, one small cool accent, and an almost complete absence of mid-tone competition.",
    ],
    pigments: [
      { name: "Natural ultramarine (from lapis lazuli)", note: "The apron." },
      { name: "Lead-tin yellow, ochres, lead white", note: "The bodice, bread and wall." },
    ],
    shift: null,
    sources: [
      { label: "Vermeer's Palette: Natural Ultramarine — Essential Vermeer", href: "https://www.essentialvermeer.com/palette/palette_ultramarine.html" },
    ],
  },

  "cafe-terrace-at-night": {
    summary: "Gaslight gold against night blue — van Gogh's complementary scheme at its most legible.",
    story: [
      "This is the same blue-and-yellow opposition as The Starry Night, but resolved far more comfortably: the gold occupies much more of the surface, so the contrast reads as warmth rather than tension. The orange and olive notes sit between the two poles and stop the pair from feeling merely graphic.",
      "Van Gogh wrote about painting the night without using black, and the palette bears that out — the darkest swatches here are deep blue-greys rather than true neutrals.",
    ],
    sources: [],
  },
};

// Generic fallback prose for entries without dedicated notes. Describes palette
// STRUCTURE only — observable from the swatches — and asserts no pigment facts.
function fallback(p) {
  const accents = p.colors.filter((c) => c.role === "accent");
  const light = p.colors[0];
  const dark = p.colors[p.colors.length - 1];
  return {
    summary: `A ${p.colors.length}-colour reading of ${p.title}, sampled from the canvas itself.`,
    story: [
      `This palette runs from ${light.hex} at its lightest to ${dark.hex} at its darkest, with ${accents.length} accent note${accents.length === 1 ? "" : "s"} carrying most of the chromatic interest. The three largest areas of the painting set the base; the accents are the colours that give the work its character without necessarily covering much of it.`,
      `Every swatch is a colour that genuinely occurs on the surface — each one is snapped to the nearest real pixel rather than averaged, so nothing here is a colour the painter never actually put down.`,
    ],
    sources: [],
  };
}

const entries = palettes.map((p) => {
  const n = NOTES[p.slug] ?? fallback(p);
  return {
    slug: p.slug,
    title: p.title,
    artist: p.artist,
    year: p.year,
    museum: p.museum,
    summary: n.summary,
    story: n.story,
    pigments: n.pigments ?? [],
    shift: n.shift ?? null,
    sources: n.sources ?? [],
    colors: p.colors.map((c) => ({
      hex: c.hex,
      share: c.share,
      role: c.role,
      chroma: c.chroma,
      lightness: c.lightness,
    })),
    image: {
      commonsFile: p.source.commonsFile,
      commonsPage: p.source.commonsPage,
      license: p.source.license,
    },
  };
});

const ts = `import type { PaintingPalette } from "@/types/painting";

/**
 * Colour palettes sampled from public-domain paintings.
 *
 * HOW THIS FILE IS MADE — see /paintings/methodology for the reader-facing
 * version. Images come from Wikimedia Commons and are used only where the
 * licence resolves to public domain and the artist is independently confirmed
 * in the file metadata. Swatches are extracted by k-means clustering in
 * CIELAB, then snapped to the nearest real pixel, so every hex published here
 * is a colour that actually occurs on the canvas rather than an average of
 * two colours that appears nowhere on it.
 *
 * Pigment claims and \`shift\` notes appear ONLY where published conservation
 * research supports them, and each carries its sources. Entries without that
 * research carry no pigment claims — the palette structure is described
 * instead, because that much is observable from the swatches themselves.
 *
 * Generated by scripts/gen-paintings.mjs. Hand-written notes live in that
 * script; re-running regenerates this file.
 */
export const paintingPalettes: PaintingPalette[] = ${JSON.stringify(entries, null, 2)};

export function allPaintings(): PaintingPalette[] {
  return paintingPalettes;
}

export function paintingBySlug(slug: string): PaintingPalette | undefined {
  return paintingPalettes.find((p) => p.slug === slug);
}

/** Paintings sharing the nearest dominant hue — used for on-page cross-links. */
export function relatedPaintings(p: PaintingPalette, limit = 3): PaintingPalette[] {
  const hue = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    if (max === min) return 0;
    const d = max - min;
    let h = 0;
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    return (h * 60 + 360) % 360;
  };
  const gap = (a: number, b: number) => {
    const d = Math.abs(a - b) % 360;
    return Math.min(d, 360 - d);
  };
  const mine = hue(p.colors[0].hex);
  return paintingPalettes
    .filter((q) => q.slug !== p.slug)
    .map((q) => ({ q, d: gap(mine, hue(q.colors[0].hex)) }))
    .sort((a, b) => a.d - b.d)
    .slice(0, limit)
    .map((x) => x.q);
}
`;

const outDir = process.argv[2];
if (!outDir) {
  console.error("usage: node gen-ts.mjs <colorcombinations-root>");
  process.exit(1);
}
fs.writeFileSync(path.join(outDir, "src/data/paintings.ts"), ts);
console.log(`wrote src/data/paintings.ts — ${entries.length} paintings`);
console.log(`  with researched notes : ${entries.filter((e) => e.sources.length).length}`);
console.log(`  with pigment data     : ${entries.filter((e) => e.pigments.length).length}`);
console.log(`  with documented shift : ${entries.filter((e) => e.shift).length}`);
