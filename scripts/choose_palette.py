#!/usr/bin/env python3
"""
Palette SELECTION — the step that decides which extracted clusters ship.

Why this exists
---------------
Pure population-weighted k-means returns a painting's *grounds*: canvas, shadow,
sky-mass. It reliably throws away the colour the work is actually famous for,
because that colour is often a small fraction of the surface. Run naively,
Monet's "Impression, Sunrise" comes back with no orange in it at all — the sun
is perhaps 1% of the picture, and the sun is the entire point.

So selection is deliberately two-part:

  GROUNDS  — the 3 largest clusters by area. These are what the painting *is*
             made of, and they keep the palette honest and usable as a base.
  ACCENTS  — up to 3 further clusters ranked by area x chroma. A small, vivid
             cluster can outrank a large, grey one here. These are what the
             painting is *recognised* by.

Both are real pixels from the canvas (snapped in the extraction step), so
nothing here invents a colour. We are choosing which true colours to surface,
and saying plainly how we chose.
"""

import json
import numpy as np
from pathlib import Path

HERE = Path(__file__).parent


def hex_to_rgb(h):
    h = h.lstrip("#")
    return np.array([int(h[i:i + 2], 16) for i in (0, 2, 4)], dtype=float)


def srgb_to_linear(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def rgb_to_lab(rgb):
    lin = srgb_to_linear(np.asarray(rgb, dtype=float).reshape(-1, 3))
    m = np.array([[0.4124564, 0.3575761, 0.1804375],
                  [0.2126729, 0.7151522, 0.0721750],
                  [0.0193339, 0.1191920, 0.9503041]])
    xyz = (lin @ m.T) / np.array([0.95047, 1.0, 1.08883])
    eps, kappa = 216 / 24389, 24389 / 27
    f = np.where(xyz > eps, np.cbrt(xyz), (kappa * xyz + 16) / 116)
    return np.stack([116 * f[:, 1] - 16,
                     500 * (f[:, 0] - f[:, 1]),
                     200 * (f[:, 1] - f[:, 2])], axis=1)


def chroma(hexval):
    lab = rgb_to_lab(hex_to_rgb(hexval))[0]
    return float(np.hypot(lab[1], lab[2]))


def lightness(hexval):
    return float(rgb_to_lab(hex_to_rgb(hexval))[0][0])


def select(colors, n_grounds=3, n_accents=3):
    for c in colors:
        c["chroma"] = round(chroma(c["hex"]), 1)
        c["lightness"] = round(lightness(c["hex"]), 1)

    by_area = sorted(colors, key=lambda c: -c["share"])
    grounds = by_area[:n_grounds]
    rest = by_area[n_grounds:]

    # Accents: vividness outweighs area, deliberately and heavily.
    # The exponent on share is low (0.10) so a cluster covering 2% of a canvas
    # can still win a slot, and chroma is divided by only 4 so intensity
    # dominates the ranking. Without this, every painting whose character comes
    # from a small brilliant passage returns as mud. Tuned in tune.py against
    # Starry Night and Impression, Sunrise.
    #
    # Accents are then picked one at a time with a hue-diversity penalty, so a
    # painting built from one hue family cannot spend all three accent slots on
    # near-identical swatches. This is what surfaces the blue turban in Girl
    # with a Pearl Earring, whose warm golds would otherwise take every slot,
    # and it stops The Kiss returning six almost indistinguishable golds.
    # Grounds are left alone — they are chosen by area and must stay honest.
    def hue(c):
        lab = rgb_to_lab(hex_to_rgb(c["hex"]))[0]
        return float(np.degrees(np.arctan2(lab[2], lab[1])) % 360)

    def hue_gap(a, b):
        d = abs(a - b) % 360
        return min(d, 360 - d)

    chosen_hues = [hue(c) for c in grounds if c["chroma"] > 8]
    accents, pool = [], list(rest)
    for _ in range(n_accents):
        if not pool:
            break
        def score(c):
            base = (c["share"] ** 0.10) * (1.0 + c["chroma"] / 4.0)
            # near-duplicate hues are damped, not banned: a genuinely dominant
            # second note in the same family can still earn its place
            if c["chroma"] > 8 and chosen_hues:
                nearest = min(hue_gap(hue(c), h) for h in chosen_hues)
                if nearest < 25:
                    base *= 0.35
                elif nearest < 45:
                    base *= 0.7
            return base

        best = max(pool, key=score)
        pool.remove(best)
        accents.append(best)
        if best["chroma"] > 8:
            chosen_hues.append(hue(best))

    out = []
    for c in grounds:
        out.append({**c, "role": "ground"})
    for c in accents:
        out.append({**c, "role": "accent"})

    # present light -> dark; designers read a ramp faster than a ranking
    out.sort(key=lambda c: -c["lightness"])
    return out


def main():
    data = json.loads((HERE / "palettes-raw.json").read_text())
    for p in data:
        p["colors"] = select(p["colors"])
    (HERE / "palettes-selected.json").write_text(json.dumps(data, indent=2))

    for p in data:
        swatches = "  ".join(
            f"{c['hex']}{'*' if c['role'] == 'accent' else ' '}C{c['chroma']:.0f}"
            for c in p["colors"]
        )
        print(f"{p['slug'][:34]:<34} {swatches}")
    print(f"\n{len(data)} palettes selected  (* = accent)")


if __name__ == "__main__":
    main()
