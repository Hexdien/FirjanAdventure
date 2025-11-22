


export function playerSpawn(ctx, position, mapConfig) {
  // Primeiro Spawn do player
  if (ctx.pos.x === 0 && ctx.pos.y === 0) {
    console.log("caiu no if 1")
    return position
  }

  if (ctx.atributos.mapZ === mapConfig.mapZ) {
    console.log("caiu no if 2")
    return [ctx.pos.x, ctx.pos.y];
  }

  if (ctx.atributos.mapZ != mapConfig.mapZ) {
    console.log("caiu no if 3")
    ctx.atributos.mapZ = mapConfig.mapZ;
    return position;
  }


}


