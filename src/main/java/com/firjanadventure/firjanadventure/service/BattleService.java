package com.firjanadventure.firjanadventure.service;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.Batalha;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.BatalhaRepository;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.BattleStateResponse;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

@Service
public class BattleService {

  private MonsterFactoryService monsterService;
  private BatalhaRepository batalhaRepo;
  private PersonagemRepository personRepo;

  public BattleService(MonsterFactoryService monsterService, BatalhaRepository batalhaRepo,
      PersonagemRepository personRepo) {
    this.monsterService = monsterService;
    this.batalhaRepo = batalhaRepo;
    this.personRepo = personRepo;
  }

  public BattleStateResponse iniciarBatalha(MonsterSpawnRequest req, Long personagemId) {
    Personagem personagem = personRepo.findById(personagemId)
        .orElseThrow(() -> new RuntimeException("Personagem não encontrado ID:" + personagemId));

    MonsterInstance monsterInstance = monsterService.gerarMonstro(req);

    Batalha batalha = new Batalha(
        personagem,
        monsterInstance.getId(),
        monsterInstance.getTipo(),
        monsterInstance.getLevel(),
        monsterInstance.getHpAtual(),
        monsterInstance.getHpFinal(),
        monsterInstance.getAtkFinal(),
        monsterInstance.getDefFinal(),
        "INICIADA",
        "PLAYER");

    String Estado = batalha.getEstado();
    String turnoAtual = batalha.getTurnoAtual();
    batalhaRepo.save(batalha);

    return new BattleStateResponse(Estado, turnoAtual);

  }

}
