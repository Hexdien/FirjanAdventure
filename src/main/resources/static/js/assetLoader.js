
export function loadAssets(k) {

  k.loadSprite('Map', '../assets/maps/mapa1.png')
  k.loadSprite('Map2', '../assets/maps/mapa2.png')
  k.loadSprite('Map1trees', '../assets/maps/map1trees.png')
  //k.loadSprite('Map', '../assets/maps/mapatesteshowscase.png')

  k.loadSprite("player-down", "./assets/sprites/player/MainC_Walk_Front.PNG", {
    sliceX: 4,
    anims: {
      walk: { from: 0, to: 3, speed: 8 },
      idle: { from: 3, to: 3, },
    },
  });


  k.loadSprite("player-up", "./assets/sprites/player/MainC_Walk_Back.PNG", {
    sliceX: 4,
    anims: {
      walk: { from: 0, to: 3, speed: 8 },
      idle: { from: 0, to: 0, },
    },
  });

  k.loadSprite("player-left", "./assets/sprites/player/MainC_Walk_Left.PNG", {
    sliceX: 4,
    anims: {
      walk: { from: 0, to: 3, speed: 8 },
      idle: { from: 0, to: 0, },
    },
  });

  k.loadSprite("player-right", "./assets/sprites/player/MainC_Walk_Right.PNG", {
    sliceX: 4,
    anims: {
      walk: { from: 0, to: 3, speed: 8 },
      idle: { from: 0, to: 0, },
    },
  });

  k.loadSprite("player-idle-front", "../assets/sprites/player/MainC_Idle_Front.PNG", {
    sliceX: 9,
    anims: {
      idle: { from: 0, to: 8, loop: true, speed: 2 },
    },
  });
  k.loadSprite("player-idle-back", "./assets/sprites/player/MainC_Idle_Back.PNG", {
    sliceX: 9,
    anims: {
      idle: { from: 0, to: 8, loop: true, speed: 2 },
    },
  });
  k.loadSprite("player-idle-right", "./assets/sprites/player/MainC_Idle_Right.PNG", {
    sliceX: 9,
    anims: {
      idle: { from: 0, to: 8, loop: true, speed: 2 },
    },
  });

  k.loadSprite("player-idle-left", "./assets/sprites/player/MainC_Idle_Left.PNG", {
    sliceX: 9,
    anims: {
      idle: { from: 0, to: 8, loop: true, speed: 2 },
    },
  });






  /*
    loadSpriteAtlas("assets/char.png", {
      "player-down": {
        x: 0, y: 0,
        width: 32 * 5, height: 32,
        sliceX: 5, sliceY: 1,
        anims: {
          "walk": { from: 1, to: 4, speed: 6 },
          "idle": { from: 0, to: 0, speed: 6 }
        },
      },
      "player-side": {
        x: 0, y: 64,
        width: 32 * 5, height: 32,
        sliceX: 5, sliceY: 1,
        anims: {
          "walk": { from: 1, to: 4, speed: 6 },
          "idle": { from: 0, to: 0, speed: 6 }
        },
      },
  
      "player-up": {
        x: 0, y: 32,
        width: 32 * 5, height: 32,
        sliceX: 5, sliceY: 1,
        anims: {
          "walk": { from: 1, to: 4, speed: 6 },
          "idle": { from: 0, to: 0, speed: 6 }
        },
      },
  
    });  
    */



  k.loadSpriteAtlas("./assets/characters2.png", {
    "minotaur": {
      x: 0, y: 0,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 0, to: 0, speed: 6 }
      },
    },
    "ghost": {
      x: 48, y: 0,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 1, to: 1, speed: 6 }
      },
    },
    "goblin": {
      x: 48, y: 64,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 1, to: 1, speed: 6 }
      }
    },
    "skeleton": {
      x: 0, y: 64,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 1, to: 1, speed: 6 }
      }
    },

    "minotaur-mon": {
      x: 0, y: 0,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 0, to: 0, speed: 6 }
      },
    },
    "ghost-mon": {
      x: 48, y: 0,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 0, to: 0, speed: 6 }
      },
    },
    "goblin-mon": {
      x: 48, y: 64,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 0, to: 0, speed: 6 }
      },
    },
    "skeleton-mon": {
      x: 0, y: 64,
      width: 96, height: 128,
      sliceX: 2, sliceY: 2,
      anims: {
        "idle": { from: 0, to: 0, speed: 6 }
      },
    },
  },
  );

  k.loadSpriteAtlas("./assets/sprites/player.png", {
    "warrior": {
      x: 0, y: 0,
      width: 42, height: 39,
      sliceX: 1, sliceY: 1,
      anims: {
        "idle": { from: 0, to: 0, speed: 6 }
      },
    },

  });

  k.loadSpriteAtlas("./assets/characters.png", {
    npc: { x: 32, y: 98, width: 16, height: 16 },
    "cat-mon": { x: 0, y: 16, width: 32, height: 32 },
    "spider-mon": { x: 32, y: 16, width: 32, height: 32 },
    "centipede-mon": { x: 64, y: 16, width: 32, height: 32 },
    "grass-mon": { x: 0, y: 49, width: 32, height: 32 },
    "mushroom-mon": { x: 32, y: 49, width: 32, height: 32 },
    "mini-mons": {
      x: 0,
      y: 0,
      width: 128,
      height: 16,
      sliceX: 8,
      sliceY: 1,
      anims: { spider: 1, centipede: 2, grass: 3 },
    },
  });
  k.loadSprite("battle-background", "./assets/battleBackground.png");
  k.loadSpriteAtlas("./assets/tiles.png", {
    tile: {
      x: 0,
      y: 0,
      width: 128,
      height: 128,
      sliceX: 8,
      sliceY: 8,
      anims: {
        "bigtree-pt1": 1,
        "bigtree-pt2": 2,
        "bigtree-pt3": 9,
        "bigtree-pt4": 10,
        "grass-m": 14,
        "grass-tl": 17,
        "grass-tm": 18,
        "grass-tr": 19,
        "grass-l": 25,
        "grass-r": 27,
        "grass-bl": 33,
        "grass-mb": 34,
        "grass-br": 35,
        "tree-t": 4,
        "tree-b": 12,
        "grass-water": 20,
        "sand-1": 6,
        "ground-l": 41,
        "ground-m": 42,
        "ground-r": 43,
        "rock-water": 60,
      },
    },
  });


  // UI
  k.loadSprite("uiLevelUp", "assets/ui/levelup.png");
  k.loadSprite("btn_normal", "assets/ui/upbutton.png");
  k.loadSprite("btn_hover", "assets/ui/upbuttonHover.png");
  k.loadSprite("btn_menos", "assets/ui/minorbutton.png");
  k.loadSprite("btn_confirm", "assets/ui/confirmbutton.png");
  k.loadSprite("btn_menos_hover", "assets/ui/minorbuttonhover.png");
  /*
     k.loadSprite("numbers", "./assets/ui/numbers.png", {
    sliceX: 10,
    anims: {
      zero: { from: 0, to: 0 },
      um: { from: 1, to: 1 },
      dois: { from: 2, to: 2 },
      tres: { from: 3, to: 3 },
      quatro: { from: 4, to: 4 },
      cinco: { from: 5, to: 5 },
      seis: { from: 6, to: 6 },
      sete: { from: 7, to: 7 },
      oito: { from: 8, to: 8 },
      nove: { from: 9, to: 9 },
    },
  });

*/

  k.loadSprite('Ground', '../assets/tilesets/Ground.PNG',
    { sliceX: 12 },
    { sliceY: 12 },
  );


  k.loadSound("btn_up", "../up.mp3");



}




