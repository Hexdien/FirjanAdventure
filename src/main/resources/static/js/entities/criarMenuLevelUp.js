
export function criarMenuLevelUp(k, ctx) {


  let menuAberto = false;
  let elementosMenu = null;
  let botaoNormal = null;



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
      k.pos(50, 50),
      k.area(),
      k.scale(2),
      k.z(23),
      k.opacity(0),
      k.anchor("center"),
      "btn_forca",
    ]);

    /*
        // Posições dos elementos 
        const posx = 1.6;
        const posy = 1.5;
    
    
        const botaoHover = k.add([
          k.sprite("btn_hover"),
          k.pos(k.width() / posx, k.height() / 2),
          k.anchor("center"),
          k.scale(8),
          k.opacity(0), // começa invisível
          "btn_forca_hover",
        ]);
    
        botaoNormal.onHoverUpdate(() => {
          botaoNormal.opacity = 0;
          botaoHover.opacity = 1;
          k.setCursor("pointer");
        });
    
        botaoNormal.onHoverEnd(() => {
          botaoNormal.opacity = 1;
          botaoHover.opacity = 0;
          k.setCursor("default");
        });
    
    
        // Lógica para clique do botão de ataque
        k.onClick("btn_forca", () => {
          ctx.atributos.forca++;
          document.getElementById("player-attack").textContent = ctx.atributos.forca;
    
          k.popScene();
        });
    
    
    
        const botaoNormal2 = k.add([
          k.sprite("btn_normal"),
          k.pos(k.width() / posx, k.height() / posy),
          k.area(),
          k.scale(8),
          k.anchor("center"),
          "btn_defesa",
        ]);
    
        const botaoHover2 = k.add([
          k.sprite("btn_hover"),
          k.pos(k.width() / posx, k.height() / posy),
          k.anchor("center"),
          k.scale(8),
          k.opacity(0), // começa invisível
          "btn_forca_hover",
        ]);
    
        botaoNormal2.onHoverUpdate(() => {
          botaoNormal2.opacity = 0;
          botaoHover2.opacity = 1;
          k.setCursor("pointer");
        });
    
        botaoNormal2.onHoverEnd(() => {
          botaoNormal2.opacity = 1;
          botaoHover2.opacity = 0;
          k.setCursor("default");
        });
    
    
        // Lógica para clique do botão de defesa
        k.onClick("btn_defesa", () => {
          ctx.atributos.defesa++;
          document.getElementById("player-armor").textContent = ctx.atributos.defesa;
          k.popScene();
        });
    */

  }
  function ocultarMenu() {
    elementosMenu.opacity = 0;
    botaoNormal.opacity = 0;

  }

  function mostrarMenu() {
    elementosMenu.opacity = 0.8;
    botaoNormal.opacity = 0.8
    //   elementosMenu.botaoNormal.opacity = 0.8;
    k.onUpdate(() => {

      elementosMenu.pos = ctx.player.pos;

    });
    //TODO: Você está registrando um onUpdate cada vez que mostrarMenu() é chamada. Se o jogador abre e fecha o menu múltiplas vezes, 
    //TODO: você vai ter múltiplos onUpdate rodando. Isso pode gerar problemas depois.

  }

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

