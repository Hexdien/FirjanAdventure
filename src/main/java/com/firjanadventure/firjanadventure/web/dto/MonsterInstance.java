package com.firjanadventure.firjanadventure.web.dto;

import java.util.List;

import com.firjanadventure.firjanadventure.modelo.ItemTemplate;

public class MonsterInstance {

  private Long id;
  private String tipo; // Id do tample que tambem serve de nome ex:Minotauro
  private int level;

  private int hpMax;
  private int hp;
  private int atkFinal;
  private int defFinal;

  private List<ItemTemplate> itemDrops;

  // Getter Setter e construtor
  public MonsterInstance(Long id, String tipo, int level, int hpMax, int hp, int atkFinal, int defFinal,
      List<ItemTemplate> itemDrops) {
    this.id = id;
    this.tipo = tipo;
    this.level = level;
    this.hpMax = hpMax;
    this.hp = hp;
    this.atkFinal = atkFinal;
    this.defFinal = defFinal;
    this.itemDrops = itemDrops;
  }

  public void receberDano(int dano) {
    this.hp -= dano;
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

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public int getHpMax() {
    return hpMax;
  }

  public void setHpFinal(int hpMax) {
    this.hpMax = hpMax;
  }

  public int getHp() {
    return hp;
  }

  public void setHp(int hp) {
    this.hp = hp;
  }

  public int getAtkFinal() {
    return atkFinal;
  }

  public void setAtkFinal(int atkFinal) {
    this.atkFinal = atkFinal;
  }

  public int getDefFinal() {
    return defFinal;
  }

  public void setDefFinal(int defFinal) {
    this.defFinal = defFinal;
  }

  public List<ItemTemplate> getItemDrops() {
    return itemDrops;
  }

  public void setItemDrops(List<ItemTemplate> itemDrops) {
    this.itemDrops = itemDrops;
  }

}
