let isLogin = true;

function toggleForm() {
  isLogin = !isLogin;
  document.getElementById('form-title').textContent = isLogin ? 'Iniciar Sesión' : 'Registrarse';
  document.getElementById('action-button').textContent = isLogin ? 'Iniciar Sesión' : 'Registrarse';
  document.getElementById('toggle-button').textContent = isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión';
  document.getElementById('error').classList.add('hidden');
}

async function handleAction() {
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  const error = document.getElementById('error');
  const url = isLogin ? 'http://localhost:5000/api/auth/login' : 'http://localhost:5000/api/auth/register';

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
      if (isLogin) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('usuario', username);
        window.location.href = 'dashboard.html';
      } else {
        error.classList.remove('hidden');
        error.textContent = '¡Usuario registrado! Ahora inicia sesión.';
        toggleForm();
      }
    } else {
      error.classList.remove('hidden');
      error.textContent = data.error;
    }
  } catch (err) {
    error.classList.remove('hidden');
    error.textContent = 'Error de conexión';
  }
}

function loginAsGuest() {
  const username = 'niño1';
  localStorage.setItem('usuario', username);
  window.location.href = 'dashboard.html'; // Asegúrate que este archivo exista
}
