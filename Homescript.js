const hamburger = document.getElementById('hamburger');
const sidebar = document.getElementById('sidebar');
const overlay = document.getElementById('overlay');
const closeBtn = document.getElementById('closeBtn');
const themeToggle = document.getElementById('themeToggle');

// Open sidebar
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    sidebar.classList.add('active');
    overlay.classList.add('active');
});

// Close sidebar
function closeSidebar() {
    hamburger.classList.remove('open');
    sidebar.classList.remove('active');
    overlay.classList.remove('active');
}

//close triggers

closeBtn.addEventListener('click', closeSidebar);
overlay.addEventListener('click', closeSidebar);
sidebar.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeSidebar);
});

// Function to apply theme
function applyTheme(theme) {
  if (theme === "light") {
    document.body.classList.add("light-theme");
    themeToggle.textContent = "🌞";
  } else {
    document.body.classList.remove("light-theme");
    themeToggle.textContent = "🌙";
  }
}

// Get saved theme or system preference
function initTheme() {
  const savedTheme = localStorage.getItem("theme");

  if (savedTheme) {
    applyTheme(savedTheme);
  } else {
    // Auto-detect system theme on first load
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    applyTheme(prefersDark ? "dark" : "light");
    localStorage.setItem("theme", prefersDark ? "dark" : "light");
  }
}

// Toggle theme on click
themeToggle.addEventListener("click", () => {
  const isLight = document.body.classList.toggle("light-theme");
  const newTheme = isLight ? "light" : "dark";
  localStorage.setItem("theme", newTheme);
  themeToggle.textContent = isLight ? "🌞" : "🌙";
});

// Initialize on page load
initTheme();

// Scroll to Top
document.getElementById("backToTop").addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
  
  // Optional: Handle language change (just console logs for now)
  document.getElementById("languageSelect").addEventListener("change", (e) => {
    const lang = e.target.value;
    console.log("Language selected:", lang);
    // Here you could load translations, update text, etc.
  });
  
