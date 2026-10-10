# trocar_fotos_produtos.py
# Troca as fotos dos produtos que ainda mostram caixa da Drogaria Sao Paulo
# por fotos de laboratorio (fonte: catalogo Pague Menos, SEM foto da loja).
#
# Uso: python trocar_fotos_produtos.py

import io
import json
import os
import re
import shutil
import time
import urllib.parse
import urllib.request

from PIL import Image

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
API = "https://www.paguemenos.com.br/api/catalog_system/pub/products/search/"
LARGURA = 600

PROIBIDO = re.compile(
    r"drogaria|drogasil|drogaraia|pacheco|venancio|nissei|extrafarma|"
    r"raia ?drogasil|sao ?paulo|s\u00e3o paulo",
    re.I,
)

# sku: (busca, arquivo_do_banco_ou_None)
TROCAS = {
    "LOSARTANA_50MG_EMS_30": (
        "losartana 50mg ems 30 comprimidos",
        "img/banco/genericos/losartana-pot-ssica-50mg-gen-rico-ems-30-comprimidos.webp",
    ),
    "VITAMINA_C_1000MG_10": (
        "vitamina c 1000mg 10 comprimidos efervescentes",
        "img/banco/vitaminas/vitamina-c-1g-ativday-10-comprimidos.webp",
    ),
    "OMEPRAZOL_20MG_EMS_14": ("omeprazol 20mg ems 14 capsulas", None),
    "PARACETAMOL_750MG_MEDLEY_20": ("paracetamol 750mg medley 20 comprimidos", None),
    "IBUPROFENO_600MG_EMS_30": ("ibuprofeno 600mg ems 30 comprimidos", None),
    "ATENSINA_0150MG_30": ("atensina 0,150mg 30 comprimidos", None),
    "PROTETOR_SOLAR_FPS50_LRP_50ML": (
        "la roche posay anthelios protetor solar fps 50",
        None,
    ),
}


def buscar(query, maximo=8):
    url = API + urllib.parse.quote(query, safe="") + f"?_from=0&_to={maximo - 1}"
    req = urllib.request.Request(
        url, headers={"User-Agent": UA, "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def limpo(p):
    nome = p.get("productName", "")
    marca = " ".join(m.get("brand", "") for m in p.get("brands", []) or [])
    return not (PROIBIDO.search(nome) or PROIBIDO.search(marca))


def melhor(query, produtos):
    termos = [t for t in re.split(r"\W+", query.lower()) if len(t) > 2]
    labs = [
        t
        for t in termos
        if t in ("ems", "medley", "prati", "neo", "quimica", "teuto", "cimed", "sandoz")
    ]
    cands = [p for p in produtos if limpo(p)]
    melhor, nota = None, -1
    for p in cands:
        nome = (p.get("productName", "") + " " + " ".join(
            m.get("brand", "") for m in p.get("brands", []) or []
        )).lower()
        s = sum(2 for t in termos if t in nome) + sum(3 for t in labs if t in nome)
        if s > nota:
            melhor, nota = p, s
    return melhor if nota > 0 else None


def url_imagem(p):
    candidatas = []
    for item in p.get("items", []):
        for img in item.get("images", []):
            u = img.get("imageUrl") or ""
            if u:
                candidatas.append(u)
    if not candidatas:
        return None
    escolhida = next((u for u in candidatas if "de-referencia" not in u), candidatas[0])
    partes = urllib.parse.urlsplit(escolhida)
    caminho = urllib.parse.quote(partes.path, safe="/%")
    query = urllib.parse.quote(partes.query, safe="=&%")
    return urllib.parse.urlunsplit(
        (partes.scheme, partes.netloc, caminho, query, partes.fragment)
    )


def baixar(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        dados = resp.read()
    img = Image.open(io.BytesIO(dados)).convert("RGB")
    if img.width > LARGURA:
        img = img.resize((LARGURA, int(img.height * LARGURA / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=82)
    return buf.getvalue()


def main():
    for sku, (query, banco) in TROCAS.items():
        destino = f"img/{sku}.webp"
        try:
            if banco and os.path.exists(banco):
                shutil.copyfile(banco, destino)
                print(f"COPIADO {sku} <- {banco}")
                continue
            produto = melhor(query, buscar(query))
            time.sleep(0.3)
            if not produto:
                # tenta sem o nome do laboratorio
                query2 = re.sub(r"\b(ems|medley)\b", "", query).strip()
                produto = melhor(query2, buscar(query2))
            if not produto:
                print(f"FALHOU {sku}: nenhuma foto limpa para '{query}'")
                continue
            url = url_imagem(produto)
            if not url:
                print(f"FALHOU {sku}: sem imagem")
                continue
            dados = baixar(url)
            with open(destino, "wb") as f:
                f.write(dados)
            print(f"TROCADO {sku} <- {produto.get('productName', '')[:60]} ({len(dados)} bytes)")
        except Exception as e:
            print(f"ERRO {sku}: {e}")


if __name__ == "__main__":
    main()
