#!/usr/bin/env python3
"""
Render a contact sheet: each painting beside the palette we selected for it.

This is the accuracy gate that matters. Cluster statistics can look perfectly
healthy while the palette fails the only test a designer applies — "does this
read as that painting?" The sheet exists to be looked at, not computed on.
"""

import json
import urllib.parse
import urllib.request
from pathlib import Path

from PIL import Image, ImageDraw

HERE = Path(__file__).parent
API = "https://commons.wikimedia.org/w/api.php"
UA = "colorcombinations-palette-builder/1.0 (https://colorcombinations.org; contact@acevault.org)"

THUMB_W, ROW_H, SW = 300, 150, 100


def get(url):
    return urllib.request.urlopen(
        urllib.request.Request(url, headers={"User-Agent": UA}), timeout=60
    ).read()


def thumb_url(filename, width=600):
    q = {"action": "query", "titles": filename, "prop": "imageinfo",
         "iiprop": "url", "iiurlwidth": str(width), "format": "json"}
    d = json.loads(get(API + "?" + urllib.parse.urlencode(q)))
    return list(d["query"]["pages"].values())[0]["imageinfo"][0]["thumburl"]


def main():
    data = json.loads((HERE / "palettes-selected.json").read_text())
    rows = len(data)
    sheet = Image.new("RGB", (THUMB_W + SW * 6 + 20, ROW_H * rows), "white")
    draw = ImageDraw.Draw(sheet)

    for i, p in enumerate(data):
        y = i * ROW_H
        try:
            path = HERE / f"_v_{p['slug']}.jpg"
            if not path.exists():
                path.write_bytes(get(thumb_url(p["source"]["commonsFile"])))
            im = Image.open(path).convert("RGB")
            im.thumbnail((THUMB_W, ROW_H - 8), Image.Resampling.LANCZOS)
            sheet.paste(im, (4, y + 4))
        except Exception as e:
            draw.text((8, y + 8), f"[img fail] {e}", fill="red")

        for j, c in enumerate(p["colors"]):
            x = THUMB_W + 12 + j * SW
            draw.rectangle([x, y + 4, x + SW - 4, y + ROW_H - 26], fill=c["hex"])
            draw.text((x + 3, y + ROW_H - 22), c["hex"], fill="black")
            if c["role"] == "accent":
                draw.text((x + SW - 16, y + 8), "*", fill="white")
        draw.text((8, y + ROW_H - 18), p["slug"][:38], fill="black")

    out = HERE / "verify-sheet.png"
    sheet.save(out)
    print(f"wrote {out}  ({sheet.size[0]}x{sheet.size[1]})")


if __name__ == "__main__":
    main()
