package com.firjanadventure.firjanadventure.web.dto;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

public class AtualizarEstadoPersonagemDTO {

  @Min(0)
  private Integer posX;

  @Min(0)
  private Integer posY;

  @NotNull
  private Map<String, Object> atributos; // força, defesa, velocidade...

  private List<Long> defeatedMonsters = new ArrayList<>();
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

  public List<Long> getDefeatedMonsters() {
    return defeatedMonsters;
  }

  public void setDefeatedMonsters(List<Long> defeatedMonsters) {
    this.defeatedMonsters = defeatedMonsters;
  }

}
