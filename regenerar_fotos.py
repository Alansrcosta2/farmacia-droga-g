import os
import re
import glob

palavras = {
    "analg-sico": "analgésico",
    "antit-rmico": "antitérmico",
    "gen-rico": "genérico",
    "g-nerico": "genérico",
    "c-psulas": "cápsulas",
    "c-psula": "cápsula",
    "c-psu": "cápsulas",
    "s-dica": "sódica",
    "pot-ssica": "potássica",
    "monopot-ssica": "monopotássica",
    "s-o": "são",
    "qu-mica": "química",
    "code-na": "codeína",
    "l-quida": "líquida",
    "l-quidas": "líquidas",
    "fl-or": "flúor",
    "prote-o": "proteção",
    "antit-rtaro": "antitartárico",
    "m-dias": "médias",
    "el-trica": "elétrica",
    "s-rum": "sérum",
    "cido": "ácido",
    "hialur-nico": "hialurônico",
    "gr-tis": "grátis",
    "r-pido": "rápido",
    "sens-veis": "sensíveis",
    "reves": "revestidos",
}

def legenda(nome):
    base = os.path.splitext(nome)[0]
    for antigo, novo in sorted(palavras.items(), key=lambda kv: -len(kv[0])):
        base = base.replace(antigo, novo)
    txt = re.sub(r"[\-_]+", " ", base)
    txt = re.sub(r"\s+", " ", txt).strip()
    return " ".join(
        w if w.isupper() or len(w) <= 2 else w.capitalize() for w in txt.split()
    )

categorias = ["medicamentos", "genericos", "vitaminas", "higiene", "dermocosmeticos"]
figs = []
for cat in categorias:
    for a in sorted(glob.glob(os.path.join("img", "banco", cat, "*.webp"))):
        leg = legenda(os.path.basename(a))
        caminho = a.replace(os.sep, "/")
        figs.append(
            '            <figure class="fotos-item">\n'
            '                <img src="' + caminho + '" alt="' + leg + '" loading="lazy">\n'
            '                <figcaption>' + leg + '</figcaption>\n'
            '            </figure>'
        )

html = open("fotos.html", encoding="utf-8").read()
novo_bloco = '<div class="fotos-grid">\n' + "\n".join(figs) + "\n            </div>"
html2, n = re.subn(
    r'<div class="fotos-grid">.*?\n            </div>',
    lambda m: novo_bloco,
    html,
    count=1,
    flags=re.S,
)
assert n == 1, "bloco nao encontrado"
open("fotos.html", "w", encoding="utf-8").write(html2)
print("geradas", len(figs), "figures")
