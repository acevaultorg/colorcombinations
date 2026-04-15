# Reddit — r/graphic_design post

**Subreddit:** https://www.reddit.com/r/graphic_design/
**Audience:** working graphic designers. More practical focus than
r/design, more print-aware than r/web_design.
**Tone:** utility-first. They want to know if it helps them do their job.
**Best day/time:** Wednesday or Thursday, 10am–12pm Eastern.
**Flair:** check current sub rules; pick the flair closest to "resource"
or "discussion".

This sub has strict anti-self-promo rules. If the title reads like an
ad, it gets removed. Lead with the tool's utility, not the rebuild
narrative.

---

## Title

> Free historical color archive — 348 palettes from Sanzo Wada's 1933 dictionary, with Tailwind/CSS/JSON exports and WCAG contrast for each pair

## Body

> Posting this because it's a tool I would have wanted as a working
> designer and I couldn't find one that existed, so I built it.
>
> The archive: https://colorcombinations.org
>
> What it is: the complete 348-plate catalog from Sanzo Wada's 1933
> *Dictionary of Color Combinations* (配色事典), reconstructed from the
> MIT-licensed mattdesl/dictionary-of-colour-combinations dataset, plus
> 30 hand-written editorial entries on traditional Japanese color names
> (紅 kurenai, 藍 ai, 萌黄 moegi, etc.).
>
> **What makes it useful for graphic design work specifically:**
>
> 1. **Every palette has a contrast matrix.** For each pair of colors in
>    a plate, the site shows WCAG AA / AA-Large / AAA ratings so you know
>    whether you can use it for body text, display, or only for solid
>    shapes. Saves a pass through WebAIM.
> 2. **Exports are drop-in.** The palette-detail pages export to hex
>    list, CSS custom properties, Tailwind v4 config, or JSON. For
>    Figma, there's a $3-5 pay-what-you-want bundle with design tokens
>    as a drag-in file (bundle optional; the rest is free).
> 3. **Reverse color dictionary.** 211 named colors with their own
>    detail pages, each showing every palette that contains the color.
>    If a client has fixed a brand hex and you need to find what
>    historical practice paired with it, start there.
> 4. **Taxonomy that matches briefs.** Collections are organized by
>    practical use case — Branding, Websites, Autumn, Minimalist, Indigo,
>    Bold — not by era or theory. That matches how real briefs arrive.
>
> **Technical notes:** static site, no signup, no tracking unless you
> opt in. Works on anything with a browser. Uses no AI image generation;
> everything is deterministic hex values from a documented source.
>
> **Things I'd love design-specific feedback on:**
>
> - Are the exports in the right formats? I'm missing ASE (Adobe Swatch
>   Exchange) — worth adding?
> - Does "era + mood + dominant-hue" as a filter set feel right, or is
>   it clutter? I went back and forth on this.
> - The collections page has 8 curated themes. What's missing — what
>   would YOU filter by?

---

## Anticipated comments — pre-written replies

### "Can I use these for client work?"

> Yes. Hex values are facts, not copyrighted. The traditional Japanese
> color names (紅, 藍, etc.) have been in cultural use for centuries and
> are part of the commons. The only copyrighted content on the site is
> the editorial descriptions I wrote — the palettes themselves are
> yours to use.

### "Missing ASE export"

> Fair point — noting this. It's on the list. Currently 4 formats; ASE
> would be the 5th. Would also consider Sketch palette files if anyone
> still uses Sketch.

### "What's the tip-jar bundle actually for?"

> It packages all 378 palettes as Figma design tokens (W3C-spec JSON,
> drag-in), Tailwind v4+v3 configs, CSS vars, 378 SVG plate files, and
> the full dataset as JSON. Everything in the bundle is already on the
> site — the bundle is for the workflow where you want one zip on your
> disk instead of bookmarking 378 URLs. Pay what you want, $3 floor.

---

## When to post this vs r/web_design

Space r/graphic_design and r/web_design at least 3-4 days apart. They
have overlapping audiences, and a same-day dual-post gets the second one
auto-filtered.

**Suggested order:**

1. r/web_design (Monday / Tuesday)
2. r/graphic_design (Thursday / Friday)
3. r/design (the following Tuesday)

Each gets a different framing — web_design is tech-forward,
graphic_design is utility-forward, design is visual-forward.
