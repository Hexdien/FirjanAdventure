package com.firjanadventure.firjanadventure.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.DefeatedMonsters;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.repository.DefeatedMonsterRepository;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;

import jakarta.persistence.EntityNotFoundException;

@Service
public class DefeatedMonsterService {

  private final DefeatedMonsterRepository repo;
  private final PersonagemRepository personagemRepo;

  public DefeatedMonsterService(DefeatedMonsterRepository repo, PersonagemRepository personagemRepository) {
    this.repo = repo;
    this.personagemRepo = personagemRepository;
  }

  public void registerDefeatedMonster(Long playerId, Long monsterId) {
    Personagem personagem = personagemRepo.findById(playerId)
        .orElseThrow(() -> new EntityNotFoundException("Player não encontrado!"));

    if (!repo.existsByPlayerAndMonsterId(personagem, monsterId)) {
      repo.save(new DefeatedMonsters(monsterId, personagem));
    }

  }

  public List<DefeatedMonsters> getAllDefeatedMonsters(Long playerId) {
    Personagem personagem = personagemRepo.findById(playerId)
        .orElseThrow(() -> new EntityNotFoundException("Player não encontrado!"));
    return repo.findAllByPlayer(personagem);
  }

}
