
// Ajuste aqui se o backend estiver em outra porta/origem.
// Se o frontend é servido pelo MESMO Spring Boot (mesma origem), pode deixar vazio ''.
const baseUrl = ''; // exemplo alternativo: 'http://localhost:8080'

const el = {
  lista: document.getElementById('listaPersonagens'),
  status: document.getElementById('status'),
  btnCriar: document.getElementById('btnCriar'),
  btnRecarregar: document.getElementById('btnRecarregar'),
};

function setStatus(msg, isError = false) {
  el.status.textContent = msg;
  el.status.classList.toggle('error', isError);
}

function btnBusy(button, busyText = 'Processando…') {
  const original = button.textContent;
  button.disabled = true;
  button.dataset.originalText = original;
  button.innerHTML = `<span class="spinner"></span>${busyText}`;
}
function btnFree(button) {
  button.disabled = false;
  if (button.dataset.originalText) {
    button.textContent = button.dataset.originalText;
    delete button.dataset.originalText;
  }
}

async function api(path, options = {}) {
  const url = `${baseUrl}${path}`;
  try {
    const resp = await fetch(url, {
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
      ...options,
    });
    return resp;
  } catch (e) {
    console.error(`Falha de rede ao chamar ${url}:`, e);
    throw new Error('Não foi possível conectar ao servidor. Ele está em execução?');
  }
}

// === AÇÕES ===

async function criarPersonagem() {
  try {

    const response = await fetch('/api/personagens', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}'
    });
    if (!response.ok) {
      const msg = await response.text().catch(() => '');
      throw new Error(`Erro HTTP ${response.status}: Falha ao criar personagem. ${msg}`);
    }
    alert('Personagem padrão criado com sucesso');
    carregarLista();
  } catch (error) {

    console.error('Erro ao criar personagem:', error);
    alert('Falha ao criar personagem. Verifique o console (F12 > Console).');
  }
}


async function carregarLista() {
  setStatus('Carregando lista...')
  const listaDiv = document.getElementById('listaPersonagens');
  listaDiv.replaceChildren();
  const h2 = document.createElement('h2')
  h2.textContent = 'Personagens Existentes';
  listaDiv.appendChild(h2);
  try {
    const response = await fetch('/api/personagens');
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao listar personagens`);
    }
    const personagens = await response.json();
    const listaDiv = document.getElementById('listaPersonagens');
    +        listaDiv.innerHTML; '<h2>Personagens Existentes</h2>';
    if (personagens.length === 0) {
      setStatus('')
      listaDiv.innerHTML += '<p>Nenhum personagem encontrado.</p>';
      return;
    }
    setStatus('')
    personagens.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
                 <h3>${p.nome} (Nível ${p.level})</h3>
                 <p class="muted">ID: ${p.id}</p>
              <button onclick="selecionarPersonagem(${p.id}, this)">Jogar</button>
              <button onclick="deletarPersonagem(${p.id}, this)">Deletar</button>
                 <img src="/imagens/iconchar.png" alt="avatar" >
          `;
      listaDiv.appendChild(card);
    });
  } catch (error) {
    console.error('Erro ao listar personagens:', error);
    alert('Falha ao carregar lista. Verifique o console.');
  }
}


function renderLista(personagens) {
  document.getElementById('status').style.display = 'none';
  el.lista.innerHTML = '<h2>Personagens Existentes</h2>';

  if (!Array.isArray(personagens) || personagens.length === 0) {
    el.lista.innerHTML += '<p class="muted">Nenhum personagem encontrado.</p>';
    return;
  }

  personagens.forEach((p) => {
    // Proteções contra undefined
    const id = p.id ?? '';
    const nome = p.nome ?? 'Sem nome';
    const level = p.level ?? p.nivel ?? 1; // caso backend use "nivel"
    const hp = p.hp ?? 0;
    const mp = p.mp ?? 0;

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <h3>${escapeHtml(nome)} (Nível ${escapeHtml(level)})</h3>
      <p>HP: ${escapeHtml(hp)} | MP: ${escapeHtml(mp)}</p>
      <div>
        <button data-action="jogar  deletarDeletar</button>
      </div>
    `;
    el.lista.appendChild(card);
  });
}

// Utilitário simples para evitar XSS ao injetar strings
function escapeHtml(val) {
  return String(val)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

async function selecionarPersonagem(id, button) {
  btnBusy(button, 'Entrando…');
  setStatus(`Selecionando personagem #${id}…`);
  try {
    const resp = await api(`/api/jogo/selecionar/${id}`, { method: 'POST' });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status} ao selecionar personagem. ${txt}`);
    }
    // Redireciona para a tela do mapa (ajuste o destino como preferir)
    window.location.href = 'index.html'; // futuramente: 'mapa.html'
  } catch (err) {
    console.error('Erro ao selecionar personagem:', err);
    setStatus(err.message || 'Falha ao selecionar personagem.', true);
    alert('Falha ao selecionar personagem. Verifique o console.');
  } finally {
    btnFree(button);
  }
}

async function deletarPersonagem(id, button) {
  if (!confirm('Tem certeza que deseja deletar este personagem?')) return;

  btnBusy(button, 'Deletando…');
  setStatus(`Deletando personagem #${id}…`);

  try {
    const resp = await api(`/api/personagens/${id}`, { method: 'DELETE' });
    if (!resp.ok) {
      const txt = await resp.text().catch(() => '');
      throw new Error(`HTTP ${resp.status} ao deletar. ${txt}`);
    }
    setStatus('Personagem deletado com sucesso!');
    await carregarLista();
  } catch (err) {
    console.error('Erro ao deletar personagem:', err);
    setStatus(err.message || 'Falha ao deletar personagem.', true);
    alert('Falha ao deletar personagem. Verifique o console.');
  } finally {
    btnFree(button);
  }
}

// === EVENTOS ===

// Delegação de eventos dentro da lista (pega clicks em "Jogar" e "Deletar")
el.lista.addEventListener('click', (ev) => {
  const btn = ev.target.closest('button[data-action]');
  if (!btn) return;

  const id = btn.getAttribute('data-id');
  const action = btn.getAttribute('data-action');

  if (action === 'jogar') {
    selecionarPersonagem(id, btn);
  } else if (action === 'deletar') {
    deletarPersonagem(id, btn);
  }
});

document.addEventListener('DOMContentLoaded', () => {
  carregarLista();
  document.getElementById('btnCriar').addEventListener('click', criarPersonagem);
  document.getElementById('btnRecarregar').addEventListener('click', carregarLista);
});
