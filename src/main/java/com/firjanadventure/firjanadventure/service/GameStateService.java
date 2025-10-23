// src/main/java/service/GameStateService.java
package com.firjanadventure.firjanadventure.service;

import com.firjanadventure.firjanadventure.dao.PersonagemDAO;
import com.firjanadventure.firjanadventure.modelo.Personagem;

import java.util.Random;

public class GameStateService {
    private final PersonagemDAO personagemDAO;
    private final Random rng = new Random();

    private Personagem atual;

    public GameStateService(PersonagemDAO personagemDAO) {
        this.personagemDAO = personagemDAO;
        this.atual = personagemDAO.findFirst().orElseGet(() -> criarPadrao());
        if (this.atual.getId() == null) {
            personagemDAO.save(this.atual);
        }
    }

    private Personagem criarPadrao() {
        Personagem p = new Personagem();
        p.setNome("Aventurier");
        p.setSexo("M");
        p.setLevel(1);
        p.setHp(100);
        p.setMp(50);
        p.setForca(10);
        p.setDefesa(2);
        p.setXp(0);
        p.setPosX(0);
        p.setPosY(0);
        return p;
    }

    public Personagem getAtual() { return atual; }

    public void mover(char direcao) {
        switch (Character.toUpperCase(direcao)) {
            case 'W' -> atual.setPosY(atual.getPosY() - 1);
            case 'S' -> atual.setPosY(atual.getPosY() + 1);
            case 'A' -> atual.setPosX(atual.getPosX() - 1);
            case 'D' -> atual.setPosX(atual.getPosX() + 1);
            default -> { /* ignorar */ }
        }
        // autosave após ação
        personagemDAO.update(atual);
    }

    public boolean rolaEncontroMonstro() {
        // 30% de chance
        return rng.nextInt(100) < 30;
    }

    public boolean rolaBau() {
        // 10% de chance
        return rng.nextInt(100) < 10;
    }

    public void ganhoExp(int qtd) {
        atual.setXp(atual.getXp() + qtd);
        // subir nível simples (exemplo)
        while (atual.getXp() >= expNecessariaProximoNivel(atual.getLevel())) {
            atual.setLevel(atual.getLevel() + 1);
            atual.setHp(atual.getHp() + 20);
            atual.setForca(atual.getForca() + 5);
        }
        personagemDAO.update(atual);
    }

    private int expNecessariaProximoNivel(int level) {
        return level * 100; // regra simples
    }

    public void salvarAgora() {
        personagemDAO.update(atual);
    }
}