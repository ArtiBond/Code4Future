const API = "/tournaments";

const el = (id) => document.getElementById(id);

document.addEventListener("DOMContentLoaded", () => {
  el("btn-create-tour")?.addEventListener("click", createTournament);
  el("btn-reload-tours")?.addEventListener("click", loadTournaments);
  loadTournaments();
});

async function loadTournaments() {
  const tbody = el("tours-tbody");
  const empty = el("tours-empty");

  if (!tbody || !empty) return;

  try {
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="form__muted">Завантаження...</td>
      </tr>
    `;

    const res = await fetch(API);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    const tours = await res.json();

    tbody.innerHTML = "";
    empty.style.display = tours.length ? "none" : "block";

    if (!tours.length) {
      return;
    }

    for (const t of tours) {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <td>
          <a href="tournament.html?id=${encodeURIComponent(t._id)}">
            ${escapeHtml(t.name || "Без назви")}
          </a>
        </td>
        <td>
          <span class="badge ${getStatusClass(t.status)}">
            ${escapeHtml(formatStatus(t.status))}
          </span>
        </td>
        <td style="text-align:right;">
          <button class="btn" type="button" data-del="${t._id}">Delete</button>
        </td>
      `;

      tbody.appendChild(tr);
    }

    tbody.querySelectorAll("[data-del]").forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.dataset.del;
        if (!id) return;

        const ok = confirm("Видалити цей турнір?");
        if (!ok) return;

        try {
          btn.disabled = true;

          const res = await fetch(`${API}/${id}`, {
            method: "DELETE",
          });

          if (!res.ok) {
            let message = "Помилка видалення";
            try {
              const data = await res.json();
              message = data.message || message;
            } catch (_) {}
            alert(message);
            btn.disabled = false;
            return;
          }

          await loadTournaments();
        } catch (err) {
          console.error("Delete tournament error:", err);
          alert("Не вдалося видалити турнір");
          btn.disabled = false;
        }
      });
    });
  } catch (err) {
    console.error("Load tournaments error:", err);
    tbody.innerHTML = `
      <tr>
        <td colspan="3" class="form__muted">Не вдалося завантажити турніри</td>
      </tr>
    `;
    empty.style.display = "none";
  }
}

async function createTournament() {
  const msg = el("tour-form-msg");
  if (msg) msg.textContent = "";

  const payload = {
    name: el("tour-name")?.value.trim() || "",
    description: el("tour-description")?.value.trim() || "",
    regOpen: el("tour-regOpen")?.value
      ? new Date(el("tour-regOpen").value).toISOString()
      : null,
    regClose: el("tour-regClose")?.value
      ? new Date(el("tour-regClose").value).toISOString()
      : null,
    maxTeams: Number(el("tour-maxTeams")?.value || 50),
    status: (el("tour-status")?.value || "draft").toLowerCase(),
    startTournament: el("tour-startTournament")?.value
      ? new Date(el("tour-startTournament").value).toISOString()
      : null,
    endTournament: el("tour-endTournament")?.value
      ? new Date(el("tour-endTournament").value).toISOString()
      : null,
    jury: el("tour-jury")?.value.trim() || "",
  };

  if (!payload.name) {
    if (msg) msg.textContent = "Вкажи назву турніру.";
    return;
  }

  if (payload.regOpen && payload.regClose) {
    const regOpenDate = new Date(payload.regOpen);
    const regCloseDate = new Date(payload.regClose);

    if (regOpenDate > regCloseDate) {
      if (msg) msg.textContent = "Reg close має бути пізніше за Reg open.";
      return;
    }
  }

  if (!Number.isFinite(payload.maxTeams) || payload.maxTeams < 1) {
    if (msg) msg.textContent = "Max teams має бути більше 0.";
    return;
  }

  const createBtn = el("btn-create-tour");

  try {
    if (createBtn) createBtn.disabled = true;
    if (msg) msg.textContent = "Створення...";

    console.log("Create payload:", payload);

    const res = await fetch(API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const contentType = res.headers.get("content-type") || "";
    let data = null;

    if (contentType.includes("application/json")) {
      data = await res.json();
    } else {
      const text = await res.text();
      data = { message: text };
    }

    console.log("Create response:", res.status, data);

    if (!res.ok) {
      if (msg) msg.textContent = data?.message || "Помилка створення";
      return;
    }

    if (msg) msg.textContent = "✅ Турнір створено";

    resetForm();
    await loadTournaments();
  } catch (err) {
    console.error("Create tournament error:", err);
    if (msg) msg.textContent = "Не вдалося створити турнір";
  } finally {
    if (createBtn) createBtn.disabled = false;
  }
}

function resetForm() {
  if (el("tour-name")) el("tour-name").value = "";
  if (el("tour-description")) el("tour-description").value = "";
  if (el("tour-regOpen")) el("tour-regOpen").value = "";
  if (el("tour-regClose")) el("tour-regClose").value = "";
  if (el("tour-maxTeams")) el("tour-maxTeams").value = "";
  if (el("tour-status")) el("tour-status").value = "draft";
  if (el("tour-jury")) el("tour-jury").value = "";
}

function formatStatus(status = "") {
  const s = String(status).toLowerCase();

  if (s === "draft") return "Draft";
  if (s === "registration") return "Registration";
  if (s === "running") return "Running";
  if (s === "finished") return "Finished";

  return status || "Unknown";
}

function getStatusClass(status = "") {
  const s = String(status).toLowerCase();

  if (s === "draft") return "";
  if (s === "registration") return "badge__warn";
  if (s === "running") return "badge__accent";
  if (s === "finished") return "badge__ok";

  return "";
}

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, (m) => {
    return {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    }[m];
  });
}