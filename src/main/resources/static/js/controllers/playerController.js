import { setupDebugMenu } from "../entities/setupDebugMenu.js";


export function setupPlayerController(k, player, ctx) {

  // Atualização da camera 
  let tick = 0;
  k.onUpdate(() => {
    k.camPos(player.worldPos());
    k.camScale(2); // ou 1
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


  k.onKeyPress("t", () => setupDebugMenu(k, ctx));

}
