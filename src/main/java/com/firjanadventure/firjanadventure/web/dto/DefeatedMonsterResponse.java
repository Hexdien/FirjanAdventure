package com.firjanadventure.firjanadventure.web.dto;

import java.time.Instant;

public record DefeatedMonsterResponse(Long id, Long monsterId, Instant defeatedAt) {
}
