package com.firjanadventure.firjanadventure.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;

@Entity
public class Item {
  @Id
  @GeneratedValue
  private Long id;
  private String nome;
  private String tipo;
  private int quantidade;

  public Item() {
  }

  public Item(String nome, String tipo, int quantidade) {
    this.nome = nome;
    this.tipo = tipo;
    this.quantidade = quantidade;
  }

  // Getter e setters
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

  public int getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(int quantidade) {
    this.quantidade = quantidade;
  }

}
