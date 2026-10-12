# RELATÓRIO — ETAPA 2 (correções controladas)
## Farmácia Droga G

**Data:** 12/10/2026  
**Escopo autorizado:** P3, P5, P6, P7, P8 de `AUDITORIA-CATALOGO.md`  
**Restrições:** sem refazer o site; sem alterar preços, SKUs, nomes, estoque, telefones ou categorias; sem remover `estoque-data.js` nem o bloco `nameEl`; sem dependências novas; checkout só WhatsApp; sem preços na interface.

---

## 1. Arquivos modificados

| Arquivo | Mudança |
|---------|---------|
| `produtos-data.js` | 1 linha — imagem do SKU `PARACETAMOL_500MG_20` |
| `index.html` | 1 linha — imagem do card home do mesmo SKU |
| `script.js` | Busca/filtro combinados, badge do carrinho, favoritos no catálogo dinâmico |

Não foram criados nem removidos arquivos. Não houve alteração em `estoque-data.js`, `produtos.html`, `carrinho.html` ou categorias.

---

## 2. Resumo de cada alteração

### P3 — Imagem do Paracetamol 500 mg
- **Antes:** `img/banco/medicamentos/analg-sico-e-antit-rmico-paracetamol-750mg-gen-rico-prati-do.webp` (foto de 750 mg).
- **Depois:** `img/caixa-drogag.webp` (caixa genérica oficial da Droga G — arquivo existe no repo).
- **Onde:** `produtos-data.js` (catálogo + detalhe + favoritos) e card estático do home em `index.html`.
- **Preservado:** SKU `PARACETAMOL_500MG_20`, nome, apresentação, dosagem e preço interno (não exibido).

### P5 — Busca sem acentos
- Nova função `normalizarTexto()`: `toLowerCase` + `normalize('NFD')` + remoção de diacríticos (`[̀-ͯ]`).
- Aplicada ao **termo digitado**, ao **nome** e ao **SKU** (com `_` → espaço nos dois lados).
- Busca parcial (`includes`) e por SKU preservadas.
- Dados dos medicamentos **não** foram alterados.

### P6 — Busca × categorias simultâneas
- `filtrarCardsCombinado()` aplica **termo E categoria** juntos.
- `performSearch` **não** força mais o botão “Todos” nem limpa a categoria.
- `applyCategoryFilter()` (sem argumento) usa a categoria ativa e reaplica o termo atual do input.
- Limpar a busca mantém a categoria; trocar de categoria mantém o texto.
- Botão “Todos”, contador de toast e scroll até o grid mantidos.

### P7 — Contador do carrinho
- `updateCartBadge()` agora grava o número **e** `display: none` quando `0`.
- Observer do KIT FINAL passou a cobrir `.icon-badge` **e** `.tab-badge`.
- Regras do carrinho e do pedido por WhatsApp **inalteradas**.

### P8 — Favoritos no catálogo
- Cards dinâmicos ganham `<button class="favorite-btn" type="button">` com o mesmo CSS atual (coração no canto).
- Após o render: estado `favorited` a partir do `localStorage` + bind com guarda `_favInit` (sem duplicar eventos).
- `stopPropagation` para não navegar para o produto ao favoritar.
- Persistência (`droga_g_favorites`) e `favoritos.html` sem mudança de formato.

---

## 3. Testes executados e resultados

| # | Teste | Como | Resultado |
|---|--------|------|-----------|
| 1 | `node --check script.js` | Executado de verdade (Node) | **OK** |
| 2 | Normalização `SÉRUM→serum`, `ÁCIDO→acido` | Executado (Node, função isolada) | **OK** |
| 3 | Busca real no catálogo: `serum`/`sérum` (5), `acido`/`ácido` (1), `fluoxetina` (2), `vitamina` (22), `PARACETAMOL_500` (1), `paracetamol 500` (1) | Executado (Node + `produtos-data.js`) | **OK** |
| 4 | Combinação: `vitamina`+vitaminas (18); `vitamina`+higiene (0); vazio+controlados (25); vazio+all (105) | Executado (Node) | **OK** |
| 5 | Ordem dos filtros: busca → trocar categoria (termo mantido) → limpar busca (categoria mantida = 24 higiene) | Executado (simulação de estado idêntica ao JS) | **OK** |
| 6 | Badge: lógica `n ? '' : 'none'` em `updateCartBadge` + observer `.icon-badge, .tab-badge` | Estático (leitura do código) + validação de string | **OK** (sem navegador) |
| 7 | Favoritos: botão no HTML gerado, `_favInit`, estado inicial via `loadFavorites`, `toggleFavoriteForProduct` | Estático / Node parcial | **OK** (sem navegador) |
| 8 | Card ainda abre `produto.html?sku=` | Estático | **OK** |
| 9 | Diff: só imagem no P3; nenhum SKU/nome/preço/categoria alterado | `git diff` | **OK** |
| 10 | `estoque-data.js` e bloco `nameEl`/`Adicionar` presentes | Estático | **OK** (não removidos) |

### Limitação de testes (sem navegador neste ambiente)
Não há Chromium/Playwright neste Termux. **Não** foi possível validar visualmente:
- cor vermelha do coração ao toque;
- toast de contagem na tela;
- badge da tab bar no Android (esconder/mostrar ao vivo);
- rolagem/aparência dos cards com o botão novo.

Sugestão de conferência manual no celular: abrir `produtos.html`, favoritar 2 itens, buscar `serum`, trocar para `dermocosmeticos`, limpar a busca, esvaziar o carrinho e recarregar a página de favoritos.

---

## 4. Problemas restantes e limitações

Itens **fora** desta etapa (conforme restrições):
- P1 — bloco morto `nameEl` (mantido de propósito).
- P2 — `estoque-data.js` órfão (mantido).
- P4 — categorias “controlados” (não alteradas nesta etapa).
- P9 — campo `estoque` nunca preenchido na UI.
- P10 — meta description / JSON-LD em produtos e produto.
- P11 — possível duplicidade Sulfametoxazol (precisa Dmaster).
- H1–H5 — hipóteses da auditoria que dependem de aparelho real ou revisão visual.

---

## 5. Confirmação de restrições

| Restrição | Status |
|-----------|--------|
| Não refazer o site / arquivos inteiros | Respeitado (mudanças pontuais) |
| Sem alterar preços, SKUs, nomes, estoque, telefones, regras comerciais | Respeitado (diff só de imagem + JS de UI) |
| Sem modificar categorias de medicamentos | Respeitado |
| Sem remover `estoque-data.js` nem bloco `nameEl` | Respeitado |
| Sem dependências externas novas | Respeitado |
| Checkout só WhatsApp; sem preços na interface | Respeitado |
| Estilo atual do código preservado | Respeitado |

---

## 6. Commit

- **Commit local:** `Etapa 2: P3 imagem 500mg, P5 acentos, P6 busca+categoria, P7 badge, P8 favoritos catálogo`
- **Push:** **não realizado** (conforme “não publique em produção”; aguardando autorização).

---

*Aguardando autorização para publicar (push) e para a próxima etapa.*
