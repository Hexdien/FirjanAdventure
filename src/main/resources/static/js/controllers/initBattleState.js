import { iniciarBatalha } from "../api/battleAPI.js";
import { getPersonagem } from "./getPersonagem.js";




export async function initBattleState(monstro) {
  const ctx = await getPersonagem();
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
