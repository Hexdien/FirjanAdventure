package com.firjanadventure.firjanadventure.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.ItemTemplate;
import com.firjanadventure.firjanadventure.modelo.MonsterInstance;
import com.firjanadventure.firjanadventure.modelo.MonsterTemplate;
import com.firjanadventure.firjanadventure.repository.MonsterTemplateRepository;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

/**
 * Serviço responsável por gerar instâncias de monstros para batalhas.
 *
 * Este serviço opera sobre MonsterTemplate, que define os atributos base
 * de cada espécie de monstro. O objetivo é transformar um template imutável
 * + level fornecido pelo front-end em uma instância completa (MonsterInstance)
 * pronta para participar de uma batalha.
 *
 * Regras importantes:
 * - MonsterTemplate é o modelo base (HP/ATK/DEF/itens).
 * - MonsterInstance é o monstro concreto da batalha, com HP atual, level,
 * lista de drops e demais estatísticas derivadas.
 */

@Service
public class MonsterFactoryService {

  /**
   * Repositório contendo os templates estáticos dos monstros.
   * Cada MonsterTemplate representa o "DNA" de um tipo de monstro.
   *
   * Só existe um template por tipo, e ele não muda durante o jogo.
   */

  private final MonsterTemplateRepository repoM;

  public MonsterFactoryService(MonsterTemplateRepository repoM) {
    this.repoM = repoM;
  }

  /**
   * Gera os atributos finais de um monstro a partir do template e do level.
   *
   * Escalonamento:
   * - HP cresce 10 por level
   * - ATK cresce 3 por level
   * - DEF cresce 2 por level
   * - XP drop cresce 2 por level
   *
   * Esses valores de progressão fazem parte do balanceamento básico do jogo.
   * Se no futuro você ajustar a curva de dificuldade, será aqui.
   *
   * @param template  template base do monstro (imutável)
   * @param level     nível do monstro que será instanciado
   * @param monsterId identificador único opcional (pode ser usado para tracking)
   */

  public MonsterInstance escalarMonstro(MonsterTemplate template, int level, Long monsterId) {

    // Cálculos de atributos finais com base no crescimento por level
    int hpMax = template.getBaseHp() + (level * 10);
    int atkFinal = template.getBaseAtk() + (level * 3);
    int defFinal = template.getBaseDef() + (level * 2);
    int xpDropFinal = template.getBaseXpDrop() + (level * 2);

    // Extração apenas dos IDs dos itens possíveis de drop
    List<Long> itemDrop = template.getItemDrop()
        .stream()
        .map(ItemTemplate::getId)
        .toList();

    // Cria a instância concreta do monstro gerado
    return MonsterInstance.criar(
        template.getTemplateId(),
        monsterId,
        level,
        hpMax,
        atkFinal,
        defFinal,
        itemDrop,
        xpDropFinal);

  }

  /**
   * Gera um monstro completo para spawn no mapa ou batalha.
   *
   * Fluxo:
   * 1. Busca o template pelo tipo solicitado.
   * 2. Caso não exista, o front enviou um tipo inválido → exceção.
   * 3. Aplica o escalonamento com base no level informado.
   *
   * Observação:
   * - MonsterSpawnRequest define o tipo e level do monstro escolhido pelo front.
   * - O ID (monsterId) é repassado para rastreamento, se necessário.
   */

  public MonsterInstance gerarMonstro(MonsterSpawnRequest req) {

    // Busca e valida o template de espécie
    MonsterTemplate template = repoM.findByTemplateId(req.tipo())
        .orElseThrow(() -> new RuntimeException("Template não existe!"));

    // Cria o monstro escalado a partir do level e template
    return escalarMonstro(template, req.level(), req.monsterId());

  }

}
