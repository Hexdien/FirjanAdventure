package com.firjanadventure.firjanadventure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firjanadventure.firjanadventure.modelo.Item;

public interface ItemRepository extends JpaRepository<Item, Long> {
}
