package com.firjanadventure.firjanadventure.repository;

import java.util.List;
import java.util.Optional;

import com.firjanadventure.firjanadventure.modelo.PersonagemItem;
import com.firjanadventure.firjanadventure.modelo.PersonagemItemId;
import com.firjanadventure.firjanadventure.modelo.enums.Slot;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PersonagemItemRepository extends JpaRepository<PersonagemItem, PersonagemItemId> {

  List<PersonagemItem> findByPersonagem_Id(Long personagemId);

  Optional<PersonagemItem> findByPersonagem_IdAndItem_Id(Long personagemId, Long itemId);

  Optional<PersonagemItem> findByPersonagem_IdAndEquipadoEm(Long personagemId, Slot slot);
}
