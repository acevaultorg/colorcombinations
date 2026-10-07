#!/usr/bin/env python3
"""Match Sanzo Wada's 159 English colour names against Robert Ridgway's 1912 index.

Writes src/data/ridgway-wada.json, read by /learn/ridgway-color-names/.

Source: Ridgway, Color Standards and Color Nomenclature (Washington, 1912), public domain,
Project Gutenberg eBook #63087 (plain text). Wada names: the distinct nameRomaji values in
src/data/wada-palettes.ts (the English names of the Seigensha edition, typos kept as printed).

Tiers, strictest first:
  identical    same words (an "A"/"B" plate suffix on the Wada name is ignored)
  punctuation  same letters once hyphens, spaces, apostrophes and case are removed
  spelling     a one- or two-letter difference on a name of 8+ letters (Antwarp/Antwerp)
  none         no Ridgway entry close enough
Manual rejections below are near-matches that are different colours, not misspellings.
The parser reads 1,092 of Ridgway's 1,115 index lines; a missed line can only LOWER the
match count, so the published figure is a floor.

Usage: python3 scripts/build-ridgway-match.py [path/to/pg63087.txt]
       (downloads the text if no path is given)
"""
import json, re, sys, urllib.request
from collections import Counter
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
GUTENBERG = "https://www.gutenberg.org/cache/epub/63087/pg63087.txt"
REJECT = {"Green Blue"}  # nearest by letters is "Bremen Blue", a different colour


def lev(a, b):
    prev = list(range(len(b) + 1))
    for i, ca in enumerate(a, 1):
        cur = [i]
        for j, cb in enumerate(b, 1):
            cur.append(min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (ca != cb)))
        prev = cur
    return prev[-1]


def main():
    text = (Path(sys.argv[1]).read_text(encoding="utf-8") if len(sys.argv) > 1
            else urllib.request.urlopen(GUTENBERG, timeout=60).read().decode("utf-8"))
    ridgway = {}
    for line in text.splitlines():
        m = re.match(r"^\s*\*?([A-Z][A-Za-z0-9'’ .()-]+?)\s{2,}([IVXL]+)\s+(\S+)", line)
        if m:
            name = re.sub(r"\s*\(\d\)$", "", m.group(1).strip())
            ridgway.setdefault(name, (m.group(2), m.group(3)))
    if len(ridgway) < 1000:
        sys.exit(f"parsed only {len(ridgway)} Ridgway names; the text format changed")

    src = (ROOT / "src/data/wada-palettes.ts").read_text(encoding="utf-8")
    wada = sorted(set(re.findall(r'nameRomaji:\s*"([^"]+)"', src)))
    if len(wada) != 159:
        sys.exit(f"expected 159 Wada names, found {len(wada)}")

    norm = lambda s: re.sub(r"[^a-z]", "", s.lower())
    by_norm = {norm(k): k for k in ridgway}
    rows = []
    for w in wada:
        base = re.sub(r"\s*[-|/]?\s*[AB]$", "", w).strip()
        tier, hit = "none", None
        if w in ridgway or base in ridgway:
            tier, hit = "identical", (w if w in ridgway else base)
        elif norm(base) in by_norm:
            tier, hit = "punctuation", by_norm[norm(base)]
        elif w not in REJECT and len(norm(base)) >= 8:
            best = min(by_norm, key=lambda k: lev(k, norm(base)))
            if lev(best, norm(base)) <= 2:
                tier, hit = "spelling", by_norm[best]
        rows.append({
            "wada": w,
            "tier": tier,
            "ridgway": hit,
            "plate": ridgway[hit][0] if hit else None,
        })

    # Positive control: names checked by hand in the Gutenberg text on 2026-10-07.
    must = {"Hay's Russet": "identical", "Isabella Color": "identical", "Antwarp Blue": "spelling"}
    got = {r["wada"]: r["tier"] for r in rows}
    for k, v in must.items():
        if got.get(k) != v:
            sys.exit(f"control failed: {k} is {got.get(k)}, expected {v}")

    out = ROOT / "src/data/ridgway-wada.json"
    out.write_text(json.dumps({"ridgwayNamesParsed": len(ridgway), "rows": rows},
                              ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    print(len(ridgway), "Ridgway names;", dict(Counter(r["tier"] for r in rows)), "->", out)


if __name__ == "__main__":
    main()
