// script.js
//----- k  l  y g --

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// === [MUDANÇA] - pegando referência do wrap para controlar background GIF via CSS ===
const canvasWrap = document.querySelector('.canvas-wrap');

// === [MUDANÇA] - valores base (referência) ===
const BASE = {
  width: 650,
  height: 400,
  size: 50,   // base tamanho do personagem (px)
  step: 50,   // base passo do grid (px)
  battleMargin: 50 // margem utilizada no modo batalha (px)
};

// === [MUDANÇA] - Configuração do visual do HUD/status (ajuste aqui) ===
const STATUS_UI_CONFIG = {
  panelW: 100,      // largura do painel em "unidades base" (multiplicado por scale)
  panelH: 56,       // altura do painel em "unidades base"
  pad: 10,          // padding interno do painel
  fontBase: 12,     // tamanho da fonte base (será multiplicado por scale)
  barHeight: 10,    // altura da barra de HP em "unidades base"
  // Anchors: você pode usar 'left' ou 'right' para x; 'top' ou 'bottom' para y
  enemyAnchor: { x: 'left',  y: 'top',    offsetX: 20, offsetY: 150 },
  playerAnchor:{ x: 'right', y: 'top',    offsetX: 20, offsetY: 150 }
};


// === [MUDANÇA] - multiplicador de escala apenas para batalha (ajuste aqui se quiser maior/menor) ===
const BATTLE_SCALE = 2.6; // === aumente para aumentar tamanho em batalha (ex.: 1.8) ===

// === variáveis que serão recalculadas conforme a escala ===
let scale = 1;            // escala atual (proporção)
let sizeScaled = BASE.size;
let stepScaled = BASE.step;
let battleMarginScaled = BASE.battleMargin;
let battleSizeScaled = BASE.size * BATTLE_SCALE; // === [MUDANÇA] tamanho usado em batalha
let cols = 0, rows = 0;   // dimensões da grade (nº posições)

// índices de grid para posição do jogador
let posIndex = { i: 6, j: 7 };

// variáveis para monstro e modo batalha
let monsterImg = null;
let monsterIndex = { i: 0, j: 0 };
let inBattle = false;

// === [MUDANÇA] - STATUS / HP no canvas (adicione após declarações de inBattle / monsterImg) ===
const playerStatus = { current: 100, max: 100, attack: 30 };
const monsterStatus = { current: 100, max: 100, attack: 25 };

// tween simples para animar valor numérico
function animateHPValue(obj, from, to, duration = 500, onUpdate, onComplete) {
  const start = performance.now();
  function step(now) {
    const t = Math.min(1, (now - start) / duration);
    // easeOutQuad
    const eased = t * (2 - t);
    obj.current = Math.round(from + (to - from) * eased);
    if (onUpdate) onUpdate(obj);
    if (t < 1) requestAnimationFrame(step);
    else {
      obj.current = to;
      if (onUpdate) onUpdate(obj);
      if (onComplete) onComplete();
    }
  }
  requestAnimationFrame(step);
}

// reduz HP com animação (target = 'player' ou 'monster')
function diminuirHPCanvas(target, dano) {
  const status = target === 'player' ? playerStatus : monsterStatus;
  const atual = status.current;
  const novo = Math.max(0, atual - dano);
  animateHPValue(status, atual, novo, 500, () => {
    // redesenha (chamamos draw() que já é chamado no loop; mas forçamos apenas para responsividade)
    draw();
  });
}


// === [MUDANÇA] - Estado de animações de batalha ===
const battleOffset = {
  player: { x: 0, y: 0 },
  monster: { x: 0, y: 0 }
};

const hitEffect = {
  player: { time: 0 },   // tempo restante do efeito (ms)
  monster: { time: 0 }
};

// configuração da animação (ajuste à vontade)
const ATTACK_CONFIG = {
  distance: 60,    // pixels CSS que o atacante avança (ajuste)
  duration: 220,   // ms tempo total do avanço+volta
  impactTime: 110, // ms (meio da animação) quando o impacto ocorre
  hitFlash: 260,   // ms duração do flash vermelho no alvo
  scaleOnHit: 0.92 // reduz ligeiramente o alvo no impacto
};

// utilidade de easing (suave)
function easeOutQuad(t) { return t * (2 - t); }


const monsterImages = [
  'imagens/ghost.png',
  'imagens/goblin.png',
  'imagens/minotaur.png',
  'imagens/skel.png'
];

// carregando imagem do player
const playerImg = new Image();
playerImg.src = 'imagens/person2.png';

playerImg.onload = () => {
  //resizeCanvas();
  draw();
};

// função que redimensiona o canvas proporcionalmente
function resizeCanvas() {
  const wrap = document.querySelector('.canvas-wrap');
  const wrapRect = wrap.getBoundingClientRect();

  const cssMaxWidth = wrapRect.width;
  const cssWidth = Math.min(cssMaxWidth, BASE.width * 1.8);
  const cssHeight = (cssWidth * BASE.height) / BASE.width;

  const dpr = window.devicePixelRatio || 1;

  canvas.style.width = cssWidth + 'px';
  canvas.style.height = cssHeight + 'px';
  canvas.width = Math.round(cssWidth * dpr);
  canvas.height = Math.round(cssHeight * dpr);

  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  scale = cssWidth / BASE.width;
  sizeScaled = BASE.size * scale;
  stepScaled = BASE.step * scale;
  battleMarginScaled = BASE.battleMargin * scale;

  // === [MUDANÇA] recalcula battleSizeScaled também com a escala atual ===
  battleSizeScaled = sizeScaled * BATTLE_SCALE;

  cols = Math.floor((BASE.width - BASE.step) / BASE.step) + 1; // 13 no base
  rows = Math.floor((BASE.height - BASE.step) / BASE.step) + 1; // 8 no base

  posIndex.i = Math.min(Math.max(0, posIndex.i), cols - 1);
  posIndex.j = Math.min(Math.max(0, posIndex.j), rows - 1);

  monsterIndex.i = Math.min(Math.max(0, monsterIndex.i), cols - 1);
  monsterIndex.j = Math.min(Math.max(0, monsterIndex.j), rows - 1);

  draw();
}

window.addEventListener('resize', () => {
  resizeCanvas();
});

// utilitário: converte índice de grade para posição em pixels (CSS pix)
function indexToPixel(i, j) {
  return { x: i * stepScaled, y: j * stepScaled };
}

// === [MUDANÇA] - função que desenha painéis de HP durante a batalha ===
// === [MUDANÇA] utilitário: desenha um retângulo com cantos arredondados ===
function roundedRect(ctx, x, y, w, h, r) {
  // garante radius não maior que metade das dimensões
  r = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y,     x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x,     y + h, r);
  ctx.arcTo(x,     y + h, x,     y,     r);
  ctx.arcTo(x,     y,     x + w, y,     r);
  ctx.closePath();
}

// === [SUBSTITUIR: drawBattleStatus] ===
// Desenha: LEFT = Jogador, RIGHT = Inimigo (com cantos arredondados)
function drawBattleStatus() {
  const cfg = STATUS_UI_CONFIG;
  const pad = Math.round(cfg.pad * scale);
  const panelW = Math.round(cfg.panelW * scale);
  const panelH = Math.round(cfg.panelH * scale);
  const barW = Math.round(panelW - pad * 2);
  const barH = Math.max(6, Math.round(cfg.barHeight * scale));
  const fontSize = Math.max(10, Math.round(cfg.fontBase * scale));
  ctx.font = `${fontSize}px sans-serif`;
  ctx.textBaseline = 'top';

  // raio dos cantos (ajuste multiplicador se quiser cantos mais suaves)
  const cornerRadius = Math.max(6, Math.round(8 * scale));

  function calcPos(anchor, forceX) {
    const sideX = forceX || anchor.x;
    const x = (sideX === 'left')
      ? Math.round(anchor.offsetX * scale)
      : Math.round(BASE.width * scale - panelW - anchor.offsetX * scale);
    const y = (anchor.y === 'top')
      ? Math.round(anchor.offsetY * scale)
      : Math.round(BASE.height * scale - panelH - anchor.offsetY * scale);
    return { x, y };
  }

  // LEFT = JOGADOR
  const leftAnchor = {
    x: 'left',
    y: cfg.playerAnchor.y || 'top',
    offsetX: cfg.playerAnchor.offsetX || cfg.enemyAnchor.offsetX || 20,
    offsetY: cfg.playerAnchor.offsetY || cfg.enemyAnchor.offsetY || 18
  };
  const leftPos = calcPos(leftAnchor, 'left');
  const lx = leftPos.x, ly = leftPos.y;

  ctx.save();
  // sombra suave opcional
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = Math.max(2, Math.round(6 * scale));
  ctx.shadowOffsetX = Math.max(1, Math.round(2 * scale));
  ctx.shadowOffsetY = Math.max(1, Math.round(2 * scale));

  // fundo arredondado
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundedRect(ctx, lx, ly, panelW, panelH, cornerRadius);
  ctx.fill();

  // contorno
  ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0; // contorno sem sombra
  ctx.lineWidth = Math.max(1, Math.round(2 * scale));
  ctx.strokeStyle = 'black';
  roundedRect(ctx, lx, ly, panelW, panelH, cornerRadius);
  ctx.stroke();

  // textos e barra
  ctx.fillStyle = 'black';
  ctx.fillText('Jogador', lx + pad, ly + pad);
  ctx.fillText(`${playerStatus.current} / ${playerStatus.max}`, lx + pad, ly + pad + fontSize + 2);

  const hpPercP = Math.max(0, playerStatus.current / playerStatus.max);
  const hpFillW_P = Math.round(barW * hpPercP);
  const barX_P = lx + pad;
  const barY_P = ly + panelH - pad - barH;

  // barra fundo e preenchimento (retângulo simples dentro do painel)
  ctx.fillStyle = '#ddd';
  roundedRect(ctx, barX_P - 1, barY_P - 1, barW + 2, barH + 2, Math.max(4, Math.round(4 * scale)));
  ctx.fill();

  let colorP = '#00c000';
  if (hpPercP < 0.3) colorP = '#e00000';
  else if (hpPercP < 0.6) colorP = '#f8b000';
  ctx.fillStyle = colorP;
  // preenchimento com cantos levemente arredondados
  roundedRect(ctx, barX_P, barY_P, hpFillW_P, barH, Math.max(3, Math.round(3 * scale)));
  ctx.fill();

  // contorno da barra
  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.max(1, Math.round(1 * scale));
  roundedRect(ctx, barX_P, barY_P, barW, barH, Math.max(4, Math.round(4 * scale)));
  ctx.stroke();

  ctx.restore();

  // RIGHT = INIMIGO
  const rightAnchor = {
    x: 'right',
    y: cfg.enemyAnchor.y || 'top',
    offsetX: cfg.enemyAnchor.offsetX || cfg.playerAnchor.offsetX || 20,
    offsetY: cfg.enemyAnchor.offsetY || cfg.playerAnchor.offsetY || 18
  };
  const rightPos = calcPos(rightAnchor, 'right');
  const rx = rightPos.x, ry = rightPos.y;

  ctx.save();
  // sombra
  ctx.shadowColor = 'rgba(0,0,0,0.15)';
  ctx.shadowBlur = Math.max(2, Math.round(6 * scale));
  ctx.shadowOffsetX = Math.max(1, Math.round(2 * scale));
  ctx.shadowOffsetY = Math.max(1, Math.round(2 * scale));

  // fundo arredondado
  ctx.fillStyle = 'rgba(255,255,255,0.92)';
  roundedRect(ctx, rx, ry, panelW, panelH, cornerRadius);
  ctx.fill();

  ctx.shadowBlur = 0; ctx.shadowOffsetX = 0; ctx.shadowOffsetY = 0;
  ctx.lineWidth = Math.max(1, Math.round(2 * scale));
  ctx.strokeStyle = 'black';
  roundedRect(ctx, rx, ry, panelW, panelH, cornerRadius);
  ctx.stroke();

  ctx.fillStyle = 'black';
  ctx.fillText('Inimigo', rx + pad, ry + pad);
  ctx.fillText(`${monsterStatus.current} / ${monsterStatus.max}`, rx + pad, ry + pad + fontSize + 2);

  const hpPercE = Math.max(0, monsterStatus.current / monsterStatus.max);
  const hpFillW_E = Math.round(barW * hpPercE);
  const barX_E = rx + pad;
  const barY_E = ry + panelH - pad - barH;

  ctx.fillStyle = '#ddd';
  roundedRect(ctx, barX_E - 1, barY_E - 1, barW + 2, barH + 2, Math.max(4, Math.round(4 * scale)));
  ctx.fill();

  let colorE = '#00c000';
  if (hpPercE < 0.3) colorE = '#e00000';
  else if (hpPercE < 0.6) colorE = '#f8b000';
  ctx.fillStyle = colorE;
  roundedRect(ctx, barX_E, barY_E, hpFillW_E, barH, Math.max(3, Math.round(3 * scale)));
  ctx.fill();

  ctx.strokeStyle = 'black';
  ctx.lineWidth = Math.max(1, Math.round(1 * scale));
  roundedRect(ctx, barX_E, barY_E, barW, barH, Math.max(4, Math.round(4 * scale)));
  ctx.stroke();

  ctx.restore();
}


// mainLoop (mantido)
function mainLoop() {
  draw(); // redesenha tudo
  requestAnimationFrame(mainLoop);
}

// desenho principal considera valores escalados
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if (inBattle) {
    // fallback gradiente caso o CSS não esteja aplicando o GIF
    if (!canvasWrap.classList.contains('battle')) {
      const gradient = ctx.createLinearGradient(0, 0, BASE.width * scale, BASE.height * scale);
      gradient.addColorStop(0, 'black');
      gradient.addColorStop(0.5, 'red');
      gradient.addColorStop(1, 'purple');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, BASE.width * scale, BASE.height * scale);
    }
    
    drawBattleStatus();

    const battleAreaHeight = BASE.height * scale;
    const battleCenterY = Math.round(battleAreaHeight * 0.75) - (battleSizeScaled / 2);
  
    // player posição (use seus offsets já definidos)
    const playerX = Math.round(battleMarginScaled + 160) + (battleOffset.player.x || 0);
    const playerY = Math.round(battleCenterY + 50)  + (battleOffset.player.y || 0);
  
    // monstro posição (espelhado), aplicado offset do monstro
    const monsterX = Math.round(BASE.width * scale - battleSizeScaled - battleMarginScaled) + (battleOffset.monster.x || 0);
    const monsterY = Math.round(battleCenterY) + (battleOffset.monster.y || 0);
  
    // desenha o player (sem escala de impacto por simplicidade)
    ctx.drawImage(playerImg, playerX, playerY, battleSizeScaled, battleSizeScaled);
  
    // se houver efeito de hit no monstro, aplicamos um pequeno scale e flash vermelho
    let drawMonsterX = monsterX;
    let drawMonsterY = monsterY;
    let drawMonsterW = battleSizeScaled;
    let drawMonsterH = battleSizeScaled;
  
    // === aplica "pulsar/encolher" quando houver hitEffect no monstro ===
    if (hitEffect.monster.time > 0) {
      const t = hitEffect.monster.time / ATTACK_CONFIG.hitFlash; // 1 -> 0
      const s = 1 - (1 - ATTACK_CONFIG.scaleOnHit) * (1 - t); // anima de 1 -> scaleOnHit -> 1
      drawMonsterW = Math.round(battleSizeScaled * s);
      drawMonsterH = Math.round(battleSizeScaled * s);
  
      // centralizar a redução em relação à posição original
      drawMonsterX += Math.round((battleSizeScaled - drawMonsterW) / 2);
      drawMonsterY += Math.round((battleSizeScaled - drawMonsterH) / 2);
    }
  
    if (monsterImg) {
      ctx.drawImage(monsterImg, drawMonsterX, drawMonsterY, drawMonsterW, drawMonsterH);
  
      // === desenha flash vermelho se houver hitEffect ===
      if (hitEffect.monster.time > 0) {
        const alpha = Math.max(0, hitEffect.monster.time / ATTACK_CONFIG.hitFlash);
        ctx.fillStyle = `rgba(255,0,0,${0.35 * alpha})`;
        ctx.fillRect(drawMonsterX, drawMonsterY, drawMonsterW, drawMonsterH);
      }
    }
  
    // === se o player também levar hit, desenha flash nele do mesmo jeito
    if (hitEffect.player.time > 0) {
      const alphaP = Math.max(0, hitEffect.player.time / ATTACK_CONFIG.hitFlash);
      ctx.fillStyle = `rgba(255,0,0,${0.28 * alphaP})`;
      ctx.fillRect(playerX, playerY, battleSizeScaled, battleSizeScaled);
    }
  
  } else {
    // ... seu bloco normal sem repintar fundo (como você já corrigiu)
    const p = indexToPixel(posIndex.i, posIndex.j);
    ctx.drawImage(playerImg, p.x, p.y, sizeScaled, sizeScaled);
  
    if (monsterImg) {
      const m = indexToPixel(monsterIndex.i, monsterIndex.j);
      ctx.drawImage(monsterImg, m.x, m.y, sizeScaled, sizeScaled);
    }
  }
}  

// iniciar loop de animação (uma vez)
requestAnimationFrame(mainLoop);

// movimentação agora usa índices de grade

async function sendMove(dx, dy) {
  const res = await fetch('/api/jogo/mover', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ dx, dy })
  });
  if (!res.ok) throw new Error('Falha na movimentação');
  const state = await res.json();
  applyGameState(state); // atualiza HUD, posição e modo (batalha/exploração)
}

function applyGameState(state) {
  // Atualiza posição do player e status
  if (state.personagem) {
    posIndex.i = state.personagem.posX; // ou transformar se seu grid usar (i,j)
    posIndex.j = state.personagem.posY;
    player.hp = state.personagem.hp;
    player.mp = state.personagem.mp;
    // ... demais campos para HUD
  }

  inBattle = state.estado === 'BATALHA';
  currentEnemy = state.monstro; // null se não em batalha

  if (state.log) showLog(state.log); // opcional
  draw();
}

function movePlayer(direction) {
  if (inBattle) return; // bloqueia durante batalha

  let dx = 0, dy = 0;
  if (direction === 'ArrowUp' || direction === 'w') dy = -1;
  if (direction === 'ArrowDown' || direction === 's') dy = +1;
  if (direction === 'ArrowLeft' || direction === 'a') dx = -1;
  if (direction === 'ArrowRight' || direction === 'd') dx = +1;

  // Backend decide limites/colisões e encontro
  sendMove(dx, dy).catch(console.error);
}

/*function movePlayer(direction) {
  if (inBattle) return; // bloqueia movimentação em batalha

  let ni = posIndex.i;
  let nj = posIndex.j;

  if (direction === 'ArrowUp') nj -= 1;
  if (direction === 'ArrowDown') nj += 1;
  if (direction === 'ArrowLeft') ni -= 1;
  if (direction === 'ArrowRight') ni += 1;

  if (ni >= 0 && ni < cols && nj >= 0 && nj < rows) {
    posIndex.i = ni;
    posIndex.j = nj;
    sendPositionToAPI(posIndex);
  }

  draw();
}*/

document.addEventListener('keydown', (e) => {
  movePlayer(e.key);
});

// adaptado para receber posIndex (i,j)
async function sendPositionToAPI(positionIndex) {
  console.log('Enviando para API (índice):', positionIndex);
  const chance = Math.random();
  if (chance < 0.3) {
    console.log('👾 Um monstro pode aparecer!');
    generateMonster(positionIndex);
  }
}

// captura de resposta no modo batalha (S/N)
document.addEventListener('keydown', (e) => {
  if (!inBattle) return;

  if (e.key.toLowerCase() === 'a') {
    // player ataca o monstro
    triggerAttack('player');
  
    // opcional: simular contra-ataque do monstro após 700ms
    setTimeout(() => {
      if (inBattle && monsterImg) triggerAttack('monster');
    }, 700);
  }

  if (e.key.toLowerCase() === 's') { // SIM para lutar
    console.log('⚔️ Iniciando batalha!');
    draw();
  } else if (e.key.toLowerCase() === 'n') {
    console.log('💨 Fugiu da batalha!');
    monsterImg = null;
    inBattle = false;
    if (canvasWrap) canvasWrap.classList.remove('battle');
    draw();
  }
});

// === [MUDANÇA] - função que anima um ataque; attacker = 'player' ou 'monster'
// === [SUBSTITUIR: triggerAttack] ===
function triggerAttack(attacker) {
  if (!inBattle) return; // só em batalha

  const attackerKey = attacker === 'player' ? 'player' : 'monster';
  const targetKey = attacker === 'player' ? 'monster' : 'player';

  const start = performance.now();
  const dur = ATTACK_CONFIG.duration;
  const dist = ATTACK_CONFIG.distance * (scale); // distância em CSS px já escalada

  // direção: player move para a direita se monstro estiver à direita; monster move para a esquerda
  const dir = attacker === 'player' ? 1 : -1; // 1 -> x aumenta, -1 -> x diminui

  let impactTriggered = false; // garante que o impacto ocorra apenas 1 vez

  function frame(now) {
    const t = Math.min(1, (now - start) / dur);
    // ease para ida e volta: 0..0.5 ida, 0.5..1 volta — mapeamos para 0..1
    let phase;
    if (t < 0.5) {
      phase = easeOutQuad(t / 0.5); // ida 0..1
    } else {
      phase = 1 - easeOutQuad((t - 0.5) / 0.5); // volta 1..0
    }

    const offsetX = Math.round(dist * phase * dir);

    // aplica offset (apenas no eixo X)
    battleOffset[attackerKey].x = offsetX;

    // quando cruzar o meio da animação, dispara o impacto (uma vez)
    if (!impactTriggered && t >= 0.5) {
      impactTriggered = true;

      // aplica hit effect visual no alvo
      hitEffect[targetKey].time = ATTACK_CONFIG.hitFlash;

      // calcula dano e reduz HP do alvo
      const damage = attacker === 'player' ? playerStatus.attack : monsterStatus.attack;
      const target = attacker === 'player' ? 'monster' : 'player';
      diminuirHPCanvas(target, damage);
    }

    // terminar
    if (t < 1) {
      requestAnimationFrame(frame);
    } else {
      // reset offsets ao finalizar
      battleOffset[attackerKey].x = 0;
    }
  }

  requestAnimationFrame(frame);
}


// === [MUDANÇA] - tick para reduzir timers (chame no main loop para sincronizar)
// === [SUBSTITUIR: mainLoop + timers] ===
let lastFrameTime = performance.now();

function updateAnimationTimers(deltaMs) {
  // reduz timers de hitEffect
  ['player', 'monster'].forEach(k => {
    if (hitEffect[k].time > 0) {
      hitEffect[k].time = Math.max(0, hitEffect[k].time - deltaMs);
    }
  });
}

function mainLoop() {
  const now = performance.now();
  const delta = now - lastFrameTime;
  lastFrameTime = now;

  updateAnimationTimers(delta);
  draw();
  requestAnimationFrame(mainLoop);
}

// Inicia o loop (apenas aqui)
requestAnimationFrame(mainLoop);


// gerar monstro em termos de índices
function generateMonster(playerIndex) {
  const randomIndex = Math.floor(Math.random() * monsterImages.length);
  const img = new Image();
  img.src = monsterImages[randomIndex];

  img.onload = () => {
    monsterImg = img;

    let mi = playerIndex.i;
    let mj = playerIndex.j - 1;

    if (mj < 0) {
      mj = playerIndex.j;
      mi = playerIndex.i + 1;
    }

    if (mi >= cols) mi = cols - 1;
    if (mj >= rows) mj = rows - 1;
    if (mi < 0) mi = 0;
    if (mj < 0) mj = 0;

    monsterIndex.i = mi;
    monsterIndex.j = mj;

    draw();

    setTimeout(() => {
      const resposta = confirm('Um monstro apareceu! Deseja lutar? (S ou N)');
      if (resposta) {
        inBattle = true;
        if (canvasWrap) canvasWrap.classList.add('battle');
      } else {
        monsterImg = null;
        if (canvasWrap) canvasWrap.classList.remove('battle');
      }
      draw();
    }, 100);
  };

  img.onerror = () => {
    console.error('Erro ao carregar imagem do monstro:', monsterImages[randomIndex]);
  };
}

// inicializar canvas caso a imagem já esteja no cache
if (playerImg.complete) {
  resizeCanvas();
  draw();
}
