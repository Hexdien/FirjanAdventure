
kaboom({
  width: 1280,
  height: 720,
  scale: 0.7,
});

setBackground(Color.fromHex("#36A6E0"));

loadAssets();

scene("battle", (worldState) => setBattle(worldState));
scene("world", (worldState) => setWorld(worldState));
// Fluxo principal 

(async function main() {
  const personagemId = getQueryParam('personagemId');
  if (!personagemId) {
    alert('personagemId não informado. Retornando ao login.');
    window.location.href = '/login.html';
    return;
  }

  // 1) Carregar estado do backend
  let personagem;
  try {
    personagem = await fetchJSON(`/api/personagens/${encodeURIComponent(personagemId)}`);
    // Opcional: snapshot local
    localStorage.setItem('personagem:last', JSON.stringify(personagem));
  } catch (err) {
    console.error('Falha ao buscar personagem do backend:', err);
    const snap = localStorage.getItem('personagem:last');
    if (snap) {
      personagem = JSON.parse(snap);
      alert('Carregando snapshot local (API indisponível).');
    } else {
      alert('Não foi possível carregar o personagem. Retornando ao login.');
      window.location.href = '/login.html';
      return;
    }
  }

  // 2) Montar contexto do jogo a partir do DTO de resposta
  const attrs = personagem.atributos || {};
  const contextoJogo = {
    id: personagem.id,
    nome: personagem.nome,
    sexo: personagem.sexo,
    pos: { x: personagem.posX || 0, y: personagem.posY || 0 },
    atributos: {
      level: attrs.level ?? attrs.nivel ?? 1,
      forca: attrs.forca ?? 0,
      defesa: attrs.defesa ?? 0,
      xp: attrs.xp ?? 0,
      // se tiver outros (agilidade, etc.) eles virão aqui
      ...attrs,
    },
    atualizadoEm: personagem.atualizadoEm,
    // configure aqui outras flags/estado do runtime
  };


  // 4) Carregar assets/mapa e spawn do player
  // await initWorldAndPlayer(contextoJogo);

  // 5) Configurar save do estado (PUT /estado)


  go("world", contextoJogo);
  setupAutoSave(contextoJogo)
})();
