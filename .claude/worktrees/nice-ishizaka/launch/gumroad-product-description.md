# Gumroad product — ready to paste

**Where to create:** https://app.gumroad.com/products/new
**Product type:** Digital product
**Account:** paulomdevries@gmail.com (per cluster analytics-account rule)

This is the copy that goes into the Gumroad product-creation form.
Everything here is paste-ready.

---

## Field-by-field

### Name

> Support the archive — The Complete Wada Bundle

### Permalink

> wada-bundle

Resulting URL: `https://[yourname].gumroad.com/l/wada-bundle` — this is
the URL that goes into `src/config/monetization.ts` `BUNDLE.checkoutUrl`.

### Pricing

- **Pricing type:** Pay what you want
- **Minimum:** $3
- **Suggested:** $5

Do NOT set a higher minimum. The tip-jar framing works because the
floor is low. A $9 floor would re-frame this as a product and the
conversion would drop sharply — the whole pitch is that the data is
free on the site.

### Summary (short description, shown in search)

> All 378 palettes from colorcombinations.org as Figma tokens, Tailwind
> configs, CSS variables, SVG plates, and JSON — on your disk, one zip.

### Description (long, markdown-supported)

```markdown
**What this is:** A thank-you deliverable for people who've used
[colorcombinations.org](https://colorcombinations.org) and want to
support the archive staying free and maintained.

The data inside this bundle is all on the site. This isn't a product
you need. It's a workflow convenience — all 378 palettes as designer-
ready files, packaged as one zip, so you can work offline without
bookmarking 378 URLs.

## What's inside (384 files, ~50 KB zipped)

- **Figma design tokens** — W3C-spec JSON, drag into any Figma file,
  instantly populates your Local Variables panel with all 378 colors
  organized by palette.
- **Tailwind CSS configs** — one for Tailwind v4 (`@theme` block)
  and one for Tailwind v3 (`theme.extend.colors`). Drop in, done.
- **CSS custom properties** — every palette as a ready-to-include
  stylesheet. Wraps cleanly under a `:root` selector.
- **378 SVG plates** — print-ready vector plates, one per palette,
  scalable to any size for mockups, documents, or museum-style prints.
- **Full dataset (JSON)** — colors, names (English + Japanese + romaji
  + meaning), era, moods, dominant hue. For building your own tools.
- **README** — how to use each format, license notes, source credits.

## Who this is for

- **Designers** who want the full archive accessible offline or
  committed into a design-system repo without re-downloading from the
  site.
- **Developers** who want a single drop-in source of truth instead of
  five different export endpoints.
- **Educators** using the archive in a color-theory course who want
  every plate as a ready-made slide asset.
- **People who just want to say thanks** — $3 floor, pay what you
  want, no pressure.

## License

Hex values are facts and not copyrightable. Traditional Japanese color
names are cultural commons. The SVG plate files, dataset JSON, and
format configs are released under MIT — use in any project,
commercial or personal, no attribution required.

The curatorial text (editorial descriptions, usage notes, historical
context) is © the archive author — quoting it in design docs, blog
posts, and client presentations is fine; republishing the full
editorial corpus as your own is not.

## FAQ

**"The data is all free on the site — why would I buy this?"**

You wouldn't "buy" it, really — you'd tip to keep the archive alive,
and the bundle is the thank-you. If the free version covers what you
need, keep using the free version.

**"How does this compare to the 2010 Seigensha reprint of Wada's book?"**

The book is the book. This bundle is a digital companion. If you love
the archive, buy both — the Seigensha reprint is a beautiful object
and I've linked it from /about. The bundle is for the workflow.

**"How are the hex values derived?"**

From the MIT-licensed mattdesl/dictionary-of-colour-combinations
dataset, which is the community's best-effort transcription of
Wada's 1933 plates. They're reconstructions, not authoritative. For
critical print work, adjust by eye against a physical reference.

**"Do I get future updates?"**

Yes. Gumroad emails existing buyers when I upload a new version.
Roadmap: higher-fidelity Japanese cross-references, era re-tagging
across the full 348, and ASE (Adobe Swatch Exchange) as a 6th format.

**"Can I use this in commercial projects?"**

Yes. See License above.
```

### Thank-you message (post-purchase)

> Thank you for supporting the archive.
>
> The download is attached to your purchase email. If you run into any
> format issues or spot something that should be corrected, reply to
> this email — I read everything.
>
> If the bundle saves you time, the single most useful thing you can do
> for the project is share one palette you used from it on Bluesky,
> Mastodon, or your blog. That's how more people find the archive.
>
> — Paulo

### Tags (Gumroad search)

- color palette
- design tokens
- japanese design
- tailwind
- css variables
- figma
- sanzo wada
- color theory
- color dictionary
- design system

### Call-to-action button text

> Support the archive

(NOT "Buy now" — breaks the tip-jar framing.)

---

## After creating the product

1. Copy the live product URL from Gumroad (not the admin preview URL).
   It looks like `https://[yourname].gumroad.com/l/wada-bundle`.
2. Open `src/config/monetization.ts` in the repo.
3. Replace line:
   ```ts
   checkoutUrl: "/shop#bundle-coming-soon" as const,
   ```
   with:
   ```ts
   checkoutUrl: "https://[yourname].gumroad.com/l/wada-bundle" as const,
   ```
4. Rebuild + redeploy:
   ```
   npm run build
   wrangler pages deploy dist --project-name=colorcombinations --branch=main
   ```
5. Test: visit https://colorcombinations.org/shop, click any "Support
   the archive" button, confirm it goes to the real Gumroad page.

## Pricing psychology note

The first purchase is the hardest. Once the product exists with even
one sale, social proof kicks in and conversion rises. If it sits at
zero sales for a week, buy one yourself (gift the $5 to a friend) —
the "sales" counter on Gumroad is a strong signal and the minimum
floor is low enough that seeding it costs nothing meaningful.

## Variant prices to consider later

Once you have >10 organic buyers, test these:
- $0-$3 floor, $5 suggested (current) — baseline
- $5-$10 floor, $15 suggested — premium tier framing
- Bundle + 30-minute custom-palette consult at $75

Don't test any of these until you have a baseline. First €100 is the
only thing that matters right now.
