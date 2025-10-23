// === [NOVO] - EQUIPAMENTO: manipulação DOM, persistência e simulador de "achar item"
// estrutura de exemplo de itens (id, name, slot, img, attackBonus, hpBonus)
const EXAMPLE_ITEMS = [
    { id:'sword_01', name:'Espada Curta', slot:'weapon', img:'imagens/itens/espada1.png', attack:6, hp:0 },
    { id:'shield_01', name:'Escudo de Ferro', slot:'shield', img:'imagens/itens/escudo.png', attack:0, hp:10 },
    { id:'helmet_01', name:'Elmo de Couro', slot:'head', img:'imagens/itens/capacete1.png', attack:0, hp:5 },
    { id:'boots_01', name:'Botas Ágeis', slot:'boots', img:'imagens/itens/armPerna.png', attack:2, hp:0 },
    { id:'armor_01', name:'Peitoral Simples', slot:'body', img:'imagens/itens/arm1.png', attack:0, hp:12 },
    { id:'ring_01', name:'Anel Rúnico', slot:'acc', img:'imagens/itens/anel.png', attack:3, hp:3 }
  ];
  
  // carga/persistência
  function loadEquipment() {
    try { return JSON.parse(localStorage.getItem('rpg_equipment') || '{}'); }
    catch(e){ return {}; }
  }
  function saveEquipment(obj) { localStorage.setItem('rpg_equipment', JSON.stringify(obj)); }
  
  // inicializa UI dos slots a partir do storage
  function initEquipmentUI() {
    const equip = loadEquipment(); // { slotName: itemObject }
    document.querySelectorAll('.slot').forEach(slotEl => {
      const slotName = slotEl.dataset.slot;
      const imgEl = slotEl.querySelector('.slot-img');
      const item = equip[slotName];
      if (item) {
        slotEl.classList.add('equipped');
        imgEl.src = item.img;
        imgEl.alt = item.name;
        slotEl.dataset.itemId = item.id;
        slotEl.title = item.name;
      } else {
        slotEl.classList.remove('equipped');
        imgEl.src = '';
        imgEl.alt = '';
        delete slotEl.dataset.itemId;
        slotEl.title = slotEl.dataset.slot;
      }
    });
    updatePlayerStatsFromEquipment();
  }
  
  // aplica alteração de stats ao equipar (exemplo simples)
  function updatePlayerStatsFromEquipment() {
    const eq = loadEquipment();
    let bonusAtk = 0, bonusHp = 0;
    Object.values(eq).forEach(it => {
      if (it) { bonusAtk += (it.attack || 0); bonusHp += (it.hp || 0); }
    });
    // exibe valores (você pode mesclar com playerStatus)
    const baseAtk = 30; // se quiser, pegue de playerStatus.attack
    const baseHp = 100;
    document.getElementById('player-attack').textContent = baseAtk + bonusAtk;
    document.getElementById('player-hp').textContent = baseHp + bonusHp;
  }
  
  // equipar item em slot (salva)
  function equipItemToSlot(slotName, item) {
    const equip = loadEquipment();
    equip[slotName] = item;
    saveEquipment(equip);
    initEquipmentUI();
  }
  
  // desequipar slot
  function unequipSlot(slotName) {
    const equip = loadEquipment();
    delete equip[slotName];
    saveEquipment(equip);
    initEquipmentUI();
  }
  
  // desequipar tudo
  document.getElementById('unequip-all').addEventListener('click', () => {
    localStorage.removeItem('rpg_equipment');
    initEquipmentUI();
  });
  
  // clique nos slots: abre confirm para desequipar se equipado
  document.querySelectorAll('.slot').forEach(el => {
    el.addEventListener('click', () => {
      const slot = el.dataset.slot;
      if (el.classList.contains('equipped')) {
        if (confirm('Desequipar ' + el.title + '?')) {
          unequipSlot(slot);
        }
      } else {
        alert('Slot vazio. Encontre um item para equipar (pressione F para simular).');
      }
    });
  });
  
  // tecla F -> simula encontrar item aleatório
  document.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'f') {
      const item = EXAMPLE_ITEMS[Math.floor(Math.random() * EXAMPLE_ITEMS.length)];
      // perguntar equipar no slot correspondente
      const ok = confirm(`Você encontrou: ${item.name}\nSlot: ${item.slot}\nDeseja equipar?`);
      if (!ok) return;
      // se já tiver algo no slot, pergunta se quer substituir
      const current = loadEquipment()[item.slot];
      if (current) {
        if (!confirm(`Slot ${item.slot} já possui ${current.name}. Substituir?`)) return;
      }
      equipItemToSlot(item.slot, item);
      alert(`${item.name} equipado em ${item.slot}.`);
    }
  });
  
  // ao carregar a página, inicializa
  window.addEventListener('load', () => {
    // tenta preencher nome de jogador do localStorage (se houver)
    try {
      const cur = JSON.parse(localStorage.getItem('rpg_current_user') || 'null');
      if (cur && cur.username) document.getElementById('player-name').textContent = cur.username;
    } catch(e){ /* ignore */ }
  
    initEquipmentUI();
  });
  