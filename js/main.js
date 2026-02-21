/**
 * Bhebhi RaMwari — Main JavaScript
 * Luxury e-commerce demo interactions
 */

document.addEventListener('DOMContentLoaded', () => {

  // ─── Cart System ───────────────────────────────────────────────
  let cart = JSON.parse(localStorage.getItem('bhebhi-cart')) || [];

  function saveCart() {
    localStorage.setItem('bhebhi-cart', JSON.stringify(cart));
    updateCartBadge();
    renderCart();
  }

  function addToCart(product) {
    const existing = cart.find(item => item.id === product.id);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }
    saveCart();
  }

  function removeFromCart(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
  }

  function updateQuantity(id, delta) {
    const item = cart.find(i => i.id === id);
    if (item) {
      item.quantity = Math.max(1, item.quantity + delta);
      saveCart();
    }
  }

  function getCartTotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getCartCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function updateCartBadge() {
    const badges = document.querySelectorAll('.cart-count');
    const count = getCartCount();
    badges.forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
  }

  function renderCart() {
    const cartItems = document.querySelector('.cart-items');
    const cartTotal = document.querySelector('.cart-total-amount');
    const cartEmpty = document.querySelector('.cart-empty');
    const cartFooter = document.querySelector('.cart-footer');
    if (!cartItems) return;

    if (cart.length === 0) {
      cartItems.innerHTML = '';
      if (cartEmpty) cartEmpty.style.display = 'block';
      if (cartFooter) cartFooter.style.display = 'none';
      return;
    }

    if (cartEmpty) cartEmpty.style.display = 'none';
    if (cartFooter) cartFooter.style.display = 'block';

    cartItems.innerHTML = cart.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.name}" class="cart-item-image">
        <div class="cart-item-details">
          <h4 class="cart-item-name">${item.name}</h4>
          <p class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</p>
          <div class="cart-item-quantity">
            <button class="qty-btn qty-minus" data-id="${item.id}">−</button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn qty-plus" data-id="${item.id}">+</button>
          </div>
        </div>
        <button class="cart-item-remove" data-id="${item.id}">✕</button>
      </div>
    `).join('');

    if (cartTotal) cartTotal.textContent = `$${getCartTotal().toFixed(2)}`;
  }

  // Cart item event delegation
  document.addEventListener('click', (e) => {
    if (e.target.classList.contains('qty-minus')) {
      updateQuantity(e.target.dataset.id, -1);
    } else if (e.target.classList.contains('qty-plus')) {
      updateQuantity(e.target.dataset.id, 1);
    } else if (e.target.classList.contains('cart-item-remove')) {
      removeFromCart(e.target.dataset.id);
    }
  });

  // ─── Cart Panel Toggle ─────────────────────────────────────────
  const cartPanel = document.querySelector('.cart-panel');
  const cartOverlay = document.querySelector('.cart-overlay');
  const cartToggles = document.querySelectorAll('.cart-toggle');
  const cartClose = document.querySelector('.cart-close');

  function openCart() {
    if (cartPanel) cartPanel.classList.add('active');
    if (cartOverlay) cartOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeCart() {
    if (cartPanel) cartPanel.classList.remove('active');
    if (cartOverlay) cartOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  cartToggles.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openCart();
  }));
  if (cartClose) cartClose.addEventListener('click', closeCart);
  if (cartOverlay) cartOverlay.addEventListener('click', closeCart);

  // ─── Mobile Menu ───────────────────────────────────────────────
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileMenu = document.querySelector('.mobile-menu');
  const mobileMenuClose = document.querySelector('.mobile-menu-close');
  const mobileOverlay = document.querySelector('.mobile-overlay');

  function openMobileMenu() {
    if (mobileMenu) mobileMenu.classList.add('active');
    if (mobileOverlay) mobileOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileMenu() {
    if (mobileMenu) mobileMenu.classList.remove('active');
    if (mobileOverlay) mobileOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (menuToggle) menuToggle.addEventListener('click', openMobileMenu);
  if (mobileMenuClose) mobileMenuClose.addEventListener('click', closeMobileMenu);
  if (mobileOverlay) mobileOverlay.addEventListener('click', closeMobileMenu);

  // Close mobile menu on link click
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });
  }

  // ─── Add to Cart Buttons ──────────────────────────────────────
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart');
    if (!btn) return;
    e.preventDefault();

    const product = {
      id: btn.dataset.id,
      name: btn.dataset.name,
      price: parseFloat(btn.dataset.price),
      image: btn.dataset.image
    };

    addToCart(product);

    // Button feedback
    const originalText = btn.textContent;
    btn.textContent = 'Added!';
    btn.classList.add('added');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('added');
    }, 1500);

    // Badge bounce animation
    const badge = document.querySelector('.cart-count');
    if (badge) {
      badge.classList.add('bounce');
      setTimeout(() => badge.classList.remove('bounce'), 400);
    }

    openCart();
  });

  // ─── Product Filtering (Shop Page) ────────────────────────────
  const filterTabs = document.querySelectorAll('.filter-tab');
  const productCards = document.querySelectorAll('.product-card[data-category]');

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab
      filterTabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const category = tab.dataset.filter;

      productCards.forEach(card => {
        if (category === 'all' || card.dataset.category === category) {
          card.style.opacity = '0';
          card.style.display = '';
          requestAnimationFrame(() => {
            card.style.transition = 'opacity 0.3s ease';
            card.style.opacity = '1';
          });
        } else {
          card.style.opacity = '0';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // ─── Sort Functionality ────────────────────────────────────────
  const sortSelect = document.querySelector('.sort-select');
  const productGrid = document.querySelector('.product-grid');

  if (sortSelect && productGrid) {
    sortSelect.addEventListener('change', () => {
      const cards = Array.from(productGrid.querySelectorAll('.product-card'));
      const sortBy = sortSelect.value;

      cards.sort((a, b) => {
        const priceA = parseFloat(a.dataset.price);
        const priceB = parseFloat(b.dataset.price);
        switch (sortBy) {
          case 'price-low': return priceA - priceB;
          case 'price-high': return priceB - priceA;
          case 'newest': return (b.dataset.new === 'true' ? 1 : 0) - (a.dataset.new === 'true' ? 1 : 0);
          default: return 0;
        }
      });

      cards.forEach(card => productGrid.appendChild(card));
    });
  }

  // ─── Quick View Modal ──────────────────────────────────────────
  const quickViewModal = document.querySelector('.quick-view-modal');
  const quickViewOverlay = document.querySelector('.quick-view-overlay');

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.quick-view-btn');
    if (!btn) return;
    e.preventDefault();

    const card = btn.closest('.product-card');
    if (!card || !quickViewModal) return;

    const name = card.querySelector('.product-name')?.textContent || '';
    const price = card.querySelector('.product-price')?.textContent || '';
    const image = card.querySelector('.product-image img')?.src || '';
    const category = card.dataset.category || '';

    quickViewModal.querySelector('.qv-image').src = image;
    quickViewModal.querySelector('.qv-name').textContent = name;
    quickViewModal.querySelector('.qv-price').textContent = price;
    quickViewModal.querySelector('.qv-category').textContent = category.charAt(0).toUpperCase() + category.slice(1);

    // Copy add-to-cart data
    const qvAddBtn = quickViewModal.querySelector('.add-to-cart');
    const cardAddBtn = card.querySelector('.add-to-cart');
    if (qvAddBtn && cardAddBtn) {
      qvAddBtn.dataset.id = cardAddBtn.dataset.id;
      qvAddBtn.dataset.name = cardAddBtn.dataset.name;
      qvAddBtn.dataset.price = cardAddBtn.dataset.price;
      qvAddBtn.dataset.image = cardAddBtn.dataset.image;
    }

    quickViewModal.classList.add('active');
    if (quickViewOverlay) quickViewOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  });

  function closeQuickView() {
    if (quickViewModal) quickViewModal.classList.remove('active');
    if (quickViewOverlay) quickViewOverlay.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelector('.qv-close')?.addEventListener('click', closeQuickView);
  quickViewOverlay?.addEventListener('click', closeQuickView);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeQuickView();
      closeCart();
      closeMobileMenu();
    }
  });

  // ─── Search Toggle ─────────────────────────────────────────────
  const searchToggle = document.querySelector('.search-toggle');
  const searchOverlay = document.querySelector('.search-overlay');
  const searchClose = document.querySelector('.search-close');
  const searchInput = document.querySelector('.search-input');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', (e) => {
      e.preventDefault();
      searchOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
      setTimeout(() => searchInput?.focus(), 300);
    });

    searchClose?.addEventListener('click', () => {
      searchOverlay.classList.remove('active');
      document.body.style.overflow = '';
    });

    searchInput?.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const results = searchOverlay.querySelector('.search-results');
        if (results) results.innerHTML = '<p class="search-no-results">No results found. Try browsing our categories.</p>';
      }
    });
  }

  // ─── Newsletter Form ──────────────────────────────────────────
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const message = newsletterForm.querySelector('.newsletter-message');

      if (input && input.value && input.value.includes('@')) {
        if (message) {
          message.textContent = 'Thank you for subscribing!';
          message.style.color = '#b76e79';
          message.style.display = 'block';
        }
        input.value = '';
      } else {
        if (message) {
          message.textContent = 'Please enter a valid email address.';
          message.style.color = '#ff6b6b';
          message.style.display = 'block';
        }
      }
    });
  }

  // ─── Navbar Scroll Effect ─────────────────────────────────────
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }, { passive: true });
  }

  // ─── Scroll Reveal Animation ──────────────────────────────────
  const revealElements = document.querySelectorAll('.reveal');
  if (revealElements.length > 0 && 'IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(el => observer.observe(el));
  }

  // ─── Dropdown Menu ─────────────────────────────────────────────
  const dropdownTriggers = document.querySelectorAll('.nav-dropdown-trigger');
  dropdownTriggers.forEach(trigger => {
    const dropdown = trigger.querySelector('.nav-dropdown');

    trigger.addEventListener('mouseenter', () => {
      if (dropdown) dropdown.classList.add('active');
    });

    trigger.addEventListener('mouseleave', () => {
      if (dropdown) dropdown.classList.remove('active');
    });
  });

  // Close dropdowns on outside click
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.nav-dropdown-trigger')) {
      document.querySelectorAll('.nav-dropdown').forEach(d => d.classList.remove('active'));
    }
  });

  // ─── Initialize ────────────────────────────────────────────────
  updateCartBadge();
  renderCart();

  // Add reveal class to animatable elements
  document.querySelectorAll('.category-card, .product-card, .brand-story, .newsletter-section').forEach(el => {
    el.classList.add('reveal');
  });

  // Re-run observer for dynamically added reveal elements
  if ('IntersectionObserver' in window) {
    const lateObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          lateObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    document.querySelectorAll('.reveal:not(.revealed)').forEach(el => lateObserver.observe(el));
  }
});
