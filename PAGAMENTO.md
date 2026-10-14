# Pagamento online — como resolver sem API

> Ideia guardada em out/2026. **Nada foi implementado ainda.**
> Status: aguardando o dono decidir.

## O problema

O site não tem carrinho que funcione e não tem preço na tela. Todos os botões
vão direto pro WhatsApp. Para o site "pagar como um site com API", o preço
precisa aparecer — sem preço não existe total, e sem total não existe cobrança
automática.

## A pista que resolveu quase tudo

**A farmácia já tem maquininha de pagamento.** A conta da maquininha já é uma
conta de pagamento: os principais fornecedores liberam link de pagamento e
venda online no mesmo app, sem adesão e sem mensalidade. Ou seja, provavelmente
**não é preciso contratar gateway nenhum**.

### Próximo passo

Descobrir a marca da maquininha. De pendente:

| Maquininha | O que verificar |
|---|---|
| Cielo | Link de pagamento / Cielo Pagar Online na conta |
| Elo | Link de pagamento na conta Elo |
| Getnet / Sanitas | Getnet Pay / link de pagamento |
| Stone | Link de pagamento Stone |
| PagBank / PagSeguro | Link de pagamento (conta da maquininha já serve) |
| Mercado Pago (Point) | Seu link |
| SafraPay | Link de pagamento |

Só com a marca dá para montar a solução exata: se o link vem de graça, se tem
taxa, e como ele entra no site sem API.

## Alternativas (caso a maquininha não resolva)

### A) PIX gerado pelo próprio site — custo zero

O site soma o carrinho e monta o QR Code / código "copia e cola" na hora, com o
valor exato. Não é API, não é gateway, não tem mensalidade, roda inteiro no
navegador. O código BR Code e o CRC16 são calculados no cliente.

- Prós: de graça, total exato, funciona no Pix de qualquer banco
- Contras: **sem confirmação automática** — é preciso conferir o extrato do banco

### B) Link de pagamento (Mercado Pago, PagBank, PagSeguro)

Um link com a marca da loja, colado num botão "Pagar". O cliente paga na página
do provedor, por Pix, cartão ou boleto. Não exige programar.

- Prós: mais seguro, confirmação automática, dinheiro cai na conta
- Contras: taxa por venda (Pix ~0,99%, cartão ~4%) e o cliente **digita o valor**
  — a página não sabe o que está no carrinho

### C) Plataforma pronta (Nuvemshop, Shopify)

Loja completa com checkout, estoque e pagamento. O site atual vira vitrine.

- Prós: é uma loja de verdade, resolve tudo
- Contras: mensalidade + taxa, e duplica o catálogo

## Recomendação

1. Checar a maquininha primeiro (provavelmente resolve sem custo)
2. Se não resolver: **A** se cada centavo de taxa importa, **B** se quer o mais
   seguro e rápido

## Antes de colocar no ar

Venda online de medicamento controlado tem regra da ANVISA e exige licença
digital da farmácia. Confirmar com o responsável técnico antes de publicar
qualquer forma de compra online de controlado.
