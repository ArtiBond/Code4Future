const API = "/tournaments";

const el = (id) => document.getElementById(id);

async function loadTournaments() {
  const res = await fetch(API);
  const tours = await res.json();

  const tbody = el("tours-tbody");
  tbody.innerHTML = "";

  el("tours-empty").style.display = tours.length ? "none" : "block";

  for (const t of tours) {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHtml(t.name)}</td>
      <td>${escapeHtml(t.status)}</td>
      <td style="text-align:right;">
        <button class="btn" data-del="${t._id}">Delete</button>
      </td>
    `;
    tbody.appendChild(tr);
  }

  tbody.querySelectorAll("[data-del]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      await fetch(`${API}/${btn.dataset.del}`, { method: "DELETE" });
      loadTournaments();
    });
  });
}

el("btn-create-tour").addEventListener("click", async () => {
  const payload = {
    name: el("tour-name").value.trim(),
    description: el("tour-description").value.trim(),
    regOpen: el("tour-regOpen").value ? new Date(el("tour-regOpen").value) : null,
    regClose: el("tour-regClose").value ? new Date(el("tour-regClose").value) : null,
    maxTeams: Number(el("tour-maxTeams").value || 50),
    status: el("tour-status").value,
    jury: el("tour-jury").value.trim(),
  };

  if (!payload.name) {
    el("tour-form-msg").textContent = "Вкажи назву турніру.";
    return;
  }

  const res = await fetch(API, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await res.json();
  if (!res.ok) {
    el("tour-form-msg").textContent = data.message || "Помилка створення";
    return;
  }

  el("tour-form-msg").textContent = "✅ Створено";
  loadTournaments();
});

el("btn-reload-tours").addEventListener("click", loadTournaments);

function escapeHtml(s = "") {
  return String(s).replace(/[&<>"']/g, (m) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  }[m]));
}

loadTournaments();