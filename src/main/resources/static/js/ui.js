// js/ui.js
import { sendEncounterDecision } from './api.js';
import { applyGameState, updateLog } from './state.js';
import { draw } from './render.js';

// Referências do DOM
const encounterModal = document.getElementById('encounter-modal');
const encounterText  = document.getElementById('encounter-text');
const btnNao = document.getElementById('btn-encontro-nao');
const btnSim = document.getElementById('btn-encontro-sim');

let isDeciding = false; // Trava para evitar cliques duplos

/**
 * Inicializa os botões do modal.
 */
export function initUI() {
  btnSim.addEventListener('click', () => handleDecision(true));
  btnNao.addEventListener('click', () => handleDecision(false));
}

/**
 * Função central que é chamada pelo `state.js` sempre que o estado muda.
 */
export function updateUI(estado, inimigo) {
  if (estado === 'ENCONTRO') {
    showEncounterModal(inimigo);
  } else {
    hideEncounterModal();
  }
}

// --- Funções do Modal ---

function showEncounterModal(inimigo) {
  if (inimigo) {
    encounterText.textContent = `Você encontrou um ${inimigo.tipo}. Deseja lutar?`;
  }
  encounterModal.style.display = 'flex';
  isDeciding = false; // Libera para a próxima decisão
}

function hideEncounterModal() {
  encounterModal.style.display = 'none';
}

/**
 * Lida com o clique no botão (Lutar ou Ignorar).
 */
async function handleDecision(lutar) {
  if (isDeciding) return; // Ignora cliques repetidos
  isDeciding = true;
  
  try {
    // 1. Envia a decisão para a API
    const newState = await sendEncounterDecision(lutar);
    
    // 2. Aplica o novo estado (que vai fechar o modal via updateUI)
    applyGameState(newState);
    
    // 3. Redesenha a cena (agora em BATALHA ou EXPLORACAO)
    draw();
    
  } catch (err) {
    updateLog(`Erro ao decidir: ${err.message}`);
    isDeciding = false; // Libera em caso de erro
  }
}