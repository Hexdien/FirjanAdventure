

export function statPointsManager(ctx) {

  let statPointsLocal = {
    ataque: 0,
    defesa: 0,
    pontosRestante: ctx.atributos.statPoints
  }

  function somaAtk() {
    if (statPointsManager.getPontosDisponiveis() > 0) {
      statPointsLocal.pontosRestante--;
      return statPointsLocal.ataque++;
    }
  }
  function somaDef() {
    if (statPointsManager.getPontosDisponiveis() > 0) {
      statPointsLocal.pontosRestante--;
      return statPointsLocal.defesa++;
    }
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
    getPontosDisponiveis: () => {
      return statPointsLocal.pontosRestante;
    }
  }
}
