


export function statsUpdate(ctx) {

  document.getElementById("player-name").textContent = ctx.nome;
  document.getElementById("player-hp").textContent = ctx.atributos.hp;
  document.getElementById("player-level").textContent = ctx.atributos.level;
  document.getElementById("player-maxhp").textContent = ctx.atributos.hpMax;
  document.getElementById("player-attack").textContent = ctx.atributos.forca;
  document.getElementById("player-armor").textContent = ctx.atributos.defesa;
}
