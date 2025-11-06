// Defina a cena do Level Up (recebe um objeto com contexto)



export function setLevel(contexto) {
  destroyAll();


  add([
    sprite("uiLevelUp"),
    pos(width() / 2, height() / 2),
    anchor("center"),
    scale(8), // ajuste se quiser redimensionar
  ]);



  const posx = 1.6;
  const posy = 1.5;

  const botaoNormal = add([
    sprite("btn_normal"),
    pos(width() / posx, height() / 2),
    area(),
    scale(8),
    anchor("center"),
    "btn_forca",
  ]);

  const botaoHover = add([
    sprite("btn_hover"),
    pos(width() / posx, height() / 2),
    anchor("center"),
    scale(8),
    opacity(0), // começa invisível
    "btn_forca_hover",
  ]);

  botaoNormal.onHoverUpdate(() => {
    botaoNormal.opacity = 0;
    botaoHover.opacity = 1;
    setCursor("pointer");
  });

  botaoNormal.onHoverEnd(() => {
    botaoNormal.opacity = 1;
    botaoHover.opacity = 0;
    setCursor("default");
  });


  onClick("btn_forca", () => {
    contexto.atributos.forca++;
    document.getElementById("player-attack").textContent = contexto.atributos.forca;
    //contexto.atributos.forca = (contexto.atributos.forca ?? 0) + 10;
    go("world", contexto);
  });



  const botaoNormal2 = add([
    sprite("btn_normal"),
    pos(width() / posx, height() / posy),
    area(),
    scale(8),
    anchor("center"),
    "btn_defesa",
  ]);

  const botaoHover2 = add([
    sprite("btn_hover"),
    pos(width() / posx, height() / posy),
    anchor("center"),
    scale(8),
    opacity(0), // começa invisível
    "btn_forca_hover",
  ]);

  botaoNormal2.onHoverUpdate(() => {
    botaoNormal2.opacity = 0;
    botaoHover2.opacity = 1;
    setCursor("pointer");
  });

  botaoNormal2.onHoverEnd(() => {
    botaoNormal2.opacity = 1;
    botaoHover2.opacity = 0;
    setCursor("default");
  });


  onClick("btn_defesa", () => {
    contexto.atributos.defesa++;
    document.getElementById("player-armor").textContent = contexto.atributos.defesa;
    //contexto.atributos.forca = (contexto.atributos.forca ?? 0) + 10;
    go("world", contexto);
  });


}

