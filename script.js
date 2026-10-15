const createToastContainer = () => {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return document.querySelector('.toast-container');
};

const showToast = (message, type = 'success', action = null) => {
  const container = createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle' : 'info-circle';
  // 'action' = { texto, href }: cria um botao dentro do aviso.
  // Sem isso, o cliente adicionava o produto e ficava sem caminho para o carrinho.
  toast.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>` +
    (action ? `<a class="toast-acao" href="${action.href}">${action.texto}</a>` : '');
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideDownFade 0.4s ease-in forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, action ? 6000 : 3000);
};


const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navBar = document.querySelector('.nav-bar');
const menuOverlay = document.querySelector('.menu-overlay');
const navBarClose = document.querySelector('.nav-bar-close');
const body = document.body;

if (mobileMenuBtn && navBar && menuOverlay) {
  const toggleMenu = () => {
    navBar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    if (navBar.classList.contains('active')) {
      mobileMenuBtn.style.visibility = 'hidden';
      body.style.overflow = 'hidden';
    } else {
      mobileMenuBtn.style.visibility = '';
      body.style.overflow = '';
    }
  };
  mobileMenuBtn.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
  if (navBarClose) navBarClose.addEventListener('click', toggleMenu);
  navBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navBar.classList.contains('active')) toggleMenu();
    });
  });
}

const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

let buscaInicial = '';

const normalizarTexto = (s) => (s == null ? '' : String(s))
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '');

const categoriaAtiva = () => {
  const btn = document.querySelector('.products-filter-btn.active');
  return btn ? (btn.getAttribute('data-filter-category') || 'all') : 'all';
};

const filtrarCardsCombinado = () => {
  const termo = normalizarTexto((searchInput && searchInput.value || '').trim().replaceAll('_', ' '));
  const categoria = categoriaAtiva();
  let foundCount = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    const nameEl = card.querySelector('.product-name');
    const productName = normalizarTexto(nameEl ? nameEl.textContent : '');
    const nomeSku = normalizarTexto((card.getAttribute('data-sku') || '').replaceAll('_', ' '));
    const correspondeBusca = !termo || productName.includes(termo) || nomeSku.includes(termo);
    const cardCategories = (card.getAttribute('data-category') || '').toLowerCase();
    const correspondeCategoria = categoria === 'all' || cardCategories.includes(categoria);
    if (correspondeBusca && correspondeCategoria) {
      card.style.display = '';
      card.classList.add('animate-on-scroll');
      foundCount++;
    } else {
      card.style.display = 'none';
    }
  });
  return foundCount;
};

const performSearch = () => {
  if (!searchInput) return;
  const searchTerm = searchInput.value.trim();
  const naPaginaProdutos = /produtos\.html$/.test(location.pathname);
  const temGrid = document.querySelector('.product-grid');
  if (!naPaginaProdutos || !temGrid) {
    window.location.href = 'produtos.html?busca=' + encodeURIComponent(searchTerm);
    return;
  }
  if (!searchTerm) {
    filtrarCardsCombinado();
    if (/produtos\.html$/.test(location.pathname)) history.replaceState({}, '', 'produtos.html');
    return;
  }
  const foundCount = filtrarCardsCombinado();
  if (foundCount > 0) showToast(`${foundCount} produto(s) encontrado(s)!`, 'success');
  else showToast('Nenhum produto encontrado. Fale no WhatsApp que buscamos pra você!', 'info');
};

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); performSearch(); }
  });
}

const filterButtons = document.querySelectorAll('.products-filter-btn');

const applyCategoryFilter = () => {
  filtrarCardsCombinado();
  const grid = document.querySelector('.products-main .product-grid') || document.querySelector('.product-grid');
  if (grid) {
    const topo = grid.getBoundingClientRect().top + window.pageYOffset - 110;
    if (window.pageYOffset > topo) window.scrollTo({ top: Math.max(topo, 0), behavior: 'smooth' });
  }
};

if (filterButtons.length) {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const category = btn.getAttribute('data-filter-category');
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCategoryFilter();
    });
  });
  const params = new URLSearchParams(window.location.search);
  buscaInicial = (params.get('busca') || '').trim();
  const initialCategory = params.get('categoria');
  if (initialCategory) {
    const targetBtn = Array.from(filterButtons).find(b => b.getAttribute('data-filter-category') === initialCategory);
    if (targetBtn) {
      filterButtons.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      applyCategoryFilter();
    }
  }
}

const homeCategoryChips = document.querySelectorAll('.section-categories .category-chip[data-target-category]');
if (homeCategoryChips.length) {
  homeCategoryChips.forEach(chip => {
    chip.addEventListener('click', () => {
      const target = chip.getAttribute('data-target-category');
      window.location.href = target ? `produtos.html?categoria=${encodeURIComponent(target)}` : 'produtos.html';
    });
  });
}

const CART_STORAGE_KEY = 'droga_g_cart';
const FAVORITES_STORAGE_KEY = 'droga_g_favorites';

const loadCart = () => { try { return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || []; } catch { return []; } };
const saveCart = (cart) => { try { localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart)); } catch {} };
const loadFavorites = () => { try { return JSON.parse(localStorage.getItem(FAVORITES_STORAGE_KEY)) || []; } catch { return []; } };
const saveFavorites = (f) => { try { localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(f)); } catch {} };

/* --- CARRINHO / LISTA DE PEDIDO ---
   O site nao mostra preco, entao o carrinho e uma lista do que a pessoa
   quer. O pedido so vira compra depois que a loja confirma valor,
   estoque e prazo no WhatsApp. */
const CONTROLADOS_REQUEREM_LOJA = (p) => !!(p && p.tarja === 'tarja_vermelha_c1');

const addToCart = (produto) => {
  if (!produto || !produto.sku) return;
  const cart = loadCart();
  const mesmo = cart.find(i => i.sku === produto.sku);
  if (mesmo) mesmo.quantidade = (mesmo.quantidade || 1) + 1;
  else cart.push({
    sku: produto.sku,
    nome: produto.nome,
    quantidade: 1,
    controlado: CONTROLADOS_REQUEREM_LOJA(produto)
  });
  saveCart(cart);
  updateCartBadge();
  showToast(produto.nome + ' adicionado à lista.', 'success',
            { texto: 'Ver carrinho', href: 'carrinho.html' });
};

const cartTemControlado = () => loadCart().some(i => i.controlado);

const updateCartBadge = () => {
  const badges = document.querySelectorAll('[data-cart-count]');
  if (!badges.length) return;
  const n = loadCart().length;
  badges.forEach(b => {
    b.textContent = n;
    b.style.display = n ? '' : 'none';
  });
};
const updateFavoritesBadge = () => {
  const badges = document.querySelectorAll('[data-favorites-count]');
  if (!badges.length) return;
  badges.forEach(b => b.textContent = loadFavorites().length);
};

updateCartBadge();
updateFavoritesBadge();

const toggleFavoriteForProduct = (product) => {
  const favorites = loadFavorites();
  // compara por SKU (unico e estavel). So usa o nome como reserva quando nao ha SKU.
  const index = product.sku
    ? favorites.findIndex(f => f.sku === product.sku)
    : favorites.findIndex(f => !f.sku && f.name === product.name);
  if (index >= 0) { favorites.splice(index, 1); showToast('Removido dos favoritos.', 'info'); }
  else { favorites.push(product); showToast('Adicionado aos favoritos!', 'success'); }
  saveFavorites(favorites);
  updateFavoritesBadge();
};

document.querySelectorAll('.product-card').forEach(card => {
  const favoriteBtn = card.querySelector('.favorite-btn');
  if (!favoriteBtn) return;
  const skuCard = (card.getAttribute('data-sku') || '').trim();
  const nomeSalvo = () => {
    const nameEl = card.querySelector('.product-name');
    return nameEl ? nameEl.textContent.trim() : 'Produto';
  };
  if (skuCard && loadFavorites().some(f => f.sku === skuCard)) favoriteBtn.classList.add('favorited');
  favoriteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleFavoriteForProduct({ sku: skuCard, name: nomeSalvo() });
    favoriteBtn.classList.toggle('favorited');
  });
});

document.querySelectorAll('[data-favorites-button]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    window.location.href = 'favoritos.html';
  });
});

document.querySelectorAll('[data-account-button]').forEach(btn => {
  btn.addEventListener('click', (e) => { e.preventDefault(); window.location.href = 'contato.html'; });
});

const produtosData = Array.isArray(window.DROGAG_PRODUTOS) ? window.DROGAG_PRODUTOS : [];
const produtosPorSku = {};
produtosData.forEach((p) => { if (p && p.sku) produtosPorSku[p.sku.trim()] = p; });

const applyProductDataToCards = () => {
  document.querySelectorAll('.product-card[data-sku]').forEach((card) => {
    const sku = (card.getAttribute('data-sku') || '').trim();
    const data = produtosPorSku[sku];
    if (!data) return;
    const nameEl = card.querySelector('.product-name');
    const priceEl = card.querySelector('.product-price');
    const oldPriceEl = card.querySelector('.product-price-old');
    const installmentEl = card.querySelector('.product-installment');
    const imgPlaceholder = card.querySelector('.product-image-placeholder');
    if (nameEl && data.nome) nameEl.textContent = data.nome.trim();
    if (priceEl) priceEl.textContent = '';
    if (oldPriceEl) oldPriceEl.textContent = '';
    if (installmentEl) installmentEl.textContent = '';
    if (imgPlaceholder && data.imagem) {
      const probe = new Image();
      probe.onload = () => {
        imgPlaceholder.innerHTML = `<img src="${data.imagem}" alt="${(data.nome || '').trim()}">`;
};


      probe.src = data.imagem;
    }
    if (data.categoria && !card.getAttribute('data-category')) {
      card.setAttribute('data-category', data.categoria);
    }
    // badge de tarja (oculto ate o dono revisar com a farmacia)
  });

  document.querySelectorAll('.product-card').forEach((card) => {
    const sku = (card.getAttribute('data-sku') || '').trim();
    const data = produtosPorSku[sku];
    const priceWrap = card.querySelector('.product-price-wrapper');
    const btn = card.querySelector('.btn');
    // usa o nome do DADOS, nao o texto do card (que comeca como "Carregando...")
    const nome = (data && data.nome ? data.nome : (card.querySelector('.product-name') || {}).textContent || 'produto').trim();

    if (data && typeof data.preco === 'number') {
      if (priceWrap) priceWrap.style.display = 'none';
    } else {
      if (priceWrap) priceWrap.style.display = 'none';
    }
    if (btn) {
      // botao vira "adicionar a lista". O pedido so fecha pelo WhatsApp,
      // na pagina do carrinho, onde o cliente preenche os dados.
      btn.textContent = 'Adicionar à lista';
      btn.href = 'carrinho.html';
      btn.removeAttribute('target');
      btn.removeAttribute('rel');
      btn.classList.remove('btn-whatsapp');
      if (data) {
        btn.addEventListener('click', (e) => {
          e.preventDefault();
          addToCart({ sku: sku, nome: nome, tarja: data.tarja });
        });
      }
    }
  });
};

/* --- GERA CARDS DINAMICOS DO ESTOQUE --- */
/* Catalogo em paginas de 24. Antes eram 105 cards de uma vez, o que
   deixava a pagina imensa e lenta no 4G do celular. */
const CATALOGO_PAGINA = 24;
let catalogoMostrados = CATALOGO_PAGINA;

const montarCardProduto = (p) => {
  const badgeHtml = '';
  return [
      '<div class="product-card" data-sku="' + p.sku + '" data-category="' + (p.categoria || '') + '">',
      '  <div class="product-image-placeholder"><img src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy"></div>',
      '  ' + badgeHtml,
      '  <button class="favorite-btn" type="button" title="Favoritar"><i class="far fa-heart"></i></button>',
      '  <h3 class="product-name">' + p.nome + '</h3>',
      '  <span class="product-price" style="font-size:0.8rem;color:#666">Valor confirmado pela loja</span>',
      '  <button type="button" class="btn" data-add-carrinho="' + p.sku + '"><i class="fas fa-cart-plus"></i> Adicionar à lista</button>',
      '</div>'
  ].join('\n');
};

const ligarCardsCatalogo = (grid) => {
  const favSkus = loadFavorites().map(f => f.sku);
  grid.querySelectorAll('.product-card').forEach(card => {
    const sku = (card.getAttribute('data-sku') || '').trim();
    const btn = card.querySelector('.favorite-btn');
    if (!btn || btn._favInit) return;
    btn._favInit = true;
    if (sku && favSkus.includes(sku)) btn.classList.add('favorited');
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const nameEl = card.querySelector('.product-name');
      toggleFavoriteForProduct({ sku, name: nameEl ? nameEl.textContent.trim() : 'Produto' });
      btn.classList.toggle('favorited', loadFavorites().some(f => f.sku === sku));
    });
    // botao "adicionar a lista" dos cards do catalogo dinamico
    const addBtn = card.querySelector('[data-add-carrinho]');
    if (addBtn && !addBtn._addInit) {
      addBtn._addInit = true;
      addBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const p = produtosPorSku[sku];
        if (!p) { showToast('Produto não encontrado.', 'info'); return; }
        addToCart({ sku: p.sku, nome: p.nome, tarja: p.tarja });
      });
    }
  });
};

const renderCatalogoDinamico = () => {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid || !produtosData.length) return;
  const mostrar = produtosData.slice(0, catalogoMostrados);
  grid.innerHTML = mostrar.map(montarCardProduto).join('');
  ligarCardsCatalogo(grid);

  const btnMais = document.querySelector('[data-carregar-mais]');
  const info = document.querySelector('[data-catalogo-total]');
  const restantes = produtosData.length - catalogoMostrados;
  if (btnMais) btnMais.hidden = restantes <= 0;
  if (info) {
    info.textContent = restantes > 0
      ? 'Mostrando ' + mostrar.length + ' de ' + produtosData.length + ' produtos'
      : 'Todos os ' + produtosData.length + ' produtos carregados';
  }
};

document.addEventListener('click', (e) => {
  const btn = e.target.closest('[data-carregar-mais]');
  if (!btn) return;
  catalogoMostrados += CATALOGO_PAGINA;
  const y = window.scrollY;
  renderCatalogoDinamico();
  filtrarCardsCombinado();
  window.scrollTo({ top: y, behavior: 'instant' in window ? 'instant' : 'auto' });
});


const iniciarBuscaInicial = () => {
  if (!buscaInicial) return;
  if (searchInput) searchInput.value = buscaInicial;
  const achados = filtrarCardsCombinado();
  if (achados > 0) showToast(`${achados} resultado(s) para "${buscaInicial}".`, 'success');
  else showToast('Nenhum produto encontrado. Fale no WhatsApp que buscamos pra você!', 'info');
};

function reapplyCategoryFilter() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('categoria');
  if (cat) {
    const btn = Array.from(document.querySelectorAll('.products-filter-btn')).find(b => b.getAttribute('data-filter-category') === cat);
    if (btn) {
      document.querySelectorAll('.products-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCategoryFilter();
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { renderCatalogoDinamico(); applyProductDataToCards(); initCardClick(); iniciarBuscaInicial(); reapplyCategoryFilter(); });
} else {
  renderCatalogoDinamico();
  applyProductDataToCards();
  initCardClick();
  iniciarBuscaInicial();
  reapplyCategoryFilter();
}

const cartPageContainer = document.querySelector('.cart-page');
if (cartPageContainer) {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartEmptyMessage = document.getElementById('cartEmptyMessage');
  const cartSummary = document.getElementById('cartSummary');
  const clearCartButton = document.getElementById('clearCartButton');
  const checkoutForm = document.getElementById('cartCheckoutForm');

  const renderCart = () => {
    const cart = loadCart();
    if (!cartItemsContainer) return;
    cartItemsContainer.innerHTML = '';
    if (!cart.length) {
      if (cartEmptyMessage) cartEmptyMessage.style.display = 'block';
      if (cartSummary) cartSummary.style.display = 'none';
      return;
    }
    if (cartEmptyMessage) cartEmptyMessage.style.display = 'none';
    const grouped = {};
    cart.forEach(item => {
      const chave = item.sku || item.nome;
      if (!grouped[chave]) grouped[chave] = { nome: item.nome || item.name, quantidade: 0, controlado: !!item.controlado };
      grouped[chave].quantidade += (item.quantidade || 1);
    });
    Object.values(grouped).forEach(item => {
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--neutral-medium);';
      const aviso = item.controlado
        ? '<br><span style="font-size:0.8rem;color:#9a3412"><i class="fas fa-prescription"></i> Controlado: retirada na loja com receita</span>'
        : '';
      const menos = item.quantidade > 1
        ? ' <button type="button" data-cart-less="' + (item.sku || item.nome) + '" style="border:1px solid var(--neutral-medium);background:#fff;border-radius:50%;width:28px;height:28px;cursor:pointer;">-</button>'
        : '';
      const mais = ' <button type="button" data-cart-more="' + (item.sku || item.nome) + '" style="border:1px solid var(--neutral-medium);background:#fff;border-radius:50%;width:28px;height:28px;cursor:pointer;">+</button>';
      row.innerHTML = '<div style="flex:1"><strong>' + (item.nome || '(produto)') + '</strong><br><span style="font-size:0.9rem;color:var(--text-secondary)">Qtd: ' + item.quantity + '</span>' + aviso + '</div>' +
        '<div style="display:flex;align-items:center;gap:4px;flex-shrink:0;">' + menos + mais + '</div>';
      cartItemsContainer.appendChild(row);
    });
    // botoes de quantidade
    cartItemsContainer.querySelectorAll('[data-cart-more]').forEach(b => {
      b.addEventListener('click', () => {
        const chave = b.getAttribute('data-cart-more');
        const c = loadCart();
        const alvo = c.find(i => (i.sku || i.nome) === chave);
        if (alvo) { alvo.quantidade = (alvo.quantidade || 1) + 1; saveCart(c); updateCartBadge(); renderCart(); }
      });
    });
    cartItemsContainer.querySelectorAll('[data-cart-less]').forEach(b => {
      b.addEventListener('click', () => {
        const chave = b.getAttribute('data-cart-less');
        const c = loadCart();
        const alvo = c.find(i => (i.sku || i.nome) === chave);
        if (!alvo) return;
        alvo.quantidade = (alvo.quantidade || 1) - 1;
        if (alvo.quantidade <= 0) c.splice(c.indexOf(alvo), 1);
        saveCart(c); updateCartBadge(); renderCart();
      });
    });
    if (cartSummary) cartSummary.style.display = 'block';
  };

  renderCart();

  // retirada x entrega: esconde os campos de endereco quando for retirada
  const sincronizarModoEntrega = () => {
    const sel = document.querySelector('input[name="entrega"]:checked');
    const entrega = sel ? sel.value : 'Retirada na loja';
    const temControlado = cartTemControlado();
    const aviso = document.getElementById('avisoControlado');
    const campos = document.getElementById('camposEntrega');
    if (aviso) aviso.style.display = temControlado ? 'block' : 'none';
    if (temControlado) {
      // bloqueia entrega quando tem controlado
      document.querySelectorAll('input[name="entrega"]').forEach(r => {
        if (r.value === 'Entrega') { r.checked = false; r.disabled = true; }
      });
      const ret = document.querySelector('input[name="entrega"][value^="Retirada"]');
      if (ret) ret.checked = true;
      if (campos) campos.style.display = 'none';
    } else {
      document.querySelectorAll('input[name="entrega"]').forEach(r => { r.disabled = false; });
      if (campos) campos.style.display = (entrega === 'Entrega') ? '' : 'none';
    }
  };
  document.querySelectorAll('input[name="entrega"]').forEach(r => r.addEventListener('change', sincronizarModoEntrega));
  sincronizarModoEntrega();

  if (clearCartButton) {
    clearCartButton.addEventListener('click', () => { saveCart([]); updateCartBadge(); renderCart(); showToast('Carrinho limpo.', 'info'); });
  }

  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const cart = loadCart();
      if (!cart.length) { showToast('Seu carrinho está vazio.', 'info'); return; }
      const nome = document.getElementById('checkoutNome').value.trim();
      const telefone = document.getElementById('checkoutTelefone').value.trim();
      const endereco = document.getElementById('checkoutEndereco').value.trim();
      const bairro = document.getElementById('checkoutBairro').value.trim();
      const pagamento = document.getElementById('checkoutPagamento').value;
      const referencia = document.getElementById('checkoutReferencia').value.trim();
      const observacoes = document.getElementById('checkoutObservacoes').value.trim();
      const entregaEl = document.querySelector('input[name="entrega"]:checked');
      let entrega = entregaEl ? entregaEl.value : 'Retirada na loja';
      // controlado obriga retirada na loja
      if (cartTemControlado() && entrega === 'Entrega') {
        entrega = 'Retirada na loja (item controlado)';
      }
      if (!nome || !telefone || !pagamento) { showToast('Preencha os campos obrigatórios.', 'info'); return; }
      if (entrega === 'Entrega') {
        if (!bairro) { showToast('Informe o bairro para delivery.', 'info'); return; }
        if (!bairroEntregue(bairro)) {
          const seg = window.confirm('Entregamos em ' + BAIRROS_ENTREGA.length + ' bairros num raio de 4 km.\n\n"' + bairro + '" não está na lista.\n\nQuer enviar assim mesmo? A loja confirma pelo WhatsApp se consegue entregar.');
          if (!seg) return;
        }
        if (!endereco) { showToast('Informe o endereço para entrega.', 'info'); return; }
      }
      const grouped = {};
      cart.forEach(item => {
        const chave = item.sku || item.nome;
        if (!grouped[chave]) grouped[chave] = { nome: item.nome || item.name, quantidade: 0, controlado: !!item.controlado };
        grouped[chave].quantidade += (item.quantidade || 1);
      });
      const linhas = Object.values(grouped).map(item => {
        return (item.nome || '(produto)') + ' | Qtd: ' + item.quantidade + (item.controlado ? ' | CONTROLADO (só retirada, com receita)' : '');
      });
      const msg = msgPedido({
        itens: linhas.map((l, k) => `${k + 1}. ${l}`).join('\n'),
        nome, telefone, endereco, bairro, referencia, pagamento, observacoes, entrega
      });
      enviarWhatsApp(msg);
      showToast('Pedido aberto no WhatsApp!', 'success');
      saveCart([]); updateCartBadge(); renderCart(); checkoutForm.reset(); sincronizarModoEntrega();
    });
  }
}

const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = newsletterForm.querySelector('.newsletter-input').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('E-mail inválido.', 'info'); return; }
    enviarWhatsApp(msgOferta(email));
    showToast('Confirme o cadastro no WhatsApp que abriu!', 'success');
    newsletterForm.reset();
  });
}

const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const val = (id) => { const el = document.getElementById(id); return el ? el.value.trim() : ''; };
    const nome = val('nome'), email = val('email'), telefone = val('telefone'), assunto = val('assunto'), mensagem = val('mensagem');
    if (!nome || !email || !telefone || !assunto || !mensagem) { showToast('Preencha todos os campos.', 'info'); return; }
    enviarWhatsApp(msgContato({ assunto, nome, email, telefone, mensagem }));
    showToast('Abrindo o WhatsApp com sua mensagem...', 'success');
    contactForm.reset();
  });
}

const scrollToTopBtn = document.getElementById('scrollToTop');
if (scrollToTopBtn) {
  window.addEventListener('scroll', () => scrollToTopBtn.classList.toggle('visible', window.pageYOffset > 300));
  scrollToTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href !== '#' && href.length > 1) { e.preventDefault(); const t = document.querySelector(href); if (t) t.scrollIntoView({ behavior: 'smooth' }); }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('animate-on-scroll'); observer.unobserve(entry.target); }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
document.querySelectorAll('.product-card, .feature-card, .content-card, .category-card').forEach(el => observer.observe(el));

document.querySelectorAll('a[href="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    if (link.hasAttribute('data-conta')) { showToast('Área do cliente em breve.', 'info'); return; }
    const t = link.textContent.trim();
    if (t.includes('Rastrear')) showToast('Rastreamento em breve.', 'info');
    else if (t.includes('Tele Entrega')) showToast('Frete grátis a partir de R$10 em Santa Terezinha.', 'info');
    else if (t.includes('Blog')) showToast('Blog em construção.', 'info');
    else if (t.includes('Trabalhe')) showToast('Envie currículo pelo formulário de contato.', 'info');
    else showToast('Conteúdo em atualização.', 'info');
  });
});

/* --- ÁREA DE ENTREGA ---
   Farmácia de bairro não entrega em todo lugar. O dono definiu um RAIO DE
   4 KM a partir da loja (Rua Julita Nogueira Soares, 610 - Santa Terezinha).

   Esta lista foi levantada medindo a distancia de cada bairro ate a loja,
   e conferida com o dono. Tudo que esta aqui esta dentro do raio.

   Antes o site aceitava qualquer CEP começando com 30 ou 31, ou seja, quase
   todo o estado de Minas Gerais — e prometia entrega onde não tem entrega.
   Isso gerava pedido que a farmácia não conseguia cumprir.

   Para incluir um bairro novo, acrescente o nome aqui. A lista aparece
   na tela para o cliente (home, FAQ e pedido), entao mexer aqui
   atualiza tudo de uma vez.

   Os 8 primeiros sao os bairros "de nome" que as pessoas mais usam:
     Santa Terezinha 0,45 · Ressaca 0,93 · Serrano 1,17 · Urca 2,51
     Castelo 1,32 · Bandeirantes 2,53 · Ouro Preto 2,66 · Pampulha 3,58  */
const BAIRROS_ENTREGA = [
  'Santa Terezinha',
  'Ressaca',
  'Serrano',
  'Urca',
  'Castelo',
  'Ouro Preto',
  'Bandeirantes',
  'Pampulha',
  'Confisco',
  'São Gotardo',
  'Itatiaia',
  'Vila Santa Luzia',
  'Tijuca',
  'Paquetá',
  'Parque Recreio',
  'Estrela d’Alva',
  'São Joaquim',
  'Recanto da Pampulha',
  'Alípio de Melo',
  'Braúnas',
  'Carajás',
  'Manacás',
  'Coqueiros',
  'Cabral',
  'Xangri-lá',
  'Arpoador',
  'Trevo',
  'Pedra Azul',
  'Jardim São José',
  'Jardim Alvorada',
  'Nossa Senhora da Glória',
  'Balneário da Ressaca',
  'Residencial Sarandi'
];

const bairroEntregue = (nome) => {
  const alvo = String(nome || '').trim().toLowerCase();
  if (!alvo) return false;
  return BAIRROS_ENTREGA.some(b => {
    const b2 = String(b).toLowerCase();
    return alvo === b2 || alvo.includes(b2) || b2.includes(alvo);
  });
};

/* --- ENVIO / CEP NO TOPO --- */
const cepBtn = document.querySelector('[data-cep]');
if (cepBtn) {
  const cepTexto = cepBtn.querySelector('[data-cep-text]');
  const formatar = (v) => v.slice(0, 5) + '-' + v.slice(5);
  // So o CEP e salvo para preenchimento. A cobertura NAO e decidida pelo CEP:
  // depende do bairro, porque a farmacia entrega so em bairro perto.
  const mostrar = (v) => { cepTexto.textContent = 'CEP ' + v; };
  const salvo = localStorage.getItem('droga_g_cep');
  if (salvo) mostrar(salvo);
  cepBtn.addEventListener('click', () => {
    const entrada = prompt('Informe seu CEP (8 números):', (salvo || '').replace('-', ''));
    if (entrada === null) return;
    const nums = entrada.replace(/\D/g, '');
    if (nums.length !== 8) { showToast('CEP inválido — digite 8 números.', 'info'); return; }
    localStorage.setItem('droga_g_cep', formatar(nums));
    mostrar(formatar(nums));
    showToast('CEP salvo. Na hora do pedido a loja confirma se entrega na sua região.', 'info');
  });
}


/* --- VOLTAR AO TOPO AO ABRIR A PAGINA ---
   O navegador guarda a posicao da rolagem quando voce atualiza (F5).
   Num site de loja isso desorienta: a pessoa recarrega e continua
   no meio da lista, sem saber que recarregou. Aqui a pagina sempre
   abre no topo.

   Isso NAO afeta o botao "carregar mais": ele nao recarrega a pagina,
   entao a rolagem dele e mantida de proposito. */
if ('scrollRestoration' in history) {
  history.scrollRestoration = 'manual';
}
window.addEventListener('load', () => { window.scrollTo(0, 0); });
if (document.readyState === 'complete') { window.scrollTo(0, 0); }

/* --- SETAS DAS PRATELEIRAS --- */
document.querySelectorAll('.prateleira-seta').forEach((btn) => {
  btn.addEventListener('click', () => {
    const trilho = document.querySelector('.prateleira-trilho[data-trilho="' + btn.dataset.prateleira + '"]');
    if (trilho) trilho.scrollBy({ left: Number(btn.dataset.dir) * (trilho.clientWidth * 0.8), behavior: 'smooth' });
  });
});

/* --- CARROSSEL DE BANNERS --- */
const carrossel = document.querySelector('[data-carrossel]');
if (carrossel) {
  const trilho = carrossel.querySelector('.banner-trilho');
  const slides = carrossel.querySelectorAll('.banner-slide');
  const bolinhas = carrossel.querySelectorAll('.banner-bolinha');
  let atual = 0;
  let timer;
  const ir = (i) => {
    atual = (i + slides.length) % slides.length;
    trilho.style.transform = 'translateX(-' + atual * 100 + '%)';
    bolinhas.forEach((b, k) => b.classList.toggle('ativo', k === atual));
  };
  const reiniciar = () => { clearInterval(timer); timer = setInterval(() => ir(atual + 1), 6000); };
  carrossel.querySelectorAll('[data-banner-dir]').forEach((b) => {
    b.addEventListener('click', () => { ir(atual + Number(b.dataset.bannerDir)); reiniciar(); });
  });
  bolinhas.forEach((b, k) => {
    b.addEventListener('click', () => { ir(k); reiniciar(); });
  });
  reiniciar();
}

/* --- MENSAGENS DE WHATSAPP ORGANIZADAS PARA O BALCÃO (Dmaster) --- */
function montarProtocolo() {
  const d = new Date();
  const p = (n) => String(n).padStart(2, '0');
  return 'DG-' + p(d.getDate()) + p(d.getMonth() + 1) + '-' + p(d.getHours()) + p(d.getMinutes()) + p(d.getSeconds());
}
function enviarWhatsApp(texto) {
  window.open('https://wa.me/5531971716274?text=' + encodeURIComponent(texto), '_blank');
}
function cepSalvo() { return localStorage.getItem('droga_g_cep') || 'não informado'; }
function msgConsultaProduto(nome, sku, qtd) {
  return [
    'CONSULTA DE PRODUTO - Site Droga G',
    'Protocolo: ' + montarProtocolo(),
    '',
    'Produto: ' + nome,
    'Código interno: ' + (sku || 'sem código'),
    'Quantidade: ' + (qtd || 1),
    'CEP do cliente: ' + cepSalvo(),
    '',
    'Ação balcão: conferir preço e estoque no Dmaster e responder ao cliente.'
  ].join('\n');
}
function msgPedido(d) {
  const retirada = String(d.entrega || 'Retirada na loja').startsWith('Retirada');
  const barra = '━━━━━━━━━━━━━━━━━━━━';
  const L = [];

  L.push('*NOVO PEDIDO — SITE DROGA G*');
  L.push(barra);
  L.push('*Protocolo:* ' + montarProtocolo());
  L.push('*Data:* ' + new Date().toLocaleString('pt-BR'));
  L.push('');
  L.push('*1. PRODUTOS*');
  L.push(d.itens);
  L.push('');
  L.push('*2. CLIENTE*');
  L.push('*Nome:* ' + d.nome);
  L.push('*WhatsApp:* ' + d.telefone);
  if (!retirada) {
    L.push('*CEP:* ' + cepSalvo());
    L.push('*Endereço:* ' + d.endereco);
    L.push('*Bairro:* ' + d.bairro);
  }
  L.push('');
  L.push('*3. RECEBIMENTO*');
  L.push('*Modalidade:* ' + (d.entrega || 'Retirada na loja'));
  if (retirada) {
    L.push('*Local:* Rua Julita Nogueira Soares, 610');
    L.push('*Bairro:* Santa Terezinha - BH');
  }
  L.push('*Pagamento:* ' + d.pagamento);
  if (d.referencia) L.push('*Referência:* ' + d.referencia);
  L.push('');
  if (d.observacoes) {
    L.push('*4. OBSERVAÇÕES DO CLIENTE*');
    L.push(d.observacoes);
    L.push('');
  }
  L.push(barra);
  L.push('_Ação do balcão:_');
  L.push('1. Conferir preço e estoque no Dmaster');
  L.push('2. Confirmar disponibilidade e prazo');
  L.push('3. Enviar link de pagamento');
  return L.join('\n');
}

function msgContato(d) {
  return [
    'MENSAGEM PELO SITE - Droga G',
    'Protocolo: ' + montarProtocolo(),
    '',
    'Assunto: ' + d.assunto,
    'Nome: ' + d.nome,
    'E-mail: ' + d.email,
    'Telefone: ' + d.telefone,
    '',
    'Mensagem:',
    d.mensagem
  ].join('\n');
}
function msgOferta(email) {
  return [
    'CADASTRO NA LISTA DE OFERTAS - Site Droga G',
    'Protocolo: ' + montarProtocolo(),
    'E-mail: ' + email
  ].join('\n');
}

/* --- CARD CLICAVEL -> PRODUTO --- */
function initCardClick() {
  document.querySelectorAll('.product-card[data-sku]').forEach((card) => {
    if (card._clickInit) return;
    card._clickInit = true;
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target.closest('.favorite-btn') || e.target.closest('.btn')) return;
      window.location.href = 'produto.html?sku=' + encodeURIComponent(card.getAttribute('data-sku'));
    });
    const btnZap = card.querySelector('.btn');
    if (btnZap) {
      btnZap.addEventListener('click', (e) => {
        e.stopPropagation();
      });
    }
  });
}
initCardClick();

/* --- PAGINA DO PRODUTO --- */
const produtoDetalhe = document.querySelector('[data-produto-detalhe]');
if (produtoDetalhe) {
  const params = new URLSearchParams(window.location.search);
  const sku = (params.get('sku') || '').trim();
  const data = produtosPorSku[sku];
  const breadcrumb = document.querySelector('[data-produto-breadcrumb]');
  if (!data) {
    produtoDetalhe.innerHTML = '<div class="produto-vazio"><i class="fas fa-exclamation-circle"></i><p>Produto não encontrado.</p><a href="produtos.html" class="btn">Ver todos os produtos</a></div>';
    if (breadcrumb) breadcrumb.innerHTML = '<a href="index.html">Início</a> / <a href="produtos.html">Produtos</a> / Produto';
    document.title = 'Produto não encontrado - Farmácia Droga G';
  } else {
    const catLabels = { medicamentos: 'Medicamentos', dermocosmeticos: 'Dermocosméticos', vitaminas: 'Vitaminas e Suplementos', higiene: 'Higiene e Cuidados', infantil: 'Infantil', controlados: 'Controlados' };
    const cat = catLabels[data.categoria] || 'Produtos';
    const zaps = 'https://wa.me/5531971716274?text=' + encodeURIComponent(msgConsultaProduto(data.nome, data.sku, 1));
    document.title = data.nome + ' - Farmácia Droga G';
    if (breadcrumb) breadcrumb.innerHTML = '<a href="index.html">Início</a> / <a href="produtos.html">Produtos</a> / <a href="produtos.html?categoria=' + data.categoria + '">' + cat + '</a> / ' + data.nome;
    // Avisos de tarja. Toggle unico: o dono liga/desliga aqui depois de
    // revisar com a farmacia. Os cartoes continuam limpos de proposito;
    // o aviso aparece na hora da compra, na pagina do produto.
    let tarjaAviso = '';
    if (data.tarja === 'tarja_vermelha_c1') {
      tarjaAviso = '<div class="produto-nota" style="background:#e6f0ff;border-color:#99bbff;color:#004080;"><i class="fas fa-prescription"></i> <strong>MEDICAMENTO CONTROLADO</strong> — Venda exclusiva na loja Droga G Santa Terezinha, mediante apresentação de receita médica. Não realizamos venda deste medicamento pela internet.</div>';
    } else if (data.tarja === 'tarja_vermelha') {
      tarjaAviso = '<div class="produto-nota" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;"><i class="fas fa-prescription"></i> <strong>Venda sob prescrição médica</strong> — retire na loja apresentando a receita. Consulte disponibilidade pelo WhatsApp.</div>';
    }
    produtoDetalhe.innerHTML = [
      '<div class="produto-foto">',
      '  <img src="' + data.imagem + '" alt="' + data.nome + '" onerror="this.style.display=\'none\'">',
      '</div>',
      '<div class="produto-info">',
      '  <span class="produto-categoria"><i class="fas fa-tag"></i> ' + cat + '</span>',
      '  <h1>' + data.nome + '</h1>',
      (typeof data.estoque === 'number' && data.estoque > 0
        ? '<div style="font-size:0.85rem;color:#16a34a;margin-bottom:14px;"><i class="fas fa-check-circle"></i> ' + data.estoque + ' unidade(s) em estoque</div>'
        : ''),
      '  <ul class="produto-beneficios">',
      '    <li><i class="fas fa-truck-fast"></i> Entrega em até 30 minutos</li>',
      '    <li><i class="fas fa-shield-alt"></i> Produto original, com nota fiscal</li>',
      '    <li><i class="fas fa-store"></i> Retire em nossa loja</li>',
      '  </ul>',
      (tarjaAviso || '  <div class="produto-nota"><i class="fas fa-circle-info"></i> Consulte disponibilidade e condição especial pelo WhatsApp.</div>'),
      '  <div class="produto-acoes">',
      '    <button type="button" class="btn" data-add-carrinho="' + data.sku + '"><i class="fas fa-cart-plus"></i> Adicionar à lista</button>',
      '    <a href="' + zaps + '" target="_blank" rel="noopener" class="btn btn-outline"><i class="fab fa-whatsapp"></i> ' + (data.tarja === 'tarja_vermelha_c1' ? 'Consultar disponibilidade' : 'Tirar dúvida') + '</a>',
      '    <button class="btn btn-outline" data-fav-produto="' + data.sku + '"><i class="far fa-heart"></i> Favoritar</button>',
      '  </div>',
      '  <div class="produto-lojas"><strong>Central:</strong> (31) 3476-2473 &nbsp;|&nbsp; <strong>WhatsApp:</strong> (31) 97171-6274</div>',
      '</div>'
    ].join('\n');
    const addBtn = produtoDetalhe.querySelector('[data-add-carrinho]');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        addToCart({ sku: data.sku, nome: data.nome, tarja: data.tarja });
      });
    }
    const favBtn = produtoDetalhe.querySelector('[data-fav-produto]');
    if (favBtn) {
      const jaFav = loadFavorites().some(f => f.sku === data.sku);
      if (jaFav) favBtn.innerHTML = '<i class="fas fa-heart"></i> Nos favoritos';
      favBtn.addEventListener('click', () => {
        toggleFavoriteForProduct({ sku: data.sku, name: data.nome });
        const agora = loadFavorites().some(f => f.sku === data.sku);
        favBtn.innerHTML = agora ? '<i class="fas fa-heart"></i> Nos favoritos' : '<i class="far fa-heart"></i> Favoritar';
      });
    }
    const relacionados = produtosData.filter(p => p.categoria === data.categoria && p.sku !== data.sku).slice(0, 4);
    if (relacionados.length) {
      const grid = document.createElement('div');
      grid.className = 'relacionados';
      grid.innerHTML = '<h2 class="section-title">Você também pode gostar</h2><div class="product-grid">' +
        relacionados.map(p => [
          '<div class="product-card" data-sku="' + p.sku + '">',
          '  <div class="product-image-placeholder"><img src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy"></div>',
          '  <h3 class="product-name">' + p.nome + '</h3>',
          '  <button type="button" class="btn" data-add-rel="' + p.sku + '"><i class="fas fa-cart-plus"></i> Adicionar à lista</button>',
          '</div>'
        ].join('\n')).join('') + '</div>';
      produtoDetalhe.parentNode.appendChild(grid);
      grid.querySelectorAll('.product-card').forEach(c => {
        c.style.cursor = 'pointer';
        c.addEventListener('click', (e) => {
          if (e.target.closest('.btn')) return;
          window.location.href = 'produto.html?sku=' + encodeURIComponent(c.getAttribute('data-sku'));
        });
        const relBtn = c.querySelector('[data-add-rel]');
        if (relBtn) {
          relBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const p = produtosPorSku[relBtn.getAttribute('data-add-rel')];
            if (!p) { showToast('Produto não encontrado.', 'info'); return; }
            addToCart({ sku: p.sku, nome: p.nome, tarja: p.tarja });
          });
        }
      });
    }
  }
}

/* --- PAGINA DE FAVORITOS --- */
const favoritosGrid = document.querySelector('[data-favoritos-grid]');
if (favoritosGrid) {
  const vazio = document.querySelector('[data-favoritos-vazio]');
  const renderFavoritos = () => {
    const favs = loadFavorites();
    favoritosGrid.innerHTML = '';
    if (!favs.length) {
      favoritosGrid.style.display = 'none';
      if (vazio) vazio.hidden = false;
      return;
    }
    favoritosGrid.style.display = '';
    if (vazio) vazio.hidden = true;
    favs.forEach((f) => {
      const prod = f.sku ? produtosPorSku[f.sku] : null;
      const nome = prod ? prod.nome : (f.name || 'Produto');
      const imagem = prod ? prod.imagem : '';
      const zaps = 'https://wa.me/5531971716274?text=' + encodeURIComponent(msgConsultaProduto(nome, f.sku || '', 1));
      const card = document.createElement('div');
      card.className = 'product-card';
      if (f.sku) card.setAttribute('data-sku', f.sku);
      card.innerHTML = [
        '<button class="favorite-btn favorited" title="Remover dos favoritos"><i class="fas fa-heart"></i></button>',
        '<div class="product-image-placeholder">' + (imagem ? '<img src="' + imagem + '" alt="' + nome + '" loading="lazy">' : '') + '</div>',
        '<h3 class="product-name">' + nome + '</h3>',
        '<a href="' + zaps + '" target="_blank" rel="noopener" class="btn">Consulte pelo WhatsApp</a>'
      ].join('');
      card.querySelector('.favorite-btn').addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavoriteForProduct({ sku: f.sku || '', name: f.name || '' });
        renderFavoritos();
      });
      card.addEventListener('click', (e) => {
        if (e.target.closest('.favorite-btn') || e.target.closest('.btn')) return;
        if (f.sku) window.location.href = 'produto.html?sku=' + encodeURIComponent(f.sku);
      });
      favoritosGrid.appendChild(card);
    });
  };
  renderFavoritos();
}

/* --- BARRA INFERIOR (tab bar mobile) --- */
(function initTabBar() {
  if (document.querySelector('.tab-bar')) return;
  const path = (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const is = (p) => path === p ? ' active' : '';
  const el = document.createElement('nav');
  el.className = 'tab-bar';
  el.setAttribute('aria-label', 'Navegação principal');
  el.innerHTML = [
    '<a href="index.html" class="tab-item' + is('index.html') + '"><i class="fas fa-home"></i><span>Início</span></a>',
    '<a href="produtos.html" class="tab-item' + is('produtos.html') + '"><i class="fas fa-pills"></i><span>Produtos</span></a>',
    '<a href="carrinho.html" class="tab-item' + is('carrinho.html') + '"><i class="fas fa-shopping-cart"></i><span class="tab-badge" data-cart-count>0</span><span>Carrinho</span></a>',
    '<a href="#" class="tab-item" data-conta><i class="far fa-user"></i><span>Conta</span></a>'
  ].join('');
  document.body.appendChild(el);
  // badge do carrinho
  try {
    const cart = JSON.parse(localStorage.getItem('droga_g_cart') || '[]');
    const badge = el.querySelector('[data-cart-count]');
    if (badge) {
      badge.textContent = String(cart.length || 0);
      badge.style.display = cart.length ? '' : 'none';
    }
  } catch (e) {}
  el.querySelectorAll('.tab-item[data-conta]').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      showToast('Área da conta em breve.', 'info');
    });
  });
})();

/* --- BENEFÍCIOS: MARQUEE (2 grupos iguais, cada um 100vw) --- */
(function initBeneficiosMarquee() {
  const tracks = document.getElementById('beneficiosTracks');
  if (!tracks || tracks.dataset.ready) return;
  const items = Array.from(tracks.querySelectorAll('.beneficio-item'));
  if (!items.length) return;
  tracks.innerHTML = '';
  const grupo = (aria) => {
    const g = document.createElement('div');
    g.className = 'beneficios-group';
    if (aria) g.setAttribute('aria-hidden', 'true');
    items.forEach(i => g.appendChild(i.cloneNode(true)));
    return g;
  };
  tracks.appendChild(grupo(false));
  tracks.appendChild(grupo(true));
  tracks.dataset.ready = '1';
})();

/* ===== KIT FINAL — JS ===== */
/* Some com badge zerado ("0") e mostra quando tiver itens */
document.querySelectorAll('.icon-badge, .tab-badge').forEach(function (b) {
  var sync = function () {
    b.style.display = b.textContent.trim() === '0' ? 'none' : '';
  };
  new MutationObserver(sync).observe(b, { childList: true, characterData: true, subtree: true });
  sync();
});
/* Placeholder curto no mobile (não corta mais) */
if (matchMedia('(max-width: 768px)').matches) {
  document.querySelectorAll('.search-input').forEach(function (i) {
    i.placeholder = 'Buscar medicamentos...';
  });
}

/* --- TRADUZIR O QUE A PESSOA DIGITOU ---
   O campo pede "bairro", mas a reacao natural e digitar o CEP. Antes,
   um CEP nunca batia com a lista e o site respondia "fora do raio" para
   gente que esta dentro do raio -- chegou a acontecer com o CEP
   31360-120 (Rua Jose Alves de Souza, Santa Terezinha), que e o proprio
   bairro da farmacia.

   Aqui o CEP e convertido em bairro antes de conferir. */
const pareceCep = (v) => /^\d{5}-?\d{3}$/.test(String(v || '').trim());
const soDigitos = (v) => String(v || '').replace(/\D/g, '');

/* Consulta o CEP no servico publico do Correios (ViaCEP, sem chave).
   Devolve o bairro, ou '' se nao der. */
const buscarBairroPorCep = (cep) => {
  const num = soDigitos(cep);
  if (num.length !== 8) return Promise.resolve('');
  return fetch('https://viacep.com.br/ws/' + num + '/json/')
    .then(r => r.json())
    .then(d => (d && !d.erro) ? String(d.bairro || '').trim() : '')
    .catch(() => '');   // sem internet ou CEP inexistente: devolve vazio
};

const textoBairro = (v) => String(v || '').trim();



/* Mostra a lista de bairros com entrega na tela, a partir da mesma
   lista que a verificacao usa. Nada escrito a mao, nada desatualiza. */
(function exibeListaBairros() {
  const area = document.querySelector('[data-lista-bairros]');
  if (!area || typeof BAIRROS_ENTREGA === 'undefined') return;
  area.innerHTML = BAIRROS_ENTREGA.map((b, k) =>
    '<span class="tag-bairro' + (k === 0 ? ' tag-bairro--principal' : '') + '">' + b + '</span>'
  ).join('');
  const total = document.querySelector('[data-total-bairros]');
  if (total) total.textContent = BAIRROS_ENTREGA.length;
  const faq = document.querySelector('[data-faq-bairros]');
  if (faq) faq.innerHTML = BAIRROS_ENTREGA.map(b => '<span class="tag-bairro">' + b + '</span>').join('');
})();

/* Gera as opcoes do campo de bairro a partir de BAIRROS_ENTREGA.
   Assim a lista sugerida nunca desatualiza em relacao a verificacao. */
(function populaBairros() {
  const dl = document.createElement('datalist');
  dl.id = 'bairrosSugeridos';
  BAIRROS_ENTREGA.forEach(b => {
    const o = document.createElement('option');
    o.value = b;
    dl.appendChild(o);
  });
  document.body.appendChild(dl);
  document.querySelectorAll('input[list="entregaBairros"], input[list="bairrosEntrega"]')
    .forEach(inp => { inp.setAttribute('list', 'bairrosSugeridos'); });
})();

/* --- VERIFICADOR DE ENTREGA (home) ---
   Reutiliza a lista BAIRROS_ENTREGA. Responde a primeira duvida do
   cliente antes de ele montar o pedido. */
(function initVerificadorEntrega() {
  const input = document.getElementById('entregaBairroInput');
  const botao = document.getElementById('entregaVerificar');
  const saida = document.getElementById('entregaResultado');
  if (!input || !botao || !saida || typeof bairroEntregue !== 'function') return;

  function responder() {
    const digitado = textoBairro(input.value);
    saida.hidden = false;

    if (!digitado) {
      saida.className = 'entrega-resultado nao';
      saida.innerHTML = '<i class="fas fa-question-circle"></i> Digite seu <strong>bairro</strong> ou seu <strong>CEP</strong> para eu verificar.';
      return;
    }

    // digitou CEP: descobre o bairro antes de responder
    if (pareceCep(digitado)) {
      saida.className = 'entrega-resultado nao';
      saida.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Consultando seu CEP...';
      buscarBairroPorCep(digitado).then(bairro => {
        const fmt = soDigitos(digitado).replace(/^(\d{5})(\d{3})$/, '$1-$2');
        if (!bairro) {
          saida.className = 'entrega-resultado nao';
          saida.innerHTML = '<i class="fas fa-question-circle"></i> Não consegui identificar o bairro desse CEP (' + fmt +
            '). <strong>Digite o nome do bairro</strong> ou pergunte no WhatsApp (31) 97171-6274.';
          return;
        }
        if (bairroEntregue(bairro)) {
          saida.className = 'entrega-resultado sim';
          saida.innerHTML = '<i class="fas fa-check-circle"></i> Seu CEP ' + fmt +
            ' é do bairro <strong>' + bairro + '</strong> — entregamos em até 30 minutos.' +
            (bairro.toLowerCase() === 'santa terezinha' ? ' Frete grátis.' : '');
        } else {
          saida.className = 'entrega-resultado nao';
          saida.innerHTML = '<i class="fas fa-map-marker-alt"></i> Seu CEP ' + fmt +
            ' é do bairro <strong>' + bairro + '</strong>, que está fora do raio de 4 km. ' +
            'Pergunte no WhatsApp se ainda é possível entregar — ou <strong>retire na loja</strong>, sem custo.';
        }
      });
      return;
    }

    // digitou bairro: confere direto
    const ok = bairroEntregue(digitado);
    const nome = digitado.charAt(0).toUpperCase() + digitado.slice(1);
    if (ok) {
      saida.className = 'entrega-resultado sim';
      saida.innerHTML = '<i class="fas fa-check-circle"></i> Entregamos em <strong>' + nome +
        '</strong> em até 30 minutos.' + (digitado.toLowerCase() === 'santa terezinha' ? ' Frete grátis.' : '');
    } else {
      saida.className = 'entrega-resultado nao';
      saida.innerHTML = '<i class="fas fa-map-marker-alt"></i> ' + nome +
        ' está fora do raio de 4 km. <strong>Se preferir, digite seu CEP</strong> — eu confiro. ' +
        'Ou retire na loja, sem custo: Rua Julita Nogueira Soares, 610.';
    }
  }

  botao.addEventListener('click', responder);
  input.addEventListener('keydown', (e) => { if (e.key === 'Enter') { e.preventDefault(); responder(); } });
  input.addEventListener('input', () => { saida.hidden = true; });
})();
