package com.firjanadventure.firjanadventure.web.mapper;

import com.firjanadventure.firjanadventure.modelo.Personagem;
import com.firjanadventure.firjanadventure.modelo.Monstro;
import com.firjanadventure.firjanadventure.service.GameStateService;
import com.firjanadventure.firjanadventure.web.dto.*;

import org.springframework.stereotype.Component;

@Component
public class GameStateMapper {

    public GameStateDTO toDTO(GameStateService.EstadoJogo estado) {
        // EstadoJogo é uma sugestão de wrapper que você pode expor no service
        GameStateDTO dto = new GameStateDTO();
        dto.setEstado(estado.getFase().name()); // "EXPLORACAO" | "BATALHA"
        dto.setPersonagem(toView(estado.getPersonagem()));
        dto.setMonstro(estado.getMonstro() != null ? toView(estado.getMonstro()) : null);
        dto.setLog(estado.getLog());
        return dto;
    }

    public PersonagemView toView(Personagem p) {
        PersonagemView v = new PersonagemView();
        v.setId(p.getId());
        v.setNome(p.getNome());
        v.setHp(p.getHp());
        v.setMp(p.getMp());
        v.setLevel(p.getLevel());
        v.setExp(p.getXp());
        v.setForca(p.getForca());
        v.setDefesa(p.getArmadura()); // se usar "armadura", preencha aqui com o valor correspondente
        v.setPosX(p.getPosX());
        v.setPosY(p.getPosY());
        return v;
    }

    public MonstroView toView(Monstro m) {
        MonstroView v = new MonstroView();
        v.setTipo(m.getClass().getSimpleName()); // ou m.getTipo()
        v.setHp(m.getHp());
        v.setForca(m.getForca());
        return v;
    }
}
