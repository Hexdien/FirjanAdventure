package com.firjanadventure.firjanadventure.modelo;

import java.time.Instant;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class DefeatedMonsters {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "monster_id", nullable = false)
  private Long monsterId;

  @ManyToOne(optional = false)
  @JoinColumn(name = "player_id")
  private Personagem player;

  @Column(name = "defeated_at", nullable = false, updatable = false)
  private Instant defeatedAt = Instant.now();

  // Construtores, getters e setters

  public DefeatedMonsters(Long monsterId, Personagem player) {
    this.monsterId = monsterId;
    this.player = player;
  }

  public DefeatedMonsters() {
  }

  public Instant getDefeatedAt() {
    return defeatedAt;
  }

  public void setDefeatedAt(Instant defeatedAt) {
    this.defeatedAt = defeatedAt;
  }

  public Long getId() {
    return monsterId;
  }

  public void setId(Long monsterId) {
    this.monsterId = monsterId;
  }

  public Personagem getPlayerId() {
    return player;
  }

  public void setPlayerId(Personagem player) {
    this.player = player;
  }

  public Long getMonsterId() {
    return monsterId;
  }

  public void setMonsterId(Long monsterId) {
    this.monsterId = monsterId;
  }

  public Personagem getPlayer() {
    return player;
  }

  public void setPlayer(Personagem player) {
    this.player = player;
  }

}
