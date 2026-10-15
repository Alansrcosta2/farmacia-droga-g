# Como pedir os dados do Dmaster

> O que você precisa exportar do sistema da farmácia para o site virar loja de verdade.
> Imprimir e levar na mão, ou abrir no computador e me mostrar.

---

## 1. O que pedir (o que realmente importa)

### A) Produtos — ESSENCIAL

Sem isso o site **não mostra preço** e **não sabe estoque**. É o maior bloqueio do projeto.

| Campo | Para que serve no site | Exemplo |
|---|---|---|
| **Código interno** | Identificar o produto e bater com o Dmaster | `AAS_100MG_30` |
| **EAN (código de barras)** | Buscar foto real do produto automaticamente | `7891234567890` |
| **Nome** | Nome que aparece no site | `AAS 100MG CX 30 COMP` |
| **Preço de venda** | Preço mostrado no card e no carrinho | `24,50` |
| **Preço de referência** | Base do "de R$ X por R$ Y" | `39,90` |
| **Estoque (quantidade)** | Mostrar "em estoque" e avisar quando acabar | `17` |
| **Categoria** | Separar em Medicamentos / Controlados / Vitaminas / Higiene / Dermocosméticos | `medicamentos` |
| **Fabricante** | Filtro e referência | `EMS` |
| **Tarja** | Vermelha, preta (controlado) ou livre | `tarja_vermelha` |

### B) Clientes — OPCIONAL, e só para você

Esse arquivo **não entra no site**. Fica fora, serve para você mandar WhatsApp
de voltamares.

| Campo | Para que serve |
|---|---|
| **Nome** | Personalizar a mensagem |
| **Telefone / WhatsApp** | Enviar a mensagem |
| **CPF** | Identificar (atenção: dado sensível) |
| **Bairro** | Saber se está na área de entrega |
| **Data da última compra** | Saber quem está sumido |

⚠️ **Cuidado com dado pessoal.** O arquivo de clientes tem nome, CPF e telefone.
Ele fica **fora do site**, não entra em página pública, não vai para link.
Use só para mensagem de retomada, com o cuidado da LGPD.

---

## 2. Como exportar

Varia conforme o Dmaster, mas normalmente é:

- **Relatórios → Estoque / Produtos → Exportar** (gera `.csv` ou `.xlsx`)
- Ou **Produtos → Relatórios → Inventário**

Se não achar, tire **print da tela** de listagem de produtos com preço e
estoque. Eu leio o que estiver legível e pergunto o que faltar.

**Formatos que eu leio:** `.csv`, `.xlsx`, `.txt`, `.json`, ou print.

---

## 3. O que acontece depois que você me mandar

1. Eu leio o arquivo e confiro: 105 produtos, batendo com o site
2. Gero o `produtos-data.js` com preço, estoque e categoria corrigidos
3. Ligo a **exibição de preço** no site (hoje está escondida de propósito)
4. Adiciono "Em estoque" / "Últimas unidades" no card
5. Se tiver EAN, baixo **foto real** de cada produto
6. Sincronizo os 12 cards da home

**Tempo estimado:** uma tarde de trabalho, dependendo do tamanho do arquivo.

---

## 4. Por que isso é prioridade sobre tudo

| Item | Onde está | Efeito |
|---|---|---|
| Preço | 27 de 105 produtos | Cliente não sabe se pode pagar |
| Estoque | 0 de 105 | Cliente pede o que não tem |
| Pagamento | não existe | Não dá para fechar compra sozinho |
| Foto real | 41 de 105 | 61% com foto genérica |
| Conta do cliente | não existe | Sem histórico de pedidos |

**Nenhum desses se resolve escrevendo código.** Todos dependem desse arquivo.
