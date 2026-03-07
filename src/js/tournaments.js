document.addEventListener("DOMContentLoaded", loadTournaments);

async function loadTournaments() {
  try {

    const res = await fetch("/tournaments");
    const tournaments = await res.json();

    const container = document.getElementById("tournamentsList");

    container.innerHTML = "";

    tournaments.forEach(t => {

      const card = document.createElement("div");
      card.className = "card";

      const statusClass = getStatusClass(t.status);

      card.innerHTML = `
        <div style="display:flex;justify-content:space-between;gap:10px;">
          <b>${t.name}</b>
          <span class="badge ${statusClass}">${t.status}</span>
        </div>

        <div class="form__muted" style="margin-top:8px;">
          ${t.description || ""}
        </div>

        <div class="form__row" style="margin-top:12px;display:flex;gap:10px;">
          <a class="btn" href="tournament.html?id=${t._id}">Відкрити</a>
          ${t.status === "registration"
            ? `<a class="btn btn__primary" href="team-register.html?id=${t._id}">Реєстрація команди</a>`
            : `<a class="btn" href="leaderboard.html?id=${t._id}">Рейтинг</a>`
          }
        </div>
      `;

      container.appendChild(card);
    });

  } catch (err) {
    console.error("Помилка завантаження турнірів:", err);
  }
}


function getStatusClass(status) {

  switch(status) {

    case "registration":
      return "badge__warn";

    case "running":
      return "badge__accent";

    case "finished":
      return "badge__ok";

    default:
      return "badge__warn";
  }

}