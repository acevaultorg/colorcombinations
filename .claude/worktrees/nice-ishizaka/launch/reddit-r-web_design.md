# Reddit — r/web_design post

**Subreddit:** https://www.reddit.com/r/web_design/
**Audience:** large active designer + developer community.
**Rules to check:** open the sub's current rules before posting — they
change. Self-promo is typically permitted but penalized for young
accounts. If your account is under 30 days old or has low comment karma,
spend a week commenting on other threads before posting.
**Best day/time:** Tuesday or Wednesday, 8–11am Eastern.
**Flair:** check the sub's current flair options when posting. Pick the
one that matches "resource" or "showcase" semantics.

Do NOT cross-post identical text to r/design, r/graphic_design, and
r/web_design on the same day. Reddit's spam filter de-ranks all three.
Space them 3–4 days apart and vary the framing per sub.

---

## Title

> I rebuilt Sanzo Wada's 1933 "Dictionary of Color Combinations" as a free, exportable archive — 348 historical palettes, reverse color lookup, per-palette SEO pages

(Under 300 chars. Reddit's algorithm doesn't care about length; users do.
This title works because it leads with the WORK, not the self-promo.)

## Body

> Hey r/web_design — sharing something I've been building for the past
> couple of weeks because I thought people here might actually use it.
>
> **The site:** https://colorcombinations.org
> **Context:** it's a reconstruction of Sanzo Wada's 1933 *Dictionary of
> Color Combinations*, the six-volume Japanese color reference book. The
> original is out of print; the 2010 Seigensha reprint is expensive and
> hard to find outside Japan. So I rebuilt the whole catalog — all 348
> plates — as a static site with per-palette SEO pages, exports, and a
> reverse color-dictionary lookup.
>
> **Why this might be useful for web designers specifically:**
>
> - Every palette has a one-click export to Tailwind config, CSS custom
>   properties, hex list, or JSON. No signup, no paywall.
> - 211 named colors in the archive, each with a detail page showing every
>   palette that uses it. If you've locked in a brand color and you need to
>   find "what does historical practice pair with this blue?", that's the
>   page.
> - There are eight themed collections — Websites, Branding, Minimalist,
>   Autumn, etc. — that are basically curated landing pages for common
>   project briefs.
> - Every color combination has a WCAG contrast matrix so you can see
>   which pairs are accessible for text before you commit.
>
> **Tech, for people who care about the build:** Astro 5, Tailwind v4,
> TypeScript strict, Cloudflare Pages. Zero runtime JS per page (all
> static generation). 612 pages, ~23M dist, ~2.6s build. The data comes
> from the MIT-licensed mattdesl/dictionary-of-colour-combinations
> dataset — proper credit on the about page.
>
> **What I'd actually love feedback on:**
>
> 1. Does the taxonomy (era / mood / dominant hue / color-count filter)
>    make the browse page useful or cluttered?
> 2. Does the export format menu cover what you'd actually use in a real
>    project? (Figma tokens are on the $3–5 tip-jar bundle; the
>    per-palette export is free.)
> 3. Is the "featured in collections" chip row on palette detail pages a
>    signal or a distraction?
>
> Site is free, always. If you dig it and want to support, there's a
> pay-what-you-want bundle on /shop. If you don't, the whole thing is
> still yours to use. Thanks for looking.

---

## Anticipated comments — pre-written replies

### "Why not coolors.co?"

> Coolors and this are solving different problems. Coolors is a generator
> — infinite novelty. This is a dictionary — 348 specific curated pairs
> with provenance. I use both. When I need a starting point with some
> historical weight, I come here. When I need to iterate around a fixed
> color I already have, I use Coolors.

### "Is the source data authoritative?"

> No — the hex values are community reconstructions from the
> mattdesl/dictionary-of-colour-combinations project, which is the
> best-effort transcription. The original 1933 book uses pigments that
> don't have perfect RGB equivalents. I've flagged this on the about
> page. If you have a copy of the Seigensha reprint and spot wrong
> values, PRs welcome.

### "What about accessibility?"

> Every palette detail page has a WCAG contrast matrix showing each color
> against each other. 4.5:1 for AA text, 7:1 for AAA. The archive's
> palettes are from 1933 and weren't designed with web accessibility in
> mind, so many pairs flag as AA-Large only. That's surfaced on the
> contrast grid instead of hidden.

### "Can I use these commercially?"

> Yes. Hex values are facts, not copyrighted. Traditional Japanese color
> names are cultural commons. The archive's editorial descriptions and
> the site itself are the only things I wrote, and I license nothing
> about the colors. Go build something.

---

## Posting checklist

- [ ] Post is > 200 characters (Reddit boosts substantive posts)
- [ ] Account has meaningful comment karma, > 30 days old
- [ ] Posted Tue/Wed/Thu 8–11am ET
- [ ] Flair set to the current sub's "resource" / "showcase" equivalent
- [ ] No image attached (r/web_design favors text posts with links)
- [ ] Site is live, no console errors, /shop link works
- [ ] Reply to the first 5 comments within an hour
- [ ] Cross-posts to r/design and r/graphic_design are scheduled 3+ days later
