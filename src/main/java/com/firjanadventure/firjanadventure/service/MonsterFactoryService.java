package com.firjanadventure.firjanadventure.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.ItemTemplate;
import com.firjanadventure.firjanadventure.modelo.MonsterTemplate;
import com.firjanadventure.firjanadventure.repository.MonsterTemplateRepository;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

@Service
public class MonsterFactoryService {

  private final MonsterTemplateRepository repoM;

  public MonsterFactoryService(MonsterTemplateRepository repoM) {
    this.repoM = repoM;
  }

  public MonsterInstance escalarMonstro(MonsterTemplate template, int level, Long monsterId) {

    int hpMax = template.getBaseHp() + (level * 10);
    int hp = hpMax;
    int atkFinal = template.getBaseAtk() + (level * 3);
    int defFinal = template.getBaseDef() + (level * 2);
    int xpDropFinal = template.getBaseXpDrop() + (level * 2);

    List<Long> dropIds = template.getItemDrop()
        .stream()
        .map(ItemTemplate::getId)
        .toList();

    return new MonsterInstance(
        monsterId,
        template.getTipo(),
        level,
        hpMax,
        hp,
        atkFinal,
        defFinal,
        dropIds,
        xpDropFinal);

  }

  public MonsterInstance gerarMonstro(MonsterSpawnRequest req) {

    // Busca e instancia o template
    MonsterTemplate template = repoM.findByTipo(req.tipo())
        .orElseThrow(() -> new RuntimeException("Template não existe!"));

    // Aplica escalonamento por level
    return escalarMonstro(template, req.level(), req.monsterId());

  }

  public MonsterInstance gerarMonstroPorTipo(String tipo, int level, Long monsterId) {
    MonsterTemplate template = repoM.findByTipo(tipo)
        .orElseThrow(() -> new RuntimeException("Template não existe!"));

    return escalarMonstro(template, level, monsterId);

  }

}
