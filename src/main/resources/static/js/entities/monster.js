

export function createMonster(k, position, object) {

  // 1 linha: converte array → objeto simples
  const props = Object.fromEntries(object.properties.map(p => [p.name, p.value]));

  let monster = k.add([
    k.sprite("MINOTAURO", { anim: "idle" }),
    k.pos(position),
    k.scale(1),
    k.body({ isStatic: true }),
    k.area({
      scale: 0.5,
      offset: { x: 0, y: -30 }
    }),
    k.anchor("bot"),
    "monstro",

    // ID do monstro vindo do Tiled
    {
      idTiled: object.id,
      ...props,

    }
  ])
  return monster;
}
