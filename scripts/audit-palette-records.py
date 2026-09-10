#!/usr/bin/env python3
"""Record self-consistency audit for colorcombinations palettes (wada + curated). arg 'inject' adds a synthetic bad record as the positive control."""
import re,sys,os,collections
D=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'src','data'); INJ=len(sys.argv)>1 and sys.argv[1]=='inject'
def blocks(src):
    for blk in re.split(r'\n  \{\n', src)[1:]:
        g=lambda k: (re.search(k+r':\s*"([^"]*)"',blk) or [None,None])[1]
        cols=re.findall(r'\{\s*hex:\s*"([^"]*)"(?:,\s*nameJa:\s*"([^"]*)")?,\s*nameRomaji:\s*"([^"]*)"',blk)
        order=re.search(r'order:\s*(\d+)',blk); tags=re.findall(r'"([^"]+)"',(re.search(r'tags:\s*\[([^\]]*)\]',blk) or [None,''])[1])
        yield dict(slug=g('slug'),title=g('title'),summary=g('summary'),desc=g('description'),cols=cols,order=int(order.group(1)) if order else None,tags=tags)
recs=list(blocks(open(f'{D}/wada-palettes.ts').read()))+list(blocks(open(f'{D}/palettes.ts').read()))
if INJ: recs.append(dict(slug='wada-999-bad',title='Bad & Worse',summary='Plate 12 from …',desc='',cols=[('#zz0000','','Bad'),('#000000','','Bad')],order=1005,tags=['wada','plate-13']))
H=collections.Counter(); W=collections.Counter(); seen=collections.Counter(r['slug'] for r in recs)
for r in recs:
    s=r['slug']; hexes=[c[0] for c in r['cols']]; names=[c[2] for c in r['cols']]
    if seen[s]>1: H[f'dup slug {s}']+=1
    for h in hexes:
        if not re.fullmatch(r'#[0-9a-fA-F]{6}',h): H['HIGH invalid hex']+=1; print('HIGH invalid hex',s,h)
    if not 2<=len(hexes)<=4: H['HIGH color count']+=1; print('HIGH color count',s,len(hexes))
    if len(set(h.lower() for h in hexes))!=len(hexes): H['HIGH duplicate hex in plate']+=1; print('HIGH dup hex',s)
    if any(not n for n in names): H['HIGH empty name']+=1; print('HIGH empty name',s)
    if len(set(names))!=len(names): W['WARN duplicate name in plate']+=1
    m=re.match(r'wada-(\d{3})-',s)
    if m:
        n=int(m.group(1))
        if r['order']!=1000+n: H['HIGH order≠1000+plate']+=1; print('HIGH order',s,r['order'])
        if f'plate-{n}' not in r['tags']: H['HIGH tag plate mismatch']+=1; print('HIGH tag',s,r['tags'])
        if not (r['summary'] or '').startswith(f'Plate {n} '): H['HIGH summary plate mismatch']+=1; print('HIGH summary',s)
        # title should list the same names as colors
        # dataset convention: title = first two names joined by ' & ', then ' +N' for the remaining N colours
        et=' & '.join(names[:2])+(f' +{len(names)-2}' if len(names)>2 else '')
        if (r['title'] or '')!=et: W['WARN title ≠ convention']+=1; print('WARN title',s,repr(r['title']),repr(et))
        cnt='two-colour pairing' if len(hexes)==2 else f'{len(hexes)}-colour grouping'
        if cnt not in (r['desc'] or ''): W['WARN description count word']+=1; print('WARN count word',s)
        if ', '.join(names) not in (r['summary'] or ''): H['HIGH summary names ≠ colors']+=1; print('HIGH summary names',s)
    else:
        if any(not c[1] for c in r['cols']): W['WARN curated color lacks nameJa']+=1
print(f"records {len(recs)} · HIGH {sum(H.values())} {dict(H)} · WARN {sum(W.values())} {dict(W)}")
