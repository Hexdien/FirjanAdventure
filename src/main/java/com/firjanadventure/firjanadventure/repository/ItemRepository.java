package com.firjanadventure.firjanadventure.repository;

import java.util.Optional;

import com.firjanadventure.firjanadventure.itens.Item;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ItemRepository extends JpaRepository<Item, Long> {
  Optional<Item> findByNome(String nome);
}
