package com.firjanadventure.firjanadventure.modelo;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;

@Entity
@Table(name = "personagem")
public class Personagem {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private String nome;
  private String sexo;

  // Estado minimo que vamos atualizar
  private int posX;
  private int posY;

  @Lob
  @Column(columnDefinition = "CLOB")
  private String atributosJson;

  @OneToMany(mappedBy = "personagem", cascade = CascadeType.ALL)
  private List<Item> inventario = new ArrayList<>();

  private Instant atualizadoEm;

  @OneToMany(mappedBy = "player", cascade = CascadeType.ALL)
  private List<DefeatedMonsters> defeatedMonsters;

  // Getter, Setters e Construtores

  public Long getId() {
    return id;
  }

  public Personagem(Long id) {
    this.id = id;
  }

  public Personagem() {
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

  public String getAtributosJson() {
    return atributosJson;
  }

  public void setAtributosJson(String atributosJson) {
    this.atributosJson = atributosJson;
  }

  public Instant getAtualizadoEm() {
    return atualizadoEm;
  }

  public void setAtualizadoEm(Instant atualizadoEm) {
    this.atualizadoEm = atualizadoEm;
  }

  public List<Item> getInventario() {
    return inventario;
  }

  public void setInventario(List<Item> inventario) {
    this.inventario = inventario;
  }
}
