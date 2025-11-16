
import { spawnPos } from "../entities/spawnPos.js";
import { spawnPos } from "../entities/cre";


export async function loadWorld(k, ctx, config) {
  const {
    tmjPath,
    mapSprite,
    mapZ,
    portalInName,
    portalOutName,
    enableMonsters = false
  } = config;

  const mapData = await (await fetch(tmjPath)).json();
  const map = k.add([k.pos(0, 0)]);

  let position = null;

  // Sprite principal do mapa
  map.add([k.sprite(mapSprite)]);

  for (const layer of mapData.layers) {
    if (layer.type === "tilelayer") continue;

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

    if (layer.name === "Positions") {
      for (const object of layer.objects) {

        // Spawn do player
        if (object.name === "player" && ctx.atributos.mapZ === mapZ) {
          position = spawnPos(ctx, [object.x, object.y], mapZ);
          continue;
        }

        // Spawn de monstros
        if (enableMonsters && object.name === "monster") {
          createMonster(k, [object.x, object.y]);
          continue;
        }

        // Portal de entrada (ex: "mapa_2")
        if (object.name === portalInName) {
          map.add([
            k.area({ shape: new k.Rect(k.vec2(0), object.width, object.height) }),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            portalInName,
          ]);
          continue;
        }

        // Portal de saída (ex: "mapa1Exit")
        if (object.name === portalOutName && ctx.atributos.mapZ === mapZ) {
          position = spawnPos(ctx, [object.x, object.y], mapZ);
          continue;
        }
      }
    }
  }

  setupScene(k, ctx, position);
}

