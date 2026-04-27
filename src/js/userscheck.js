const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));
const user_role = JSON.parse(localStorage.getItem('user'))?.role;

if (token && user) {
  document.getElementById('btn-login').style.display = 'none';
  document.getElementById('btn-profile').style.display = '';
  document.getElementById('btn-profile').textContent = user.name?.[0] || '';
  const btn1 = document.getElementById('btn-1');
  const btn2 = document.getElementById('btn-2');
  const btn3 = document.getElementById('btn-3');
  
  if(user_role === 'Адміністратор') {
   btn1.textContent='Турніри';
   btn2.textContent='Склад журі';
   btn3.textContent='Створити турнір';

   btn1.href='/tournamentes';
   btn2.href='/juryProfile';
   btn3.href='/admin';

  }
  if(user_role === 'Журі') {
    btn1.textContent='Турніри';
    btn2.textContent='Оцінювання робіт';
    btn3.textContent='Результати';

    btn1.href='/tournamentes';
    btn2.href='/juryRated';
    btn3.href='/leaderboard';

  }
  if(user_role === 'Учасник') {
    btn1.textContent='Турніри';
    btn2.textContent='Таблиця лідерів';
    btn3.textContent='Ваша команда';

    btn1.href='/tournamentes';
    btn2.href='/leaderboard';
    btn3.href='/profile';
  }
  if(user_role === 'Капітан') {
    btn1.textContent='Турніри';
    btn2.textContent='Таблиця лідерів';
    btn3.textContent='Моя команда';

     btn1.href='/tournamentes';
    btn2.href='/leaderboard';
    btn3.href='/profile';
  }
} else {
  const userStatusBlock = document.getElementById('user-status-block');
  if (userStatusBlock) {
    userStatusBlock.style.display = 'none';
  }

  const btn1 = document.getElementById('btn-1');
  const btn2 = document.getElementById('btn-2');
  const btn3 = document.getElementById('btn-3');

  btn1.textContent='Турніри';
  btn2.textContent='Таблиця лідерів';
  btn3.textContent='Моя команда';

  btn1.href='/tournamentes';
  btn2.href='/leaderboard';
  btn3.href='/login';
}


     
