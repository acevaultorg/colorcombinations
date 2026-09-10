#!/usr/bin/env python3
"""Independent WCAG-contrast reimplementation vs the RENDERED colorcombinations.org surfaces.
Data: src/data/wada-palettes.ts + src/data/palettes.ts (origin/main). Surfaces: /palettes/<slug>/ ContrastMatrix,
/data/sanzo-wada-wcag-contrast.csv, /api/colors/<slug>.json.  arg: 'nogamma' | 'aa4' | 'text04' = sabotage controls."""
import re,sys,glob,json,html,os
SAB=sys.argv[1] if len(sys.argv)>1 else None
D=os.environ.get('CC_WORK','/tmp/cc-verify')
DATA=os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))),'src','data')
def lin(c):
    v=c/255
    if SAB=='nogamma': return v
    return v/12.92 if v<=0.03928 else ((v+0.055)/1.055)**2.4
def lum(h):
    h=h.lstrip('#'); r,g,b=(int(h[i:i+2],16) for i in (0,2,4))
    return 0.2126*lin(r)+0.7152*lin(g)+0.0722*lin(b)
def cr(a,b):
    la,lb=lum(a),lum(b); return (max(la,lb)+0.05)/(min(la,lb)+0.05)
AA=4.0 if SAB=='aa4' else 4.5
def level(r): return 'AAA' if r>=7 else 'AA' if r>=AA else 'AA_LARGE' if r>=3 else 'FAIL'
def f2(x): return f"{x:.2f}"
def parse_palettes(src):
    out={}
    for blk in re.split(r'\n  \{\n', src)[1:]:
        m=re.search(r'slug:\s*"([^"]+)"',blk)
        if not m: continue
        cols=re.findall(r'\{\s*hex:\s*"(#[0-9a-fA-F]{6})"(?:,\s*nameJa:\s*"[^"]*")?,\s*nameRomaji:\s*"([^"]+)"',blk)
        out[m.group(1)]=cols
    return out
pal={}
pal.update(parse_palettes(open(f'{DATA}/wada-palettes.ts').read()))
pal.update(parse_palettes(open(f'{DATA}/palettes.ts').read()))
print(f"data palettes parsed: {len(pal)} (expect 378)")
# ---- surface 1: rendered ContrastMatrix on every /palettes/<slug>/ page
pages=sorted(glob.glob(f'{D}/pages/*.html')); miss_r=miss_l=miss_best=0; verdicts=0; nopage=0
for f in pages:
    slug=os.path.basename(f)[:-5]; h=open(f,encoding='utf-8').read()
    if slug not in pal: nopage+=1; continue
    cols=pal[slug]
    exp=[]
    for i in range(len(cols)):
        for j in range(i+1,len(cols)):
            r=cr(cols[i][0],cols[j][0]); exp.append((cols[i][1],cols[j][1],f2(r),level(r),r))
    rows=re.findall(r'contrast__row contrast__row--([a-z_]+)"[^>]*>.*?contrast__name"[^>]*>([^<]*)<.*?contrast__name"[^>]*>([^<]*)<.*?contrast__ratio"[^>]*>([0-9.]+):1',h,re.S)
    if len(rows)!=len(exp): print("ROWCOUNT",slug,len(rows),len(exp)); miss_r+=abs(len(rows)-len(exp))
    for (lv,a,b,rt),(ea,eb,er,el,_) in zip(rows,exp):
        verdicts+=1
        if html.unescape(a)!=ea or html.unescape(b)!=eb: print("NAME",slug,a,b,ea,eb)
        if rt!=er: miss_r+=1
        if lv!=el.lower(): miss_l+=1
    best=max(exp,key=lambda e:e[4])
    mb=re.search(r'contrast__best"[^>]*>.*?<strong[^>]*>([^<]*)</strong>.*?<strong[^>]*>([^<]*)</strong>.*?contrast__ratio"[^>]*>([0-9.]+):1',h,re.S)
    if not mb or html.unescape(mb.group(1))!=best[0] or html.unescape(mb.group(2))!=best[1] or mb.group(3)!=best[2]: miss_best+=1
print(f"SURFACE palette pages: {len(pages)} pages · {verdicts} pair verdicts · ratio mismatches {miss_r} · level mismatches {miss_l} · strongest-pair mismatches {miss_best} · pages without data {nopage}")
# ---- surface 2: the CSV aggregate (Wada 348 only)
wada={s:c for s,c in pal.items() if s.startswith('wada-')}
plates=[]
for s,c in wada.items():
    best=0;pairs=0;aa=0
    for i in range(len(c)):
        for j in range(i+1,len(c)):
            r=cr(c[i][0],c[j][0]); pairs+=1; aa+=r>=AA; best=max(best,r)
    plates.append((s,len(c),best,pairs,aa))
tot=len(plates); pct=lambda n,d=None: round(n/(d or tot)*100+1e-9) if (d or tot) else 0
def jsround(n): # Math.round: half up
    import math; return math.floor(n+0.5)
pct=lambda n,d=None: jsround(n/(d or tot)*100)
passAAA=sum(p[2]>=7 for p in plates); passAA=sum(p[2]>=AA for p in plates); passL=sum(p[2]>=3 for p in plates)
tp=sum(p[3] for p in plates); ta=sum(p[4] for p in plates)
exp={"plates_with_AA_pairing":str(passAA),"plates_with_AAA_pairing":str(passAAA),"plates_AA_large_only":str(passL-passAA),
     "plates_failing_all_text_levels":str(tot-passL),"color_pairs_total":str(tp),"color_pairs_passing_AA":str(ta)}
for n in (2,3,4):
    sub=[p for p in plates if p[1]==n]; exp[f"{n}-color_plates_AA"]=str(sum(p[2]>=AA for p in sub))
srt=sorted(plates,key=lambda p:-p[2])
for p in srt[:5]: exp[p[0]]=str(jsround(p[2]*100)/100)
for p in list(reversed(srt[-5:])): exp[p[0]]=str(jsround(p[2]*100)/100)
import csv
live={r[1]:r[2] for r in csv.reader(open(f'{D}/live.csv',encoding='utf-8')) if r and r[0] not in('category','meta')}
mm=[(k,live.get(k),v) for k,v in exp.items() if live.get(k)!=v]
print(f"SURFACE csv: {len(exp)} recomputed cells · mismatches {len(mm)} {mm[:4]} · live rows not recomputed {sorted(set(live)-set(exp))}")
# ---- surface 3: /api/colors/<slug>.json contrast block (hex is data passthrough; the computed fields are checked)
T=0.4 if SAB=='text04' else 0.5
jm=jb=0;n=0
for f in glob.glob(f'{D}/api/*.json'):
    try: j=json.load(open(f))
    except Exception: continue
    if 'contrast' not in j: continue
    n+=1
    for bg,key in (('#ffffff','white'),('#000000','black')):
        r=cr(j['hex'],bg); c=j['contrast'][key]
        if c['ratio']!=jsround(r*100)/100: jm+=1
        if (c['aa'],c['aaa'],c['aaLarge'])!=(r>=AA,r>=7,r>=3): jb+=1
print(f"SURFACE api/colors: {n} colors × 2 backgrounds · ratio mismatches {jm} · flag mismatches {jb}")
