# baixar_ean.py
# Baixa a FOTO REAL da caixa de cada produto usando o codigo de barras (EAN)
# e salva em img/<SKU>.webp (o site ja mostra automaticamente).
#
# COMO USAR:
#   1) Na farmacia, leia o codigo de barras (digitos embaixo da caixa) de cada produto
#   2) Preencha o campo "ean" do produto abaixo (so numeros)
#   3) Rode:  python baixar_ean.py
#
# Nao precisa de senha nem de chave de API.

import os
import io
import base64
import json
import urllib.request

from PIL import Image

API = "https://api-produtos.seunegocionanuvem.com.br/api/"
PASTA = "img"
LARGURA = 600
USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124.0 Safari/537.36"

# PREENCHA OS EANs AQUI (deixe vazio "" se ainda nao tiver)
PRODUTOS = [
    {"sku": "DIPIRONA_500MG_EMS_20",         "ean": ""},
    {"sku": "LOSARTANA_50MG_EMS_30",         "ean": ""},
    {"sku": "OMEPRAZOL_20MG_EMS_14",         "ean": ""},
    {"sku": "ATENSINA_0150MG_30",            "ean": ""},
    {"sku": "PARACETAMOL_750MG_MEDLEY_20",   "ean": ""},
    {"sku": "IBUPROFENO_600MG_EMS_30",       "ean": ""},
    {"sku": "SORO_FISIOLOGICO_500ML",        "ean": ""},
    {"sku": "PROTETOR_SOLAR_FPS50_LRP_50ML", "ean": ""},
    {"sku": "CREME_DENTAL_SENSODYNE_100G",   "ean": ""},
    {"sku": "VITAMINA_C_1000MG_10",          "ean": ""},
    {"sku": "OMEGA3_1000MG_60",              "ean": ""},
    {"sku": "CURATIVO_BANDAID_40",           "ean": ""},
]


def buscar_imagem(ean):
    req = urllib.request.Request(API + ean, headers={"User-Agent": USER_AGENT})
    with urllib.request.urlopen(req, timeout=30) as resp:
        dados = json.loads(resp.read().decode("utf-8"))
    return dados


def main():
    os.makedirs(PASTA, exist_ok=True)
    ok = pular = erro = 0

    for item in PRODUTOS:
        sku, ean = item["sku"], (item["ean"] or "").strip()

        if not ean:
            print(f"AGUARDANDO EAN  {sku}")
            pular += 1
            continue
        if not ean.isdigit():
            print(f"ERRO {sku}: EAN deve conter apenas numeros (recebido: {ean})")
            erro += 1
            continue

        try:
            dados = buscar_imagem(ean)
            if dados.get("status") != 200 or "Imagem padr" in (dados.get("message") or ""):
                print(f"NAO ENCONTRADO {sku} (EAN {ean}) - API nao tem esse produto")
                erro += 1
                continue

            b64 = dados.get("imagem_base64") or ""
            conteudo = base64.b64decode(b64)
            img = Image.open(io.BytesIO(conteudo)).convert("RGB")
            if img.width > LARGURA:
                img = img.resize((LARGURA, int(img.height * LARGURA / img.width)), Image.LANCZOS)

            destino = os.path.join(PASTA, f"{sku}.webp")
            img.save(destino, "WEBP", quality=82)
            print(f"OK {sku}  ({dados.get('mime_type')}, {os.path.getsize(destino)} bytes)")
            ok += 1
        except Exception as e:
            print(f"ERRO {sku} (EAN {ean}): {e}")
            erro += 1

    print("-" * 50)
    print(f"Pronto: {ok} baixada(s), {pular} aguardando EAN, {erro} erro(s)")
    print(f"Imagens em ./{PASTA}/ - recarregue o site para ver")


if __name__ == "__main__":
    main()
