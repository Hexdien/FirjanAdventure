// js/input.js
import { sendMove } from './api.js';
import { applyGameState, lastEstado, updateLog } from './state.js';
import { draw } from './render.js';

let isMoving = false; // Trava para evitar movimentos simultâneos

/**
 * Inicializa o listener de teclado (WASD/Setas).
 */
export function initInputHandler() {
  window.addEventListener('keydown', async (e) => {
    // Bloqueia movimento se estiver em BATALHA, ENCONTRO, ou já se movendo
    if (lastEstado === 'BATALHA' || lastEstado === 'ENCONTRO' || isMoving) {
      return;
    }

    let dx = 0, dy = 0;
    const k = e.key;
    if (k === 'ArrowUp'    || k.toLowerCase() === 'w') dy = -1;
    if (k === 'ArrowDown'  || k.toLowerCase() === 's') dy =  1;
    if (k === 'ArrowLeft'  || k.toLowerCase() === 'a') dx = -1;
    if (k === 'ArrowRight' || k.toLowerCase() === 'd') dx =  1;

    if (dx !== 0 || dy !== 0) {
      e.preventDefault();
      isMoving = true;

      try {
        // 1. Envia o movimento para a API
        const newState = await sendMove(dx, dy);

        // 2. Aplica o novo estado (pode ser EXPLORACAO ou ENCONTRO)
        applyGameState(newState);

        // 3. Redesenha a cena
        draw();

      } catch (err) {
        updateLog(`Erro ao mover: ${err.message}`);
      }

      isMoving = false; // Libera para o próximo movimento
    }
  });
}