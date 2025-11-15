package com.firjanadventure.firjanadventure.web.dto;

public record MonsterSpawnRequest(
    Long id,
    String tipo,
    int level) {
}
