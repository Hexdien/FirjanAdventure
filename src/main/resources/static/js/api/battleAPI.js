import { API_BASE } from "../constants/constants.js";


export async function iniciarBatalha(personagemId, monsterId, tipo, level) {
  const resp = await fetch(`${API_BASE}/batalha/${personagemId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ monsterId, tipo, level })
  });
  return await resp.json();
}




export async function processarBatalha(battleId, personagemId, acao, tipoAtaque) {
  const resp = await fetch(`${API_BASE}/batalha/${battleId}/atacar`, {
    method: "POST",
    body: JSON.stringify({ personagemId, acao, tipoAtaque })
  });
  return await resp.json();
}
