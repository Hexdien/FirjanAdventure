import { saveGame } from "../save.js";
import { statsUpdate } from "./statsUpdate.js";


export function statPointsManager(ctx) {

  let statPointsLocal = {
    ataque: 0,
    defesa: 0,
    pontosRestante: ctx.atributos.statPoints
  }

  function somaAtk() {
    if (getPontosDisponiveis().pontosRestante > 0) {
      statPointsLocal.pontosRestante--;
      return statPointsLocal.ataque++;
    }
  }
  function somaDef() {
    if (getPontosDisponiveis().pontosRestante > 0) {
      statPointsLocal.pontosRestante--;
      return statPointsLocal.defesa++;
    }
  }


  function removeAtk() {
    if (getPontosDisponiveis().ataque > 0) {
      statPointsLocal.pontosRestante++;
      return statPointsLocal.ataque--;
    }
  }
  function removeDef() {
    if (getPontosDisponiveis().defesa > 0) {
      statPointsLocal.pontosRestante++;
      return statPointsLocal.defesa--;
    }
  }

  function resetLocalStats() {
    const newStats = statPointsLocal;
    newStats.ataque = 0;
    newStats.defesa = 0;
    //newStats.pontosRestante = 0;
  }

  function getPontosDisponiveis() {
    return statPointsLocal;
  }
  return {
    addPoints: (atributo) => {
      if (atributo === "ATAQUE") {
        return somaAtk();
      }
      if (atributo === "DEFESA") {
        return somaDef();
      }
    },
    rmPoints: (atributo) => {
      if (atributo === "ATAQUE") {
        return removeAtk();
      }
      if (atributo === "DEFESA") {
        return removeDef();
      }
    },
    getPontosDisponiveis: () => getPontosDisponiveis(),
    confirmAllocation: () => {
      ctx.atributos.forca = ctx.atributos.forca + getPontosDisponiveis().ataque;
      ctx.atributos.defesa = ctx.atributos.defesa + getPontosDisponiveis().defesa;
      ctx.atributos.statPoints = getPontosDisponiveis().pontosRestante;
      statsUpdate(ctx);
      resetLocalStats();
      isNotLevelUp(ctx);
      return saveGame(ctx);

    },
    resetLocalStats: () => resetLocalStats(),

  }
}


export function restaPontos(ctx) {
  return ctx.atributos.statPoints > 0;
}

function isNotLevelUp(ctx) {
  if (!restaPontos(ctx)) { return ctx.atributos.isLevelUp = 0; }

}
