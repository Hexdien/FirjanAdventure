import { ATRIBUTOS } from "../constants/constants.js";
import { statPointsManager } from "./statPointsManager.js";

export function criarMenuLevelUp(k, ctx) {


  let menuAberto = false;
  let elementosMenu = null;
  let botaoMaisAtk = null;
  let botaoMaisDef = null;
  let botaoMenosAtk = null;
  let botaoMenosDef = null;
  let pointsText = null;

  const manager = statPointsManager(ctx);


  desenharMenu();
  function desenharMenu() {

    // Desenhando a cena
    elementosMenu = k.add([
      k.sprite("uiLevelUp"),
      k.pos(ctx.player.pos),
      k.anchor("center"),
      k.scale(2), // ajuste se quiser redimensionar
      k.opacity(0),
      k.z(22)
    ]);

    // Desenhando numeros de pontos
    pointsText = elementosMenu.add([
      k.text("", { size: 12 }),
      k.pos(15, -14),
      k.opacity(0),
      k.z(23)
    ])


    // Desenhando botões
    botaoMaisAtk = elementosMenu.add([
      k.sprite("btn_normal"),
      k.pos(24, 10),
      k.area(),
      k.scale(1),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_forca",

    ]);

    botaoMaisDef = elementosMenu.add([
      k.sprite("btn_normal"),
      k.pos(24, 28),
      k.area(),
      k.scale(1),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_defesa",

    ]);

    botaoMenosAtk = elementosMenu.add([
      k.sprite("btn_menos"),
      k.pos(-25, 10),
      k.area(),
      k.scale(1),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_menos_forca",

    ]);

    botaoMenosDef = elementosMenu.add([
      k.sprite("btn_menos"),
      k.pos(-25, 28),
      k.area(),
      k.scale(1),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_menos_defesa",

    ]);



    // Ação hover para botões

    botaoMaisAtk.onHoverUpdate(() => {
      botaoMaisAtk.sprite = "btn_hover";
      k.setCursor("pointer");
    });


    botaoMaisAtk.onHoverEnd(() => {
      botaoMaisAtk.sprite = "btn_normal";
      k.setCursor("default");
    });



    botaoMaisDef.onHoverUpdate(() => {
      botaoMaisDef.sprite = "btn_hover";
      k.setCursor("pointer");
    });


    botaoMaisDef.onHoverEnd(() => {
      botaoMaisDef.sprite = "btn_normal";
      k.setCursor("default");
    });



    botaoMenosAtk.onHoverUpdate(() => {
      botaoMenosAtk.sprite = "btn_menos_hover";
      k.setCursor("pointer");
    });


    botaoMenosAtk.onHoverEnd(() => {
      botaoMenosAtk.sprite = "btn_menos";
      k.setCursor("default");
    });



    botaoMenosDef.onHoverUpdate(() => {
      botaoMenosDef.sprite = "btn_menos_hover";
      k.setCursor("pointer");
    });


    botaoMenosDef.onHoverEnd(() => {
      botaoMenosDef.sprite = "btn_menos";
      k.setCursor("default");
    });




    // Função de clique para botões

    k.onClick("btn_forca", () => {
      //pointsText.text = `${manager.getPontosDisponiveis()}`;
      document.getElementById("player-attack").textContent = ctx.atributos.forca;
    });
    k.onClick("btn_defesa", () => {
      ctx.atributos.defesa++;
      document.getElementById("player-armor").textContent = ctx.atributos.defesa;
    });


    k.onClick("btn_menos_forca", () => {
      ctx.atributos.forca--;
      document.getElementById("player-attack").textContent = ctx.atributos.forca;
    });
    k.onClick("btn_menos_defesa", () => {
      ctx.atributos.defesa--;
      document.getElementById("player-armor").textContent = ctx.atributos.defesa;
    });



  }
  function ocultarMenu() {
    elementosMenu.opacity = 0;
    botaoMaisAtk.opacity = 0;
    botaoMaisDef.opacity = 0;
    botaoMenosAtk.opacity = 0;
    botaoMenosDef.opacity = 0;
    pointsText.opacity = 0;

  }

  function mostrarMenu() {
    elementosMenu.opacity = 0.8;
    botaoMaisAtk.opacity = 0.8
    botaoMaisDef.opacity = 0.8
    botaoMenosAtk.opacity = 0.8;
    botaoMenosDef.opacity = 0.8;
    pointsText.opacity = 0.8;

    //TODO: Você está registrando um onUpdate cada vez que mostrarMenu() é chamada. Se o jogador abre e fecha o menu múltiplas vezes, 
    //TODO: você vai ter múltiplos onUpdate rodando. Isso pode gerar problemas depois.

  }
  k.onUpdate(() => {

    elementosMenu.pos = ctx.player.pos;

  });

  return {
    abrir: () => {
      if (!menuAberto) {
        mostrarMenu();
        menuAberto = true;
      } else {
        ocultarMenu();
        menuAberto = false;
      }
    },

    estaAberto: () => menuAberto
  };
}

