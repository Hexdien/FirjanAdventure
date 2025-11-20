package com.firjanadventure.firjanadventure.web.dto;

public record MonsterSpawnRequest(
    Long personagemId,
    Long monsterId,
    String tipo,
    int level) {
}
