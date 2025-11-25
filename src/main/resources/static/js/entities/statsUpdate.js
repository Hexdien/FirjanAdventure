


export function statsUpdate(ctx) {

  document.getElementById("player-name").textContent = ctx.nome;
  document.getElementById("player-hp").textContent = ctx.atributos.hp;
  document.getElementById("player-level").textContent = ctx.atributos.level;
  document.getElementById("player-maxhp").textContent = ctx.atributos.hpMax;
  document.getElementById("player-attack").textContent = ctx.atributos.forca;
  document.getElementById("player-armor").textContent = ctx.atributos.defesa;
  document.getElementById("player-statPoints").textContent = ctx.atributos.statPoints;
  document.getElementById("player-xp-canvas").textContent = ctx.atributos.xp;
  document.getElementById("player-xp-required-canvas").textContent = ctx.atributos.xpReq;
  document.getElementById("xp-bar-fill-canvas").style.width = ((ctx.atributos.xp / 100) * 100) + "%";


}
