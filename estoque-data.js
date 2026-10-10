// Estoque real Droga G Santa Terezinha — CSV recebido 10/10/2026
// Campos do CSV original = PREÇO DE COMPRA (custo). Margem ~60% aplicada para PREÇO DE VENDA.
// Classificação ANVISA:
//   tarja_livre       = venda livre
//   tarja_vermelha    = venda com receita (pode listar online, aviso obrigatório)
//   tarja_vermelha_c1 = controle especial (retém 2ª via da receita, pode listar com aviso)
//   tarja_preta       = NÃO pode vender online (Lei 11.343/2006), SÓ NA LOJA
window.DROGAG_ESTOQUE = [
  // === TARJA VERMELHA / VENDA LIVRE (podem ir pro catálogo online) ===
  { codigo: 29354, nome: "PARACETAMOL 500MG 20 COMP", fabricante: "PRATI DONADUZZI", preco_custo: 4.47, preco: 8.90, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 29326, nome: "PARACETAMOL 750MG 20 COMP REV", fabricante: "PRATI DONADUZZI", preco_custo: 2.29, preco: 5.50, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 2044, nome: "AZITROMICINA 500MG 5 COMP", fabricante: "TEUTO", preco_custo: 6.08, preco: 14.90, estoque: 4, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 688674, nome: "CLORIDRATO DE DOXICICLINA 100MG COM REV", fabricante: "PHARLAB", preco_custo: 9.98, preco: 22.90, estoque: 11, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 7673, nome: "AAS 100MG CX 30 COMP", fabricante: "COSMED", preco_custo: 21.72, preco: 38.90, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 4094, nome: "AAS PROTECT 100MG C 30 COMP", fabricante: "MANTECORP/FARMASA", preco_custo: 17.94, preco: 32.90, estoque: 4, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 86760, nome: "ABC 10MG/ML SOL SPRAY FR 30ML", fabricante: "HERTZ", preco_custo: 19.38, preco: 34.90, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 98130, nome: "ABLOK 25MG 30CPR", fabricante: "BIOLAB SAN", preco_custo: 2.88, preco: 7.90, estoque: 23, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 672, nome: "SULF+TRIM 200/40MG SUSP TEUTO", fabricante: "TEUTO", preco_custo: 5.14, preco: 11.90, estoque: 26, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 95084, nome: "SULFAMETOXAZOL+TRIMETOPRIMA 40+8MG/ML C/100ML", fabricante: "VITAMEDIC", preco_custo: 5.31, preco: 12.50, estoque: 11, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },

  // === CONTROLADOS C1 (pode listar online com aviso de receita especial) ===
  { codigo: 29779, nome: "TRAZODONA 100MG 30 COMP", fabricante: "MEDQUIMICA", preco_custo: 14.85, preco: 26.90, estoque: 12, categoria: "controlados", tarja: "tarja_vermelha_c1", imagem: "img/caixa-drogag.webp" },
  { codigo: 8889, nome: "FLUOXETINA 20MG 30 CPS", fabricante: "GERMED", preco_custo: 5.78, preco: 12.90, estoque: 26, categoria: "controlados", tarja: "tarja_vermelha_c1", imagem: "img/caixa-drogag.webp" },
  { codigo: 77938, nome: "FLUOXETINA 20MG CPR", fabricante: "LEGRAND", preco_custo: 4.96, preco: 11.50, estoque: 26, categoria: "controlados", tarja: "tarja_vermelha_c1", imagem: "img/caixa-drogag.webp" },

  // === TARJA PRETA — NÃO VENDER ONLINE (só na loja, com receita) ===
  { codigo: 6451, nome: "BROMAZEPAM 6MG 30CPR", fabricante: "NEO QUIMICA", preco_custo: 7.59, preco: 14.90, estoque: 5, categoria: "controlados", tarja: "tarja_preta", vender_online: false, imagem: "img/caixa-drogag.webp" },
  { codigo: 58096, nome: "LORAZEPAM 2MG 20CPR", fabricante: "DIVERSOS", preco_custo: 3.40, preco: 7.50, estoque: 4, categoria: "controlados", tarja: "tarja_preta", vender_online: false, imagem: "img/caixa-drogag.webp" },
  { codigo: 514, nome: "TRAMADOL 50MG 10CPR", fabricante: "EMIS MINAS", preco_custo: 3.55, preco: 8.50, estoque: 26, categoria: "controlados", tarja: "tarja_preta", vender_online: false, imagem: "img/caixa-drogag.webp" },

  // === HIGIENE / ABSORVENTES / COSMÉTICOS (venda livre) ===
  { codigo: 7595, nome: "COLOR MAXTON CR 050G", fabricante: "EMBELLEZE", preco_custo: 10.96, preco: 19.90, estoque: 18, categoria: "dermocosmeticos", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 56374, nome: "A SAUDE DA MULHER SUSP 150ML", fabricante: "EMS", preco_custo: 15.00, preco: 26.90, estoque: 12, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 111, nome: "ABS ANTIBAC ULTRA FINO C/AB INT", fabricante: "INTIMUS", preco_custo: 17.83, preco: 29.90, estoque: 16, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 56815, nome: "ABS DRY GERIAT 20-UN", fabricante: "MASTERSOFT", preco_custo: 14.73, preco: 24.90, estoque: 6, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 17978, nome: "ABS FLEEN 03UN SUAVE ABAS", fabricante: "MAXI CONFORT", preco_custo: 2.27, preco: 5.50, estoque: 20, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 3117, nome: "ABS INTERNO OB PROCOMFORT MED 8UN", fabricante: "SEMPRE LIVRE", preco_custo: 10.24, preco: 17.90, estoque: 22, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 9744, nome: "ABS INTIMUS 14UN SUAVE COM ABAS", fabricante: "INTIMUS", preco_custo: 9.80, preco: 16.90, estoque: 14, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 6, nome: "ABS INTIMUS INTERNO MEDIO 8UN", fabricante: "INTIMUS", preco_custo: 9.03, preco: 15.90, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 47, nome: "ABS INTIMUS INTERNO MINI 8UN", fabricante: "INTIMUS", preco_custo: 9.18, preco: 15.90, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 1707, nome: "ABS INTIMUS INTERNO SUPER 8UN", fabricante: "INTIMUS", preco_custo: 9.18, preco: 15.90, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 22654, nome: "ABS INTIMUS NOT 16UN SUAVE COM ABAS", fabricante: "INTIMUS", preco_custo: 14.09, preco: 23.90, estoque: 2, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 1241, nome: "ABS INTIMUS NOTURNO SUAVE", fabricante: "INTIMUS", preco_custo: 7.97, preco: 13.90, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 22638, nome: "ABS INTIMUS NOTURNO SUAVE C/AB", fabricante: "INTIMUS", preco_custo: 22.33, preco: 36.90, estoque: 11, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 1245, nome: "ABS INTIMUS T.P SUAVE C/ABAS 8UN", fabricante: "KIMBERLY-C", preco_custo: 4.28, preco: 8.90, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" }
];
