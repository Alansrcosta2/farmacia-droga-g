# ETAPA 1 — Auditoria técnica do catálogo
## Farmácia Droga G — https://alansrcosta2.github.io/farmacia-droga-g/

**Data da auditoria:** 12/10/2026  
**Escopo:** `produtos.html`, `produto.html`, `produtos-data.js`, `estoque-data.js`, `script.js`, imagens, busca, filtros, categorias, carrinho e comportamento mobile.  
**Regra desta etapa:** somente leitura — nenhum arquivo alterado, nenhum preço alterado, nenhum commit.  
**Arquitetura preservada:** site estático GitHub Pages, dados em JS, sem backend.

---

## 1. Resumo executivo

| Situação | Qtd |
|----------|-----|
| Problemas comprovados | 11 |
| Hipóteses (precisam de teste) | 5 |
| Prioridade alta | 4 |
| Prioridade média | 5 |
| Prioridade baixa | 2 |

**O que funciona bem**
- Catálogo dinâmico a partir de `window.DROGAG_PRODUTOS`.
- Card clicável → `produto.html?sku=...`.
- Todos os SKUs do home existem em `produtos-data.js`.
- Nenhuma imagem referenciada está faltando no repositório (105 referências, 52 arquivos únicos, 0 faltando).
- Preços **não** aparecem na interface (cards, detalhe e carrinho mostram “Consulte pelo WhatsApp”).
- Produtos de tarja preta **não** estão no catálogo online.
- Avisos de receita (tarja vermelha) e C1 no detalhe do produto.
- `node --check script.js` passa sem erro de sintaxe.

**Riscos principais**
1. Imagem errada em Paracetamol 500 mg.
2. Categorização errada (“controlados” com remédios de pressão, diabetes, antibióticos e Loratadina).
3. Favoritos não funcionam no catálogo principal.
4. Arquivo `estoque-data.js` órfão, com preços diferentes do catálogo.

---

## 2. Problemas comprovados

### P1 — Botão “Adicionar” referencia variável inexistente (`nameEl`)

| Campo | Detalhe |
|--------|---------|
| **Problema** | `ReferenceError` latente: `nameEl` não existe no escopo do handler. |
| **Arquivo / trecho** | `script.js:179-194` |
| **Evidência** | `const productName = nameEl ? nameEl.textContent.trim() : 'Produto';` — `nameEl` não está declarada nesse bloco. Hoje o `if (btn.textContent.includes('Adicionar'))` não entra em uso no catálogo atual (botões viram “Consulte pelo WhatsApp”). |
| **Impacto** | Se reaparecer botão “Adicionar”, o clique quebra e o item não entra no carrinho. |
| **Prioridade** | Média (código morto perigoso) |
| **Correção recomendada** | Remover o bloco inteiro **ou** corrigir para `card.querySelector('.product-name')`. |

---

### P2 — `estoque-data.js` órfão e com preços divergentes do catálogo

| Campo | Detalhe |
|--------|---------|
| **Problema** | Arquivo não é carregado por nenhuma página e não é usado pelo JS; possui preços diferentes de `produtos-data.js`. |
| **Arquivo / trecho** | `estoque-data.js` (arquivo inteiro); nenhum `<script src="estoque-data.html">` / `.js>` nos HTML; `script.js` não referencia `DROGAG_ESTOQUE`. |
| **Evidência** | Busca em HTML/JS: 0 referências. Comparação de preços com o catálogo: **27 divergências** (ex.: Paracetamol 500 mg 4,83 × 5,50; Ablok 3,11 × 3,90). |
| **Impacto** | Risco de alguém ativar o arquivo por engano e misturar duas fontes. Sem impacto visual hoje (preços não são exibidos). |
| **Prioridade** | Baixa (risco operacional / manutenção) |
| **Correção recomendada** | Remover do repositório **ou** isolar com aviso “NÃO USAR no front”; idealmente unificar com `produtos-data.js`. |

---

### P3 — Imagem incorreta: Paracetamol 500 mg usa foto de 750 mg

| Campo | Detalhe |
|--------|---------|
| **Problema** | SKU de 500 mg aponta para arquivo de 750 mg. |
| **Arquivo / trecho** | `produtos-data.js:9` (`PARACETAMOL_500MG_20`); card home `index.html:169`. |
| **Evidência** | `imagem: "img/banco/medicamentos/analg-sico-e-antit-rmico-paracetamol-750mg-gen-rico-prati-do.webp"`. Em `img/banco/medicamentos/` não existe arquivo de 500 mg. |
| **Impacto** | Cliente vê a caixa de outro produto; perda de confiança; erro de identificação no balcão. |
| **Prioridade** | **Alta** |
| **Correção recomendada** | Fotografar a caixa de 500 mg e apontar o novo arquivo; até lá, usar `img/caixa-drogag.webp`. |

---

### P4 — Classificação errada: muitos medicamentos em “controlados”

| Campo | Detalhe |
|--------|---------|
| **Problema** | Categoria “controlados” no site mistura C1 reais, antibióticos, crônicos de tarja vermelha e até antialérgico. |
| **Arquivo / trecho** | `produtos-data.js` (ex.: linhas de Loratadina, Captopril, Enalapril, Metformina, Atorvastatina, Sinvastatina, Amoxicilina, Ciprofloxacino, Aciclovir, Prednisona); filtro em `produtos.html:69`. |
| **Evidência** | Contagem por categoria no catálogo: controlados 25, higiene 24, medicamentos 20, vitaminas 20, dermocosméticos 16. Exemplos problemáticos: **LORATADINA** (antialérgico comum) em `controlados`; **CAPTOPRIL / ENALAPRIL / METFORMINA / ESTATINAS** (crônicos, tarja vermelha, não C1) em `controlados`. |
| **Impacto** | Cliente entende errado a necessidade de receita; filtro deixa de ser confiável; layout de app de farmácia perde credibilidade. |
| **Prioridade** | **Alta** |
| **Correção recomendada** | “Controlados” = apenas `tarja_vermelha_c1` (Fluoxetina, Trazodona, Sertralina…). Demais tarja vermelha → `medicamentos`. Manter badge “COM RECEITA” no card (já existe). |

---

### P5 — Busca não normaliza acentos

| Campo | Detalhe |
|--------|---------|
| **Problema** | Busca usa só `toLowerCase()`; termo sem acento não casa com nome com acento. |
| **Arquivo / trecho** | `script.js:59-75` e `77-97`. |
| **Evidência** | `productName.includes(termo)` sem `normalize('NFD')`. Ex.: “serum” não encontra “SÉRUM…”. |
| **Impacto** | No celular, usuário digita sem acento e acha menos produto. |
| **Prioridade** | Média |
| **Correção recomendada** | Normalizar termo e nome/SKU com `normalize('NFD').replace(/[\u0300-\u036f]/g, '')`. |

---

### P6 — Filtro de categoria e busca se sobrescrevem

| Campo | Detalhe |
|--------|---------|
| **Problema** | Fluxos de busca e filtro de categoria não combinam o estado. |
| **Arquivo / trecho** | `script.js:91-93` (busca força botão “Todos” ativo); `108-118` / `120-129` (filtro não limpa nem aplica o texto da busca). |
| **Evidência** | Após busca, botões de categoria ficam sem `active` mas o texto permanece no input. Clicar em categoria filtra só por categoria, “esquecendo” a busca (e vice-versa). |
| **Impacto** | Resultado confusing no celular. |
| **Prioridade** | Média |
| **Correção recomendada** | Um único motor de filtro: `categoria + termo` juntos; ou limpar um ao aplicar o outro. |

---

### P7 — Badge da tab bar continua mostrando “0” após limpar o carrinho

| Campo | Detalhe |
|--------|---------|
| **Problema** | Badge inferior (tab bar) não some quando o carrinho zera depois da criação da barra. |
| **Arquivo / trecho** | `script.js:161-165` (`updateCartBadge` só altera texto); `797-803` (observer esconde só `.icon-badge`); `745-767` (init da tab bar esconde “0” só uma vez). |
| **Evidência** | `updateCartBadge()` grava `0` em `[data-cart-count]` (inclusive `.tab-badge`) sem alterar `display`. |
| **Impacto** | Visual de app amador; badge “0” na barra inferior. |
| **Prioridade** | Média |
| **Correção recomendada** | Estender o observer a `.tab-badge` **ou** esconder zero dentro de `updateCartBadge`. |

---

### P8 — Cards do catálogo dinâmico não têm botão de favoritos

| Campo | Detalhe |
|--------|---------|
| **Problema** | Não é possível favoritar direto na página de produtos. |
| **Arquivo / trecho** | `script.js:296-316` (`renderCatalogoDinamico` não gera `.favorite-btn`); bind de favoritos em `208-223` roda no parse, antes do render em `DOMContentLoaded`. |
| **Evidência** | `produtos.html`: 0 ocorrências de `favorite-btn`. `index.html`: 12 (cards estáticos do home). |
| **Impacto** | Fluxo de favoritos incompleto no catálogo principal (apps de farmácia sempre têm coração no card). |
| **Prioridade** | **Alta** (UX principal) |
| **Correção recomendada** | Gerar o botão no card dinâmico + delegação de eventos **ou** rebind após `renderCatalogoDinamico`. |

---

### P9 — Campo `estoque` nunca existe no catálogo usado pela UI

| Campo | Detalhe |
|--------|---------|
| **Problema** | A página de produto só mostra “X unidade(s) em estoque” se `data.estoque > 0`, mas `produtos-data.js` não tem o campo. |
| **Arquivo / trecho** | `script.js:650-652`; `produtos-data.js` (0 ocorrências de `estoque:`). |
| **Evidência** | `estoque-data.js` tem `estoque`, mas o arquivo não é carregado. |
| **Impacto** | Recurso morto; cliente não vê disponibilidade real. |
| **Prioridade** | Baixa se for remover; Média se for mostrar estoque |
| **Correção recomendada** | Migrar números de estoque para `produtos-data.js` **ou** remover o bloco da UI até houver dado confiável. |

---

### P10 — `produtos.html` e `produto.html` sem meta description e sem JSON-LD

| Campo | Detalhe |
|--------|---------|
| **Problema** | SEO local/frases de busca fracas nas páginas de catálogo e produto. |
| **Arquivo / trecho** | `produtos.html`, `produto.html` — só `index.html` tem `<meta name="description">`. Nenhum HTML tem `application/ld+json`. |
| **Evidência** | Busca por `meta name="description"` e `ld+json` nos HTML. |
| **Impacto** | Menor visibilidade no Google para “farmácia Santa Terezinha”, “comprar dipirona BH” etc. |
| **Prioridade** | Média (próximo marco SEO) |
| **Correção recomendada** | Description única por página + JSON-LD `Product` e `LocalBusiness` com os 3 telefones oficiais. |

---

### P11 — Possível duplicidade: dois itens de Sulfametoxazol+Trimetoprima

| Campo | Detalhe |
|--------|---------|
| **Problema** | Dois SKUs com nomes diferentes para o mesmo tipo de produto (suspensão 100 ml). |
| **Arquivo / trecho** | `produtos-data.js:70-84` (`SULF_TRIM_SUSP_100ML` e `SULFAMETOXAZOL_TRIMETOPRIMA`). |
| **Evidência** | Em `estoque-data.js` aparecem como dois códigos (672 e 95084) com preços muito próximos (5,55 e 5,73). Pode ser o mesmo item com nome de CSV + nome comercial. |
| **Impacto** | Card “duplicado” no catálogo. |
| **Prioridade** | Média |
| **Correção recomendada** | Conferir no Dmaster; se for o mesmo, unificar SKU e nome. |

---

## 3. Hipóteses (ainda precisam de teste)

| # | Hipótese | Como testar |
|---|----------|-------------|
| H1 | Busca sem acento falha (relacionado a P5) | Em `produtos.html`, buscar `serum` e depois `sérum`. |
| H2 | 105 cards em página única travam celular antigo | Abrir o catálogo completo em Android pequeno. |
| H3 | Nome com `"` ou `<` no futuro injetaria HTML | Só se editar `produtos-data.js`; hoje nenhum nome tem aspas. |
| H4 | Se `script.js` falhar, home mostra “Carregando...” nos nomes dos cards | Bloquear JS ou simular erro. |
| H5 | Imagens de `img/banco/**` com marca de concorrente | Revisão visual manual das pastas (pendência antiga, ~52 arquivos). |

---

## 4. Não mexer (funcionando)

- Render dinâmico do catálogo e página de produto.
- Mensagens de WhatsApp com protocolo (`msgConsultaProduto`, `msgPedido`).
- Carrinho e checkout só via WhatsApp (sem preço na UI, conforme decisão do dono).
- Tab bar mobile, drawer, chips de categoria em `produtos.html`.
- Avisos de tarja vermelha e C1 no detalhe.
- Exclusão de tarja preta do catálogo online.

---

## 5. Lista de alterações propostas (aguardando autorização)

| # | Alteração | Prioridade |
|---|-----------|------------|
| 1 | Corrigir imagem do Paracetamol 500 mg (P3) | Alta |
| 2 | Reclassificar categorias: “controlados” só C1 (P4) | Alta |
| 3 | Favoritos nos cards do catálogo (P8) | Alta |
| 4 | Esconder badge “0” da tab bar (P7) | Média |
| 5 | Normalizar acentos na busca (P5) | Média |
| 6 | Remover ou isolar `estoque-data.js` (P2) | Baixa |
| 7 | Remover bloco morto “Adicionar”/`nameEl` (P1) | Média |
| 8 | Unificar busca + filtro de categoria (P6) | Média |
| 9 | Estoque real no produto **ou** remover bloco da UI (P9) | Opcional |
| 10 | Meta description + JSON-LD em produtos/produto (P10) | SEO |
| 11 | Confirmar no Dmaster os dois Sulfametoxazol (P11) | Dados |

---

## 6. Metadados da auditoria

- **Repositório:** `Alansrcosta2/farmacia-droga-g` (branch `main`)
- **Ambiente de leitura:** clone local, sem navegador (não foi possível screenshot/Playwright)
- **Método:** leitura estática dos arquivos + checagem de existência de imagens + comparação de preços entre `estoque-data.js` e `produtos-data.js` + validação de sintaxe com `node --check`
- **Limitação declarada:** comportamento de toque/rolagem no Android real não foi executado neste ambiente; itens da seção 3 dependem de teste no aparelho do responsável.

---

*Fim do relatório — ETAPA 1. Aguardando autorização para executar as alterações da seção 5.*
