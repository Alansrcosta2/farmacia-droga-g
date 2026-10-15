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

### C) Promoções — IMPORTANTE

O dono já sabe que existem ofertas, tipo **dipirona a R$ 4,99** ou **3 por
R$ 12**. Cada promoção precisa destes campos:

| Campo | Para que serve no site | Exemplo |
|---|---|---|
| **Produto** | Qual item está em promoção | `DIPIRONA_500MG_20` |
| **Preço normal** | O "de R$ X" que aparece riscado | `7,90` |
| **Preço da promoção** | O valor em destaque | `4,99` |
| **Tipo** | Desconto fixo ou "N por R$ Y" | `desconto` / `3por12` |
| **Quantidade do combo** | Quantas unidades pelo preço combinado (no "3 por 12") | `3` |
| **Data final** | "Válido até" — **obrigatório** | `30/11` |
| **Condição** | Só para cliente? Só com cartão? Para qualquer um? | `qualquer um` |

**Três avisos importantes sobre promoção:**

1. **Promoção tem que mostrar o preço que ela substitui.** Se o site
   mostrar só "Dipirona R$ 4,99" sem o "de R$ 7,90", o cliente não sabe
   que é desconto e não existe como provar o abatimento. Ou seja:
   **mostrar promoção significa mostrar preço normal junto.**

2. **Medicamento controlado não entra em promoção.** A Receita Federal
   proíbe desconto sobre controlado. São 4 aqui: **Trazodona,
   Fluoxetina (2) e Sertralina**. Esses ficam sempre no preço normal.

3. **Promoção vencida exposta no site dá problema** — é multa e cliente
   bravo no balcão. Por isso a data final é obrigatória.

### D) Perguntas para o suporte do Dmaster

Leve estas 4 perguntas. A resposta muda a forma de trabalhar:

| # | Pergunta | Por que importa |
|---|---|---|
| 1 | **O Dmaster tem API?** Libera preço e estoque por sistema? | Se tem, o site atualiza sozinho. Se não tem, atualiza na mão |
| 2 | **A API é gratuita ou só no plano pago?** | Pode mudar o custo |
| 3 | **Com que frequência os preços mudam?** | Se muda toda semana, site desatualizado é problema |
| 4 | **Dá para exportar só a lista de promoções?** | Evita planilha com 105 produtos |

> **Não coloque senha de API dentro do site.** O site é público no GitHub.
> Se a API exigir senha, o caminho é outro (privar o site ou usar um
> servidor no meio). Me avise antes de fazer qualquer coisa nessa parte.

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
4. Adiciono **disponibilidade** no card — sem número exato de estoque
5. Se vier a lista de promoções, monto os selos "de R$ X por R$ Y"
6. Se tiver EAN, baixo **foto real** de cada produto
7. Sincronizo os cards da home

**Tempo estimado:** uma tarde de trabalho, dependendo do tamanho do arquivo.

### Sobre mostrar o estoque

Decisão já tomada, e o motivo é simples:

> Se o site disser "12 unidades" e chegar 0 na loja, o cliente foi até lá
> à toa. Isso queima a confiança mais rápido do que preço errado.

Por isso o site vai mostrar **disponibilidade** ("disponível" ou "consulte"),
e não a quantidade exata. Preço muda pouco e dá para conferir; estoque
envelhece em horas.

**O que isso significa para você:** quando você alterar um preço, me avise
que eu atualizo em 1 minuto. É o único custo de manter.

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

---

## 5. Resumo para levar na farmácia

Peça **uma vez só**:

1. ✅ Lista de produtos com **preço** e **estoque**
2. ✅ Lista de **promoções** (se tiver), com a **data final** de cada uma
3. ✅ Resposta das **4 perguntas do suporte** (seção 1D)
4. ✅ Se tiver, o **código de barras** de cada produto

**Não leve para o site:** arquivo de clientes com CPF e telefone.

**Antes de publicar o site com preço**, confirme:

- [ ] Preços revisados pelo farmacêutico responsável
- [ ] Data final de cada promoção conferida
- [ ] Preço de Farmácia Popular separado (é regulado e diferente)
- [ ] Controlados fora de promoção (Trazodona, Fluoxetina, Sertralina)
