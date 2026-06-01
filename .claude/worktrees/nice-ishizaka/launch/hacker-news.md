# Show HN post — ready to paste

**Submit at:** https://news.ycombinator.com/submit
**Best time:** Tuesday, Wednesday, or Thursday, 8–10am Pacific (so it catches
the US morning wave while EU is still awake). Avoid Monday/Friday.
**Account age:** HN auto-penalizes brand-new accounts. If yours is less than
a week old and has zero karma, lurk and comment first for 24 hours.

---

## Title

> Show HN: The Dictionary of Color Combinations – Sanzo Wada's 1933 catalog, free

(Exactly 76 characters. HN caps at 80. Do NOT change the word order — "Show
HN:" prefix is mandatory; the em dash beats a colon because HN's rendering
treats colons as part of the category label. If "free" feels too salesy,
drop it and use "all 348 palettes".)

## URL

> https://colorcombinations.org/

(Link the homepage, NOT the blog article. HN lets you also submit a "text"
post instead of a URL post — use URL. The article is what Show HN commenters
will click through to after landing on the home page.)

## Text (first comment — post it yourself within 60 seconds of submission)

> I've been building this on evenings for the past couple of weeks. It's a
> reconstruction of Sanzo Wada's 1933 *Dictionary of Color Combinations* —
> the six-volume Japanese color reference book that quietly became an
> underground reference for designers and colorists for about ninety
> years. The original Seigensha reprint goes in and out of print.
>
> I pulled the color data from the community-maintained
> mattdesl/dictionary-of-colour-combinations dataset (MIT), wrote a
> curatorial overlay of 30 editorial deep-dives on the traditional
> shikisai (色彩) names, and shipped the whole thing as a static Astro
> site. Every plate has its own page, a contrast matrix, and an export
> button that gives you the palette as hex / Tailwind config / CSS vars /
> JSON. There's also a color-dictionary index that reverses the lookup:
> 211 named colors × the palettes that use each of them.
>
> The "why" is in the first blog post — I wrote up the case for using a
> curated dictionary instead of a palette generator when you're trying
> to pick something defensible:
> https://colorcombinations.org/blog/how-to-use-sanzo-wada-in-modern-design/
>
> Stack: Astro 5, Tailwind v4, TypeScript strict, Cloudflare Pages. Built
> around the constraint that the whole thing had to load on a phone with
> no JS cost per page. Currently 612 pages, 23M total dist.
>
> Things I'd love feedback on: (a) whether the hex reconstructions for
> the Wada plates feel off to anyone who knows the book, (b) whether the
> taxonomy (era, mood, dominant hue) is useful or clutter, (c) what I'm
> missing that would make this genuinely better than what's already out
> there.
>
> Source data credit goes to Matt DesLauriers' dataset. Domain credit
> goes to not naming another product something-palette-ai.

---

## Anticipated questions — pre-written answers (paste as replies to comments)

### "How is this different from coolors.co / Adobe Color / Color Hunt?"

> Those are generators — infinite novelty, you still have to pick. This is
> a dictionary — 348 curated combinations with historical context. It's the
> difference between a thesaurus and an RNG. Generators are great for
> iteration; dictionaries are better when you want something defensible in
> a client review.

### "The hex values look wrong for 1933 pigments"

> They're reconstructions from the community dataset, not authoritative. I
> flagged this on the blog post — the underlying book used pigments that
> have no exact RGB equivalent, and the dataset is a best-effort. If you
> know the book well and can point to specific plates that read wrong, I'd
> love a pull request or an issue. (The dataset repo is
> mattdesl/dictionary-of-colour-combinations.)

### "Are you going to charge for it?"

> The archive is free, always. There's an optional $3-$5 pay-what-you-want
> bundle on /shop that packages everything into Figma/Tailwind/CSS/SVG files
> for people who want the whole thing on their disk, but the same data is on
> the site and on GitHub. It's framed as a "support the archive" thing, not
> a product. If you want the bigger museum print or the Seigensha reprint
> itself, those are linked from /about as affiliate links to Bookshop.org.

### "Why Astro / Tailwind v4 / Cloudflare Pages?"

> Astro because it generates static HTML per palette at build time — zero
> runtime JS per page, maximum SEO, maximum speed on mobile. Tailwind v4's
> `@theme` block replaces the old `tailwind.config` — way less ceremony.
> Cloudflare Pages because I bought the domain at Cloudflare Registrar and
> single-dashboard DNS beats cross-provider every time.

### "How did you handle the cultural appropriation question?"

> The color names (紅, 藍, 萌黄, etc.) are part of the cultural commons and
> have been in continuous use for centuries — not Wada's invention. The
> /about page has an explicit ethics note. If you're the rights holder of
> something I've reproduced in error, my email's linked there.

### "Is there an RSS feed / newsletter?"

> Yes — `/feed.xml` for 30 editorial palettes, once-a-week newsletter
> linked on the homepage. No spam, no upsells.

---

## If it ranks

- Reply to substantive comments within the first 2 hours. HN's ranking is
  partially engagement-weighted.
- Don't ask friends to upvote. HN's anti-ring-voting detection will bury
  the post.
- If a substantive critique surfaces — "the wada-174 hex is wrong" — fix it
  that day and reply "fixed in [commit]" on the HN thread. The
  responsiveness signal matters for continued ranking.

## If it flops

- Re-submit ONCE, 7-10 days later, with a slightly different framing
  (e.g. lead with the blog article URL instead of the homepage). More than
  two submissions of the same URL within a month triggers HN's
  auto-dead-post filter.
