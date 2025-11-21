

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


  monster.add([
    k.text(`Level ${props.level || 1}`, { size: 16 }),
    k.color(255, 255, 255),
    k.anchor("top"),          // cola o texto ao topo do próprio objeto
    k.pos(0, 10),             // empurra um pouco para baixo do pé do sprite
    k.z(2)
  ]);
  return monster;


}
