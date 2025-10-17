document.addEventListener("DOMContentLoaded", () => {
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

  // =====================
  // SIDEBAR OPEN/CLOSE
  // =====================
  function openSidebar() {
    sidebar.classList.add("active");
    overlay.classList.add("active");
  }

  function closeSidebar() {
    sidebar.classList.remove("active");
    overlay.classList.remove("active");
  }

  hamburger?.addEventListener("click", openSidebar);
  closeBtn?.addEventListener("click", closeSidebar);
  overlay?.addEventListener("click", () => {
    closeSidebar();
    closeCartSidebar();
  });

  sidebar.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", closeSidebar);
  });

  // =====================
  // THEME TOGGLE
  // =====================
  function applyTheme(theme) {
    if (theme === "light") {
      document.body.classList.add("light-theme");
      themeToggle.innerHTML = `<i class="fas fa-sun"></i>`;
      sidebarThemeBtn.innerHTML = `<i class="fas fa-sun"></i> Toggle Theme`;
    } else {
      document.body.classList.remove("light-theme");
      themeToggle.innerHTML = `<i class="fas fa-moon"></i>`;
      sidebarThemeBtn.innerHTML = `<i class="fas fa-moon"></i> Toggle Theme`;
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
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function updateCartUI() {
    cartItemsList.innerHTML = "";
    let total = 0;

    cart.forEach((item, index) => {
      total += item.price * item.quantity;
      const li = document.createElement("li");
      li.innerHTML = `
        <span>${item.name} (${item.quantity})</span>
        <div>
            <button class="decrease"><i class="fas fa-minus"></i></button>
            <button class="increase"><i class="fas fa-plus"></i></button>
            <button class="remove"><i class="fas fa-trash"></i></button>
        </div>
      `;

      li.querySelector(".decrease").addEventListener("click", () => {
        if (item.quantity > 1) {
          item.quantity--;
        } else {
          cart.splice(index, 1);
        }
        saveCart();
      });

      li.querySelector(".increase").addEventListener("click", () => {
        item.quantity++;
        saveCart();
      });

      li.querySelector(".remove").addEventListener("click", () => {
        cart.splice(index, 1);
        saveCart();
      });

      cartItemsList.appendChild(li);
    });

    cartTotal.textContent = total.toFixed(2);
    cartCount.textContent = cart.length;
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartUI();
  }

  document.querySelectorAll(".category-card").forEach((card) => {
    card.addEventListener("click", () => {
      const productName = card.querySelector("h3").textContent;
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
    cartSidebar.classList.add("open");
    overlay.classList.add("active");
  });

  function closeCartSidebar() {
    cartSidebar.classList.remove("open");
    overlay.classList.remove("active");
  }

  closeCart?.addEventListener("click", closeCartSidebar);

  updateCartUI();

  // =====================
  // LOGIN/SIGNUP MODALS
  // =====================
  function updateLoginUI() {
    const user = localStorage.getItem("username");

    // Desktop
    if (user && profileIcon) {
      profileIcon.innerHTML = `<i class="fas fa-user"></i> ${user}`;
      dropdownLogout.style.display = "block";
      dropdownLogin.style.display = "none";
      dropdownSignup.style.display = "none";
    } else if (profileIcon) {
      profileIcon.innerHTML = `<i class="fas fa-user"></i>`;
      dropdownLogout.style.display = "none";
      dropdownLogin.style.display = "block";
      dropdownSignup.style.display = "block";
    }

    // Sidebar
    if (sidebarLoginBtn) {
      if (user) {
        sidebarLoginBtn.innerHTML = `<i class="fas fa-user"></i> Hi, ${user}`;
        sidebarLoginBtn.disabled = true;

        // Add Logout button if missing
        let logoutBtn = document.getElementById("sidebarLogoutBtn");
        if (!logoutBtn) {
          logoutBtn = document.createElement("button");
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

  loginBtn?.addEventListener("click", () => {
    loginModal.classList.add("show");
    overlay.classList.add("active");
  });

  sidebarLoginBtn?.addEventListener("click", () => {
    if (!localStorage.getItem("username")) {
      loginModal.classList.add("show");
      overlay.classList.add("active");
    }
  });

  sidebarSignupBtn?.addEventListener("click", () => {
    signupModal.classList.add("show");
    overlay.classList.add("active");
  });

  closeLogin?.addEventListener("click", () => loginModal.classList.remove("show"));
  closeSignup?.addEventListener("click", () => signupModal.classList.remove("show"));

  submitLogin?.addEventListener("click", () => {
    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value;

    if (username && password) {
      localStorage.setItem("username", username);
      loginModal.classList.remove("show");
      updateLoginUI();
    } else {
      alert("Please enter both username and password.");
    }
  });

  dropdownLogin?.addEventListener("click", () => loginModal.classList.add("show"));
  dropdownSignup?.addEventListener("click", () => signupModal.classList.add("show"));
  dropdownLogout?.addEventListener("click", () => {
    localStorage.removeItem("username");
    updateLoginUI();
  });

  profileIcon?.addEventListener("click", () => {
    document.querySelector(".profile-container").classList.toggle("show");
  });

  window.addEventListener("click", (e) => {
    if (!document.querySelector(".profile-container").contains(e.target) && !profileIcon.contains(e.target)) {
      document.querySelector(".profile-container").classList.remove("show");
    }
  });

  updateLoginUI();

  // =====================
  // HERO SLIDESHOW
  // =====================
  const heroImages = ["images/iphones/iphone 11 white.JPG", "images/iphones/iphone 13 green.JPG", "images/iphones/iphone 13 pro gold.JPG", "images/iphones/iphone 16 black.png", "images/iphones/iphone xr group.png", "images/iphones/iphone 15 group.png"];
  let heroIndex = 0;
  const heroSlide = document.getElementById("heroSlide");

  function changeHeroImage() {
    heroIndex = (heroIndex + 1) % heroImages.length;
    heroSlide.src = heroImages[heroIndex];
  }

  setInterval(changeHeroImage, 4000);

  // =====================
  // SEARCH DROPDOWN
  // =====================
  searchToggle?.addEventListener("click", (e) => {
    e.stopPropagation();
    searchDropdown.style.display = searchDropdown.style.display === "flex" ? "none" : "flex";
  });

  document.addEventListener("click", (e) => {
    if (!searchDropdown.contains(e.target) && !searchToggle.contains(e.target)) {
      searchDropdown.style.display = "none";
    }
  });

  searchBtn?.addEventListener("click", () => {
    let query = searchInput.value.trim();
    if (query) {
      alert("Searching for: " + query);
      searchDropdown.style.display = "none";
    }
  });
});

if (sidebarSearchBtn && sidebarSearchContainer) {
  sidebarSearchBtn.addEventListener("click", () => {
    // Toggle the search input visibility
    sidebarSearchContainer.style.display =
      sidebarSearchContainer.style.display === "flex" ? "none" : "flex";
  });

  if (sidebarSearchGo) {
    sidebarSearchGo.addEventListener("click", () => {
      let query = sidebarSearchInput.value.trim();
      if (query) {
        alert("🔍 Searching for: " + query);
        sidebarSearchContainer.style.display = "none"; // Hide after search
      } else {
        alert("⚠️ Please enter a search term.");
      }
    });
  }
}

document.querySelectorAll(".category-slideshow").forEach((slideshow) => {
  let slides = slideshow.querySelectorAll("img");
  let index = 0;

  // Create arrows
  let prevBtn = document.createElement("button");
  prevBtn.className = "prev";
  prevBtn.innerHTML = "&#10094;";
  let nextBtn = document.createElement("button");
  nextBtn.className = "next";
  nextBtn.innerHTML = "&#10095;";
  slideshow.appendChild(prevBtn);
  slideshow.appendChild(nextBtn);

  // Create dots
  let dotsContainer = document.createElement("div");
  dotsContainer.className = "dots";
  slides.forEach((_, i) => {
    let dot = document.createElement("span");
    dot.className = "dot" + (i === 0 ? " active" : "");
    dot.addEventListener("click", () => showSlide(i));
    dotsContainer.appendChild(dot);
  });
  slideshow.appendChild(dotsContainer);

  function showSlide(n) {
    slides[index].classList.remove("active");
    dotsContainer.children[index].classList.remove("active");

    index = (n + slides.length) % slides.length;

    slides[index].classList.add("active");
    dotsContainer.children[index].classList.add("active");
  }

  function nextSlide() { showSlide(index + 1); }
  function prevSlide() { showSlide(index - 1); }

  nextBtn.addEventListener("click", nextSlide);
  prevBtn.addEventListener("click", prevSlide);

  // Auto slide
  setInterval(nextSlide, 4000);

  // Initialize
  slides[0].classList.add("active");
});
