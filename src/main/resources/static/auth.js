// auth.js - lógica de cadastro/login simples usando localStorage
// NOTE: este é um exemplo didático. Para produção use um backend e hashing seguro.

const REDIRECT_TO = 'game.html'; // <-- altere aqui para o arquivo do seu jogo (ex: index.html ou jogo.html)

const tabRegister = document.getElementById('tab-register');
const tabLogin = document.getElementById('tab-login');
const panelRegister = document.getElementById('register-form');
const panelLogin = document.getElementById('login-form');
const btnGuest = document.getElementById('btn-guest');
const btnGuest2 = document.getElementById('btn-guest-2');

const registerMsg = document.getElementById('register-msg');
const loginMsg = document.getElementById('login-msg');

const inputRegUser = document.getElementById('reg-username');
const inputRegPass = document.getElementById('reg-password');
const inputRegPassC = document.getElementById('reg-password-confirm');
const inputLoginUser = document.getElementById('login-username');
const inputLoginPass = document.getElementById('login-password');

// eventos abas
tabRegister.addEventListener('click', () => switchTab('register'));
tabLogin.addEventListener('click', () => switchTab('login'));

function switchTab(which) {
  if (which === 'register') {
    tabRegister.setAttribute('aria-selected','true');
    tabLogin.setAttribute('aria-selected','false');
    panelRegister.classList.remove('hidden');
    panelLogin.classList.add('hidden');
    registerMsg.textContent = ''; loginMsg.textContent = '';
  } else {
    tabRegister.setAttribute('aria-selected','false');
    tabLogin.setAttribute('aria-selected','true');
    panelRegister.classList.add('hidden');
    panelLogin.classList.remove('hidden');
    registerMsg.textContent = ''; loginMsg.textContent = '';
  }
}

// --- armazenamento simples ---
function loadAccounts() {
  try {
    const raw = localStorage.getItem('rpg_accounts') || '{}';
    return JSON.parse(raw);
  } catch (e) {
    return {};
  }
}
function saveAccounts(obj) {
  localStorage.setItem('rpg_accounts', JSON.stringify(obj));
}
function setCurrentUser(username) {
  localStorage.setItem('rpg_current_user', JSON.stringify({ username, time: Date.now() }));
}
function getCurrentUser() {
  try { return JSON.parse(localStorage.getItem('rpg_current_user')); } catch(e) { return null; }
}

// util - mostra mensagem por 3s
function showMsg(el, text, type='error') {
  el.textContent = text;
  el.classList.remove('error','ok');
  el.classList.add(type === 'ok' ? 'ok' : 'error');
  if (text) setTimeout(()=> { el.textContent = ''; el.classList.remove('error','ok'); }, 3500);
}

// cadastro
panelRegister.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const user = inputRegUser.value.trim();
  const pass = inputRegPass.value;
  const passC = inputRegPassC.value;

  if (!user || user.length < 3) return showMsg(registerMsg, 'Digite um nome com pelo menos 3 caracteres.');
  if (pass.length < 4) return showMsg(registerMsg, 'Senha muito curta (mínimo 4 caracteres).');
  if (pass !== passC) return showMsg(registerMsg, 'As senhas não conferem.');

  const accounts = loadAccounts();
  if (accounts[user]) return showMsg(registerMsg, 'Nome já existe. Escolha outro.');

  // para simplicidade guardamos a senha em texto (INSEGURO). Em produção, envie ao servidor para hashing.
  accounts[user] = { password: pass, created: Date.now(), hp: 100, attack: 30 };
  saveAccounts(accounts);

  setCurrentUser(user);
  showMsg(registerMsg, 'Conta criada! Entrando...', 'ok');

  setTimeout(() => {
    // redireciona para o jogo
    window.location.href = REDIRECT_TO;
  }, 900);
});

// login
panelLogin.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const user = inputLoginUser.value.trim();
  const pass = inputLoginPass.value;

  const accounts = loadAccounts();
  if (!accounts[user]) return showMsg(loginMsg, 'Usuário não encontrado.');
  if (accounts[user].password !== pass) return showMsg(loginMsg, 'Senha incorreta.');

  setCurrentUser(user);
  showMsg(loginMsg, 'Bem-vindo! Entrando...', 'ok');

  setTimeout(() => {
    window.location.href = REDIRECT_TO;
  }, 700);
});

// entrar como convidado
btnGuest.addEventListener('click', guestLogin);
btnGuest2.addEventListener('click', guestLogin);

function guestLogin() {
  const guestName = 'guest_' + Math.floor(Math.random() * 9000 + 1000);
  // create a temporary account-like object in localStorage only for convenience
  const accounts = loadAccounts();
  accounts[guestName] = { password: '', created: Date.now(), hp: 100, attack: 10, guest:true };
  saveAccounts(accounts);
  setCurrentUser(guestName);
  window.location.href = REDIRECT_TO;
}

// --- atalho Enter para inputs (melhora UX)
[...document.querySelectorAll('input')].forEach(inp => {
  inp.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      const form = inp.closest('form');
      if (form) form.requestSubmit();
    }
  });
});

// se já estiver logado, redireciona direto
const existing = getCurrentUser();
if (existing && existing.username) {
  // opcional: redirecionar direto
  // window.location.href = REDIRECT_TO;
}
