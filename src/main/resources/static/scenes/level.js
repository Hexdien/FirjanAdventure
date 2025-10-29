// Defina a cena do Level Up (recebe um objeto com contexto)
scene("levelUpMenu", (contexto) => {
  destroyAll();

  add([
    text(`Level Up! Você agora é nível ${contexto.atributos.level}!`),
    pos(width() / 2, height() / 4),
    anchor("center"),
  ]);

  add([
    text("Escolha um upgrade:"),
    pos(width() / 2, height() / 2 - 50),
    anchor("center"),
  ]);
  /*
    const speedButton = add([
      rect(200, 40),
      pos(width() / 2, height() / 2),
      area(),
      anchor("center"),
      "speed_button",
    ]);
    speedButton.add([
      text("Increase Speed"),
      anchor("center"),
    ]);
  
    onClick("speed_button", () => {
      contexto.speed = (player.speed ?? 0) + 50;
      go("world", contexto);
    });
  */
  const forcaUp = add([
    rect(250, 80, { radius: 8 }),
    pos(width() / 2, height() / 2 + 50),
    area(),
    scale(1),
    anchor("center"),
    outline(4),
    "forca",
  ]);
  forcaUp.onHoverUpdate(() => {
    const t = time() * 10
    forcaUp.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
    forcaUp.scale = vec2(1.2)
    setCursor("pointer")
  })

  // onHoverEnd() comes from area() component
  // it runs once when the object stopped being hovered
  forcaUp.onHoverEnd(() => {
    forcaUp.scale = vec2(1)
    forcaUp.color = rgb()
  })
  forcaUp.add([
    text("Forca ++"),
    anchor("center"),
    color(0, 0, 0),
  ]);

  onClick("forca", () => {
    contexto.atributos.forca++;
    //contexto.atributos.forca = (contexto.atributos.forca ?? 0) + 10;
    go("world", contexto);
  });

  const defesaUp = add([
    rect(250, 80, { radius: 8 }),
    pos(width() / 2, height() / 2 + 150),
    area(),
    scale(1),
    anchor("center"),
    outline(4),
    "defesa",
  ]);
  defesaUp.onHoverUpdate(() => {
    const t = time() * 10
    defesaUp.color = hsl2rgb((t / 10) % 1, 0.6, 0.7)
    defesaUp.scale = vec2(1.2)
    setCursor("pointer")
  })

  // onHoverEnd() comes from area() component
  // it runs once when the object stopped being hovered
  defesaUp.onHoverEnd(() => {
    defesaUp.scale = vec2(1)
    defesaUp.color = rgb()
  })
  defesaUp.add([
    text("Defesa ++"),
    anchor("center"),
    color(0, 0, 0),
  ]);

  onClick("defesa", () => {
    contexto.atributos.defesa++;
    //contexto.atributos.forca = (contexto.atributos.forca ?? 0) + 10;
    go("world", contexto);
  });
});

