// theme.js – handles light/dark mode toggle and persists preference

(function () {
  const THEME_KEY = "careerpro-theme";
  const body = document.body;
  const toggleBtn = document.getElementById("themeToggle");

  // Apply saved theme or default to light
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark") {
    body.classList.add("dark-mode");
    toggleBtn.textContent = "☀️"; // sun icon for light mode
  } else {
    body.classList.remove("dark-mode");
    toggleBtn.textContent = "🌙"; // moon icon for dark mode
  }

  // Toggle handler
  toggleBtn.addEventListener("click", () => {
    const isDark = body.classList.toggle("dark-mode");
    localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
    toggleBtn.textContent = isDark ? "☀️" : "🌙";
  });

  // Keyboard accessibility: allow Enter/Space on button
  toggleBtn.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleBtn.click();
    }
  });
})();
