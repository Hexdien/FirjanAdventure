
import { MAP_TMX } from './config.js';
import { loadTMX } from './tilemapLoader.js';
import { initRenderer, draw } from './render.js';
import { initInputHandler } from './input.js';
import { initUI } from './ui.js';
import { updateLog } from './state.js'; // applyGameState removido dos imports (não usado aqui)

/**
 * Função de inicialização (Boot)
 */
(async function boot() {
  try {
    updateLog('Carregando mapa...');

    // 1. Inicializa os módulos de UI (botões do modal) e Input (teclado)
    initUI();
    initInputHandler();

    // 2. Inicializa o renderer (canvas)
    initRenderer();

    // 3. Carrega os dados do mapa (TMX)
    await loadTMX(MAP_TMX);

    // ETAPA 4 REMOVIDA (Seleção automática de personagem)
    // Agora você deve selecionar o personagem manualmente via Postman
    // Ex: POST /api/jogo/selecionar/{id}

    // 5. Primeira renderização (apenas o mapa e o player na pos. padrão)
    draw();
  } catch (e) {
    console.error('Falha ao iniciar o jogo:', e);
    updateLog(`ERRO: ${e.message}`);
  }
})();

