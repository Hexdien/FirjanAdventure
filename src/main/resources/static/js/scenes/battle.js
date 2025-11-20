

import { markDefeated } from "../save.js";

export function setBattle(k, worldState, btl) {
  k.add([k.sprite("battle-background"), k.scale(1.3), k.pos(0, 0)]);

  const enemyMon = k.add([
    k.sprite(btl.tipo, { anim: "idle" }),
    k.scale(5),
    k.pos(1300, 0),
    k.opacity(1),
    {
      fainted: false,
    },
  ]);
  enemyMon.flipX = true;

  k.tween(
    enemyMon.pos.x,
    1000,
    0.3,
    (val) => (enemyMon.pos.x = val),
    k.easings.easeInSine
  );

  const playerMon = k.add([
    k.sprite("player-right"),
    k.scale(8),
    k.pos(-100, 300),
    k.opacity(1),
    {
      fainted: false,
    },
  ]);

  k.tween(
    playerMon.pos.x,
    300,
    0.3,
    (val) => (playerMon.pos.x = val),
    k.easings.easeInSine
  );

  const playerMonHealthBox = k.add([k.rect(400, 100), k.outline(4), k.pos(1000, 400)]);

  playerMonHealthBox.add([
    k.text("Warrior", { size: 32 }),
    k.color(10, 10, 10),
    k.pos(10, 10),
  ]);

  playerMonHealthBox.add([k.rect(370, 10), k.color(200, 200, 200), k.pos(15, 50)]);

  const playerMonHealthBar = playerMonHealthBox.add([
    k.rect(370, 10),
    k.color(0, 200, 0),
    k.pos(15, 50),
  ]);

  k.tween(
    playerMonHealthBox.pos.x,
    850,
    0.3,
    (val) => (playerMonHealthBox.pos.x = val),
    k.easings.easeInSine
  );

  const enemyMonHealthBox = k.add([k.rect(400, 100), k.outline(4), k.pos(-100, 50)]);

  enemyMonHealthBox.add([
    k.text(btl.tipo, { size: 32 }),
    k.color(10, 10, 10),
    k.pos(10, 10),
  ]);

  enemyMonHealthBox.add([k.rect(370, 10), k.color(200, 200, 200), k.pos(15, 50)]);

  const enemyMonHealthBar = enemyMonHealthBox.add([
    k.rect(370, 10),
    k.color(0, 200, 0),
    k.pos(15, 50),
  ]);

  k.tween(
    enemyMonHealthBox.pos.x,
    100,
    0.3,
    (val) => (enemyMonHealthBox.pos.x = val),
    k.easings.easeInSine
  );

  const box = k.add([k.rect(1300, 300), k.outline(4), k.pos(-2, 530)]);

  const content = box.add([
    k.text("Voce esta pronto para a batalha!", { size: 42 }),
    k.color(10, 10, 10),
    k.pos(20, 20),
  ]);

  function reduceHealth(ctx, healthBar, damageDealt, entity) {
    if (entity === "monster") {
      ctx.atributos.hp = Math.trunc(Math.max(ctx.atributos.hp - damageDealt, 0)) ?? 0;
      // Calcula proporção para a barra
      const proportion = ctx.atributos.hp / ctx.atributos.hpMax;
      const newWidth = 370 * proportion;

      k.tween(
        healthBar.width,
        newWidth,
        0.5,
        (val) => (healthBar.width = val),
        k.easings.easeInSine
      );
      const hpElement = document.getElementById("player-hp");
      const hpMaxElement = document.getElementById("player-maxhp");
      if (hpElement) hpElement.textContent = `${ctx.atributos.hp}`;
      if (hpMaxElement) hpMaxElement.textContent = `${ctx.atributos.hpMax}`;


    } else {
      k.tween(
        healthBar.width,
        healthBar.width - damageDealt,
        0.5,
        (val) => (healthBar.width = val),
        k.easings.easeInSine
      );

    }

  }
  function healthUpdate(hp) {
    const hpElement = document.getElementById("player-hp");
    if (hpElement) hpElement.textContent = hp;



  }


  function makeMonFlash(mon) {
    k.tween(
      mon.opacity,
      0,
      0.3,
      (val) => {
        mon.opacity = val;
        if (mon.opacity === 0) {
          mon.opacity = 1;
        }
      },
      k.easings.easeInBounce
    );
  }

  let phase = "player-selection";
  let entity = null;
  k.onKeyPress("space", () => {
    if (playerMon.fainted || enemyMon.fainted) return;

    if (phase === "player-selection") {
      content.text = "> Atacar";
      phase = "player-turn";
      return;
    }

    if (phase === "enemy-turn") {
      entity = "monster"
      content.text = "ataca!";
      const damageDealt = Math.random() + 23;
      //const damageDealt = 50;

      if (damageDealt > 15) {
        content.text = "O ataque foi critico!";
      }

      reduceHealth(worldState, playerMonHealthBar, damageDealt, entity);
      makeMonFlash(playerMon);

      phase = "player-selection";
      return;
    }

    if (phase === "player-turn") {
      entity = "player"
      const damageDealt = Math.random() + (worldState.atributos.forca + 23);
      //const damageDealt = 50;

      if (damageDealt > 65) {
        content.text = "O ataque foi critico!";
      } else {
        content.text = "Guerreiro atacou!";
      }

      reduceHealth(worldState, enemyMonHealthBar, damageDealt, entity);
      makeMonFlash(enemyMon);

      phase = "enemy-turn";
    }
  });

  function colorizeHealthBar(healthBar) {
    if (healthBar.width < 200) {
      healthBar.use(k.color(250, 150, 0));
    }

    if (healthBar.width < 100) {
      healthBar.use(k.color(200, 0, 0));
    }
  }

  function makeMonDrop(mon) {
    k.tween(mon.pos.y, 800, 0.5, (val) => (mon.pos.y = val), k.easings.easeInSine);
  }

  k.onUpdate(() => {

    worldState.atributos = worldState.atributos || {};
    colorizeHealthBar(playerMonHealthBar);
    colorizeHealthBar(enemyMonHealthBar);

    if (enemyMonHealthBar.width < 1 && !enemyMon.fainted) {
      makeMonDrop(enemyMon);
      content.text = " fainted!";
      enemyMon.fainted = true;
      setTimeout(() => {
        content.text = "Voce venceu a batalha!";
      }, 1000);
      setTimeout(async () => {
        //Atualizar localmente
        worldState.faintedMonIds = worldState.faintedMonIds || [];
        if (!worldState.faintedMonIds.includes(worldState.enemyId)) {
          worldState.faintedMonIds.push(worldState.enemyId);
        }

        // Envia pro backend
        await markDefeated({
          characterId: worldState.id,
          mapId: worldState.mapId || "world-1",
          spawnId: worldState.enemyId,
        });


        k.go("world", worldState);
      }, 2000);
    }

    //if (playerMonHealthBar.width < 0 && !playerMon.fainted) {
    if (worldState.atributos.hp === 0 && !playerMon.fainted) {
      makeMonDrop(playerMon);
      content.text = "Voce perdeu!";
      playerMon.fainted = true;
      setTimeout(() => {
        content.text = "Voce corre para se curar!";
      }, 1000);
      setTimeout(() => {
        worldState.playerPos = vec2(942 * 4, 211 * 4);
        //worldState.atributos.hp = worldState.atributos.hpMax;
        worldState.atributos.hp = worldState.atributos.hpMax;
        healthUpdate(worldState.atributos.hp)
        go("world", worldState);
      }, 2000);
    }
  });


}
