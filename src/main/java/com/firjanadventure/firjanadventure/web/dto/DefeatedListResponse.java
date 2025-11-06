package com.firjanadventure.firjanadventure.web.dto;

import java.util.List;

public record DefeatedListResponse(String characterId, String mapId, List<Long> spawnIds) {
}
