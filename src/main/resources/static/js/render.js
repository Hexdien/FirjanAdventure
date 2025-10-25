// js/render.js
import { PLAYER_IMG, PLAYER_W, PLAYER_H, MONSTER_SPRITES } from './config.js';
import { tileMap, findTilesetForGid } from './tilemapLoader.js';
import { playerState, currentEnemy, lastEstado, lastDelta } from './state.js';

let ctx = null;
const playerImg = new Image();
const monsterCache = {}; // Cache para imagens de monstros

/**
 * Inicializa o módulo de renderização.
 */
export function initRenderer() {
  const canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');

  playerImg.src = PLAYER_IMG;
  playerImg.onload = () => draw(); // Desenha quando a imagem carregar

  // Pré-carrega sprites de monstros
  Object.values(MONSTER_SPRITES).forEach(src => getMonsterSprite(src));
}

/**
 * Função principal de desenho. Chamada a cada mudança de estado.
 */
export function draw() {
  if (!ctx) return;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  if (lastEstado === 'BATALHA') {
    drawBattleScene();
    return;
  }

  // Em EXPLORACAO ou ENCONTRO, desenhamos o mapa e o player
  drawTilemap();
  drawPlayer();

  // Se for ENCONTRO, desenha o inimigo no tile à frente
  if (lastEstado === 'ENCONTRO' && currentEnemy) {
    drawEnemyInFrontOfPlayer();
  }
}

// --- Funções de Desenho Específicas ---

function drawTilemap() {
  const { width, height, tileW, tileH } = tileMap;
  for (const layer of tileMap.layers) {
    for (let j = 0; j < height; j++) {
      for (let i = 0; i < width; i++) {
        const idx = j * width + i;
        const gid = layer.data[idx] | 0;
        if (gid === 0) continue;

        const ts = findTilesetForGid(gid);
        if (!ts) continue;

        const localId = gid - ts.firstgid;
        const sx = (localId % ts.columns) * ts.tileW;
        const sy = Math.floor(localId / ts.columns) * ts.tileH;
        const dx = i * tileW;
        const dy = j * tileH;

        ctx.drawImage(ts.image, sx, sy, ts.tileW, ts.tileH, dx, dy, tileW, tileH);
      }
    }
  }
}

function drawPlayer() {
  const dx = playerState.posX * tileMap.tileW;
  const dy = playerState.posY * tileMap.tileH;
  // Offset (PLAYER_H - tileMap.tileH) alinha os pés do sprite no tile
  ctx.drawImage(playerImg, dx, dy - (PLAYER_H - tileMap.tileH), PLAYER_W, PLAYER_H);
}

function drawBattleScene() {
  ctx.fillStyle = '#220011';
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = '#fff';
  ctx.font = '16px sans-serif';
  ctx.fillText('BATALHA!', 20, 24);
  if (currentEnemy) {
    ctx.fillText(`Inimigo: ${currentEnemy.tipo} HP: ${currentEnemy.hp}`, 20, 48);
  }
}

function drawEnemyInFrontOfPlayer() {
  const { dx, dy } = lastDelta; // Pega o delta do passo que gerou o encontro
  const tx = playerState.posX + dx; // Tile X do inimigo
  const ty = playerState.posY + dy; // Tile Y do inimigo

  const img = getMonsterSprite(currentEnemy.tipo);
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const MW = 64, MH = 64; // Ajuste se o sprite do monstro for 64px de altura
  const sx = tx * tileMap.tileW;
  const sy = ty * tileMap.tileH;
  ctx.drawImage(img, sx, sy - (MH - tileMap.tileH), MW, MH);
}

/**
 * Carrega ou busca do cache a imagem de um monstro.
 */
function getMonsterSprite(tipo) {
  const src = MONSTER_SPRITES[tipo] || MONSTER_SPRITES['Slime']; // Fallback para Slime
  if (!src) return null;

  if (!monsterCache[src]) {
    const img = new Image();
    img.src = src;
    img.onload = () => draw(); // Redesenha quando o monstro carregar
    monsterCache[src] = img;
  }
  return monsterCache[src];
}