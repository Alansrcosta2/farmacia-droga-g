# Plano / Ideias pendentes

> Documento pra continuidade do projeto (serve pra outra IA ou pessoa continuar).
> Atualizado em: out/2026

## 0.3 Regra legal: medicamento controlado (tarja preta) — OBRIGATÓRIO

ANVISA / Lei 11.343/2006:
- **Tarja preta NÃO pode ser exposta** ao público (nem caixa à mostra em
  vitrine/balcão) — fica em armário fechado na loja
- **Farmácia comum NÃO pode vender controlado pela internet**
- Site da Droga G deve:
  1. **Não listar nem vender** tarja preta no catálogo (ex: alprazolam,
     clonazepam, alguns antidepressivos)
  2. Tarja vermelha (losartana, omeprazol, ibuprofeno 600...) pode aparecer,
     mas com aviso "venda sob prescrição médica — retire na loja com receita"
  3. Ter página/informação: "Medicamentos controlados: venda exclusiva na
     loja, mediante receita"
- Ao buscar fotos em APIs de farmácia, **nunca incluir** termos de controlados
  (alprazolam, clonazepam, rivotril, frontal etc.)

### 0.3.1 Caixa padrão Droga G (decisão do dono)

Fotos reais de tarja preta/controlados **não podem ser usadas** (regra acima).
Fotos de farmácias grandes são mockups com a logo delas — também não serve.

Solução aprovada: **`img/caixa-drogag.webp`** — caixa ilustrativa criada pela
Droga G, com:
- mascote "Dr. Amigo" (`assets/img/Dr. Amigo.png`)
- slogan "Saúde, Economia e Confiança desde 2009"
- faixa "VENDA SOB PRESCRIÇÃO MÉDICA" e aviso "Imagem ilustrativa"

Uso: copiar esse arquivo como `img/<SKU>.webp` dos medicamentos que não têm
foto real (controlados e casos sem foto). Gerador do arquivo: ver histórico
do repo / recriar com PIL (base 600x600, verde #0b7a3d, faixa #d62828).

**Regra definitiva de fotos (aguardando o arquivo de estoque):**
- Quando o dono passar o estoque: **fotos REAIS** das caixas (fotografar na
  loja ou buscar por EAN com `baixar_ean.py`) pra todo produto de venda livre
  e tarja vermelha
- **Só os controlados** (e os sem foto) usam a caixa padrão Droga G

## 0. Fase atual: TESTE no GitHub Pages

O site está em **fase de teste** no GitHub Pages
(https://alansrcosta2.github.io/farmacia-droga-g/). Serve pra validar layout,
produtos e pedidos com poucos clientes.

### 0.1 Hospedagem de verdade (quando sair do teste)

Quando tudo estiver pronto, o site precisa de hospedagem que aguente **várias
pessoas ao mesmo tempo**. Plano:

1. Comprar domínio próprio (ex: `drogag.com.br` — Registro.br, ~R$ 40/ano)
2. Hospedar em provedor com CDN e escala. Opções:
   - **Netlify** ou **Vercel** (plano grátis resolve pra farmácia pequena;
     deploy automático do GitHub; CDN global; aguenta pico de acesso)
   - **Hostinger / VPS** (se quiser servidor próprio com e-mail da loja)
3. Apontar o domínio pro provedor (DNS)
4. Manter o GitHub Pages como "ambiente de teste" ou desligar
5. Ativar HTTPS (grátis no Netlify/Vercel)

O site é estático (HTML/CSS/JS) — qualquer provedor aguenta. O gargalo real
seria o backend de pedidos (ver item 0.2), não o HTML.

### 0.2 Painel do administrador (adicionar/retirar ofertas)

O dono precisa de um painel **só pra ele**, pelo PC, pra:
- adicionar oferta / mudar preço / tirar produto do ar
- ver os pedidos recebidos

Requisito dele: **o painel NÃO pode ficar exposto no site público** — fica
apenas nas mãos de quem administra.

Opções (da mais simples pra mais completa):
1. **Hoje (testes):** editar `produtos-data.js` no repositório privado do
   GitHub (só quem tem acesso mexe). Sem painel visual.
2. **Painel estático protegido:** uma página `admin.html` com senha simples
   que salva no `localStorage` e gera o `produtos-data.js` pra download/upload.
   Proteção fraca (senha no código) — só serve pra não curioso.
3. **Solução certa (recomendada quando sair do teste):** hospedar junto um
   backend pequeno com **login real** (ex: Netlify Identity, Supabase ou
   Firebase — todos grátis no começo). O painel fica numa URL que só o dono
   conhece, com:
   - login com e-mail + senha
   - CRUD de produtos/ofertas (nome, preço, foto, destaque)
   - lista de pedidos recebidos
   - fotos upadas pro storage (sem passar por API de farmácia concorrente
     — usar as fotos reais das caixas da loja, ver item 3)
4. Alternativa sem programação: painel via **planilha Google Sheets** +
   apps script publicando o JSON pro site (dá pra proteger por e-mail).

Definir quando sair do teste e o orçamento (provavelmente R$ 0 a R$ 30/mês).

## 1. Catálogo a partir do arquivo de estoque da farmácia (PRIORIDADE)

Ideia do dono da Droga G: conseguir o **arquivo de estoque/ sistema da farmácia**
(planilha, txt, CSV, export do sistema, tanto faz) e gerar o catálogo do site
automaticamente, mostrando **apenas o que a loja tem de verdade**.

A farmácia é pequena, poucos produtos — é o caminho mais fácil e mais correto.

Passos quando o arquivo chegar:
1. Mapear colunas (nome, código de barras/EAN, preço, quantidade)
2. Gerar/atualizar `produtos-data.js` (sku, nome, preco, precoAntigo, categoria, imagem)
3. Baixar foto real de cada produto pelo **EAN** — já existe o script `baixar_ean.py`
   (API: api-produtos.seunegocionanuvem.com.br, sem chave)
4. Validar foto por foto (ver "regras de foto" abaixo)

## 2. Pedido pelo Telegram (bot grátis) mantendo ícone do WhatsApp

Ideia: o WhatsApp agora cobra por mensagem de negócio; **bot do Telegram é grátis**.

- Criar bot com @BotFather → token
- Quando o cliente fechar o pedido no carrinho, gerar link
  `https://t.me/<bot>?start=pedido_<id>` com os dados do pedido
- O bot envia pro dono: itens, total, endereço, CEP
- **Manter o ícone/ botão do WhatsApp no site** pra quem preferir
  (link wa.me já usado: https://wa.me/5531971716274)

Arquivos relevantes: `carrinho.html`, `script.js` (checkout/ WhatsApp atual).

## 3. Regras de foto de produto (aprendizado — NÃO reverter)

Problema vivido: fotos de farmácias grandes (Drogaria São Paulo, Pague Menos)
são **mockups com o logo da loja na caixa** — não serve pro site da Droga G.

Como detectar mockup (já implementado):
- **Nome do arquivo da imagem** da API: contém `tarja` ou `referencia` = mockup
  (ex: "GENERICO TARJA VERMELHA.jpg", "de-referencia-tarja-...-sao-paulo.jpg")
- **Hash perceptual (dHash)**: mockups são a MESMA imagem repetida em vários
  produtos. Lista das variantes conhecidas em `mockups.txt` (hash 16 hex)
- Comparar com distância de Hamming <= 6 = mesmo mockup
- Verificador: `achar_mockups.py` (roda e lista grupos repetidos)
- Limpeza/substituição: `substituir_mockups.py`

Fontes testadas (VTEX `/api/catalog_system/pub/products/search/`):
- `paguemenos.com.br` — funciona, tem fotos reais + mockups
- `drogariasaopaulo.com.br` — funciona, MUITO mockup (mais perigoso)
- `drogariaspacheco.com.br` — funciona (testar qualidade das fotos)
- `drogasil.com.br` — 403 bloqueado
- `drogaraia`, `drogariacentral` — host inexistente

Filtros obrigatórios ao baixar foto:
1. nome do produto NÃO pode bater com: drogaria, drogasil, drogaraia, pacheco,
   venancio, nissei, extrafarma, raia, são paulo, pague menos (marca própria)
2. arquivo da imagem não pode ter `tarja`/`referencia`
3. hash não pode estar em `mockups.txt`
4. nome do remédio + dose + forma (comprimido/cápsula) devem bater com o produto
   (ex: não aceitar "ibuprofeno gotas" pra produto que é "600mg 30 comprimidos")

## 4. Estado atual (out/2026)

- `img/` — 12 fotos de produto + `caixa-drogag.webp` (padrão). 4 produtos usam
  a caixa Droga G (LOSARTANA, OMEPRAZOL, ATENSINA, IBUPROFENO); os outros 8
  têm foto real de laboratório
- `img/banco/` — 158 fotos organizadas por categoria (medicamentos 38,
  genéricos 30, vitaminas 30, higiene 30, dermocosmeticos 30)
- `fotos.html` — galeria gerada por `regenerar_fotos.py` (rodar após mudar o banco)
- `produtos-data.js` — 12 produtos; será refeito quando o arquivo de estoque chegar
- Login GitHub: repo `Alansrcosta2/farmacia-droga-g`, Pages publica em
  https://alansrcosta2.github.io/farmacia-droga-g/

## 5. Pendências rápidas

- [x] Remover mockups com logo de drogaria concorrente
- [x] Criar caixa padrão Droga G (`img/caixa-drogag.webp`) pra controlados/sem foto
- [x] Reposição parcial do banco de genéricos (Pacheco)
- [x] Rodar `regenerar_fotos.py` e subir
- [ ] Quando o estoque chegar: fotos REAIS de tudo + `baixar_ean.py`
- [ ] Adicionar mais produtos ao catálogo (aguardar estoque — item 1)
- [ ] Telegram bot (item 2)
- [ ] Painel do administrador (item 0.2)
- [ ] Hospedagem de verdade (item 0.1)

## 6. Todos os scripts do projeto (documentação completa)

Pra outra IA/pessoa continuar: cada script serve pra quê e como rodar.
Requisitos: `python3` + `pip install pillow` (requests não é obrigatório —
a maioria usa `urllib` nativo).

### Scripts de baixar imagens (fontes: APIs públicas VTEX de farmácia)

| Script | O que faz | Como rodar |
|---|---|---|
| `baixar_imagens.py` | Baixa fotos das URLs que VOCÊ cola no dicionário `URLS` e salva em `img/<SKU>.webp` (redimensiona 600px, converte webp) | Preencher `URLS` no topo → `python baixar_imagens.py` |
| `baixar_imagens_site.py` | Versão antiga: buscava automaticamente na API da Drogaria São Paulo (muitos mockups) | Legado — substituído por `baixar_imagens_multi.py` |
| `baixar_imagens_multi.py` | Busca em Pague Menos + Drogaria SP, filtra nome com marca de drogaria, baixa 12 produtos do site + banco por categoria (30 cada) em `img/banco/<categoria>/` | `python baixar_imagens_multi.py` |
| `baixar_ean.py` | Baixa a foto REAL pelo **código de barras (EAN)** do produto (API seunegocionanuvem, sem chave). Melhor opção quando tiver a caixa física em mãos | Preencher campo `ean` de cada produto → `python baixar_ean.py` |

### Scripts de limpeza / qualidade de foto

| Script | O que faz | Como rodar |
|---|---|---|
| `achar_mockups.py` | Detecta mockups: calcula dHash perceptual de todas as `img/*.webp` e `img/banco/*/*.webp`, agrupa imagens quase idênticas (dist Hamming <= 6). Mockup = mesma foto repetida em vários produtos | `python achar_mockups.py` |
| `mockups.txt` | Lista dos hashes das variantes de mockup conhecidas (formato: `hash16hex  caminho`). É a "negra lista" usada pelos outros scripts | Editar/atualizar manualmente ou via histórico |
| `substituir_mockups.py` | Apaga os mockups listados em `mockups.txt` e tenta baixar substitutas reais (rejeita arquivo com `tarja`/`referencia`, rejeita hash de mockup) | `python substituir_mockups.py` |
| `buscar_fotos_pacheco.py` | Busca fotos REAIS em Pacheco + Pague Menos + SP com 3 filtros (marca proibida, nome do arquivo sem tarja, hash fora da negra lista) e termos obrigatórios (remédio+dose+forma). Preenche SKUs que faltam + reposição do banco de genéricos | `python buscar_fotos_pacheco.py` |
| `trocar_fotos_produtos.py` | Troca só as fotos dos SKUs com problema (dicionário `TROCAS` no topo) por cópia do banco ou busca na API | `python trocar_fotos_produtos.py` |

**Aviso:** o filtro automático de mockup NÃO é 100% — sempre **conferir a foto
na mão** (abrir o webp e olhar se tem logo de drogaria). Mockups escapam do
filtro quando o nome do arquivo não contém `tarja`/`referencia`.

### Scripts do site

| Script | O que faz | Como rodar |
|---|---|---|
| `regenerar_fotos.py` | Regenera a galeria `fotos.html` a partir de tudo que existe em `img/banco/<categoria>/` (legendas limpas, ordem por categoria) | `python regenerar_fotos.py` depois de mudar o banco |
| `produtos-data.js` | NÃO é script — é o **catálogo** (array `window.DROGAG_PRODUTOS` com sku, nome, preco, precoAntigo, parcelas, categoria, imagem). O `script.js` lê ele pra renderizar produtos, carrinho, favoritos | Editar ao adicionar produto novo |

### Fluxo completo de "adicionar foto de produto novo"

1. Preferir foto REAL: fotografar a caixa na loja OU buscar por EAN
   (`baixar_ean.py`)
2. Se for medicamento de tarja preta/controlado: **usar a caixa padrão**
   `img/caixa-drogag.webp` (copiar como `img/<SKU>.webp`)
3. Se for buscar em API: rodar `buscar_fotos_pacheco.py` (tem os 3 filtros)
4. **Sempre abrir a imagem e conferir** que não tem logo de outra farmácia
5. Registrar o produto novo em `produtos-data.js`
6. Rodar `python regenerar_fotos.py` (se mexer no banco)
7. Commit + push (GitHub Pages atualiza sozinho em ~1 min)
