// js/tilemapLoader.js

// Estrutura que armazena os dados do mapa carregado
export const tileMap = {
  width: 0, height: 0, tileW: 32, tileH: 32,
  layers: [],    // { name, data: number[] }
  tilesets: []   // { firstgid, columns, image: HTMLImageElement, tileW, tileH }
};

// --- Funções auxiliares (fetchText, dirOf, resolveRelative) ---
async function fetchText(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Falha ao carregar ${url}: ${res.status}`);
  return res.text();
}
function dirOf(url) {
  const u = new URL(url, window.location.origin);
  const parts = u.pathname.split('/');
  parts.pop();
  return parts.join('/') + '/';
}
function resolveRelative(basePath, rel) {
  if (rel.startsWith('http') || rel.startsWith('/')) return rel;
  return basePath + rel;
}

// --- Carregador de TSX (Tileset Externo) ---
async function loadTSX(tsxUrl) {
  const xml = await fetchText(tsxUrl);
  const doc = new DOMParser().parseFromString(xml, 'text/xml');
  const tilesetEl = doc.querySelector('tileset');
  const tileW = parseInt(tilesetEl.getAttribute('tilewidth'), 10);
  const tileH = parseInt(tilesetEl.getAttribute('tileheight'), 10);
  const columns = parseInt(tilesetEl.getAttribute('columns') || '1', 10);
  const imgEl = tilesetEl.querySelector('image');
  const src = imgEl.getAttribute('source');
  const basePath = dirOf(tsxUrl);
  const img = new Image();
  img.src = resolveRelative(basePath, src);
  await img.decode().catch(() => {});
  return { tileW, tileH, columns, img };
}

// --- Carregador de TMX (Mapa) ---
export async function loadTMX(tmxUrl) {
  const xml = await fetchText(tmxUrl);
  const doc = new DOMParser().parseFromString(xml, 'text/xml');

  const mapEl = doc.querySelector('map');
  tileMap.width  = parseInt(mapEl.getAttribute('width'), 10);
  tileMap.height = parseInt(mapEl.getAttribute('height'), 10);
  tileMap.tileW  = parseInt(mapEl.getAttribute('tilewidth'), 10);
  tileMap.tileH  = parseInt(mapEl.getAttribute('tileheight'), 10);

  // Ajusta o canvas (importante que o canvas exista no HTML)
  const canvas = document.getElementById('gameCanvas');
  canvas.width  = tileMap.width * tileMap.tileW;   // 13*32 = 416
  canvas.height = tileMap.height * tileMap.tileH;  // 8*32  = 256

  // Carrega tilesets externos
  tileMap.tilesets = [];
  const basePath = dirOf(tmxUrl);
  const tsNodes = doc.querySelectorAll('tileset');
  for (const ts of tsNodes) {
    const firstgid = parseInt(ts.getAttribute('firstgid'), 10);
    const source = ts.getAttribute('source'); // .tsx
    if (!source) continue;
    const tsxUrl = resolveRelative(basePath, source);
    const tsx = await loadTSX(tsxUrl);
    tileMap.tilesets.push({
      firstgid, columns: tsx.columns,
      tileW: tsx.tileW, tileH: tsx.tileH, image: tsx.img
    });
  }

  // Lê layers (CSV)
  tileMap.layers = [];
  const layers = doc.querySelectorAll('layer');
  for (const layer of layers) {
    const name = layer.getAttribute('name') || 'Layer';
    const dataEl = layer.querySelector('data');
    const encoding = dataEl.getAttribute('encoding');
    if (encoding !== 'csv') continue;
    const csv = dataEl.textContent.trim();
    const arr = csv.split(',').map(s => parseInt(s.trim(), 10));
    tileMap.layers.push({ name, data: arr });
  }
}

// --- Helper de Renderização de Mapa ---
export function findTilesetForGid(gid) {
  let res = null;
  for (const ts of tileMap.tilesets) {
    if (gid >= ts.firstgid) {
      if (!res || ts.firstgid > res.firstgid) res = ts;
    }
  }
  return res;
}