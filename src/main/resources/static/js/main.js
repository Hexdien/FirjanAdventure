
import kaplay from "https://unpkg.com/kaplay@4000.0.0-alpha.23/dist/kaplay.mjs";


// Importe utilitários e cenas
import { setWorld2 } from "./scenes/world2.js";
import { setBattle } from "./scenes/battle.js";
import { setInventario } from "./scenes/inventario.js";
import { getQueryParam } from "./game.js";
import { fetchJSON } from "./game.js";
import { setupAutoSave } from "./save.js";




// (se seu level também é uma cena com função)

// Outros módulos que você usa (se necessário)
import "./equipment.js";
import "./game.js";

const canvasEl = document.getElementById('gameCanvas');
export const k = kaplay({
  width: 1280,
  height: 720,
  scale: 1,             // não usamos scale do kaboom aqui; o CSS escala o elemento
  clearColor: [0.137, 0.596, 0.878, 1], // cor RGBA (opcional)
  crisp: true,
  canvas: canvasEl,
  global: false,
});




k.setBackground(0, 0, 0);

import { loadAssets } from "./assetLoader.js";
import { statsUpdate } from "./entities/statsUpdate.js";
import { mapZpos } from "./entities/spawnPos.js";
import { loadWorld } from "./controllers/loadWorld.js";

loadAssets(k);


k.scene("battle", (worldState) => setBattle(k, worldState));
k.scene("world", (worldState) => loadWorld(k, worldState, "mapa1"));
k.scene("world2", (worldState) => loadWorld(k, worldState, "mapa2"));

k.scene("inventarioMenu", (worldState) => setInventario(k, worldState));

// Fluxo principal 

(async function main() {
  const personagemId = getQueryParam('personagemId');
  if (!personagemId) {
    alert('personagemId não informado. Retornando ao login.');
    window.location.href = '/login.html';
    return;
  }

  // 1) Carregar estado do backend
  let personagem;
  try {
    personagem = await fetchJSON(`/api/personagens/${encodeURIComponent(personagemId)}`);
    // Opcional: snapshot local
    localStorage.setItem('personagem:last', JSON.stringify(personagem));
  } catch (err) {
    console.error('Falha ao buscar personagem do backend:', err);
    const snap = localStorage.getItem('personagem:last');
    if (snap) {
      personagem = JSON.parse(snap);
      alert('Carregando snapshot local (API indisponível).');
    } else {
      alert('Não foi possível carregar o personagem. Retornando ao login.');
      window.location.href = '/login.html';
      return;
    }
  }

  // 2) Montar contexto do jogo a partir do DTO de resposta
  const attrs = personagem.atributos || {};
  const ctx = {
    id: personagem.id,
    nome: personagem.nome,
    sexo: personagem.sexo,
    pos: { x: personagem.posX || 0, y: personagem.posY || 0 },
    atributos: {
      level: attrs.level ?? attrs.nivel ?? 1,
      hpMax: attrs.hpMax ?? 100,
      hp: attrs.hp ?? attrs.hpMax ?? 100,
      forca: attrs.forca ?? 0,
      defesa: attrs.defesa ?? 0,
      xp: attrs.xp ?? 0,
      statPoints: attrs.statPoints ?? 0,
      mapZ: attrs.mapZ ?? 1,
      // se tiver outros (agilidade, etc.) eles virão aqui
      ...attrs,
    },
    atualizadoEm: personagem.atualizadoEm,
  };


  statsUpdate(ctx);


  //k.go("battle", ctx);
  k.go(mapZpos(ctx), ctx);
  //setupAutoSave(k, ctx)
})();
