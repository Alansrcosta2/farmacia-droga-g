# substituir_mockups.py
# 1) apaga os mockups (foto generica de loja) catalogados em mockups.txt
# 2) baixa fotos REAIS de caixa de laboratorio no lugar:
#    - rejeita imagem cujo arquivo se chame tarja/referencia (mockup)
#    - rejeita imagem com hash igual ao de mockups conhecidos
#    - exige o nome do remedio no produto
# Uso: python substituir_mockups.py

import hashlib
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
    "https://www.paguemenos.com.br/api/catalog_system/pub/products/search/",
    "https://www.drogariasaopaulo.com.br/api/catalog_system/pub/products/search/",
    "https://www.drogasil.com.br/api/catalog_system/pub/products/search/",
]

PROIBIDO = re.compile(
    r"drogaria|drogasil|drogaraia|pacheco|venancio|nissei|extrafarma|"
    r"raia ?drogasil|sao ?paulo|s\u00e3o paulo|pague ?menos",
    re.I,
)

ARQUIVO_MOCKUP = re.compile(r"tarja|referencia|refer\u00eancia|placeholder", re.I)

# skus precisando de foto nova: sku -> termo obrigatorio no nome do produto
SKUS = {
    "LOSARTANA_50MG_EMS_30": "losartana",
    "OMEPRAZOL_20MG_EMS_14": "omeprazol",
    "ATENSINA_0150MG_30": "atensina",
    "IBUPROFENO_600MG_EMS_30": "ibuprofeno",
    "PARACETAMOL_750MG_MEDLEY_20": "paracetamol",
}

# banco: (categoria, termo obrigatorio, buscas)
BANCO = [
    ("genericos", "losartana", ["losartana 50mg", "losartana 100mg", "losartana hidroclorotiazida"]),
    ("genericos", "omeprazol", ["omeprazol 20mg", "omeprazol 40mg"]),
    ("genericos", "metformina", ["metformina 850mg", "cloridrato de metformina"]),
    ("genericos", "aciclovir", ["aciclovir 200mg", "aciclovir 400mg"]),
    ("genericos", "prednisona", ["prednisona 20mg"]),
    ("genericos", "vildagliptina", ["vildagliptina metformina", "sitagliptina metformina"]),
    ("genericos", "sertralina", ["sertralina 50mg"]),
    ("genericos", "fluoxetina", ["fluoxetina 20mg"]),
    ("genericos", "ciprofloxacino", ["ciprofloxacino 500mg"]),
    ("genericos", "amoxicilina", ["amoxicilina 500mg"]),
    ("genericos", "azitromicina", ["azitromicina 500mg"]),
    ("genericos", "enalapril", ["enalapril 10mg"]),
    ("genericos", "captopril", ["captopril 25mg"]),
    ("genericos", "sinvastatina", ["sinvastatina 20mg"]),
    ("genericos", "atorvastatina", ["atorvastatina 20mg"]),
    ("genericos", "diclofenaco", ["diclofenaco 50mg"]),
    ("genericos", "nimesulida", ["nimesulida 100mg"]),
    ("medicamentos", "dipirona", ["dipirona 500mg", "dipirona 1g"]),
    ("medicamentos", "paracetamol", ["paracetamol 750mg"]),
    ("medicamentos", "ibuprofeno", ["ibuprofeno 600mg"]),
]

ALVO_CATEGORIA = {"genericos": 30, "medicamentos": 45}


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


MOCKUPS = []
if os.path.exists("mockups.txt"):
    for linha in open("mockups.txt"):
        if linha.strip():
            MOCKUPS.append(int(linha.split()[0], 16))


def eh_mockup(dados):
    h = dhash_bytes(dados)
    return any(dist(h, m) <= 6 for m in MOCKUPS)


def buscar(base, query, maximo=8):
    url = base + urllib.parse.quote(query, safe="") + f"?_from=0&_to={maximo - 1}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def produtos_de_todas_fontes(query):
    out = []
    for base in FONTES:
        try:
            out.extend(buscar(base, query))
        except Exception:
            pass
        time.sleep(0.2)
    return out


def limpo(produto):
    nome = produto.get("productName", "")
    marca = " ".join(m.get("brand", "") for m in produto.get("brands", []) or [])
    return not (PROIBIDO.search(nome) or PROIBIDO.search(marca))


def urls_reais(produto):
    """URLs de imagem cujo arquivo NAO e mockup (tarja/referencia)."""
    urls = []
    for item in produto.get("items", []):
        for img in item.get("images", []):
            u = img.get("imageUrl") or ""
            if not u:
                continue
            nome_arq = urllib.parse.unquote(u.split("?")[0].split("/")[-1])
            if ARQUIVO_MOCKUP.search(nome_arq):
                continue
            urls.append(u)
    return urls


def corrigir_url(url):
    partes = urllib.parse.urlsplit(url)
    caminho = urllib.parse.quote(partes.path, safe="/%")
    query = urllib.parse.quote(partes.query, safe="=&%")
    return urllib.parse.urlunsplit((partes.scheme, partes.netloc, caminho, query, ""))


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


def achar_foto(query, obrigatorio, usados):
    """Procura foto real: nome do remedio no produto, arquivo nao-mockup, hash nao-mockup."""
    termo = obrigatorio.lower()
    for p in produtos_de_todas_fontes(query):
        if not limpo(p):
            continue
        nome = p.get("productName", "").lower()
        if termo not in nome:
            continue
        for u in urls_reais(p):
            try:
                dados = baixar(u)
                if eh_mockup(dados):
                    continue
                h = dhash_bytes(dados)
                if any(dist(h, x) <= 6 for x in usados):
                    continue
                return p, dados
            except Exception:
                continue
    return None, None


def main():
    # 1) apaga mockups
    if os.path.exists("mockups.txt"):
        for linha in open("mockups.txt"):
            if not linha.strip():
                continue
            caminho = linha.split(None, 1)[1].strip()
            if os.path.exists(caminho):
                os.remove(caminho)
                print("APAGADO", caminho)

    usados = set()

    # 2) fotos dos SKUs
    for sku, termo in SKUS.items():
        destino = f"img/{sku}.webp"
        if os.path.exists(destino):
            print("pulado (existe)", sku)
            continue
        p, dados = achar_foto(termo, termo, usados)
        if not dados:
            print(f"FALHOU {sku}: nenhuma foto real de '{termo}'")
            continue
        with open(destino, "wb") as f:
            f.write(gerar_webp(dados))
        usados.add(dhash_bytes(dados))
        print(f"OK {sku} <- {p.get('productName', '')[:60]}")

    # 3) refaz o banco
    for categoria, termo, buscas in BANCO:
        pasta = os.path.join("img", "banco", categoria)
        atual = len([a for a in os.listdir(pasta) if a.endswith(".webp")]) if os.path.isdir(pasta) else 0
        for query in buscas:
            if atual >= ALVO_CATEGORIA[categoria]:
                break
            for p in produtos_de_todas_fontes(query):
                if atual >= ALVO_CATEGORIA[categoria]:
                    break
                if not limpo(p):
                    continue
                if termo not in p.get("productName", "").lower():
                    continue
                for u in urls_reais(p):
                    try:
                        dados = baixar(u)
                    except Exception:
                        continue
                    if eh_mockup(dados):
                        continue
                    h = dhash_bytes(dados)
                    if any(dist(h, x) <= 6 for x in usados):
                        continue
                    nome = re.sub(r"[^a-z0-9]+", "-", p.get("productName", "x").lower()).strip("-")[:60]
                    arquivo = os.path.join(pasta, nome + ".webp")
                    if os.path.exists(arquivo):
                        continue
                    with open(arquivo, "wb") as fh:
                        fh.write(gerar_webp(dados))
                    usados.add(h)
                    atual += 1
                    print(f"banco {categoria} {atual:02d}/{ALVO_CATEGORIA[categoria]} {nome}")
                    break

    print("PRONTO")


if __name__ == "__main__":
    main()
