package com.firjanadventure.firjanadventure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.service.BattleService;
import com.firjanadventure.firjanadventure.web.dto.BattleAttackReq;
import com.firjanadventure.firjanadventure.web.dto.BattleStateResponse;
import com.firjanadventure.firjanadventure.web.dto.BattleViewDTO;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@RestController
@RequestMapping("/api/batalha")
public class BattleController {

  private final BattleService service;

  public BattleController(BattleService service) {
    this.service = service;
  }

  @PostMapping()
  public ResponseEntity<BattleStateResponse> iniciarBatalha(@RequestBody MonsterSpawnRequest request) {
    var instance = service.iniciarBatalha(request);
    return ResponseEntity.ok(instance);
  }

  @PostMapping("/{battleId}/atacar")
  public ResponseEntity<BattleStateResponse> processarBatalha(@PathVariable Long battleId,
      @RequestBody BattleAttackReq req) {
    var body = service.processarBatalha(battleId, req);
    return ResponseEntity.ok(body);
  }

  @GetMapping("/{battleId}")
  public ResponseEntity<BattleViewDTO> vizualizarBatalha(@PathVariable Long battleId) {
    var body = service.vizualizarBatalha(battleId);
    return ResponseEntity.ok(body);
  }
}
