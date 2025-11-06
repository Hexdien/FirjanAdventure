package com.firjanadventure.firjanadventure.modelo;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.EmbeddedId;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;

@Entity
@Table(name = "defeated_spawn")
public class DefeatedMonsters {

  @EmbeddedId
  private DefeatedMonstersId id;

  @Column(name = "defeated_at", nullable = false, updatable = false)
  private Instant defeatedAt = Instant.now();

  // Construtores, getters e setters

  public DefeatedMonstersId getId() {
    return id;
  }

  public void setId(DefeatedMonstersId id) {
    this.id = id;
  }

  public Instant getDefeatedAt() {
    return defeatedAt;
  }

  public void setDefeatedAt(Instant defeatedAt) {
    this.defeatedAt = defeatedAt;
  }

}
