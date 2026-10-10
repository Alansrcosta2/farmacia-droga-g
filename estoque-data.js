// Estoque real Droga G Santa Terezinha — CSV recebido 10/10/2026
// Classificação ANVISA:
//   tarja_livre       = venda livre
//   tarja_vermelha    = venda com receita (pode listar online, aviso obrigatório)
//   tarja_vermelha_c1 = controle especial (retém 2ª via da receita, pode listar com aviso)
//   tarja_preta       = NÃO pode vender online (Lei 11.343/2006), SÓ NA LOJA
window.DROGAG_ESTOQUE = [
  // === TARJA VERMELHA / VENDA LIVRE (podem ir pro catálogo online) ===
  { codigo: 29354, nome: "PARACETAMOL 500MG 20 COMP", fabricante: "PRATI DONADUZZI", preco: 4.47, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/banco/medicamentos/analg-sico-e-antit-rmico-paracetamol-750mg-gen-rico-prati-do.webp" },
  { codigo: 29326, nome: "PARACETAMOL 750MG 20 COMP REV", fabricante: "PRATI DONADUZZI", preco: 2.29, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/banco/medicamentos/analg-sico-e-antit-rmico-paracetamol-750mg-gen-rico-prati-do.webp" },
  { codigo: 2044, nome: "AZITROMICINA 500MG 5 COMP", fabricante: "TEUTO", preco: 6.08, estoque: 4, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/banco/genericos/zirk-azitromicina-500mg-5-comprimidos.webp" },
  { codigo: 688674, nome: "CLORIDRATO DE DOXICICLINA 100MG COM REV", fabricante: "PHARLAB", preco: 9.98, estoque: 11, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 7673, nome: "AAS 100MG CX 30 COMP", fabricante: "COSMED", preco: 21.72, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 4094, nome: "AAS PROTECT 100MG C 30 COMP", fabricante: "MANTECORP/FARMASA", preco: 17.94, estoque: 4, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 86760, nome: "ABC 10MG/ML SOL SPRAY FR 30ML", fabricante: "HERTZ", preco: 19.38, estoque: 12, categoria: "medicamentos", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 98130, nome: "ABLOK 25MG 30CPR", fabricante: "BIOLAB SAN", preco: 2.88, estoque: 23, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 672, nome: "SULF+TRIM 200/40MG SUSP TEUTO", fabricante: "TEUTO", preco: 5.14, estoque: 26, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },
  { codigo: 95084, nome: "SULFAMETOXAZOL+TRIMETOPRIMA 40+8MG/ML C/100ML", fabricante: "VITAMEDIC", preco: 5.31, estoque: 11, categoria: "controlados", tarja: "tarja_vermelha", imagem: "img/caixa-drogag.webp" },

  // === CONTROLADOS C1 (pode listar online com aviso de receita especial) ===
  { codigo: 29779, nome: "TRAZODONA 100MG 30 COMP", fabricante: "MEDQUIMICA", preco: 14.85, estoque: 12, categoria: "controlados", tarja: "tarja_vermelha_c1", imagem: "img/caixa-drogag.webp" },
  { codigo: 8889, nome: "FLUOXETINA 20MG 30 CPS", fabricante: "GERMED", preco: 5.78, estoque: 26, categoria: "controlados", tarja: "tarja_vermelha_c1", imagem: "img/banco/genericos/fluoxetina-20mg-gen-rico-germed-30-comprimidos-revestidos.webp" },
  { codigo: 77938, nome: "FLUOXETINA 20MG CPR", fabricante: "LEGRAND", preco: 4.96, estoque: 26, categoria: "controlados", tarja: "tarja_vermelha_c1", imagem: "img/banco/genericos/fluxene-cloridrato-de-fluoxetina-20mg-28-c-psulas.webp" },

  // === TARJA PRETA — NÃO VENDER ONLINE (só na loja, com receita) ===
  { codigo: 6451, nome: "BROMAZEPAM 6MG 30CPR", fabricante: "NEO QUIMICA", preco: 7.59, estoque: 5, categoria: "controlados", tarja: "tarja_preta", vender_online: false, imagem: "img/caixa-drogag.webp" },
  { codigo: 58096, nome: "LORAZEPAM 2MG 20CPR", fabricante: "DIVERSOS", preco: 3.40, estoque: 4, categoria: "controlados", tarja: "tarja_preta", vender_online: false, imagem: "img/caixa-drogag.webp" },
  { codigo: 514, nome: "TRAMADOL 50MG 10CPR", fabricante: "EMIS MINAS", preco: 3.55, estoque: 26, categoria: "controlados", tarja: "tarja_preta", vender_online: false, imagem: "img/caixa-drogag.webp" },

  // === HIGIENE / ABSORVENTES / COSMÉTICOS (venda livre) ===
  { codigo: 7595, nome: "COLOR MAXTON CR 050G", fabricante: "EMBELLEZE", preco: 10.96, estoque: 18, categoria: "dermocosmeticos", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 56374, nome: "A SAUDE DA MULHER SUSP 150ML", fabricante: "EMS", preco: 15.00, estoque: 12, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 111, nome: "ABS ANTIBAC ULTRA FINO C/AB INT", fabricante: "INTIMUS", preco: 17.83, estoque: 16, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 56815, nome: "ABS DRY GERIAT 20-UN", fabricante: "MASTERSOFT", preco: 14.73, estoque: 6, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 17978, nome: "ABS FLEEN 03UN SUAVE ABAS", fabricante: "MAXI CONFORT", preco: 2.27, estoque: 20, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 3117, nome: "ABS INTERNO OB PROCOMFORT MED 8UN", fabricante: "SEMPRE LIVRE", preco: 10.24, estoque: 22, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 9744, nome: "ABS INTIMUS 14UN SUAVE COM ABAS", fabricante: "INTIMUS", preco: 9.80, estoque: 14, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 6, nome: "ABS INTIMUS INTERNO MEDIO 8UN", fabricante: "INTIMUS", preco: 9.03, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 47, nome: "ABS INTIMUS INTERNO MINI 8UN", fabricante: "INTIMUS", preco: 9.18, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 1707, nome: "ABS INTIMUS INTERNO SUPER 8UN", fabricante: "INTIMUS", preco: 9.18, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 22654, nome: "ABS INTIMUS NOT 16UN SUAVE COM ABAS", fabricante: "INTIMUS", preco: 14.09, estoque: 2, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 1241, nome: "ABS INTIMUS NOTURNO SUAVE", fabricante: "INTIMUS", preco: 7.97, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 22638, nome: "ABS INTIMUS NOTURNO SUAVE C/AB", fabricante: "INTIMUS", preco: 22.33, estoque: 11, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" },
  { codigo: 1245, nome: "ABS INTIMUS T.P SUAVE C/ABAS 8UN", fabricante: "KIMBERLY-C", preco: 4.28, estoque: 3, categoria: "higiene", tarja: "tarja_livre", imagem: "img/caixa-drogag.webp" }
];
