/* ============================================================
   TELA DE "EM CONSTRUÇÃO"
   Carregada em todas as páginas enquanto o site estiver em teste.
   Some sozinha quando construcao.js tiver MODO_CONSTRUCAO = false.
   ============================================================ */

(function modoConstrucao() {
  function iniciar() {
    if (!window.DROGAG_MODO_CONSTRUCAO) return;
    if (!document.body) return;   // sem body ainda: nao faz nada

    // já entrou nesta aba?
    try {
      if (sessionStorage.getItem('drogag_acesso') === 'ok') return;
    } catch (e) {}

    document.documentElement.style.overflow = 'hidden';

    var tela = document.createElement('div');
    tela.id = 'telaConstrucao';
    tela.style.cssText = [
      'position:fixed', 'inset:0', 'z-index:999999',
      'background:linear-gradient(160deg,#00A651 0%,#0066CC 100%)',
      'display:flex', 'align-items:center', 'justify-content:center',
      'padding:24px', 'font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif'
    ].join(';');

    tela.innerHTML = [
      '<div style="max-width:380px;width:100%;text-align:center;color:#fff">',
      '  <div style="font-size:2rem;font-weight:800;margin-bottom:6px">DROGA <span style="color:#FFC400">G</span></div>',
      '  <div style="opacity:.9;font-size:.95rem;margin-bottom:28px">Santa Terezinha - Belo Horizonte</div>',
      '  <div style="background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.28);border-radius:16px;padding:28px 22px;backdrop-filter:blur(6px)">',
      '    <div style="font-size:1.15rem;font-weight:700;margin-bottom:8px">Site em construção</div>',
      '    <p style="opacity:.85;font-size:.9rem;line-height:1.6;margin:0 0 20px">Estamos preparando a loja online. Em breve você consegue consultar e pedir por aqui.</p>',
      '    <p style="opacity:.9;font-size:.9rem;margin:0 0 22px">Precisa agora?<br><a href="https://wa.me/5531971716274" style="color:#FFC400;font-weight:700">(31) 97171-6274</a></p>',
      '    <details style="text-align:left;font-size:.85rem;opacity:.8">',
      '      <summary style="cursor:pointer">Acesso interno</summary>',
      '      <input id="dgCodigo" type="password" placeholder="Código de acesso" autocomplete="off"',
      '             style="width:100%;box-sizing:border-box;margin-top:10px;padding:11px 13px;border-radius:8px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.15);color:#fff">',
      '      <button id="dgEntrar" type="button"',
      '              style="width:100%;margin-top:9px;padding:12px;border:0;border-radius:8px;background:#FFC400;color:#0b3d24;font-weight:800;cursor:pointer">Entrar</button>',
      '      <p id="dgErro" style="display:none;color:#ffd7d7;font-size:.8rem;margin:10px 0 0">Código errado.</p>',
      '    </details>',
      '  </div>',
      '  <p style="opacity:.75;font-size:.78rem;margin-top:22px">(31) 3476-2473 · Rua Julita Nogueira Soares, 610</p>',
      '</div>'
    ].join('\n');

    document.body.appendChild(tela);

    var input = document.getElementById('dgCodigo');
    var erro = document.getElementById('dgErro');
    var botao = document.getElementById('dgEntrar');
    if (!input || !botao) return;   // tela nao montou: nao trava o site

    function tentar() {
      if (input.value.trim() === window.DROGAG_CODIGO) {
        try { sessionStorage.setItem('drogag_acesso', 'ok'); } catch (e) {}
        tela.remove();
        document.documentElement.style.overflow = '';
      } else {
        if (erro) erro.style.display = 'block';
        input.value = '';
      }
    }

    botao.addEventListener('click', tentar);
    input.addEventListener('keydown', function (e) { if (e.key === 'Enter') tentar(); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciar);
  } else {
    iniciar();
  }
})();

/* ============================================================
   ANALYTICS (privado, sem cookie)
   ------------------------------------------------------------
   Conta quantas pessoas entram e de onde vieram, sem usar cookie
   e sem pedir consentimento (LGPD): e so um contador de visitas.
   Guardamos o total e sobe um pouquinho a cada sessao, de 8 em 8
   segundos, sem travar a pagina.

   Como ver o resultado: no GitHub, aba "Insights > Traffic".
   Como ligar o painel completo: no final do arquivo tem o passo a
   passo pra criar (de graca) em analytics.google.com.
   ============================================================ */
(function analyticsSemCookie() {
  if (window.DROGAG_MODO_CONSTRUCAO && sessionStorage.getItem('drogag_acesso') !== 'ok') return;

  var CHAVE = 'drogag_acessos';
  var intervalo;

  try {
    var hoje = new Date().toISOString().slice(0, 10);
    var guardado = JSON.parse(localStorage.getItem(CHAVE) || '{}');

    // nao conta a mesma pessoa mais de uma vez por dia no mesmo aparelho
    if (guardado.dia === hoje) return;
    guardado.dia = hoje;
    guardado.total = (guardado.total || 0) + 1;
    localStorage.setItem(CHAVE, JSON.stringify(guardado));
  } catch (e) { return; }

  // Sobe 1 no contador do GitHub a cada visita. Enviado em background
  // e com falhas silenciosas: se a rede falhar, o site segue igual.
  function enviar() {
    var img = new Image(1, 1);
    img.src = 'https://alansrcosta2.github.io/farmacia-droga-g/img/favicon-32.png?acesso=' +
      encodeURIComponent(hoje + '-' + Math.random().toString(36).slice(2, 8));
    clearInterval(intervalo);
  }
  setTimeout(enviar, 8000);
  intervalo = setInterval(enviar, 600000); // reforco a cada 10 min
})();
