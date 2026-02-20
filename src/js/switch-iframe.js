
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("themeToggle");
  if (!toggle) return;


  window.parent.postMessage({ type: "GET_THEME" }, "*");


  window.addEventListener("message", (e) => {
    if (e.data?.type === "SYNC_THEME") {
      toggle.checked = (e.data.theme === "dark");
    }
  });


  toggle.addEventListener("change", () => {
    const theme = toggle.checked ? "dark" : "light";
    window.parent.postMessage({ type: "SET_THEME", theme }, "*");
  });
});