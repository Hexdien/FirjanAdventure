import { setupDebugMenu } from "../entities/setupDebugMenu.js";
import { saveGame } from "../save.js";
import { setInventario } from "../scenes/inventario.js";
import { setLevel } from "../scenes/level.js";
import { inventarioUp } from "./inventarioUp.js";
import { levelUp } from "./levelUp.js";


export function setupPlayerController(k, player, ctx, menuLevelUp) {


  player.onCollide("mapa_2", () => {
    k.go("world2", ctx);
  }
  )



  // Atualização da camera e da posição
  let tick = 0;
  k.onUpdate(() => {

    // Posicionando camera no player
    k.camPos(player.pos);

    // Escala da câmera
    k.camScale(2);

    // Atualizando posição do contexto
    ctx.pos.x = player.pos.x;
    ctx.pos.y = player.pos.y;

    tick++;
  });




  // Movimentação 
  function setSprite(player, spriteName) {
    if (player.currentSprite !== spriteName) {
      player.use(k.sprite(spriteName));
      player.currentSprite = spriteName;
    }
  }

  k.onKeyDown("down", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-down");
      player.play("walk");
    }
    player.move(0, player.speed);
  });

  k.onKeyDown("up", () => {

    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-up");
      player.play("walk");
    }
    player.move(0, -player.speed);
  });


  k.onKeyDown("left", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-left");
      player.play("walk");
    }
    player.move(-player.speed, 0);
  });

  k.onKeyDown("right", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-right");
      player.play("walk");
    }
    player.move(player.speed, 0);
  });

  k.onKeyRelease("left", () => {
    setSprite(player, "player-idle-left");
    player.play("idle");
  });

  k.onKeyRelease("right", () => {
    setSprite(player, "player-idle-right");
    player.play("idle");
  });
  k.onKeyRelease("up", () => {
    setSprite(player, "player-idle-back");
    player.play("idle");
  });

  k.onKeyRelease("down", () => {
    setSprite(player, "player-idle-front");
    player.play("idle");
  });

  // Comando para ativar menu de Debug
  k.onKeyPress("t", () => setupDebugMenu(k, ctx));

  // Comando para salvar jogo
  k.onKeyPress("s", () => saveGame(ctx));


  // Comando temporário para subir de nivel
  k.onKeyPress("h", () => menuLevelUp.abrir());



  k.onKeyPress("i", () => inventarioUp(k, ctx));


  k.onKeyPress("p", () => setLevel(k, ctx));


}



