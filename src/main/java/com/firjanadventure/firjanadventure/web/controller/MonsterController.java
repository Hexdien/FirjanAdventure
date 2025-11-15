package com.firjanadventure.firjanadventure.web.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.firjanadventure.firjanadventure.service.MonsterFactoryService;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/batalha")
public class MonsterController {

  private MonsterFactoryService service;

  public MonsterController(MonsterFactoryService service) {
    this.service = service;
  }

  @PostMapping
  public ResponseEntity<MonsterInstance> gerarMonstro(@Valid @RequestBody MonsterSpawnRequest request) {
    var instance = service.gerarMonstro(request);
    return ResponseEntity.ok(instance);
  };

}
