package com.firjanadventure.firjanadventure.web.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.service.MonsterDefeatedService;
import com.firjanadventure.firjanadventure.web.dto.DefeatedListResponse;
import com.firjanadventure.firjanadventure.web.dto.MarkDefeatedRequest;

@RestController
@RequestMapping("/api/defeated")
public class MonsterSpawnController {

  private final MonsterDefeatedService service;

  public MonsterSpawnController(MonsterDefeatedService service) {
    this.service = service;
  }

  @GetMapping
  public ResponseEntity<DefeatedListResponse> list(
      @RequestParam String characterId,
      @RequestParam String mapId) {

    var ids = service.listSpawnIds(characterId, mapId);
    return ResponseEntity.ok(new DefeatedListResponse(characterId, mapId, ids));
  }

  @PostMapping
  public ResponseEntity<Void> mark(@RequestBody MarkDefeatedRequest req) {
    if (req.characterId() == null || req.mapId() == null || req.spawnId() == null) {
      return ResponseEntity.badRequest().build();
    }

    boolean created = service.markDefeated(req.characterId(), req.mapId(), req.spawnId());
    return created ? ResponseEntity.status(HttpStatus.CREATED).build()
        : ResponseEntity.ok().build(); // idempotente
  }
}
