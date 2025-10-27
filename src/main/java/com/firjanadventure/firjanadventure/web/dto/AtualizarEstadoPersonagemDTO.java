package com.firjanadventure.firjanadventure.web.dto;

import jakarta.validation.constraints.*;

import java.util.Map;

public class AtualizarEstadoPersonagemDTO {

  @Min(0)
  private int posX;

  @Min(0)
  private int posY;

  @NotNull
  private Map<String, Object> atributos; // força, defesa, velocidade...

  // getters e setters

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

  public Map<String, Object> getAtributos() {
    return atributos;
  }

  public void setAtributos(Map<String, Object> atributos) {
    this.atributos = atributos;
  }

}
