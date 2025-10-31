package com.firjanadventure.firjanadventure.web.dto;

import jakarta.validation.constraints.*;

import java.util.Map;

public class AtualizarEstadoPersonagemDTO {

  @Min(0)
  private Integer posX;

  @Min(0)
  private Integer posY;

  @NotNull
  private Map<String, Object> atributos; // força, defesa, velocidade...

  // getters e setters

  public Integer getPosX() {
    return posX;
  }

  public void setPosX(Integer posX) {
    this.posX = posX;
  }

  public Integer getPosY() {
    return posY;
  }

  public void setPosY(Integer posY) {
    this.posY = posY;
  }

  public Map<String, Object> getAtributos() {
    return atributos;
  }

  public void setAtributos(Map<String, Object> atributos) {
    this.atributos = atributos;
  }

}
