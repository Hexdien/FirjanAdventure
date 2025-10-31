// equipment.js (versão clicável: clique para equipar / clique para desequipar)

// ---------------- CONFIGURAÇÃO ----------------
// caminhos candidatos para a imagem da mochila (tente primeiro o caminho absoluto /imagens/...)
// ajuste se seu servidor expôr de forma diferente
const BACKPACK_CANDIDATES = [
  '/imagens/itens/mochila.png',
  'imagens/itens/mochila.png'
];

// Itens de exemplo (use URLs públicos, não caminhos internos do projeto)
const EXAMPLE_ITEMS = [
  { id: 'sword_01', name: 'Espada Curta', slot: 'weapon', img: '/imagens/itens/espada1.png', attack: 0, hp: 0 },
  { id: 'shield_01', name: 'Escudo de Ferro', slot: 'shield', img: '/imagens/itens/escudo.png', attack: 0, hp: 0 },
  { id: 'helmet_01', name: 'Elmo de Couro', slot: 'head', img: '/imagens/itens/capacete1.png', attack: 0, hp: 0 },
  { id: 'boots_01', name: 'Botas Ágeis', slot: 'boots', img: '/imagens/itens/armPerna2.png', attack: 0, hp: 0 },
  { id: 'armor_01', name: 'Peitoral Simples', slot: 'body', img: '/imagens/itens/arm1.png', attack: 0, hp: 0 },
  { id: 'ring_01', name: 'Anel Rúnico', slot: 'acc', img: '/imagens/itens/anel.png', attack: 0, hp: 0 },
  { id: 'capa_01', name: 'Capa Mágica', slot: 'capa', img: '/imagens/itens/capa.png', attack: 0, hp: 0 },
  { id: 'colar_01', name: 'Colar Mágico', slot: 'colar', img: '/imagens/itens/colar.png', attack: 0, hp: 0 }
];

// ---------------- utilitários de imagem ----------------
// tenta pré-carregar uma imagem e resolve true/false conforme sucesso
function preloadImage(url) {
  return new Promise(resolve => {
    const i = new Image();
    i.onload = () => resolve(true);
    i.onerror = () => resolve(false);
    i.src = url;
  });
}

// tenta uma lista de URLs e retorna a primeira válida (ou null)
async function findFirstValidImage(urls) {
  for (const u of urls) {
    if (!u) continue;
    /* eslint-disable no-await-in-loop */
    const ok = await preloadImage(u);
    if (ok) return u;
  }
  return null;
}

// ---------------- persistência ----------------
function loadEquipment() {
  try { return JSON.parse(localStorage.getItem('rpg_equipment') || '{}'); }
  catch (e) { return {}; }
}
function saveEquipment(obj) { localStorage.setItem('rpg_equipment', JSON.stringify(obj)); }

// ---------------- lógica principal UI ----------------
async function initEquipmentUI() {
  const equip = loadEquipment(); // { slotName: itemObject }

  // busca caminho válido para a mochila (uma vez)
  const backpackPath = await findFirstValidImage(BACKPACK_CANDIDATES);

  document.querySelectorAll('.slot').forEach(slotEl => {
    const slotName = slotEl.dataset.slot;
    const imgEl = slotEl.querySelector('.slot-img') || slotEl.querySelector('.slot-bag');
    const placeholderEl = slotEl.querySelector('.slot-placeholder');
    const item = equip[slotName];

    if (item) {
      // slot tem item salvo -> equipado
      slotEl.classList.add('equipped');
      if (imgEl) {
        imgEl.style.display = 'none';
        imgEl.alt = item.name || slotName;
        imgEl.onerror = () => { imgEl.style.display = 'none'; console.warn('Erro carregando:', imgEl.src); };
        imgEl.onload = () => { imgEl.style.display = 'block'; };
        imgEl.src = item.img;
      }
      if (placeholderEl) placeholderEl.style.display = 'none';
      slotEl.dataset.itemId = item.id;
      slotEl.title = item.name || slotName;
    } else {
      // slot vazio
      if (slotName === 'mochila') {
        // mochila: mostrar imagem fixa (se existir) — se não existir, mantém placeholder
        slotEl.classList.add('equipped'); // aparência "ocupada"
        if (imgEl && backpackPath) {
          imgEl.style.display = 'none';
          imgEl.onerror = () => { imgEl.style.display = 'none'; };
          imgEl.onload = () => { imgEl.style.display = 'block'; };
          imgEl.alt = 'Mochila';
          imgEl.src = backpackPath;
        } else {
          if (imgEl) imgEl.style.display = 'none';
          if (placeholderEl) placeholderEl.style.display = 'block';
        }
        if (placeholderEl) placeholderEl.style.display = backpackPath ? 'none' : 'block';
        delete slotEl.dataset.itemId;
        slotEl.title = 'Mochila';
      } else {
        slotEl.classList.remove('equipped');
        if (imgEl) {
          imgEl.src = '';
          imgEl.alt = '';
          imgEl.style.display = 'none';
          imgEl.onerror = null;
          imgEl.onload = null;
        }
        if (placeholderEl) placeholderEl.style.display = 'block';
        delete slotEl.dataset.itemId;
        slotEl.title = slotEl.dataset.slot || '';
      }
    }
  });

  updatePlayerStatsFromEquipment();
}

// ---------------- atuar sobre stats ----------------
function updatePlayerStatsFromEquipment() {
  const eq = loadEquipment();
  let bonusAtk = 0, bonusHp = 0;
  Object.values(eq).forEach(it => {
    if (it) { bonusAtk += (it.attack || 0); bonusHp += (it.hp || 0); }
  });
  /*const baseAtk = 30;
  const baseHp = 100;
  const atkEl = document.getElementById('player-attack');
  const hpEl = document.getElementById('player-hp');
  if (atkEl) atkEl.textContent = baseAtk + bonusAtk;
  if (hpEl) hpEl.textContent = baseHp + bonusHp;*/
}

// ---------------- equip / unequip ----------------
// tenta pré-carregar imagem do item antes de salvar; permite equipar mesmo com imagem ausente (com confirmação)
async function equipItemToSlot(slotName, item) {
  const ok = await preloadImage(item.img);
  if (!ok) {
    const cont = confirm(`Não foi possível carregar a imagem de "${item.name}". Deseja equipar mesmo assim?`);
    if (!cont) return;
  }
  const equip = loadEquipment();
  equip[slotName] = item;
  saveEquipment(equip);
  await initEquipmentUI();
}

// remove do slot
function unequipSlot(slotName) {
  const equip = loadEquipment();
  delete equip[slotName];
  saveEquipment(equip);
  initEquipmentUI();
}

// ---------------- UI - listeners ----------------
function setupListeners() {
  // botão desequipar tudo
  const btn = document.getElementById('unequip-all');
  if (btn) {
    btn.addEventListener('click', () => {
      localStorage.removeItem('rpg_equipment');
      initEquipmentUI();
    });
  }

  // clique nos slots: agora comportamento principal
  document.querySelectorAll('.slot').forEach(el => {
    el.addEventListener('click', async () => {
      const slot = el.dataset.slot;

      // mochila é fixa — abre aviso (pode ser substituído por inventário)
      if (slot === 'mochila') {
        alert('Mochila é fixa — use-a para guardar itens (não é um slot equipável).');
        return;
      }

      // se equipado -> pergunta para desequipar
      if (el.classList.contains('equipped')) {
        if (confirm('Desequipar ' + el.title + '?')) {
          unequipSlot(slot);
        }
        return;
      }

      // se vazio -> escolhe um item aleatório compatível com o slot
      // primeiro filtra itens que têm o mesmo slot
      let candidates = EXAMPLE_ITEMS.filter(it => it.slot === slot);

      // se não houver candidatos específicos, usa qualquer item
      if (candidates.length === 0) candidates = EXAMPLE_ITEMS.slice();

      // escolhe aleatório
      const item = candidates[Math.floor(Math.random() * candidates.length)];

      // tenta equipar (equipItemToSlot fará preload e confirm se necessário)
      await equipItemToSlot(slot, item);
      if (item) {
        alert(`${item.name} equipado em ${slot}.`);
      }
    });
  });

  // removemos a tecla F — comportamento agora é por clique
}

// ---------------- inicialização ----------------
window.addEventListener('DOMContentLoaded', async () => {
  setupListeners();
  await initEquipmentUI();

  // tenta preencher nome de jogador do localStorage
  try {
    const cur = JSON.parse(localStorage.getItem('rpg_current_user') || 'null');
    if (cur && cur.username) {
      const el = document.getElementById('player-name');
      if (el) el.textContent = cur.username;
    }
  } catch (e) { /* ignore */ }
});
