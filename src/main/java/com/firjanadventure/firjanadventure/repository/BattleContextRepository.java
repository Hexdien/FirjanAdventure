package com.firjanadventure.firjanadventure.repository;

import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Component;

import com.firjanadventure.firjanadventure.modelo.BattleContext;

@Component // Singleton controlado pelo Spring
public class BattleContextRepository {

  private final ConcurrentHashMap<Long, BattleContext> store = new ConcurrentHashMap<>();

  public void save(Long battleId, BattleContext context) {
    store.put(battleId, context);
  }

  public BattleContext get(Long battleId) {
    return store.get(battleId);
  }

  public void remove(Long battleId) {
    store.remove(battleId);
  }

  public BattleContext find(Long id) {
    return store.get(id);
  }
}
