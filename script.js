document.addEventListener("DOMContentLoaded", () => {
  // Sidebar Elements
  const hamburger = document.getElementById("hamburger");
  const sidebar = document.getElementById("sidebar");
  const overlay = document.getElementById("overlay");
  const closeBtn = document.getElementById("closeSidebar");
  const themeToggle = document.getElementById("themeToggle");
  const sidebarTheme = document.getElementById("sidebarTheme");

  /* =====================
     SIDEBAR OPEN/CLOSE
  ====================== */
  function openSidebar() {
      hamburger.classList.add("open");
      sidebar.classList.add("active");
      overlay.classList.add("active");
  }

  function closeSidebar() {
      hamburger.classList.remove("open");
      sidebar.classList.remove("active");
      overlay.classList.remove("active");
  }

  if (hamburger) {
      hamburger.addEventListener("click", openSidebar);
  }
  if (closeBtn) {
      closeBtn.addEventListener("click", closeSidebar);
  }
  if (overlay) {
      overlay.addEventListener("click", closeSidebar);
  }

  sidebar.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", closeSidebar);
  });

  /* =====================
     THEME TOGGLE
  ====================== */
  function applyTheme(theme) {
      if (theme === "light") {
          document.body.classList.add("light-theme");
          if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
          if (sidebarThemeToggle) sidebarThemeToggle.innerHTML = '<i class="fas fa-sun"></i>';
      } else {
          document.body.classList.remove("light-theme");
          if (themeToggle) themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
          if (sidebarThemeToggle) sidebarThemeToggle.innerHTML = '<i class="fas fa-moon"></i>';
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

  function toggleTheme() {
      const isLight = document.body.classList.toggle("light-theme");
      const newTheme = isLight ? "light" : "dark";
      localStorage.setItem("theme", newTheme);
      applyTheme(newTheme);
  }

  if (themeToggle) themeToggle.addEventListener("click", toggleTheme);
  if (sidebarThemeToggle) sidebarThemeToggle.addEventListener("click", toggleTheme);

  initTheme();

  /* =====================
     BACK TO TOP BUTTON
  ====================== */
  const backToTopBtn = document.getElementById("backToTop");
  if (backToTopBtn) {
      backToTopBtn.addEventListener("click", () => {
          window.scrollTo({ top: 0, behavior: "smooth" });
      });
  }

  /* =====================
     LANGUAGE SELECT
  ====================== */
  const languageSelect = document.getElementById("languageSelect");
  if (languageSelect) {
      languageSelect.addEventListener("change", (e) => {
          console.log("Language selected:", e.target.value);
      });
  }

  /* =====================
     MOVE LOGIN/SIGNUP BUTTONS TO SIDEBAR ON MOBILE
  ====================== */
  function moveButtonsToSidebar() {
      const screenWidth = window.innerWidth;
      const buttons = document.querySelectorAll(".mobile-move");
      const sidebarContainer = document.querySelector(".mobile-buttons");
      const navButtons = document.querySelector(".nav-buttons");

      if (screenWidth <= 768) {
          buttons.forEach(btn => {
              if (!sidebarContainer.contains(btn)) {
                  sidebarContainer.appendChild(btn);
              }
          });
      } else {
          buttons.forEach(btn => {
              if (!navButtons.contains(btn)) {
                  navButtons.insertBefore(btn, document.querySelector(".cart-btn"));
              }
          });
      }
  }

  window.addEventListener("resize", moveButtonsToSidebar);
  window.addEventListener("load", moveButtonsToSidebar);
});

/* =====================
 CART FUNCTIONALITY
====================== */
const cartBtn = document.getElementById("cartBtn");
const cartSidebar = document.getElementById("cartSidebar");
const closeCart = document.getElementById("closeCart");
const cartItemsList = document.getElementById("cartItems");
const cartCount = document.getElementById("cartCount");
const cartTotal = document.getElementById("cartTotal");
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

if (cartBtn) cartBtn.addEventListener("click", () => {
  cartSidebar.classList.add("open");
  overlay.classList.add("active");
});

if (closeCart) closeCart.addEventListener("click", closeCartSidebar);
if (overlay) overlay.addEventListener("click", closeCartSidebar);

function closeCartSidebar() {
  cartSidebar.classList.remove("open");
  overlay.classList.remove("active");
}

updateCartUI();

/* =====================
 LOGIN FUNCTIONALITY
====================== */
const loginBtn = document.getElementById("loginBtn");
const loginModal = document.getElementById("loginModal");
const closeLogin = document.getElementById("closeLogin");
const submitLogin = document.getElementById("submitLogin");

function updateLoginUI() {
  const user = localStorage.getItem("username");
  if (user) {
      loginBtn.innerHTML = `<i class="fas fa-user"></i> Hi, ${user}`;
      loginBtn.disabled = true;
  }
}

if (loginBtn) {
  loginBtn.addEventListener("click", () => {
      loginModal.classList.add("show");
  });
}

if (closeLogin) {
  closeLogin.addEventListener("click", () => {
      loginModal.classList.remove("show");
  });
}

if (submitLogin) {
  submitLogin.addEventListener("click", () => {
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
}

updateLoginUI();
