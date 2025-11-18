import { API_BASE } from "../constants/constants.js";


export async function iniciarBatalha(personagemId, monsterId, tipo, level) {
  const resp = await fetch(`${API_BASE}/batalha`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ personagemId, monsterId, tipo, level })
  });
  return await resp.json();
}




export async function processarBatalha(batalhaId, personagemId, acao) {
  const resp = await fetch(`${API_BASE}/batalha/${batalhaId}/atacar`, {
    method: "POST",
    body: JSON.stringify({ personagemId, acao })
  });
  return await resp.json();
}
