package com.firjanadventure.firjanadventure.web.dto;

import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;

public record BattleStateResponse(
    Long battleId,
    int monsterHp,
    int monsterAtk,
    int monsterDef,

    EstadoBatalha estado,
    TurnoBatalha turnoAtual

) {
}
