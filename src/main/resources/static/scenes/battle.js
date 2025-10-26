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
    sprite("warrior"),
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

  function reduceHealth(healthBar, damageDealt) {
    tween(
      healthBar.width,
      healthBar.width - damageDealt,
      0.5,
      (val) => (healthBar.width = val),
      easings.easeInSine
    );
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
  onKeyPress("space", () => {
    if (playerMon.fainted || enemyMon.fainted) return;

    if (phase === "player-selection") {
      content.text = "> Atacar";
      phase = "player-turn";
      return;
    }

    if (phase === "enemy-turn") {
      content.text = worldState.enemyName.toUpperCase() + " ataca!";
      const damageDealt = Math.random() * 230;

      if (damageDealt > 150) {
        content.text = "O ataque foi critico!";
      }

      reduceHealth(playerMonHealthBar, damageDealt);
      makeMonFlash(playerMon);

      phase = "player-selection";
      return;
    }

    if (phase === "player-turn") {
      const damageDealt = Math.random() * 230;

      if (damageDealt > 150) {
        content.text = "O ataque foi critico!";
      } else {
        content.text = "Guerreiro atacou!";
      }

      reduceHealth(enemyMonHealthBar, damageDealt);
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
    colorizeHealthBar(playerMonHealthBar);
    colorizeHealthBar(enemyMonHealthBar);

    if (enemyMonHealthBar.width < 0 && !enemyMon.fainted) {
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

    if (playerMonHealthBar.width < 0 && !playerMon.fainted) {
      makeMonDrop(playerMon);
      content.text = "Voce perdeu!";
      playerMon.fainted = true;
      setTimeout(() => {
        content.text = "Voce corre para se curar!";
      }, 1000);
      setTimeout(() => {
        worldState.playerPos = vec2(500, 700);
        go("world", worldState);
      }, 2000);
    }
  });
}
