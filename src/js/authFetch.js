async function authFetch(url, options = {}) {
  let token = localStorage.getItem('token');

  // 1) перша спроба
  let res = await fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      ...(token ? { Authorization: 'Bearer ' + token } : {})
    },
    credentials: 'include'
  });

  // 2) якщо access протух -> refresh
  if (res.status === 401) {
    const refreshRes = await fetch('/refresh', {
      method: 'POST',
      credentials: 'include'
    });

    if (!refreshRes.ok) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      return res; // повертаємо старий 401
    }

    const data = await refreshRes.json();
    token = data.accessToken;
    localStorage.setItem('token', token);

    // 3) повторюємо запит з новим токеном
    res = await fetch(url, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: 'Bearer ' + token
      },
      credentials: 'include'
    });
  }

  return res;
}