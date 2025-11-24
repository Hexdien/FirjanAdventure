
import kaplay from "https://unpkg.com/kaplay@4000.0.0-alpha.23/dist/kaplay.mjs";


// Importe utilitários e cenas
import { setBattle } from "./scenes/battle.js";
import { setInventario } from "./scenes/inventario.js";

import { setupAutoSave } from "./save.js";



// (se seu level também é uma cena com função)

// Outros módulos que você usa (se necessário)
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
import { getPersonagem } from "./controllers/getPersonagem.js";
import { createBattleUI } from "./scenes/battleScene.js";

loadAssets(k);


//k.scene("battle", (worldState, battleState) => setBattle(k, worldState, battleState));
k.scene("battle", (worldState, battleState) => createBattleUI(k, worldState, battleState));
k.scene("world", (worldState) => loadWorld(k, worldState, "1"));
k.scene("world2", (worldState) => loadWorld(k, worldState, "2"));
k.scene("worlds", (worldState) => loadWorld(k, worldState, worldState.atributos.mapZ));

k.scene("inventarioMenu", (worldState) => setInventario(k, worldState));

// Fluxo principal 

(async function main() {

  const ctx = await getPersonagem();

  statsUpdate(ctx);


  //k.go("battle", ctx);
  k.go(mapZpos(ctx), ctx);
  //setupAutoSave(k, ctx)
})();
