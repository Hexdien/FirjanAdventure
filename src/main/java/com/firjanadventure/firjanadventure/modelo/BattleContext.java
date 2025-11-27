package com.firjanadventure.firjanadventure.modelo;

import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;

import jakarta.persistence.Embedded;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;

/**
 * Representa o estado completo de uma batalha entre um Personagem e um monstro.
 *
 * Esta entidade persiste o progresso da batalha, permitindo que o processo
 * continue mesmo após múltiplas requisições do front-end.
 *
 * Ciclo de vida típico:
 * - Criada ao iniciar uma batalha
 * - Atualizada a cada turno
 * - Marcada como (VITORIA/DERROTA) quando uma das partes atinge 0 HP.
 *
 * Invariantes importantes:
 * - Sempre existe um personagem (ManyToOne obrigatório).
 * - O monstro é uma instância única gerada para esta batalha (Embedded).
 * - estado e turnoAtual nunca devem ser nulos.
 * - ultimoDano representa o último dano aplicado nesta batalha (0 se nenhum foi
 * aplicado).
 */

@Entity
public class BattleContext {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long battleId;

  /**
   * Personagem envolvido na batalha.
   *
   * ManyToOne porque um personagem pode participar de várias batalhas
   * (histórico), mas cada batalha pertence a exatamente um personagem.
   *
   * É LAZY para evitar carregar o personagem inteiro em operações
   * que não precisam dos detalhes completos.
   */
  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  private Personagem personagem;

  /**
   * Instância específica do monstro gerado para esta batalha.
   *
   * O uso de @Embedded significa que os atributos do monstro são
   * incorporados diretamente na tabela BattleContext, evitando
   * uma tabela separada e garantindo imutabilidade estrutural:
   * o monstro pertence exclusivamente a esta batalha.
   */

  @Embedded
  private MonsterInstance monster;

  /**
   * Armazena o último dano infligido, seja pelo jogador ou pelo monstro.
   * Usado pelo front para efeitos visuais e feedback após ações.
   */

  private int ultimoDano;

  /**
   * Estado atual da batalha:
   * - EM_ANDAMENTO
   * - VITORIA
   * - DERROTA
   *
   * Regras:
   * - Nunca deve ser nulo.
   * - Se FINALIZADA, o front não deve mais tentar executar turnos.
   */

  @Enumerated(EnumType.STRING)
  private EstadoBatalha estado;

  /**
   * Define de quem é o turno atual: PLAYER ou MONSTER.
   * Invariante:
   * - Nunca deve haver troca de turno sem que uma ação válida seja executada.
   */
  @Enumerated(EnumType.STRING)
  private TurnoBatalha turnoAtual;

  // MonsterInstance é um monstro especifico gerado apos receber do front level e
  // tipo do monstro.
  public BattleContext(Personagem personagem, MonsterInstance monster, int ultimoDano, EstadoBatalha estado,
      TurnoBatalha turnoAtual) {
    this.personagem = personagem;
    this.monster = monster;
    this.ultimoDano = ultimoDano;
    this.estado = estado;
    this.turnoAtual = turnoAtual;
  }

  protected BattleContext() {
  }

  public Long getBattleId() {
    return battleId;
  }

  public void setBattleId(Long battleId) {
    this.battleId = battleId;
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

  public int getUltimoDano() {
    return ultimoDano;
  }

  public void setUltimoDano(int ultimoDano) {
    this.ultimoDano = ultimoDano;
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
