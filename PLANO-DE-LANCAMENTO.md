# Plano até a primeira venda

> Documento mestre. Tudo que falta para o site ir ao ar de verdade.
> Atualizado: out/2026. Confere o que já foi feito e o que falta.

---

## 0. Estado agora

| Parte | Situação |
|---|---|
| Site rodando em `github.io` | Sim, mas **trancado em modo construção** |
| Catálogo com 105 produtos | Pronto |
| Busca e filtros | Pronto |
| Carrinho / lista de pedido | Pronto |
| Envio do pedido no WhatsApp | Pronto |
| Política de Privacidade (LGPD) | Pronto |
| SEO local (JSON-LD, mapa, horários) | Pronto |
| Raio de entrega de 4 km | Pronto |
| Regra de medicamento controlado | Pronto |
| **Preço dos produtos** | **Falta (78 de 105 sem valor)** |
| **Pagamento online** | **Falta** |
| **Perfil no Google** | **Falta** |

---

## 1. Segurança do site enquanto está em teste

O site está num endereço público da internet. Qualquer pessoa com o link
entraria e veria o site pela metade. Isso foi resolvido assim:

### O que já está feito

1. **Tela "Em construção"** — quem chega no site vê só uma tela bonita com o
   telefone e o WhatsApp da farmácia. Não vê o site incompleto.
   - Arquivos: `construcao.js` e `construcao-inject.js`
   - O dono entra expandindo **"Acesso interno"** e digitando o código
   - O código é `drogag`

2. **Google bloqueado** — todas as páginas têm
   `noindex, nofollow, noarchive`. O Google não vai indexar o site enquanto
   estiver em teste. Sem isso, um cliente poderia achar o site pela busca e
   ver a versão pela metade.

### Sobre o código de acesso — ser honesto

Isto **não é segurança de verdade**. O código está em JavaScript, que roda no
navegador de quem visita. Uma pessoa determinada abriria o código-fonte e leria
o código. Ele serve para **evitar que um cliente chegue no site sem querer**
num link compartilhado por engano — que é o risco real hoje.

O repositório no GitHub também é público: quem souber o endereço vê o código e
os dados do catálogo. Para catálogo de farmácia pequena, o risco é baixo (nome
de produto, preço de venda), mas é público.

### Se quiser proteção real (opcional, quase grátis)

| Opção | Custo | O que faz |
|---|---|---|
| **Não compartilhar o link** | R$ 0 |.Resolve 99% dos casos práticos |
| **Perfil do Google** | R$ 0 | Faz o site ser encontrado por quem procura de verdade |
| **Domínio + Cloudflare Access** | ~R$ 40/ano + R$ 0 | Senha real, página inteira protegida. É a solução profissional |

A terceira só vale se o site for receber muito tráfego antes de estar pronto.
**Minha recomendação: não comprar nada agora.** O modo construção + não
compartilhar o link resolve o problema imediato.

### Como abrir o site de verdade (quando publicar)

1. `construcao.js` → mudar `DROGAG_MODO_CONSTRUCAO` para `false`
2. Todas as páginas → apagar as 2 linhas `<meta name="robots" ...>` e o
   comentário que explica
3. Commit + push

---


## 1.2 Como o site vai funcionar (o caminho completo)

Documento visual e imprimível: **`como-funciona.html`** (abre no celular).
Relatório de entrega para a farmácia: **`relatorio.html`**.
Guia do que exportar do Dmaster: **`guia-dmaster.html`**.

### O passo a passo da venda

| # | Etapa | Situação |
|---|---|---|
| 1 | Cliente acha a farmácia | ✅ pronto |
| 2 | Vê produtos, categorias e busca | ✅ pronto |
| 3 | **Vê preço e estoque** | ❌ falta export do Dmaster |
| 4 | Adiciona na lista | ✅ pronto |
| 5 | Vê se entregam no bairro dele | ✅ pronto (16 bairros) |
| 6 | Escolhe retirada ou entrega | ✅ pronto |
| 7 | Preenche dados e aceita a política | ✅ pronto |
| 8 | **Você confirma e manda o link de pagamento** | ❌ falta o link |
| 9 | Cliente paga e você entrega | ✅ pronto |

**Faltam 2 peças, e nenhuma é o site:** o export do Dmaster (dá preço e estoque)
e o link de pagamento da maquininha. Uma é dado, a outra é cadastro.

### Comparado com uma rede grande

| Etapa | Rede grande | Droga G |
|---|---|---|
| Preço e estoque | Automático | Você confirma no balcão |
| Pagamento | Automático | Você manda o link |
| Pedido na loja | Cai sozinho no sistema | Chega no WhatsApp, organizado |
| Cliente paga sem ter o produto | **Pode acontecer** | **Não acontece** |

Na operação de uma farmácia de bairro, essa última linha é **vantagem**: a rede
grande precisa automatizar e às vezes aceita pedido de remédio que depois não tem.
Aqui tem uma pessoa conferindo o estoque antes de cobrar.

## 1.5 O que ainda falta, em uma lista só

Atualizado out/2026. Ordem pensada pelo que mais trava a venda.

### 🔴 Trava a venda (precisa de você)

| # | O quê | Onde está | Quem resolve |
|---|---|---|---|
| 1 | **Export do Dmaster** | preço 27/105, estoque 0/105 | Você — roteiro em `COMO-PEDIR-DMASTER.md` |
| 2 | **Link de pagamento da maquininha** | não existe | Você (falta saber a marca) |
| 3 | **Perfil no Google** | não existe | Você — 15 min, grátis |
| 4 | **Responsável técnico + CRF** | não existe no site | Você (obrigação legal) |
| 5 | **Registro ANVISA** | não existe no site | Você |
| 6 | **Foto real dos produtos** | 41 de 105 | Junto com o item 1 (via EAN) ou foto no balcão |
| 7 | **Nome da maquininha** | — | Você |

### 🟡 Importante, mas dá para depois

| # | O quê | Situação |
|---|---|---|
| 8 | Testar o pedido ponta a ponta no celular | precisa do seu olho |
| 9 | WhatsApp Business: etiquetas e respostas rápidas | de graça no app |
| 10 | Catálogo de produtos no WhatsApp Business | de graça no app |
| 11 | Google Analytics (ver quantas pessoas entram) | grátis, 10 min de cadastro |
| 12 | WhatsApp de retomada para cliente antigo | usa o export de clientes |

### 🟢 Opcional (só quando fizer sentido)

| # | O quê | Quando |
|---|---|---|
| 13 | Conta do cliente com histórico | Quando quiser fidelizar |
| 14 | Carrinho abandonado | Quando tiver tráfego |
| 15 | Domínio próprio (`drogag.com.br`) | Quando quiser independente |
| 16 | Entrar no iFood | Quando a entrega de 4 km limitar |
| 17 | Painel do administrador | Quando o catálogo tiver 500+ itens |

### Já resolvido (não precisa mais)

- Design e identidade visual
- Estrutura das 14 páginas e navegação
- Busca e filtro por categoria
- Carrinho e envio do pedido no WhatsApp
- Política de Privacidade (LGPD)
- FAQ e verificação de área de entrega
- Regra de medicamento controlado
- SEO local (JSON-LD, horários, mapa)
- robots.txt, sitemap.xml, favicon, página 404
- Carregamento leve (24 produtos por vez)
- Voltar ao topo ao abrir a página
- Modo construção com código de acesso

---

## 2. Falta: os preços

**O maior bloqueio.** Sem preço:
- o site não mostra quanto vai custar
- o cliente não sabe se pode pagar
- não dá para calcular total
- não dá para cobrar online

Hoje só **27 dos 105 produtos** têm preço no `produtos-data.js`.

### Como resolver

O caminho certo é exportar do sistema da farmácia (Dmaster). O roteiro
completo do que pedir está em `COMO-PEDIR-DMASTER.md`:

1. Pedir o export de produtos com código, nome, preço e quantidade
2. Gerar o `produtos-data.js` com tudo preenchido
3. Ligar a exibição de preço no site

Sem o export, dá para cadastrar preço na mão — mas com 105 produtos é trabalhoso
e o preço vai envelhecer rápido.

### Decisão pendente

Mostrar preço **ou não**? Recomendo mostrar: farmácia que não mostra preço
manda o cliente procurar em outro lugar.

---

## 3. Falta: pagamento

O site recebe o pedido no WhatsApp. O pagamento é combinado no balcão.

### Caminho escolhido

Usar o **link de pagamento da maquininha que a farmácia já tem**. Não é API,
não é mensalidade. Falta só descobrir a marca e pegar o link.

### O que fazer

1. Descobrir a marca da maquininha (Cielo, Elo, Getnet, Stone, PagBank,
   Mercado Pago, SafraPay)
2. Criar o link de pagamento na conta
3. Colocar o link na página do pedido, como opção de pagamento

### Sobre venda de controlado pela internet

Os 4 medicamentos controlados **não** podem ser vendidos online. O site já
trata isso: bloqueia a entrega e manda para retirada na loja. Manter assim.

---

## 4. Falta: perfil no Google (o que mais traz cliente)

O site fica pronto, mas **sem perfil no Google a farmácia não aparece na
busca**. É o passo com melhor retorno e custa zero.

Como fazer:
1. Google → **Perfil da Empresa** (grátis, com cartão CNPJ)
2. Cadastrar: nome, endereço, telefone, horário, categoria "Farmácia"
3. Colar o link do site
4. Pedir avaliação para os primeiros clientes

O JSON-LD que já está no site ajuda o Google a entender que é uma farmácia.

---

## 5. Checklist de publicação

- [ ] Preços preenchidos (ou decisão de não mostrar)
- [ ] Link de pagamento criado e testado
- [ ] Testar pedido de ponta a ponta pelo celular
      (adicionar → lista → dados → WhatsApp → mensagem correta)
- [ ] Testar com item controlado (entrega deve travar)
- [ ] Testar bairro fora do raio de 4 km (deve avisar)
- [ ] Criar perfil no Google
- [ ] `construcao.js` → `false`
- [ ] Remover `noindex` das páginas
- [ ] Avisar no Instagram que o site está no ar
- [ ] Avisar no WhatsApp Business

---

## 6. Depois da primeira venda

Backlog completo em `REGRAS-E-SCRIPTS.md`, seção "Backlog". Resumo:

- Catálogo automático a partir do estoque do Dmaster (prioridade)
- Painel do administrador (sem mexer em arquivo de texto)
- Hospedagem com domínio próprio
- iFood (resolve a limite de entrega)
- Catálogo de produtos no WhatsApp Business

---

## 7. Regras que não se quebram

Ver `REGRAS-E-SCRIPTS.md` para o detalhe completo. Resumo do que é obrigatório:

- **Medicamento controlado (tarja preta) não é vendido pela internet.**
  No site: entrega bloqueada, aviso de retirada com receita.
- **Entrega só num raio de 4 km** da loja. Bairros: Santa Terezinha,
  Residencial Sarandi, Ressaca, Bandeirantes, Pampulha.
- **Site é de loja única**: Santa Terezinha. Não citar Jardim Alvorada
  nem São Geraldo.
- **Preço**: nunca inventar. Preenchido só pelo export do Dmaster.
