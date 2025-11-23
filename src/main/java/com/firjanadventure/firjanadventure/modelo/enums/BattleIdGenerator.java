package com.firjanadventure.firjanadventure.modelo.enums;

import java.util.concurrent.atomic.AtomicLong;

import org.springframework.stereotype.Component;

@Component
public class BattleIdGenerator {

  private final AtomicLong counter = new AtomicLong(1);

  public long nextId() {
    return counter.getAndIncrement();
  }
}
