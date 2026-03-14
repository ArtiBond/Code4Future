const params = new URLSearchParams(window.location.search);
const tournamentId = params.get('id') || params.get('tournamentId');

const teamFormMsg = document.getElementById('team-form-msg');
const membersWrap = document.getElementById('members-wrap');
const btnAddMember = document.getElementById('btn-add-member');
const btnSaveTeam = document.getElementById('btn-save-team');

const teamNameInput = document.getElementById('team-name');

const captainFullNameInput = document.getElementById('captain-fullName');
const captainEmailInput = document.getElementById('captain-email');
const captainTelegramInput = document.getElementById('captain-telegram');
const captainSchoolInput = document.getElementById('captain-school');
const captainClassNameInput = document.getElementById('captain-className');

const cityInput = document.getElementById('city');
const countryInput = document.getElementById('country');

const teamsTbody = document.getElementById('teams-tbody');
const teamsEmpty = document.getElementById('teams-empty');

let currentEditId = null;

function escapeHtml(value) {
  return String(value || '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function createMemberRow(member = {}) {
  const row = document.createElement('div');
  row.className = 'grid__row member-row';
  row.style.marginTop = '10px';

  row.innerHTML = `
    <div class="form__field">
      <label>ПІБ</label>
      <input class="form__input member-fullName" placeholder="Учасник" value="${escapeHtml(member.fullName || '')}">
    </div>
    <div class="form__field">
      <label>Email</label>
      <input class="form__input member-email" type="email" placeholder="member@email.com" value="${escapeHtml(member.email || '')}">
    </div>
    <div class="form__field">
      <label>Школа</label>
      <input class="form__input member-school" placeholder="Школа №123" value="${escapeHtml(member.school || '')}">
    </div>
    <div class="form__field">
      <label>Клас</label>
      <input class="form__input member-className" placeholder="10" value="${escapeHtml(member.className || '')}">
    </div>
    <div class="form__field" style="display:flex;align-items:flex-end;">
      <button type="button" class="btn btn-remove-member">Видалити</button>
    </div>
  `;

  row.querySelector('.btn-remove-member').addEventListener('click', () => {
    row.remove();
  });

  return row;
}

function addMember(member = {}) {
  membersWrap.appendChild(createMemberRow(member));
}

function collectMembers() {
  return [...document.querySelectorAll('.member-row')]
    .map((row) => ({
      fullName: row.querySelector('.member-fullName')?.value.trim() || '',
      email: row.querySelector('.member-email')?.value.trim() || '',
      school: row.querySelector('.member-school')?.value.trim() || '',
      className: row.querySelector('.member-className')?.value.trim() || ''
    }))
    .filter((member) => member.fullName);
}

function collectFormData() {
  return {
    tournamentId,
    teamName: teamNameInput.value.trim(),
    captain: {
      fullName: captainFullNameInput.value.trim(),
      email: captainEmailInput.value.trim(),
      telegram: captainTelegramInput.value.trim(),
      school: captainSchoolInput.value.trim(),
      className: captainClassNameInput.value.trim()
    },
    members: collectMembers(),
    city: cityInput.value.trim(),
    country: countryInput.value.trim()
  };
}

function fillForm(team) {
  teamNameInput.value = team?.teamName || '';
  captainFullNameInput.value = team?.captain?.fullName || '';
  captainEmailInput.value = team?.captain?.email || '';
  captainTelegramInput.value = team?.captain?.telegram || '';
  captainSchoolInput.value = team?.captain?.school || '';
  captainClassNameInput.value = team?.captain?.className || '';
  cityInput.value = team?.city || '';
  countryInput.value = team?.country || '';

  membersWrap.innerHTML = '';
  (team?.members || []).forEach((member) => addMember(member));

  btnSaveTeam.textContent = 'Зберегти зміни';
}

function resetForm() {
  currentEditId = null;
  teamNameInput.value = '';
  captainFullNameInput.value = '';
  captainEmailInput.value = '';
  captainTelegramInput.value = '';
  captainSchoolInput.value = '';
  captainClassNameInput.value = '';
  cityInput.value = '';
  countryInput.value = '';
  membersWrap.innerHTML = '';
  btnSaveTeam.textContent = 'Зареєструвати команду';
}

function renderTeams(teams) {
  teamsTbody.innerHTML = '';

  if (!teams.length) {
    teamsEmpty.style.display = 'block';
    return;
  }

  teamsEmpty.style.display = 'none';

  teams.forEach((team) => {
    const tr = document.createElement('tr');

    tr.innerHTML = `
      <td>
        <div><b>${escapeHtml(team.teamName)}</b></div>
        <div class="form__muted">${escapeHtml(team.captain?.fullName || '—')}</div>
      </td>
      <td>${1 + (team.members?.length || 0)}</td>
      <td>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn btn-edit-team" type="button">Редагувати</button>
          <button class="btn btn-delete-team" type="button">Видалити</button>
        </div>
      </td>
    `;

    tr.querySelector('.btn-edit-team').addEventListener('click', () => {
      currentEditId = team._id;
      fillForm(team);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    tr.querySelector('.btn-delete-team').addEventListener('click', async () => {
      const ok = confirm(`Видалити команду "${team.teamName}"?`);
      if (!ok) return;

      try {
        const res = await fetch(`/teams/${team._id}`, {
          method: 'DELETE'
        });

        const data = await res.json();

        if (!data.ok) {
          teamFormMsg.textContent = data.message || 'Не вдалося видалити команду';
          return;
        }

        if (currentEditId === team._id) {
          resetForm();
        }

        teamFormMsg.textContent = 'Команду видалено.';
        loadTeams();
      } catch (err) {
        console.error(err);
        teamFormMsg.textContent = 'Помилка видалення.';
      }
    });

    teamsTbody.appendChild(tr);
  });
}

async function loadTeams() {
  if (!tournamentId) {
    teamFormMsg.textContent = 'Не передано tournamentId в URL.';
    return;
  }

  try {
    const res = await fetch(`/teams/tournament/${tournamentId}`);
    const data = await res.json();

    if (!data.ok) {
      teamFormMsg.textContent = data.message || 'Помилка завантаження команд';
      return;
    }

    renderTeams(data.teams || []);
  } catch (err) {
    console.error(err);
    teamFormMsg.textContent = 'Не вдалося завантажити команди.';
  }
}

btnAddMember?.addEventListener('click', () => addMember());

btnSaveTeam?.addEventListener('click', async () => {
  teamFormMsg.textContent = '';

  if (!tournamentId) {
    teamFormMsg.textContent = 'Не передано tournamentId в URL.';
    return;
  }

  const payload = collectFormData();

  if (!payload.teamName) {
    teamFormMsg.textContent = 'Вкажіть назву команди.';
    return;
  }

  if (!payload.captain.fullName) {
    teamFormMsg.textContent = 'Вкажіть ПІБ капітана.';
    return;
  }

  btnSaveTeam.disabled = true;

  try {
    let res;

    if (currentEditId) {
      res = await fetch(`/teams/${currentEditId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    } else {
      res = await fetch('/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });
    }

    const data = await res.json();

    if (!data.ok) {
      teamFormMsg.textContent = data.message || 'Помилка збереження';
      return;
    }

    teamFormMsg.textContent = currentEditId
      ? 'Команду оновлено.'
      : 'Команду створено.';

    resetForm();
    loadTeams();
  } catch (err) {
    console.error(err);
    teamFormMsg.textContent = 'Помилка сервера.';
  } finally {
    btnSaveTeam.disabled = false;
  }
});

resetForm();
loadTeams();
