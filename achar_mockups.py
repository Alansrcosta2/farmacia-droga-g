# achar_mockups.py
# Acha "mockups" (foto generica de loja, repetida em varios produtos).
# Metodo: hash perceptual (dHash) — mockups sao a MESMA imagem em varios arquivos.
import glob
import os
from PIL import Image


def dhash(path, size=8):
    img = Image.open(path).convert("L").resize((size + 1, size), Image.LANCZOS)
    px = list(img.getdata())
    bits = []
    for row in range(size):
        base = row * (size + 1)
        for col in range(size):
            bits.append(px[base + col] < px[base + col + 1])
    return sum(1 << i for i, b in enumerate(bits) if b)


def dist(a, b):
    return bin(a ^ b).count("1")


arquivos = sorted(glob.glob("img/*.webp") + glob.glob("img/banco/*/*.webp"))
hashes = {f: dhash(f) for f in arquivos}

# agrupa por proximidade (dist <= 6 = mesma imagem para fins praticos)
pai = {f: f for f in arquivos}


def find(x):
    while pai[x] != x:
        pai[x] = pai[pai[x]]
        x = pai[x]
    return x


def unir(a, b):
    ra, rb = find(a), find(b)
    if ra != rb:
        pai[rb] = ra


for i, f1 in enumerate(arquivos):
    for f2 in arquivos[i + 1:]:
        if dist(hashes[f1], hashes[f2]) <= 6:
            unir(f1, f2)

grupos = {}
for f in arquivos:
    grupos.setdefault(find(f), []).append(f)

suspeitos = {g: fs for g, fs in grupos.items() if len(fs) >= 3}
print(f"total: {len(arquivos)} imagens, {len(grupos)} grupos, {len(suspeitos)} suspeitos\n")
for g, fs in sorted(suspeitos.items(), key=lambda kv: -len(kv[1])):
    print(f"GRUPO {len(fs)} imagens:")
    for f in fs:
        print("   ", f)
    print()
