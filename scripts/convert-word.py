#!/usr/bin/env python3
"""Konvertor Word článků (../Články) na Content Collection markdown.
Tělo z článku (mammoth HTML -> markdownify), title+perex z Briefu (markdown mód),
hero fotka z ../Články/headers zkopírovaná do public/blog/<slug>.jpg."""
import mammoth, os, re, sys, shutil
import markdownify as _md

BASE = "/sessions/sleepy-laughing-goldberg/mnt/WeMarry/Články"
ART_DIR = BASE
HDR_DIR = os.path.join(BASE, "headers")
PROJ = "/sessions/sleepy-laughing-goldberg/mnt/WeMarry/wemarry-astro"
OUT_DIR = os.path.join(PROJ, "src/content/blog")
IMG_OUT = os.path.join(PROJ, "public/blog")
os.makedirs(IMG_OUT, exist_ok=True)

PALETTES = {
    "Plánování svatby": "from-[#d4b8a4] via-[#b89a82] to-[#8a6a54]",
    "Vzhled a styl": "from-[#f9f0eb] via-[#edd9c8] to-[#e4c8b4]",
    "Místo a dekorace": "from-[#d4e3d0] via-[#a6c1a7] to-[#7a9d7c]",
    "Hosté a organizace": "from-[#e8dfd4] via-[#cdbf9f] to-[#c9b89f]",
    "Dodavatelé a inspirace": "from-[#e8a89a] via-[#d98b7c] to-[#c97a6c]",
}

# číslo -> (slug, kategorie, header_soubor, list, order)
M = {
    "01": ("svatebni-dort-jaky-vybrat-a-kolik-stoji", "Dodavatelé a inspirace", "wedding cake.jpg", "popular", 3),
    "02": ("jak-vybrat-svatebni-kytici", "Dodavatelé a inspirace", "wedding bouquet.jpg", "grid", 0),
    "03": ("jak-vybrat-boty-na-svatbu", "Vzhled a styl", "how to choose wedding shoes.jpg", "grid", 1),
    "04": ("jak-vybrat-svatebni-saty", "Vzhled a styl", "how-to-choose-a-wedding-dress.jpg", "popular", 1),
    "05": ("jak-naplanovat-svatbu", "Plánování svatby", "how to plan a wedding.jpg", "featured", 0),
    "06": ("jak-vybrat-svatebniho-fotografa", "Dodavatelé a inspirace", "how-to-choose-a-wedding-photographer.jpg", "popular", 0),
    "07": ("program-na-svatbu", "Plánování svatby", "wedding program.jpg", "grid", 2),
    "08": ("prubeh-svatby-minutu-po-minute", "Plánování svatby", "wedding day.jpg", "grid", 3),
    "09": ("jak-vybrat-kapelu-na-svatbu", "Dodavatelé a inspirace", "wedding band.jpg", "grid", 4),
    "10": ("jak-vybrat-snubni-prsteny", "Plánování svatby", "wedding rings.jpg", "popular", 2),
    "11": ("jak-vybrat-svatebni-oznameni", "Hosté a organizace", "wedding announcements.jpg", "grid", 5),
    "12": ("jak-na-svatebni-tabuli", "Místo a dekorace", "wedding_table.jpg", "grid", 6),
    "14": ("jak-vybrat-svatebni-zavoj", "Vzhled a styl", "how to choose wedding veil.jpg", "grid", 7),
    "15": ("uces-pro-nevestu-prehledne-tipy-pro-vsechny-delky-vlasu", "Vzhled a styl", "bride preparing hairstyle for wedding .jpg", "grid", 8),
    "16": ("jak-vybrat-oblek-pro-zenicha", "Vzhled a styl", "the groom puts on a wedding suit.jpg", "grid", 9),
    "17": ("tipy-na-svatebni-vyzdobu", "Místo a dekorace", "wedding decoration.jpg", "grid", 10),
    "18": ("tipy-na-svatebni-dekorace", "Místo a dekorace", "wedding decoration details.jpg", "grid", 11),
    "20": ("nejlepsi-cas-na-svatbu", "Plánování svatby", "when to get married.jpg", "grid", 12),
    "21": ("oblibena-svatebni-mista", "Místo a dekorace", "wedding ceremony locations.jpg", "grid", 13),
    "22": ("jak-zalozit-svatebni-web-na-wemarry-krok-po-kroku", "Plánování svatby", "how to create a wedding website.jpg", "grid", 14),
}

def html_md(path):
    with open(path, "rb") as f:
        html = mammoth.convert_to_html(f).value
    return _md.markdownify(html, heading_style="ATX", bullets="-")

def raw_md(path):
    with open(path, "rb") as f:
        return mammoth.convert_to_markdown(f).value

def clean(s):
    s = re.sub(r"\*\*\s*([^*\n]+?)\s*\*\*", lambda m: "**" + m.group(1).strip() + "**", s)
    s = re.sub(r"\*\*\s*\*\*", "", s)
    return s

STOP = ("Naplánujte svatbu s WeMarry", "Lorem ipsum")
def body_lines(md):
    out, started = [], False
    for ln in md.split("\n"):
        t = ln.strip()
        if not started and t.startswith("# "):
            started = True
            continue
        if any(x in ln for x in STOP):
            break
        if t in ("CTA", "Button", "[Button](#)", "[Button](#) [Button](#)"):
            continue
        if "💏" in t or "💕" in t:
            continue
        if re.match(r"^#{1,6}\s*$", t):
            continue
        out.append(ln)
    s = re.sub(r"\n{3,}", "\n\n", "\n".join(out))
    return s.strip()

def brief_fields(path):
    md = raw_md(path)
    lines = [l for l in md.split("\n")]
    def norm(x): return re.sub(r"[*_\\ ]", "", x).lower()
    def after(label):
        for i, l in enumerate(lines):
            if norm(l) == norm(label):
                for j in range(i + 1, min(i + 6, len(lines))):
                    if lines[j].strip():
                        v = clean(lines[j]).strip().strip("*").strip()
                        v = v.replace("\\-", "-").replace("\\.", ".").replace("\\,", ",")
                        return v
        return None
    return after("H1"), after("Meta description")

def words(s): return len(re.findall(r"\w+", s))

count = 0
for num, (slug, cat, hdr, lst, order) in M.items():
    arts = [f for f in os.listdir(ART_DIR) if f.startswith(num + "_") and "rief" not in f]
    briefs = [f for f in os.listdir(ART_DIR) if f.startswith(num + "_") and "rief" in f]
    if not arts:
        print(f"!! {num}: článek nenalezen", file=sys.stderr); continue
    body = body_lines(clean(html_md(os.path.join(ART_DIR, arts[0]))))
    h1, meta = (None, None)
    if briefs:
        h1, meta = brief_fields(os.path.join(ART_DIR, briefs[0]))
    if not h1:
        m = re.search(r"^#\s+(.+)$", html_md(os.path.join(ART_DIR, arts[0])), re.M)
        h1 = clean(m.group(1)).strip() if m else slug
    # kopie hero fotky
    src_img = os.path.join(HDR_DIR, hdr)
    if os.path.exists(src_img):
        shutil.copy(src_img, os.path.join(IMG_OUT, slug + ".jpg"))
    else:
        print(f"!! {num}: hero '{hdr}' nenalezen", file=sys.stderr)
    excerpt = (meta or "").replace('"', "'").strip()
    title = (h1 or slug).replace('"', "'").strip()
    rm = max(2, round(words(body) / 200))
    fm = f"""---
title: "{title}"
category: "{cat}"
excerpt: "{excerpt}"
date: "25. 7. 2025"
isoDate: 2025-07-25
readMinutes: {rm}
palette: "{PALETTES[cat]}"
image: "/blog/{slug}.jpg"
sourceUrl: "https://wemarry.io/cs/{slug}/"
list: "{lst}"
order: {order}
---

{body}
"""
    with open(os.path.join(OUT_DIR, slug + ".md"), "w", encoding="utf-8") as f:
        f.write(fm)
    count += 1
    print(f"OK {num} -> {slug}  (perex: {'ano' if excerpt else 'NE'}, {rm} min)")

print(f"\nHotovo: {count} článků + fotky do public/blog/")
