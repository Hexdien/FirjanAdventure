package com.firjanadventure.firjanadventure.service;

import java.util.Arrays;
import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.Batalha;
import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.modelo.enums.EstadoBatalha;
import com.firjanadventure.firjanadventure.modelo.enums.TurnoBatalha;
import com.firjanadventure.firjanadventure.repository.BatalhaRepository;
import com.firjanadventure.firjanadventure.repository.PersonagemRepository;
import com.firjanadventure.firjanadventure.web.dto.BattleAttackReq;
import com.firjanadventure.firjanadventure.web.dto.BattleStateResponse;
import com.firjanadventure.firjanadventure.web.dto.MonsterInstance;
import com.firjanadventure.firjanadventure.web.dto.MonsterSpawnRequest;

@Service
public class BattleService {

  private MonsterFactoryService monsterService;
  private BatalhaRepository batalhaRepo;
  private PersonagemRepository personRepo;

  public BattleService(MonsterFactoryService monsterService, BatalhaRepository batalhaRepo,
      PersonagemRepository personRepo) {
    this.monsterService = monsterService;
    this.batalhaRepo = batalhaRepo;
    this.personRepo = personRepo;
  }

  public BattleStateResponse iniciarBatalha(MonsterSpawnRequest req) {
    Personagem personagem = personRepo.findById(req.personagemId())
        .orElseThrow(() -> new RuntimeException("Personagem não encontrado ID:" + req.personagemId()));

    MonsterInstance monsterInstance = monsterService.gerarMonstro(req);

    Batalha batalha = new Batalha(
        personagem,
        monsterInstance.getId(),
        monsterInstance.getTipo(),
        monsterInstance.getLevel(),
        monsterInstance.getHp(),
        monsterInstance.getHpMax(),
        monsterInstance.getAtkFinal(),
        monsterInstance.getDefFinal(),
        0,
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.PLAYER);

    batalhaRepo.save(batalha);

    return new BattleStateResponse(
        batalha.getId(),
        batalha.getMonstroHp(),
        batalha.getMonstroHpMax(),
        batalha.getMonstroAtk(),
        batalha.getMonstroDef(),
        batalha.getDamage(),
        batalha.getEstado(),
        batalha.getTurnoAtual()

    );

  }

  public BattleStateResponse verificarBatalha(Long battleId) {
    Batalha b = batalhaRepo.findById(battleId)
        .orElseThrow(() -> new RuntimeException("ID da batalha não existe!"));

    return new BattleStateResponse(b.getId(),
        b.getMonstroHp(),
        b.getMonstroHpMax(),
        b.getMonstroAtk(),
        b.getMonstroDef(),
        b.getDamage(),
        b.getEstado(),
        b.getTurnoAtual());

  }

  public BattleStateResponse processarBatalha(Long battleId, BattleAttackReq req) {
    Batalha batalha = batalhaRepo.findById(battleId)
        .orElseThrow(() -> new RuntimeException("ID da batalha não existe!"));
    Personagem personagem = personRepo.findById(req.personagemId())
        .orElseThrow(() -> new RuntimeException("ID do personagem não existe!"));

    validarEstado(batalha);

    if (isPlayerDerrotado(personagem)) {
      return finalizarDerrota(batalha);
    }
    if (isMonstroDerrotado(batalha)) {
      return finalizarVitoria(batalha);
    }

    if (isTurnoDoPlayer(batalha)) {
      return processarTurnoDoPlayer(personagem, batalha, req);
    }

    return processarTurnoDoMonstro(personagem, batalha);

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

  private boolean isMonstroDerrotado(Batalha b) {
    int hp = b.getMonstroHp();

    return hp <= 0;
  }

  private boolean isTurnoDoPlayer(Batalha b) {
    TurnoBatalha turno = b.getTurnoAtual();
    return TurnoBatalha.PLAYER.equals(turno);
  }

  private BattleStateResponse processarTurnoDoPlayer(Personagem p, Batalha b, BattleAttackReq req) {

    int danoFinal = calcularDano( // Se for fisico, devolve um valor, se for magico, devolve outro valor
        p.getAtributo("forca"),
        b.getMonstroDef(),
        req.tipoAtaque());
    b.setDamage(danoFinal);

    // LOGS
    System.out.println("Dano final player: " + danoFinal);

    int hpFinal = b.getMonstroHp() - danoFinal;
    b.setMonstroHp(hpFinal);

    // Definindo regra para impedir hp negativos no monster
    if (b.getMonstroHp() <= 0) {
      b.setMonstroHp(0);
    }

    System.out.println("HP final Monstro: " + hpFinal);

    b.setEstado(EstadoBatalha.EM_ANDAMENTO);
    b.setTurnoAtual(TurnoBatalha.MONSTER);

    batalhaRepo.save(b);
    return new BattleStateResponse(
        b.getId(),
        b.getMonstroHp(),
        b.getMonstroHpMax(),
        b.getMonstroAtk(),
        b.getMonstroDef(),
        b.getDamage(),
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.MONSTER);
  }

  private BattleStateResponse processarTurnoDoMonstro(Personagem p, Batalha b) {
    int danoFinal = calcularDano(
        b.getMonstroAtk(),
        p.getAtributo("defesa"),
        "FISICO");

    b.setDamage(danoFinal);

    // LOGS
    System.out.println("Dano final Monstro : " + danoFinal);

    int hpFinal = p.getAtributo("hp") - danoFinal;
    p.setAtributo("hp", hpFinal);

    // Definindo regra para impedir hp negativos no player
    if (p.getAtributo("hp") <= 0) {
      p.setAtributo("hp", 0);
    }

    System.out.println("HP final player : " + hpFinal);

    b.setEstado(EstadoBatalha.EM_ANDAMENTO);
    b.setTurnoAtual(TurnoBatalha.PLAYER);

    batalhaRepo.save(b);
    return new BattleStateResponse(
        b.getId(),
        b.getMonstroHp(),
        b.getMonstroHpMax(),
        b.getMonstroAtk(),
        b.getMonstroDef(),
        b.getDamage(),
        EstadoBatalha.EM_ANDAMENTO,
        TurnoBatalha.PLAYER);
  }

  private BattleStateResponse finalizarDerrota(Batalha b) {
    b.setEstado(EstadoBatalha.FINALIZADA);

    EstadoBatalha estado = EstadoBatalha.DERROTA;
    TurnoBatalha turnoAtual = TurnoBatalha.FIM;

    batalhaRepo.save(b);
    return new BattleStateResponse(b.getId(),
        b.getMonstroHp(),
        b.getMonstroHpMax(),
        b.getMonstroAtk(),
        b.getMonstroDef(),
        b.getDamage(),
        estado,
        turnoAtual);
  }

  private BattleStateResponse finalizarVitoria(Batalha b) {
    b.setEstado(EstadoBatalha.FINALIZADA);
    EstadoBatalha estado = EstadoBatalha.VITORIA;
    TurnoBatalha turnoAtual = TurnoBatalha.FIM;

    batalhaRepo.save(b);
    return new BattleStateResponse(b.getId(),
        b.getMonstroHp(),
        b.getMonstroHpMax(),
        b.getMonstroAtk(),
        b.getMonstroDef(),
        b.getDamage(),
        estado,
        turnoAtual);
  }

  private void validarEstado(Batalha b) {
    EstadoBatalha[] s = { EstadoBatalha.DERROTA, EstadoBatalha.FINALIZADA, EstadoBatalha.VITORIA };
    System.out.println("Print get estado:" + b.getEstado());
    if (Arrays.asList(s).contains(b.getEstado())) {
      throw new IllegalStateException("Batalha ja foi finalizada");
    }

  }

}
