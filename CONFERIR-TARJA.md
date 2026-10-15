# Lista para conferir tarja com a farmácia

> Gerada em `produtos-data.js`. **Nao altere o site por conta propria**:
> confirme com o farmacaceutico responsavel e me mande a correcao.

O site hoje marca **41 produtos** como "tarja vermelha" e
**4** como controlado. A tarja define o que o cliente ve no site,
entao se estiver errada o site informa errado.

---

## 1. Provavelmente venda livre (11 produtos)

Estes estao marcados como tarja vermelha no site, mas saoiluidos de venda
livre — o cliente compra sem receita nenhuma:

| # | Produto no site | SKU |
|---|---|---|
| 1 | PARACETAMOL 500MG 20 COMP | `PARACETAMOL_500MG_20` |
| 2 | PARACETAMOL 750MG 20 COMP REV | `PARACETAMOL_750MG_20` |
| 3 | AAS 100MG CX 30 COMP | `AAS_100MG_30` |
| 4 | AAS PROTECT 100MG C 30 COMP | `AAS_PROTECT_100MG_30` |
| 5 | DIPIRONA SÓDICA 1G GENÉRICO PRATI C/30 | `DIPIRONA_1G_PRATI_30` |
| 6 | DIPIRONA 500MG/ML GENÉRICO EMS GOTAS 20ML | `DIPIRONA_500MG_GOTAS_20ML` |
| 7 | PARACETAMOL 750MG GENÉRICO CIMED C/20 | `PARACETAMOL_750MG_CIMED_20` |
| 8 | IBUPROFENO 600MG GENÉRICO ALTHAIA C/10 CÁPSULAS | `IBUPROFENO_600MG_10_CAPS` |
| 9 | DIPIRONA 1G 30 COMPRIMIDOS GENÉRICO PRATI | `DIPIRONA_1G_30_PRATI` |
| 10 | DIPIRONA 500MG GENÉRICO NOVA QUÍMICA C/10 | `DIPIRONA_500MG_10_NOVA` |
| 11 | LORATADINA 10MG GENÉRICO CIMED C/12 COMPRIMIDOS | `LORATADINA_10MG_CIMED_12` |

**Pergunta para a farmácia:** esses precisam mesmo de receita?

---

## 2. Os 4 controlados (ficam como estão)

| Produto | SKU |
|---|---|
| TRAZODONA 100MG 30 COMP | `TRAZODONA_100MG_30` |
| FLUOXETINA 20MG 30 CPS | `FLUOXETINA_20MG_GERMED_30` |
| FLUOXETINA 20MG CPR | `FLUOXETINA_20MG_LEGRAND` |
| SERTRALINA 50MG ZOLOFT C/30 COMPRIMIDOS | `SERTRALINA_50MG_ZOLOFT_30` |

Estes estao corretos: tarjaspecial, proibida a venda pela internet.
O aviso no site esta certo e **nao deve ser alterado**.

---

## 3. Os outros 30 marcados como tarja vermelha

Estes **podem** precisar de receita. Confirme se sao:

- **tarja vermelha simples** — pode vender pela internet, com receita
- **tarja vermelha com retencao** (antibiotico) — so com receita apresentada
- **ou venda livre** — nesse caso, tira a tarja

| # | Produto | SKU |
|---|---|---|
| 1 | ABC 10MG/ML SOL SPRAY FR 30ML | `ABC_SPRAY_30ML` |
| 2 | AZITROMICINA 500MG 5 COMP | `AZITROMICINA_500MG_5` |
| 3 | CLORIDRATO DE DOXICICLINA 100MG COM REV | `DOXICICLINA_100MG` |
| 4 | ABLOK 25MG 30CPR | `ABLOK_25MG_30` |
| 5 | SULF+TRIM 200/40MG SUSP TEUTO | `SULF_TRIM_SUSP_100ML` |
| 6 | SULFAMETOXAZOL+TRIMETOPRIMA 40+8MG/ML C/100ML | `SULFAMETOXAZOL_TRIMETOPRIMA` |
| 7 | NOVALGINA FLASH 1G C/8 COMPRIMIDOS | `NOVALGINA_FLASH_1G_8` |
| 8 | DORFLEX UNO DIPIONA 1G C/20 COMPRIMIDOS | `DORFLEX_UNO_20` |
| 9 | LISADOR DIP DIPIONA MONOIDRATADA 1G C/20 | `LISADOR_DIP_1G_20` |
| 10 | AMOXICILINA 500MG GENÉRICO CIMED C/21 CÁPSULAS | `AMOXICILINA_500MG_CIMED_21` |
| 11 | CIPROFLOXACINO 500MG QUINOLOX C/28 COMPRIMIDOS | `CIPROFLOXACINO_500MG_28` |
| 12 | CAPTOPRIL 25MG GENÉRICO CIMED C/30 COMPRIMIDOS | `CAPTOPRIL_25MG_CIMED_30` |
| 13 | MALEATO DE ENALAPRIL 10MG GENÉRICO GERMED C/30 | `ENALAPRIL_10MG_GERMED_30` |
| 14 | ATORVASTATINA 20MG GENÉRICO EMS C/30 CÁPSULAS | `ATORVASTATINA_20MG_EMS_30` |
| 15 | SINVASTATINA 20MG GENÉRICO CIMED C/30 COMPRIMIDOS | `SINVASTATINA_20MG_CIMED_30` |
| 16 | CLORIDRATO DE METFORMINA 500MG GENÉRICO TEUTO C/30 | `METFORMINA_500MG_TEUTO_30` |
| 17 | LOSARTANA 50MG + HIDROCLOROTIAZIDA 12,5MG SANDOZ C/30 | `LOSARTANA_HCTZ_50MG_SANDOZ_30` |
| 18 | PREDNISONA 20MG GENÉRICO LEGRAND C/10 COMPRIMIDOS | `PREDNISONA_20MG_LEGRAND_10` |
| 19 | ACICLOVIR 200MG GENÉRICO SANDOZ C/50 COMPRIMIDOS | `ACICLOVIR_200MG_SANDOZ_50` |
| 20 | DICLOFENACO SÓDICO 50MG SODIX C/20 COMPRIMIDOS | `DICLOFENACO_50MG_SODIX_20` |
| 21 | NIMESULIDA 100MG NIMESILAM C/12 COMPRIMIDOS | `NIMESULIDA_100MG_NIMESILAM_12` |
| 22 | OMEPRAZOL 20MG OMENAX C/56 CÁPSULAS | `OMEPRAZOL_20MG_OMENAX_56` |
| 23 | ESOMEPRAZOL 40MG GAESO C/28 COMPRIMIDOS | `ESOMEPRAZOL_40MG_GAESO_28` |
| 24 | METFORMINA 850MG GLIFAGE XR C/30 COMPRIMIDOS | `METFORMINA_850MG_GLIFAGE_XR_30` |
| 25 | CETOPROFENO 100MG GENÉRICO BIOSINTÉTICA C/20 | `CETOPROFENO_100MG_20` |
| 26 | CLORIDRATO DE RANITIDINA 150MG GENÉRICO EMS C/20 | `RANITIDINA_150MG_EMS_20` |
| 27 | ALENDRONATO SÓDICO 70MG GENÉRICO GERMED C/4 | `ALENDRONATO_70MG_GERMED_4` |
| 28 | CLOTRIMAZOL + ACETATO DE DEXAMETASONA CREME 40G | `CLOTRIMAZOL_CREAM_40G` |
| 29 | CLORIDRATO DE ONDANSETRONA 8MG JOFIX C/10 | `ONDANSETRONA_8MG_JOFIX_10` |
| 30 | LOSARTANA POTÁSSICA 100MG ARADOIS C/30 COMPRIMIDOS | `LOSARTANA_100MG_ARADOIS_30` |

---

## Resumo do que mudou no site hoje

- O aviso dos 4 controlados: **mantido** (exigência legal)
- O aviso da tarja vermelha: **encurtado** para frase verdadeira, no
  padrao das redes. A versao anterior dizia "retire na loja apresentando a
  receita" para 41 produtos, o que e incorreto para tarja vermelha simples
  (pode vender pela internet) e repetia o WhatsApp, que ja tem botao

O que **nao** mudou: a lista acima. Classificar tarja e responsabilidade
de quem responde tecnicamente pela farmacia.
