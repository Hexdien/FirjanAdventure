function spawn(ctx, position) {
  const posX = ctx.pos.x;
  const posY = ctx.pos.y;
  if (posX === 0 && posY === 0) {
    return position;
  }
  return [posX, posY];

}

export function createPlayer(k, ctx, position) {
  let player = k.add([
    k.sprite("player-idle-front", { anim: "idle" }),
    k.pos(spawn(ctx, position)),
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
