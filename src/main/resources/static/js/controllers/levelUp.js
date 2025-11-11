

export function levelUp(k, ctx) {

  // Atualizando level no contexto da cena
  ctx.atributos.level++;

  // Atualizando Level do HTML
  document.getElementById("player-level").textContent = ctx.atributos.level;

  // Abrindo a cena de level up
  k.pushScene("levelUp", ctx);
}





