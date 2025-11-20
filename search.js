// =====================
// SEARCH FUNCTIONALITY
// Handles search across all pages with real product filtering
// =====================

// Get all products from the page (both index and categories pages)
function getAllProducts() {
  const products = [];
  
  // Get products from index.html (Best Sellers section)
  document.querySelectorAll(".product-item").forEach((item) => {
    const titleEl = item.querySelector(".product-title");
    const priceEl = item.querySelector(".prod-price");
    if (titleEl && priceEl) {
      products.push({
        name: titleEl.textContent.trim(),
        price: priceEl.textContent.trim(),
        element: item
      });
    }
  });
  
  return products;
}

// Search products and highlight/filter
function searchProducts(query) {
  if (!query || query.length < 1) return;
  
  const allProducts = getAllProducts();
  const results = allProducts.filter(product => 
    product.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return results;
}

// Initialize navbar search
function initNavbarSearch() {
  const searchToggle = document.getElementById("searchToggle");
  const searchDropdown = document.getElementById("searchDropdown");
  const searchInput = document.getElementById("searchInput");
  const searchBtn = document.getElementById("searchBtn");
  
  if (!searchToggle || !searchDropdown) return;
  
  // Toggle dropdown visibility
  searchToggle.addEventListener("click", (e) => {
    e.stopPropagation();
    const isVisible = searchDropdown.classList.toggle("active");
    if (isVisible) {
      searchInput?.focus();
    }
  });
  
  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (searchDropdown && !searchDropdown.contains(e.target) && searchToggle && !searchToggle.contains(e.target)) {
      searchDropdown.classList.remove("active");
    }
  });
  
  // Handle search button click
  searchBtn?.addEventListener("click", performNavbarSearch);
  
  // Handle Enter key in search input
  searchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performNavbarSearch();
    }
  });
  
  function performNavbarSearch() {
    const query = searchInput?.value?.trim();
    if (query) {
      const results = searchProducts(query);
      if (results.length > 0) {
        // Scroll to first result
        results[0].element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight first result
        results[0].element.style.border = "2px solid var(--primary)";
        setTimeout(() => {
          results[0].element.style.border = "";
        }, 2000);
        searchDropdown?.classList.remove("active");
        searchInput.value = "";
      } else {
        alert(`No products found matching "${query}"`);
      }
    }
  }
}

// Initialize sidebar search
function initSidebarSearch() {
  const sidebarSearchBtn = document.getElementById("sidebarSearch");
  const sidebarSearchContainer = document.getElementById("sidebarSearchContainer");
  const sidebarSearchInput = document.getElementById("sidebarSearchInput");
  const sidebarSearchGo = document.getElementById("sidebarSearchGo");
  
  if (!sidebarSearchBtn || !sidebarSearchContainer) return;
  
  // Toggle search container
  sidebarSearchBtn.addEventListener("click", () => {
    const isVisible = sidebarSearchContainer.classList.toggle("active");
    if (isVisible) {
      sidebarSearchInput?.focus();
    }
  });
  
  // Handle search button click
  sidebarSearchGo?.addEventListener("click", performSidebarSearch);
  
  // Handle Enter key in search input
  sidebarSearchInput?.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      performSidebarSearch();
    }
  });
  
  function performSidebarSearch() {
    const query = sidebarSearchInput?.value?.trim();
    if (query) {
      const results = searchProducts(query);
      if (results.length > 0) {
        // Scroll to first result
        results[0].element.scrollIntoView({ behavior: "smooth", block: "center" });
        // Highlight first result
        results[0].element.style.border = "2px solid var(--primary)";
        setTimeout(() => {
          results[0].element.style.border = "";
        }, 2000);
        sidebarSearchContainer.classList.remove("active");
        sidebarSearchInput.value = "";
      } else {
        alert(`No products found matching "${query}"`);
      }
    } else {
      alert("Please enter a search term.");
    }
  }
}

// Initialize search on page load
document.addEventListener("DOMContentLoaded", () => {
  initNavbarSearch();
  initSidebarSearch();
});
