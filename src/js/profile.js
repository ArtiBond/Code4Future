document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // redirect unauthenticated users to login
    window.location.href = '/login';
    return;
  }

  try {
    const res = await authFetch('/me', {
      credentials: 'include'
    });
    if (!res.ok) {
 
  if (res.status === 401 || res.status === 403) {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  } else {
   
    console.warn('Request failed but token kept. Status:', res.status);
  }
  return;

    }

    const user = await res.json();
    // populate fields
    const nameEl = document.getElementById('profile-name');
    const emailEl = document.getElementById('profile-email');
    const roleEl = document.getElementById('profile-role');
   
    
    if (nameEl) nameEl.value = user.name || '';
    if (emailEl) emailEl.value = user.email || '';
    if (roleEl) roleEl.textContent = user.role || '';
    
    if (user.role === 'Адміністратор') {
      document.getElementById('jury-block').style.display = 'none';
       document.getElementById('player-block').style.display = 'none';
        document.getElementById('team-block').style.display = 'none';
        
    }
     if (user.role === 'Журі') {
      document.getElementById('admin-block').style.display = 'none';
       document.getElementById('player-block').style.display = 'none';
       document.getElementById('team-block').style.display = 'none';
       
    }
     if (user.role === 'Учасник') {
      document.getElementById('admin-block').style.display = 'none';
       document.getElementById('jury-block').style.display = 'none';
          document.getElementById('cap-block').style.display = 'none';
    }
    if (user.role === 'Капітан') {
      document.getElementById('admin-block').style.display = 'none';
       document.getElementById('jury-block').style.display = 'none';
       document.getElementById('cap-edit').style.display = 'none';
    }
  } catch (err) {
    console.error('Failed to fetch user data', err);
    window.location.href = '/login';
  }

  const logoutBtn = document.getElementById('btn-logout');

if (logoutBtn) {
  logoutBtn.addEventListener('click', async () => {
    try {
      await fetch('/logout', {
        method: 'POST',
        credentials: 'include'
      });

      // очищаємо фронт
      localStorage.removeItem('token');
      localStorage.removeItem('user');

      // редірект
      window.location.href = '/login';
    } catch (err) {
      console.error('Logout error:', err);
    }
  });
}

async function loadFlag(countryCode) {
  try {
    const code = String(countryCode).trim().toUpperCase();
    const res = await fetch(`https://restcountries.com/v3.1/alpha/${code}`);
    if (!res.ok) throw new Error(`Не знайшов країну: ${code}`);

    const [country] = await res.json();
    const flag = document.getElementById("flag");

    flag.style.display = "inline-block";
    flag.style.width = "40px";
    flag.style.height = "40px";
    flag.style.borderRadius = "50%";
    flag.style.backgroundImage = `url("${country.flags.svg}")`;
    flag.style.backgroundSize = "cover";
    flag.style.backgroundPosition = "center";
    flag.style.backgroundRepeat = "no-repeat";
  } catch (err) {
    console.error(err);
  }
}

loadFlag(user.country);


}); 