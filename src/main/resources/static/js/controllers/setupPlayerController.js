import { abrirMenuLevelUp } from "../entities/criarMenuLevelUp.js";
import { abrirMenuEquip } from "../entities/equipMenu.js";
import { saveGame } from "../save.js";
import { initBattleState } from "./initBattleState.js";
import { inventarioUp } from "./inventarioUp.js";



export function setupPlayerController(k, ctx) {

  // Definindo player vindo do contexto
  let player = ctx.player;

  player.onCollide("mapa2", () => {
    ctx.lastPortal = "mapa2";
    k.go("world2", ctx);
  }
  )

  player.onCollide("mapa1", () => {
    ctx.lastPortal = "mapa1";
    k.go("world", ctx);
  }
  )

  player.onCollide("monstro", async (monstro) => {
    saveGame(ctx);
    const battleState = await initBattleState(monstro)


    // Carregar cena
    k.go("battle", ctx, battleState);
  });


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

  k.onKeyDown("s", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-down");
      player.facing = "down";
      player.play("walk");
    }
    player.move(0, player.speed);
  });

  k.onKeyDown("w", () => {

    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-up");
      player.facing = "up";
      player.play("walk");
    }
    player.move(0, -player.speed);
  });


  k.onKeyDown("a", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-left");
      player.facing = "left";
      player.play("walk");
    }
    player.move(-player.speed, 0);
  });

  k.onKeyDown("d", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-right");
      player.facing = "right";
      player.play("walk");
    }
    player.move(player.speed, 0);
  });

  k.onKeyRelease("a", () => {
    setSprite(player, "player-idle-left");
    player.play("idle");
  });

  k.onKeyRelease("d", () => {
    setSprite(player, "player-idle-right");
    player.play("idle");
  });
  k.onKeyRelease("w", () => {
    setSprite(player, "player-idle-back");
    player.play("idle");
  });

  k.onKeyRelease("s", () => {
    setSprite(player, "player-idle-front");
    player.play("idle");
  });

  // Comando para ativar menu de Debug
  //k.onKeyPress("t", () => setupDebugMenu(k, ctx));
  k.onKeyPress("t", () => abrirDebugMenu(k, ctx));

  // Comando para salvar jogo
  k.onKeyPress("p", () => saveGame(ctx));


  // Comando temporário para subir de nivel
  k.onKeyPress("h", () => abrirMenuLevelUp(k, ctx));



  k.onKeyPress("u", () => ctx.defeatedMonsters = []);


  // Comando para abrir inventario
  k.onKeyPress("i", () => inventarioUp(k, ctx));



  k.onKeyPress("e", () => {
    abrirMenuEquip(k, ctx);
  });

  k.onKeyPress("g", () => ctx.atributos.hp = ctx.atributos.hpMax);
  k.onKeyPress("r", () => {
    ctx.atributos.xp += 100;
    ctx.atributos.forca += 100;
    ctx.atributos.isLevelUp = 1;
    ctx.atributos.statPoints += 10;
  });


}


