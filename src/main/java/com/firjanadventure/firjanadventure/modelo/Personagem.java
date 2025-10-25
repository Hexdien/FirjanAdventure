package com.firjanadventure.firjanadventure.modelo;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "personagem")
public class Personagem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nome;
  private String sexo;

  @Column(name = "level")
  private int level;

  // Atributos do jogo (ajuste nomes/colunas conforme seu schema real):
  @Column(name = "hp")
  private int hp;

  @Column(name = "mp")
  private int mp;

  @Column(name = "forca")
  private int forca;

  @Column(name = "defesa")
  private int defesa;

  @Column(name = "xp")
  private int xp;

  @Column(name = "pos_x")
  private int posX;

  @Column(name = "pos_y")
  private int posY;

  // Timestamps (opcionais; requerem colunas se ddl-auto != update)
  @Column(name = "created_at", nullable = true)
  private Instant createdAt;

  @Column(name = "updated_at", nullable = true)
  private Instant updatedAt;

  @PrePersist
  public void onCreate() {
    Instant now = Instant.now();
    createdAt = now;
    updatedAt = now;
  }

  @PreUpdate
  public void onUpdate() {
    updatedAt = Instant.now();
  }

  // getters/setters
  // equals/hashCode somente por id (cautela com entidades JPA)

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getSexo() {
    return sexo;
  }

  public void setSexo(String sexo) {
    this.sexo = sexo;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public int getHp() {
    return hp;
  }

  public void setHp(int hp) {
    this.hp = hp;
  }

  public int getMp() {
    return mp;
  }

  public void setMp(int mp) {
    this.mp = mp;
  }

  public int getForca() {
    return forca;
  }

  public void setForca(int forca) {
    this.forca = forca;
  }

  public int getDefesa() {
    return defesa;
  }

  public void setDefesa(int defesa) {
    this.defesa = defesa;
  }

  public int getXp() {
    return xp;
  }

  public void setXp(int xp) {
    this.xp = xp;
  }

  public int getPosX() {
    return posX;
  }

  public void setPosX(int posX) {
    this.posX = posX;
  }

  public int getPosY() {
    return posY;
  }

  public void setPosY(int posY) {
    this.posY = posY;
  }

  public Instant getCreatedAt() {
    return createdAt;
  }

  public void setCreatedAt(Instant createdAt) {
    this.createdAt = createdAt;
  }

  public Instant getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(Instant updatedAt) {
    this.updatedAt = updatedAt;
  }
}
