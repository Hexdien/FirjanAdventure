

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
const MONSTER_HIT_BOX = 0.5;


async function loadDefeated(ctx) {
  const url = `/api/defeated?characterId=${encodeURIComponent(ctx.id)}&mapId=${encodeURIComponent(ctx.mapId || "world-1")}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      ctx.faintedMonIds = json.spawnIds || [];
    } else {
      ctx.faintedMonIds = ctx.faintedMonIds || [];
    }
  } catch {
    ctx.faintedMonIds = ctx.faintedMonIds || [];
  }
}


async function setWorld(ctx) {

  // ctx.mapId pode ser "world-1" por enquanto (MVP).
  ctx.mapId = ctx.mapId || "world-1";

  // Garante a lista vinda do backend:
  ctx.faintedMonIds = Array.isArray(ctx.faintedMonIds) ? ctx.faintedMonIds : [];

  let player = null;



  function makeTile(type) {
    return [sprite("tile"), { type }];
  }

  //============================================================================================================================================

  const tiled = await (await fetch("/assets/maps/mapa.json?v=" + Date.now())).json();

  let spawn = vec2(64, 64);
  let spawnDefault = null ?? vec2(100, 100);
  let monsterSpawn = null ?? vec2(100, 100);



  // Antes de processar os spawns do Tiled:
  await loadDefeated(ctx);


  const dead = new Set(ctx.faintedMonIds);


  const tilesets = [
    { name: "turfs", firstgid: 1, tilecount: 110 },  // bate com slice 11 x 10
    { name: "Grass", firstgid: 111, tilecount: 144 },  // bate com slice 12 x 12
    { name: "Ground", firstgid: 255, tilecount: 144 },  // bate com slice 12 x 12
    { name: "Bushes", firstgid: 399, tilecount: 120 },  // bate com slice 12 x 12
    { name: "Trees", firstgid: 519, tilecount: 120 },  // bate com slice 12 x 12
    { name: "Ruins", firstgid: 639, tilecount: 192 },  // bate com slice 12 x 12
  ];

  const tiledLevels = [];


  for (const tileLayer of tiled.layers) {



    if (tileLayer.type === "objectgroup") {
      const sp = tileLayer.objects?.find(o => o.name === "playerSpawn");
      const monsterSpawns = tileLayer.objects?.filter(o => o.name === "monsterSpawn") || [];
      if (sp) {
        // NOTA: o Tiled posiciona y pelo topo; o sprite do player costuma “encostar no chão”
        // Ajustamos descendo uma altura de tile:
        const ox = tileLayer.offsetx ?? 0;
        const oy = tileLayer.offsety ?? 0;
        spawnDefault = vec2((ox + sp.x) * WORLD_SCALE, (oy + sp.y) * WORLD_SCALE);
      }

      for (const msp of monsterSpawns) {
        const ox = tileLayer.offsetx ?? 0;
        const oy = tileLayer.offsety ?? 0;
        const spawnPos = vec2((ox + msp.x) * WORLD_SCALE, (oy + msp.y) * WORLD_SCALE);

        // tipo do Tiled (minúsculas sempre)
        const tipo = (msp.properties?.find(p => p.name === "monster")?.value || "goblin").toLowerCase();

        const monId = msp.id; // ID único do Tiled

        if (dead.has(monId)) continue; // <-- **não spawna** se já foi derrotado

        spawnMonster(tipo, spawnPos, monId);
      }


      continue; // não é tilelayer; seguimos para próxima

    }




    if (tileLayer.type !== "tilelayer" || !tileLayer.visible) continue;


    const node = add([pos(0, 0)]);  // container desta layer


    if (tileLayer.name === "float") node.use(z(20));
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

  //==================  Fim do loop de desenho do mapa =====================

  const bx = ctx?.pos?.x;
  const by = ctx?.pos?.y;

  if (bx === 0 && by === 0) {
    spawn = spawnDefault;
  } else {
    spawn = vec2(bx, by)
  }

  for (const layer of tiled.layers) {
    if (layer.type !== "tilelayer" || !layer.visible) continue;



    const map = [
      // ... suas addLevel antigas, se quiser manter

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
    sprite("npc"),
    scale(5),
    pos(600, 700),
    area(),
    body({ isStatic: true }),
    "npc",
  ]);


  function spawnMonster(tipo, posicao, monId) {
    const config = {
      goblin: { sprite: "goblin", hitBox: vec2(0.8), color: rgb(0, 255, 0) },
      minotaur: { sprite: "minotaur", hitBox: vec2(1.0), color: rgb(255, 0, 0) },
      ghost: { sprite: "ghost", hitBox: vec2(0.7), color: rgb(180, 180, 255) },
      skeleton: { sprite: "skeleton", hitBox: vec2(0.9), color: rgb(255, 255, 255) },
    };
    const tipoCfg = config[tipo] || config.goblin;

    add([
      sprite(tipoCfg.sprite),
      pos(posicao),
      scale(WORLD_SCALE),
      anchor("center"),
      area({ scale: MONSTER_HIT_BOX ?? tipoCfg.hitBox }),
      body({ isStatic: true }),
      tipo,               // tag de tipo (minúsculas)
      "monster",
      { monId, monType: tipo }, // identidade do spawn
    ]);
  }

  /*
    add([
      sprite("minotaur"),
      scale(WORLD_SCALE),
      pos(monsterSpawn),
      anchor("center"),
      area({ scale: MONSTER_HIT_BOX }),
      body({ isStatic: true }),
      "minotaur",
    ]);
  
  
    add([
      sprite("ghost"),
      scale(WORLD_SCALE),
      anchor("center"),
      pos(600, 900),
      area({ scale: MONSTER_HIT_BOX }),
      body({ isStatic: true }),
      "ghost",
    ]);
    add([
      sprite("goblin"),
      scale(WORLD_SCALE),
      anchor("center"),
      pos(600, 1000),
      area({ scale: MONSTER_HIT_BOX }),
      body({ isStatic: true }),
      "goblin",
    ]);
  
    add([
      sprite("skeleton"),
      scale(WORLD_SCALE),
      anchor("center"),
      pos(600, 1200),
      area({ scale: MONSTER_HIT_BOX }),
      body({ isStatic: true }),
      "skeleton",
    ]);
  
  */

  // debug.inspect = true;  //   Descomente para debugar

  add([
    pos(monsterSpawn),
    rect(6, 6),
    color(255, 0, 0),
    anchor("center"),
    z(9999),
  ]);

  add([
    pos(spawn),
    rect(6, 6),
    color(255, 0, 0),
    anchor("center"),
    z(9999),
  ]);


  player = add([
    sprite("player-idle-front", { anim: "idle" }),
    pos(spawn),
    scale(4),
    body(),
    area(),
    anchor("bot"),
    {
      speed: 600,       // Andando
      isRunning: false,
      speedRunning: 600,// Correndo
      isInDialogue: false,
    },
  ]);
  ctx.player = player;





  ctx = ctx ?? {};

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


  /*
    if (!ctx) {
      ctx = {
        playerPos: player.pos,
        faintedMons: [],
      };
    }
  
    for (const faintedMon of ctx.faintedMons) {
      destroy(get(faintedMon)[0]);
    }
  */

  let tick = 0;
  onUpdate(() => {
    camPos(player.pos);
    camScale(0.5),
      tick++;
    /*
    if (
      (isKeyDown("down") || isKeyDown("up")) &&
      tick % 20 === 0 &&
      !player.isInDialogue
    ) {
      player.flipX = !player.flipX;
    } */
  });

  function setSprite(player, spriteName) {
    if (player.currentSprite !== spriteName) {
      player.use(sprite(spriteName));
      player.currentSprite = spriteName;
    }
  }

  onKeyDown("down", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-down");
      player.play("walk");
    }
    player.move(0, player.speed);
  });

  onKeyDown("up", () => {

    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-up");
      player.play("walk");
    }
    player.move(0, -player.speed);
  });


  onKeyDown("left", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-left");
      player.play("walk");
    }
    player.move(-player.speed, 0);
  });

  onKeyDown("right", () => {
    if (player.isInDialogue) return;
    if (player.curAnim() !== "walk") {
      setSprite(player, "player-right");
      player.play("walk");
    }
    player.move(player.speed, 0);
  });

  onKeyRelease("left", () => {
    setSprite(player, "player-idle-left");
    player.play("idle");
  });

  onKeyRelease("right", () => {
    setSprite(player, "player-idle-right");
    player.play("idle");
  });
  onKeyRelease("up", () => {
    setSprite(player, "player-idle-back");
    player.play("idle");
  });

  onKeyRelease("down", () => {
    setSprite(player, "player-idle-front");
    player.play("idle");
  });

  player.use({ ctx: ctx });


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

    go("levelUpMenu", ctx);
  }



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






  let hud = null;
  hud = addDebugHud(ctx);

  function addDebugHud(ctx) {
    if (!hud) {
      hud = add([
        text('', { size: 12, lineSpacing: 4 }),
        pos(16, 40),
        fixed(),
        scale(WORLD_SCALE),
        color(0, 0, 0),
        z(9999),
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

  onCollideWithPlayer("skeleton", player, ctx);
  onCollideWithPlayer("goblin", player, ctx);
  onCollideWithPlayer("minotaur", player, ctx);
  onCollideWithPlayer("ghost", player, ctx);




}
