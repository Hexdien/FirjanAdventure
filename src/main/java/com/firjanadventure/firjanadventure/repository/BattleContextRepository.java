package com.firjanadventure.firjanadventure.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.firjanadventure.firjanadventure.modelo.BattleContext;

public interface BattleContextRepository extends JpaRepository<BattleContext, Long> {
}
