

let hud = null;
export function setupDebugMenu(k, ctx) {

  // Debug Menu 

  if (!hud) {
    hud = k.add([
      k.text('', { size: 12, lineSpacing: 4 }),
      k.pos(16, 40),
      k.fixed(),
      k.scale(4),
      k.color(0, 0, 0),
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
            `Pos: ${Math.round(ctx.player?.pos.x ?? 0)}, ${Math.round(ctx.player?.pos.y ?? 0)}\n` +
            `Atributos -> Lv:${a.level ?? 1} For:${a.forca ?? 0} Def:${a.defesa ?? 0} XP:${a.xp ?? 0}\n` +
            `Atributos -> HP:${a.hp ?? 0}/ HP:${a.hpMax ?? 0} \n` +
            `Último Save: ${lastTxt}\n` +
            `Pressione 'S' para salvar.\n` +
            `Pressione 'F' para aumentar vida maxima.\n` +
            `Pressione 'L' para aumentar level.\n` +
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




