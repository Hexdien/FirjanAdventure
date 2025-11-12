// Defina a cena do Level Up (recebe um objeto com ctx)



export function setLevel(k, ctx) {


  const pauseMenu = k.add([
    k.rect(400, 600),
    k.color(255, 255, 255),
    k.outline(4),
    k.anchor("center"),
    k.pos(k.center().add(0, 700)),
  ]);


  let curTween = null;
  const game = k.add([
    k.timer(),
  ]);


  game.paused = !game.paused;
  if (curTween) curTween.cancel();
  curTween = k.tween(
    pauseMenu.pos,
    game.paused ? k.center() : k.center().k.add(0, 700),
    1,
    (p) => pauseMenu.pos = p,
    easings.easeOutElastic,
  );
  if (game.paused) {
    pauseMenu.hidden = false;
    pauseMenu.paused = false;
  }
  else {
    curTween.onEnd(() => {
      pauseMenu.hidden = true;
      pauseMenu.paused = true;
    });
  }
  pauseMenu.hidden = true;
  pauseMenu.paused = true;
}



