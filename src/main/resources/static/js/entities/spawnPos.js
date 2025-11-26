

let mapString = null;
export function mapZpos(ctx) {
  if (ctx.atributos.mapZ === 1) {
    mapString = "world";
    return mapString;
  }
  if (ctx.atributos.mapZ === 2) {
    mapString = "world2";
    return mapString;
  }
  mapString = ctx.atributos.mapZ;
  return mapString;
}


// Método para definir posição de spawn do player
// Se ctx.x/y forem 0, significa que o player criou o primeiro personagem agora, então deve nascer no spawn
// Spawn = position
// mapZ é o id do mapa que o método está chamando, se for diferente do mapZ do player, nasce no spawn.
//
//
export function spawnPos(ctx, position, mapZ) {
  const posX = ctx.pos.x;
  const posY = ctx.pos.y;
  if (posX === 0 && posY === 0) {
    return position;
  }
  if (ctx.atributos.mapZ != mapZ) { return position }

  return [posX, posY];

}

