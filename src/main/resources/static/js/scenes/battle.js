function setBattle(worldState) {
  add([sprite("battle-background"), scale(1.3), pos(0, 0)]);

  const enemyMon = add([
    sprite(worldState.enemyName + "-mon"),
    scale(5),
    pos(1300, 0),
    opacity(1),
    {
      fainted: false,
    },
  ]);
  enemyMon.flipX = true;

  tween(
    enemyMon.pos.x,
    1000,
    0.3,
    (val) => (enemyMon.pos.x = val),
    easings.easeInSine
  );

  const playerMon = add([
    sprite("player-right"),
    scale(8),
    pos(-100, 300),
    opacity(1),
    {
      fainted: false,
    },
  ]);

  tween(
    playerMon.pos.x,
    300,
    0.3,
    (val) => (playerMon.pos.x = val),
    easings.easeInSine
  );

  const playerMonHealthBox = add([rect(400, 100), outline(4), pos(1000, 400)]);

  playerMonHealthBox.add([
    text("Warrior", { size: 32 }),
    color(10, 10, 10),
    pos(10, 10),
  ]);

  playerMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);

  const playerMonHealthBar = playerMonHealthBox.add([
    rect(370, 10),
    color(0, 200, 0),
    pos(15, 50),
  ]);

  tween(
    playerMonHealthBox.pos.x,
    850,
    0.3,
    (val) => (playerMonHealthBox.pos.x = val),
    easings.easeInSine
  );

  const enemyMonHealthBox = add([rect(400, 100), outline(4), pos(-100, 50)]);

  enemyMonHealthBox.add([
    text(worldState.enemyName.toUpperCase(), { size: 32 }),
    color(10, 10, 10),
    pos(10, 10),
  ]);

  enemyMonHealthBox.add([rect(370, 10), color(200, 200, 200), pos(15, 50)]);

  const enemyMonHealthBar = enemyMonHealthBox.add([
    rect(370, 10),
    color(0, 200, 0),
    pos(15, 50),
  ]);

  tween(
    enemyMonHealthBox.pos.x,
    100,
    0.3,
    (val) => (enemyMonHealthBox.pos.x = val),
    easings.easeInSine
  );

  const box = add([rect(1300, 300), outline(4), pos(-2, 530)]);

  const content = box.add([
    text("Voce esta pronto para a batalha!", { size: 42 }),
    color(10, 10, 10),
    pos(20, 20),
  ]);

  function reduceHealth(ctx, healthBar, damageDealt, entity) {
    if (entity === "monster") {
      ctx.atributos.hp = Math.trunc(Math.max(ctx.atributos.hp - damageDealt, 0)) ?? 0;
      // Calcula proporção para a barra
      const proportion = ctx.atributos.hp / ctx.atributos.hpMax;
      const newWidth = 370 * proportion;

      tween(
        healthBar.width,
        newWidth,
        0.5,
        (val) => (healthBar.width = val),
        easings.easeInSine
      );
      const hpElement = document.getElementById("player-hp");
      const hpMaxElement = document.getElementById("player-maxhp");
      if (hpElement) hpElement.textContent = `${ctx.atributos.hp}`;
      if (hpMaxElement) hpMaxElement.textContent = `${ctx.atributos.hpMax}`;


    } else {
      tween(
        healthBar.width,
        healthBar.width - damageDealt,
        0.5,
        (val) => (healthBar.width = val),
        easings.easeInSine
      );

    }

  }
  function healthUpdate(hp) {
    const hpElement = document.getElementById("player-hp");
    if (hpElement) hpElement.textContent = hp;



  }


  function makeMonFlash(mon) {
    tween(
      mon.opacity,
      0,
      0.3,
      (val) => {
        mon.opacity = val;
        if (mon.opacity === 0) {
          mon.opacity = 1;
        }
      },
      easings.easeInBounce
    );
  }

  let phase = "player-selection";
  let entity = null;
  onKeyPress("space", () => {
    if (playerMon.fainted || enemyMon.fainted) return;

    if (phase === "player-selection") {
      content.text = "> Atacar";
      phase = "player-turn";
      return;
    }

    if (phase === "enemy-turn") {
      entity = "monster"
      content.text = worldState.enemyName.toUpperCase() + " ataca!";
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
      healthBar.use(color(250, 150, 0));
    }

    if (healthBar.width < 100) {
      healthBar.use(color(200, 0, 0));
    }
  }

  function makeMonDrop(mon) {
    tween(mon.pos.y, 800, 0.5, (val) => (mon.pos.y = val), easings.easeInSine);
  }

  onUpdate(() => {

    worldState.atributos = worldState.atributos || {};
    colorizeHealthBar(playerMonHealthBar);
    colorizeHealthBar(enemyMonHealthBar);

    if (enemyMonHealthBar.width < 1 && !enemyMon.fainted) {
      makeMonDrop(enemyMon);
      content.text = worldState.enemyName.toUpperCase() + " fainted!";
      enemyMon.fainted = true;
      setTimeout(() => {
        content.text = "Voce venceu a batalha!";
      }, 1000);
      setTimeout(() => {
        worldState.faintedMons.push(worldState.enemyName);
        go("world", worldState);
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

  onKeyPress("t", () => addDebugHud(worldState));


  let hud = null;

  function addDebugHud(ctx) {
    if (!hud) {
      hud = add([
        text('', { size: 12, lineSpacing: 4 }),
        pos(16, 40),
        fixed(),
        scale(WORLD_SCALE),
        color(0, 0, 0),
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
              `Atributos -> Lv:${a.level ?? 1} HP:${a.hp ?? 0} For:${a.forca ?? 0} Def:${a.defesa ?? 0} XP:${a.xp ?? 0}\n` +
              `Último Save: ${lastTxt}\n` +
              `Pressione 'S' para salvar.`;
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
