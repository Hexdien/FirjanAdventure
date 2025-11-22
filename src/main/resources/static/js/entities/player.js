import { playerSpawn } from "../controllers/playerSpawn.js";

export function createPlayer(k, position, ctx, mapConfig) {
  let player = k.add([
    k.sprite("player-idle-front", { anim: "idle" }),
    k.pos(playerSpawn(ctx, position, mapConfig)),
    k.scale(1),
    k.body(),
    k.area(),
    k.anchor("bot"),
    {
      speed: 300,       // Andando
      isRunning: false,
      speedRunning: 600,// Correndo
      isInDialogue: false,
    },
  ])

  return player;
}
