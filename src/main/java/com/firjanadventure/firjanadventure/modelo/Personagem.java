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

  // Estado minimo que vamos atualizar
  private int posX;
  private int posY;

  @Lob
  @Column(columnDefinition = "CLOB")
  private String atributosJson;

  private Instant atualizadoEm;

  // Getter e Getter

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
}
