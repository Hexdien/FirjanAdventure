package com.firjanadventure.firjanadventure.web.dto;

import java.util.List;

import com.firjanadventure.firjanadventure.modelo.ItemTemplate;

public class MonsterInstance {

  private Long id;
  private String tipo; // Id do tample que tambem serve de nome ex:Minotauro
  private int level;

  private int hpFinal;
  private int hpAtual;
  private int atkFinal;
  private int defFinal;

  private List<ItemTemplate> itemDrops;

  // Getter Setter e construtor
  public MonsterInstance(Long id, String tipo, int level, int hpFinal, int hpAtual, int atkFinal, int defFinal,
      List<ItemTemplate> itemDrops) {
    this.id = id;
    this.tipo = tipo;
    this.level = level;
    this.hpFinal = hpFinal;
    this.hpAtual = hpAtual;
    this.atkFinal = atkFinal;
    this.defFinal = defFinal;
    this.itemDrops = itemDrops;
  }

  public void receberDano(int dano) {
    this.hpAtual -= dano;
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

  public int getHpFinal() {
    return hpFinal;
  }

  public void setHpFinal(int hpFinal) {
    this.hpFinal = hpFinal;
  }

  public int getHpAtual() {
    return hpAtual;
  }

  public void setHpAtual(int hpAtual) {
    this.hpAtual = hpAtual;
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
