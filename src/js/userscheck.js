const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (token && user) {
  document.getElementById('btn-login').style.display = 'none';
  document.getElementById('btn-profile').style.display = '';
  document.getElementById('btn-profile').textContent = user.name?.[0] || '';
}

if (!token) {
  console.log('no token');
}

     
