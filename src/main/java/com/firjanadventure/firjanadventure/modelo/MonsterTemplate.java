package com.firjanadventure.firjanadventure.modelo;

import java.util.List;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;

@Entity
public class MonsterTemplate {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // id unico

  private Long monsterId;
  private String tipo; // Tipo do monstro ex: minotauro

  private int baseHp;
  private int baseAtk;
  private int baseDef;
  private int baseXpDrop;

  @ManyToMany
  @JoinTable(name = "monster_template_item_template", joinColumns = @JoinColumn(name = "monster_template_id"), inverseJoinColumns = @JoinColumn(name = "item_template_id"))
  private List<ItemTemplate> itemDrop;
  private int dropRate;

  // Getter setter constructor

  public MonsterTemplate() {
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
  }

  public int getBaseHp() {
    return baseHp;
  }

  public void setBaseHp(int baseHp) {
    this.baseHp = baseHp;
  }

  public int getBaseAtk() {
    return baseAtk;
  }

  public void setBaseAtk(int baseAtk) {
    this.baseAtk = baseAtk;
  }

  public int getBaseDef() {
    return baseDef;
  }

  public void setBaseDef(int baseDef) {
    this.baseDef = baseDef;
  }

  public int getBaseXpDrop() {
    return baseXpDrop;
  }

  public void setBaseXpDrop(int baseXpDrop) {
    this.baseXpDrop = baseXpDrop;
  }

  public List<ItemTemplate> getItemDrop() {
    return itemDrop;
  }

  public void setItemDrop(List<ItemTemplate> itemDrop) {
    this.itemDrop = itemDrop;
  }

  public int getDropRate() {
    return dropRate;
  }

  public void setDropRate(int dropRate) {
    this.dropRate = dropRate;
  }

  public Long getMonsterId() {
    return monsterId;
  }

  public void setMonsterId(Long monsterId) {
    this.monsterId = monsterId;
  }

}
