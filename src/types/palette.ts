/**
 * Core palette type.
 * Colors carry both a hex value and optional traditional Japanese name + meaning.
 */
export type HexColor = `#${string}`;

export type Era =
  | "heian"
  | "kamakura"
  | "muromachi"
  | "edo"
  | "meiji"
  | "taisho"
  | "showa";

export type Mood =
  | "serene"
  | "bold"
  | "earthy"
  | "refined"
  | "austere"
  | "warm"
  | "cool"
  | "playful"
  | "solemn";

export type DominantHue =
  | "red"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "brown"
  | "pink"
  | "neutral";

export interface PaletteColor {
  /** Hex value, e.g. `#9A2A2A` */
  hex: HexColor;
  /** Traditional Japanese name (kanji) if available */
  nameJa?: string;
  /** Romanized / English reading */
  nameRomaji?: string;
  /** Short description or meaning */
  meaning?: string;
}

export interface Palette {
  /** URL slug (kebab-case, unique) */
  slug: string;
  /** Display title, English */
  title: string;
  /** Optional Japanese title */
  titleJa?: string;
  /** One-line description for cards + meta */
  summary: string;
  /** Extended description, MDX-ready */
  description: string;
  /** Era tag for historical context */
  era: Era;
  /** Moods for filtering */
  moods: Mood[];
  /** Dominant hue for filtering */
  dominantHue: DominantHue;
  /** 3 to 6 colors */
  colors: PaletteColor[];
  /** Featured on homepage */
  featured?: boolean;
  /** Display order hint (lower = earlier) */
  order?: number;
  /** Usage suggestions */
  usage?: string[];
  /** Free-form tags for search */
  tags?: string[];
}
