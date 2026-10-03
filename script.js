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

const performSearch = () => {
  if (!searchInput) return;
  const searchTerm = searchInput.value.toLowerCase().trim();
  const productCards = document.querySelectorAll('.product-card');
  let foundCount = 0;
  if (!searchTerm) {
    productCards.forEach(card => card.style.display = '');
    return;
  }
  productCards.forEach(card => {
    const nameEl = card.querySelector('.product-name');
    const productName = nameEl ? nameEl.textContent.toLowerCase() : '';
    if (productName.includes(searchTerm)) {
      card.style.display = '';
      card.classList.add('animate-on-scroll');
      foundCount++;
    } else {
      card.style.display = 'none';
    }
  });
  if (foundCount > 0) showToast(`${foundCount} produto(s) encontrado(s)!`, 'success');
  else showToast('Nenhum produto encontrado.', 'info');
};

if (searchBtn && searchInput) {
  searchBtn.addEventListener('click', performSearch);
  searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); performSearch(); }
  });
}

const filterButtons = document.querySelectorAll('.products-filter-btn');
const allProductCards = document.querySelectorAll('.product-card');

const applyCategoryFilter = (category) => {
  allProductCards.forEach(card => {
    const cardCategories = (card.getAttribute('data-category') || '').toLowerCase();
    card.style.display = (category === 'all' || cardCategories.includes(category)) ? '' : 'none';
  });
};

if (filterButtons.length && allProductCards.length) {
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
  favoriteBtn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nameEl = card.querySelector('.product-name');
    const priceEl = card.querySelector('.product-price');
    toggleFavoriteForProduct({
      name: nameEl ? nameEl.textContent.trim() : 'Produto',
      price: priceEl ? priceEl.textContent.trim() : ''
    });
    favoriteBtn.classList.toggle('favorited');
  });
});

document.querySelectorAll('[data-favorites-button]').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const favs = loadFavorites();
    showToast(favs.length ? `Você tem ${favs.length} favorito(s).` : 'Nenhum favorito ainda.', 'info');
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
  });

  document.querySelectorAll('.product-card').forEach((card) => {
    const priceWrap = card.querySelector('.product-price-wrapper');
    if (priceWrap) priceWrap.style.display = 'none';
    const badge = card.querySelector('.product-badge');
    if (badge) badge.style.display = 'none';
    const btn = card.querySelector('.btn');
    if (btn) {
      const nameEl = card.querySelector('.product-name');
      const nome = nameEl ? nameEl.textContent.trim() : 'produto';
      btn.textContent = 'Consulte pelo WhatsApp';
      btn.href = 'https://wa.me/5531971716274?text=' + encodeURIComponent(`Olá! Gostaria de saber o preço de: ${nome}`);
      btn.target = '_blank';
      btn.rel = 'noopener';
    }
  });
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', applyProductDataToCards);
} else {
  applyProductDataToCards();
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
        return `- ${item.name} | Qtd: ${item.quantity} | Unit: ${item.price}`;
      });
      const msg = ['Olá, gostaria de fazer um pedido pelo site da Droga G:', '', 'Produtos:', ...linhas, '', `Total estimado: ${formatNumberToPrice(total)}`, '', 'Dados para entrega:', `Nome: ${nome}`, `Telefone: ${telefone}`, `Endereço: ${endereco}`, `Bairro: ${bairro}`, referencia ? `Referência: ${referencia}` : '', '', `Pagamento: ${pagamento}`, observacoes ? `Obs: ${observacoes}` : ''].filter(Boolean).join('\n');
      window.open(`https://wa.me/5531971716274?text=${encodeURIComponent(msg)}`, '_blank');
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
    showToast('Cadastro realizado!', 'success');
    newsletterForm.reset();
  });
}

const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => { e.preventDefault(); showToast('Mensagem enviada!', 'success'); contactForm.reset(); });
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
    const t = link.textContent.trim();
    if (t.includes('Rastrear')) showToast('Rastreamento em breve.', 'info');
    else if (t.includes('Tele Entrega')) showToast('Frete grátis a partir de R$10 em Santa Terezinha.', 'info');
    else if (t.includes('Blog')) showToast('Blog em construção.', 'info');
    else if (t.includes('Trabalhe')) showToast('Envie currículo pelo formulário de contato.', 'info');
    else showToast('Conteúdo em atualização.', 'info');
  });
});
