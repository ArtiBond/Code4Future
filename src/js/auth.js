// handles login and registration form submissions

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.querySelector('form[action="/login"]');
  const registerForm = document.querySelector('form[action="/register"]') ||
                       document.querySelector('form[action="/registration"]');

  if (loginForm) {
    loginForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(loginForm);
      const data = Object.fromEntries(formData.entries());

      try {
        const res = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) {
          const text = await res.text();
          alert('Login failed: ' + text);
          return;
        }
        const result = await res.json();
        // store token for subsequent requests
        localStorage.setItem('token', result.accessToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = '/profile';
      } catch (err) {
        console.error(err);
        alert('Error logging in');
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener('submit', async e => {
      e.preventDefault();
      const formData = new FormData(registerForm);
      const data = Object.fromEntries(formData.entries());

      if (data.password !== data.confirm) {
        alert('Passwords do not match');
        return;
      }

      if (data.password.length < 3) {
        alert('Password must be at least 3 characters long');
        return;
      }

      // send registration request to the server endpoint
      try {
        const res = await fetch('/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) {
          let msg;
          try {
            const json = await res.json();
            if (json.errors && json.errors.length) {
              msg = json.errors.map(e => e.msg).join(', ');
            } else if (json.message) {
              msg = json.message;
            } else {
              msg = await res.text();
            }
          } catch (_) {
            msg = await res.text();
          }
          alert('Registration failed: ' + msg);
          return;
        }
        const result = await res.json();
        localStorage.setItem('token', result.accessToken);
        localStorage.setItem('user', JSON.stringify(result.user));
        window.location.href = '/profile';
      } catch (err) {
        console.error(err);
        alert('Error registering');
      }
    });
  }
});