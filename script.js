const createToastContainer = () => {
  if (!document.querySelector('.toast-container')) {
    const container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  return document.querySelector('.toast-container');
};

const showToast = (message, type = 'success') => {
  const container = createToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? 'check-circle' : 'info-circle';
  toast.innerHTML = `<i class="fas fa-${icon}"></i><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.animation = 'slideDownFade 0.4s ease-in forwards';
    toast.addEventListener('animationend', () => toast.remove());
  }, 3000);
};

const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navBar = document.querySelector('.nav-bar');
const menuOverlay = document.querySelector('.menu-overlay');
const body = document.body;

if (mobileMenuBtn && navBar && menuOverlay) {
  const toggleMenu = () => {
    navBar.classList.toggle('active');
    menuOverlay.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (navBar.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
      body.style.overflow = 'hidden';
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
      body.style.overflow = '';
    }
  };
  mobileMenuBtn.addEventListener('click', toggleMenu);
  menuOverlay.addEventListener('click', toggleMenu);
  navBar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (navBar.classList.contains('active')) toggleMenu();
    });
  });
}

const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

let buscaInicial = '';

const filtrarCardsPorBusca = (termo) => {
  let foundCount = 0;
  document.querySelectorAll('.product-card').forEach(card => {
    const nameEl = card.querySelector('.product-name');
    const productName = nameEl ? nameEl.textContent.toLowerCase() : '';
    const nomeSku = (card.getAttribute('data-sku') || '').toLowerCase().replaceAll('_', ' ');
    const corresponde = productName.includes(termo) || nomeSku.includes(termo);
    if (corresponde) {
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
  const searchTerm = searchInput.value.toLowerCase().trim();
  if (!searchTerm) {
    document.querySelectorAll('.product-card').forEach(card => card.style.display = '');
    if (/produtos\.html$/.test(location.pathname)) history.replaceState({}, '', 'produtos.html');
    return;
  }
  const naPaginaProdutos = /produtos\.html$/.test(location.pathname);
  const temGrid = document.querySelector('.product-grid');
  if (!naPaginaProdutos || !temGrid) {
    window.location.href = 'produtos.html?busca=' + encodeURIComponent(searchInput.value.trim());
    return;
  }
  document.querySelectorAll('.products-filter-btn').forEach(b => b.classList.remove('active'));
  const btnTodos = document.querySelector('.products-filter-btn[data-filter-category="all"]');
  if (btnTodos) btnTodos.classList.add('active');
  const foundCount = filtrarCardsPorBusca(searchTerm);
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

const applyCategoryFilter = (category) => {
  document.querySelectorAll('.product-card').forEach(card => {
    const cardCategories = (card.getAttribute('data-category') || '').toLowerCase();
    card.style.display = (category === 'all' || cardCategories.includes(category)) ? '' : 'none';
  });
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
      applyCategoryFilter(category);
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
      applyCategoryFilter(initialCategory);
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

const updateCartBadge = () => {
  const badges = document.querySelectorAll('[data-cart-count]');
  if (!badges.length) return;
  badges.forEach(b => b.textContent = loadCart().length);
};
const updateFavoritesBadge = () => {
  const badges = document.querySelectorAll('[data-favorites-count]');
  if (!badges.length) return;
  badges.forEach(b => b.textContent = loadFavorites().length);
};

const addProductToCart = (product) => {
  const cart = loadCart();
  cart.push(product);
  saveCart(cart);
  updateCartBadge();
};

document.querySelectorAll('.product-card .btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    if (btn.textContent.includes('Adicionar')) {
      e.preventDefault();
      const card = btn.closest('.product-card');
      const nameEl = card.querySelector('.product-name');
      const priceEl = card.querySelector('.product-price');
      const productName = nameEl ? nameEl.textContent.trim() : 'Produto';
      const productPrice = priceEl ? priceEl.textContent.trim() : '';
      addProductToCart({ name: productName, price: productPrice });
      showToast(`${productName} adicionado ao carrinho!`, 'success');
      const originalText = btn.textContent;
      const originalBackground = btn.style.background;
      btn.textContent = 'Adicionado!';
      btn.style.background = 'var(--success-green)';
      setTimeout(() => { btn.textContent = originalText; btn.style.background = originalBackground; }, 2000);
    }
  });
});

updateCartBadge();
updateFavoritesBadge();

const toggleFavoriteForProduct = (product) => {
  const favorites = loadFavorites();
  const index = favorites.findIndex(f => f.name === product.name);
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

const parsePriceToNumber = (priceText) => {
  if (!priceText) return 0;
  const digits = priceText.replace(/[^\d,]/g, '').replace('.', '').replace(',', '.');
  const value = parseFloat(digits);
  return isNaN(value) ? 0 : value;
};
const formatNumberToPrice = (value) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

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
    if (priceEl && typeof data.preco === 'number') priceEl.textContent = formatNumberToPrice(data.preco);
    if (oldPriceEl && typeof data.precoAntigo === 'number') oldPriceEl.textContent = formatNumberToPrice(data.precoAntigo);
    if (installmentEl && data.parcelasQuantidade && data.parcelasValor) {
      installmentEl.textContent = `ou ${data.parcelasQuantidade}x de ${formatNumberToPrice(data.parcelasValor)}`;
    }
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
    // badge de tarja
    if (data.tarja === 'tarja_vermelha_c1') {
      const badge = card.querySelector('.product-badge');
      if (badge) { badge.textContent = 'CONTROLADO'; badge.style.display = 'inline-flex'; badge.style.background = '#dc2626'; }
    } else if (data.tarja === 'tarja_vermelha') {
      const badge = card.querySelector('.product-badge');
      if (badge) { badge.textContent = 'COM RECEITA'; badge.style.display = 'inline-flex'; badge.style.background = '#ea580c'; }
    }
  });

  document.querySelectorAll('.product-card').forEach((card) => {
    const sku = (card.getAttribute('data-sku') || '').trim();
    const data = produtosPorSku[sku];
    const priceWrap = card.querySelector('.product-price-wrapper');
    const btn = card.querySelector('.btn');
    const nameEl = card.querySelector('.product-name');
    const nome = nameEl ? nameEl.textContent.trim() : 'produto';

    if (data && typeof data.preco === 'number') {
      if (priceWrap) priceWrap.style.display = 'none';
    } else {
      if (priceWrap) priceWrap.style.display = 'none';
    }
    if (btn) {
      btn.textContent = 'Consulte pelo WhatsApp';
      btn.href = 'https://wa.me/5531971716274?text=' + encodeURIComponent(msgConsultaProduto(nome, sku, 1));
      btn.target = '_blank';
      btn.rel = 'noopener';
    }
  });
};

/* --- GERA CARDS DINAMICOS DO ESTOQUE --- */
const renderCatalogoDinamico = () => {
  const grid = document.querySelector('[data-catalogo-grid]');
  if (!grid || !produtosData.length) return;
  grid.innerHTML = produtosData.map((p) => {
    const badgeHtml = p.tarja === 'tarja_vermelha_c1'
      ? '<span class="product-badge" style="display:inline-flex;background:#dc2626;color:#fff;font-size:0.65rem;padding:3px 8px;border-radius:999px;font-weight:700;">CONTROLADO</span>'
      : p.tarja === 'tarja_vermelha'
      ? '<span class="product-badge" style="display:inline-flex;background:#ea580c;color:#fff;font-size:0.65rem;padding:3px 8px;border-radius:999px;font-weight:700;">COM RECEITA</span>'
      : '';
    return [
      '<div class="product-card" data-sku="' + p.sku + '" data-category="' + (p.categoria || '') + '">',
      '  <div class="product-image-placeholder"><img src="' + p.imagem + '" alt="' + p.nome + '" loading="lazy"></div>',
      '  ' + badgeHtml,
      '  <h3 class="product-name">' + p.nome + '</h3>',
      '  <span class="product-price" style="font-size:0.8rem;color:#666">Consulte pelo WhatsApp</span>',
      '  <a href="https://wa.me/5531971716274?text=' + encodeURIComponent(msgConsultaProduto(p.nome, p.sku, 1)) + '" target="_blank" rel="noopener" class="btn">Consulte pelo WhatsApp</a>',
      '</div>'
    ].join('\n');
  }).join('');
};

const iniciarBuscaInicial = () => {
  if (!buscaInicial) return;
  if (searchInput) searchInput.value = buscaInicial;
  const achados = filtrarCardsPorBusca(buscaInicial.toLowerCase());
  if (achados > 0) showToast(`${achados} resultado(s) para "${buscaInicial}".`, 'success');
  else showToast('Nenhum produto encontrado. Fale no WhatsApp que buscamos pra você!', 'info');
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => { renderCatalogoDinamico(); applyProductDataToCards(); initCardClick(); iniciarBuscaInicial(); reapplyCategoryFilter(); });
} else {
  renderCatalogoDinamico();
  applyProductDataToCards();
  initCardClick();
  iniciarBuscaInicial();
  reapplyCategoryFilter();
}

function reapplyCategoryFilter() {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('categoria');
  if (cat) {
    const btn = Array.from(document.querySelectorAll('.products-filter-btn')).find(b => b.getAttribute('data-filter-category') === cat);
    if (btn) {
      document.querySelectorAll('.products-filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyCategoryFilter(cat);
    }
  }
}

const cartPageContainer = document.querySelector('.cart-page');
if (cartPageContainer) {
  const cartItemsContainer = document.getElementById('cartItemsContainer');
  const cartEmptyMessage = document.getElementById('cartEmptyMessage');
  const cartSummary = document.getElementById('cartSummary');
  const cartTotalValue = document.getElementById('cartTotalValue');
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
      if (!grouped[item.name]) grouped[item.name] = { name: item.name, price: item.price, quantity: 0 };
      grouped[item.name].quantity += 1;
    });
    let total = 0;
    Object.values(grouped).forEach(item => {
      const unitValue = parsePriceToNumber(item.price);
      const subtotal = unitValue * item.quantity;
      total += subtotal;
      const row = document.createElement('div');
      row.style.cssText = 'display:flex;justify-content:space-between;align-items:center;padding:10px 0;border-bottom:1px solid var(--neutral-medium);';
      row.innerHTML = `<div style="flex:1"><strong>${item.name}</strong><br><span style="font-size:0.9rem;color:var(--text-secondary)">Qtd: ${item.quantity} | Unit: ${item.price}</span></div><div style="margin-left:16px"><strong>${formatNumberToPrice(subtotal)}</strong></div>`;
      cartItemsContainer.appendChild(row);
    });
    if (cartSummary) cartSummary.style.display = 'block';
    if (cartTotalValue) cartTotalValue.textContent = formatNumberToPrice(total);
  };

  renderCart();

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
      if (!nome || !telefone || !endereco || !bairro || !pagamento) { showToast('Preencha todos os campos obrigatórios.', 'info'); return; }
      const grouped = {};
      cart.forEach(item => {
        if (!grouped[item.name]) grouped[item.name] = { name: item.name, price: item.price, quantity: 0 };
        grouped[item.name].quantity += 1;
      });
      let total = 0;
      const linhas = Object.values(grouped).map(item => {
        total += parsePriceToNumber(item.price) * item.quantity;
        return `${item.name} | Qtd: ${item.quantity} | Unit: ${item.price}`;
      });
      const msg = msgPedido({
        itens: linhas.map((l, k) => `${k + 1}. ${l}`).join('\n'),
        total: formatNumberToPrice(total),
        nome, telefone, endereco, bairro, referencia, pagamento, observacoes
      });
      enviarWhatsApp(msg);
      showToast('Pedido aberto no WhatsApp!', 'success');
      saveCart([]); updateCartBadge(); renderCart(); checkoutForm.reset();
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

/* --- ENVIO / CEP NO TOPO --- */
const cepBtn = document.querySelector('[data-cep]');
if (cepBtn) {
  const cepTexto = cepBtn.querySelector('[data-cep-text]');
  const formatar = (v) => v.slice(0, 5) + '-' + v.slice(5);
  const ehDaRegiao = (nums) => nums.startsWith('30') || nums.startsWith('31');
  const mostrar = (v, ok) => { cepTexto.textContent = ok ? 'Entregando em ' + v : 'CEP ' + v + ' (consulte)'; };
  const salvo = localStorage.getItem('droga_g_cep');
  if (salvo) mostrar(salvo, ehDaRegiao(salvo.replace('-', '')));
  cepBtn.addEventListener('click', () => {
    const entrada = prompt('Informe seu CEP (8 números):', (salvo || '').replace('-', ''));
    if (entrada === null) return;
    const nums = entrada.replace(/\D/g, '');
    if (nums.length !== 8) { showToast('CEP inválido — digite 8 números.', 'info'); return; }
    localStorage.setItem('droga_g_cep', formatar(nums));
    if (ehDaRegiao(nums)) {
      mostrar(formatar(nums), true);
      showToast('Entrega disponível no seu CEP!', 'success');
    } else {
      mostrar(formatar(nums), false);
      showToast('Fora da região padrão — chame no WhatsApp para confirmar a entrega.', 'info');
    }
  });
}

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
  const linhas = [
    'PEDIDO PELO SITE - Droga G',
    'Protocolo: ' + montarProtocolo(),
    'Data: ' + new Date().toLocaleString('pt-BR'),
    '',
    'ITENS (lançar no Dmaster)',
    d.itens,
    '',
    'TOTAL ESTIMADO: ' + d.total + ' (valores finais no Dmaster)',
    '',
    'CLIENTE',
    'Nome: ' + d.nome,
    'Telefone: ' + d.telefone,
    'CEP: ' + cepSalvo(),
    'Endereço: ' + d.endereco,
    'Bairro: ' + d.bairro
  ];
  if (d.referencia) linhas.push('Referência: ' + d.referencia);
  linhas.push('Pagamento: ' + d.pagamento);
  if (d.observacoes) linhas.push('Obs: ' + d.observacoes);
  return linhas.join('\n');
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
    // aviso de tarja
    let tarjaAviso = '';
    if (data.tarja === 'tarja_vermelha_c1') {
      tarjaAviso = '<div class="produto-nota" style="background:#e6f0ff;border-color:#99bbff;color:#004080;"><i class="fas fa-prescription"></i> <strong>CONTROLADO (C1)</strong> — Venda sob prescrição médica. Retire na loja apresentando a receita (2ª via retida).</div>';
    } else if (data.tarja === 'tarja_vermelha') {
      tarjaAviso = '<div class="produto-nota" style="background:#fff7ed;border-color:#fed7aa;color:#9a3412;"><i class="fas fa-prescription"></i> Venda sob prescrição médica — retire na loja com receita.</div>';
    }
    produtoDetalhe.innerHTML = [
      '<div class="produto-foto">',
      '  <img src="' + data.imagem + '" alt="' + data.nome + '" onerror="this.style.display=\'none\'">',
      '</div>',
      '<div class="produto-info">',
      '  <span class="produto-categoria"><i class="fas fa-tag"></i> ' + cat + '</span>',
      '  <h1>' + data.nome + '</h1>',
      (typeof data.preco === 'number' ? (
        '<div class="produto-preco-bloco">' +
        '  <span class="produto-preco">' + formatNumberToPrice(data.preco) + '</span>' +
        (typeof data.precoAntigo === 'number' ? '  <span class="produto-preco-antigo">' + formatNumberToPrice(data.precoAntigo) + '</span>' : '') +
        '</div>'
      ) : ''),
      (typeof data.estoque === 'number' && data.estoque > 0
        ? '<div style="font-size:0.85rem;color:#16a34a;margin-bottom:14px;"><i class="fas fa-check-circle"></i> ' + data.estoque + ' unidade(s) em estoque</div>'
        : ''),
      '  <ul class="produto-beneficios">',
      '    <li><i class="fas fa-truck-fast"></i> Entrega em até 30 minutos</li>',
      '    <li><i class="fas fa-shield-alt"></i> Produto original, com nota fiscal</li>',
      '    <li><i class="fas fa-store"></i> Retire em qualquer uma das nossas lojas</li>',
      '  </ul>',
      (tarjaAviso || '  <div class="produto-nota"><i class="fas fa-circle-info"></i> Consulte disponibilidade e condição especial pelo WhatsApp.</div>'),
      '  <div class="produto-acoes">',
      '    <a href="' + zaps + '" target="_blank" rel="noopener" class="btn btn-whatsapp"><i class="fab fa-whatsapp"></i> Consulte pelo WhatsApp</a>',
      '    <button class="btn btn-outline" data-fav-produto="' + data.sku + '"><i class="far fa-heart"></i> Favoritar</button>',
      '  </div>',
      '  <div class="produto-lojas"><strong>Central:</strong> (31) 3476-2473 &nbsp;|&nbsp; <strong>WhatsApp:</strong> (31) 97171-6274</div>',
      '</div>'
    ].join('\n');
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
          '  <a href="https://wa.me/5531971716274?text=' + encodeURIComponent(msgConsultaProduto(p.nome, p.sku, 1)) + '" target="_blank" rel="noopener" class="btn">Consulte pelo WhatsApp</a>',
          '</div>'
        ].join('\n')).join('') + '</div>';
      produtoDetalhe.parentNode.appendChild(grid);
      grid.querySelectorAll('.product-card').forEach(c => {
        c.style.cursor = 'pointer';
        c.addEventListener('click', (e) => {
          if (e.target.closest('.btn')) return;
          window.location.href = 'produto.html?sku=' + encodeURIComponent(c.getAttribute('data-sku'));
        });
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

/* --- BENEFÍCIOS: DESTAQUE PROGRESSIVO --- */
(function initBeneficiosHighlight() {
  const items = document.querySelectorAll('.beneficios-viewport .beneficio-item');
  if (!items.length) return;
  let atual = 0;
  setInterval(() => {
    items[atual].classList.remove('ativo');
    atual = (atual + 1) % items.length;
    items[atual].classList.add('ativo');
  }, 2500);
})();
