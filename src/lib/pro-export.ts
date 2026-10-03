/**
 * Palette Pro export generators (slice 1, card mushlff2bdotwe, 2026-10-03).
 *
 * Pure functions: palette in, file bytes or JSON out. No UI and no paywall here; slice 2 wires them into the
 * export panel. The free exports in src/components/ExportPalette.astro (hex, CSS variables, Tailwind, JSON) stay
 * free. These only ADD formats people otherwise rebuild by hand:
 *   - Figma variables JSON  (one COLOR variable collection, RGBA in 0..1)
 *   - Adobe Swatch Exchange (.ase, binary, version 1.0, one group, RGB float32)
 *   - Procreate swatches    (.swatches = a zip holding Swatches.json, HSB in 0..1)
 *
 * Erasable TypeScript only (no enums, no namespaces, type-only imports) so scripts/pro-export.test.mjs can import
 * this file directly under Node's type stripping.
 */
import type { Palette } from "../types/palette";

export interface Rgb { r: number; g: number; b: number }

/** "#9A2A2A" or "#9a2" → { r, g, b } in 0..1. Throws on anything that is not a hex colour. */
export function hexToRgb(hex: string): Rgb {
  let h = hex.trim().replace(/^#/, "");
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split("").map((c) => c + c).join("");
  if (!/^[0-9a-f]{6}$/i.test(h)) throw new Error(`not a hex colour: ${hex}`);
  const n = parseInt(h, 16);
  return { r: ((n >> 16) & 255) / 255, g: ((n >> 8) & 255) / 255, b: (n & 255) / 255 };
}

/** { r, g, b } in 0..1 → "#RRGGBB" (rounded to the nearest 8-bit step). */
export function rgbToHex({ r, g, b }: Rgb): string {
  const to = (v: number) => Math.round(Math.min(1, Math.max(0, v)) * 255).toString(16).padStart(2, "0");
  return `#${to(r)}${to(g)}${to(b)}`.toUpperCase();
}

/** RGB 0..1 → HSB 0..1 (hue as a fraction of the circle, as Procreate stores it). */
export function rgbToHsb({ r, g, b }: Rgb): { h: number; s: number; b: number } {
  const max = Math.max(r, g, b), min = Math.min(r, g, b), d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h /= 6;
    if (h < 0) h += 1;
  }
  return { h, s: max === 0 ? 0 : d / max, b: max };
}

/** HSB 0..1 → RGB 0..1 (inverse of rgbToHsb; used by the round-trip test). */
export function hsbToRgb({ h, s, b }: { h: number; s: number; b: number }): Rgb {
  const i = Math.floor(h * 6) % 6, f = h * 6 - Math.floor(h * 6);
  const p = b * (1 - s), q = b * (1 - f * s), t = b * (1 - (1 - f) * s);
  const [r, g, bl] = [[b, t, p], [q, b, p], [p, b, t], [p, q, b], [t, p, b], [b, p, q]][i];
  return { r, g, b: bl };
}

/** Human name for a colour: its romanized Japanese name, else "<slug> <n>". */
export function colorName(p: Palette, i: number): string {
  const c = p.colors[i];
  return (c.nameRomaji && c.nameRomaji.trim()) || `${p.slug} ${i + 1}`;
}

// ---------------------------------------------------------------- Figma variables JSON
export interface FigmaVariablesExport {
  version: 1;
  source: string;
  collection: { name: string; modes: { modeId: string; name: string }[] };
  variables: { name: string; resolvedType: "COLOR"; description: string; valuesByMode: Record<string, { r: number; g: number; b: number; a: number }> }[];
}

/** One collection named after the palette, one "Default" mode, one COLOR variable per colour (RGBA 0..1). */
export function figmaVariables(p: Palette): FigmaVariablesExport {
  const mode = "default";
  return {
    version: 1,
    source: `https://colorcombinations.org/palettes/${p.slug}/`,
    collection: { name: p.title, modes: [{ modeId: mode, name: "Default" }] },
    variables: p.colors.map((c, i) => {
      const { r, g, b } = hexToRgb(c.hex);
      return {
        name: `${p.slug}/${colorName(p, i).toLowerCase().replace(/\s+/g, "-")}`,
        resolvedType: "COLOR" as const,
        description: [c.nameJa, c.meaning].filter(Boolean).join(" · "),
        valuesByMode: { [mode]: { r, g, b, a: 1 } },
      };
    }),
  };
}

// ---------------------------------------------------------------- Adobe Swatch Exchange (.ase)
// Layout (big-endian): "ASEF", version u16 1, u16 0, block count u32, then blocks of
// [type u16][length u32][payload]. Group start 0xC001 (name), colour entry 0x0001
// (name, model "RGB ", 3 × float32, colour type u16 2 = normal), group end 0xC002 (empty).
// A name is u16 character count INCLUDING the terminating null, then UTF-16BE + 0x0000.
function aseName(name: string): number[] {
  const out: number[] = [];
  const units = [...name].flatMap((ch) => { const cp = ch.codePointAt(0)!; return cp > 0xffff ? [0xd800 + ((cp - 0x10000) >> 10), 0xdc00 + ((cp - 0x10000) & 0x3ff)] : [cp]; });
  const n = units.length + 1;
  out.push((n >> 8) & 255, n & 255);
  for (const u of units) out.push((u >> 8) & 255, u & 255);
  out.push(0, 0);
  return out;
}

function u16(v: number): number[] { return [(v >> 8) & 255, v & 255]; }
function u32(v: number): number[] { return [(v >>> 24) & 255, (v >>> 16) & 255, (v >>> 8) & 255, v & 255]; }
function f32(v: number): number[] { const b = new DataView(new ArrayBuffer(4)); b.setFloat32(0, v, false); return [b.getUint8(0), b.getUint8(1), b.getUint8(2), b.getUint8(3)]; }

function block(type: number, payload: number[]): number[] { return [...u16(type), ...u32(payload.length), ...payload]; }

export function adobeAse(p: Palette): Uint8Array {
  const blocks: number[][] = [block(0xc001, aseName(p.title))];
  p.colors.forEach((c, i) => {
    const { r, g, b } = hexToRgb(c.hex);
    blocks.push(block(0x0001, [...aseName(colorName(p, i)), ...[..."RGB "].map((ch) => ch.charCodeAt(0)), ...f32(r), ...f32(g), ...f32(b), ...u16(2)]));
  });
  blocks.push(block(0xc002, []));
  return Uint8Array.from([...[..."ASEF"].map((ch) => ch.charCodeAt(0)), ...u16(1), ...u16(0), ...u32(blocks.length), ...blocks.flat()]);
}

// ---------------------------------------------------------------- Procreate .swatches
// A zip archive with one file, Swatches.json: [{ name, swatches: [{ hue, saturation, brightness, alpha,
// colorSpace: 0 }] }], HSB in 0..1. Written as a STORED (uncompressed) zip so no dependency is needed.
export function procreateSwatchesJson(p: Palette): string {
  return JSON.stringify([{
    name: p.title,
    swatches: p.colors.map((c) => { const { h, s, b } = rgbToHsb(hexToRgb(c.hex)); return { hue: h, saturation: s, brightness: b, alpha: 1, colorSpace: 0 }; }),
  }]);
}

let CRC_TABLE: number[] | null = null;
export function crc32(data: Uint8Array): number {
  if (!CRC_TABLE) CRC_TABLE = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
  let c = 0xffffffff;
  for (const byte of data) c = CRC_TABLE[(c ^ byte) & 255] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

/** Minimal single-file STORED zip (local header + data + central directory + end record), little-endian. */
export function storedZip(fileName: string, data: Uint8Array): Uint8Array {
  const le16 = (v: number) => [v & 255, (v >> 8) & 255];
  const le32 = (v: number) => [v & 255, (v >>> 8) & 255, (v >>> 16) & 255, (v >>> 24) & 255];
  const name = [...new TextEncoder().encode(fileName)];
  const crc = crc32(data), size = data.length;
  // DOS time/date fixed at 1980-01-01 00:00 so the output is deterministic.
  const common = [...le16(20), ...le16(0), ...le16(0), ...le16(0), ...le16(0x21), ...le32(crc), ...le32(size), ...le32(size), ...le16(name.length), ...le16(0)];
  const local = [...le32(0x04034b50), ...common, ...name];
  const central = [...le32(0x02014b50), ...le16(20), ...common, ...le16(0), ...le16(0), ...le16(0), ...le32(0), ...le32(0), ...name];
  const end = [...le32(0x06054b50), ...le16(0), ...le16(0), ...le16(1), ...le16(1), ...le32(central.length), ...le32(local.length + size), ...le16(0)];
  return Uint8Array.from([...local, ...data, ...central, ...end]);
}

export function procreateSwatches(p: Palette): Uint8Array {
  return storedZip("Swatches.json", new TextEncoder().encode(procreateSwatchesJson(p)));
}

/** File names a download would use, e.g. "aizome-ase" → "colorcombinations-aizome.ase". */
export const proFileName = (p: Palette, ext: "ase" | "swatches" | "json") => `colorcombinations-${p.slug}${ext === "json" ? ".figma-variables.json" : `.${ext}`}`;
