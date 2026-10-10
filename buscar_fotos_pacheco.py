# buscar_fotos_pacheco.py
# Busca fotos REAIS de caixa (fonte: Drograria Pacheco + Pague Menos + SP)
# para os 5 produtos que ficaram sem foto e reposicao dos genericos do banco.
#
# Filtros: nome de marca proibida, arquivo da imagem sem tarja/referencia,
# hash fora de mockups.txt, e todos os termos obrigatorios no nome do produto.
#
# Uso: python buscar_fotos_pacheco.py

import io
import json
import os
import re
import time
import urllib.parse
import urllib.request

from PIL import Image

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
LARGURA = 600

FONTES = [
    "https://www.drogariaspacheco.com.br/api/catalog_system/pub/products/search/",
    "https://www.paguemenos.com.br/api/catalog_system/pub/products/search/",
    "https://www.drogariasaopaulo.com.br/api/catalog_system/pub/products/search/",
]

PROIBIDO = re.compile(
    r"drogaria|drogasil|drogaraia|pacheco|venancio|nissei|extrafarma|"
    r"raia ?drogasil|s\u00e3o paulo|sao paulo|pague ?menos",
    re.I,
)
ARQUIVO_MOCKUP = re.compile(r"tarja|refer\u00eancia|referencia|placeholder|pacheco\.png", re.I)

# sku -> (termos OBRIGATORIOS no nome, termos de preferencia)
SKUS = {
    "LOSARTANA_50MG_EMS_30": (["losartana", "50mg", "30"], ["ems"]),
    "OMEPRAZOL_20MG_EMS_14": (["omeprazol", "20mg"], ["14", "ems"]),
    "ATENSINA_0150MG_30": (["propranolol", "30"], ["40mg"]),
    "IBUPROFENO_600MG_EMS_30": (["ibuprofeno", "600mg", "30"], ["ems"]),
    "PARACETAMOL_750MG_MEDLEY_20": (["paracetamol", "750mg", "20"], ["medley"]),
}

# reposicao do banco: categoria -> [(busca, [termos obrigatorios])]
REPOSICAO = {
    "genericos": [
        ("losartana 50mg", ["losartana"]),
        ("losartana 100mg", ["losartana"]),
        ("omeprazol 20mg", ["omeprazol"]),
        ("omeprazol 40mg", ["omeprazol"]),
        ("metformina 850mg", ["metformina"]),
        ("metformina 500mg", ["metformina"]),
        ("aciclovir 200mg", ["aciclovir"]),
        ("prednisona 20mg", ["prednisona"]),
        ("sertralina 50mg", ["sertralina"]),
        ("fluoxetina 20mg", ["fluoxetina"]),
        ("ciprofloxacino 500mg", ["ciprofloxacino"]),
        ("amoxicilina 500mg", ["amoxicilina"]),
        ("azitromicina 500mg", ["azitromicina"]),
        ("enalapril 10mg", ["enalapril"]),
        ("captopril 25mg", ["captopril"]),
        ("sinvastatina 20mg", ["sinvastatina"]),
        ("atorvastatina 20mg", ["atorvastatina"]),
        ("diclofenaco 50mg", ["diclofenaco"]),
        ("nimesulida 100mg", ["nimesulida"]),
        ("glibenclamida 5mg", ["glibenclamida"]),
        ("cetoprofeno 100mg", ["cetoprofeno"]),
        ("ranitidina 150mg", ["ranitidina"]),
        ("ondansetrona 8mg", ["ondansetrona"]),
        ("alendronato 70mg", ["alendronato"]),
        ("levotiroxina 50mcg", ["levotiroxina"]),
        ("alprazolam 1mg", ["alprazolam"]),
        ("clonazepam 2mg", ["clonazepam"]),
        ("dexametasona creme", ["dexametasona"]),
        ("benzoato de mometasona", ["mometasona"]),
        ("loratadina 10mg", ["loratadina"]),
    ],
}
ALVO_GENERICOS = 30


def dhash_bytes(dados, size=8):
    img = Image.open(io.BytesIO(dados)).convert("L").resize((size + 1, size), Image.LANCZOS)
    px = list(img.getdata())
    bits = []
    for row in range(size):
        base = row * (size + 1)
        for col in range(size):
            bits.append(1 if px[base + col] < px[base + col + 1] else 0)
    return sum(1 << i for i, b in enumerate(bits) if b)


def dist(a, b):
    return bin(a ^ b).count("1")


MOCKUPS = [
    int(l.split()[0], 16)
    for l in open("mockups.txt")
    if l.strip()
] if os.path.exists("mockups.txt") else []


def eh_mockup(dados):
    h = dhash_bytes(dados)
    return any(dist(h, m) <= 6 for m in MOCKUPS)


def buscar(base, query, maximo=10):
    url = base + urllib.parse.quote(query, safe="") + f"?_from=0&_to={maximo - 1}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def fontes(query):
    out = []
    for base in FONTES:
        try:
            out.extend(buscar(base, query))
        except Exception:
            pass
        time.sleep(0.2)
    return out


def limpo(p):
    nome = p.get("productName", "")
    marca = " ".join(m.get("brand", "") for m in p.get("brands", []) or [])
    return not (PROIBIDO.search(nome) or PROIBIDO.search(marca))


def urls_reais(p):
    urls = []
    for item in p.get("items", []):
        for im in item.get("images", []):
            u = im.get("imageUrl") or ""
            if not u:
                continue
            arq = urllib.parse.unquote(u.split("?")[0].split("/")[-1])
            if ARQUIVO_MOCKUP.search(arq):
                continue
            urls.append(u)
    return urls


def corrigir_url(url):
    partes = urllib.parse.urlsplit(url)
    return urllib.parse.urlunsplit(
        (partes.scheme, partes.netloc,
         urllib.parse.quote(partes.path, safe="/%"),
         urllib.parse.quote(partes.query, safe="=&%"), "")
    )


def baixar(url):
    req = urllib.request.Request(corrigir_url(url), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        return resp.read()


def gerar_webp(dados):
    img = Image.open(io.BytesIO(dados)).convert("RGB")
    if img.width > LARGURA:
        img = img.resize((LARGURA, int(img.height * LARGURA / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=82)
    return buf.getvalue()


def nota(produto, obrigatorios, preferencias):
    nome = produto.get("productName", "").lower()
    for t in obrigatorios:
        if t.lower() not in nome:
            return -1
    return sum(1 for t in preferencias if t.lower() in nome)


def achar(query, obrigatorios, preferencias, usados):
    melhor, melhor_nota, melhor_dados = None, -1, None
    for p in fontes(query):
        if not limpo(p):
            continue
        n = nota(p, obrigatorios, preferencias)
        if n <= melhor_nota:
            continue
        for u in urls_reais(p):
            try:
                dados = baixar(u)
            except Exception:
                continue
            if eh_mockup(dados):
                continue
            melhor, melhor_nota, melhor_dados = p, n, dados
            break
    return melhor, melhor_dados


def main():
    usados = set(MOCKUPS)
    nomes_produtos = {}

    for sku, (obrig, pref) in SKUS.items():
        destino = f"img/{sku}.webp"
        if os.path.exists(destino):
            print("pulado", sku)
            continue
        p, dados = achar(" ".join(obrig), obrig, pref, usados)
        if not dados:
            print(f"FALHOU {sku}: sem foto para {obrig}")
            continue
        with open(destino, "wb") as f:
            f.write(gerar_webp(dados))
        usados.add(dhash_bytes(dados))
        nomes_produtos[sku] = p.get("productName", "")
        print(f"OK {sku} <- {p.get('productName', '')[:70]}")

    pasta = "img/banco/genericos"
    os.makedirs(pasta, exist_ok=True)
    atual = len([a for a in os.listdir(pasta) if a.endswith(".webp")])
    for query, obrig in REPOSICAO["genericos"]:
        if atual >= ALVO_GENERICOS:
            break
        p, dados = achar(query, obrig, [], usados)
        if not dados:
            print(f"sem foto: {query}")
            continue
        nome = re.sub(r"[^a-z0-9]+", "-", p.get("productName", "x").lower()).strip("-")[:60]
        arquivo = os.path.join(pasta, nome + ".webp")
        if os.path.exists(arquivo):
            continue
        with open(arquivo, "wb") as f:
            f.write(gerar_webp(dados))
        usados.add(dhash_bytes(dados))
        atual += 1
        print(f"banco {atual:02d}/{ALVO_GENERICOS} {nome}")

    if nomes_produtos:
        print("\nNomes reais das fotos (verificar contra produtos-data.js):")
        for sku, nome in nomes_produtos.items():
            print(f"  {sku}: {nome}")
    print("PRONTO")


if __name__ == "__main__":
    main()
