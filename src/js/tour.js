document.addEventListener("DOMContentLoaded", async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");

  if (!id) return;

  try {
    const res = await fetch("/tournaments"); // API
    const tournaments = await res.json();

    const tour = tournaments.find(t => t._id === id);

    if (!tour) {
      document.getElementById("nameTOUR").textContent = "Турнір не знайдено";
      return;
    }

    renderTournament(tour);

  } catch (err) {
    console.error(err);
  }
});


function renderTournament(tour) {

  // Назва
  document.getElementById("nameTOUR").textContent = tour.name;

  // статус
  const statusEl = document.getElementById("tourStatus");
  if (statusEl) {
    statusEl.textContent = tour.status;
  }

  // опис
  const desc = document.getElementById("tourDescription");
  if (desc) {
    desc.textContent = tour.description;
  }

  // дедлайн реєстрації
  const regClose = new Date(tour.regClose).toLocaleString();

  const deadlineEl = document.getElementById("taskDeadline");
  if (deadlineEl) {
    deadlineEl.textContent = "Закриття реєстрації: " + regClose;
  }

}