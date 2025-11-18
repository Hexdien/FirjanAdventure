
import { createMonster } from "../entities/monster.js";
import { spawnPos } from "../entities/spawnPos.js";
import { setupScene } from "../entities/setupScene.js";
import { mundos } from "../data/worldConfigs.js";

export async function loadWorld(k, ctx, worldName) {

  const config = mundos[worldName];
  if (!config) throw new Error(`Mapa não configurado: ${worldName}`);

  ctx.lastPortal = null;

  const mapData = await (await fetch(config.file)).json();
  const map = k.add([k.pos(0, 0)]);


  let position = null;

  // Adicionando sprites do mapa
  config.sprites.forEach(sprite => {
    map.add([
      k.sprite(sprite.name),
      k.z(sprite.z ?? 1),

    ]);

  });


  // Percorre layers
  for (const layer of mapData.layers) {

    if (layer.type === "tilelayer") continue;


    // Colliders { Aqui será objetos denso e colisões}
    if (layer.name === "Colliders") {
      for (const object of layer.objects) {
        map.add([
          k.area({ shape: new k.Rect(k.vec2(0), object.width, object.height) }),
          k.body({ isStatic: true }),
          k.pos(object.x, object.y),
        ]);
      }
      continue;
    }

    // Positions { Posições de spawn e teleporte }
    if (layer.name === "Positions") {
      for (const object of layer.objects) {

        // Spawn do player
        if (object.name === "player" && ctx.atributos.mapZ === config.mapZ) {
          position = spawnPos(ctx, [object.x, object.y], config.mapZ);
          continue;
        }

        // Spawn de monstros
        if (config.enableMonsters && object.name === "monster") {
          createMonster(k, [object.x, object.y]);
          continue;
        }

        // Portal de entrada (ex: "mapa_2")
        if (config.mapExit.includes(object.name)) {
          map.add([
            k.area({ shape: new k.Rect(k.vec2(0), object.width, object.height) }),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            `${config.mapExit}`
          ]);
          continue;
        }

        // Portal de saída (ex: "mapa1Exit")
        if (config.mapEntrance.includes(object.name)) {
          position = spawnPos(ctx, [object.x, object.y], config.mapZ);
          continue;
        }
      }
    }
  }


  // Definindo qual mapa o contexto do player está
  ctx.atributos.mapZ = config.mapZ;


  // Configurando cena
  setupScene(k, ctx, position);
}


