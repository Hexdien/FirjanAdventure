package com.firjanadventure.firjanadventure.modelo;

import java.util.List;

import jakarta.persistence.ElementCollection;
import jakarta.persistence.Embeddable;

/**
 * Representa uma instância concreta de um monstro dentro de uma batalha.
 *
 * Importante:
 * - Diferente de MonsterTemplate (que é estático, global e imutável),
 * MonsterInstance representa o monstro *vivo* daquela batalha específica.
 *
 * - É um @Embeddable porque não merece uma tabela própria — ele existe
 * somente no contexto da BattleContext.
 *
 * - Contém atributos finais já escalonados (hp, atk, def, xpDrop etc.)
 * e também o HP atual, que muda durante a batalha.
 *
 * Invariantes:
 * - hp nunca pode ser < 0
 * - hpMax nunca muda após a criação
 * - templateId identifica a “espécie” do monstro
 */
@Embeddable
public class MonsterInstance {

  /**
   * Identificador do template do monstro.
   * Também funciona como nome da espécie (ex: "Minotauro").
   *
   * Observação:
   * Não confundir com o ID da instância — BattleContext é quem possui o ID.
   */
  private String templateId;

  /**
   * Identificado do id de um monstro especifico posicionado no mapa do tiled.
   * É oque referenciar exatamente a posição de um monstro no mapa.
   * Serve para armazenar quais monstros ja derrotamos para não respawnar
   * quando carregar novamente o map.
   */
  private Long tiledId;

  /** Level final usado para escalonar os atributos. */
  private int level;

  /** HP máximo da instância já calculado após o escalonamento. */
  private int hpMax;

  /** HP atual do monstro durante a batalha. */
  private int hp;

  /** Ataque final resultante do escalonamento do template. */
  private int atkFinal;

  /** Defesa final resultante do escalonamento do template. */
  private int defFinal;

  /** XP total que o monstro irá conceder ao morrer. */
  private int xpDropFinal;

  /**
   * Lista de IDs dos itens possíveis de dropar ao morrer.
   * É ElementCollection porque não existe entidade Item aqui, apenas IDs.
   */
  @ElementCollection
  private List<Long> itemDrops;

  /** Construtor padrão exigido pelo JPA. */
  public MonsterInstance() {
  }

  /**
   * Factory estática para criação de uma instância consistente.
   *
   * Justificativa:
   * - Garante criação em estado válido.
   * - Centraliza invariantes (ex: hp sempre começa com hpMax).
   * - Impede objetos parcialmente construídos.
   */
  public static MonsterInstance criar(
      String templateId,
      Long tiledId,
      int level,
      int hpMax,
      int atkFinal,
      int defFinal,
      List<Long> drops,
      int xpDropFinal) {
    MonsterInstance m = new MonsterInstance();
    m.templateId = templateId;
    m.tiledId = tiledId;
    m.level = level;
    m.hpMax = hpMax;
    m.hp = hpMax; // HP atual sempre inicia cheio
    m.atkFinal = atkFinal;
    m.defFinal = defFinal;
    m.itemDrops = drops;
    m.xpDropFinal = xpDropFinal;
    return m;
  }

  /**
   * Aplica dano ao monstro garantindo que o HP nunca fique negativo.
   * 
   * Regras:
   * - dano <= 0 é ignorado (não há dano zero ou negativo).
   * - HP nunca pode ir abaixo de zero.
   *
   * Este método representa a “alteração de estado da entidade”
   * durante a batalha — toda mudança no HP deve passar por aqui.
   */
  public void receberDano(int dano) {
    if (dano <= 0)
      return;

    this.hp = Math.max(0, this.hp - dano);
  }

  public String gettemplateId() {
    return templateId;
  }

  public void settemplateId(String templateId) {
    this.templateId = templateId;
  }

  public int getLevel() {
    return level;
  }

  public void setLevel(int level) {
    this.level = level;
  }

  public int getHpMax() {
    return hpMax;
  }

  public void setHpFinal(int hpMax) {
    this.hpMax = hpMax;
  }

  public int getHp() {
    return hp;
  }

  public void setHp(int hp) {
    this.hp = hp;
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

  public List<Long> getItemDrops() {
    return itemDrops;
  }

  public void setItemDrops(List<Long> itemDrops) {
    this.itemDrops = itemDrops;
  }

  public void setHpMax(int hpMax) {
    this.hpMax = hpMax;
  }

  public int getXpDropFinal() {
    return xpDropFinal;
  }

  public void setXpDropFinal(int xpDropFinal) {
    this.xpDropFinal = xpDropFinal;
  }

  public String getTemplateId() {
    return templateId;
  }

  public void setTemplateId(String templateId) {
    this.templateId = templateId;
  }

  public Long getTiledId() {
    return tiledId;
  }

  public void setTiledId(Long tiledId) {
    this.tiledId = tiledId;
  }

}
