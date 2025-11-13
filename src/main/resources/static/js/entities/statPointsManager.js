

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
    getPontosDisponiveis: () => getPontosDisponiveis()
  }
}
