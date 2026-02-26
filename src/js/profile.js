document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token');
  if (!token) {
    // redirect unauthenticated users to login
    window.location.href = '/login';
    return;
  }

  try {
    const res = await fetch('/me', {
      headers: {
        Authorization: 'Bearer ' + token
      }
    });
    if (!res.ok) {
      // token may have expired or be invalid
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
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
  } catch (err) {
    console.error('Failed to fetch user data', err);
    window.location.href = '/login';
  }
});