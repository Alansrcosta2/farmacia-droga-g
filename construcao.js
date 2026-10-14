/* ============================================================
   MODO CONSTRUCAO — Droga G
   ------------------------------------------------------------
   Enquanto este arquivo existir com MODO_CONSTRUCAO = true,
   o site mostra uma tela de "em construção" para qualquer visitante.

   Para publicar de verdade:
     1. abra este arquivo
     2. mude MODO_CONSTRUCAO para false
     3. salve e faça o push

   O codigo de acesso e o mesmo em todo lugar (sessionStorage,
   entao ele pede uma vez por aba).

   ATENCAO: isto nao e seguranca real. E javascript no navegador do
   visitante: qualquer pessoa determinada ve o codigo no codigo-fonte.
   O que isso resolve e EVITAR QUE UM CLIENTE CHEGUE NO SITE PELA
   METADE. Para protecao de verdade, ver PLANO-DE-LANCAMENTO.md.
   ============================================================ */

window.DROGAG_MODO_CONSTRUCAO = true;
window.DROGAG_CODIGO = 'drogag';
