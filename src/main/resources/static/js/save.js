


const API_BASE = "http://localhost:8080/api";
const PERSONAGEM_ID = 1;
async function saveGame(player, ctx) {
  const payload = {
    posX: Math.round(player.pos.x),
    posY: Math.round(player.pos.y),
    atributos: {
      level: ctx.stats.level,
      forca: ctx.stats.forca,
      defesa: ctx.stats.defesa,
      xp: ctx.stats.xp,
    },
  };
  const res = await fetch(`${API_BASE}/personagens/${PERSONAGEM_ID}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify((payload)),
  });

  if (!res.ok) {
    console.error("Falha ao salvar:", res.status, await res.text());
    return false;
  }
  return true;
}




