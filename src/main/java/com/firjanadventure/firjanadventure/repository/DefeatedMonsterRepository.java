package com.firjanadventure.firjanadventure.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firjanadventure.firjanadventure.modelo.DefeatedMonsters;
import com.firjanadventure.firjanadventure.modelo.Personagem;

public interface DefeatedMonsterRepository extends JpaRepository<DefeatedMonsters, Long> {
  boolean existsByPlayerAndMonsterId(Personagem personagem, Long monsterId);

  List<DefeatedMonsters> findAllByPlayer(Personagem personagem);
}
