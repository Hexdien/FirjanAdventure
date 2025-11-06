package com.firjanadventure.firjanadventure.modelo;

import java.io.Serializable;

import jakarta.persistence.Embeddable;

@Embeddable
public class DefeatedMonstersId implements Serializable {
  private String characterId;
  private String mapId;
  private Long spawnId;

  // Construtores, getters, setters, equals e hashCode

  public String getCharacterId() {
    return characterId;
  }

  public void setCharacterId(String characterId) {
    this.characterId = characterId;
  }

  public String getMapId() {
    return mapId;
  }

  public void setMapId(String mapId) {
    this.mapId = mapId;
  }

  public Long getSpawnId() {
    return spawnId;
  }

  public void setSpawnId(Long spawnId) {
    this.spawnId = spawnId;
  }

}
