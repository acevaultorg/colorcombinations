/**
 * colorConvert.ts — pure color-space conversion + color-vision-deficiency
 * simulation. No dependencies. Usable at build time (Astro frontmatter) AND
 * client-side (imported into <script> blocks by Vite).
 *
 * Spaces: HEX · RGB (sRGB 0-255) · HSL · HSV/HSB · CMYK · OKLCH (Björn
 * Ottosson's OKLab, the perceptual space behind the CSS Color 4 oklch()).
 *
 * Conventions:
 *   rgb  = { r, g, b } in 0-255
 *   hsl  = { h: 0-360, s: 0-100, l: 0-100 }
 *   hsv  = { h: 0-360, s: 0-100, v: 0-100 }
 *   cmyk = { c, m, y, k } in 0-100
 *   oklch= { l: 0-1, c: 0-0.4-ish, h: 0-360 }
 */

export interface RGB { r: number; g: number; b: number; }
export interface HSL { h: number; s: number; l: number; }
export interface HSV { h: number; s: number; v: number; }
export interface CMYK { c: number; m: number; y: number; k: number; }
export interface OKLCH { l: number; c: number; h: number; }

const clamp = (n: number, lo = 0, hi = 255) => Math.min(hi, Math.max(lo, n));
const round = (n: number, d = 0) => {
  const f = 10 ** d;
  return Math.round(n * f) / f;
};

/* ── HEX ↔ RGB ─────────────────────────────────────────────────────────── */

/** Parse "#RGB", "#RRGGBB", "RRGGBB" → RGB. Returns null on malformed input. */
export function hexToRgb(hex: string): RGB | null {
  const clean = hex.trim().replace(/^#/, "");
  if (/^[0-9a-fA-F]{3}$/.test(clean)) {
    return {
      r: parseInt(clean[0] + clean[0], 16),
      g: parseInt(clean[1] + clean[1], 16),
      b: parseInt(clean[2] + clean[2], 16),
    };
  }
  if (/^[0-9a-fA-F]{6}$/.test(clean)) {
    return {
      r: parseInt(clean.slice(0, 2), 16),
      g: parseInt(clean.slice(2, 4), 16),
      b: parseInt(clean.slice(4, 6), 16),
    };
  }
  return null;
}

export function rgbToHex({ r, g, b }: RGB): string {
  const h = (n: number) => clamp(Math.round(n)).toString(16).padStart(2, "0");
  return ("#" + h(r) + h(g) + h(b)).toUpperCase();
}

/* ── RGB ↔ HSL ─────────────────────────────────────────────────────────── */

export function rgbToHsl({ r, g, b }: RGB): HSL {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: round(h, 1), s: round(s * 100, 1), l: round(l * 100, 1) };
}

export function hslToRgb({ h, s, l }: HSL): RGB {
  h = ((h % 360) + 360) % 360; s /= 100; l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

/* ── RGB ↔ HSV (HSB) ───────────────────────────────────────────────────── */

export function rgbToHsv({ r, g, b }: RGB): HSV {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h: round(h, 1), s: round(s * 100, 1), v: round(max * 100, 1) };
}

export function hsvToRgb({ h, s, v }: HSV): RGB {
  h = ((h % 360) + 360) % 360; s /= 100; v /= 100;
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return { r: Math.round((r + m) * 255), g: Math.round((g + m) * 255), b: Math.round((b + m) * 255) };
}

/* ── RGB ↔ CMYK (naive, screen-approximation) ──────────────────────────── */

export function rgbToCmyk({ r, g, b }: RGB): CMYK {
  r /= 255; g /= 255; b /= 255;
  const k = 1 - Math.max(r, g, b);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  const c = (1 - r - k) / (1 - k);
  const m = (1 - g - k) / (1 - k);
  const y = (1 - b - k) / (1 - k);
  return { c: round(c * 100), m: round(m * 100), y: round(y * 100), k: round(k * 100) };
}

export function cmykToRgb({ c, m, y, k }: CMYK): RGB {
  c /= 100; m /= 100; y /= 100; k /= 100;
  return {
    r: Math.round(255 * (1 - c) * (1 - k)),
    g: Math.round(255 * (1 - m) * (1 - k)),
    b: Math.round(255 * (1 - y) * (1 - k)),
  };
}

/* ── sRGB ↔ linear ─────────────────────────────────────────────────────── */

const srgbToLinear = (c: number): number => {
  c /= 255;
  return c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
};
const linearToSrgb = (c: number): number => {
  const v = c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055;
  return clamp(Math.round(v * 255));
};

/* ── RGB ↔ OKLCH (via OKLab — Björn Ottosson) ──────────────────────────── */

export function rgbToOklch({ r, g, b }: RGB): OKLCH {
  const lr = srgbToLinear(r), lg = srgbToLinear(g), lb = srgbToLinear(b);
  const l = 0.4122214708 * lr + 0.5363325363 * lg + 0.0514459929 * lb;
  const m = 0.2119034982 * lr + 0.6806995451 * lg + 0.1073969566 * lb;
  const s = 0.0883024619 * lr + 0.2817188376 * lg + 0.6299787005 * lb;
  const l_ = Math.cbrt(l), m_ = Math.cbrt(m), s_ = Math.cbrt(s);
  const L = 0.2104542553 * l_ + 0.793617785 * m_ - 0.0040720468 * s_;
  const A = 1.9779984951 * l_ - 2.428592205 * m_ + 0.4505937099 * s_;
  const B = 0.0259040371 * l_ + 0.7827717662 * m_ - 0.808675766 * s_;
  const C = Math.sqrt(A * A + B * B);
  let H = (Math.atan2(B, A) * 180) / Math.PI;
  if (H < 0) H += 360;
  return { l: round(L, 4), c: round(C, 4), h: round(H, 2) };
}

export function oklchToRgb({ l: L, c: C, h: H }: OKLCH): RGB {
  const hr = (H * Math.PI) / 180;
  const A = C * Math.cos(hr), B = C * Math.sin(hr);
  const l_ = L + 0.3963377774 * A + 0.2158037573 * B;
  const m_ = L - 0.1055613458 * A - 0.0638541728 * B;
  const s_ = L - 0.0894841775 * A - 1.291485548 * B;
  const l = l_ ** 3, m = m_ ** 3, s = s_ ** 3;
  const lr = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const lg = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const lb = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;
  return { r: linearToSrgb(lr), g: linearToSrgb(lg), b: linearToSrgb(lb) };
}

/* ── Formatting ────────────────────────────────────────────────────────── */

export const fmt = {
  hex: (c: RGB) => rgbToHex(c),
  rgb: (c: RGB) => `rgb(${c.r}, ${c.g}, ${c.b})`,
  hsl: (c: RGB) => { const h = rgbToHsl(c); return `hsl(${h.h}, ${h.s}%, ${h.l}%)`; },
  hsv: (c: RGB) => { const h = rgbToHsv(c); return `hsv(${h.h}, ${h.s}%, ${h.v}%)`; },
  cmyk: (c: RGB) => { const k = rgbToCmyk(c); return `cmyk(${k.c}%, ${k.m}%, ${k.y}%, ${k.k}%)`; },
  oklch: (c: RGB) => { const o = rgbToOklch(c); return `oklch(${round(o.l * 100, 1)}% ${o.c} ${o.h})`; },
};

/** All formats for one RGB color — used by the converter UIs + JSON. */
export function allFormats(c: RGB) {
  return {
    hex: fmt.hex(c),
    rgb: fmt.rgb(c),
    hsl: fmt.hsl(c),
    hsv: fmt.hsv(c),
    cmyk: fmt.cmyk(c),
    oklch: fmt.oklch(c),
  };
}

/** WCAG relative luminance (0-1). */
export function luminance({ r, g, b }: RGB): number {
  return 0.2126 * srgbToLinear(r) + 0.7152 * srgbToLinear(g) + 0.0722 * srgbToLinear(b);
}

/** WCAG 2.1 contrast ratio between two RGB colors. */
export function contrastRatio(a: RGB, b: RGB): number {
  const la = luminance(a), lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/* ── Lenient parser — accepts hex / rgb() / hsl() / hsv() / oklch() ─────── */

export function parseColor(input: string): RGB | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;
  if (s.startsWith("#") || /^[0-9a-f]{3}$|^[0-9a-f]{6}$/.test(s)) return hexToRgb(s);
  const nums = (s.match(/-?\d*\.?\d+/g) || []).map(Number);
  if (s.startsWith("rgb") && nums.length >= 3) return { r: clamp(nums[0]), g: clamp(nums[1]), b: clamp(nums[2]) };
  if (s.startsWith("hsl") && nums.length >= 3) return hslToRgb({ h: nums[0], s: nums[1], l: nums[2] });
  if ((s.startsWith("hsv") || s.startsWith("hsb")) && nums.length >= 3) return hsvToRgb({ h: nums[0], s: nums[1], v: nums[2] });
  if (s.startsWith("cmyk") && nums.length >= 4) return cmykToRgb({ c: nums[0], m: nums[1], y: nums[2], k: nums[3] });
  if (s.startsWith("oklch") && nums.length >= 3) {
    // accept "oklch(62% 0.2 30)" — lightness may be % or 0-1
    const l = s.includes("%") ? nums[0] / 100 : nums[0];
    return oklchToRgb({ l, c: nums[1], h: nums[2] });
  }
  return null;
}

/* ── Color-vision-deficiency simulation (Machado et al. 2009, severity 1.0,
 *    applied in linear sRGB) ────────────────────────────────────────────── */

export type CVDType = "protanopia" | "deuteranopia" | "tritanopia" | "achromatopsia";

const CVD_MATRIX: Record<Exclude<CVDType, "achromatopsia">, number[]> = {
  protanopia: [0.152286, 1.052583, -0.204868, 0.114503, 0.786281, 0.099216, -0.003882, -0.048116, 1.051998],
  deuteranopia: [0.367322, 0.860646, -0.227968, 0.280085, 0.672501, 0.047413, -0.01182, 0.04294, 0.968881],
  tritanopia: [1.255528, -0.076749, -0.178779, -0.078411, 0.930809, 0.147602, 0.004733, 0.691367, 0.3039],
};

export function simulateCVD(c: RGB, type: CVDType): RGB {
  if (type === "achromatopsia") {
    const y = linearToSrgb(0.2126 * srgbToLinear(c.r) + 0.7152 * srgbToLinear(c.g) + 0.0722 * srgbToLinear(c.b));
    return { r: y, g: y, b: y };
  }
  const m = CVD_MATRIX[type];
  const lr = srgbToLinear(c.r), lg = srgbToLinear(c.g), lb = srgbToLinear(c.b);
  return {
    r: linearToSrgb(m[0] * lr + m[1] * lg + m[2] * lb),
    g: linearToSrgb(m[3] * lr + m[4] * lg + m[5] * lb),
    b: linearToSrgb(m[6] * lr + m[7] * lg + m[8] * lb),
  };
}
