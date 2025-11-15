package com.firjanadventure.firjanadventure.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.MonsterTemplate;
import com.firjanadventure.firjanadventure.repository.MonsterTemplateRepository;
import com.firjanadventure.firjanadventure.web.dto.ItemDTO;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

@Service
public class MonsterFactoryService {

  private final MonsterTemplateRepository repoM;

  public MonsterFactoryService(MonsterTemplateRepository repoM) {
    this.repoM = repoM;
  }

  public MonsterInstance gerarMonstro(MonsterSpawnRequest dto) {

    // Busca e instancia o template
    MonsterTemplate monsterTemplate = repoM.findById(dto.id())
        .orElseThrow(() -> new RuntimeException("Template não existe!"));

    // Convertendo DTO dos itens

    List<ItemDTO> itemDto = monsterTemplate.getItemDrop()
        .stream()
        .map(item -> new ItemDTO(
            item.getId(),
            item.getNome(),
            item.getTipo(),
            item.getQuantidade()))
        .toList();

    // Aplica escalonamento por level
    int level = dto.level();

    int hpFinal = monsterTemplate.getBaseHp() + (level * 10);
    int atkFinal = monsterTemplate.getBaseAtk() + (level * 3);
    int defFinal = monsterTemplate.getBaseDef() + (level * 2);

    // Retorna para controller

    return new MonsterInstance(
        dto.id(),
        dto.tipo(),
        level,
        hpFinal,
        atkFinal,
        defFinal,
        itemDto);
  }
}
