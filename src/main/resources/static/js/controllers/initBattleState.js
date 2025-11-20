import { iniciarBatalha } from "../api/battleAPI.js";




export async function initBattleState(ctx, monstro) {
  const battleState = await iniciarBatalha(ctx.id, monstro.idTiled, monstro.Tipo, monstro.Level);
  return {
    battleId: battleState.battleId,
    tipo: monstro.Tipo,
    level: monstro.Level,
    monsterHpMax: battleState.monsterHpMax,
    monsterHp: battleState.monsterHp,
    monsterAtk: battleState.monsterAtk,
    monsterDef: battleState.monsterDef,
    damage: battleState.damage,
    estado: battleState.estado,
    turnoAtual: battleState.turnoAtual
  }
}
