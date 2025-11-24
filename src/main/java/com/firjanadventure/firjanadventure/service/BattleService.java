package com.firjanadventure.firjanadventure.service;

import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.domain.util.JacksonUtils;
import com.firjanadventure.firjanadventure.modelo.BattleContext;
//import com.firjanadventure.firjanadventure.modelo.DefeatedMonsters;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.modelo.enums.BattleIdGenerator;
import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;
import com.firjanadventure.firjanadventure.repository.BattleContextRepository;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.BattleAttackReq;
import com.firjanadventure.firjanadventure.web.dto.BattleStateResponse;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;
import com.firjanadventure.firjanadventure.web.dto.MonstroBattleContextDTO;
import com.firjanadventure.firjanadventure.web.dto.PersonagemBattleContextDTO;

import jakarta.transaction.Transactional;

@Service
public class BattleService {

  private MonsterFactoryService monsterService;
  private PersonagemRepository personRepo;
  private BattleContextRepository battleRepo;
  private BattleIdGenerator idGen;

  public BattleService(MonsterFactoryService monsterService,
      PersonagemRepository personRepo, BattleContextRepository battleRepo, BattleIdGenerator idGen) {
    this.monsterService = monsterService;
    this.personRepo = personRepo;
    this.battleRepo = battleRepo;
    this.idGen = idGen;
  }

  // Retornar monstro atual na memoria do contexto de batalha
  public MonstroBattleContextDTO buscarMonstroCTX(Long battleId) {
    BattleContext b = battleRepo.get(battleId);

    System.out.println("======================================");
    System.out.println("Monstro buscado");
    System.out.println("======================================");
    MonsterInstance m = b.getMonster();

    return new MonstroBattleContextDTO(m.getHp(), m.getHpMax());
  }

  // Retornar personagem atual na memoria do contexto de batalha
  public PersonagemBattleContextDTO buscarPersonagemCTX(Long battleId) {
    BattleContext b = battleRepo.get(battleId);

    System.out.println("======================================");
    System.out.println("Player buscado");
    System.out.println("======================================");
    Personagem p = b.getPersonagem();

    return new PersonagemBattleContextDTO(
        JacksonUtils.fromJson(p.getAtributosJson()));
  }

  public BattleStateResponse iniciarBatalha(MonsterSpawnRequest req) {
    Personagem p = personRepo.findById(req.personagemId())
        .orElseThrow(() -> new RuntimeException("Personagem não encontrado ID:" + req.personagemId()));

    MonsterInstance m = monsterService.gerarMonstro(req);

    BattleContext ctx = new BattleContext(p, m);

    Long id = idGen.nextId();

    ctx.setBattleId(id);
    ctx.setPersonagem(p);
    ctx.setMonster(m);
    ctx.setEstado(EstadoBatalha.EM_ANDAMENTO);
    ctx.setTurnoAtual(TurnoBatalha.PLAYER);

    battleRepo.save(ctx.getBattleId(), ctx);

    return new BattleStateResponse(
        ctx.getBattleId(),
        ctx.getDamage(),
        ctx.getEstado(),
        ctx.getTurnoAtual()

    );

  }

  /*
   * public BattleStateResponse verificarBatalha(Long battleId) {
   * Batalha b = batalhaRepo.findById(battleId)
   * .orElseThrow(() -> new RuntimeException("ID da batalha não existe!"));
   * 
   * return new BattleStateResponse(
   * b.getId(),
   * b.getMonstroHp(),
   * b.getMonstroHpMax(),
   * b.getDamage(),
   * b.getEstado(),
   * b.getTurnoAtual());
   * 
   * }
   */

  @Transactional
  public BattleStateResponse processarBatalha(Long battleId, BattleAttackReq req) {
    BattleContext ctx = battleRepo.get(battleId);
    Personagem p = ctx.getPersonagem();
    MonsterInstance m = ctx.getMonster();

    validarEstado(ctx);
    if (isTurnoDoPlayer(ctx)) {
      return processarTurnoDoPlayer(p, m, req, ctx);
    }

    return processarTurnoDoMonstro(p, m, ctx);

  }

  public static int calcularDano(int ataque, int defesa, String tipoAtaque) {
    int danoBase = ataque - defesa;
    if (danoBase <= 0) {
      danoBase = 0;
    }
    int calcRand = ThreadLocalRandom.current().nextInt(0, ataque);
    if ("MAGIA".equals(tipoAtaque)) {
      danoBase += 15;
    }
    return danoBase + calcRand;

  }

  private boolean isPlayerDerrotado(Personagem p) {
    int hp = p.getAtributo("hp");
    System.out.println("======================================");
    System.out.println("HP do player em isPlayerDerrotado > " + hp);
    System.out.println("======================================");
    return hp <= 0;
  }

  private boolean isMonstroDerrotado(MonsterInstance m) {
    int hp = m.getHp();
    System.out.println("======================================");
    System.out.println("HP do monstro em isMonstroDerrotado > " + hp);
    System.out.println("======================================");
    return hp <= 0;
  }

  private boolean isTurnoDoPlayer(BattleContext b) {
    TurnoBatalha turno = b.getTurnoAtual();
    return TurnoBatalha.PLAYER.equals(turno);
  }

  private BattleStateResponse processarTurnoDoPlayer(Personagem p, MonsterInstance m, BattleAttackReq req,
      BattleContext ctx) {

    System.out.println("======================================");
    System.out.println("Processando turno do player");
    int danoFinal = calcularDano( // Se for fisico, devolve um valor, se for magico, devolve outro valor

        p.getAtributo("forca"),
        m.getDefFinal(),
        req.tipoAtaque());

    ctx.setDamage(danoFinal);

    m.receberDano(danoFinal);

    ctx.setEstado(EstadoBatalha.EM_ANDAMENTO);
    ctx.setTurnoAtual(TurnoBatalha.MONSTER);

    System.out.println("Turno do player processado");
    System.out.println("Vida do monstro " + m.getHp());
    System.out.println("Estado da batalha " + ctx.getEstado());
    System.out.println("======================================");

    if (isMonstroDerrotado(m)) {
      System.out.println("======================================");
      System.out.println("isMonstroDerrotado = Sim");
      System.out.println("======================================");
      return finalizarVitoria(p, m, ctx);
    }

    // personRepo.save(p);
    // batalhaRepo.save(b);
    return new BattleStateResponse(
        ctx.getBattleId(),
        ctx.getDamage(),
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.MONSTER);
  }

  private BattleStateResponse processarTurnoDoMonstro(Personagem p, MonsterInstance m, BattleContext ctx) {

    System.out.println("======================================");
    System.out.println("Processando turno do monstro");
    int danoFinal = calcularDano(
        m.getAtkFinal(),
        p.getAtributo("defesa"),
        "FISICO");

    ctx.setDamage(danoFinal);

    p.receberDano(danoFinal);

    ctx.setEstado(EstadoBatalha.EM_ANDAMENTO);
    ctx.setTurnoAtual(TurnoBatalha.PLAYER);

    if (isPlayerDerrotado(p)) {
      System.out.println("======================================");
      System.out.println("isPlayerDerrotado = Sim");
      System.out.println("======================================");
      return finalizarDerrota(ctx);
    }

    System.out.println("Turno do monstro processado");
    System.out.println("Vida do player " + p.getAtributo("hp"));
    System.out.println("Estado da batalha " + ctx.getEstado());
    System.out.println("======================================");
    // batalhaRepo.save(b);
    return new BattleStateResponse(
        ctx.getBattleId(),
        ctx.getDamage(),
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.PLAYER);
  }

  private BattleStateResponse finalizarDerrota(BattleContext b) {
    b.setEstado(EstadoBatalha.FINALIZADA);

    EstadoBatalha estado = EstadoBatalha.DERROTA;
    TurnoBatalha turnoAtual = TurnoBatalha.FIM;

    personRepo.save(b.getPersonagem());
    battleRepo.remove(b.getBattleId());

    return new BattleStateResponse(
        b.getBattleId(),
        b.getDamage(),
        estado,
        turnoAtual);
  }

  private BattleStateResponse finalizarVitoria(Personagem p, MonsterInstance m, BattleContext ctx) {
    System.out.println("======================================");
    System.out.println("XP atual do personagem no contexto> " + ctx.getPersonagem().getAtributo("xp"));
    System.out.println("Estado da batalha " + ctx.getEstado());
    p.ganharXp(m.getXpDrop());

    // Adicionando monstros derrotados

    p.getDefeatedMonsters().add(m.getId());

    ctx.setEstado(EstadoBatalha.FINALIZADA);
    EstadoBatalha estado = EstadoBatalha.VITORIA;
    TurnoBatalha turnoAtual = TurnoBatalha.FIM;
    System.out.println("Estado da batalha " + ctx.getEstado());

    System.out.println("======================================");
    personRepo.save(p);
    return new BattleStateResponse(
        ctx.getBattleId(),
        0,
        estado,
        turnoAtual);
  }

  private void validarEstado(BattleContext b) {
    EstadoBatalha[] s = { EstadoBatalha.DERROTA, EstadoBatalha.FINALIZADA, EstadoBatalha.VITORIA };
    if (Arrays.asList(s).contains(b.getEstado())) {
      throw new IllegalStateException("Batalha ja foi finalizada");
    }

  }

}
