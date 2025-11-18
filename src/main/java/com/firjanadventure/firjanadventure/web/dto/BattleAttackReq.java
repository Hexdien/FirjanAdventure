package com.firjanadventure.firjanadventure.web.dto;

public record BattleAttackReq(
    Long personagemId,
    String acao,
    String tipoAtaque

) {
}
