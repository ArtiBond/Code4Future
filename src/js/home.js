document.addEventListener("DOMContentLoaded", loadHomeTournaments);

async function loadHomeTournaments() {
  try {
    const res = await fetch("/tournaments");
    if (!res.ok) throw new Error("Не вдалося завантажити турніри");

    const tournaments = await res.json();

    const registration = tournaments.filter(t => t.status === "registration");
    const running = tournaments.filter(t => t.status === "running");
    const finished = tournaments.filter(t => t.status === "finished");

    renderRegistration(registration);
    renderRunning(running);
    renderFinished(finished);

  } catch (err) {
    console.error("Помилка завантаження:", err);

    const reg = document.getElementById("registrationList");
    const run = document.getElementById("runningList");
    const fin = document.getElementById("finishedList");

    if (reg) reg.innerHTML = `<div class="form__muted">Не вдалося завантажити турніри</div>`;
    if (run) run.innerHTML = `<div class="form__muted">Не вдалося завантажити турніри</div>`;
    if (fin) fin.innerHTML = `<tr><td colspan="4" class="form__muted">Не вдалося завантажити турніри</td></tr>`;
  }
}

function renderRegistration(items) {
  const container = document.getElementById("registrationList");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `<div class="form__muted">Немає майбутніх турнірів</div>`;
    return;
  }

  container.innerHTML = items.map(t => `
    <div class="card" style="margin:0 0 12px 0;">
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <b>${escapeHtml(t.name || "Без назви")}</b>
        <span class="badge badge__warn">Registration</span>
      </div>
      <div class="form__muted" style="margin-top:8px;font-size:13px;">
        Реєстрація: ${formatDate(t.regOpen)} — ${formatDate(t.regClose)}
      </div>
      <div class="form__muted" style="margin-top:6px;font-size:13px;">
        ${escapeHtml(t.description || "")}
      </div>
      <div class="form__row" style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a class="btn btn__primary" href="team-register.html?id=${t._id}">Реєстрація команди</a>
        <a class="btn" href="tournament.html?id=${t._id}">Деталі</a>
      </div>
    </div>
  `).join("");
}

function renderRunning(items) {
  const container = document.getElementById("runningList");
  if (!container) return;

  if (!items.length) {
    container.innerHTML = `<div class="form__muted">Немає активних турнірів</div>`;
    return;
  }

  container.innerHTML = items.map(t => `
    <div class="card" style="margin:0 0 12px 0;">
      <div style="display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;">
        <b>${escapeHtml(t.name || "Без назви")}</b>
        <span class="badge badge__accent">Running</span>
      </div>
      <div class="form__muted" style="margin-top:8px;font-size:13px;">
        ${escapeHtml(t.description || "Активний турнір")}
      </div>
      <div class="form__row" style="margin-top:12px;display:flex;gap:10px;flex-wrap:wrap;">
        <a class="btn" href="tournament.html?id=${t._id}">Перейти</a>
        <a class="btn" href="leaderboard.html?id=${t._id}">Leaderboard</a>
      </div>
    </div>
  `).join("");
}

function renderFinished(items) {
  const tbody = document.getElementById("finishedList");
  if (!tbody) return;

  if (!items.length) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4" class="form__muted">Немає завершених турнірів</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = items.map(t => `
    <tr>
      <td>${escapeHtml(t.name || "Без назви")}</td>
      <td>${getYear(t.updatedAt || t.createdAt)}</td>
      <td><span class="badge badge__ok">Finished</span></td>
      <td>
        <div class="form__row" style="display:flex;gap:10px;flex-wrap:wrap;">
          <a class="btn" href="tournament.html?id=${t._id}">Відкрити</a>
          <a class="btn" href="leaderboard.html?id=${t._id}">Рейтинг</a>
        </div>
      </td>
    </tr>
  `).join("");
}

function formatDate(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  });
}

function getYear(dateString) {
  if (!dateString) return "-";

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-";

  return date.getFullYear();
}

function escapeHtml(str) {
  return String(str)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}