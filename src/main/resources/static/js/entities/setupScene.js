
import { setupPlayerController } from "../controllers/setupPlayerController.js";
import { createPlayer } from "./player.js";

export function setupScene(k, ctx, position) {


  // Inicializando objeto player dentro do contexto
  ctx.player = createPlayer(k, position);

  // Configurando controles do player
  setupPlayerController(k, ctx);



}
