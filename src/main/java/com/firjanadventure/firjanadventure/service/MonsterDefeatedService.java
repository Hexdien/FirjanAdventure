package com.firjanadventure.firjanadventure.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.firjanadventure.firjanadventure.modelo.DefeatedMonsters;
import com.firjanadventure.firjanadventure.modelo.DefeatedMonstersId;
import com.firjanadventure.firjanadventure.repository.DefeatedMonsterRepository;

@Service
public class MonsterDefeatedService {

  private final DefeatedMonsterRepository repo;

  public MonsterDefeatedService(DefeatedMonsterRepository repo) {
    this.repo = repo;
  }

  @Transactional(readOnly = true)
  public List<Long> listSpawnIds(String characterId, String mapId) {
    return repo.findSpawnIdsByCharacterAndMap(characterId, mapId);
  }

  @Transactional
  public boolean markDefeated(String characterId, String mapId, Long spawnId) {
    // idempotente: se já existe, não cria novamente
    boolean exists = repo.existsByIdCharacterIdAndIdMapIdAndIdSpawnId(characterId, mapId, spawnId);
    if (exists)
      return false;

    var id = new DefeatedMonstersId();
    id.setCharacterId(characterId);
    id.setMapId(mapId);
    id.setSpawnId(spawnId);

    var entity = new DefeatedMonsters();
    entity.setId(id);
    repo.save(entity);
    return true;
  }
}
