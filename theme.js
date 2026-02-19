const toggle = document.getElementById("themeToggle");
  const KEY = "theme"; // "dark" або "light"

  function applyTheme(theme) {
    // light = додаємо клас, dark = прибираємо
    document.body.classList.toggle("light", theme === "light");
    // checkbox: увімкнено = dark (можеш поміняти логіку якщо хочеш)
    toggle.checked = (theme === "dark");
  }

  // 1) стартова тема (з пам’яті або за системною)
  const saved = localStorage.getItem(KEY);
  const systemPrefersDark = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const startTheme = saved ? saved : (systemPrefersDark ? "dark" : "light");
  applyTheme(startTheme);

  // 2) кліки по перемикачу
  toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "dark" : "light";
    localStorage.setItem(KEY, theme);
    applyTheme(theme);
  });