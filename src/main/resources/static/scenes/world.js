

function gidToFrame(tilesets, gid) {
  if (!gid) return null;
  let chosen = null;
  for (const ts of tilesets) {
    if (gid >= ts.firstgid && gid < ts.firstgid + ts.tilecount) {
      chosen = ts;
    }
  }
  if (!chosen) return null;
  return {
    spriteName: chosen.name ?? `tileset_${chosen.firstgid}`,
    frame: gid - chosen.firstgid,
  };
}


const WORLD_SCALE = 4;

async function setWorld(worldState) {
  let player = null;





  console.log(worldState);
  function makeTile(type) {
    return [sprite("tile"), { type }];
  }

  //============================================================================================================================================

  const tiled = await (await fetch("/assets/maps/mapa.json?v=" + Date.now())).json();

  let spawn = vec2(64, 64);
  let spawnDefault = null ?? vec2(100, 100);



  const tilesets = [
    { name: "turfs", firstgid: 1, tilecount: 110 },  // bate com slice 11 x 10
    { name: "Grass", firstgid: 111, tilecount: 144 },  // bate com slice 12 x 12
  ];



  const tiledLevels = [];


  for (const tileLayer of tiled.layers) {



    if (tileLayer.type === "objectgroup") {
      const sp = tileLayer.objects?.find(o => o.name === "playerSpawn");
      if (sp) {
        // NOTA: o Tiled posiciona y pelo topo; o sprite do player costuma “encostar no chão”
        // Ajustamos descendo uma altura de tile:
        const ox = tileLayer.offsetx ?? 0;
        const oy = tileLayer.offsety ?? 0;
        spawnDefault = vec2((ox + sp.x) * WORLD_SCALE, (oy + sp.y) * WORLD_SCALE);
      }
      continue; // não é tilelayer; seguimos para próxima
    }
    /*
        // 1) Spawn do player: usa pos do backend ou fallback (64,64)
        spawn = vec2(
          worldState?.pos?.x ?? spawnDefault,
          worldState?.pos?.y ?? spawnDefault
        )

    */
    /*
    pegar a posX e posY do backend
    SE for 0,0
    user spawnDefault
    senao, spawn = world
    */


    if (tileLayer.type !== "tilelayer" || !tileLayer.visible) continue;


    const node = add([pos(0, 0)]);  // container desta layer
    const { width, height, data } = tileLayer;

    for (let i = 0; i < data.length; i++) {
      const gid = data[i];
      if (!gid) continue;

      const col = i % width;
      const row = Math.floor(i / width);
      const x = col * tiled.tilewidth;
      const y = row * tiled.tileheight;

      const ref = gidToFrame(tilesets, gid);
      if (!ref) continue;

      // ✅ IMPORTANTE: adicionar como filho da layer (node), não no root
      node.add([
        sprite(ref.spriteName, { frame: ref.frame }),
        pos(x, y),
        { type: null }, // defina se quiser usar tile.play(type)
      ]);
    }

    // colisão por layer (propriedade collides = true no Tiled)
    const isCollidable = Array.isArray(tileLayer.properties)
      && tileLayer.properties.some(p => p.name === "collides" && p.value === true);

    if (isCollidable) {
      for (const child of node.children) {
        child.use(area());
        child.use(body({ isStatic: true }));
      }
    }

    tiledLevels.push(node);
  }

  //==========================================================================================================================================================



  const bx = worldState?.pos?.x;
  const by = worldState?.pos?.y;

  if (bx === 0 && by === 0) {
    spawn = spawnDefault;
  } else {
    spawn = vec2(bx, by)
  }

  for (const layer of tiled.layers) {
    if (layer.type !== "tilelayer" || !layer.visible) continue;



    const map = [
      // ... suas addLevel antigas, se quiser manter
      // addLevel(...),
      // addLevel(...),
      // addLevel(...),

      // agora as do Tiled:
      ...tiledLevels,
    ];

    // Aplique o seu scale e animações por 'type' (se definido)
    for (const lvl of map) {
      lvl.use(scale(4));
      for (const tile of lvl.children) {
        if (tile.type) {
          tile.play(tile.type);
        }
      }
    }


  }


  add([
    sprite("mini-mons"),
    area(),
    body({ isStatic: true }),
    pos(100, 700),
    scale(2),
    "cat",
  ]);

  const spiderMon = add([
    sprite("mini-mons"),
    area(),
    body({ isStatic: true }),
    pos(400, 300),
    scale(2),
    "spider",
  ]);
  spiderMon.play("spider");
  spiderMon.flipX = true;

  const centipedeMon = add([
    sprite("mini-mons"),
    area(),
    body({ isStatic: true }),
    pos(100, 300),
    scale(2),
    "centipede",
  ]);
  centipedeMon.play("centipede");

  const grassMon = add([
    sprite("mini-mons"),
    area(),
    body({ isStatic: true }),
    pos(900, 570),
    scale(2),
    "grass",
  ]);
  grassMon.play("grass");

  add([
    sprite("npc"),
    scale(5),
    pos(600, 700),
    area(),
    body({ isStatic: true }),
    "npc",
  ]);

  add([
    sprite("minotaur"),
    scale(WORLD_SCALE),
    pos(600, 700),
    area(),
    body({ isStatic: true }),
    "minotaur",
  ]);

  add([
    sprite("ghost"),
    scale(WORLD_SCALE),
    pos(600, 900),
    area(),
    body({ isStatic: true }),
    "ghost",
  ]);




  add([
    pos(spawn),
    rect(6, 6),
    color(255, 0, 0),
    anchor("center"),
    z(9999),
  ]);


  player = add([
    sprite("player-down"),
    pos(spawn),
    scale(4),
    body(),
    area(),
    anchor("bot"),
    {
      currentSprite: "player-down",
      speed: 300,       // Andando
      isRunning: false,
      speedRunning: 600,// Correndo
      isInDialogue: false,
    },
  ]);
  worldState.player = player;





  worldState = worldState ?? {};

  // Garante que a lista de monstros derrotados exista
  if (!Array.isArray(worldState.faintedMons)) {
    worldState.faintedMons = [];
  }



  let basePos = null;

  if (worldState.playerPos) {
    // Clona para evitar compartilhar referência
    basePos = vec2(worldState.playerPos);
  } else if (typeof spawn !== "undefined" && spawn !== null) {
    basePos = vec2(spawn);
  } else {
    basePos = vec2(player.pos);
  }

  // Atualiza o state e aplica no player (sempre clonando)
  worldState.playerPos = vec2(basePos);
  player.pos = vec2(worldState.playerPos);

  // Remove, com segurança, quaisquer monstros marcados como derrotados
  // `faintedMons` deve conter tags/ids consultáveis via get(<tag>)
  for (const tag of worldState.faintedMons) {
    const targets = get(tag);
    if (targets && targets.length > 0) {
      destroy(targets[0]);
    }
  }


  /*
    if (!worldState) {
      worldState = {
        playerPos: player.pos,
        faintedMons: [],
      };
    }
  
    for (const faintedMon of worldState.faintedMons) {
      destroy(get(faintedMon)[0]);
    }
  */

  let tick = 0;
  onUpdate(() => {
    camPos(player.pos);
    camScale(0.6),
      tick++;
    if (
      (isKeyDown("down") || isKeyDown("up")) &&
      tick % 20 === 0 &&
      !player.isInDialogue
    ) {
      player.flipX = !player.flipX;
    }
  });

  function setSprite(player, spriteName) {
    if (player.currentSprite !== spriteName) {
      player.use(sprite(spriteName));
      player.currentSprite = spriteName;
    }
  }

  onKeyDown("down", () => {
    if (player.isInDialogue) return;
    player.flipX = true;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-down");
      player.play("walk");
    }
    player.move(0, player.speed);
  });

  onKeyDown("up", () => {

    if (player.isInDialogue) return;
    player.flipX = true;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-up");
      player.play("walk");
    }
    player.move(0, -player.speed);
  });


  onKeyDown("left", () => {
    if (player.isInDialogue) return;
    player.flipX = false;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-side");
      player.play("walk");
    }
    player.move(-player.speed, 0);
  });

  onKeyDown("right", () => {
    if (player.isInDialogue) return;
    player.flipX = true;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-side");
      player.play("walk");
    }
    player.move(player.speed, 0);
  });

  onKeyRelease("left", () => {
    player.play("idle");
    player.stop();
  });

  onKeyRelease("right", () => {
    player.play("idle");
    player.stop();
  });
  onKeyRelease("up", () => {
    player.play("idle");
    player.stop();
  });

  onKeyRelease("down", () => {
    player.play("idle");
    player.stop();
  });



  onKeyPress('s', () => { saveGame(worldState); });


  player.use({ ctx: worldState });

  function forcaup(ctx) {
    const a = ctx.atributos || {};
    a.forca++;
    //  a.level++;
  }

  // Em "game"

  onKeyPress('f', () => { forcaup(worldState); });


  function levelUpman(ctx) {
    const a = ctx.atributos || {};
    a.level++;
  }

  // Em "game"

  onKeyPress('l', () => { levelUpman(worldState); });
  /*
    function levelUp(ctx) {
      //const a = ctx.atributos || {};
      //  a.forca++;
      //  a.level++;
      go("levelUpMenu", ctx); // nome exato e em minúsculas
    }
  
    // Em "game"
  
  
    onKeyPress("h", () => {
      levelUp(worldState); // PASSE O CONTEXTO, não o ator
    });
  
    //onKeyPress("h", () => levelUp(player));
  
  */


  onKeyPress("h", () => {
    levelUp(worldState); // PASSE O CONTEXTO, não o ator
  });



  function levelUp(contexto) {
    contexto.atributos = contexto.atributos || {};
    const atual = contexto.atributos.level ?? 1;
    contexto.atributos.level = atual + 1;

    // Se quiser manter também um campo redundante:
    contexto.level = contexto.atributos.level;

    go("levelUpMenu", contexto);
  }

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

    if (worldState.faintedMons.length < 4) {
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

  function onCollideWithPlayer(enemyName, player, worldState) {
    player.onCollide(enemyName, () => {
      flashScreen();
      setTimeout(() => {
        worldState.playerPos = player.pos;
        worldState.enemyName = enemyName;
        go("battle", worldState);
      }, 1000);
    });
  }


  function formatTime(ms) {
    const d = new Date(ms);
    return d.toLocaleTimeString();
  }

  function addDebugHud(ctx) {
    const hud = add([
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
            `Atributos -> Lv:${a.level ?? 1} For:${a.forca ?? 0} Def:${a.defesa ?? 0} XP:${a.xp ?? 0}\n` +
            `Último Save: ${lastTxt}\n` +
            `Pressione 'S' para salvar.`;
        }
      }
    ]);

    return hud;
  }

  // Dentro do setWorld(worldState) após criar o player:
  addDebugHud(worldState);
  onCollideWithPlayer("cat", player, worldState);
  onCollideWithPlayer("minotaur", player, worldState);
  onCollideWithPlayer("ghost", player, worldState);
  onCollideWithPlayer("spider", player, worldState);
  onCollideWithPlayer("centipede", player, worldState);
  onCollideWithPlayer("grass", player, worldState);




}
