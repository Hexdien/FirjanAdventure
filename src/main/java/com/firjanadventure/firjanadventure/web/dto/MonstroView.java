package com.firjanadventure.firjanadventure.web.dto;

public class MonstroView {
  private String tipo;
  private int hp;
  private int mp;
  private int forca;
  private int defesa;

  public String getTipo() {
    return tipo;
  }

  public void setTipo(String tipo) {
    this.tipo = tipo;
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
}
