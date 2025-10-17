// Replace entire script.js with this file
document.addEventListener("DOMContentLoaded", () => {
  console.log("script.js loaded: DOMContentLoaded");

  // =====================
  // ELEMENT REFERENCES
  // =====================
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeSidebar");
  const themeToggle = document.getElementById("themeToggle");
  const sidebarThemeBtn = document.getElementById("sidebarTheme");
  const cartBtn = document.getElementById("cartBtn");
  const cartSidebar = document.getElementById("cartSidebar");
  const closeCart = document.getElementById("closeCart");
  const cartItemsList = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const cartTotal = document.getElementById("cartTotal");
  const loginBtn = document.getElementById("loginBtn");
  const sidebarLoginBtn = document.getElementById("sidebarLoginBtn");
  const sidebarSignupBtn = document.getElementById("sidebarSignupBtn");
  const loginModal = document.getElementById("loginModal");
  const signupModal = document.getElementById("signupModal");
  const closeLogin = document.getElementById("closeLogin");
  const closeSignup = document.getElementById("closeSignup");
  const submitLogin = document.getElementById("submitLogin");
  const profileIcon = document.getElementById("profileIcon");
  const dropdownLogin = document.getElementById("loginOption");
  const dropdownSignup = document.getElementById("signupOption");
  const dropdownLogout = document.getElementById("logoutOption");
  const searchToggle = document.getElementById("searchToggle");
  const searchDropdown = document.getElementById("searchDropdown");
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const sidebarSearchBtn = document.getElementById("sidebarSearch");
  const sidebarSearchContainer = document.getElementById("sidebarSearchContainer");
  const sidebarSearchInput = document.getElementById("sidebarSearchInput");
  const sidebarSearchGo = document.getElementById("sidebarSearchGo");

  // Helper safe getter
  function $(id) { return document.getElementById(id); }

  // =====================
  // SIDEBAR OPEN/CLOSE
  // =====================
  function openSidebar() {
    sidebar?.classList.add("active");
    overlay?.classList.add("active");
  }
  function closeSidebar() {
    sidebar?.classList.remove("active");
    overlay?.classList.remove("active");
  }
  hamburger?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", () => {
    closeSidebar();
    closeCartSidebar();
  });
  sidebar?.querySelectorAll("a")?.forEach(link => link.addEventListener("click", closeSidebar));

  // =====================
  // THEME TOGGLE
  // =====================
  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      if (themeToggle) themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
      if (sidebarThemeBtn) sidebarThemeBtn.innerHTML = `<i class="fas fa-sun"></i> Toggle Theme`;
    } else {
      document.body.classList.remove("light-theme");
      if (themeToggle) themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
      if (sidebarThemeBtn) sidebarThemeBtn.innerHTML = `<i class="fas fa-moon"></i> Toggle Theme`;
    }
  }
  function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      applyTheme(savedTheme);
    } else {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
      localStorage.setItem("theme", prefersDark ? "dark" : "light");
    }
  }
  themeToggle?.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    const newTheme = isLight ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });
  sidebarThemeBtn?.addEventListener("click", () => {
    const isLight = document.body.classList.toggle("light-theme");
    const newTheme = isLight ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  });
  initTheme();

  // =====================
  // CART FUNCTIONALITY
  // =====================
  let cart = JSON.parse(localStorage.getItem("cart") || "[]");
  function updateCartUI() {
    if (!cartItemsList) return;
    cartItemsList.innerHTML = "";
    let total = 0;
    cart.forEach((item, index) => {
      total += (item.price || 0) * (item.quantity || 1);
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} (${item.quantity})</span>
        <div class="cart-controls">
            <button class="decrease" data-index="${index}"><i class="fas fa-minus"></i></button>
            <button class="increase" data-index="${index}"><i class="fas fa-plus"></i></button>
            <button class="remove" data-index="${index}"><i class="fas fa-trash"></i></button>
        </div>
      `;
      cartItemsList.appendChild(li);
    });
    cartTotal && (cartTotal.textContent = total.toFixed(2));
    cartCount && (cartCount.textContent = cart.length);
    localStorage.setItem("cart", JSON.stringify(cart));
  }
  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  // click on a category card adds a fake item to cart
  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", (e) => {
      // avoid firing when clicking arrows or dots inside the card
      if (e.target.closest(".prev") || e.target.closest(".next") || e.target.closest(".dot")) {
        return;
      }
      const productName = card.querySelector("h3")?.textContent?.trim() || "Category";
      const existingItem = cart.find((p) => p.name === productName);
      if (existingItem) {
        existingItem.quantity++;
      } else {
        cart.push({ name: productName, price: 100, quantity: 1 });
      }
      saveCart();
    });
  });

  cartBtn?.addEventListener("click", () => {
    cartSidebar?.classList.add("open");
    overlay?.classList.add("active");
  });
  function closeCartSidebar() {
    cartSidebar?.classList.remove("open");
    overlay?.classList.remove("active");
  }
  closeCart?.addEventListener("click", closeCartSidebar);
  updateCartUI();

  // =====================
  // LOGIN/SIGNUP MODALS
  // =====================
  function updateLoginUI() {
    const user = localStorage.getItem("username");
    if (user && profileIcon) {
      profileIcon.innerHTML = `<i class="fas fa-user"></i> ${user}`;
      dropdownLogout && (dropdownLogout.style.display = "block");
      dropdownLogin && (dropdownLogin.style.display = "none");
      dropdownSignup && (dropdownSignup.style.display = "none");
    } else if (profileIcon) {
      profileIcon.innerHTML = `<i class="fas fa-user"></i>`;
      dropdownLogout && (dropdownLogout.style.display = "none");
      dropdownLogin && (dropdownLogin.style.display = "block");
      dropdownSignup && (dropdownSignup.style.display = "block");
    }

    if (sidebarLoginBtn) {
      if (user) {
        sidebarLoginBtn.innerHTML = `<i class="fas fa-user"></i> Hi, ${user}`;
        sidebarLoginBtn.disabled = true;
        if (!document.getElementById("sidebarLogoutBtn")) {
          const logoutBtn = document.createElement("button");
          logoutBtn.id = "sidebarLogoutBtn";
          logoutBtn.innerHTML = `<i class="fas fa-sign-out-alt"></i> Logout`;
          sidebarLoginBtn.insertAdjacentElement("afterend", logoutBtn);
          logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("username");
            updateLoginUI();
          });
        }
      } else {
        sidebarLoginBtn.innerHTML = `<i class="fas fa-sign-in-alt"></i> Login`;
        sidebarLoginBtn.disabled = false;
        document.getElementById("sidebarLogoutBtn")?.remove();
      }
    }
  }
  loginBtn?.addEventListener("click", () => { loginModal?.classList.add("show"); overlay?.classList.add("active"); });
  sidebarLoginBtn?.addEventListener("click", () => {
    if (!localStorage.getItem("username")) { loginModal?.classList.add("show"); overlay?.classList.add("active"); }
  });
  sidebarSignupBtn?.addEventListener("click", () => { signupModal?.classList.add("show"); overlay?.classList.add("active"); });
  closeLogin?.addEventListener("click", () => loginModal?.classList.remove("show"));
  closeSignup?.addEventListener("click", () => signupModal?.classList.remove("show"));
  submitLogin?.addEventListener("click", () => {
    const username = $("username")?.value?.trim();
    const password = $("password")?.value;
    if (username && password) {
      localStorage.setItem("username", username);
      loginModal?.classList.remove("show");
      updateLoginUI();
    } else {
      alert("Please enter both username and password.");
    }
  });
  dropdownLogin?.addEventListener("click", () => loginModal?.classList.add("show"));
  dropdownSignup?.addEventListener("click", () => signupModal?.classList.add("show"));
  dropdownLogout?.addEventListener("click", () => { localStorage.removeItem("username"); updateLoginUI(); });
  profileIcon?.addEventListener("click", () => document.querySelector(".profile-container")?.classList.toggle("show"));
  window.addEventListener("click", (e) => {
    const profileContainer = document.querySelector(".profile-container");
    if (profileContainer && !profileContainer.contains(e.target) && !profileIcon.contains(e.target)) {
      profileContainer.classList.remove("show");
    }
  });
  updateLoginUI();

  // =====================
  // HERO SLIDESHOW
  // =====================
  try {
    const heroImages = ["images/iphones/iphone 11 white.JPG", "images/iphones/iphone 13 green.JPG", "images/iphones/iphone 13 pro gold.JPG", "images/iphones/iphone 16 black.png", "images/iphones/iphone xr group.png", "images/iphones/iphone 15 group.png"];
    let heroIndex = 0;
    const heroSlide = document.getElementById("heroSlide");
    if (heroSlide) {
      heroSlide.src = heroImages[heroIndex];
      setInterval(() => {
        heroIndex = (heroIndex + 1) % heroImages.length;
        heroSlide.src = heroImages[heroIndex];
      }, 3500);
    }
  } catch (err) {
    console.error("Hero slideshow error:", err);
  }

  // =====================
  // SEARCH DROPDOWN
  // =====================
  searchToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    if (!searchDropdown) return;
    searchDropdown.style.display = searchDropdown.style.display === "flex" ? "none" : "flex";
  });
  document.addEventListener("click", (e) => {
    if (!searchDropdown) return;
    if (!searchDropdown.contains(e.target) && searchToggle && !searchToggle.contains(e.target)) {
      searchDropdown.style.display = "none";
    }
  });
  searchBtn?.addEventListener("click", () => {
    let query = searchInput?.value?.trim();
    if (query) {
      alert("Searching for: " + query);
      searchDropdown.style.display = "none";
    }
  });

  // =====================
  // SIDEBAR SEARCH
  // =====================
  if (sidebarSearchBtn && sidebarSearchContainer) {
    sidebarSearchBtn.addEventListener("click", () => {
      sidebarSearchContainer.style.display = sidebarSearchContainer.style.display === "flex" ? "none" : "flex";
    });
    sidebarSearchGo?.addEventListener("click", () => {
      let q = (sidebarSearchInput?.value || "").trim();
      if (q) {
        alert("🔍 Searching for: " + q);
        sidebarSearchContainer.style.display = "none";
      } else {
        alert("⚠️ Please enter a search term.");
      }
    });
  }

  // =====================
  // CATEGORY SLIDESHOWS (robust, independent per-card)
  // =====================
  document.querySelectorAll(".category-slideshow").forEach((slideshow, sIndex) => {
    try {
      const slides = Array.from(slideshow.querySelectorAll("img"));
      if (!slides.length) {
        console.warn("No images found inside .category-slideshow at index", sIndex);
        return;
      }

      let index = 0;
      let intervalMs = parseInt(slideshow.dataset.interval) || 4000;
      let timer = null;

      // Create arrows
      const prevBtn = document.createElement("button");
      prevBtn.className = "prev";
      prevBtn.setAttribute("aria-label", "Previous slide");
      prevBtn.innerHTML = "&#10094;";
      const nextBtn = document.createElement("button");
      nextBtn.className = "next";
      nextBtn.setAttribute("aria-label", "Next slide");
      nextBtn.innerHTML = "&#10095;";

      slideshow.appendChild(prevBtn);
      slideshow.appendChild(nextBtn);

      // Create dots container
      const dotsContainer = document.createElement("div");
      dotsContainer.className = "dots";
      slides.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.className = "dot";
        if (i === 0) dot.classList.add("active");
        dot.addEventListener("click", () => showSlide(i));
        dotsContainer.appendChild(dot);
      });
      slideshow.appendChild(dotsContainer);

      function showSlide(n) {
        // defensive guards
        if (!slides[index]) return;
        slides[index].classList.remove("active");
        dotsContainer.children[index]?.classList.remove("active");

        index = (n + slides.length) % slides.length;

        slides[index].classList.add("active");
        dotsContainer.children[index]?.classList.add("active");
      }

      function nextSlide() { showSlide(index + 1); }
      function prevSlide() { showSlide(index - 1); }

      nextBtn.addEventListener("click", (e) => { e.stopPropagation(); nextSlide(); resetTimer(); });
      prevBtn.addEventListener("click", (e) => { e.stopPropagation(); prevSlide(); resetTimer(); });

      // Pause on hover
      slideshow.addEventListener("mouseenter", () => { if (timer) clearInterval(timer); });
      slideshow.addEventListener("mouseleave", () => { startTimer(); });

      function startTimer() {
        if (timer) clearInterval(timer);
        timer = setInterval(() => { nextSlide(); }, intervalMs);
      }
      function resetTimer() { startTimer(); }

      // init first slide
      slides.forEach((img, i) => img.classList.remove("active"));
      slides[0].classList.add("active");

      startTimer();
    } catch (err) {
      console.error("Error initializing slideshow for card index", sIndex, err);
    }
  });

  // End of DOMContentLoaded
}); // DOMContentLoaded
