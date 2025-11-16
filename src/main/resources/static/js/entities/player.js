export function createPlayer(k, position) {
  let player = k.add([
    k.sprite("player-idle-front", { anim: "idle" }),
    k.pos(position),
    k.scale(1),
    k.body(),
    k.area(),
    k.anchor("bot"),
    {
      speed: 300,       // Andando
      isRunning: false,
      speedRunning: 600,// Correndo
      isInDialogue: false,
      mapTp: false,
    },
  ])

  return player;
}
