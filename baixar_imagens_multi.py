# baixar_imagens_multi.py
# Baixa fotos LIMPAS de caixas de remedio (caixa de laboratorio: EMS, Medley,
# Neo Quimica, Prati...), SEM marca de drogaria concorrente.
#
# Fontes: Pague Menos + Drogaria Sao Paulo (filtra marca propria da loja).
# Gera:
#   img/<SKU>.webp        -> fotos dos 12 produtos do site
#   img/banco/*.webp      -> banco de fotos extras por categoria
#
# Uso:  pip install pillow  &&  python baixar_imagens_multi.py

import io
import json
import os
import re
import time
import urllib.error
import urllib.parse
import urllib.request

from PIL import Image

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
LARGURA = 600

FONTES = [
    ("paguelemenos", "https://www.paguemenos.com.br/api/catalog_system/pub/products/search/"),
    ("drogariasaopaulo", "https://www.drogariasaopaulo.com.br/api/catalog_system/pub/products/search/"),
]

# nomes/marcas que NAO podem aparecer (marca propria de drogaria)
PROIBIDO = re.compile(
    r"drogaria|drogasil|drogaraia|pacheco|pague ?menos|sao ?paulo|venancio|"
    r"nissei|extrafarma|raia ?drogasil|farmacia|droga ?g|drogamed|profarma",
    re.I,
)

PRODUTOS = {
    "DIPIRONA_500MG_EMS_20": "dipirona 500mg 20 comprimidos ems",
    "LOSARTANA_50MG_EMS_30": "losartana 50mg 30 comprimidos ems",
    "OMEPRAZOL_20MG_EMS_14": "omeprazol 20mg 14 capsulas ems",
    "ATENSINA_0150MG_30": "atensina 0,150mg 30 comprimidos",
    "PARACETAMOL_750MG_MEDLEY_20": "paracetamol 750mg 20 comprimidos medley",
    "IBUPROFENO_600MG_EMS_30": "ibuprofeno 600mg 30 comprimidos ems",
    "SORO_FISIOLOGICO_500ML": "soro fisiologico 0,9% 500ml",
    "PROTETOR_SOLAR_FPS50_LRP_50ML": "protetor solar fps 50 la roche posay 50ml",
    "CREME_DENTAL_SENSODYNE_100G": "sensodyne creme dental 100g",
    "VITAMINA_C_1000MG_10": "vitamina c 1000mg efervescente 10 comprimidos",
    "OMEGA3_1000MG_60": "omega 3 1000mg 60 capsulas",
    "CURATIVO_BANDAID_40": "curativo band aid 40 unidades",
}

# banco de imagens extras, organizado por categoria do site
CATEGORIAS = {
    "medicamentos": [
        "dipirona 500mg", "dipirona 1g", "paracetamol 750mg", "ibuprofeno 600mg",
        "amoxicilina 500mg", "azitromicina 500mg", "losartana 50mg", "enalapril 10mg",
        "metformina 850mg", "omeprazol 20mg", "pantoprazol 40mg", "ranitidina 150mg",
        "diclofenaco 50mg", "nimesulida 100mg", "prednisona 20mg", "dexametasona creme",
        "salbutamol aerosol", "insulina NPH", "atorvastatina 20mg", "sinvastatina 20mg",
        "captopril 25mg", "propranolol 40mg", "hidroclorotiazida 25mg", "fluoxetina 20mg",
        "sertralina 50mg", "alprazolam 1mg", "clonazepam 2mg", "vitamina b complex",
    ],
    "genericos": [
        "genérico losartana 50mg", "genérico omeprazol 20mg", "genérico metformina 850mg",
        "genérico atorvastatina", "genérico amoxicilina 500mg", "genérico azitromicina",
        "genérico ciprofloxacino 500mg", "genérico dexametasona",
    ],
    "vitaminas": [
        "vitamina c 1000mg", "vitamina d 2000ui", "vitamina b12", "complexo b",
        "calcio + vitamina d", "omega 3", "multivitaminico", "ferro quelato",
        "zinco 50mg", "magnesio 350mg",
    ],
    "higiene": [
        "creme dental sensodyne", "escova dental oral b", "enxaguante bucal listerine",
        "soro fisiologico 500ml", "protetor solar fps 60", "hidratante corporal nivea",
        "sabonete dove", "shampoo clear", "fralda geriatrica", "absorvente overnight",
        "curativo elastico", "algodao hidrofilo",
    ],
    "dermocosmeticos": [
        "protetor solar fps 50", "vitamina c serum facial", "acido hialuronico",
        "creme hidratante facial", "gel creme facial",
    ],
}

MAX_POR_CATEGORIA = 30


def buscar(base, query, maximo=8):
    url = base + urllib.parse.quote(query, safe="") + f"?_from=0&_to={maximo - 1}"
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def eh_limpo(produto):
    """Rejeita caixas com marca de drogaria no NOME do produto."""
    nome = produto.get("productName", "")
    marca = " ".join(m.get("brand", "") for m in produto.get("brands", []) or [])
    return not (PROIBIDO.search(nome) or PROIBIDO.search(marca))


def url_imagem(produto):
    """Pega a melhor foto disponivel do produto."""
    candidatas = []
    for item in produto.get("items", []):
        for img in item.get("images", []):
            u = img.get("imageUrl") or ""
            if u:
                candidatas.append(u)
    if not candidatas:
        return None
    # prefere foto que NAO seja o placeholder "de-referencia" da vtex
    for u in candidatas:
        if "de-referencia" not in u:
            return u
    return candidatas[0]


def melhor_produto(query, produtos):
    termos = [
        t for t in re.split(r"\W+", query.lower())
        if len(t) > 2 and t not in ("comprimidos", "capsulas", "genérico", "generico")
    ]
    candidatos = [p for p in produtos if eh_limpo(p)]
    if not candidatos:
        return None
    melhor, nota = None, -1
    for p in candidatos:
        nome = p.get("productName", "").lower()
        s = sum(1 for t in termos if t in nome)
        if s > nota:
            melhor, nota = p, s
    return melhor if nota > 0 else None


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


def buscar_em_todas(query, maximo=8):
    """Busca em todas as fontes, retorna lista de produtos limpos."""
    resultados = []
    for _, base in FONTES:
        try:
            resultados.extend(buscar(base, query, maximo))
        except Exception as e:
            print(f"  (fonte falhou para '{query}': {e})")
        time.sleep(0.3)
    return resultados


def salvar(caminho, dados):
    os.makedirs(os.path.dirname(caminho) or ".", exist_ok=True)
    with open(caminho, "wb") as f:
        f.write(dados)
    return len(dados)


def main():
    ok = falha = 0

    print("== Fotos dos produtos do site ==")
    for sku, query in PRODUTOS.items():
        destino = os.path.join("img", f"{sku}.webp")
        if os.path.exists(destino):
            print(f"pulado (ja existe) {sku}")
            ok += 1
            continue
        try:
            produto = melhor_produto(query, buscar_em_todas(query))
            if not produto:
                raise Exception("nenhuma foto limpa encontrada")
            url = url_imagem(produto)
            if not url:
                raise Exception("produto sem imagem")
            tam = salvar(destino, baixar(url))
            print(f"OK {sku}  <- {produto.get('productName', '')[:60]} ({tam} bytes)")
            ok += 1
        except Exception as e:
            print(f"FALHOU {sku}: {e}")
            falha += 1

    print("\n== Banco de imagens extras (so caixas de laboratorio) ==")
    banco = os.path.join("img", "banco")
    total_banco = 0
    for categoria, buscas in CATEGORIAS.items():
        pasta_cat = os.path.join(banco, categoria)
        feitas = 0
        usados = set()
        for query in buscas:
            if feitas >= MAX_POR_CATEGORIA:
                break
            try:
                produtos = [p for p in buscar_em_todas(query, 8) if eh_limpo(p)]
            except Exception as e:
                print(f"erro busca '{query}': {e}")
                continue
            for p in produtos:
                if feitas >= MAX_POR_CATEGORIA:
                    break
                pid = p.get("productId")
                if pid in usados:
                    continue
                usados.add(pid)
                url = url_imagem(p)
                if not url:
                    continue
                nome = re.sub(r"[^a-z0-9]+", "-", p.get("productName", pid).lower()).strip("-")[:60]
                caminho = os.path.join(pasta_cat, f"{nome}.webp")
                if os.path.exists(caminho):
                    feitas += 1
                    continue
                try:
                    tam = salvar(caminho, baixar(url))
                    feitas += 1
                    total_banco += 1
                    print(f"{categoria} {feitas:02d}/{MAX_POR_CATEGORIA} {nome} ({tam} bytes)")
                except Exception as e:
                    print(f"falha download {nome}: {e}")
        total_banco += 0
        print(f"-- {categoria}: {feitas} fotos")

    print("-" * 50)
    print(f"Produtos do site: {ok} ok, {falha} falha | banco novo: {total_banco} fotos")
    print("Sem marca de drogaria nas fotos. Pronto!")


if __name__ == "__main__":
    main()
