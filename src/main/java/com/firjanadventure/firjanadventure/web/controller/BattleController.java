package com.firjanadventure.firjanadventure.web.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.service.BattleService;
import com.firjanadventure.firjanadventure.web.dto.BattleStateResponse;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/batalha")
public class BattleController {

  private final BattleService service;

  public BattleController(BattleService service) {
    this.service = service;
  }

  @PostMapping("/{personagemId}")
  public ResponseEntity<BattleStateResponse> iniciarBatalha(@RequestBody MonsterSpawnRequest request,
      @PathVariable Long personagemId) {
    var instance = service.iniciarBatalha(request, personagemId);
    return ResponseEntity.ok(instance);
  }

}
