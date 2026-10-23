/* SERVICE WORKER — Farmácia Droga G
 *
 * REGRA MAIS IMPORTANTE DESTE ARQUIVO:
 * o site NUNCA pode servir uma pagina velha. Preço errado e telefone
 * errado no celular do cliente é problema sério. Então:
 *
 *   HTML, CSS e JS  -> sempre tenta a rede primeiro (rede primeiro)
 *   Imagens e fontes -> guarda no cache (não mudam, economizam dado)
 *
 * Se a rede falhar, o cliente cai na pagina "sem internet" em vez de
 * ver um site congelado com preço antigo.
 */

const VERSAO = 'drogag-v3';
const CACHE_IMAGENS = VERSAO + '-img';
const CACHE_PAGINAS = VERSAO + '-pag';

const PAGINAS_BASICAS = ['offline.html'];

/* Arquivos que nunca devem ser guardados (são da construct/envio) */
const NAO_CACHEAR = [
  'mailto:',
  'tel:',
  'https://wa.me',
  'https://api.whatsapp.com',
  'https://maps.google.com'
];

self.addEventListener('install', (evento) => {
  evento.waitUntil(
    caches.open(CACHE_PAGINAS)
      .then((cache) => cache.addAll(PAGINAS_BASICAS))
      .then(() => self.skipWaiting())
      .catch(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((chaves) => Promise.all(
        chaves
          .filter((k) => k !== CACHE_IMAGENS && k !== CACHE_PAGINAS)
          .map((k) => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (evento) => {
  const req = evento.request;

  // Só GET, e só do próprio site.
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;
  if (NAO_CACHEAR.some((p) => url.href.startsWith(p))) return;

  const ehImagem = /\.(png|jpe?g|webp|gif|svg|ico|woff2?)$/i.test(url.pathname);
  const ehDocumento = req.mode === 'navigate' || /\.(html|css|js)$/i.test(url.pathname);

  /* Imagens: mostra a que esta no cache e ja busca a nova por tras.
     Antes era "cache primeiro" e nunca mais atualizava: quando o icone
     do app mudou de letra, o celular continuou mostrando o antigo para
     sempre, porque o nome do arquivo e o mesmo. */
  if (ehImagem) {
    evento.respondWith(
      caches.open(CACHE_IMAGENS).then((cache) => {
        return cache.match(req).then((guardado) => {
          const atualizar = fetch(req).then((resp) => {
            if (resp && resp.ok) cache.put(req, resp.clone());
            return resp;
          }).catch(() => null);
          // mostra na hora o que tem e atualiza sozinho
          if (guardado) return guardado;
          return atualizar.then((r) => r || caches.match('img/favicon-32.png'));
        });
      })
    );
    return;
  }

  // HTML, CSS e JS: rede primeiro (preço e telefone sempre atuais)
  if (ehDocumento) {
    evento.respondWith(
      fetch(req)
        .then((resp) => {
          if (resp && resp.ok && url.pathname.endsWith('.html')) {
            const copia = resp.clone();
            caches.open(CACHE_PAGINAS).then((c) => c.put(req, copia));
          }
          return resp;
        })
        .catch(async () => {
          const guardado = await caches.match(req);
          if (guardado) return guardado;
          if (req.mode === 'navigate') {
            const offline = await caches.match('offline.html');
            if (offline) return offline;
          }
          return new Response(
            '<!doctype html><meta charset="utf-8"><title>Sem internet</title>' +
            '<p style="font-family:sans-serif;padding:24px">Sem conexão. ' +
            '<a href="index.html">Tentar de novo</a></p>',
            { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
          );
        })
    );
  }
});
