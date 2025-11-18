package com.firjanadventure.firjanadventure.service;

import java.util.concurrent.ThreadLocalRandom;

import org.springframework.stereotype.Service;

import com.firjanadventure.firjanadventure.modelo.Batalha;
import com.firjanadventure.firjanadventure.modelo.Personagem;
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

  public BattleStateResponse iniciarBatalha(MonsterSpawnRequest req, Long personagemId) {
    Personagem personagem = personRepo.findById(personagemId)
        .orElseThrow(() -> new RuntimeException("Personagem não encontrado ID:" + personagemId));

    MonsterInstance monsterInstance = monsterService.gerarMonstro(req);

    Batalha batalha = new Batalha(
        personagem,
        monsterInstance.getId(),
        monsterInstance.getTipo(),
        monsterInstance.getLevel(),
        monsterInstance.getHpAtual(),
        monsterInstance.getHpFinal(),
        monsterInstance.getAtkFinal(),
        monsterInstance.getDefFinal(),
        "INICIADA",
        "PLAYER");

    String estado = batalha.getEstado();
    String turnoAtual = batalha.getTurnoAtual();
    batalhaRepo.save(batalha);

    return new BattleStateResponse(
        batalha.getId(),
        batalha.getMonstroHpAtual(),
        batalha.getMonstroAtk(),
        batalha.getMonstroDef(),
        estado,
        turnoAtual

    );

  }

  public BattleStateResponse processarBatalha(Long battleId, BattleAttackReq req) {
    Batalha batalha = batalhaRepo.findById(battleId)
        .orElseThrow(() -> new RuntimeException("ID da batalha não existe!"));
    Personagem personagem = personRepo.findById(req.personagemId())
        .orElseThrow(() -> new RuntimeException("ID do personagem não existe!"));

    if (batalha.getEstado() == "FINALIZADA") {
      new RuntimeException("Batalha ja foi finalizada!");
    }

    // batalha.setEstado("EM_ANDAMENTO");

    if (batalha.getTurnoAtual() == "PLAYER") {
      if (req.acao() == "ATACAR") {
        int danoFinal = calcularDano(personagem.getAtributo("forca"), batalha.getMonstroDef(), req.tipoAtaque());
        int hpFinal = batalha.getMonstroHpAtual() - danoFinal;
        String estado = "EM_ANDAMENTO";
        String turnoAtual = "MONSTER";
        return new BattleStateResponse(battleId,
            hpFinal,
            batalha.getMonstroAtk(),
            batalha.getMonstroDef(),
            estado, turnoAtual) btlResp;
      }
    } else {
      int danoFinal = calcularDano(batalha.getMonstroAtk(), personagem.getAtributo("defesa"), "FISICO");
      personagem.setAtributo("hp", personagem.getAtributo("hp") - danoFinal);
      String turnoAtual = "PLAYER";
return new BattleStateResponse(battleId,
            hpFinal,
            batalha.getMonstroAtk(),
            batalha.getMonstroDef(),
            estado, turnoAtual) btlResp;


    }
return btlResp;
  


  }

  public static int calcularDano(int ataque, int defesa, String tipoAtaque) {
    int danoBase = ataque - defesa;
    int calcRand = ThreadLocalRandom.current().nextInt(0, ataque);
    if ("MAGIA".equals(tipoAtaque)) {
      danoBase += 15;
    }
    return danoBase + calcRand;

  }

}
