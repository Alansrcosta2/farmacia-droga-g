# Regras e scripts — Farmácia Droga G

> Documento operacional. As ideias de pagamento estão em `PAGAMENTO.md`.

## 1. Área de entrega — raio de 4 km

Decisão do dono: a farmácia **não entrega em todo lugar**, só num raio de
**4 km** da loja (Rua Julita Nogueira Soares, 610 - Santa Terezinha).

Antes o site aceitava qualquer CEP começando com `30` ou `31` — ou seja, quase
todo o estado de Minas Gerais — e ainda mostrava "Entrega disponível no seu
CEP!". Isso gerava pedido que a farmácia não conseguia cumprir.

Bairros medidos e dentro do raio (valem para a lista do site):

| Bairro | Distância |
|---|---|
| Santa Terezinha | 0,45 km |
| Residencial Sarandi | 0,87 km |
| Ressaca | 0,93 km |
| Bandeirantes | 2,53 km |
| Pampulha | 3,58 km |

Próximos ficam fora: Vila Santo Antônio (5,3 km), Lagoinha (8,0), Nova Granada
(8,9), Venda Nova (10,6), Buritis (12,5).

Onde mexer:
- A lista fica em `script.js`, no começo, em `BAIRROS_ENTREGA`
- O `<datalist>` com os nomes fica em `carrinho.html` (para o cliente não digitar errado)
- O CEP no topo **não** decide mais nada: ele só guarda o número preenchido.
  A cobertura é por bairro, não por CEP.

Se o bairro digitado estiver fora da lista, o site avisa e pergunta se quer
enviar mesmo assim — a loja confirma pelo WhatsApp.

**Plano futuro:** quando entrar no iFood, a entrega deixa de ter limite de raio
e passa a ser feita pela plataforma.

## 1.7 Farmácia Popular — o que é verdade (confirmei na legislação)

Verificado em outubro/2026. Isto aqui **não pode ser mudado sem conferir de novo**.

**O programa é 100% gratuito. Não existe mais pagar parte.**

- **Portaria GM/MS nº 6.613, de 13/02/2025, Art. 7º:** *"os contraceptivos,
  absorventes higiênicos, as fraldas geriátricas e os medicamentos para
  tratamento de hipertensão arterial, diabetes mellitus, asma, osteoporose,
  dislipidemia, rinite, doença de Parkinson, glaucoma [...] serão
  disponibilizados **gratuitamente** aos usuários."*
- O próprio título da portaria: *"[...] **extinguindo a modalidade do
  copagamento** do Programa."*
- **Ministério da Saúde, ago/2026:** *"Farmácia Popular oferta 41 produtos
  **100% gratuitos** à população."*

### O erro que já foi cometido duas vezes

| Onde | O que estava | Por que está errado |
|---|---|---|
| Banner da home | "gratuitos ou com até 90% de desconto" | O copagamento foi extinto em fev/2025 |
| Banner da página | "AGORA É 100% GRATUITO" (sem dizer quem paga) | Dava a impressão de que a farmácia dava de graça |
| Seção do subsídio | "subsidiado: você paga a diferença" | Não existe mais essa modalidade |
| Texto do programa | "até 90% de desconto" | Informação velha, de antes de 2025 |

O "até 90%" vem do **Farmácia Popular antigo** (Lei 10.858/2004, segmento
populacional). O programa atual é o **Aqui Tem Farmácia Popular**, que é
gratuito. Misturar os dois é o que gerou a confusão.

### Regra para o site

1. Dizer que é **gratuito**, nunca "desconto"
2. Dizer que quem paga é o **Ministério da Saúde**, não a farmácia
3. **Não citar quantidade** ("41 itens") — a farmácia pode não ter tudo
4. A lista por condição é o **elenco do programa**, não o estoque da loja.
   Sempre mandar confirmar no WhatsApp.

## 2. Regra legal: medicamento controlado (tarja preta) — OBRIGATÓRIO

ANVISA / Lei 11.343/2006 e Lei 13.021/2014:

- **Tarja preta NÃO pode ser exposta** ao público (nem caixa à mostra em
  vitrine/balcão) — fica em armário fechado na loja
- **Farmácia comum NÃO pode vender controlado pela internet**
- O site da Droga G deve:
  1. **Não listar nem vender** tarja preta no catálogo (ex: alprazolam,
     clonazepam, alguns antidepressivos)
  2. Tarja vermelha pode aparecer, mas com o aviso de venda sob prescrição
  3. Ter informação de que controlado é venda exclusiva na loja, com receita
- Ao buscar fotos em APIs de farmácia, **nunca incluir** termos de controlados
  (alprazolam, clonazepam, rivotril, frontal etc.)

### Categorias de tarja (estado corrigido)

Antes a categoria `controlados` tinha 25 produtos, mas só **4 eram controlados
de verdade** (tarja preta / C1). Os outros 21 eram tarja vermelha — Azitromicina,
Amoxicilina, Ciprofloxacino, Metformina, Loratadina, Aciclovir — que é venda
livre em farmácia. Antibiótico comum estava com etiqueta de controlado.

Agora está correto e batendo com o campo `tarja` de cada produto:

| Categoria | Tarja | Qtd | Pode vender pela internet? |
|---|---|---|---|
| `medicamentos` | tarja vermelha | 41 | Sim, com aviso de prescrição |
| `controlados` | tarja preta (C1) | 4 | **Não** — só na loja, com receita |
| `higiene` | tarja livre | 24 | Sim |
| `dermocosmeticos` | tarja livre | 16 | Sim |
| `vitaminas` | tarja livre | 20 | Sim |

Os 4 controlados: Trazodona 100mg, Fluoxetina 20mg (cps e cpr), Sertralina 50mg.

### Onde o aviso de receita aparece

Decisão de design, não esquecimento:

- **Nos cartões: nada.** Nenhum selo sobre a foto — o catálogo fica limpo.
- **Na página do produto: sempre.** É ali que o cliente decide comprar, e é
  onde a informação é legally exigida. O texto muda conforme a tarja:
  - tarja preta → "MEDICAMENTO CONTROLADO — venda exclusiva na loja, mediante
    receita. Não realizamos venda pela internet"
  - tarja vermelha → "Venda sob prescrição médica — retire na loja apresentando
    a receita"
- Para os controlados, o botão também muda de "Consulte pelo WhatsApp" para
  "Consultar disponibilidade", para não parecer venda online.

O texto fica montado em `script.js`, na busca por `aviso de tarja`. Para
ajustar depois da conversa com a farmácia, é só editar aquele trecho.

### 1.1 Caixa padrão Droga G (decisão do dono)

Fotos reais de tarja preta/controlados **não podem ser usadas** (regra acima).
Fotos de farmácias grandes são mockups com a logo delas — também não serve.

Solução aprovada: **`img/caixa-drogag.webp`** — caixa ilustrativa criada pela
Droga G, com mascote "Dr. Amigo" (`assets/img/Dr. Amigo.png`), slogan
"Saúde, Economia e Confiança desde 2009", faixa "VENDA SOB PRESCRIÇÃO MÉDICA"
e aviso "Imagem ilustrativa".

Uso: copiar como `img/<SKU>.webp` dos medicamentos que não têm foto real
(controlados e casos sem foto). Gerador: histórico do repo / recriar com PIL
(base 600x600, verde #0b7a3d, faixa #d62828).

**Regra definitiva de fotos:**
- Quando o dono passar o estoque: **fotos REAIS** das caixas (fotografar na
  loja ou buscar por EAN com `baixar_ean.py`)
- **Só os controlados** (e os sem foto) usam a caixa padrão Droga G

## 3. Regras de foto de produto (aprendizado — NÃO reverter)

Fotos de farmácias grandes (Drogaria São Paulo, Pague Menos) são **mockups com
o logo da loja na caixa** — não serve para o site da Droga G.

Como detectar mockup (já implementado):
- **Nome do arquivo da imagem**: contém `tarja` ou `referencia` = mockup
- **Hash perceptual (dHash)**: mockups são a MESMA imagem repetida em vários
  produtos. Lista das variantes conhecidas em `mockups.txt` (hash 16 hex)
- Distância de Hamming <= 6 = mesmo mockup

Fontes testadas (VTEX `/api/catalog_system/pub/products/search/`):
- `paguemenos.com.br` — funciona, tem fotos reais + mockups
- `drogariasaopaulo.com.br` — funciona, MUITO mockup (mais perigoso)
- `drogariaspacheco.com.br` — funciona (testar qualidade)
- `drogasil.com.br` — 403 bloqueado
- `drogaraia`, `drogariacentral` — host inexistente

Filtros obrigatórios ao baixar foto:
1. nome do produto NÃO pode bater com: drogaria, drogasil, drogaraia, pacheco,
   venancio, nissei, extrafarma, raia, são paulo, pague menos (marca própria)
2. arquivo da imagem não pode ter `tarja`/`referencia`
3. hash não pode estar em `mockups.txt`
4. nome do remédio + dose + forma (comprimido/cápsula) devem bater com o produto

**Aviso:** o filtro automático de mockup NÃO é 100% — sempre conferir a foto na
mão. Mockups escapam quando o nome do arquivo não contém `tarja`/`referencia`.

## 4. Scripts do projeto

Requisitos: `python3` + `pip install pillow` (a maioria usa `urllib` nativo).

### Baixar imagens (fontes: APIs públicas VTEX de farmácia)

| Script | O que faz | Como rodar |
|---|---|---|
| `baixar_imagens.py` | Baixa fotos de URLs coladas no dicionário `URLS` e salva em `img/<SKU>.webp` (600px, webp) | Preencher `URLS` → `python baixar_imagens.py` |
| `baixar_ean.py` | Baixa a foto REAL pelo **código de barras (EAN)** (API seunegocionanuvem, sem chave). Melhor opção com a caixa física em mãos | Preencher campo `ean` → `python baixar_ean.py` |
| `baixar_imagens_multi.py` | Busca em Pague Menos + Drogaria SP, baixa 12 produtos + banco por categoria | `python baixar_imagens_multi.py` |
| `baixar_imagens_site.py` | Versão antiga que buscava só na Drogaria São Paulo | Legado |
| `buscar_fotos_pacheco.py` | Busca fotos REAIS em Pacheco + Pague Menos + SP com os 3 filtros | `python buscar_fotos_pacheco.py` |

### Limpeza / qualidade de foto

| Script | O que faz | Como rodar |
|---|---|---|
| `achar_mockups.py` | Detecta mockups: dHash de todas as `img/*.webp` e `img/banco/*/*.webp`, agrupa quase idênticas (Hamming <= 6) | `python achar_mockups.py` |
| `mockups.txt` | Negra lista de hashes de mockups conhecidas (`hash16hex  caminho`) | Editar manualmente |
| `substituir_mockups.py` | Apaga os mockups de `mockups.txt` e tenta baixar substitutas reais | `python substituir_mockups.py` |
| `trocar_fotos_produtos.py` | Troca só as fotos dos SKUs com problema (dicionário `TROCAS` no topo) | `python trocar_fotos_produtos.py` |

### Site

| Arquivo | O que é |
|---|---|
| `produtos-data.js` | **Catálogo** (`window.DROGAG_PRODUTOS`: sku, nome, preco, categoria, tarja, imagem). O `script.js` lê pra renderizar produtos, favoritos |
| `regenerar_fotos.py` | Regenera `fotos.html` a partir de `img/banco/<categoria>/` | `python regenerar_fotos.py` |

### Fluxo: adicionar foto de produto novo

1. Preferir foto REAL: fotografar a caixa na loja OU buscar por EAN
2. Se for tarja preta/controlado: **usar a caixa padrão** `img/caixa-drogag.webp`
3. Se for buscar em API: rodar `buscar_fotos_pacheco.py`
4. **Sempre abrir a imagem e conferir** que não tem logo de outra farmácia
5. Registrar o produto em `produtos-data.js`
6. Rodar `python regenerar_fotos.py` (se mexer no banco)
7. Commit + push (GitHub Pages atualiza sozinho em ~1 min)

## 5. Backlog (ideias que NÃO foram implementadas)

Nada aqui foi feito. Guardado só para não se perder:

- **Catálogo automático a partir do arquivo de estoque** (PRIORIDADE) —
  conseguir a planilha/export do sistema da farmácia e gerar o
  `produtos-data.js` com o que a loja tem de verdade, com fotos reais por EAN
- **Painel do administrador** — o dono precisa de um painel privado para
  adicionar oferta, mudar preço, tirar produto do ar e ver pedidos. Hoje edita
  `produtos-data.js` direto no GitHub
- **Hospedagem de verdade** (quando sair do teste) — domínio próprio (~R$ 40/ano
  no Registro.br) + Netlify/Vercel grátis com CDN, ou Hostinger/VPS se quiser
  servidor com e-mail
- **Pedido pelo Telegram em vez do WhatsApp** — o WhatsApp passou a cobrar por
  mensagem de negócio; bot do Telegram é grátis (manter o ícone do WhatsApp no
  site pra quem preferir)
