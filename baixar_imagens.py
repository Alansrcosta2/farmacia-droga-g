# baixar_imagens.py
# Baixa as imagens dos produtos e salva em img/<SKU>.webp
# USO:
#   1) Preencha o dicionario URLS abaixo com o link da imagem de cada produto
#   2) pip install requests pillow
#   3) python baixar_imagens.py

import os, io, requests
from PIL import Image

HEADERS = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}
PASTA = "img"
LARGURA = 600  # largura final em px (site rápido)

# === COLE AQUI A URL DA IMAGEM DE CADA PRODUTO ===
# A chave deve ser EXATAMENTE o SKU do produtos-data.js
URLS = {
    "DIPIRONA_500MG_EMS_20":          "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "LOSARTANA_50MG_EMS_30":          "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "OMEPRAZOL_20MG_EMS_14":          "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "ATENSINA_0150MG_30":             "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "PARACETAMOL_750MG_MEDLEY_20":    "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "IBUPROFENO_600MG_EMS_30":        "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "SORO_FISIOLOGICO_500ML":         "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "PROTETOR_SOLAR_FPS50_LRP_50ML":  "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "CREME_DENTAL_SENSODYNE_100G":    "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "VITAMINA_C_1000MG_10":           "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "OMEGA3_1000MG_60":               "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
    "CURATIVO_BANDAID_40":            "https://COLE_AQUI_URL_DA_IMAGEM.jpg",
}
# =================================================

os.makedirs(PASTA, exist_ok=True)

for sku, url in URLS.items():
    if "COLE_AQUI" in url:
        print(f"PULEI {sku} (sem URL ainda)")
        continue
    try:
        r = requests.get(url, headers=HEADERS, timeout=20)
        r.raise_for_status()
        img = Image.open(io.BytesIO(r.content)).convert("RGB")
        if img.width > LARGURA:
            altura = int(img.height * LARGURA / img.width)
            img = img.resize((LARGURA, altura), Image.LANCZOS)
        arquivo = os.path.join(PASTA, f"{sku}.webp")
        img.save(arquivo, "WEBP", quality=82)
        print(f"OK: {arquivo}")
    except Exception as e:
        print(f"ERRO em {sku}: {e}")

print("\nPronto! Imagens salvas em ./img/")