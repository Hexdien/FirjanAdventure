// js/encounter.js
export async function verificarEncontro(levelJogador) {
  const res = await fetch(`/api/encontro/verificar?levelJogador=${levelJogador}`);
  const monstro = await res.json();

  if (monstro && monstro.nome) {
    mostrarModalEncontro(monstro);
  }
}

function mostrarModalEncontro(monstro) {
  const modal = document.getElementById("encounter-modal");
  const texto = document.getElementById("encounter-text");

  texto.textContent = `Você encontrou um ${monstro.nome} (Nível ${monstro.level})! Deseja lutar?`;
  modal.style.display = "flex";

  const btnSim = document.getElementById("btn-encontro-sim");
  const btnNao = document.getElementById("btn-encontro-nao");

  btnSim.onclick = () => lutar(monstro);
  btnNao.onclick = () => {
    modal.style.display = "none";
    // mantém jogador parado, sem nova tentativa até o próximo passo
  };
}

function lutar(monstro) {
  const modal = document.getElementById("encounter-modal");
  modal.style.display = "none";
  console.log("Lutando contra:", monstro);
  // Em breve: chamada à API de combate
}
