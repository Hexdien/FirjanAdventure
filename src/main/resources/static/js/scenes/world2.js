



import { k } from "../main.js";
import { createPlayer } from "../entities/player.js";
import { setupPlayerController } from "../controllers/playerController.js";
import { setupDebugMenu } from "../entities/setupDebugMenu.js";
import { criarMenuLevelUp } from "../entities/criarMenuLevelUp.js";

export async function setWorld2(ctx) {


  // ================== Desenhando mapa e instanciando personagem =======================
  const mapData = await (await fetch("../../assets/maps/mapa2.tmj")).json();
  const map = k.add([k.pos(0, 0)]);

  map.add([k.sprite("Map2")]);

  let player = null;
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

          player = ctx.player;
          continue;
        }



      }
    }

  }

  // Adicionando instancia do player ao contexto do mundo
  //ctx.player = player;

  console.log(ctx.player);
  // Menu de level up 
  const menuLevelUp = criarMenuLevelUp(k, ctx, player);

  // Configurando controles do player
  setupPlayerController(k, player, ctx, menuLevelUp);

  // Configurando Menu de Debug 
  setupDebugMenu(k, ctx);


}
