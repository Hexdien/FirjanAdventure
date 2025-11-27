package com.firjanadventure.firjanadventure.service;

import java.util.Arrays;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.BattleContext;
import com.firjanadventure.firjanadventure.modelo.Item;
import com.firjanadventure.firjanadventure.modelo.ItemTemplate;
import com.firjanadventure.firjanadventure.modelo.MonsterInstance;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;
import com.firjanadventure.firjanadventure.repository.BattleContextRepository;
import com.firjanadventure.firjanadventure.repository.ItemTemplateRepository;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.BattleAttackReq;
import com.firjanadventure.firjanadventure.web.dto.BattleStateResponse;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

import jakarta.transaction.Transactional;

@Service
public class BattleService {

  private MonsterFactoryService monsterService;
  private PersonagemRepository personRepo;
  private BattleContextRepository battleRepo;
  private ItemTemplateRepository itemRepo;

  public BattleService(MonsterFactoryService monsterService,
      PersonagemRepository personRepo, BattleContextRepository battleRepo,
      ItemTemplateRepository itemRepo) {
    this.monsterService = monsterService;
    this.personRepo = personRepo;
    this.battleRepo = battleRepo;
    this.itemRepo = itemRepo;
  }

  public BattleStateResponse iniciarBatalha(MonsterSpawnRequest req) {
    Personagem p = carregarPersonagem(req.personagemId());

    MonsterInstance m = monsterService.gerarMonstro(req);

    BattleContext ctx = new BattleContext(
        p,
        m,
        0,
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.PLAYER);

    battleRepo.save(ctx);

    return new BattleStateResponse(
        ctx.getBattleId(),
        ctx.getUltimoDano(),
        ctx.getEstado(),
        ctx.getTurnoAtual()

    );

  }

  @Transactional
  public BattleStateResponse processarBatalha(Long battleId, BattleAttackReq req) {
    BattleContext ctx = battleRepo.findById(battleId)
        .orElseThrow(() -> new RuntimeException("Batalha não existe ID: " + battleId));

    Personagem p = ctx.getPersonagem();
    MonsterInstance m = ctx.getMonster();

    validarEstado(ctx);

    if (isPlayerDerrotado(p)) {
      return finalizarDerrota(p, m, ctx);
    }

    if (isMonstroDerrotado(m)) {
      return finalizarVitoria(p, m, ctx);
    }

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
    return hp <= 0;
  }

  private boolean isMonstroDerrotado(MonsterInstance m) {
    int hp = m.getHp();
    return hp <= 0;
  }

  private boolean isTurnoDoPlayer(BattleContext b) {
    TurnoBatalha turno = b.getTurnoAtual();
    return TurnoBatalha.PLAYER.equals(turno);
  }

  private BattleStateResponse processarTurnoDoPlayer(Personagem p, MonsterInstance m, BattleAttackReq req,
      BattleContext ctx) {

    int danoFinal = calcularDano( // Se for fisico, devolve um valor, se for magico, devolve outro valor

        p.getAtributo("forca"),
        m.getDefFinal(),
        req.tipoAtaque());

    ctx.setUltimoDano(danoFinal);

    m.receberDano(danoFinal);

    ctx.setTurnoAtual(TurnoBatalha.MONSTER);

    // personRepo.save(p);
    // batalhaRepo.save(b);
    return new BattleStateResponse(
        ctx.getBattleId(),
        ctx.getUltimoDano(),
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.MONSTER);
  }

  private BattleStateResponse processarTurnoDoMonstro(Personagem p, MonsterInstance m, BattleContext ctx) {

    int danoFinal = calcularDano(
        m.getAtkFinal(),
        p.getAtributo("defesa"),
        "FISICO");

    ctx.setUltimoDano(danoFinal);

    p.receberDano(danoFinal);

    ctx.setEstado(EstadoBatalha.EM_ANDAMENTO);
    ctx.setTurnoAtual(TurnoBatalha.PLAYER);

    System.out.println("Turno do monstro processado");
    System.out.println("Vida do player " + p.getAtributo("hp"));
    System.out.println("Estado da batalha " + ctx.getEstado());
    System.out.println("======================================");
    // batalhaRepo.save(b);
    return new BattleStateResponse(
        ctx.getBattleId(),
        ctx.getUltimoDano(),
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.PLAYER);
  }

  private BattleStateResponse finalizarDerrota(Personagem p, MonsterInstance m, BattleContext ctx) {

    carregarPersonagem(p.getId());
    salvarPersonagem(p, m, ctx);

    salvarBatalha(ctx);
    // Atualizando Estado de batalha

    EstadoBatalha estado = EstadoBatalha.DERROTA;
    TurnoBatalha turnoAtual = TurnoBatalha.FIM;

    return new BattleStateResponse(
        ctx.getBattleId(),
        0,
        estado,
        turnoAtual);
  }

  private BattleStateResponse finalizarVitoria(Personagem p, MonsterInstance m, BattleContext ctx) {

    carregarPersonagem(p.getId());
    aplicarRecompensasBatalha(ctx, p, m);
    salvarPersonagem(p, m, ctx);

    salvarBatalha(ctx);

    // Atualizando Estado de batalha

    EstadoBatalha estado = EstadoBatalha.VITORIA;
    TurnoBatalha turnoAtual = TurnoBatalha.FIM;

    return new BattleStateResponse(
        ctx.getBattleId(),
        0,
        estado,
        turnoAtual);
  }

  private void validarEstado(BattleContext b) {
    EstadoBatalha[] s = { EstadoBatalha.DERROTA, EstadoBatalha.VITORIA };
    if (Arrays.asList(s).contains(b.getEstado())) {
      throw new IllegalStateException("Batalha ja foi finalizada");
    }

  }

  private List<Item> itensDropados(MonsterInstance m, Personagem p) {
    return m.getItemDrops()
        .stream()
        .map(id -> {
          ItemTemplate t = itemRepo.findById(id)
              .orElseThrow(() -> new RuntimeException("Template de item não encontrado ID: " + id));

          return new Item(
              1,
              t,
              p);
        })
        .toList();

  }

  private void salvarBatalha(BattleContext ctx) {
    battleRepo.save(ctx);
  }

  private void salvarPersonagem(Personagem p, MonsterInstance m, BattleContext ctx) {
    Personagem personagem = carregarPersonagem(p.getId());
    personRepo.save(personagem);
  }

  private Personagem carregarPersonagem(Long id) {
    return personRepo.findById(id)
        .orElseThrow(() -> new RuntimeException("Personagem não econtrado ID: " + id));

  }

  private void aplicarRecompensasBatalha(BattleContext ctx, Personagem p, MonsterInstance m) {
    if (ctx.getEstado() == EstadoBatalha.VITORIA) {
      // Adiciona experiencia ao personagem persistido
      p.ganharXp(m.getXpDropFinal());

      // Adiciona o monstro que foi derrotado
      p.getDefeatedMonsters().add(m.getTiledId());

      // Adiciona itens recebidos
      List<Item> drops = itensDropados(m, p);
      for (Item drop : drops) {
        p.addItem(drop);
      }
    }
  }

}
