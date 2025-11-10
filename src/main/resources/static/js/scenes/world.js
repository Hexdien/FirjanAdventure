

import { saveGame } from "../save.js";

import { k } from "../main.js";
import { createPlayer } from "../entities/player.js";
import { setupPlayerController } from "../controllers/playerController.js";


export async function setWorld(ctx) {


  // ================== Desenhando mapa e instanciando personagem =======================
  const mapData = await (await fetch("../../assets/maps/mapateste.tmj")).json();
  const map = k.add([k.pos(0, 0)]);

  map.add([k.sprite("Map")]);

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

          player = createPlayer(k, [object.x, object.y]);
          continue;
        }

      }
    }
  }

  // Configurando controles do player
  setupPlayerController(k, player)






  /*
  
    // Garante que a lista de monstros derrotados exista
    if (!Array.isArray(ctx.faintedMons)) {
      ctx.faintedMons = [];
    }
  
  
  
    let basePos = null;
  
    if (ctx.playerPos) {
      // Clona para evitar compartilhar referência
      basePos = vec2(ctx.playerPos);
    } else if (typeof spawn !== "undefined" && spawn !== null) {
      basePos = vec2(spawn);
    } else {
      basePos = vec2(player.pos);
    }
  
    // Atualiza o state e aplica no player (sempre clonando)
    ctx.playerPos = vec2(basePos);
    player.pos = vec2(ctx.playerPos);
  
    // Remove, com segurança, quaisquer monstros marcados como derrotados
    // `faintedMons` deve conter tags/ids consultáveis via get(<tag>)
  
    for (const tag of ctx.faintedMons) {
      const targets = get(tag);
      if (targets && targets.length > 0) {
        destroy(targets[0]);
      }
    }
   
    function upatributo(ctx) {
      const a = ctx.atributos || {};
      //a.forca++;
      a.hpMax += 10;
    }
  
  
    function levelUpman(ctx) {
      const a = ctx.atributos || {};
      a.level++;
    }
  
    function heal(ctx) {
      const a = ctx.atributos || {};
      a.hp = a.hpMax;
    };
  
  
    function levelUp(ctx, pos) {
      ctx.atributos = ctx.atributos || {};
      const atual = ctx.atributos.level ?? 1;
      ctx.atributos.level = atual + 1;
  
      ctx.level = ctx.atributos.level;
  
      document.getElementById("player-level").textContent = ctx.atributos.level;
  
      go("levelUp", ctx);
    }
  
    onKeyPress("i", () => {
      ctx.playerPos = player.pos.clone();
      go("inventarioMenu", ctx);
    });
  
  
    // Debug commands -- Será removido no futuro TODO: Remover no futuro
  
  
    onKeyPress('s', () => { saveGame(ctx); });
  
    onKeyPress("t", () => addDebugHud(ctx));
  
  
    onKeyPress('f', () => { upatributo(ctx); });
  
  
    onKeyPress('l', () => { levelUpman(ctx); });
  
  
    onKeyPress("h", () => {
      ctx.playerPos = player.pos.clone();
      levelUp(ctx, ctx.playerPos);
    });
  
    onKeyPress('g', () => { heal(ctx); });
  
  
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
  
  
    function formatTime(ms) {
      const d = new Date(ms);
      return d.toLocaleTimeString();
    }
  
  
  
  
  
  
    onCollideWithPlayer("skeleton", player, ctx);
    onCollideWithPlayer("goblin", player, ctx);
    onCollideWithPlayer("minotaur", player, ctx);
    onCollideWithPlayer("ghost", player, ctx);
  
  */

  // Debug Menu 
  let hud = null;
  hud = addDebugHud(ctx);

  function addDebugHud(ctx) {
    if (!hud) {
      hud = k.add([
        k.text('', { size: 12, lineSpacing: 4 }),
        k.pos(16, 40),
        k.fixed(),
        k.scale(4),
        k.color(0, 0, 0),
        k.z(9999),
        {
          update() {
            const a = ctx.atributos || {};
            const last = ctx._lastSave || null;
            const lastTxt = !last
              ? 'nunca'
              : (last.ok ? `OK às ${formatTime(last.at)}` : `ERRO(${last.status ?? '??'}) às ${formatTime(last.at)}`);

            this.text =
              `ID: ${ctx.id}\n` +
              `Nome: ${ctx.nome}\n` +
              `Pos: ${Math.round(ctx.player?.pos.x ?? 0)}, ${Math.round(ctx.player?.pos.y ?? 0)}\n` +
              `Atributos -> Lv:${a.level ?? 1} For:${a.forca ?? 0} Def:${a.defesa ?? 0} XP:${a.xp ?? 0}\n` +
              `Atributos -> HP:${a.hp ?? 0}/ HP:${a.hpMax ?? 0} \n` +
              `Último Save: ${lastTxt}\n` +
              `Pressione 'S' para salvar.\n` +
              `Pressione 'F' para aumentar vida maxima.\n` +
              `Pressione 'L' para aumentar level.\n` +
              `Pressione 'H' abrir menu de level up.`;
          }
        }
      ]);

      return hud;
    } else {
      hud.destroy();
      hud = null;
      return null;
    }
  }



}
