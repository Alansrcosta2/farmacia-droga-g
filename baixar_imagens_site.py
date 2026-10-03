# baixar_imagens_site.py
# Baixa fotos de caixas de remedio reais (fonte: API publica da Drogaria Sao Paulo)
#   - img/<SKU>.webp      -> as 12 fotos que o site ja mostra
#   - img/banco/*.webp    -> banco de ~50 fotos extras (proximo passo do site)
#
# Uso:  python baixar_imagens_site.py

import io
import json
import os
import re
import urllib.parse
import urllib.request
from PIL import Image

API = "https://www.drogariasaopaulo.com.br/api/catalog_system/pub/products/search/"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
LARGURA = 600

# SKU do site -> busca no catalogo
PRODUTOS = {
    "DIPIRONA_500MG_EMS_20": "dipirona 500mg 20 comprimidos",
    "LOSARTANA_50MG_EMS_30": "losartana potassica 50mg 30 comprimidos",
    "OMEPRAZOL_20MG_EMS_14": "omeprazol 20mg 14 capsulas",
    "ATENSINA_0150MG_30": "atensina 1,5mg 30 comprimidos",
    "PARACETAMOL_750MG_MEDLEY_20": "paracetamol 750mg 20 comprimidos",
    "IBUPROFENO_600MG_EMS_30": "ibuprofeno 600mg 30 comprimidos",
    "SORO_FISIOLOGICO_500ML": "soro fisiologico 500ml",
    "PROTETOR_SOLAR_FPS50_LRP_50ML": "protetor solar fps 50 50ml",
    "CREME_DENTAL_SENSODYNE_100G": "sensodyne creme dental 100g",
    "VITAMINA_C_1000MG_10": "vitamina c 1000mg efervescente 10 comprimidos",
    "OMEGA3_1000MG_60": "omega 3 1000mg 60 capsulas",
    "CURATIVO_BANDAID_40": "curativo elastico 40 unidades",
}

# banco de imagens extras
BANCOS = [
    "dipirona", "paracetamol", "ibuprofeno", "losartana", "omeprazol",
    "vitamina c", "vitamina d", "calcio", "amoxicilina", "antialergico",
    "xarope para tosse", "soro fisiologico", "protetor solar", "protetor solar fps 60",
    "creme dental", "fralda", "curativo", "dorflex", "novalgina", "antigripal",
]


def buscar(query, maximo=8):
    url = API + urllib.parse.quote(query, safe="") + "?_from=0&_to=" + str(maximo - 1)
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def melhor_produto(query, produtos):
    termos = [t for t in re.split(r"\W+", query.lower()) if len(t) > 2 and t not in ("comprimidos", "capsulas")]
    if not produtos:
        return None
    melhor, nota = None, -1
    for p in produtos:
        nome = p.get("productName", "").lower()
        s = sum(1 for t in termos if t in nome)
        if s > nota:
            melhor, nota = p, s
    return melhor


def url_imagem(produto):
    try:
        itens = produto.get("items", [])
        if not itens:
            return None
        imgs = itens[0].get("images", [])
        if not imgs:
            return None
        return imgs[0].get("imageUrl")
    except Exception:
        return None


def baixar(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as resp:
        conteudo = resp.read()
    img = Image.open(io.BytesIO(conteudo)).convert("RGB")
    if img.width > LARGURA:
        img = img.resize((LARGURA, int(img.height * LARGURA / img.width)), Image.LANCZOS)
    buf = io.BytesIO()
    img.save(buf, "WEBP", quality=82)
    return buf.getvalue()


def salvar(caminho, dados):
    os.makedirs(os.path.dirname(caminho) or ".", exist_ok=True)
    with open(caminho, "wb") as f:
        f.write(dados)
    return len(dados)


def main():
    ok = falha = 0

    print("== Fotos dos 12 produtos do site ==")
    for sku, query in PRODUTOS.items():
        destino = os.path.join("img", f"{sku}.webp")
        if os.path.exists(destino):
            print(f"pulado (ja existe) {sku}")
            ok += 1
            continue
        try:
            produto = melhor_produto(query, buscar(query))
            if not produto:
                raise Exception("nenhum resultado")
            url = url_imagem(produto)
            if not url:
                raise Exception("produto sem imagem")
            tam = salvar(destino, baixar(url))
            print(f"OK {sku}  <- {produto.get('productName', '')[:60]} ({tam} bytes)")
            ok += 1
        except Exception as e:
            print(f"FALHOU {sku}: {e}")
            falha += 1

    print("\n== Banco de imagens extras ==")
    banco = os.path.join("img", "banco")
    usados = set()
    feitas = len([a for a in os.listdir(banco) if a.endswith('.webp')]) if os.path.isdir(banco) else 0
    for query in BANCOS:
        if feitas >= 50:
            break
        try:
            for p in buscar(query, 8):
                if feitas >= 50:
                    break
                pid = p.get("productId")
                if pid in usados:
                    continue
                usados.add(pid)
                url = url_imagem(p)
                if not url:
                    continue
                nome = re.sub(r"[^a-z0-9]+", "-", p.get("productName", pid).lower()).strip("-")[:60]
                caminho = os.path.join(banco, f"{nome}.webp")
                if os.path.exists(caminho):
                    continue
                tam = salvar(caminho, baixar(url))
                feitas += 1
                print(f"banco {feitas:02d}/50 {nome} ({tam} bytes)")
        except Exception as e:
            print(f"erro na busca '{query}': {e}")

    print("-" * 50)
    print(f"Produtos do site: {ok} ok, {falha} falha | banco: {feitas}/50")
    print("Recarregue o index.html para ver as fotos")


if __name__ == "__main__":
    main()
