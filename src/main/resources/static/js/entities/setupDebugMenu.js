function formatTime(ms) {
  const d = new Date(ms);
  return d.toLocaleTimeString();
}

let hud = null;
function setupDebugMenu(k, ctx) {

  // Debug Menu 

  if (!hud) {
    hud = k.add([
      k.text('', { size: 12, lineSpacing: 4 }),
      k.pos(16, 40),
      k.fixed(),
      k.scale(4),
      k.color(255, 0, 0),
      k.z(9999),
      {
        update() {
          const a = ctx.atributos || {};
          const last = ctx._lastSave || null;
          const lastTxt = !last
            ? 'nunca'
            : (last.ok ? `OK às ${formatTime(last.at)}` : `ERRO(${last.status ?? '??'}) às ${formatTime(last.at)}`);

          this.text =
            `ID: ${ctx.id}\n` +
            `Nome: ${ctx.nome}\n` +
            `Pos: ${Math.round(ctx.player?.pos.x ?? 0)}, ${Math.round(ctx.player?.pos.y ?? 0)}, ${a.mapZ} \n` +
            `Atributos -> Lv:${a.level ?? 1} For:${a.forca ?? 0} Def:${a.defesa ?? 0} XP:${a.xp ?? 0} \n` +
            `Atributos -> HP:${a.hp ?? 0}/ HP:${a.hpMax ?? 0} xpReq:${a.xpReq ?? 0}\n` +
            `isLevelUp?:${a.isLevelUp ?? 0}\n` +
            `Pontos de Status -> ${a.statPoints ?? 0} \n` +
            `Último Save: ${lastTxt}\n` +
            `Pressione 'P' para salvar.\n` +
            `Pressione 'I' abrir inventario.\n` +
            `Pressione 'H' abrir menu de level up.`;
        }
      }
    ]);

    return hud;
  } else {
    hud.destroy();
    hud = null;
    return null;
  }

}


export const abrirDebugMenu = (k, ctx) => {
  setupDebugMenu(k, ctx);
}


