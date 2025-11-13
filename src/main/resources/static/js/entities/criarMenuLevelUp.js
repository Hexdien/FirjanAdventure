
export function criarMenuLevelUp(k, ctx) {


  let menuAberto = false;
  let elementosMenu = null;
  let botaoNormal = null;
  let botaoNormal2 = null;


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


    // Desenhando botões
    botaoNormal = elementosMenu.add([
      k.sprite("btn_normal"),
      k.pos(19, 1),
      k.area(),
      k.scale(1),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_forca",

    ]);

    botaoNormal2 = elementosMenu.add([
      k.sprite("btn_normal"),
      k.pos(19, 14),
      k.area(),
      k.scale(1),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_defesa",

    ]);


    // Ação hover para botões

    botaoNormal.onHoverUpdate(() => {
      botaoNormal.sprite = "btn_hover";
      k.setCursor("pointer");
    });


    botaoNormal.onHoverEnd(() => {
      botaoNormal.sprite = "btn_normal";
      k.setCursor("default");
    });



    botaoNormal2.onHoverUpdate(() => {
      botaoNormal2.sprite = "btn_hover";
      k.setCursor("pointer");
    });


    botaoNormal2.onHoverEnd(() => {
      botaoNormal2.sprite = "btn_normal";
      k.setCursor("default");
    });


    // Função de clique para botões

    k.onClick("btn_forca", () => {
      ctx.atributos.forca++;
      document.getElementById("player-attack").textContent = ctx.atributos.forca;
    });
    k.onClick("btn_defesa", () => {
      ctx.atributos.defesa++;
      document.getElementById("player-armor").textContent = ctx.atributos.defesa;
    });


  }
  function ocultarMenu() {
    elementosMenu.opacity = 0;
    botaoNormal.opacity = 0;
    botaoNormal2.opacity = 0;

  }

  function mostrarMenu() {
    elementosMenu.opacity = 0.8;
    botaoNormal.opacity = 0.8
    botaoNormal2.opacity = 0.8

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

