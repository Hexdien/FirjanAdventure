// js/state.js
import { updateUI } from './ui.js';

// Elemento de Log
const logBox = document.getElementById('log');

// Estado global do frontend
export const playerState = {
    id: null, nome: '',
    hp: 0, mp: 0, level: 0, exp: 0,
    forca: 0, defesa: 0,
    posX: 6, // Posição inicial (exemplo)
    posY: 4, // Posição inicial (exemplo)
};

export let currentEnemy = null;
export let lastEstado = 'EXPLORACAO'; // "EXPLORACAO" | "ENCONTRO" | "BATALHA"
export let lastDelta = { dx: 0, dy: 0 }; // Último movimento que gerou encontro

/**
 * Atualiza o estado do frontend com base na resposta da API.
 * Esta é a função central que sincroniza o frontend com o backend.
 */
export function applyGameState(state) {
  if (!state) return;

  console.debug('[applyGameState] estado=', state.estado, 'monstro=', state.monstro);

  // Atualiza globais para debug e controle
  window._lastState = state; // Para debug no console
  lastEstado = state.estado;
  lastDelta = { dx: state.ultimoDx ?? 0, dy: state.ultimoDy ?? 0 };

  // Atualiza dados do personagem
  if (state.personagem) {
    Object.assign(playerState, {
      id: state.personagem.id,
      nome: state.personagem.nome,
      hp: state.personagem.hp,
      mp: state.personagem.mp,
      level: state.personagem.level,
      exp: state.personagem.exp,
      forca: state.personagem.forca,
      defesa: state.personagem.defesa,
      posX: state.personagem.posX,
      posY: state.personagem.posY
    });
  }

  // Atualiza inimigo
  currentEnemy = state.monstro || null;

  // Atualiza log
  if (state.log && logBox) {
    logBox.textContent = state.log;
  }

  // Atualiza a UI (ex: mostra/esconde modal) com base no novo estado
  updateUI(state.estado, currentEnemy);
}

export function updateLog(message) {
  if (logBox) logBox.textContent = message;
}