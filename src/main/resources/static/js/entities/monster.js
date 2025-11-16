

export function createMonster(k, position) {
  let monster = k.add([
    k.sprite("MINOTAURO", { anim: "idle" }),
    k.pos(position),
    k.scale(1),
    k.body(),
    k.area({
      scale: 0.5,
      offset: { x: 0, y: -30 }
    }),
    k.anchor("bot"),
  ])
  return monster;
}
