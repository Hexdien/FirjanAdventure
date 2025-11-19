package com.firjanadventure.firjanadventure.modelo;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Batalha {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne
  @JoinColumn(name = "personagem_id")
  @OnDelete(action = OnDeleteAction.CASCADE)
  private Personagem personagem;

  private Long monstroId; // MANTENHA - precisa depois
  private String monstroTipo; // ADICIONE - precisa exibir
  private int monstroLevel;
  private int monstroHpAtual;
  private int monstroHpFinal;
  private int monstroAtk;
  private int monstroDef;

  private EstadoBatalha estado;
  private TurnoBatalha turnoAtual;

  public Batalha() {
  }

  public Batalha(Personagem personagem, Long monstroId, String monstroTipo, int monstroLevel,
      int monstroHpAtual,
      int monstroHpFinal, int monstroAtk, int monstroDef, EstadoBatalha estado, TurnoBatalha turnoAtual) {
    this.personagem = personagem;
    this.monstroId = monstroId;
    this.monstroTipo = monstroTipo;
    this.monstroLevel = monstroLevel;
    this.monstroHpAtual = monstroHpAtual;
    this.monstroHpFinal = monstroHpFinal;
    this.monstroAtk = monstroAtk;
    this.monstroDef = monstroDef;
    this.estado = estado;
    this.turnoAtual = turnoAtual;
  }

  public Long getId() {
    return id;
  }

  public void setId(Long id) {
    this.id = id;
  }

  public Personagem getPersonagem() {
    return personagem;
  }

  public void setPersonagem(Personagem personagem) {
    this.personagem = personagem;
  }

  public Long getMonstroId() {
    return monstroId;
  }

  public void setMonstroId(Long monstroId) {
    this.monstroId = monstroId;
  }

  public String getMonstroTipo() {
    return monstroTipo;
  }

  public void setMonstroTipo(String monstroTipo) {
    this.monstroTipo = monstroTipo;
  }

  public int getMonstroLevel() {
    return monstroLevel;
  }

  public void setMonstroLevel(int monstroLevel) {
    this.monstroLevel = monstroLevel;
  }

  public int getMonstroHpAtual() {
    return monstroHpAtual;
  }

  public void setMonstroHpAtual(int monstroHpAtual) {
    this.monstroHpAtual = monstroHpAtual;
  }

  public int getMonstroHpFinal() {
    return monstroHpFinal;
  }

  public void setMonstroHpFinal(int monstroHpFinal) {
    this.monstroHpFinal = monstroHpFinal;
  }

  public int getMonstroAtk() {
    return monstroAtk;
  }

  public void setMonstroAtk(int monstroAtk) {
    this.monstroAtk = monstroAtk;
  }

  public int getMonstroDef() {
    return monstroDef;
  }

  public void setMonstroDef(int monstroDef) {
    this.monstroDef = monstroDef;
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

}
