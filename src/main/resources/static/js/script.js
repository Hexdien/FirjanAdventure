
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

// Bloco adicionado para modal de criação de personagem autor: Henrique

function openCriarPersonagemModal() {
  const modal = document.getElementById('modal-criar-personagem');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
  document.getElementById('cp-nome').focus();
}



function closeCriarPersonagemModal() {
  const modal = document.getElementById('modal-criar-personagem');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  // limpa feedback/erros
  document.getElementById('cp-feedback').textContent = '';
  setFieldError('nome', '');
  setFieldError('sexo', '');
  document.getElementById('form-criar-personagem').reset();
}



function setFieldError(fieldName, message) {
  const el = document.querySelector(`[data-error-for="${fieldName}"]`);
  if (el) el.textContent = message || '';
}



function criarPersonagem() {
  openCriarPersonagemModal();
}

// Fim do Bloco adicionado para modal de criação de personagem autor: Henrique



async function carregarLista() {
  setStatus('Carregando lista...');
  const listaDiv = document.getElementById('listaPersonagens');
  if (!listaDiv) {
    console.warn('#listaPersonagens não encontrado');
    return;
  }


  listaDiv.replaceChildren();

  // título (pode ser aqui, ou deixe para o renderLista)
  const h2 = document.createElement('h2');
  h2.textContent = 'Personagens Existentes';
  listaDiv.appendChild(h2);

  try {
    const response = await fetch('/api/personagens');
    if (!response.ok) {
      throw new Error(`Erro HTTP ${response.status}: Falha ao listar personagens`);
    }
    const personagens = await response.json();

    setStatus('');
    renderLista(personagens); // <<< delega a renderização
  } catch (error) {
    console.error('Erro ao listar personagens:', error);
    setStatus('Falha ao carregar lista.', true);
    alert('Falha ao carregar lista. Verifique o console.');
  }
}




function renderLista(personagens) {
  const lista = document.getElementById('listaPersonagens');
  if (!lista) return;

  // Se quiser que o título fique aqui, garanta que não duplique com carregarLista
  // lista.innerHTML = '<h2>Personagens Existentes</h2>';

  if (!Array.isArray(personagens) || personagens.length === 0) {
    // Se o título já foi inserido em carregarLista, só adiciona a mensagem
    lista.innerHTML += '<p class="muted">Nenhum personagem encontrado.</p>';
    return;
  }

  personagens.forEach((p) => {
    const id = p?.id ?? '';
    const nome = p?.nome ?? 'Sem nome';
    const attrs = p?.atributos ?? {};
    const level = attrs?.level ?? attrs?.nivel ?? 1;
    const hp = attrs?.hp ?? 0; // se ainda não usa, pode omitir
    const mp = attrs?.mp ?? 0; // idem

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-body">
        <h3>${escapeHtml(nome)} (Nível ${escapeHtml(String(level))})</h3>
        <p>HP: ${escapeHtml(String(hp))} | MP: ${escapeHtml(String(mp))}</p>
        <div class="card-actions">
          <button data-action="jogar" data-id="${escapeHtml(String(id))}">
          Jogar
          </button>
          <button data-action="deletar" data-id="${escapeHtml(String(id))}">
          Deletar
          </button>
        </div>
      </div>
    `;
    lista.appendChild(card);
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

(function attachListaDelegation() {
  const lista = document.getElementById('listaPersonagens');
  if (!lista) return;

  lista.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const action = btn.getAttribute('data-action');
    const id = btn.getAttribute('data-id');

    if (action === 'jogar') {
      // fluxo consolidado: abre game.html com personagemId na query
      window.location.href = `/game.html?personagemId=${encodeURIComponent(id)}`;
      return;
    }

    if (action === 'deletar') {
      if (!confirm('Tem certeza que deseja deletar este personagem?')) return;
      try {
        const res = await fetch(`/api/personagens/${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!res.ok) {
          const txt = await res.text().catch(() => '');
          throw new Error(`HTTP ${res.status} - ${txt}`);
        }
        // Recarrega a lista
        await carregarLista();
      } catch (err) {
        console.error('Erro ao deletar:', err);
        alert('Falha ao deletar personagem. Veja o console.');
      }
    }
  });
})();



// Bloco adicionado para abrir e fechar modal formulario autor: Henrique

window.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('form-criar-personagem');
  const btnCancelar = document.getElementById('cp-cancelar');
  const btnSubmit = document.getElementById('cp-submit');
  const feedback = document.getElementById('cp-feedback');

  btnCancelar.addEventListener('click', closeCriarPersonagemModal);

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    setFieldError('nome', ''); setFieldError('sexo', '');
    feedback.textContent = '';

    const nome = (document.getElementById('cp-nome').value || '').trim();
    const sexo = (document.getElementById('cp-sexo').value || '').trim().toUpperCase();

    // Validações simples no front
    if (!nome) { setFieldError('nome', 'Nome é obrigatório.'); return; }
    if (!['M', 'F'].includes(sexo)) { setFieldError('sexo', 'Selecione M ou F.'); return; }


    // Monta payload conforme seu DTO de criação
    // Use suas variáveis nome, sexo
    const atributosIniciais = { level: 1, hpMax: 100, hp: 100, mp: 50, forca: 0, defesa: 0, xp: 0 };
    const payload = { nome, sexo, posX: 0, posY: 0, atributos: atributosIniciais };

    try {
      btnSubmit.disabled = true;
      feedback.textContent = 'Criando personagem...';

      const response = await fetch('/api/personagens', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const text = await response.text().catch(() => '');
        throw new Error(`HTTP ${response.status} - ${text}`);
      }

      const data = await response.json().catch(() => null);
      feedback.textContent = 'Personagem criado com sucesso!';
      // fecha modal após 600ms (efeito visual) e atualiza lista
      setTimeout(() => {
        closeCriarPersonagemModal();
        if (typeof carregarLista === 'function') carregarLista();
      }, 600);

    } catch (err) {
      console.error('Erro ao criar personagem:', err);
      feedback.textContent = 'Falha ao criar personagem. Veja o console.';
    } finally {
      btnSubmit.disabled = false;
    }
  });

  // Fecha modal com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCriarPersonagemModal();
  });

  // Fecha clicando fora (backdrop)
  document.getElementById('modal-criar-personagem').addEventListener('click', (e) => {
    if (e.target.id === 'modal-criar-personagem') {
      closeCriarPersonagemModal();
    }
  });
});


// FIM DO BLOCO para trata modal autor: henrique

document.addEventListener('DOMContentLoaded', () => {
  carregarLista();
  document.getElementById('btnCriar').addEventListener('click', criarPersonagem);
  document.getElementById('btnRecarregar').addEventListener('click', carregarLista);
});
