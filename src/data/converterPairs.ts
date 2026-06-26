/**
 * converterPairs.ts — data for the programmatic /tools/color-converter/[pair]/
 * landing pages. Each pair has genuinely unique editorial content (formula,
 * worked example, code) so the pages are substantive, not templated filler.
 *
 * Format keys map to functions in src/lib/colorConvert.ts.
 */

export type Fmt = "hex" | "rgb" | "hsl" | "hsv" | "cmyk" | "oklch";

export interface FmtMeta {
  key: Fmt;
  label: string;       // "HEX", "RGB" — uppercase, used in titles
  long: string;        // "hexadecimal"
  placeholder: string; // input placeholder
}

export const FORMATS: Record<Fmt, FmtMeta> = {
  hex: { key: "hex", label: "HEX", long: "hexadecimal", placeholder: "#1B2A4E" },
  rgb: { key: "rgb", label: "RGB", long: "red-green-blue", placeholder: "rgb(27, 42, 78)" },
  hsl: { key: "hsl", label: "HSL", long: "hue-saturation-lightness", placeholder: "hsl(220, 49%, 21%)" },
  hsv: { key: "hsv", label: "HSV", long: "hue-saturation-value (HSB)", placeholder: "hsv(220, 65%, 31%)" },
  cmyk: { key: "cmyk", label: "CMYK", long: "cyan-magenta-yellow-key", placeholder: "cmyk(65%, 46%, 0%, 69%)" },
  oklch: { key: "oklch", label: "OKLCH", long: "perceptual lightness-chroma-hue", placeholder: "oklch(28% 0.07 268)" },
};

export interface Pair {
  slug: string;
  from: Fmt;
  to: Fmt;
  /** unique 2-3 sentence intro */
  intro: string;
  /** formula HTML (kept simple, accurate) */
  formula: string;
  /** worked example: an input color + the human-readable steps */
  example: { input: string; steps: string[] };
  /** code snippet (language + body) */
  code: { lang: string; body: string };
  /** 2-3 FAQ entries */
  faq: { q: string; a: string }[];
}

export const PAIRS: Pair[] = [
  {
    slug: "hex-to-rgb",
    from: "hex", to: "rgb",
    intro:
      "A hex color is just three bytes written in base-16: two digits for red, two for green, two for blue. Converting HEX to RGB means splitting the string into those three pairs and reading each pair as a 0-255 decimal number — nothing is lost, the two notations describe exactly the same sRGB color.",
    formula:
      "<code>R = parseInt(hex[0:2], 16)</code> · <code>G = parseInt(hex[2:4], 16)</code> · <code>B = parseInt(hex[4:6], 16)</code>. A 3-digit shorthand like <code>#1af</code> expands by doubling each digit (<code>#11aaff</code>).",
    example: {
      input: "#1B2A4E",
      steps: [
        "Strip the # → 1B2A4E",
        "Red: 1B (hex) = 1×16 + 11 = 27",
        "Green: 2A (hex) = 2×16 + 10 = 42",
        "Blue: 4E (hex) = 4×16 + 14 = 78",
        "Result: rgb(27, 42, 78)",
      ],
    },
    code: { lang: "JavaScript", body: `const hex = "#1B2A4E".replace("#","");
const r = parseInt(hex.slice(0,2),16); // 27
const g = parseInt(hex.slice(2,4),16); // 42
const b = parseInt(hex.slice(4,6),16); // 78` },
    faq: [
      { q: "Does hex include opacity?", a: "8-digit hex (#RRGGBBAA) adds an alpha byte. The first 6 digits are the same RGB; the last two are alpha 0-255 (FF = fully opaque)." },
      { q: "Is #abc the same as #aabbcc?", a: "Yes. 3-digit hex is shorthand — each digit is doubled, so #abc expands to #aabbcc." },
    ],
  },
  {
    slug: "rgb-to-hex",
    from: "rgb", to: "hex",
    intro:
      "RGB to HEX is the reverse of reading a hex string: take each 0-255 channel, convert it to a two-digit base-16 number, and concatenate them behind a #. The only gotcha is zero-padding — a channel like 5 must become 05, not 5.",
    formula:
      "<code>hex = '#' + toHex(R) + toHex(G) + toHex(B)</code> where <code>toHex(n) = n.toString(16).padStart(2,'0')</code>.",
    example: {
      input: "rgb(154, 42, 42)",
      steps: [
        "Red: 154 = 9A in hex",
        "Green: 42 = 2A in hex",
        "Blue: 42 = 2A in hex",
        "Concatenate: #9A2A2A",
      ],
    },
    code: { lang: "JavaScript", body: `const h = n => n.toString(16).padStart(2,"0");
const hex = "#" + h(154) + h(42) + h(42); // "#9a2a2a"` },
    faq: [
      { q: "Why pad to two digits?", a: "Each channel must occupy exactly two hex digits. Without padding, rgb(5, 16, 255) would collapse to #510ff instead of #0510FF." },
      { q: "Upper or lower case?", a: "Both are valid and identical to browsers. Designers often prefer uppercase for readability; it carries no semantic difference." },
    ],
  },
  {
    slug: "hex-to-hsl",
    from: "hex", to: "hsl",
    intro:
      "HEX to HSL is a two-step conversion: read the hex into RGB, then derive hue, saturation, and lightness. HSL is far easier to reason about than hex when you want to lighten, darken, or rotate a color by hand — which is why design tokens are often stored in HSL.",
    formula:
      "Normalize R,G,B to 0-1. <code>L = (max+min)/2</code>. <code>S = (max−min) / (1 − |2L−1|)</code>. Hue is the angle of the dominant channel, scaled to 0-360°.",
    example: {
      input: "#1B2A4E",
      steps: [
        "Hex → rgb(27, 42, 78)",
        "Max = 0.306 (blue), Min = 0.106 (red)",
        "Lightness = (0.306 + 0.106) / 2 ≈ 21%",
        "Saturation ≈ 49%, Hue ≈ 220° (blue)",
        "Result: hsl(220, 49%, 21%)",
      ],
    },
    code: { lang: "CSS", body: `/* Same navy in both notations */
--brand: #1B2A4E;
--brand-hsl: hsl(220, 49%, 21%);
/* HSL makes a 10%-lighter tint trivial: */
--brand-tint: hsl(220, 49%, 31%);` },
    faq: [
      { q: "Why convert to HSL at all?", a: "HSL separates 'which color' (hue) from 'how light' (lightness), so generating tints, shades, and hover states is a single-number tweak instead of guessing hex digits." },
      { q: "Is HSL the same gamut as hex?", a: "Yes — both describe sRGB. HSL is just a cylindrical re-mapping of the same colors, so the round-trip is lossless apart from rounding." },
    ],
  },
  {
    slug: "hsl-to-hex",
    from: "hsl", to: "hex",
    intro:
      "HSL to HEX turns a human-friendly hue/saturation/lightness triple back into the six-digit string CSS and design tools expect. Internally it goes HSL → RGB → HEX; the interesting math is the HSL → RGB step, which reconstructs the three channels from the hue sector.",
    formula:
      "<code>C = (1 − |2L−1|)·S</code>, <code>X = C·(1 − |(H/60 mod 2) − 1|)</code>, <code>m = L − C/2</code>. Pick the (R,G,B) ordering by hue sector, add m, scale to 0-255, then hex-encode.",
    example: {
      input: "hsl(220, 49%, 21%)",
      steps: [
        "C = (1 − |2·0.21 − 1|)·0.49 ≈ 0.20",
        "Hue 220° falls in the 180-240 sector → (0, X, C)",
        "Add m and scale → rgb(27, 42, 78)",
        "Hex-encode → #1B2A4E",
      ],
    },
    code: { lang: "JavaScript", body: `// hslToRgb then rgbToHex (see colorConvert.ts)
hslToRgb({h:220,s:49,l:21}); // {r:27,g:42,b:78}
rgbToHex({r:27,g:42,b:78});  // "#1B2A4E"` },
    faq: [
      { q: "Do I even need hex if CSS supports hsl()?", a: "Modern CSS accepts hsl() directly, so for stylesheets you often don't. Hex is still required by many design tools, brand guidelines, and APIs that only accept a 6-digit string." },
    ],
  },
  {
    slug: "rgb-to-hsl",
    from: "rgb", to: "hsl",
    intro:
      "RGB to HSL re-expresses the three additive channels as a hue angle, a saturation percentage, and a lightness percentage. It's the conversion behind every 'lighten 10%' or 'desaturate' operation in a design system.",
    formula:
      "Normalize to 0-1. <code>L = (max+min)/2</code>. <code>S = 0 if max==min else (max−min)/(1−|2L−1|)</code>. <code>H</code> = 60° × the offset of the max channel.",
    example: {
      input: "rgb(154, 42, 42)",
      steps: [
        "Normalize → (0.604, 0.165, 0.165)",
        "Max = 0.604 (red), Min = 0.165",
        "L = 38%, S = 57%",
        "Red is max → H ≈ 0° (red)",
        "Result: hsl(0, 57%, 38%)",
      ],
    },
    code: { lang: "Python", body: `import colorsys
r,g,b = 154/255, 42/255, 42/255
h,l,s = colorsys.rgb_to_hls(r,g,b)
print(round(h*360), round(s*100), round(l*100)) # 0 57 38` },
    faq: [
      { q: "Why is saturation defined with lightness in the denominator?", a: "HSL keeps perceived vividness roughly constant across lightness, so the same S means 'equally saturated' whether the color is light or dark. That requires the 1−|2L−1| term." },
    ],
  },
  {
    slug: "hsl-to-rgb",
    from: "hsl", to: "rgb",
    intro:
      "HSL to RGB rebuilds the three 0-255 channels from a hue angle and two percentages. Browsers do this conversion internally every time you write hsl() in CSS — doing it yourself is useful for canvas drawing, data viz, and generating palettes programmatically.",
    formula:
      "<code>C = (1 − |2L−1|)·S</code>, <code>X = C·(1 − |(H/60 mod 2) − 1|)</code>, <code>m = L − C/2</code>. The hue sector chooses which of (C,X,0) maps to R,G,B; add m and scale by 255.",
    example: {
      input: "hsl(140, 30%, 37%)",
      steps: [
        "C = (1 − |2·0.37 − 1|)·0.30 ≈ 0.22",
        "Hue 140° → sector 120-180 → (0, C, X)",
        "Add m, ×255 → rgb(66, 123, 84)",
      ],
    },
    code: { lang: "JavaScript", body: `function hslToRgb(h,s,l){
  s/=100; l/=100;
  const c=(1-Math.abs(2*l-1))*s, x=c*(1-Math.abs((h/60)%2-1)), m=l-c/2;
  const [r,g,b]=h<60?[c,x,0]:h<120?[x,c,0]:h<180?[0,c,x]:h<240?[0,x,c]:h<300?[x,0,c]:[c,0,x];
  return [Math.round((r+m)*255),Math.round((g+m)*255),Math.round((b+m)*255)];
}` },
    faq: [
      { q: "Does hue wrap around?", a: "Yes — hue is an angle, so 360° equals 0° (both red). Negative or >360 values are taken modulo 360 before conversion." },
    ],
  },
  {
    slug: "hex-to-hsv",
    from: "hex", to: "hsv",
    intro:
      "HEX to HSV (also called HSB, for hue-saturation-brightness) is the model behind most color pickers: the square selects saturation and value, the slider picks hue. Converting from hex lets you drop any brand color straight onto that picker's coordinates.",
    formula:
      "Hex → RGB → normalize. <code>V = max</code>. <code>S = 0 if V==0 else (max−min)/max</code>. Hue is the same 0-360° angle as in HSL.",
    example: {
      input: "#9A2A2A",
      steps: [
        "Hex → rgb(154, 42, 42)",
        "Normalize → max = 0.604 (red), min = 0.165",
        "Value = 60%, Saturation = (0.604−0.165)/0.604 = 73%",
        "Red is max → Hue ≈ 0°",
        "Result: hsv(0, 73%, 60%)",
      ],
    },
    code: { lang: "Python", body: `import colorsys
r,g,b = (0x9A/255, 0x2A/255, 0x2A/255)
h,s,v = colorsys.rgb_to_hsv(r,g,b)
print(round(h*360), round(s*100), round(v*100)) # 0 73 60` },
    faq: [
      { q: "HSV vs HSL — what's the difference?", a: "HSV's 'value' is the max channel (full value = pure or pure+white mix), while HSL's 'lightness' centers on grey. HSV matches how a color-picker square feels; HSL matches how 'tint vs shade' reads in CSS." },
      { q: "Is HSB the same as HSV?", a: "Yes — HSB (brightness) and HSV (value) are two names for the identical model. Photoshop says HSB; most code libraries say HSV." },
    ],
  },
  {
    slug: "rgb-to-hsv",
    from: "rgb", to: "hsv",
    intro:
      "RGB to HSV maps the additive channels onto the hue/saturation/value cylinder used by virtually every color picker. If you're building a picker, eyedropper, or canvas tool, this is the conversion that turns a sampled pixel into pointer coordinates.",
    formula:
      "Normalize to 0-1. <code>V = max(R,G,B)</code>. <code>S = (max−min)/max</code> (0 if max is 0). <code>H</code> = 60° times the offset of whichever channel is the max.",
    example: {
      input: "rgb(66, 123, 84)",
      steps: [
        "Normalize → (0.259, 0.482, 0.329)",
        "Value = 48%, max−min = 0.224, S = 46%",
        "Green is max → H = 60·(2 + (B−R)/range) ≈ 140°",
        "Result: hsv(140, 46%, 48%)",
      ],
    },
    code: { lang: "JavaScript", body: `function rgbToHsv(r,g,b){
  r/=255;g/=255;b/=255;
  const mx=Math.max(r,g,b),mn=Math.min(r,g,b),d=mx-mn;
  let h=0; if(d){ h = mx===r?((g-b)/d)%6 : mx===g?(b-r)/d+2 : (r-g)/d+4; h*=60; if(h<0)h+=360; }
  return [Math.round(h), Math.round((mx?d/mx:0)*100), Math.round(mx*100)];
}` },
    faq: [
      { q: "Why does a color picker use HSV?", a: "Because the 2-D square (saturation × value) plus a 1-D hue slider covers the whole gamut intuitively: move right for vivid, up for bright, slide for hue." },
    ],
  },
  {
    slug: "rgb-to-cmyk",
    from: "rgb", to: "cmyk",
    intro:
      "RGB to CMYK converts a screen color (additive light) into the four subtractive ink channels a printer uses. This is a screen-approximation: true print color depends on paper, ink, and an ICC profile, so always confirm with a proof. The math here gives the standard 'naive' CMYK most tools display.",
    formula:
      "Normalize to 0-1. <code>K = 1 − max(R,G,B)</code>. <code>C = (1−R−K)/(1−K)</code>, <code>M = (1−G−K)/(1−K)</code>, <code>Y = (1−B−K)/(1−K)</code>. If K = 1 (pure black), C=M=Y=0.",
    example: {
      input: "rgb(27, 42, 78)",
      steps: [
        "Normalize → (0.106, 0.165, 0.306)",
        "K = 1 − 0.306 = 0.694 → 69%",
        "C = (1−0.106−0.694)/0.306 ≈ 65%",
        "M ≈ 46%, Y = 0%",
        "Result: cmyk(65%, 46%, 0%, 69%)",
      ],
    },
    code: { lang: "JavaScript", body: `function rgbToCmyk(r,g,b){
  r/=255;g/=255;b/=255;
  const k=1-Math.max(r,g,b);
  if(k===1) return [0,0,0,100];
  return [(1-r-k)/(1-k),(1-g-k)/(1-k),(1-b-k)/(1-k),k].map(v=>Math.round(v*100));
}` },
    faq: [
      { q: "Will print match my screen?", a: "Not exactly. RGB has a wider gamut than CMYK, so vivid blues and greens shift. This formula is a preview; for production, soft-proof with the printer's ICC profile." },
      { q: "Why is there a K (black) channel?", a: "Mixing C+M+Y to make black wastes ink and looks muddy, so printers add a dedicated key (black) plate. K absorbs the common darkness first." },
    ],
  },
  {
    slug: "cmyk-to-rgb",
    from: "cmyk", to: "rgb",
    intro:
      "CMYK to RGB estimates how a set of print ink percentages would appear on a screen. Like its inverse, it's an approximation — handy for previewing a print spec, building a swatch from a brand's CMYK guideline, or feeding a print color into a web mockup.",
    formula:
      "Normalize C,M,Y,K to 0-1. <code>R = 255·(1−C)·(1−K)</code>, <code>G = 255·(1−M)·(1−K)</code>, <code>B = 255·(1−Y)·(1−K)</code>.",
    example: {
      input: "cmyk(65%, 46%, 0%, 69%)",
      steps: [
        "1−K = 0.31",
        "R = 255·(1−0.65)·0.31 ≈ 27",
        "G = 255·(1−0.46)·0.31 ≈ 42",
        "B = 255·(1−0)·0.31 ≈ 79",
        "Result ≈ rgb(27, 42, 79)",
      ],
    },
    code: { lang: "Python", body: `def cmyk_to_rgb(c,m,y,k):
    c,m,y,k = c/100,m/100,y/100,k/100
    return [round(255*(1-x)*(1-k)) for x in (c,m,y)]
print(cmyk_to_rgb(65,46,0,69)) # [27, 42, 79]` },
    faq: [
      { q: "Why doesn't it round-trip perfectly?", a: "Both directions are device-independent approximations. Rounding plus the gamut gap between print and screen means a CMYK→RGB→CMYK loop can drift by a percent or two." },
    ],
  },
  {
    slug: "hex-to-cmyk",
    from: "hex", to: "cmyk",
    intro:
      "HEX to CMYK is the conversion designers reach for when a web color needs a print spec. It runs hex → RGB → CMYK. Remember it's a screen-approximation — the printed result depends on the press, so treat these numbers as a starting point for a proof, not a guarantee.",
    formula:
      "Hex → RGB, normalize to 0-1, then <code>K = 1 − max</code> and <code>C,M,Y = (1−channel−K)/(1−K)</code>.",
    example: {
      input: "#9A2A2A",
      steps: [
        "Hex → rgb(154, 42, 42)",
        "Normalize → (0.604, 0.165, 0.165), K = 0.396 → 40%",
        "C = (1−0.604−0.396)/0.604 = 0%? → C ≈ 0%, M ≈ 73%, Y ≈ 73%",
        "Result: cmyk(0%, 73%, 73%, 40%)",
      ],
    },
    code: { lang: "JavaScript", body: `// hexToRgb then rgbToCmyk (see colorConvert.ts)
const rgb = hexToRgb("#9A2A2A");      // {r:154,g:42,b:42}
const cmyk = rgbToCmyk(rgb);          // [0, 73, 73, 40]` },
    faq: [
      { q: "Should I trust hex→CMYK for brand printing?", a: "Use it to get close, then ask your printer for a Pantone or ICC-profiled equivalent. Brand reds and blues in particular need a proof because they sit near the CMYK gamut edge." },
    ],
  },
  {
    slug: "cmyk-to-hex",
    from: "cmyk", to: "hex",
    intro:
      "CMYK to HEX takes a print ink spec and produces the closest six-digit web color, via CMYK → RGB → HEX. It's the bridge from a brand's print guideline to a usable website value.",
    formula:
      "<code>R,G,B = 255·(1−CMY)·(1−K)</code>, then hex-encode each channel as two base-16 digits.",
    example: {
      input: "cmyk(0%, 73%, 73%, 40%)",
      steps: [
        "1−K = 0.60",
        "R = 255·1·0.60 = 153, G = 255·0.27·0.60 ≈ 41, B ≈ 41",
        "Hex-encode → ≈ #99292 9 → #992929",
      ],
    },
    code: { lang: "JavaScript", body: `// cmykToRgb then rgbToHex (see colorConvert.ts)
const rgb = cmykToRgb({c:0,m:73,y:73,k:40});
const hex = rgbToHex(rgb); // ~ "#99292 9"` },
    faq: [
      { q: "Why might the hex differ from my brand's stated web color?", a: "Brand guidelines usually define hex and CMYK independently from a master color, so the converted value can land a few digits off the official hex. When both are given, use the official hex for web." },
    ],
  },
  {
    slug: "hex-to-oklch",
    from: "hex", to: "oklch",
    intro:
      "HEX to OKLCH converts a familiar web hex into OKLCH — the perceptual color space CSS Color 4 added. Unlike HSL, equal lightness numbers in OKLCH actually look equally light, which is why design systems are migrating to it for predictable tints, shades, and accessible contrast.",
    formula:
      "Hex → linear sRGB → OKLab (a fixed 3×3 matrix + cube roots, per Björn Ottosson) → polar form: <code>L</code> = perceptual lightness, <code>C = √(a²+b²)</code> = chroma, <code>H = atan2(b,a)</code> = hue.",
    example: {
      input: "#1B2A4E",
      steps: [
        "Hex → rgb(27, 42, 78) → linear sRGB",
        "Linear → OKLab (L, a, b)",
        "L ≈ 0.28, chroma ≈ 0.07, hue ≈ 268°",
        "Result: oklch(28% 0.07 268)",
      ],
    },
    code: { lang: "CSS", body: `/* CSS Color 4 — supported in all modern browsers */
--navy: #1B2A4E;
--navy-oklch: oklch(28% 0.07 268);
/* Perceptually-even shades — just change L: */
--navy-600: oklch(34% 0.07 268);
--navy-400: oklch(46% 0.07 268);` },
    faq: [
      { q: "Why move from HSL to OKLCH?", a: "In HSL, hsl(60,100%,50%) (yellow) looks far brighter than hsl(240,100%,50%) (blue) at the same lightness. OKLCH fixes that — its L is perceptually uniform, so tints and contrast behave predictably across hues." },
      { q: "Is OKLCH safe to ship?", a: "Yes — oklch() is supported in all current browsers. Provide a hex fallback for very old ones, which Astro/PostCSS can automate." },
    ],
  },
  {
    slug: "oklch-to-hex",
    from: "oklch", to: "hex",
    intro:
      "OKLCH to HEX renders a perceptual OKLCH color back to a six-digit hex for tools and APIs that don't yet speak oklch(). Because OKLCH can describe colors outside the sRGB gamut, very vivid values are clamped to the nearest displayable hex.",
    formula:
      "Polar → OKLab (<code>a = C·cos H</code>, <code>b = C·sin H</code>) → linear sRGB (inverse matrix + cubes) → gamma-encode → clamp 0-255 → hex.",
    example: {
      input: "oklch(28% 0.07 268)",
      steps: [
        "a = 0.07·cos(268°), b = 0.07·sin(268°)",
        "OKLab → linear sRGB → gamma-encode",
        "Clamp to gamut → rgb(27, 42, 78)",
        "Hex-encode → #1B2A4E",
      ],
    },
    code: { lang: "JavaScript", body: `// oklchToRgb then rgbToHex (see colorConvert.ts)
const rgb = oklchToRgb({l:0.28,c:0.07,h:268});
const hex = rgbToHex(rgb); // "#1B2A4E"` },
    faq: [
      { q: "What happens to out-of-gamut OKLCH colors?", a: "OKLCH can express more saturated colors than an sRGB screen can show. Those are clamped per-channel to 0-255 on the way to hex, so the hex is the closest in-gamut match, not an exact equal." },
    ],
  },
  {
    slug: "rgb-to-oklch",
    from: "rgb", to: "oklch",
    intro:
      "RGB to OKLCH lifts a standard 0-255 color into the perceptual OKLCH space. It's the conversion behind modern, accessible design tokens: store hue and chroma once, then generate a whole tint ramp by stepping lightness — and the steps actually look even.",
    formula:
      "Normalize and linearize RGB, apply the OKLab matrix, take cube roots, then convert the resulting (L, a, b) to polar (L, C, H).",
    example: {
      input: "rgb(154, 42, 42)",
      steps: [
        "Linearize → OKLab",
        "L ≈ 0.43, a ≈ 0.13, b ≈ 0.06",
        "C = √(a²+b²) ≈ 0.14, H = atan2(b,a) ≈ 26°",
        "Result: oklch(43% 0.14 26)",
      ],
    },
    code: { lang: "JavaScript", body: `// see rgbToOklch in colorConvert.ts (Ottosson OKLab matrices)
rgbToOklch({r:154,g:42,b:42}); // {l:0.43, c:0.14, h:26}` },
    faq: [
      { q: "What's a typical chroma value?", a: "OKLCH chroma usually runs 0 (grey) to about 0.37 (most vivid sRGB). Muted, editorial palettes sit around 0.02-0.08; brand accents around 0.1-0.2." },
    ],
  },
  {
    slug: "hsv-to-hsl",
    from: "hsv", to: "hsl",
    intro:
      "HSV to HSL keeps the hue but re-bases the other two axes: a color picker speaks HSV (saturation × value), while CSS and design tokens speak HSL (saturation × lightness). The hue is identical; only saturation and the light axis are recomputed.",
    formula:
      "<code>L = V·(1 − S/2)</code>. <code>S_hsl = 0 if L∈{0,1} else (V − L)/min(L, 1−L)</code>. Hue is unchanged.",
    example: {
      input: "hsv(220, 65%, 31%)",
      steps: [
        "V = 0.31, S = 0.65",
        "L = 0.31·(1 − 0.325) ≈ 0.21 → 21%",
        "S_hsl = (0.31 − 0.21)/min(0.21, 0.79) ≈ 0.49 → 49%",
        "Result: hsl(220, 49%, 21%)",
      ],
    },
    code: { lang: "JavaScript", body: `function hsvToHsl(h,s,v){
  s/=100; v/=100;
  const l = v*(1 - s/2);
  const sl = (l===0||l===1) ? 0 : (v - l)/Math.min(l, 1-l);
  return [h, Math.round(sl*100), Math.round(l*100)];
}` },
    faq: [
      { q: "Why does the same color have different S in HSV vs HSL?", a: "The two models measure saturation against different references (value vs lightness). A vivid mid-tone can read as 100% S in HSV but ~50% S in HSL — same color, different yardstick." },
    ],
  },
];

export const PAIR_SLUGS = PAIRS.map((p) => p.slug);
