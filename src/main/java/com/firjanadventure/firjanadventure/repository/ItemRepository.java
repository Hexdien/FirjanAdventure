package com.firjanadventure.firjanadventure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firjanadventure.firjanadventure.modelo.Item;
import java.util.List;

public interface ItemRepository extends JpaRepository<Item, Long> {

  List<Item> findByPersonagemId(Long personId);
}
