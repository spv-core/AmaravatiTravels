// script.js
document.addEventListener('DOMContentLoaded', () => {
  console.log('Amaravathi Travels site loaded');
  const loginForm = document.getElementById('login-form');
  const passwordInput = document.getElementById('admin-password');
  const errorMsg = document.getElementById('login-error');
  const loginSection = document.getElementById('admin-login');
  const dashboard = document.getElementById('admin-dashboard');
  const logoutBtn = document.getElementById('logout-btn');

  const ADMIN_PASSWORD = 'admin123'; // simple client‑side password

  // Handle login submission
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (passwordInput.value === ADMIN_PASSWORD) {
      errorMsg.style.display = 'none';
      loginSection.classList.add('hidden');
      dashboard.classList.remove('hidden');
    } else {
      errorMsg.style.display = 'block';
    }
    passwordInput.value = '';
  });

  // Logout button
  logoutBtn.addEventListener('click', () => {
    dashboard.classList.add('hidden');
    loginSection.classList.remove('hidden');
  });
});
