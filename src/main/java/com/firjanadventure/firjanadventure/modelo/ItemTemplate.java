package com.firjanadventure.firjanadventure.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class ItemTemplate {
  @Id
  @GeneratedValue
  private Long id;
  private String nome;
  private String tipo;

  private String slot;

  // Getter setter constructor
  public ItemTemplate(String nome) {
    this.nome = nome;
  }

  public ItemTemplate() {
  }

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

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
  }

  public String getSlot() {
    return slot;
  }

  public void setSlot(String slot) {
    this.slot = slot;
  }

}
