package com.firjanadventure.firjanadventure.modelo;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Item {
  @Id
  @GeneratedValue
  private Long id;
  private int quantidade;

  @ManyToOne(optional = false)
  private ItemTemplate itemTemplate;

  @ManyToOne
  @JoinColumn(name = "personagem_id")
  private Personagem personagem;

  public Item(int quantidade, ItemTemplate itemTemplate, Personagem personagem) {
    this.quantidade = quantidade;
    this.itemTemplate = itemTemplate;
    this.personagem = personagem;
  }

  public Item() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public int getQuantidade() {
    return quantidade;
  }

  public void setQuantidade(int quantidade) {
    this.quantidade = quantidade;
  }

  public ItemTemplate getItemTemplate() {
    return itemTemplate;
  }

  public void setItemTemplate(ItemTemplate itemTemplate) {
    this.itemTemplate = itemTemplate;
  }

  public Personagem getPersonagem() {
    return personagem;
  }

  public void setPersonagem(Personagem personagem) {
    this.personagem = personagem;
  }

}
