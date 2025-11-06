let monstersCache = null;

async function loadMonsters() {
  if (monstersCache) return monstersCache;
  const res = await fetch("/js/data/monsters.json?v=" + Date.now());
  monstersCache = await res.json();
  return monstersCache;
}

export async function createMonster({
  type,
  pos: position,            // <-- renomeia ao destruturar
  monId,
  WORLD_SCALE,
  MONSTER_HIT_BOX,
}) {
  const monsters = await loadMonsters();
  const key = String(type || "goblin").toLowerCase();
  const cfg = monsters[key] || monsters["goblin"];

  const hitBoxScale =
    MONSTER_HIT_BOX ?? cfg.hitBox ?? 1.0;

  return add([
    sprite(cfg.sprite),
    pos(position),           // <-- agora usa a função `pos(...)` do Kaboom
    scale(WORLD_SCALE),
    anchor("center"),
    area({ scale: hitBoxScale }),
    body({ isStatic: true }),
    "monster",
    key,
    { monId, monType: key },
  ]);
}
