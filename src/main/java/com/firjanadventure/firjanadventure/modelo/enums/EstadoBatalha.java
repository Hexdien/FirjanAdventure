package com.firjanadventure.firjanadventure.modelo.enums;

/**
 * Representa o estado atual da batalha.
 *
 * Regras de domínio:
 * - EM_ANDAMENTO: a batalha ainda aceita ações (ataque, defesa, turno).
 * - VITORIA / DERROTA: estados terminais; após entrar em um deles,
 * nenhuma ação de turno pode ser processada.
 *
 * Este enum é usado pelo BattleService para impedir processamento
 * após o fim da batalha e garantir consistência no fluxo de turnos.
 */
public enum EstadoBatalha {
  EM_ANDAMENTO, VITORIA, DERROTA
}
