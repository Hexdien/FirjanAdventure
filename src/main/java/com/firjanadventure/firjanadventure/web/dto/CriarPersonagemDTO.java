package com.firjanadventure.firjanadventure.web.dto;

import jakarta.validation.constraints.*;

public class CriarPersonagemDTO {
  @NotBlank
  private String nome;

  @NotBlank
  private String sexo;

  @Min(0)
  private int posX;

  @Min(0)
  private int posY;

  // getters e setters

  public String getNome() {
    return nome;
  }

  public void setNome(String nome) {
    this.nome = nome;
  }

  public String getSexo() {
    return sexo;
  }

  public void setSexo(String sexo) {
    this.sexo = sexo;
  }

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
}
