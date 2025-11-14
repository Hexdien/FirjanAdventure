
import { initializerPlayer } from "./initializerPlayer.js";
import { setupPlayerController } from "../controllers/setupPlayerController.js";

export function setupScene(k, ctx, position) {


  // Inicializando objeto player dentro do contexto
  ctx.player = initializerPlayer(k, ctx, position);

  // Configurando controles do player
  setupPlayerController(k, ctx);



}
