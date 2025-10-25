// js/api.js
import { API_BASE } from './config.js';

/**
 * Função genérica para POST (usada por mover e decidir).
 */
export async function apiPost(path, body) {
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body ?? {})
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => '');
      throw new Error(`HTTP ${res.status} - ${txt}`);
    }
    return res.json();
  } catch (err) {
    console.error(`Falha na API ${path}:`, err);
    throw err; // Repassa o erro para quem chamou
  }
}

/**
 * Envia o movimento para a API.
 * Retorna o novo GameState.
 */
export async function sendMove(dx, dy) {
  // Salva o delta do input (fallback caso o backend não envie)
  window._lastInputDelta = { dx, dy }; 
  return apiPost('/api/jogo/mover', { dx, dy });
}

/**
 * Envia a decisão do encontro (lutar ou ignorar).
 * Retorna o novo GameState.
 */
export async function sendEncounterDecision(lutar) {
  return apiPost('/api/jogo/encontro/decisao', { lutar });
}