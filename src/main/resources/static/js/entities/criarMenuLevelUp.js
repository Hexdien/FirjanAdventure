import { ATRIBUTOS } from "../constants/constants.js";
import { statPointsManager, restaPontos } from "./statPointsManager.js";

let elementosMenu = null;
let botaoMaisAtk = null;
let botaoMaisDef = null;
let botaoMenosAtk = null;
let botaoMenosDef = null;
let pointsText = null;
let botaoConfirmar = null;

function setupMenuLevelUp(k, ctx) {

  const manager = statPointsManager(ctx);
  if (!elementosMenu) {
    // Desenhando a cena
    elementosMenu = k.add([
      k.sprite("uiLevelUp"),
      k.pos(ctx.player.pos),
      k.anchor("center"),
      k.scale(2), // ajuste se quiser redimensionar
      k.z(22),
      "uiLevelUpMenu",
      {
        update() {
          elementosMenu.pos = ctx.player.pos;
        }
      }
    ]);

    // Desenhando numeros de pontos
    pointsText = elementosMenu.add([
      k.text("", { size: 10, font: "monospace", }),
      k.pos(13, -13),
      k.color(233, 113, 38),
      "uiLevelUpMenu",
      k.z(23)
    ])

    pointsText.text = `${manager.getPontosDisponiveis().pontosRestante}`;


    // Desenhando botões
    botaoConfirmar = elementosMenu.add([
      k.sprite("btn_confirm"),
      k.pos(37, 18),
      k.area(),
      k.scale(1),
      k.z(23),
      k.anchor("center"),
      "uiLevelUpMenu",
      "btn_confirm",

    ]);


    botaoMaisAtk = elementosMenu.add([
      k.sprite("btn_normal"),
      k.pos(24, 10),
      k.area(),
      k.scale(1),
      k.z(23),
      k.anchor("center"),
      "uiLevelUpMenu",
      "btn_forca",

    ]);

    botaoMaisDef = elementosMenu.add([
      k.sprite("btn_normal"),
      k.pos(24, 28),
      k.area(),
      k.scale(1),
      k.z(23),
      k.anchor("center"),
      "uiLevelUpMenu",
      "btn_defesa",

    ]);

    botaoMenosAtk = elementosMenu.add([
      k.sprite("btn_menos"),
      k.pos(-25, 10),
      k.area(),
      k.scale(1),
      k.z(23),
      k.anchor("center"),
      "uiLevelUpMenu",
      "btn_menos_forca",

    ]);

    botaoMenosDef = elementosMenu.add([
      k.sprite("btn_menos"),
      k.pos(-25, 28),
      k.area(),
      k.scale(1),
      k.z(23),
      k.anchor("center"),
      "uiLevelUpMenu",
      "btn_menos_defesa",

    ]);



    // Ação hover para botões

    botaoConfirmar.onHoverUpdate(() => {
      botaoConfirmar.scaleTo(1.5),
        botaoConfirmar.z = 99,
        k.setCursor("pointer");
    });


    botaoConfirmar.onHoverEnd(() => {
      botaoConfirmar.scaleTo(1),
        k.setCursor("default");
    });


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


    botaoConfirmar.onClick(() => {
      k.play("btn_up");
      manager.confirmAllocation();
      elementosMenu.destroy();
      elementosMenu = null;




    });

    // TODO : Descobrir porque ao abrir e fechar menu esta stackando os elementos

    botaoMaisAtk.onClick(() => {
      k.play("btn_up")
      manager.addPoints(ATRIBUTOS.ATAQUE);
      pointsText.text = `${manager.getPontosDisponiveis().pontosRestante}`;
    });
    botaoMaisDef.onClick(() => {
      k.play("btn_up")
      manager.addPoints(ATRIBUTOS.DEFESA);
      pointsText.text = `${manager.getPontosDisponiveis().pontosRestante}`;
    });


    botaoMenosAtk.onClick(() => {
      k.play("btn_up")
      manager.rmPoints(ATRIBUTOS.ATAQUE);
      pointsText.text = `${manager.getPontosDisponiveis().pontosRestante}`;
    });
    botaoMenosDef.onClick(() => {
      k.play("btn_up")
      manager.rmPoints(ATRIBUTOS.DEFESA);
      pointsText.text = `${manager.getPontosDisponiveis().pontosRestante}`;
    });



    return elementosMenu;
  }
  else {
    elementosMenu.destroy();
    elementosMenu = null;
    manager.resetLocalStats();
    return null;

  }
}

export const abrirMenuLevelUp = (k, ctx) => {
  if (restaPontos(ctx)) {
    setupMenuLevelUp(k, ctx);
  }
}


