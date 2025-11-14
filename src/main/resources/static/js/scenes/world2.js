



import { k } from "../main.js";
import { createPlayer } from "../entities/player.js";
import { setupPlayerController } from "../controllers/setupPlayerController.js";
import { setupDebugMenu } from "../entities/setupDebugMenu.js";
import { criarMenuLevelUp } from "../entities/criarMenuLevelUp.js";
import { setupScene } from "../entities/setupScene.js";
import { spawnPos } from "../entities/spawnPos.js";

export async function setWorld2(ctx) {


  // ================== Desenhando mapa e instanciando personagem =======================
  const mapData = await (await fetch("../../assets/maps/mapa2.tmj")).json();
  const map = k.add([k.pos(0, 0)]);

  const mapZ = 2;

  let portalParaMapa1 = null;
  let position = null;

  map.add([k.sprite("Map2")]);


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
        if (object.name === "player") {

          //position = spawnPos(ctx, [object.x, object.y]);
          //TODO : Função para definir posição do player ao spawn se no mapa possuir o objeto player 

          continue;
        }
        if (object.name === "mapa_1") {
          portalParaMapa1 = map.add([
            k.area({ shape: new k.Rect(k.vec2(0), object.width, object.height) }),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "mapa_1",
          ]);

          //position = portalParaMapa1.pos;

          continue;
        }
        if (object.name === "mapa2Exit") {
          position = spawnPos(ctx, [object.x, object.y], mapZ);
          ctx.atributos.mapZ = 2;
          continue;

        }


      }
    }

  }

  // Configurando cena e contexto
  setupScene(k, ctx, position)


}
