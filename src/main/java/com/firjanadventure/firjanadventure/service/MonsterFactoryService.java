package com.firjanadventure.firjanadventure.service;

import org.springframework.stereotype.Service;

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

  public MonsterInstance gerarMonstro(MonsterSpawnRequest req) {

    // Busca e instancia o template
    MonsterTemplate template = repoM.findByTipo(req.tipo())
        .orElseThrow(() -> new RuntimeException("Template não existe!"));

    // Aplica escalonamento por level
    int level = req.level();

    int hpFinal = template.getBaseHp() + (level * 10);
    int hpAtual = hpFinal;
    int atkFinal = template.getBaseAtk() + (level * 3);
    int defFinal = template.getBaseDef() + (level * 2);

    MonsterInstance monster = new MonsterInstance(
        req.id(), // TODO: Lembre-se Este ID é o ID do monstro/objeto posicionado no tiled ex ID:
                  // 66
        template.getTipo(),
        level,
        hpFinal,
        hpAtual,
        atkFinal,
        defFinal,
        template.getItemDrop());
    return monster;

  }

}
