# Contrast-engine verification, control-first (2026-09-10)

The site's computed verdicts are WCAG contrast ratios + AA/AAA levels, rendered on three surfaces:
`/palettes/<slug>/` (ContrastMatrix — every in-plate pair + "strongest pair"), `/data/sanzo-wada-wcag-contrast.csv`
(the 348-plate aggregate study) and `/api/colors/<slug>.json` (`contrast.white/black`). Four separate copies of the
formula live in the repo (`lib/color.ts`, `lib/colorConvert.ts`, the CSV route, the colors API) — this script is a
FIFTH, in Python, built only from `src/data/*.ts` and the W3C formula, and diffed against the RENDERED output.

    mkdir -p /tmp/cc-verify/pages /tmp/cc-verify/api && cd /tmp/cc-verify
    curl -sSL "https://colorcombinations.org/sitemap-0.xml?cb=$RANDOM" | grep -oE '<loc>[^<]+' | sed 's/<loc>//' > urls.txt
    grep '/palettes/' urls.txt | sed 's#.*/palettes/##; s#/$##' | xargs -P8 -I{} sh -c 'curl -sS "https://colorcombinations.org/palettes/{}/?cb=$RANDOM" -o pages/{}.html'
    grep -E '/colors/[^/]+/$' urls.txt | sed 's#.*/colors/##; s#/$##' | xargs -P8 -I{} sh -c 'curl -sS "https://colorcombinations.org/api/colors/{}.json?cb=$RANDOM" -o api/{}.json'
    curl -sS "https://colorcombinations.org/data/sanzo-wada-wcag-contrast.csv?cb=$RANDOM" -o live.csv
    CC_WORK=/tmp/cc-verify python3 scripts/verify-contrast-engine.py            # baseline: 0 / 0 / 0
    CC_WORK=/tmp/cc-verify python3 scripts/verify-contrast-engine.py nogamma    # control: must fire on all 3 surfaces
    CC_WORK=/tmp/cc-verify python3 scripts/verify-contrast-engine.py aa4        # control: must fire on the LEVEL fields only
    python3 scripts/audit-palette-records.py                                    # record self-consistency
    python3 scripts/audit-palette-records.py inject                             # control: injected bad plate must add HIGHs

2026-09-10 result (378 pages · 1,236 pair verdicts · 19 CSV cells · 210 colours × 2 backgrounds): **0 mismatches on
every surface.** Controls: `nogamma` → 1,229 / 406 / 378 · 18 · 416 / 240; `aa4` → 0 / 45 / 0 · 6 · 0 / 21 — each
surface's detector fires independently, so the zeros are measurements. Record audit: 378 plates, 0 HIGH, 0 WARN
(the injected plate adds 5 HIGH + 3 WARN).

Not verified by this: `bestTextColorOn` (luminance > 0.5 → dark text) as rendered on `/colors/<slug>/` hero and the
colors-that-go-with pages — same luminance function, different surface, not diffed. And nothing here tests whether
WCAG 2.x contrast models legibility; that is the standard's claim, not the engine's.

Note: all four in-repo copies use the WCAG 2.0 sRGB knee (0.03928); 2.1 moved it to 0.04045. No 8-bit channel value
falls between the two (10/255 = 0.0392, 11/255 = 0.0431), so the outputs are identical for hex input.
