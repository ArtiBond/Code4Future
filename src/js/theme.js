// js/theme.js
const KEY = "theme";

function getTheme() {
  return localStorage.getItem(KEY) || "dark";
}

function applyTheme(theme) {
  
  document.body.classList.toggle("light", theme === "light");


}

function setTheme(theme) {
  localStorage.setItem(KEY, theme);
  applyTheme(theme);
}


document.addEventListener("DOMContentLoaded", () => {
  setTheme(getTheme());
});


window.addEventListener("message", (e) => {
  if (e.data?.type === "GET_THEME") {
    e.source?.postMessage({ type: "SYNC_THEME", theme: getTheme() }, "*");
  }

  if (e.data?.type === "SET_THEME") {
    setTheme(e.data.theme);

  
    document.querySelectorAll("iframe.header-frame").forEach((fr) => {
      fr.contentWindow?.postMessage({ type: "SYNC_THEME", theme: getTheme() }, "*");
    });
  }
});