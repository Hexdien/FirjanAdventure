
import { getQueryParam } from "../game.js";
import { fetchJSON } from "../game.js";

export async function getPersonagem() {
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
    //localStorage.setItem('personagem:last', JSON.stringify(personagem));
  } catch (err) {
    console.error('Falha ao buscar personagem do backend:', err);
    // const snap = localStorage.getItem('personagem:last');
    // if (snap) {
    //   personagem = JSON.parse(snap);
    //   alert('Carregando snapshot local (API indisponível).');
    // } else {
    alert('Não foi possível carregar o personagem. Retornando ao login.');
    window.location.href = '/login.html';
    return;

  }

  // 2) Montar contexto do jogo a partir do DTO de resposta
  const attrs = personagem.atributos || {};
  const ctx = {
    id: personagem.id,
    nome: personagem.nome,
    sexo: personagem.sexo,
    pos: { x: personagem.posX || 0, y: personagem.posY || 0 },
    atributos: {
      level: attrs.level ?? attrs.nivel ?? 1,
      hpMax: attrs.hpMax ?? 100,
      hp: attrs.hp ?? attrs.hpMax ?? 100,
      forca: attrs.forca ?? 0,
      defesa: attrs.defesa ?? 0,
      xp: attrs.xp ?? 0,
      statPoints: attrs.statPoints ?? 0,
      mapZ: attrs.mapZ ?? 1,
      // se tiver outros (agilidade, etc.) eles virão aqui
      ...attrs,
    },
    atualizadoEm: personagem.atualizadoEm,
  };
  return ctx;
}
