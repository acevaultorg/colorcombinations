import type { Era } from "@/types/palette";

export interface EraEntry {
  slug: Era;
  name: string;
  nameJa: string;
  years: string;
  lede: string;
  description: string;
  keywords: string[];
  next?: Era;
  prev?: Era;
}

/**
 * Seven historical eras used to tag palettes. Descriptions are public-domain
 * cultural knowledge — centuries-old periodization used in every Japanese art
 * history textbook. The editorial framing around what the palettes of each
 * era read like is original work.
 */
export const eras: EraEntry[] = [
  {
    slug: "heian",
    name: "Heian",
    nameJa: "平安時代",
    years: "794 – 1185",
    lede:
      "The imperial-court era. Colors named for silks, ceremony, and poetry.",
    description:
      "The Heian period is when Japanese shikisai moved from Chinese-imported palette systems to a native vocabulary rooted in textile dyeing. Court ranks were distinguished by robe color; seasonal color combinations ( *kasane no irome* ) encoded the date you could be seen wearing them. Kurenai safflower crimson, kon deep indigo, moegi spring green, and the entire pastel-paired sakura-wakatake family come from this era. The palettes are quiet, paired, and heavy on neutral grounds — paper, chalk, or raw silk behind one saturated color.",
    keywords: [
      "heian color palette",
      "heian era colors",
      "japanese court colors",
      "kasane no irome",
      "heian textile dye",
    ],
    next: "kamakura",
  },
  {
    slug: "kamakura",
    name: "Kamakura",
    nameJa: "鎌倉時代",
    years: "1185 – 1333",
    lede:
      "Warrior aesthetic takes over from court refinement. Armor, not robes.",
    description:
      "After the collapse of Heian court power, the center of visual culture shifts to the warrior class and the rising Zen Buddhist temples. Palettes get darker, more saturated, and less paired — single dominant colors on raw-silk or hemp grounds, with accents limited to the functional (lacing on armor, crest on a banner). Reds tilt toward oxblood rather than safflower. Blues tilt toward indigo-black rather than asagi. The era's best palettes read as *solemn* — Wada tags them with moods like 'austere' and 'solemn' rather than 'refined'.",
    keywords: [
      "kamakura color palette",
      "kamakura era colors",
      "samurai aesthetic colors",
      "zen buddhist palette",
    ],
    prev: "heian",
    next: "muromachi",
  },
  {
    slug: "muromachi",
    name: "Muromachi",
    nameJa: "室町時代",
    years: "1336 – 1573",
    lede:
      "Zen, tea ceremony, wabi-sabi. Restrained palettes that matured over centuries.",
    description:
      "The Muromachi period gave Japan the formal tea ceremony — and with it, a new standard for color restraint. Rikyū grey, the quiet sage-green-grey named after the master Sen no Rikyū, dates from this era. Palettes here are often just two muted tones plus a warm neutral: tea bowl + paper + a single flower. The era's signature is understatement. A Muromachi palette looks wrong if any color is doing more than one thing.",
    keywords: [
      "muromachi color palette",
      "tea ceremony colors",
      "wabi-sabi palette",
      "rikyu grey",
      "zen color scheme",
    ],
    prev: "kamakura",
    next: "edo",
  },
  {
    slug: "edo",
    name: "Edo",
    nameJa: "江戸時代",
    years: "1603 – 1868",
    lede:
      "Merchant wealth, ukiyo-e prints, and the first true consumer color culture.",
    description:
      "The Edo period is when color becomes commercial. Merchants prohibited by sumptuary laws from wearing bright silks developed an entire subcultural grammar of subtle greys ( *nezumi* family) and browns ( *cha* family) — each with a specific social connotation. Meanwhile ukiyo-e woodblock prints introduced technicolor palettes into every household: bright safflower reds, Prussian blues (imported from Europe 1790s-onward), deep purples. Edo palettes come in two flavours — the muted commoner tones and the high-saturation print palette. Both are in the archive.",
    keywords: [
      "edo color palette",
      "ukiyo-e colors",
      "edo merchant colors",
      "japanese woodblock palette",
      "prussian blue japan",
    ],
    prev: "muromachi",
    next: "meiji",
  },
  {
    slug: "meiji",
    name: "Meiji",
    nameJa: "明治時代",
    years: "1868 – 1912",
    lede:
      "Modernization. Western pigments arrive; traditional colors adapt or retreat.",
    description:
      "The Meiji Restoration opened Japan to Western trade, and with it came synthetic aniline dyes — shocking magentas, cobalt blues, new saturation ceilings that had been physically impossible with plant dyes. Meiji palettes often pair a synthetic accent with a traditional ground: a magenta-ish pink on a restrained indigo, a cobalt stripe on kinari silk. The effect is specifically Meiji — neither purely traditional nor purely Western. Wada's plates from this period are some of the most cited because they document the transition.",
    keywords: [
      "meiji color palette",
      "meiji era colors",
      "aniline dye palette",
      "japan meets west colors",
    ],
    prev: "edo",
    next: "taisho",
  },
  {
    slug: "taisho",
    name: "Taishō",
    nameJa: "大正時代",
    years: "1912 – 1926",
    lede:
      "Taishō Roman — Japanese-Western fusion at its most elegant.",
    description:
      "The Taishō era is short (14 years) but disproportionately influential in design. It gave Japan its first real Art Nouveau and Art Deco idioms, filtered through traditional shikisai. The palettes combine Western pastel harmony with Japanese neutral anchoring. A Taishō plate often reads as *romantic* in the European sense — roses, golds, duck-egg blues — but with a warm kinari background that grounds it as clearly Japanese. If you want a palette that reads as 'vintage postcard Japan', Taishō is the era.",
    keywords: [
      "taisho color palette",
      "taisho roman colors",
      "japanese art nouveau palette",
      "japanese art deco colors",
    ],
    prev: "meiji",
    next: "showa",
  },
  {
    slug: "showa",
    name: "Shōwa",
    nameJa: "昭和時代",
    years: "1926 – 1989",
    lede:
      "Wada's own era. The 1933 dictionary was published here.",
    description:
      "Wada's *Dictionary of Color Combinations* was published in 1933, eight years into Shōwa. The era spans militarism, defeat, occupation, the economic miracle, and Japan's postwar visual-culture explosion — so Shōwa palettes in the archive range widely. The early Shōwa plates (closest to the book's publication) are the most traditionally-grounded; they read as a retrospective summary of everything from Heian to Taishō. Later Shōwa palettes drift toward midcentury modern. This era contains the most variance of any in the archive.",
    keywords: [
      "showa color palette",
      "showa era colors",
      "1933 japanese colors",
      "sanzo wada palette",
      "midcentury japan colors",
    ],
    prev: "taisho",
  },
];

export function eraBySlug(slug: string): EraEntry | undefined {
  return eras.find((e) => e.slug === slug);
}
