const API_BASE = "http://localhost:8080/api";

export async function saveGame(ctx) {
  if (!ctx?.player) {
    console.warn("saveGame: ctx.player não definido.");
    return false;
  }


  const payload = {
    posX: Math.round(ctx.player.pos.x),
    posY: Math.round(ctx.player.pos.y),
    atributos: {
      ...ctx.atributos, // garante passagem de tudo (level, forca, defesa, xp, agilidade, etc.)
    },
  };
  const res = await fetch(`${API_BASE}/personagens/${encodeURIComponent(ctx.id)}/estado`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    console.error("Falha ao salvar:", res.status, await res.text());
    ctx._lastSave = { ok: false, status: res.status, at: Date.now() };
    return false;
  }

  // opcional: atualizar snapshot local e carimbo
  ctx._lastSave = { ok: true, at: Date.now() };
  try {
    const updated = await res.json();
    localStorage.setItem('personagem:last', JSON.stringify(updated));
  } catch { /* ignore */ }

  return true;
}

export function setupAutoSave(k, ctx) {
  // Salvar manual com 'S'
  k.onKeyPress('s', () => { saveGame(k, ctx); });
}


export async function loadDefeated(ctx) {
  const url = `/api/defeated?characterId=${encodeURIComponent(ctx.id)}&mapId=${encodeURIComponent(ctx.mapId || "world-1")}`;
  try {
    const res = await fetch(url);
    if (res.ok) {
      const json = await res.json();
      ctx.faintedMonIds = json.spawnIds || [];
    } else {
      ctx.faintedMonIds = ctx.faintedMonIds || [];
    }
  } catch {
    ctx.faintedMonIds = ctx.faintedMonIds || [];
  }
}



export async function markDefeated({ characterId, mapId, spawnId }) {
  await fetch("/api/defeated", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ characterId, mapId, spawnId }),
  });
}
