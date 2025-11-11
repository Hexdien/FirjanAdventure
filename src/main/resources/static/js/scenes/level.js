// Defina a cena do Level Up (recebe um objeto com ctx)



export function setLevel(k, ctx) {


  // Desenhando a cena
  k.add([
    k.sprite("uiLevelUp"),
    k.pos(k.width() / 2, k.height() / 2),
    k.anchor("center"),
    k.scale(8), // ajuste se quiser redimensionar
  ]);



  // Posições dos elementos 
  const posx = 1.6;
  const posy = 1.5;


  // Desenhando botões
  const botaoNormal = k.add([
    k.sprite("btn_normal"),
    k.pos(k.width() / posx, k.height() / 2),
    k.area(),
    k.scale(8),
    k.anchor("center"),
    "btn_forca",
  ]);

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


}

