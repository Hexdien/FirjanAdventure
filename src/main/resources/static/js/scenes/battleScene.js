import { getPersonagem } from "../controllers/getPersonagem.js";




export function createBattleUI(k, ctx, btl) {
  k.add([
    k.sprite("battle-background"),
    k.scale(1.3),
    k.pos(0, 0)]);

  const BAR_FULL_WIDTH = 370;
  const BAR_FULL_HEIGHT = 40;
  const BOX_WIDTH = 400;
  const BOX_HEIGHT = 100;
  const monsterName = btl.tipo;
  const battleId = btl.battleId;

  const monsterAttackReq = {
    "personagemId": ctx.id,
    "acao": "ATACAR",
    "tipoAtaque": "FISICO"
  }
  const playerAttackReq = {
    "personagemId": ctx.id,
    "acao": "ATACAR",
    "tipoAtaque": "undefined"
  }

  const enemyMon = k.add([
    k.sprite(monsterName, { anim: "idle" }),
    k.scale(5),
    k.pos(1300, -20),
    k.opacity(1),
    {
      fainted: false,
    },
  ]);
  enemyMon.flipX = true;

  k.tween(
    enemyMon.pos.x,
    900,
    0.3,
    (val) => (enemyMon.pos.x = val),
    k.easings.easeInSine
  );

  const playerMon = k.add([
    k.sprite("player-right"),
    k.scale(8),
    k.pos(-100, 300),
    k.opacity(1),
    {
      fainted: false,
    },
  ]);

  k.tween(
    playerMon.pos.x,
    300,
    0.3,
    (val) => (playerMon.pos.x = val),
    k.easings.easeInSine
  );

  const box = k.add([k.rect(1300, 300), k.outline(4), k.pos(-2, 530)]);

  const content = box.add([
    k.text("Voce esta pronto para a batalha!", { size: 42 }),
    k.color(10, 10, 10),
    k.pos(20, 20),
  ]);



  // --- utilitários ---
  function calcWidth(current, max) {
    if (!max || max <= 0) return 0;
    return Math.max(0, Math.trunc((current / max) * BAR_FULL_WIDTH));
  }

  function safeInt(v, fallback = 0) {
    return Number.isFinite(v) ? v : fallback;
  }

  // --- inicial valores (player do ctx, monstro do btl) ---
  const playerHp = safeInt(ctx?.atributos?.hp, 0);
  const playerHpMax = safeInt(ctx?.atributos?.hpMax, 100);

  const monsterHp = safeInt(btl?.monsterHp, safeInt(btl?.monsterHpMax, 1));
  const monsterHpMax = safeInt(btl?.monsterHpMax, monsterHp);

  // --- Caixa do PLAYER (lado direito) ---
  const playerMonHealthBox = k.add([
    k.rect(BOX_WIDTH, BOX_HEIGHT),
    k.outline(4),
    k.pos(1000, 400),
    k.layer("ui"), // opcional se usar layers
    { name: "playerHealthBox" }
  ]);

  const playerNameText = playerMonHealthBox.add([
    k.text(ctx.nome || "Player", { size: 32 }),
    k.color(10, 10, 10),
    k.pos(10, 10),
  ]);

  // fundo da barra
  playerMonHealthBox.add([
    k.rect(BAR_FULL_WIDTH, BAR_FULL_HEIGHT),
    k.color(200, 200, 200),
    k.pos(15, 50),
  ]);

  // barra verde (width será animado)
  const playerMonHealthBar = playerMonHealthBox.add([
    k.rect(calcWidth(playerHp, playerHpMax), BAR_FULL_HEIGHT),
    k.color(0, 200, 0),
    k.pos(15, 50),
  ]);

  // texto HP "87 / 100
  const playerHpText = playerMonHealthBox.add([
    k.text(`${playerHp} / ${playerHpMax}`, { size: 21, font: "roboto-black" }),
    k.pos(15, 65),
    k.color(0, 0, 0,)
  ]);

  // Centraliza o texto dentro da barra
  playerHpText.pos.x = (BAR_FULL_WIDTH - playerHpText.width) / 2 + 15;




  // tween inicial de entrada
  k.tween(
    playerMonHealthBox.pos.x,
    850,
    0.3,
    (val) => (playerMonHealthBox.pos.x = val),
    k.easings.easeInSine
  );

  // --- Caixa do MONSTRO (lado esquerdo) ---
  const enemyMonHealthBox = k.add([
    k.rect(BOX_WIDTH, BOX_HEIGHT),
    k.outline(4),
    k.pos(-100, 50),
    k.layer("ui"),
    { name: "monsterHealthBox" }
  ]);

  const enemyNameText = enemyMonHealthBox.add([
    k.text(monsterName || "Enemy", { size: 32 }),
    k.color(10, 10, 10),
    k.pos(10, 10),
  ]);

  enemyMonHealthBox.add([
    k.rect(BAR_FULL_WIDTH, BAR_FULL_HEIGHT),
    k.color(200, 200, 200),
    k.pos(15, 50),
  ]);

  const enemyMonHealthBar = enemyMonHealthBox.add([
    k.rect(calcWidth(monsterHp, monsterHpMax), BAR_FULL_HEIGHT),
    k.color(0, 200, 0),
    k.pos(15, 50),
  ]);


  const enemyHpText = enemyMonHealthBox.add([
    k.text(`${monsterHp} / ${monsterHpMax}`, { size: 21, font: "roboto-black" }),
    k.color(0, 0, 0),
    k.pos(0, 65) // posição provisória
  ]);

  // Centraliza o texto dentro da barra
  enemyHpText.pos.x = (BAR_FULL_WIDTH - enemyHpText.width) / 2 + 15;

  k.tween(
    enemyMonHealthBox.pos.x,
    100,
    0.3,
    (val) => (enemyMonHealthBox.pos.x = val),
    k.easings.easeInSine
  );

  // --- popup de dano (cria, anima e remove) ---
  function showDamagePopup(x, y, damage, isCritical = false) {
    if (!damage || damage <= 0) return;
    const txt = k.add([
      k.text((damage > 0 ? `-${damage}` : `${damage}`), { size: 50 }),
      k.color(0, 0, 0),
      k.pos(x, y),
      //  k.layer("ui")
    ]);
    // cor crítica (apenas exemplo)
    if (isCritical) {
      txt.color = [255, 50, 50];
    }
    // anima: subir e fade out
    k.tween(txt.pos.y, txt.pos.y - 40, 0.6, (val) => (txt.pos.y = val), k.easings.easeOutQuad);
    // removendo depois de 700ms
    setTimeout(() => {
      try { k.destroy(txt); } catch (e) { /* ignore */ }
    }, 700);
  }

  // --- função que atualiza barras usando os VALORES VINDOS DO BACKEND e do ctx ---
  async function updateFromBattleState(btl) {
    // btl esperado: { battleId, monsterHp, monsterHpMax, monsterAtk, monsterDef, damage, estado, turnoAtual, maybe playerHp }
    if (!btl) return;

    // Atualizar monster: usa dados do backend (sempre)
    const newMonsterHp = safeInt(btl.monsterHp, monsterHp);
    const newMonsterHpMax = safeInt(btl.monsterHpMax, monsterHpMax);

    // Atualizar player: preferir btl.playerHp se presente, senão usar ctx
    const ctx = await getPersonagem();
    const newPlayerHp = typeof btl.playerHp !== 'undefined' ? safeInt(btl.playerHp, ctx.atributos.hp) : safeInt(ctx.atributos.hp, playerHp);
    const newPlayerHpMax = safeInt(ctx.atributos.hpMax, playerHpMax);

    // update ctx local (útil para lógica local posterior)
    ctx.atributos.hp = newPlayerHp;
    ctx.atributos.hpMax = newPlayerHpMax;

    // Calcula larguras alvo
    const targetMonsterWidth = calcWidth(newMonsterHp, newMonsterHpMax);
    const targetPlayerWidth = calcWidth(newPlayerHp, newPlayerHpMax);

    // Tween para barra do monstro
    k.tween(
      enemyMonHealthBar.width,
      targetMonsterWidth,
      0.5,
      (val) => (enemyMonHealthBar.width = Math.max(0, Math.trunc(val))),
      k.easings.easeInSine
    );

    // Tween para barra do player
    k.tween(
      playerMonHealthBar.width,
      targetPlayerWidth,
      0.5,
      (val) => (playerMonHealthBar.width = Math.max(0, Math.trunc(val))),
      k.easings.easeInSine
    );

    // atualiza textos numéricos
    enemyHpText.text = `${newMonsterHp} / ${newMonsterHpMax}`;
    playerHpText.text = `${newPlayerHp} / ${newPlayerHpMax}`;


    // mostrar popup de dano (se campo damage existir)
    if (typeof btl.damage !== 'undefined' && btl.damage !== null) {
      // Se for dano do player ao monstro (turnoAtual pode sinalizar mas aqui apenas exibimos)
      // Mostra perto da barra do alvo. Usa pos global das boxes.
      // Se turnoAtual for PLAYER -> damage é do player (monstro sofreu)
      if (btl.turnoAtual && btl.turnoAtual === "MONSTER") {
        // o backend mudou o turno para MONSTER depois do ataque do player => damage foi no monstro
        showDamagePopup(enemyMonHealthBox.pos.x + 15 + targetMonsterWidth, enemyMonHealthBox.pos.y + 45, btl.damage);
      } else {
        // dano recebido pelo player (ou fallback)
        showDamagePopup(playerMonHealthBox.pos.x + 15 + targetPlayerWidth, playerMonHealthBox.pos.y + 45, btl.damage);
      }
    }

    // opcional: se backend fornece estado/turno, pode atualizar labels/efeitos aqui
    // ex: se (battleState.estado === "VITORIA") -> tocar animação de vitória
    if (btl.monsterHp <= 0) {
      enemyMon.fainted = true;
      enemyMon.play("dead");
      content.text = `Você venceu o/a ${monsterName}`
      setTimeout(() => {
        try { k.go("world", ctx) } catch (e) { /* ignore */ }
      }, 3000);
    }
    if (ctx.atributos.hp <= 0) {
      playerMon.fainted = true;
      content.text = `Você perdeu para ${monsterName}`
      setTimeout(() => {
        try { k.go("world", ctx) } catch (e) { /* ignore */ }
      }, 3000);
    }

  }



  // --- helper para enviar ataque e aplicar resposta (opcional) ---
  async function sendAttack(battleId, ataqueReq) {
    // endpoint que você mostrou: POST /{battleId}/atacar
    const url = `/api/batalha/${battleId}/atacar`;
    const resp = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(ataqueReq)
    });

    if (!resp.ok) {
      const txt = await resp.text();
      throw new Error(`Erro ao atacar: ${resp.status} ${txt}`);
    }

    const btl = await resp.json();
    // atualiza UI com o novo estado
    updateFromBattleState(btl);
    return btl;
  }


  let phase = "player-selection";
  k.onKeyPress("space", async () => {
    if (playerMon.fainted || enemyMon.fainted) return;

    if (phase === "player-selection") {
      content.text = "> Atacar";
      phase = "player-turn";
      return;
    }

    if (phase === "enemy-turn") {
      enemyMon.play("attack");
      content.text = `${monsterName} Ataca!`;
      btl = await sendAttack(battleId, monsterAttackReq);
      //const damageDealt = 50;
      phase = "player-selection";
      return;
    }

    if (phase === "player-turn") {
      enemyMon.play("dmg");
      let ataqueReq = playerAttackReq;
      ataqueReq.tipoAtaque = "FISICO";

      btl = await sendAttack(battleId, ataqueReq);
      //const damageDealt = 50;

      content.text = `${ctx.nome} Atacou!`
    }


    phase = "enemy-turn";
  });



  // --- expose API do UI ---
  return {
    playerBox: playerMonHealthBox,
    monsterBox: enemyMonHealthBox,
    playerBar: playerMonHealthBar,
    monsterBar: enemyMonHealthBar,
    updateFromBattleState,
    sendAttack, // opcional - use com cuidado se a rota for diferente
  };


}
