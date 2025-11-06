import data from "../data/monsters.json";

// Componente de identidade de spawn
function spawnId(id, type) { return { monId: id, monType: type, id: "spawnId" }; }

export function createMonster({ type, pos, monId, WORLD_SCALE, MONSTER_HIT_BOX }) {
  const cfg = data[type] || data.goblin;

  return add([
    sprite(cfg.sprite),
    pos(pos),
    scale(WORLD_SCALE),
    anchor("center"),
    area({ scale: MONSTER_HIT_BOX ?? cfg.hitBox }),
    body({ isStatic: true }),
    "monster",
    type,                // tag por tipo (minúsculas)
    spawnId(monId, type),
    health(cfg.hp),      // seu componente
    combat(),            // engatilha batalha
    // aiPatrol(...) ou aiChase(...), etc.
    lootTable(cfg.loot),
  ]);
}
