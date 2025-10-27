

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



async function setWorld(worldState) {
  let spawn = vec2(64, 64);   // fallback se não houver objeto no Tiled
  let player = null;





  console.log(worldState);
  function makeTile(type) {
    return [sprite("tile"), { type }];
  }

  //============================================================================================================================================

  const tiled = await (await fetch("/assets/maps/mapa.json?v=" + Date.now())).json();

  const WORLD_SCALE = 4;



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
        spawn = vec2((ox + sp.x) * WORLD_SCALE, (oy + sp.y) * WORLD_SCALE);
      }
      continue; // não é tilelayer; seguimos para próxima
    }


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
    pos(100, 100),
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
    area(),
    body(),
    anchor("bot"), // opcional: melhora a troca entre sheets
    {
      currentSprite: "player-down",
      speed: 300,
      isInDialogue: false,
    },
  ]);

  console.log("player.parent === root?", player.parent === null || player.parent === undefined);
  console.log("player.parent:", player.parent);
  console.log("lvl[0] === player.parent?", tiledLevels?.[0] === player.parent);

  let tick = 0;
  onUpdate(() => {
    camPos(player.pos);
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

  if (!worldState) {
    worldState = {
      playerPos: player.pos,
      faintedMons: [],
    };
  }

  player.pos = vec2(worldState.playerPos);
  for (const faintedMon of worldState.faintedMons) {
    destroy(get(faintedMon)[0]);
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

  onCollideWithPlayer("cat", player, worldState);
  onCollideWithPlayer("minotaur", player, worldState);
  onCollideWithPlayer("ghost", player, worldState);
  onCollideWithPlayer("spider", player, worldState);
  onCollideWithPlayer("centipede", player, worldState);
  onCollideWithPlayer("grass", player, worldState);




}
