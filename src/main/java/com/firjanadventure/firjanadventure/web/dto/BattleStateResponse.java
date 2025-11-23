package com.firjanadventure.firjanadventure.web.dto;

import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;

public record BattleStateResponse(
    Long battleId,
    int damage,

    EstadoBatalha estado,
    TurnoBatalha turnoAtual

) {
}
