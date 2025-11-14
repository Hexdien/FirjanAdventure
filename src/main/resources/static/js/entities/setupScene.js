
import { criarMenuLevelUp } from "./criarMenuLevelUp.js";
import { initializerPlayer } from "./initializerPlayer.js";
import { setupPlayerController } from "../controllers/setupPlayerController.js";

export function setupScene(k, ctx, position) {


  // Inicializando objeto player dentro do contexto
  ctx.player = initializerPlayer(k, ctx, position);

  // Menu de level up 
  const menuLevelUp = criarMenuLevelUp(k, ctx);

  // Configurando controles do player
  setupPlayerController(k, ctx, menuLevelUp);



}
