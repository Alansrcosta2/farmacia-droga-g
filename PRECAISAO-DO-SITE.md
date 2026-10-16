# O que precisamos da farmácia para o site ficar pronto

> Lista de entrega. Cada item diz **o quê**, **por que**, **onde achar** e **o que trava** se faltar.
> Imprima, ou abra no celular e vá marcando.
>
> Atualizado: outubro/2026

---

## Resumo em 10 linhas

**7 coisas destravam a venda.** Sem elas o site fica bonito mas não vende:
export do Dmaster · marca da maquininha · link de pagamento · perfil no Google ·
responsável técnico · registro ANVISA · fotos reais.

**Tudo o mais é refinamento** e pode esperar.

| # | Item | Trava o quê | Prioridade |
|---|---|---|---|
| 1 | Export do Dmaster (produtos) | Preço e estoque | 🔴 |
| 2 | Marca da maquininha | Pagamento online | 🔴 |
| 3 | Link de pagamento | Cobrar do cliente | 🔴 |
| 4 | Responsável técnico + CRF | Obrigação legal | 🔴 |
| 5 | Registro ANVISA | Obrigação legal | 🔴 |
| 6 | Perfil no Google | Cliente novo | 🔴 |
| 7 | Fotos reais dos produtos | Confiança | 🟡 |
| 8 | Lista do Farmácia Popular que tem | Não prometer o que não tem | 🟡 |
| 9 | Política de troca (confirmação) | Regra da página | 🟡 |
| 10 | Faixa de entrega (confirmação) | Não prometer entrega errada | 🟡 |

---

# 🔴 PRIORIDADE 1 — Destrava a venda

## 1. Export de produtos do Dmaster

**Por que:** hoje o site **não mostra preço** (27 de 105 produtos têm) e **não sabe
estoque** (0 de 105). Sem isso o cliente não sabe se pode pagar e você pode
vender o que não tem.

**O que pedir** (campo por campo na página `guia-dmaster.html`, pronta para imprimir):
- Código interno e EAN (código de barras)
- Nome, preço de venda, preço de referência
- **Estoque** (quantidade)
- Categoria, fabricante, tarja

**Onde achar:** no Dmaster, *Relatórios → Estoque/Produtos → Exportar*. Sai `.csv`
ou `.xlsx`. Se não achar, **print da tela** serve.

**Formato que aceito:** `.csv`, `.xlsx`, `.txt`, `.json` ou print.

**Trrava:** preço, estoque, "em estoque", catálogo sincronizado com o balcão.

---

## 2. A marca da maquininha

**Por que:** a conta da maquininha **já é uma conta de pagamento**. Não precisa
contratar gateway, não precisa integrar API, não tem mensalidade. Só falta saber
qual é.

**Responda uma palavra:** Cielo · Elo · Getnet · Stone · PagBank · Mercado Pago ·
SafraPay · outra

**Trrava:** todo o caminho de pagamento online.

---

## 3. O link de pagamento

**Por que:** sem ele o cliente só pode pagar no balcão ou por Pix direto com você.

**Como criar:** no app ou painel da maquininha, em **Link de Pagamento**. Você
escolhe um valor ou deixa o cliente informar.

**Depois:** me manda o link e eu coloco na página do pedido.

**Alternativa se a maquininha não tiver:** Pix gerado pelo próprio site (grátis,
sem gateway) — mas aí **você não recebe aviso automático** do pagamento, só vê
no extrato do banco.

---

## 4. Responsável técnico + CRF

**Por que:** é **obrigação legal** de toda farmácia ter farmacêutico
responsável identificado. Sem isso no site, a farmácia parece não ter
farmacêutico.

**O que preciso:** nome do farmacêutico + número do CRF + ANVISA dele (se tiver).

**Trrava:** obrigação legal. Quanto mais tempo o site ficar no ar sem isso, pior.

---

## 5. Registro da farmácia na ANVISA

**Por que:** identificação da farmácia, também obrigatório constar.

**O que preciso:** o número do registro (aparece na placa da loja ou no
documento de licenses sanitário).

**Trrava:** obrigação legal.

---

## 6. Perfil da Empresa no Google — R$ 0

**Por que:** é o que **mais traz cliente de bairro** e não custa nada. Sem isso o
site fica pronto e ninguém descobre que ele existe.

**Como fazer:**
1. Google → **Perfil da Empresa** (ou Google Meu Negócio)
2. Cadastrar com CNPJ: nome, endereço (Rua Julita Nogueira Soares, 610),
   telefone (31) 3476-2473, categoria **Farmácia**
3. Horários: Seg a Sex 8h–20h · Sábado 8h–18h · Domingo e feriado 9h–13h
4. Colar o link do site
5. Pedir avaliação para os primeiros clientes

**Trrava:** o site nao aparece na busca local.

---

# 🟡 PRIORIDADE 2 — Confiança

## 7. Fotos reais dos produtos

**Por que:** hoje **64 de 105 produtos** (61%) usam a caixa genérica da Droga G.
Foto real vende remédio; caixa genérica não.

**Duas formas:**
- **Com o export do Dmaster:** se vier o EAN, eu baixo foto de cada um
  automaticamente (é o mesmo caminho do item 1)
- **Na dúvida:** foto do celular na caixa, no balcão. 105 fotos em uma tarde

**Trrava:** confiança e conversão.

---

## 8. Quais medicamentos do Farmácia Popular vocês têm

**Por que:** o site lista o elenco do programa (Ministério da Saúde), mas o que
vocês **mantêm em estoque** pode ser menos. Prometer o que não tem é pior do que
não prometer.

**O que preciso:** a lista dos que vocês de fato têm, ou confirmar que a lista do
site está boa.

**Já resolvido:** tirei o número "41 itens" do banner exatamente por isso.

---

## 9. Política de troca — confirmar

**O que está no site:** remédio aberto **não** pode ser devolvido; produto aberto
ou usado também não; com defeito ou errado a farmácia troca; ainda lacrado, cancela
sem problema.

**Preciso saber se está certo.** Escrevi com base na prática comum e na lei, mas é
decisão da farmácia.

---

## 10. Área de entrega — confirmar

**O que está no site:** entrega em até 30 min num raio de **4 km**:
Santa Terezinha · Residencial Sarandi · Ressaca · Bandeirantes · Pampulha.

**Preciso saber:** está certo? Quer incluir ou tirar algum bairro?

**Trrava:** o verificador da home e o aviso antes de enviar o pedido.

---

# 🟢 PRIORIDADE 3 — Refinamento (quando der)

| Item | Custo | Quando vale |
|---|---|---|
| Google Analytics (ver quantas pessoas entram) | R$ 0 | Sempre bom, 10 min de cadastro |
| Etiquetas e respostas rápidas no WhatsApp Business | R$ 0 | Assim que tiver volume |
| Catálogo de produtos no WhatsApp Business | R$ 0 | Junto com o export |
| WhatsApp de retomada para cliente antigo | R$ 0 | Junto com o export de clientes |
| Domínio próprio (`drogag.com.br`) | ~R$ 40/ano | Quando quiser sair do `github.io` |
| Entrar no iFood | variável | Quando 4 km limitar o crescimento |
| Conta do cliente com histórico | exige backend | Quando quiser fidelizar |
| Painel do administrador | exige backend | Quando o catálogo passar de 500 itens |

---

# ✅ O que JÁ está pronto (não precisa mais)

- Visual, identidade e design system
- 14 páginas com navegação completa
- Busca e filtro por 6 categorias
- Carrinho, quantidade e envio do pedido no WhatsApp
- Verificador de área de entrega na home
- FAQ com 22 perguntas
- Política de Privacidade (LGPD) + consentimento no formulário
- SEO local: JSON-LD, horários, mapa, robots.txt, sitemap.xml
- Página 404, favicon, catálogo leve (24 por vez)
- Modo construção com código de acesso, para o site não ser visto pela metade

---

# 📋 Checklist para você ir marcando

```
[ ]  1. Export de produtos do Dmaster
[ ]  2. Marca da maquininha (só o nome)
[ ]  3. Link de pagamento criado
[ ]  4. Responsável técnico + CRF
[ ]  5. Registro ANVISA
[ ]  6. Perfil no Google criado
[ ]  7. Fotos reais (ou autorizar via EAN no export)
[ ]  8. Lista do Farmácia Popular que temos
[ ]  9. Política de troca confirmada
[ ] 10. Área de entrega confirmada
```

**Comece pelo 1 e pelo 2.** O 1 resolve preço e estoque; o 2 destrava o pagamento.
Com esses dois, o site passa de vitrine para loja.

---

# 🔐 Sobre o arquivo de clientes (se quiser mandar)

O export de **clientes** (nome, telefone, CPF, bairro, última compra) **não entra
no site**. Serve só para você mandar WhatsApp de retomada — "faz 6 meses que você
não compra, o exame precisa repetir?".

Contém dado pessoal, então: fica fora do site, fora de link público, e a mensagem
precisa ser gentle — não pode virar spam.
