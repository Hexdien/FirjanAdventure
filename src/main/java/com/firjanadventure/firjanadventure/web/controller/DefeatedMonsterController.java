package com.firjanadventure.firjanadventure.web.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.service.DefeatedMonsterService;
import com.firjanadventure.firjanadventure.web.dto.DefeatedMonsterRequest;
import com.firjanadventure.firjanadventure.web.dto.DefeatedMonsterResponse;

@RestController
@RequestMapping("/api/defeated")
public class DefeatedMonsterController {

  private final DefeatedMonsterService service;

  public DefeatedMonsterController(DefeatedMonsterService service) {
    this.service = service;
  }

  @GetMapping("/{playerId}")
  public List<DefeatedMonsterResponse> getAllMonsters(@PathVariable Long playerId) {
    return service.getAllDefeatedMonsters(playerId).stream()
        .map(dm -> new DefeatedMonsterResponse(dm.getId(), dm.getMonsterId(), dm.getDefeatedAt()))
        .toList();
  }

  @PostMapping
  public ResponseEntity<?> registerDefeatedMonster(@RequestBody DefeatedMonsterRequest req) {
    service.registerDefeatedMonster(req.getPlayerId(), req.getMonsterId());
    return ResponseEntity.ok().build();
  }

}
