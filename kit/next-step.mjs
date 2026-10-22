// SITE-LOCAL Amili Kit block (colorcombinations, 2026-10-22) — NOT vendored from fleet-kit, so sync.sh does not own it.
// Amili Kit: next step — one calm "where to go next" block at the end of a list a visitor has just read.
// Why: /trends/ landers ended in a long list, books and sources with no single obvious second page (round cc-adsense-trends).
// If this block proves useful elsewhere, move it to VAULT-Fleet/tooling/fleet-kit/next-step/ and vendor it like the others.
//
//   import { renderNextStep, NEXT_STEP_CSS } from "../../kit/next-step.mjs";
//   <Fragment set:html={`<style>${NEXT_STEP_CSS}</style>` + renderNextStep({ ... })} />
//
// opts = {
//   id:       heading id (required, used for aria-labelledby)
//   heading:  visible h2 text (required)
//   intro:    one plain sentence under the heading (optional)
//   palettes: [{ href, name, colors: ["#hex", ...], note }]   up to 3 shown, a strip of the palette's own colours each
//   links:    [{ href, title, text }]                          up to 3 shown, each one full-width tap target
//   from:     data-from value for click events (optional, e.g. "trends-2027-next")
// }
// Rules the block keeps: no ad slot or buy button inside it (navigation only); every tap target is at least 44 px tall;
// icons are inline SVG in currentColor; text is escaped; nothing renders when there is nothing to link to.

const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const HEX_RE = /^#[0-9a-f]{6}$/i;
const ARROW = '<svg class="ak-ns-arrow" viewBox="0 0 20 20" width="18" height="18" aria-hidden="true" focusable="false"><path d="M4 10h11M11 5.5 15.5 10 11 14.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>';

export function renderNextStep(opts = {}) {
  const id = String(opts.id || '');
  if (!/^[a-z][a-z0-9-]*$/.test(id)) throw new Error(`Amili Kit next-step: an id like "keep-exploring" is required (got "${opts.id}")`);
  if (!opts.heading) throw new Error('Amili Kit next-step: a heading is required');
  const palettes = (opts.palettes || []).slice(0, 3);
  const links = (opts.links || []).slice(0, 3);
  if (!palettes.length && !links.length) return '';
  const ev = opts.from ? ` data-event="next_step_click" data-variant="${esc(opts.from)}"` : '';

  const pal = palettes.map((p) => {
    const strip = (p.colors || []).filter((h) => HEX_RE.test(h)).map((h) => `<span style="background:${h}"></span>`).join('');
    return `<li><a class="ak-ns-pal" href="${esc(p.href)}"${ev}>`
      + `<span class="ak-ns-strip" aria-hidden="true">${strip}</span>`
      + `<span class="ak-ns-pal-body"><span class="ak-ns-title">${esc(p.name)}</span>`
      + (p.note ? `<span class="ak-ns-text">${esc(p.note)}</span>` : '')
      + `</span>${ARROW}</a></li>`;
  }).join('');

  const lnk = links.map((l) => `<li><a class="ak-ns-link" href="${esc(l.href)}"${ev}>`
    + `<span class="ak-ns-pal-body"><span class="ak-ns-title">${esc(l.title)}</span>`
    + (l.text ? `<span class="ak-ns-text">${esc(l.text)}</span>` : '')
    + `</span>${ARROW}</a></li>`).join('');

  return `<section class="ak-ns" aria-labelledby="${id}">`
    + `<h2 class="ak-ns-h" id="${id}">${esc(opts.heading)}</h2>`
    + (opts.intro ? `<p class="ak-ns-intro">${esc(opts.intro)}</p>` : '')
    + (pal ? `<ul class="ak-ns-pals" role="list">${pal}</ul>` : '')
    + (lnk ? `<ul class="ak-ns-links" role="list">${lnk}</ul>` : '')
    + `</section>`;
}

export const NEXT_STEP_CSS = `.ak-ns{margin:2.5rem 0 3rem;padding:1.5rem 1.25rem;border:1px solid var(--color-border,rgba(127,127,127,.3));border-radius:12px;background:var(--color-bg-elevated,#fff)}
.ak-ns .ak-ns-h{margin:0 0 .4rem}
.ak-ns-intro{margin:0 0 1.25rem;font-size:.9375rem;line-height:1.6;color:var(--color-ink-700,#2b2b2b);max-width:none}
.ak-ns-pals,.ak-ns-links{list-style:none;margin:0;padding:0;display:grid;gap:.75rem}
.ak-ns-pals{grid-template-columns:1fr}
@media (min-width:640px){.ak-ns-pals{grid-template-columns:repeat(3,minmax(0,1fr))}}
.ak-ns-links{margin-top:1rem}
.ak-ns-pal,.ak-ns-link{display:flex;align-items:center;gap:.5rem .75rem;min-height:44px;padding:.75rem .875rem;border:1px solid var(--color-border,rgba(127,127,127,.3));border-radius:10px;color:inherit;text-decoration:none;background:var(--color-bg,#faf7ef)}
.ak-ns-pal{display:grid;grid-template-columns:minmax(0,1fr) auto}
.ak-ns-pal:hover,.ak-ns-link:hover{border-color:currentColor}
.ak-ns-pal:focus-visible,.ak-ns-link:focus-visible{outline:2px solid var(--color-accent-500,#9a2a2a);outline-offset:2px}
.ak-ns-strip{display:flex;grid-column:1/-1;height:40px;border-radius:6px;overflow:hidden;box-shadow:inset 0 0 0 1px rgba(127,127,127,.25)}
.ak-ns-strip span{flex:1 1 0}
.ak-ns-pal-body{display:flex;flex-direction:column;gap:.15rem;min-width:0;flex:1 1 auto}
.ak-ns-title{font-weight:600;font-size:.9375rem;line-height:1.3;color:var(--color-ink-900,#141414)}
.ak-ns-text{font-size:.8125rem;line-height:1.45;color:var(--color-ink-500,#6b6b6b)}
.ak-ns-arrow{flex:0 0 auto;color:var(--color-accent-500,#9a2a2a)}`;
