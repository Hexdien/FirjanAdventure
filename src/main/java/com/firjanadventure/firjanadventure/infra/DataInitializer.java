package com.firjanadventure.firjanadventure.infra;

import java.util.List;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.firjanadventure.firjanadventure.modelo.ItemTemplate;
import com.firjanadventure.firjanadventure.modelo.MonsterTemplate;
import com.firjanadventure.firjanadventure.repository.ItemTemplateRepository;
import com.firjanadventure.firjanadventure.repository.MonsterTemplateRepository;

@Component
public class DataInitializer implements CommandLineRunner {

  private final MonsterTemplateRepository monsterRepo;
  private final ItemTemplateRepository itemRepo;

  public DataInitializer(MonsterTemplateRepository monsterRepo, ItemTemplateRepository itemRepo) {
    this.monsterRepo = monsterRepo;
    this.itemRepo = itemRepo;
  }

  @Override
  public void run(String... args) {

    // Se a tabela já tiver dados, não faz nada
    if (monsterRepo.count() > 0)
      return;

    // Criando itens
    ItemTemplate chifre = new ItemTemplate("Chifre de Minotauro");
    ItemTemplate moeda = new ItemTemplate("Moeda de Bronze");

    itemRepo.save(chifre);
    itemRepo.save(moeda);

    // Criando MonsterTemplate Minotauro
    MonsterTemplate minotauro = new MonsterTemplate();
    minotauro.setTipo("MINOTAURO");
    minotauro.setBaseHp(50);
    minotauro.setBaseAtk(10);
    minotauro.setBaseDef(5);
    minotauro.setBaseXpDrop(20);

    // Associa itens
    minotauro.setItemDrop(List.of(chifre, moeda));
    minotauro.setDropRate(40); // 40%

    monsterRepo.save(minotauro);
  }

}
