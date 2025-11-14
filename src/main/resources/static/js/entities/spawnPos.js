

let mapString = null;
export function mapZpos(ctx) {
  if (ctx.atributos.mapZ === 1) {
    mapString = "world";
  }
  if (ctx.atributos.mapZ === 2) {
    mapString = "world2";
  }
  return mapString;
}

export function spawnPos(ctx, position, mapZ) {
  const posX = ctx.pos.x;
  const posY = ctx.pos.y;
  if (posX === 0 && posY === 0) {
    return position;
  }
  if (ctx.atributos.mapZ != mapZ) { return position }

  return [posX, posY];

}

