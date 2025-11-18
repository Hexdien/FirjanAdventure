package com.firjanadventure.firjanadventure.web.dto;

public record BattleStateResponse(
    Long battleId,
    int monsterHp,
    int monsterAtk,
    int monsterDef,

    String estado,
    String turnoAtual

) {
}
