// Consolidated script for site interactions
document.addEventListener('DOMContentLoaded', () => {
  // Element refs
  const hamburger = document.getElementById('hamburger');
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('overlay');
  const closeSidebarBtn = document.getElementById('closeSidebar');
  const themeToggle = document.getElementById('themeToggle');
  const sidebarThemeBtn = document.getElementById('sidebarTheme');
  const cartBtn = document.getElementById('cartBtn');
  const cartSidebar = document.getElementById('cartSidebar');
  const closeCart = document.getElementById('closeCart');
  const cartItemsList = document.getElementById('cartItems');
  const cartTotal = document.getElementById('cartTotal');

  // Theme
  function applyTheme(theme) {
    if (theme === 'light') {
      document.body.classList.add('light-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><circle cx="12" cy="12" r="4"></circle><path d="M12 2v2"></path><path d="M12 20v2"></path><path d="M4.93 4.93l1.41 1.41"></path><path d="M17.66 17.66l1.41 1.41"></path><path d="M2 12h2"></path><path d="M20 12h2"></path><path d="M4.93 19.07l1.41-1.41"></path><path d="M17.66 6.34l1.41-1.41"></path></svg>';
      }
      if (sidebarThemeBtn) sidebarThemeBtn.innerHTML = '<i class="ti ti-sun"></i> Toggle Theme';
    } else {
      document.body.classList.remove('light-theme');
      if (themeToggle) {
        themeToggle.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
      }
      if (sidebarThemeBtn) sidebarThemeBtn.innerHTML = '<i class="ti ti-moon"></i> Toggle Theme';
    }
  }
  const savedTheme = localStorage.getItem('theme');
  applyTheme(savedTheme || 'dark');
  themeToggle?.addEventListener('click', () => {
    const isLight = document.body.classList.toggle('light-theme');
    const newTheme = isLight ? 'light' : 'dark';
    localStorage.setItem('theme', newTheme);
    applyTheme(newTheme);
  });
  sidebarThemeBtn?.addEventListener('click', () => themeToggle?.click());

  // Sidebar
  hamburger?.addEventListener('click', () => { sidebar?.classList.add('active'); overlay?.classList.add('active'); });
  closeSidebarBtn?.addEventListener('click', () => { sidebar?.classList.remove('active'); overlay?.classList.remove('active'); });
  overlay?.addEventListener('click', () => { sidebar?.classList.remove('active'); cartSidebar?.classList.remove('open'); overlay?.classList.remove('active'); });

  // Cart
  let cart = JSON.parse(localStorage.getItem('cart') || '[]');
  function updateCartUI() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = '';
    let total = 0;
    cart.forEach((item, idx) => {
      total += (item.price || 0) * (item.quantity || 1);
      const li = document.createElement('li');
      li.innerHTML = `<span>${item.name} (${item.quantity})</span><div class="cart-controls"><button class="decrease" data-i="${idx}">-</button><button class="increase" data-i="${idx}">+</button><button class="remove" data-i="${idx}">x</button></div>`;
      cartItemsList.appendChild(li);
    });
    cartTotal && (cartTotal.textContent = total.toFixed(2));
    localStorage.setItem('cart', JSON.stringify(cart));
  }
  function saveCart() { localStorage.setItem('cart', JSON.stringify(cart)); updateCartUI(); }
  cartBtn?.addEventListener('click', () => { cartSidebar?.classList.add('open'); overlay?.classList.add('active'); });
  closeCart?.addEventListener('click', () => { cartSidebar?.classList.remove('open'); overlay?.classList.remove('active'); });
  cartItemsList?.addEventListener('click', (e) => {
    const idx = e.target?.getAttribute('data-i');
    if (idx == null) return;
    if (e.target.classList.contains('decrease')) { cart[idx].quantity = Math.max(1, cart[idx].quantity - 1); saveCart(); }
    if (e.target.classList.contains('increase')) { cart[idx].quantity = (cart[idx].quantity || 0) + 1; saveCart(); }
    if (e.target.classList.contains('remove')) { cart.splice(idx,1); saveCart(); }
  });
  updateCartUI();

  // Simple search toggle
  const searchToggle = document.getElementById('searchToggle');
  const searchDropdown = document.getElementById('searchDropdown');
  searchToggle?.addEventListener('click', (e) => { e.stopPropagation(); if (!searchDropdown) return; searchDropdown.style.display = searchDropdown.style.display === 'flex' ? 'none' : 'flex'; });
  document.addEventListener('click', (e) => { if (searchDropdown && !searchDropdown.contains(e.target) && searchToggle && !searchToggle.contains(e.target)) searchDropdown.style.display = 'none'; });

  // Categories -> Products
  const categoriesData = {
    iphones: [ { name: 'iPhone 15', price: '$999', image: 'images/iphone2.png' }, { name: 'iPhone 15 Pro', price: '$1299', image: 'images/iphone2.png' } ],
    samsung: [ { name: 'Galaxy S23', price: '$899', image: 'images/samsung.png' } ],
    ipads: [ { name: 'iPad Pro', price: '$1099', image: 'images/ipad.png' } ],
    smartwatches: [ { name: 'Apple Watch Series 9', price: '$399', image: 'images/smartwatch.png' } ],
    gaming: [ { name: 'PS5', price: '$499', image: 'images/console-2-preview.png' } ],
    laptops: [ { name: 'MacBook Pro', price: '$1299', image: 'images/macbook.jpeg' } ]
  };

  function showProductsForCategory(catKey) {
    const products = categoriesData[catKey] || [];
    const titleEl = document.getElementById('categoryTitle');
    const productsPage = document.getElementById('productsPage');
    const categoriesPage = document.querySelector('.categories-page');
    const grid = document.getElementById('productGrid');
    if (!grid || !productsPage || !categoriesPage) return;
    titleEl && (titleEl.textContent = (catKey || '').toUpperCase());
    grid.innerHTML = '';
    products.forEach((p) => {
      const card = document.createElement('div');
      card.className = 'product-card';
      card.innerHTML = `<div class="img-box"><img src="${p.image}" alt="${p.name}"></div><h3>${p.name}</h3><p class="price">${p.price}</p><button class="add-to-cart">Add to cart</button>`;
      grid.appendChild(card);
    });
    // add-to-cart wiring
    grid.querySelectorAll('.add-to-cart').forEach((btn, i) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const p = products[i];
        const priceNum = parseFloat(String(p.price).replace(/[^0-9.-]+/g, '')) || 0;
        const existing = cart.find(c => c.name === p.name);
        if (existing) existing.quantity++; else cart.push({ name: p.name, price: priceNum, quantity: 1 });
        saveCart();
      });
    });
    categoriesPage.classList.add('hidden');
    productsPage.classList.remove('hidden');
  }

  document.querySelectorAll('.category-card').forEach(card => card.addEventListener('click', () => showProductsForCategory(card.dataset.category)));
  document.getElementById('backCategories')?.addEventListener('click', () => { document.querySelector('.categories-page')?.classList.remove('hidden'); document.getElementById('productsPage')?.classList.add('hidden'); });
});
