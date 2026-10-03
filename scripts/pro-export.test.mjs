// Round-trip tests for src/lib/pro-export.ts (Palette Pro slice 1, card mushlff2bdotwe, 2026-10-03).
// Run: node scripts/pro-export.test.mjs   (Node >= 23.6 strips the .ts types natively)
// Each format is decoded by something other than the code that wrote it:
//   .ase       → a parser written here from the published ASEF layout
//   .swatches  → the system `unzip` (a real-world zip reader), then JSON.parse + HSB → hex
//   Figma JSON → RGBA → hex
// and every decode must give back the palette's own hex values. A sabotage control proves the checks can fail.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { adobeAse, figmaVariables, procreateSwatches, procreateSwatchesJson, hexToRgb, rgbToHex, hsbToRgb, crc32, proFileName } from "../src/lib/pro-export.ts";

const palette = {
  slug: "aizome-test", title: "Indigo & Persimmon", titleJa: "藍と柿", summary: "", description: "", era: "edo",
  moods: ["refined"], dominantHue: "blue",
  colors: [
    { hex: "#1F3A5F", nameJa: "藍", nameRomaji: "Ai", meaning: "indigo" },
    { hex: "#E07A3F", nameRomaji: "Kaki" },
    { hex: "#F4EBD9" },               // no names → "<slug> 3"
    { hex: "#000000" }, { hex: "#FFFFFF" }, { hex: "#808080" },
  ],
};
const want = palette.colors.map((c) => c.hex.toUpperCase());
let n = 0;
const ok = (cond, msg) => { assert.ok(cond, msg); n++; };

// helpers
ok(rgbToHex(hexToRgb("#9a2")) === "#99AA22", "3-digit hex expands");
assert.throws(() => hexToRgb("blue")); n++;
ok(crc32(new TextEncoder().encode("123456789")) === 0xcbf43926, "crc32 check value");

// ---- Figma variables JSON
const fig = figmaVariables(palette);
ok(fig.variables.length === 6 && fig.variables.every((v) => v.resolvedType === "COLOR"), "6 COLOR variables");
ok(JSON.stringify(fig.variables.map((v) => rgbToHex(v.valuesByMode.default))) === JSON.stringify(want), "figma RGBA round-trips to the palette hex");
ok(fig.variables[0].name === "aizome-test/ai" && fig.variables[2].name === "aizome-test/aizome-test-3", "variable names");
ok(fig.variables.every((v) => Object.values(v.valuesByMode.default).every((x) => x >= 0 && x <= 1)), "RGBA in 0..1");

// ---- Adobe .ase: independent decoder
function decodeAse(buf) {
  const dv = new DataView(buf.buffer, buf.byteOffset, buf.byteLength);
  assert.equal(String.fromCharCode(...buf.slice(0, 4)), "ASEF");
  assert.equal(dv.getUint16(4), 1); assert.equal(dv.getUint16(6), 0);
  const count = dv.getUint32(8); let o = 12; const out = { groups: [], colors: [], ends: 0, count };
  const readName = (p) => { const len = dv.getUint16(p); let s = ""; for (let i = 0; i < len - 1; i++) s += String.fromCharCode(dv.getUint16(p + 2 + i * 2)); assert.equal(dv.getUint16(p + 2 + (len - 1) * 2), 0, "name null-terminated"); return [s, p + 2 + len * 2]; };
  for (let k = 0; k < count; k++) {
    const type = dv.getUint16(o), len = dv.getUint32(o + 2), start = o + 6;
    if (type === 0xc001) out.groups.push(readName(start)[0]);
    else if (type === 0xc002) { out.ends++; assert.equal(len, 0); }
    else if (type === 0x0001) {
      const [name, p] = readName(start);
      assert.equal(String.fromCharCode(...buf.slice(p, p + 4)), "RGB ");
      const rgb = { r: dv.getFloat32(p + 4), g: dv.getFloat32(p + 8), b: dv.getFloat32(p + 12) };
      assert.equal(dv.getUint16(p + 16), 2, "colour type normal");
      assert.equal(p + 18 - start, len, "block length matches payload");
      out.colors.push({ name, hex: rgbToHex(rgb) });
    } else throw new Error("unknown block " + type.toString(16));
    o = start + len;
  }
  assert.equal(o, buf.length, "no trailing bytes");
  return out;
}
const ase = decodeAse(adobeAse(palette));
ok(ase.count === 8 && ase.groups[0] === "Indigo & Persimmon" && ase.ends === 1, "ase: 1 group start + 6 colours + 1 group end");
ok(JSON.stringify(ase.colors.map((c) => c.hex)) === JSON.stringify(want), "ase colours round-trip to the palette hex");
ok(ase.colors[0].name === "Ai" && ase.colors[2].name === "aizome-test 3", "ase colour names");

// ---- Procreate .swatches: real unzip
const dir = mkdtempSync(join(tmpdir(), "proexp-"));
try {
  const f = join(dir, "t.swatches"); writeFileSync(f, procreateSwatches(palette));
  const listing = execFileSync("unzip", ["-l", f]).toString();
  ok(/Swatches\.json/.test(listing), "zip lists Swatches.json");
  execFileSync("unzip", ["-tq", f]); n++;   // CRC + structure test by a real zip reader; throws on failure
  const json = execFileSync("unzip", ["-p", f, "Swatches.json"]).toString();
  ok(json === procreateSwatchesJson(palette), "unzipped bytes equal the generated JSON");
  const sw = JSON.parse(json)[0];
  ok(sw.name === "Indigo & Persimmon" && sw.swatches.length === 6, "one named swatch set");
  ok(JSON.stringify(sw.swatches.map((s) => rgbToHex(hsbToRgb({ h: s.hue, s: s.saturation, b: s.brightness })))) === JSON.stringify(want), "HSB round-trips to the palette hex");
  ok(sw.swatches.every((s) => [s.hue, s.saturation, s.brightness].every((x) => x >= 0 && x <= 1) && s.alpha === 1 && s.colorSpace === 0), "HSB in 0..1");

  // ---- sabotage control: a corrupted file must fail the same checks
  const bad = procreateSwatches(palette); bad[bad.length - 30] ^= 0xff; writeFileSync(f, bad);
  let failed = false; try { execFileSync("unzip", ["-tq", f], { stdio: "ignore" }); } catch { failed = true; }
  ok(failed, "sabotage: a corrupted zip fails unzip -t");
  const badAse = adobeAse(palette); badAse[11] ^= 1;   // block count 8 → 9: the decoder must run off the end
  let aseFailed = false; try { decodeAse(badAse); } catch { aseFailed = true; }
  ok(aseFailed, "sabotage: a corrupted .ase block count fails the decoder");
  const badColour = adobeAse(palette); const dec = decodeAse(badColour); // control on VALUES: flip one float byte
  const firstRgb = adobeAse(palette).findIndex((_, i, a) => i > 12 && a[i] === 0x52 && a[i + 1] === 0x47 && a[i + 2] === 0x42 && a[i + 3] === 0x20);
  badColour[firstRgb + 5] ^= 0x40;
  ok(JSON.stringify(decodeAse(badColour).colors.map((c) => c.hex)) !== JSON.stringify(want) && dec.colors.length === 6, "sabotage: a changed float byte changes the decoded hex");
} finally { rmSync(dir, { recursive: true, force: true }); }

ok(proFileName(palette, "ase") === "colorcombinations-aizome-test.ase" && proFileName(palette, "json") === "colorcombinations-aizome-test.figma-variables.json", "file names");
console.log(`pro-export: ${n} checks passed`);
