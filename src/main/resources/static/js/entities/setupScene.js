
import { setupPlayerController } from "../controllers/setupPlayerController.js";
import { introScene } from "../scenes/introScene.js";
import { createPlayer } from "./player.js";
import { statsUpdate } from "./statsUpdate.js";

export function setupScene(k, ctx, position, mapConfig) {



  if (ctx.atributos.mapZ === "intro") {
    console.log("INTRO"); // Cena intro
    introScene(k, ctx);

  } else {
    // Inicializando objeto player dentro do contexto
    ctx.player = createPlayer(k, position, ctx, mapConfig);

    // Configurando controles do player
    setupPlayerController(k, ctx);

    // Atualizando vizualização HTML 
    statsUpdate(ctx);
  }




}
