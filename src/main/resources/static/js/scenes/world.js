


import { k } from "../main.js";
import { createPlayer } from "../entities/player.js";
import { setupScene } from "../entities/setupScene.js";
import { spawnPos } from "../entities/spawnPos.js";

export async function setWorld(ctx) {


  // ================== Desenhando mapa e instanciando personagem =======================
  const mapData = await (await fetch("../../assets/maps/mapa1.tmj")).json();
  const map = k.add([k.pos(0, 0)]);
  const mapZ = 1;

  let portalParaMapa2 = null;

  let position = null;

  map.add([k.sprite("Map")]);

  map.add([
    k.sprite("Map1trees"),
    k.z(1)
  ]);

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
        if (object.name === "player" && ctx.atributos.mapZ === 1) {
          position = spawnPos(ctx, [object.x, object.y], mapZ);
          ctx.atributos.mapZ = 1;
          continue;
        }

        if (object.name === "mapa_2") {
          portalParaMapa2 = map.add([
            k.area({ shape: new k.Rect(k.vec2(0), object.width, object.height) }),
            k.body({ isStatic: true }),
            k.pos(object.x, object.y),
            "mapa_2",
          ]);

          continue;
        }
        if (object.name === "mapa1Exit" && ctx.atributos.mapZ === 2) {
          position = spawnPos(ctx, [object.x, object.y], mapZ);
          ctx.atributos.mapZ = 1;
          continue;
        }

      }
    }

  }


  // Configurando cena e seus componentes
  setupScene(k, ctx, position);


  /*
  
    player.onCollide("npc", () => {
      player.isInDialogue = true;
      const dialogueBoxFixedContainer = add([fixed()]);
      const dialogueBox = dialogueBoxFixedContainer.add([
        rect(1000, 200),
        outline(5),
        pos(170, 400),
        fixed(),
      ]);
      const dialogue =
        "Defeat all monsters on this island and you'll become the champion!";
      const content = dialogueBox.add([
        text("", {
          size: 42,
          width: 900,
          lineSpacing: 15,
        }),
        color(10, 10, 10),
        pos(40, 30),
        fixed(),
      ]);
  
      if (ctx.faintedMons.length < 4) {
        content.text = dialogue;
      } else {
        content.text = "You're the champion!";
      }
  
      onUpdate(() => {
        if (isKeyDown("space")) {
          destroy(dialogueBox);
          player.isInDialogue = false;
        }
      });
    });
  
    function flashScreen() {
      const flash = add([
        rect(1280, 720),
        color(10, 10, 10),
        fixed(),
        opacity(0),
      ]);
      tween(
        flash.opacity,
        1,
        0.5,
        (val) => (flash.opacity = val),
        easings.easeInBounce
      );
    }
  
    function onCollideWithPlayer(enemyTag, player, ctx) {
      player.onCollide(enemyTag, (other) => {
        flashScreen();
        setTimeout(() => {
          ctx.playerPos = player.pos.clone?.() ?? vec2(player.pos);
          ctx.enemyName = other.monType ?? enemyTag;
          ctx.enemyId = other.monId;
          go("battle", ctx);
        }, 1000);
      });
    }
     onCollideWithPlayer("skeleton", player, ctx);
    onCollideWithPlayer("goblin", player, ctx);
    onCollideWithPlayer("minotaur", player, ctx);
    onCollideWithPlayer("ghost", player, ctx);
  
  */


}
