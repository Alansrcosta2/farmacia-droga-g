# AUDITORIA — Farmácia Droga G (11/10/2026)

## 📞 TELEFONES OFICIAIS (usar no JSON-LD SEO local)
| Loja | Telefone | Endereço |
|------|----------|----------|
| Jardim Alvorada | (31) 98378-5075 | R. Flor D'Água, 608 |
| São Geraldo | (31) 3487-1209 | R. Silva Alvarenga, 607 |
| Santa Terezinha | (31) 3476-2473 | Rua Julita Nogueira Soares, 610 |
| WhatsApp (todas) | (31) 97171-6274 | wa.me/5531971716274 |

⚠️ Dúvida: contato.html linha 179 mostra Santa Terezinha como (31) 9 7171-6274 — confirmar se é WhatsApp ou telefone da loja.

## ✅ CORRIGIDO (11/10)
| Item | Status |
|------|--------|
| Barra "← Início" mobile | Removida (não aprovada) |
| Logo duplicado no desktop | nav-bar-header/ícones ocultos fora do mobile |
| Benefícios duplicados (clone JS) | Removido — scroll horizontal |
| Carrinho com total em R$ | Removido — "Consulte pelo WhatsApp" |
| Categorias mobile classe errada | .categoria-round-name → .categoria-round-label |
| Header mobile estilo app | 2 linhas: menu+logo+ícones / busca |
| Tab bar inferior | Início/Buscar/Categorias/Carrinho/Conta |
| Bottom sheet Categorias | Modal com foco preso (a11y) |
| Badge "0" | Some quando zerado |
| Header canônico | 10 páginas: 1 close, 1 menu-btn, 1 search, 3 icons, 1 overlay |
| Links internos | Nenhum quebrado |

## ✅ CORRIGIDO (10/10)
| Item | Status |
|------|--------|
| Preços escondidos nos cards | Removido — mostra "Consulte pelo WhatsApp" |
| Filtro categorias (produtos) | Corrigido — querySelector dinâmico |
| Benefícios duplicados (fixos embaixo) | Removidos |
| Menu "Serviços" duplicado | 1x em todas as páginas |
| Newsletter email | "EM BREVE" |
| Absorventes Farmácia Popular | Dignidade Menstrual |
| Cores badges | CONTROLADO #dc2626, COM RECEITA #ea580c |
| Sintaxe JS | OK |

## ⏳ PENDENTE
| Item | Prioridade |
|------|-----------|
| 52 imagens do banco (logo outra farmácia?) | Alta |
| Prints de revisão (home mobile, produtos, contato, home desktop) | Alta |
| Confirmar telefone oficial Santa Terezinha | Alta |
| Schema JSON-LD SEO local (3 lojas) | Média (quando ele pedir) |

## 📱 MOBILE (atual)
- Tab bar fixa + bottom sheet categorias
- Header 2 linhas, busca full-width 16px
- Cards 2 col, touch 44px
- Benefícios: scroll horizontal (sem clone)
- Filtros produtos: chips scrolláveis
