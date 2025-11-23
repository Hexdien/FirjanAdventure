package com.firjanadventure.firjanadventure.modelo;

import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;

public class BattleContext {
  private Long battleId;

  private Personagem personagem;
  private MonsterInstance monster;

  private int monstroHp;
  private int monstroHpMax;
  private int damage;

  private EstadoBatalha estado;
  private TurnoBatalha turnoAtual;

  public BattleContext(Personagem personagem, MonsterInstance monster) {
    this.personagem = personagem;
    this.monster = monster;
  }

  public Personagem getPersonagem() {
    return personagem;
  }

  public void setPersonagem(Personagem personagem) {
    this.personagem = personagem;
  }

  public MonsterInstance getMonster() {
    return monster;
  }

  public void setMonster(MonsterInstance monster) {
    this.monster = monster;
  }

  public int getMonstroHp() {
    return monstroHp;
  }

  public void setMonstroHp(int monstroHp) {
    this.monstroHp = monstroHp;
  }

  public int getMonstroHpMax() {
    return monstroHpMax;
  }

  public void setMonstroHpMax(int monstroHpMax) {
    this.monstroHpMax = monstroHpMax;
  }

  public int getDamage() {
    return damage;
  }

  public void setDamage(int damage) {
    this.damage = damage;
  }

  public EstadoBatalha getEstado() {
    return estado;
  }

  public void setEstado(EstadoBatalha estado) {
    this.estado = estado;
  }

  public TurnoBatalha getTurnoAtual() {
    return turnoAtual;
  }

  public void setTurnoAtual(TurnoBatalha turnoAtual) {
    this.turnoAtual = turnoAtual;
  }

  public Long getBattleId() {
    return battleId;
  }

  public void setBattleId(Long battleId) {
    this.battleId = battleId;
  }

}
