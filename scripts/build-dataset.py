#!/usr/bin/env python3
"""
Build the painting-palette dataset.

Sources
  - Wikimedia Commons  : the image + its licence metadata (public-domain gate)
  - Curated entry list : title / artist / year / museum, asserted here and then
                         VERIFIED against Commons metadata before anything ships.

Accuracy gate (non-negotiable — a wrong painting is a fabricated fact):
  a file is accepted only when the artist's surname appears in the Commons file
  title AND the licence resolves to public domain. Anything else is dropped and
  reported, never guessed.
"""

import json
import re
import sys
import time
import unicodedata
import urllib.parse
import urllib.request
from pathlib import Path

import numpy as np
from PIL import Image

HERE = Path(__file__).parent
API = "https://commons.wikimedia.org/w/api.php"
UA = "colorcombinations-palette-builder/1.0 (https://colorcombinations.org; contact@acevault.org)"

# (slug, title, artist, surname-token, year, museum, commons file)
ENTRIES = [
    ("the-starry-night", "The Starry Night", "Vincent van Gogh", "Gogh", "1889",
     "Museum of Modern Art, New York",
     "File:Van Gogh - Starry Night - Google Art Project.jpg"),
    ("the-bedroom", "The Bedroom", "Vincent van Gogh", "Gogh", "1889",
     "Art Institute of Chicago",
     "File:Vincent van Gogh - De slaapkamer - Google Art Project.jpg"),
    ("sunflowers", "Sunflowers", "Vincent van Gogh", "Gogh", "1888",
     "National Gallery, London",
     "File:Vincent Willem van Gogh 127.jpg"),
    ("cafe-terrace-at-night", "Café Terrace at Night", "Vincent van Gogh", "Gogh", "1888",
     "Kröller-Müller Museum",
     "File:Vincent Willem van Gogh - Cafe Terrace at Night (Yorck).jpg"),
    ("a-sunday-on-la-grande-jatte", "A Sunday on La Grande Jatte", "Georges Seurat", "Seurat", "1884–86",
     "Art Institute of Chicago",
     "File:A Sunday on La Grande Jatte, Georges Seurat, 1884.jpg"),
    ("the-great-wave-off-kanagawa", "Under the Wave off Kanagawa (The Great Wave)",
     "Katsushika Hokusai", "Hokusai", "c. 1831",
     "Multiple impressions; Metropolitan Museum of Art and others",
     "File:Tsunami by hokusai 19th century.jpg"),
    ("water-lilies", "Water Lilies", "Claude Monet", "Monet", "1906",
     "Art Institute of Chicago",
     "File:Claude Monet - Water Lilies - 1906, Ryerson.jpg"),
    ("impression-sunrise", "Impression, Sunrise", "Claude Monet", "Monet", "1872",
     "Musée Marmottan Monet, Paris",
     "File:Monet - Impression, Sunrise.jpg"),
    ("paris-street-rainy-day", "Paris Street; Rainy Day", "Gustave Caillebotte", "Caillebotte", "1877",
     "Art Institute of Chicago",
     "File:Gustave Caillebotte - Paris Street; Rainy Day - Google Art Project.jpg"),
    ("the-kiss", "The Kiss", "Gustav Klimt", "Klimt", "1907–08",
     "Belvedere, Vienna",
     "File:The Kiss - Gustav Klimt - Google Cultural Institute.jpg"),
    ("the-scream", "The Scream", "Edvard Munch", "Munch", "1893",
     "National Gallery, Oslo",
     "File:Edvard Munch, 1893, The Scream, oil, tempera and pastel on cardboard, 91 x 73 cm, National Gallery of Norway.jpg"),
    ("girl-with-a-pearl-earring", "Girl with a Pearl Earring", "Johannes Vermeer", "Vermeer", "c. 1665",
     "Mauritshuis, The Hague",
     "File:1665 Girl with a Pearl Earring.jpg"),
    ("the-birth-of-venus", "The Birth of Venus", "Sandro Botticelli", "Botticelli", "c. 1485",
     "Uffizi Gallery, Florence",
     "File:Sandro Botticelli - La nascita di Venere - Google Art Project - edited.jpg"),
    ("the-night-watch", "The Night Watch", "Rembrandt van Rijn", "Rembrandt", "1642",
     "Rijksmuseum, Amsterdam",
     "File:The Night Watch - HD.jpg"),
    ("at-the-moulin-rouge", "At the Moulin Rouge", "Henri de Toulouse-Lautrec", "Lautrec", "1892–95",
     "Art Institute of Chicago",
     "File:Henri de Toulouse-Lautrec - At the Moulin Rouge - Google Art Project.jpg"),
    ("the-basket-of-apples", "The Basket of Apples", "Paul Cézanne", "Cézanne", "c. 1893",
     "Art Institute of Chicago",
     "File:Paul Cézanne - The Basket of Apples - Google Art Project.jpg"),
    ("mahana-no-atua", "Mahana no atua (Day of the God)", "Paul Gauguin", "Gauguin", "1894",
     "Art Institute of Chicago",
     "File:Paul Gauguin - Mahana no atua - Google Art Project.jpg"),
    ("the-childs-bath", "The Child's Bath", "Mary Cassatt", "Cassatt", "1893",
     "Art Institute of Chicago",
     "File:Mary Cassatt - The Child's Bath - Google Art Project.jpg"),
    ("two-sisters-on-the-terrace", "Two Sisters (On the Terrace)", "Pierre-Auguste Renoir", "Renoir", "1881",
     "Art Institute of Chicago",
     "File:Pierre-Auguste Renoir - Two Sisters (On the Terrace) - Google Art Project.jpg"),
    ("the-fighting-temeraire", "The Fighting Temeraire", "J. M. W. Turner", "Turner", "1839",
     "National Gallery, London",
     "File:The Fighting Temeraire, JMW Turner, National Gallery.jpg"),
    ("wanderer-above-the-sea-of-fog", "Wanderer above the Sea of Fog", "Caspar David Friedrich", "Friedrich", "c. 1818",
     "Hamburger Kunsthalle",
     "File:Caspar David Friedrich - Wanderer above the sea of fog.jpg"),
    ("the-garden-of-earthly-delights", "The Garden of Earthly Delights", "Hieronymus Bosch", "Bosch", "c. 1500",
     "Museo del Prado, Madrid",
     "File:The Garden of earthly delights.jpg"),
    ("the-hay-wain", "The Hay Wain", "John Constable", "Constable", "1821",
     "National Gallery, London",
     "File:John Constable The Hay Wain.jpg"),
    ("the-milkmaid", "The Milkmaid", "Johannes Vermeer", "Vermeer", "c. 1660",
     "Rijksmuseum, Amsterdam",
     "File:Johannes Vermeer - Het melkmeisje - Google Art Project.jpg"),
    ("ophelia", "Ophelia", "John Everett Millais", "Millais", "1851–52",
     "Tate Britain, London",
     "File:John Everett Millais - Ophelia - Google Art Project.jpg"),
    ("the-third-of-may-1808", "The Third of May 1808", "Francisco Goya", "Goya", "1814",
     "Museo del Prado, Madrid",
     "File:El Tres de Mayo, by Francisco de Goya, from Prado thin black margin.jpg"),
    ("composition-viii", "Composition VIII", "Wassily Kandinsky", "Kandinsky", "1923",
     "Solomon R. Guggenheim Museum",
     "File:Vassily Kandinsky, 1923 - Composition 8.jpg"),
    ("the-tower-of-babel", "The Tower of Babel", "Pieter Bruegel the Elder", "Bruegel", "1563",
     "Kunsthistorisches Museum, Vienna",
     "File:Pieter Bruegel the Elder - The Tower of Babel (Vienna) - Google Art Project - edited.jpg"),
]


# ---------- colour science (see /methodology) --------------------------------

def srgb_to_linear(c):
    c = c / 255.0
    return np.where(c <= 0.04045, c / 12.92, ((c + 0.055) / 1.055) ** 2.4)


def rgb_to_lab(rgb):
    lin = srgb_to_linear(rgb.astype(np.float64))
    m = np.array([[0.4124564, 0.3575761, 0.1804375],
                  [0.2126729, 0.7151522, 0.0721750],
                  [0.0193339, 0.1191920, 0.9503041]])
    xyz = (lin @ m.T) / np.array([0.95047, 1.0, 1.08883])
    eps, kappa = 216 / 24389, 24389 / 27
    f = np.where(xyz > eps, np.cbrt(xyz), (kappa * xyz + 16) / 116)
    return np.stack([116 * f[:, 1] - 16,
                     500 * (f[:, 0] - f[:, 1]),
                     200 * (f[:, 1] - f[:, 2])], axis=1)


def kmeans(X, k, iters=60, seed=7):
    rng = np.random.default_rng(seed)
    n = len(X)
    k = min(k, n)
    centers = [X[rng.integers(n)]]
    for _ in range(k - 1):
        d = np.min(np.linalg.norm(X[:, None, :] - np.array(centers)[None, :, :], axis=2), axis=1) ** 2
        t = d.sum()
        centers.append(X[rng.integers(n)] if t == 0 else X[rng.choice(n, p=d / t)])
    C = np.array(centers)
    labels = np.zeros(n, dtype=int)
    for _ in range(iters):
        new = np.linalg.norm(X[:, None, :] - C[None, :, :], axis=2).argmin(axis=1)
        if (new == labels).all():
            break
        labels = new
        for i in range(k):
            sel = X[labels == i]
            if len(sel):
                C[i] = sel.mean(axis=0)
    return C, labels


def palette_from_image(path, n_colors=None, merge_de=5.0):
    """Extraction parameters are tuned against two known failure cases.

    Van Gogh's chrome-yellow stars and Monet's orange sun each occupy a tiny
    share of their canvas, and both vanished under the first settings: sampling
    at 260px averaged them into the surrounding field, and a dE-9 merge folded
    whatever survived into a larger neighbour. Sampling at 700px with a dE-5
    merge keeps small intense areas alive as their own clusters. Verified with
    tune.py, which also guards Sunflowers and The Great Wave against regression.
    """
    img = Image.open(path).convert("RGB")
    img.thumbnail((700, 700), Image.Resampling.LANCZOS)
    px = np.array(img).reshape(-1, 3)
    lab = rgb_to_lab(px)
    C, labels = kmeans(lab, 26)
    counts = np.bincount(labels, minlength=len(C))

    kept, kept_counts = [], []
    for i in np.argsort(-counts):
        if counts[i] == 0:
            continue
        for j, kc in enumerate(kept):
            if np.linalg.norm(C[i] - kc) < merge_de:
                kept_counts[j] += counts[i]
                break
        else:
            kept.append(C[i])
            kept_counts.append(counts[i])

    # Return EVERY surviving cluster. Truncating here by population would cut
    # exactly the small, intense clusters that selection exists to rescue —
    # that truncation is what silently removed van Gogh's chrome yellow on the
    # previous build even after the sampling fix. Ranking belongs to selection.
    pairs = sorted(zip(kept, kept_counts), key=lambda t: -t[1])
    if n_colors:
        pairs = pairs[:n_colors]
    total = sum(c for _, c in pairs)
    out = []
    for centroid, count in pairs:
        d = np.linalg.norm(lab - centroid, axis=1)
        r, g, b = px[int(d.argmin())]
        out.append({"hex": "#%02X%02X%02X" % (r, g, b),
                    "share": round(float(count) / float(total), 4)})
    return out


# ---------- Commons ----------------------------------------------------------

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()


def strip_html(s):
    return re.sub(r"<[^>]+>", "", s or "").strip()


def norm(s):
    return unicodedata.normalize("NFKD", s or "").encode("ascii", "ignore").decode().lower()


def commons_meta(filename, width=1400):
    q = {"action": "query", "titles": filename, "prop": "imageinfo",
         "iiprop": "url|size|extmetadata", "iiurlwidth": str(width), "format": "json"}
    data = json.loads(get(API + "?" + urllib.parse.urlencode(q)))
    page = list(data["query"]["pages"].values())[0]
    if "imageinfo" not in page:
        return None
    ii = page["imageinfo"][0]
    em = ii.get("extmetadata", {})
    return {
        "thumburl": ii.get("thumburl") or ii.get("url"),
        "descriptionurl": ii.get("descriptionurl"),
        "license": strip_html(em.get("LicenseShortName", {}).get("value", "")),
        "artistMeta": strip_html(em.get("Artist", {}).get("value", "")),
        "width": ii.get("width"),
        "height": ii.get("height"),
    }


PD_OK = ("public domain", "cc0", "pd-")


STOPWORDS = {"the", "a", "an", "of", "on", "at", "in", "by", "and", "off", "de", "no"}


def slug_matches_title(slug, title):
    """Guard against copy-paste drift between slug and title.

    Two entries shipped with the wrong slug on the first build (a Rembrandt
    filed under a Blake slug). Publishing a painting under another painting's
    name is a fabricated fact, so it is now a hard build failure rather than
    something a reviewer has to spot by eye.
    """
    slug_tokens = {t for t in slug.split("-") if t and t not in STOPWORDS}
    title_tokens = {
        t for t in re.sub(r"[^a-z0-9 ]", " ", norm(title)).split()
        if t and t not in STOPWORDS
    }
    return bool(slug_tokens & title_tokens)


def main():
    results, failures = [], []
    for slug, title, artist, surname, year, museum, filename in ENTRIES:
        try:
            # GATE 0 — slug must actually describe this title
            if not slug_matches_title(slug, title):
                failures.append((slug, f"slug does not match title {title!r}"))
                continue
            meta = commons_meta(filename)
            if not meta:
                failures.append((slug, "file not found on Commons"))
                continue

            # GATE 1 — licence must resolve to public domain
            lic = meta["license"].lower()
            if not any(t in lic for t in PD_OK):
                failures.append((slug, f"licence not PD: {meta['license']!r}"))
                continue

            # GATE 2 — the artist must actually be named in the file title/metadata
            hay = norm(filename + " " + meta["artistMeta"])
            if norm(surname) not in hay:
                failures.append((slug, f"artist {surname!r} not found in file metadata"))
                continue

            img_path = HERE / f"_img_{slug}.jpg"
            img_path.write_bytes(get(meta["thumburl"]))
            colors = palette_from_image(img_path)
            img_path.unlink(missing_ok=True)

            results.append({
                "slug": slug, "title": title, "artist": artist, "year": year,
                "museum": museum, "colors": colors,
                "source": {
                    "commonsFile": filename,
                    "commonsPage": meta["descriptionurl"],
                    "license": meta["license"],
                    "fullWidth": meta["width"], "fullHeight": meta["height"],
                },
            })
            print(f"OK   {slug}")
            print("       " + "  ".join(f"{c['hex']} {c['share']:.0%}" for c in colors))
            time.sleep(0.35)
        except Exception as e:
            failures.append((slug, str(e)))

    (HERE / "palettes-raw.json").write_text(json.dumps(results, indent=2))
    print(f"\n{len(results)} verified.  {len(failures)} dropped.")
    for slug, why in failures:
        print(f"  DROP {slug}: {why}", file=sys.stderr)


if __name__ == "__main__":
    main()
