package com.firjanadventure.firjanadventure.repository;

import com.firjanadventure.firjanadventure.modelo.Personagem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonagemRepository extends JpaRepository<Personagem, Long> {

  // Quando precisar “findFirst()” você pode adicionar:
  // Optional<Personagem> findTopByOrderByIdAsc();
}
